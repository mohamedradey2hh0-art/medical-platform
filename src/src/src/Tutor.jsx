
import React, { useState } from "react";
import {
  ArrowLeft,
  Brain,
  Send,
  BookOpen,
  Loader2,
  Image as ImageIcon,
  ExternalLink
} from "lucide-react";

function formatInline(text) {
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function isArabic(text) {
  return /[\u0600-\u06FF]/.test(text);
}

function FormattedAnswer({ text }) {
  const lines = text.split("\n");
  const elements = [];
  let listItems = [];
  let listType = null;

  function flushList() {
    if (!listItems.length) return;

    const ListTag = listType === "number" ? "ol" : "ul";

    elements.push(
      <ListTag
        key={`list-${elements.length}`}
        style={{
          paddingInlineStart: "25px",
          margin: "8px 0 14px",
          lineHeight: 1.8
        }}
      >
        {listItems.map((item, index) => (
          <li key={index} style={{ paddingInlineStart: "4px" }}>
            {formatInline(item)}
          </li>
        ))}
      </ListTag>
    );

    listItems = [];
    listType = null;
  }

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    const bullet = trimmed.match(/^[-*•]\s+(.+)/);
    const numbered = trimmed.match(/^\d+[.)]\s+(.+)/);

    if (bullet || numbered) {
      const currentType = numbered ? "number" : "bullet";

      if (listType && listType !== currentType) {
        flushList();
      }

      listType = currentType;
      listItems.push((bullet || numbered)[1]);
      return;
    }

    flushList();

    const heading = trimmed.match(/^(#{1,3})\s+(.+)/);

    if (heading) {
      const level = heading[1].length;
      const HeadingTag =
        level === 1 ? "h2" : level === 2 ? "h3" : "h4";

      elements.push(
        <HeadingTag
          key={index}
          style={{
            color: "#1e40af",
            margin: "18px 0 8px",
            fontSize: level === 1 ? "21px" : level === 2 ? "18px" : "16px",
            lineHeight: 1.5
          }}
        >
          {formatInline(heading[2])}
        </HeadingTag>
      );
      return;
    }

    const arabic = isArabic(trimmed);

    elements.push(
      <p
        key={index}
        dir={arabic ? "rtl" : "auto"}
        style={{
          margin: "7px 0 12px",
          textAlign: arabic ? "right" : "left",
          lineHeight: 1.85,
          fontSize: "15px"
        }}
      >
        {formatInline(trimmed)}
      </p>
    );
  });

  flushList();

  return <div>{elements}</div>;
}

function cleanMetadata(value) {
  if (!value) return "";
  return value.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

export default function Tutor({ onBack }) {
  const [subject, setSubject] = useState("Anatomy");
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [visualResults, setVisualResults] = useState({});

  const API_URL = "https://medmind-ai.mohamedradey2hh0.workers.dev/";

  // Search for related medical images using Wikimedia Commons
  async function loadImages(messageIndex) {
    const previousUserMessage = [...messages]
      .slice(0, messageIndex)
      .reverse()
      .find((message) => message.role === "user");

    const searchTerm = topic.trim()
      ? `${topic.trim()} medical`
      : `${previousUserMessage?.text || subject} medical illustration`;

    setVisualResults((prev) => ({
      ...prev,
      [messageIndex]: {
        loading: true,
        images: [],
        error: ""
      }
    }));

    try {
      // Step 1: Search Wikimedia Commons for image files
      const searchParams = new URLSearchParams({
        action: "query",
        list: "search",
        srsearch: searchTerm,
        srnamespace: "6",
        srlimit: "8",
        format: "json",
        origin: "*"
      });

      const searchResponse = await fetch(
        `https://commons.wikimedia.org/w/api.php?${searchParams}`
      );

      if (!searchResponse.ok) {
        throw new Error("Image search request failed.");
      }

      const searchData = await searchResponse.json();
      const results = searchData.query?.search || [];

      if (results.length === 0) {
        setVisualResults((prev) => ({
          ...prev,
          [messageIndex]: {
            loading: false,
            images: [],
            error: "No images found. Try another medical topic."
          }
        }));
        return;
      }

      // Step 2: Get image URLs and license metadata
      const pageIds = results.map((item) => item.pageid).join("|");

      const imageParams = new URLSearchParams({
        action: "query",
        pageids: pageIds,
        prop: "imageinfo",
        iiprop: "url|extmetadata",
        iiurlwidth: "600",
        format: "json",
        origin: "*"
      });

      const imageResponse = await fetch(
        `https://commons.wikimedia.org/w/api.php?${imageParams}`
      );

      if (!imageResponse.ok) {
        throw new Error("Could not retrieve image details.");
      }

      const imageData = await imageResponse.json();
      const pages = Object.values(imageData.query?.pages || {});

      const images = pages
        .filter((page) => page.imageinfo?.[0]?.thumburl)
        .map((page) => {
          const info = page.imageinfo[0];
          const metadata = info.extmetadata || {};

          return {
            title: page.title.replace("File:", ""),
            image: info.thumburl,
            source: info.descriptionurl,
            license: cleanMetadata(metadata.LicenseShortName?.value),
            artist: cleanMetadata(metadata.Artist?.value),
            credit: cleanMetadata(metadata.Credit?.value)
          };
        });

      setVisualResults((prev) => ({
        ...prev,
        [messageIndex]: {
          loading: false,
          images,
          error: images.length
            ? ""
            : "No usable image files found for this topic."
        }
      }));

    } catch (err) {
      console.error("MedMind image search error:", err);

      setVisualResults((prev) => ({
        ...prev,
        [messageIndex]: {
          loading: false,
          images: [],
          error: "Could not load images. Please try again."
        }
      }));
    }
  }

  // Send question to MedMind AI
  async function askAI(e) {
    e.preventDefault();

    if (!question.trim() || loading) return;

    const currentQuestion = question.trim();

    const conversationHistory = messages.map((message) => ({
      role: message.role,
      text: message.text
    }));

    setMessages((prev) => [
      ...prev,
      { role: "user", text: currentQuestion }
    ]);

    setQuestion("");
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          subject,
          topic,
          question: currentQuestion,
          history: conversationHistory
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.answer }
      ]);

    } catch (err) {
      setError(err.message || "Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "25px 16px",
        fontFamily: "Arial, sans-serif",
        color: "#172554"
      }}
    >
      <div style={{ maxWidth: "850px", margin: "auto" }}>

        <button
          onClick={onBack}
          style={{
            border: "none",
            background: "white",
            padding: "12px 18px",
            borderRadius: "12px",
            cursor: "pointer",
            marginBottom: "25px",
            color: "#1e3a8a"
          }}
        >
          <ArrowLeft size={17} style={{ verticalAlign: "middle" }} /> Back
        </button>

        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "18px",
            boxShadow: "0 5px 25px #00000008"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "10px"
            }}
          >
            <Brain size={32} color="#2563eb" />
            <h1 style={{ margin: 0, fontSize: "26px" }}>
              Medical AI Tutor
            </h1>
          </div>

          <p style={{ color: "#64748b", lineHeight: 1.6 }}>
            Your intelligent medical learning companion.
            Ask questions, understand concepts, and learn step by step.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px",
              marginTop: "25px"
            }}
          >
            <label>
              <span style={{ display: "block", marginBottom: "8px" }}>
                <BookOpen size={15} style={{ verticalAlign: "middle" }} /> Subject
              </span>

              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={fieldStyle}
              >
                {[
                  "Anatomy",
                  "Physiology",
                  "Biochemistry",
                  "Pathology",
                  "Pharmacology",
                  "Internal Medicine",
                  "Surgery",
                  "Pediatrics",
                  "Ophthalmology",
                  "ENT",
                  "Other"
                ].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>

            <label>
              <span style={{ display: "block", marginBottom: "8px" }}>
                Topic
              </span>

              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Heart failure"
                style={fieldStyle}
              />
            </label>
          </div>

          <div
            style={{
              marginTop: "25px",
              minHeight: "180px",
              maxHeight: "550px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "14px"
            }}
          >
            {messages.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "35px 10px",
                  color: "#64748b"
                }}
              >
                <Brain size={38} color="#93c5fd" />
                <p>What would you like to understand today?</p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  alignSelf:
                    message.role === "user" ? "flex-end" : "stretch",
                  background:
                    message.role === "user" ? "#2563eb" : "#f8fafc",
                  color:
                    message.role === "user" ? "white" : "#1e293b",
                  padding: "14px 17px",
                  borderRadius: "14px",
                  maxWidth: message.role === "user" ? "90%" : "100%",
                  border:
                    message.role === "assistant"
                      ? "1px solid #e2e8f0"
                      : "none",
                  lineHeight: 1.7,
                  overflowWrap: "anywhere"
                }}
              >
                {message.role === "assistant" ? (
                  <>
                    <FormattedAnswer text={message.text} />

                    <button
                      onClick={() => loadImages(index)}
                      disabled={visualResults[index]?.loading}
                      style={{
                        marginTop: "12px",
                        padding: "9px 13px",
                        border: "1px solid #bfdbfe",
                        borderRadius: "9px",
                        background: "#eff6ff",
                        color: "#1d4ed8",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "7px"
                      }}
                    >
                      {visualResults[index]?.loading
                        ? <Loader2 size={16} />
                        : <ImageIcon size={16} />}

                      {visualResults[index]?.loading
                        ? "Searching images..."
                        : "Show related images"}
                    </button>

                    {visualResults[index] && (
                      <div style={{ marginTop: "15px" }}>
                        {visualResults[index].error && (
                          <p style={{ color: "#64748b", fontSize: "13px" }}>
                            {visualResults[index].error}
                          </p>
                        )}

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(180px, 1fr))",
                            gap: "12px"
                          }}
                        >
                          {visualResults[index].images.map(
                            (image, imageIndex) => (
                              <div
                                key={imageIndex}
                                style={{
                                  background: "white",
                                  border: "1px solid #e2e8f0",
                                  borderRadius: "10px",
                                  overflow: "hidden"
                                }}
                              >
                                <a
                                  href={image.image}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <img
                                    src={image.image}
                                    alt={image.title}
                                    loading="lazy"
                                    style={{
                                      width: "100%",
                                      height: "155px",
                                      objectFit: "contain",
                                      background: "#f8fafc"
                                    }}
                                  />
                                </a>

                                <div style={{ padding: "9px", fontSize: "12px" }}>
                                  <strong>{image.title}</strong>

                                  {image.artist && (
                                    <p
                                      style={{
                                        margin: "5px 0",
                                        color: "#64748b"
                                      }}
                                    >
                                      Creator: {image.artist}
                                    </p>
                                  )}

                                  <p
                                    style={{
                                      margin: "5px 0",
                                      color: "#64748b"
                                    }}
                                  >
                                    License: {image.license || "Check source page"}
                                  </p>

                                  <a
                                    href={image.source}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                      color: "#2563eb",
                                      textDecoration: "none"
                                    }}
                                  >
                                    View source{" "}
                                    <ExternalLink
                                      size={12}
                                      style={{ verticalAlign: "middle" }}
                                    />
                                  </a>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ whiteSpace: "pre-wrap" }}>
                    {message.text}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div
                style={{
                  color: "#2563eb",
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <Loader2 size={18} className="animate-spin" />
                MedMind is thinking...
              </div>
            )}
          </div>

          {error && (
            <p style={{ color: "#dc2626", fontSize: "14px" }}>
              {error}
            </p>
          )}

          <form onSubmit={askAI} style={{ marginTop: "20px" }}>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask your medical question..."
              rows={4}
              style={{
                ...fieldStyle,
                resize: "vertical",
                width: "100%",
                boxSizing: "border-box"
              }}
            />

            <button
              type="submit"
              disabled={loading || !question.trim()}
              style={{
                marginTop: "12px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: "13px 22px",
                cursor: "pointer",
                opacity: loading || !question.trim() ? 0.6 : 1,
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <Send size={17} /> Ask MedMind
            </button>
          </form>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "12px",
              marginTop: "20px",
              lineHeight: 1.5
            }}
          >
            Educational use only. Always verify medical information
            and consult qualified healthcare professionals when needed.
          </p>
        </div>
      </div>
    </div>
  );
}

const fieldStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px",
  border: "1px solid #dbe3ef",
  borderRadius: "10px",
  background: "white",
  fontSize: "15px",
  outline: "none"
};
