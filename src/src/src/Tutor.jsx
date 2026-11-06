
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
  MessageCircle,
  Moon,
  Sun
} from "lucide-react";

function safeHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:"
      ? parsed.href
      : null;
  } catch {
    return null;
  }
}

function formatInline(text, darkMode = false) {
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|\[[^\]]+\]\(https?:\/\/[^)\s]+\))/g;
  return text.split(pattern).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          style={{
            background: darkMode ? "#0f172a" : "#e2e8f0",
            color: darkMode ? "#bfdbfe" : "#1e40af",
            padding: "2px 5px",
            borderRadius: "5px",
            fontSize: "0.92em"
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
    if (link) {
      const href = safeHttpUrl(link[2]);
      return href ? (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: darkMode ? "#93c5fd" : "#1d4ed8", textDecoration: "underline" }}
        >
          {link[1]}
        </a>
      ) : part;
    }
    return part;
  });
}

function isArabic(text) {
  return /[\u0600-\u06FF]/.test(text);
}

function MermaidDiagram({ code, darkMode }) {
  const encoded = (() => {
    try {
      return btoa(unescape(encodeURIComponent(code)));
    } catch {
      return "";
    }
  })();

  if (!encoded) {
    return (
      <pre style={{
        overflowX: "auto",
        padding: "14px",
        borderRadius: "10px",
        background: darkMode ? "#0f172a" : "#e2e8f0",
        color: darkMode ? "#e2e8f0" : "#1e293b"
      }}>
        {code}
      </pre>
    );
  }

  return (
    <div style={{
      margin: "14px 0 18px",
      padding: "12px",
      borderRadius: "12px",
      background: darkMode ? "#ffffff" : "#ffffff",
      border: `1px solid ${darkMode ? "#475569" : "#e2e8f0"}`,
      overflow: "hidden"
    }}>
      <img
        src={`https://mermaid.ink/img/${encoded}?bgColor=FFFFFF`}
        alt="Educational medical flowchart"
        loading="lazy"
        referrerPolicy="no-referrer"
        style={{ display: "block", width: "100%", maxHeight: "520px", objectFit: "contain" }}
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
      <div style={{ color: "#64748b", fontSize: "11px", textAlign: "right", marginTop: "4px" }}>
        Educational diagram
      </div>
    </div>
  );
}

function FormattedAnswer({ text, darkMode }) {
  const lines = String(text || "").split(/\r?\n/);
  const elements = [];
  const textColor = darkMode ? "#e2e8f0" : "#1e293b";
  const headingColor = darkMode ? "#93c5fd" : "#1e40af";
  const borderColor = darkMode ? "#475569" : "#cbd5e1";
  const mutedBg = darkMode ? "#0f172a" : "#f1f5f9";

  const isTableSeparator = (line) =>
    /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);

  const tableCells = (line) =>
    line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(cell => cell.trim());

  const isBlockStart = (line) =>
    /^```/.test(line.trim()) ||
    /^#{1,3}\s+/.test(line.trim()) ||
    /^[-*•]\s+/.test(line.trim()) ||
    /^\d+[.)]\s+/.test(line.trim()) ||
    /^>\s?/.test(line.trim()) ||
    /^!\[[^\]]*\]\(https?:\/\/[^)\s]+\)\s*$/.test(line.trim()) ||
    /^(\*\s*){3,}$|^(-\s*){3,}$|^(_\s*){3,}$/.test(line.trim()) ||
    (line.includes("|") && line.trim().startsWith("|"));

  let i = 0;
  while (i < lines.length) {
    const raw = lines[i];
    const trimmed = raw.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Fenced code blocks, including Mermaid diagrams.
    if (trimmed.startsWith("```")) {
      const language = trimmed.slice(3).trim().toLowerCase();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++;
      const code = codeLines.join("\n").trim();
      if (language === "mermaid") {
        elements.push(<MermaidDiagram key={`mermaid-${i}`} code={code} darkMode={darkMode} />);
      } else {
        elements.push(
          <pre
            key={`code-${i}`}
            style={{
              whiteSpace: "pre-wrap",
              overflowX: "auto",
              padding: "14px",
              borderRadius: "10px",
              background: mutedBg,
              color: textColor,
              border: `1px solid ${borderColor}`,
              fontSize: "13px",
              lineHeight: 1.6
            }}
          >
            <code>{code}</code>
          </pre>
        );
      }
      continue;
    }

    // Markdown headings.
    const heading = trimmed.match(/^(#{1,3})\s+(.+)/);
    if (heading) {
      const level = heading[1].length;
      const HeadingTag = level === 1 ? "h2" : level === 2 ? "h3" : "h4";
      elements.push(
        <HeadingTag
          key={`heading-${i}`}
          dir={isArabic(heading[2]) ? "rtl" : "auto"}
          style={{
            color: headingColor,
            margin: level === 1 ? "22px 0 10px" : "17px 0 8px",
            fontSize: level === 1 ? "21px" : level === 2 ? "18px" : "16px",
            lineHeight: 1.5
          }}
        >
          {formatInline(heading[2], darkMode)}
        </HeadingTag>
      );
      i++;
      continue;
    }

    // Horizontal divider.
    if (/^(\*\s*){3,}$|^(-\s*){3,}$|^(_\s*){3,}$/.test(trimmed)) {
      elements.push(
        <hr key={`hr-${i}`} style={{ border: 0, borderTop: `1px solid ${borderColor}`, margin: "18px 0" }} />
      );
      i++;
      continue;
    }

    // Standalone educational image.
    const imageMatch = trimmed.match(/^!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)$/);
    if (imageMatch) {
      const imageUrl = safeHttpUrl(imageMatch[2]);
      if (imageUrl) {
        elements.push(
          <figure
            key={`image-${i}`}
            style={{
              margin: "14px 0 18px",
              padding: "10px",
              borderRadius: "12px",
              background: darkMode ? "#0f172a" : "#ffffff",
              border: `1px solid ${borderColor}`
            }}
          >
            <img
              src={imageUrl}
              alt={imageMatch[1] || "Medical educational illustration"}
              loading="lazy"
              referrerPolicy="no-referrer"
              style={{
                display: "block",
                width: "100%",
                maxHeight: "430px",
                objectFit: "contain",
                borderRadius: "8px",
                background: "#ffffff"
              }}
            />
            {imageMatch[1] && (
              <figcaption style={{ color: textColor, fontSize: "13px", marginTop: "8px", textAlign: "center" }}>
                {imageMatch[1]}
              </figcaption>
            )}
          </figure>
        );
      }
      i++;
      continue;
    }

    // Markdown tables.
    if (trimmed.includes("|") && (trimmed.startsWith("|") || (i + 1 < lines.length && isTableSeparator(lines[i + 1])))) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().includes("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }
      const rows = tableLines.filter(line => !isTableSeparator(line)).map(tableCells);
      if (rows.length) {
        const headers = rows[0];
        elements.push(
          <div key={`table-${i}`} style={{ overflowX: "auto", margin: "12px 0 18px", border: `1px solid ${borderColor}`, borderRadius: "10px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", color: textColor, fontSize: "13px", minWidth: "360px" }}>
              <thead>
                <tr style={{ background: mutedBg }}>
                  {headers.map((cell, index) => (
                    <th key={index} style={{ textAlign: isArabic(cell) ? "right" : "left", padding: "10px", borderBottom: `1px solid ${borderColor}` }}>
                      {formatInline(cell, darkMode)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {headers.map((_, cellIndex) => (
                      <td key={cellIndex} style={{ padding: "9px 10px", verticalAlign: "top", borderTop: `1px solid ${borderColor}`, lineHeight: 1.65 }}>
                        {formatInline(row[cellIndex] || "", darkMode)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    // Blockquotes.
    if (trimmed.startsWith(">")) {
      const quoteLines = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      elements.push(
        <blockquote
          key={`quote-${i}`}
          dir={isArabic(quoteLines.join(" ")) ? "rtl" : "auto"}
          style={{
            margin: "10px 0 16px",
            padding: "10px 14px",
            borderInlineStart: "3px solid #3b82f6",
            background: mutedBg,
            borderRadius: "8px",
            color: textColor,
            lineHeight: 1.8
          }}
        >
          {formatInline(quoteLines.join(" "), darkMode)}
        </blockquote>
      );
      continue;
    }

    // Ordered and unordered lists.
    const bullet = trimmed.match(/^[-*•]\s+(.+)/);
    const numbered = trimmed.match(/^\d+[.)]\s+(.+)/);
    if (bullet || numbered) {
      const ordered = Boolean(numbered);
      const items = [];
      while (i < lines.length) {
        const current = lines[i].trim();
        const match = ordered ? current.match(/^\d+[.)]\s+(.+)/) : current.match(/^[-*•]\s+(.+)/);
        if (!match) break;
        items.push(match[1]);
        i++;
      }
      const ListTag = ordered ? "ol" : "ul";
      elements.push(
        <ListTag key={`list-${i}`} style={{ paddingInlineStart: "25px", margin: "8px 0 14px", lineHeight: 1.8, color: textColor }}>
          {items.map((item, index) => (
            <li key={index} style={{ paddingInlineStart: "4px", marginBottom: "3px" }}>
              {formatInline(item, darkMode)}
            </li>
          ))}
        </ListTag>
      );
      continue;
    }

    // Normal paragraph; join wrapped source lines until the next Markdown block.
    const paragraph = [trimmed];
    i++;
    while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i])) {
      paragraph.push(lines[i].trim());
      i++;
    }
    const paragraphText = paragraph.join(" ");
    const arabic = isArabic(paragraphText);
    elements.push(
      <p
        key={`paragraph-${i}`}
        dir={arabic ? "rtl" : "auto"}
        style={{
          margin: "7px 0 12px",
          textAlign: arabic ? "right" : "left",
          lineHeight: 1.85,
          fontSize: "15px",
          color: textColor,
          whiteSpace: "normal"
        }}
      >
        {formatInline(paragraphText, darkMode)}
      </p>
    );
  }

  return <div>{elements}</div>;
}

// Automatically optimize images before sending them.
async function compressImage(file) {
  if (!file.type.startsWith("image/")) return file;

  try {
    const bitmap = await createImageBitmap(file);

    const MAX_DIMENSION = 2200;

    const scale = Math.min(
      1,
      MAX_DIMENSION / Math.max(bitmap.width, bitmap.height)
    );

    if (scale === 1 && file.type === "image/png") {
      bitmap.close();
      return file;
    }

    const canvas = document.createElement("canvas");

    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      bitmap.close();
      return file;
    }

    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    bitmap.close();

    const outputType =
      file.type === "image/png" ? "image/png" : "image/jpeg";

    const blob = await new Promise((resolve) => {
      canvas.toBlob(
        resolve,
        outputType,
        outputType === "image/jpeg" ? 0.92 : undefined
      );
    });

    if (!blob || blob.size >= file.size) {
      return file;
    }

    return new File(
      [blob],
      outputType === "image/jpeg" ? "medmind-image.jpg" : file.name,
      { type: outputType }
    );

  } catch (error) {
    console.warn("Image compression skipped:", error);
    return file;
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(String(reader.result).split(",")[1]);
    };

    reader.onerror = () => {
      reject(new Error("Could not read the image."));
    };

    reader.readAsDataURL(file);
  });
}

export default function Tutor({ onBack, darkMode = false, setDarkMode }) {
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

  const API_URL =
    "https://medmind-test.mohamedradey2hh0.workers.dev/";

  const pageBg = darkMode ? "#0f172a" : "#f5f7fb";
  const cardBg = darkMode ? "#1e293b" : "#ffffff";
  const primaryText = darkMode ? "#f1f5f9" : "#172554";
  const secondaryText = darkMode ? "#cbd5e1" : "#64748b";
  const borderColor = darkMode ? "#334155" : "#e2e8f0";
  const inputBg = darkMode ? "#0f172a" : "#ffffff";
  const inputText = darkMode ? "#f1f5f9" : "#1e293b";

  function scrollToNewQuestion() {
    setTimeout(() => {
      questionStartRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 200);
  }

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

    const selectedNode =
      selection.getRangeAt(0).commonAncestorContainer;

    if (!e.currentTarget.contains(selectedNode)) {
      setTextSelection(null);
      return;
    }

    const rect =
      selection.getRangeAt(0).getBoundingClientRect();

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
        const optimizedImage = await compressImage(imageForRequest.file);

        imageData = await fileToBase64(optimizedImage);
        imageMimeType = optimizedImage.type;
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
        throw new Error(
          "Streaming is not supported by this connection."
        );
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
            eventData.error ||
            "The response stream was interrupted."
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
      id="medmind-tutor"
      className="tutor-page"
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
        background: pageBg,
        padding: "25px 16px",
        fontFamily: "Cairo, sans-serif",
        color: primaryText
      }}
    >
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
        <div className="tutor-topbar">
          <button
            type="button"
            onClick={onBack}
            className="tutor-back-button"
          >
            <ArrowLeft size={17} style={{ verticalAlign: "middle" }} /> Back
          </button>

          <button
            type="button"
            className="theme-toggle tutor-theme-toggle"
            onClick={() => setDarkMode?.((current) => !current)}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            title={darkMode ? "Light mode" : "Dark mode"}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span>{darkMode ? "الوضع الفاتح" : "الوضع الليلي"}</span>
          </button>
        </div>

        <div
          style={{
            background: cardBg,
            padding: "25px",
            borderRadius: "18px",
            boxShadow: darkMode
              ? "0 5px 25px #00000030"
              : "0 5px 25px #00000008",
            color: primaryText
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

          <p style={{ color: secondaryText, lineHeight: 1.6 }}>
            Your intelligent medical learning companion.
            Ask questions and learn in your own way.
          </p>

          <div style={{ marginTop: "25px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "12px",
                fontWeight: "bold",
                color: primaryText
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
              {[
                {
                  id: "quick",
                  icon: <Zap size={19} color="#2563eb" />,
                  title: "Quick Answer",
                  description: "Short, direct answers with key points."
                },
                {
                  id: "deep",
                  icon: <BookOpen size={19} color="#2563eb" />,
                  title: "Deep Explanation",
                  description: "Step-by-step explanations, WHY, and clinical links."
                }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setDepth(item.id)}
                  style={{
                    padding: "16px",
                    borderRadius: "12px",
                    border: depth === item.id
                      ? "2px solid #2563eb"
                      : `1px solid ${borderColor}`,
                    background: depth === item.id
                      ? darkMode ? "#1e3a5f" : "#eff6ff"
                      : inputBg,
                    color: darkMode ? "#e2e8f0" : "#1e3a8a",
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
                    {item.icon}
                    {item.title}
                  </div>

                  <div style={{
                    marginTop: "7px",
                    fontSize: "13px",
                    color: secondaryText
                  }}>
                    {item.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

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
                  color: secondaryText
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
                  background: message.role === "user"
                    ? "#2563eb"
                    : darkMode ? "#1e293b" : "#f8fafc",
                  color: message.role === "user"
                    ? "#ffffff"
                    : darkMode ? "#f1f5f9" : "#1e293b",
                  padding: "14px 17px",
                  borderRadius: "14px",
                  maxWidth: message.role === "user" ? "90%" : "100%",
                  border: message.role === "assistant"
                    ? `1px solid ${borderColor}`
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
                    <FormattedAnswer
                      text={message.text}
                      darkMode={darkMode}
                    />

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

            {loading &&
              messages[messages.length - 1]?.role !== "assistant" && (
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

          <form onSubmit={askAI} style={{ marginTop: "20px" }}>
            {selectedImage && (
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  marginBottom: "12px",
                  border: `1px solid ${borderColor}`,
                  borderRadius: "12px",
                  padding: "7px",
                  background: darkMode ? "#0f172a" : "#f8fafc"
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
                  color: secondaryText,
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
                background: inputBg,
                color: inputText,
                border: `1px solid ${borderColor}`,
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
                  opacity:
                    loading || (!question.trim() && !selectedImage)
                      ? 0.6
                      : 1,
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
              color: darkMode ? "#94a3b8" : "#94a3b8",
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

        #medmind-tutor textarea::placeholder {
          color: ${darkMode ? "#94a3b8" : "#94a3b8"};
          opacity: 1;
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
