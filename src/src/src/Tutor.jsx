import React, { useState, useRef } from "react";
import {
  ArrowLeft,
  Brain,
  Send,
  Loader2,
  Zap,
  BookOpen,
  Camera,
  Image as ImageIcon,
  X,
  MessageCircle
} from "lucide-react";

function formatInline(text) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
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

      if (listType && listType !== currentType) flushList();

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

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(String(reader.result).split(",")[1]);
    };

    reader.onerror = () => reject(new Error("Could not read the image."));
    reader.readAsDataURL(file);
  });
}

export default function Tutor({ onBack }) {
  const [depth, setDepth] = useState("quick");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [textSelection, setTextSelection] = useState(null);

  const questionStartRef = useRef(null);
  const textareaRef = useRef(null);
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Test Worker temporarily
  const API_URL =
    "https://medmind-test.mohamedradey2hh0.workers.dev/";

  function scrollToNewQuestion() {
    setTimeout(() => {
      questionStartRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 200);
  }

  // Detect selected text inside MedMind answers
  function handleTextSelection(e) {
    const selection = window.getSelection();

    if (!selection || selection.isCollapsed) {
      setTextSelection(null);
      return;
    }

    const selectedText = selection.toString().trim();

    if (!selectedText) {
      setTextSelection(null);
      return;
    }

    const selectedNode = selection.getRangeAt(0).commonAncestorContainer;

    if (!e.currentTarget.contains(selectedNode)) {
      setTextSelection(null);
      return;
    }

    const rect = selection.getRangeAt(0).getBoundingClientRect();

    if (!rect.width && !rect.height) {
      setTextSelection(null);
      return;
    }

    setTextSelection({
      text: selectedText,
      top: Math.max(8, rect.top - 48),
      left: Math.min(
        Math.max(8, rect.left + rect.width / 2 - 65),
        window.innerWidth - 140
      )
    });
  }

  // Ask about selected text
  function askAboutSelection() {
    if (!textSelection?.text) return;

    const selectedText = textSelection.text;

    setQuestion(
      `Please explain this selected part in simple terms, step by step, and relate it to the previous explanation:\n\n"${selectedText}"`
    );

    setTextSelection(null);
    window.getSelection()?.removeAllRanges();

    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 100);
  }

  function handleImageSelect(e) {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be 5 MB or less.");
      return;
    }

    if (selectedImage?.preview) {
      URL.revokeObjectURL(selectedImage.preview);
    }

    setError("");

    setSelectedImage({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    });
  }

  function removeImage() {
    if (selectedImage?.preview) {
      URL.revokeObjectURL(selectedImage.preview);
    }

    setSelectedImage(null);
  }

  // Streaming AI response
  async function askAI(e) {
    e.preventDefault();

    if ((!question.trim() && !selectedImage) || loading) return;

    const currentQuestion =
      question.trim() ||
      "Please analyze this image and explain it step by step.";

    const imageForRequest = selectedImage;

    const conversationHistory = messages.map((message) => ({
      role: message.role,
      text: message.text
    }));

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: currentQuestion,
        imagePreview: imageForRequest?.preview || null
      }
    ]);

    setQuestion("");
    setSelectedImage(null);
    setTextSelection(null);
    setLoading(true);
    setError("");
    scrollToNewQuestion();

    let assistantId = null;

    try {
      let imageData = null;
      let imageMimeType = null;

      if (imageForRequest) {
        imageData = await fileToBase64(imageForRequest.file);
        imageMimeType = imageForRequest.file.type;
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question: currentQuestion,
          depth,
          history: conversationHistory,
          imageData,
          imageMimeType
        })
      });

      if (!response.ok) {
        let errorMessage = "Something went wrong.";

        try {
          const data = await response.json();
          errorMessage = data.error || errorMessage;
        } catch {}

        throw new Error(errorMessage);
      }

      if (!response.body) {
        throw new Error("Streaming is not supported by this connection.");
      }

      assistantId = `assistant-${Date.now()}-${Math.random()}`;

      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          text: ""
        }
      ]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = "";
      let receivedText = "";

      function processFrame(frame) {
        const lines = frame.split(/\r?\n/);

        const dataLines = lines
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.slice(5).trim());

        if (!dataLines.length) return;

        const rawData = dataLines.join("\n");

        if (rawData === "[DONE]") return;

        const eventName = lines
          .find((line) => line.startsWith("event:"))
          ?.slice(6)
          .trim();

        let eventData;

        try {
          eventData = JSON.parse(rawData);
        } catch {
          return;
        }

        if (eventName === "error" || eventData.error) {
          throw new Error(
            eventData.error || "The response stream was interrupted."
          );
        }

        if (typeof eventData.text === "string") {
          receivedText += eventData.text;

          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantId
                ? { ...message, text: receivedText }
                : message
            )
          );
        }
      }

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const frames = buffer.split(/\r?\n\r?\n/);
        buffer = frames.pop() || "";

        for (const frame of frames) {
          processFrame(frame);
        }
      }

      buffer += decoder.decode();

      if (buffer.trim()) {
        processFrame(buffer);
      }

      if (!receivedText.trim()) {
        throw new Error(
          "The AI returned an empty response. Please try again."
        );
      }

    } catch (err) {
      setError(
        err.message || "Connection failed. Please try again."
      );

      if (assistantId) {
        setMessages((prev) =>
          prev.filter(
            (message) =>
              message.id !== assistantId || message.text.trim()
          )
        );
      }

    } finally {
      setLoading(false);
    }
  }

  const latestUserIndex = messages
    .map((message) => message.role)
    .lastIndexOf("user");

  return (
    <div
      onClick={(e) => {
        if (
          textSelection &&
          !e.target.closest(".ask-selection-button")
        ) {
          setTextSelection(null);
        }
      }}
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "25px 16px",
        fontFamily: "Cairo, sans-serif",
        color: "#172554"
      }}
    >
      {/* Floating Ask MedMind button */}
      {textSelection && (
        <button
          type="button"
          className="ask-selection-button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={askAboutSelection}
          style={{
            position: "fixed",
            top: textSelection.top,
            left: textSelection.left,
            zIndex: 9999,
            background: "#1d4ed8",
            color: "white",
            border: "none",
            borderRadius: "9px",
            padding: "9px 13px",
            display: "flex",
            alignItems: "center",
            gap: "7px",
            fontSize: "13px",
            fontWeight: "bold",
            boxShadow: "0 4px 15px #00000025",
            cursor: "pointer",
            whiteSpace: "nowrap"
          }}
        >
          <MessageCircle size={16} />
          Ask MedMind
        </button>
      )}

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
            Ask questions and learn in your own way.
          </p>

          {/* Explanation depth */}
          <div style={{ marginTop: "25px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "12px",
                fontWeight: "bold"
              }}
            >
              How would you like the explanation?
            </label>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "12px"
              }}
            >
              <button
                type="button"
                onClick={() => setDepth("quick")}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  border: depth === "quick"
                    ? "2px solid #2563eb"
                    : "1px solid #dbe3ef",
                  background: depth === "quick" ? "#eff6ff" : "white",
                  color: "#1e3a8a",
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontWeight: "bold"
                }}>
                  <Zap size={19} color="#2563eb" />
                  Quick Answer
                </div>

                <div style={{
                  marginTop: "7px",
                  fontSize: "13px",
                  color: "#64748b"
                }}>
                  Short, direct answers with key points.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDepth("deep")}
                style={{
                  padding: "16px",
                  border: depth === "deep"
                    ? "2px solid #2563eb"
                    : "1px solid #dbe3ef",
                  borderRadius: "12px",
                  background: depth === "deep" ? "#eff6ff" : "white",
                  color: "#1e3a8a",
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontWeight: "bold"
                }}>
                  <BookOpen size={19} color="#2563eb" />
                  Deep Explanation
                </div>

                <div style={{
                  marginTop: "7px",
                  fontSize: "13px",
                  color: "#64748b"
                }}>
                  Step-by-step explanations, WHY, and clinical links.
                </div>
              </button>
            </div>
          </div>

          {/* Conversation */}
          <div
            style={{
              marginTop: "25px",
              minHeight: "180px",
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
                key={message.id || index}
                ref={index === latestUserIndex ? questionStartRef : null}
                style={{
                  alignSelf: message.role === "user" ? "flex-end" : "stretch",
                  background: message.role === "user" ? "#2563eb" : "#f8fafc",
                  color: message.role === "user" ? "white" : "#1e293b",
                  padding: "14px 17px",
                  borderRadius: "14px",
                  maxWidth: message.role === "user" ? "90%" : "100%",
                  border: message.role === "assistant"
                    ? "1px solid #e2e8f0"
                    : "none",
                  lineHeight: 1.7,
                  overflowWrap: "anywhere",
                  fontFamily: "Cairo, sans-serif"
                }}
                onMouseUp={
                  message.role === "assistant"
                    ? handleTextSelection
                    : undefined
                }
                onTouchEnd={
                  message.role === "assistant"
                    ? handleTextSelection
                    : undefined
                }
              >
                {message.imagePreview && (
                  <img
                    src={message.imagePreview}
                    alt="Uploaded question"
                    style={{
                      display: "block",
                      maxWidth: "100%",
                      maxHeight: "260px",
                      objectFit: "contain",
                      borderRadius: "10px",
                      marginBottom: "10px",
                      background: "white"
                    }}
                  />
                )}

                {message.role === "assistant" ? (
                  <>
                    <FormattedAnswer text={message.text} />

                    {loading &&
                      message.id &&
                      index === messages.length - 1 && (
                        <span
                          style={{
                            display: "inline-block",
                            width: "7px",
                            height: "17px",
                            background: "#2563eb",
                            marginInlineStart: "4px",
                            verticalAlign: "middle",
                            borderRadius: "2px",
                            animation: "medmindBlink 0.8s infinite"
                          }}
                        />
                      )}
                  </>
                ) : (
                  <div style={{ whiteSpace: "pre-wrap" }}>
                    {message.text}
                  </div>
                )}
              </div>
            ))}

            {loading && messages[messages.length - 1]?.role !== "assistant" && (
              <div
                style={{
                  color: "#2563eb",
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <Loader2 size={18} />
                MedMind is thinking...
              </div>
            )}
          </div>

          {error && (
            <p style={{ color: "#dc2626", fontSize: "14px" }}>
              {error}
            </p>
          )}

          {/* Question form */}
          <form onSubmit={askAI} style={{ marginTop: "20px" }}>
            {selectedImage && (
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  marginBottom: "12px",
                  border: "1px solid #dbe3ef",
                  borderRadius: "12px",
                  padding: "7px",
                  background: "#f8fafc"
                }}
              >
                <img
                  src={selectedImage.preview}
                  alt="Selected image preview"
                  style={{
                    display: "block",
                    maxWidth: "220px",
                    maxHeight: "180px",
                    objectFit: "contain",
                    borderRadius: "8px"
                  }}
                />

                <button
                  type="button"
                  onClick={removeImage}
                  aria-label="Remove image"
                  style={{
                    position: "absolute",
                    top: "3px",
                    right: "3px",
                    border: "none",
                    borderRadius: "50%",
                    background: "#dc2626",
                    color: "white",
                    width: "27px",
                    height: "27px",
                    cursor: "pointer",
                    display: "grid",
                    placeItems: "center"
                  }}
                >
                  <X size={16} />
                </button>

                <div style={{
                  fontSize: "12px",
                  color: "#64748b",
                  marginTop: "5px"
                }}>
                  {selectedImage.name}
                </div>
              </div>
            )}

            <textarea
              ref={textareaRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();

                  if ((question.trim() || selectedImage) && !loading) {
                    e.currentTarget.form.requestSubmit();
                  }
                }
              }}
              placeholder="Ask your medical question or explain the uploaded image..."
              rows={4}
              style={{
                ...fieldStyle,
                resize: "vertical",
                width: "100%",
                boxSizing: "border-box",
                fontFamily: "Cairo, sans-serif"
              }}
            />

            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              style={{ display: "none" }}
            />

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageSelect}
              style={{ display: "none" }}
            />

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "10px",
                marginTop: "12px"
              }}
            >
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                disabled={loading}
                style={secondaryButtonStyle}
              >
                <Camera size={18} /> Take Photo
              </button>

              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                disabled={loading}
                style={secondaryButtonStyle}
              >
                <ImageIcon size={18} /> Upload Image
              </button>

              <button
                type="submit"
                disabled={loading || (!question.trim() && !selectedImage)}
                style={{
                  marginLeft: "auto",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  padding: "13px 22px",
                  cursor: "pointer",
                  opacity: loading || (!question.trim() && !selectedImage) ? 0.6 : 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                {loading ? <Loader2 size={17} /> : <Send size={17} />}
                Ask MedMind
              </button>
            </div>
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

      <style>{`
        @keyframes medmindBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
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

const secondaryButtonStyle = {
  background: "#eff6ff",
  color: "#1e40af",
  border: "1px solid #bfdbfe",
  borderRadius: "12px",
  padding: "12px 14px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "7px"
};
