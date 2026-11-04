
import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  HeartPulse,
  Send,
  Loader2,
  Moon,
  Sun,
  ShieldCheck,
  AlertTriangle,
  MessageCircle
} from "lucide-react";

const API_URL =
  "https://medmind-test.mohamedradey2hh0.workers.dev/";

export default function HealthAssistant({
  onBack,
  darkMode = false,
  setDarkMode
}) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "أهلاً بك في MedMind Health Assistant ❤️\n\nأنا هنا لمساعدتك على فهم الأعراض والمعلومات الصحية وتوجيهك للخطوة المناسبة.\n\nاحكي لي، إيه المشكلة الصحية اللي بتواجهك؟"
    }
  ]);

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  const colors = {
    page: darkMode ? "#0b1220" : "#f5f7fb",
    card: darkMode ? "#151f30" : "#ffffff",
    text: darkMode ? "#e5edf7" : "#172b4d",
    muted: darkMode ? "#a8b6c9" : "#64748b",
    border: darkMode ? "#29364a" : "#e5eaf0",
    soft: darkMode ? "#1e293b" : "#f1f5f9",
    assistant: darkMode ? "#1e293b" : "#f8fafc"
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, loading]);

  async function sendMessage(e) {
    e.preventDefault();

    if (!question.trim() || loading) return;

    const currentQuestion = question.trim();

    const history = messages.map(message => ({
      role: message.role,
      text: message.text
    }));

    const assistantId =
      `health-${Date.now()}-${Math.random()}`;

    setMessages(prev => [
      ...prev,
      {
        role: "user",
        text: currentQuestion
      },
      {
        id: assistantId,
        role: "assistant",
        text: ""
      }
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
          mode: "health_assistant",
          question: currentQuestion,
          history
        })
      });

      if (!response.ok) {
        let message = "حدث خطأ أثناء الاتصال بالمساعد.";

        try {
          const data = await response.json();
          message = data.error || message;
        } catch {}

        throw new Error(message);
      }

      if (!response.body) {
        throw new Error("الاتصال لا يدعم استقبال الرد.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = "";
      let receivedText = "";

      function processFrame(frame) {
        const lines = frame.split(/\r?\n/);

        const eventName = lines
          .find(line => line.startsWith("event:"))
          ?.slice(6)
          .trim();

        const dataLines = lines
          .filter(line => line.startsWith("data:"))
          .map(line => line.slice(5).trim());

        if (!dataLines.length) return;

        const rawData = dataLines.join("\n");

        if (rawData === "[DONE]") return;

        const data = JSON.parse(rawData);

        if (eventName === "error" || data.error) {
          throw new Error(
            data.error || "تعذر إكمال الرد."
          );
        }

        if (typeof data.text === "string") {
          receivedText += data.text;

          setMessages(prev =>
            prev.map(message =>
              message.id === assistantId
                ? {
                    ...message,
                    text: receivedText
                  }
                : message
            )
          );
        }
      }

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, {
          stream: true
        });

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
          "لم يصل رد من المساعد. حاول مرة أخرى."
        );
      }

    } catch (err) {
      setError(
        err.message || "حدث خطأ في الاتصال."
      );

      setMessages(prev =>
        prev.filter(
          message =>
            message.id !== assistantId ||
            message.text.trim()
        )
      );

    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  }

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: colors.page,
        color: colors.text,
        padding: "20px 14px 35px",
        fontFamily: "Cairo, sans-serif"
      }}
    >
      <div style={{
        maxWidth: 850,
        margin: "auto"
      }}>

        {/* Top Navigation */}

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          marginBottom: 20
        }}>

          <button
            onClick={onBack}
            style={navButton(colors)}
          >
            <ArrowLeft size={17} />
            الرئيسية
          </button>

          <button
            onClick={() =>
              setDarkMode?.(current => !current)
            }
            style={navButton(colors)}
          >
            {darkMode
              ? <Sun size={18} />
              : <Moon size={18} />
            }
          </button>
        </div>

        {/* Assistant Header */}

        <div style={{
          background: "linear-gradient(120deg,#087e78,#075b63)",
          color: "white",
          padding: 25,
          borderRadius: 18,
          marginBottom: 16
        }}>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12
          }}>
            <HeartPulse size={36} />

            <div>
              <h1 style={{
                fontSize: 23,
                margin: 0,
                fontWeight: 900
              }}>
                MedMind Health Assistant
              </h1>

              <p style={{
                color: "#d9f3ef",
                fontSize: 13,
                marginTop: 5
              }}>
                مساعدك الصحي الذكي
              </p>
            </div>
          </div>

          <p style={{
            marginTop: 17,
            fontSize: 14,
            lineHeight: 1.9,
            color: "#ecfdf5"
          }}>
            احكي عن مشكلتك الصحية، وسأساعدك على فهم
            الأعراض وتحديد الخطوة المناسبة.
          </p>
        </div>

        {/* Safety Notice */}

        <div style={{
          background: darkMode ? "#332b19" : "#fffbeb",
          border: "1px solid #d97706",
          borderRadius: 12,
          padding: 13,
          display: "flex",
          gap: 10,
          marginBottom: 16,
          fontSize: 12,
          lineHeight: 1.8
        }}>
          <AlertTriangle
            size={20}
            color="#d97706"
            style={{ flexShrink: 0 }}
          />

          <div>
            هذه الخدمة تقدم معلومات وتوجيهًا صحيًا مبدئيًا،
            ولا تغني عن الكشف الطبي. في حالة الأعراض الطارئة
            اطلب المساعدة الطبية فورًا.
          </div>
        </div>

        {/* Chat */}

        <div style={{
          background: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: 18,
          padding: 18,
          boxShadow: darkMode
            ? "0 5px 20px #00000025"
            : "0 5px 20px #00000006"
        }}>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            paddingBottom: 15,
            borderBottom: `1px solid ${colors.border}`,
            marginBottom: 17
          }}>
            <MessageCircle
              size={22}
              color="#0D9488"
            />

            <div>
              <strong>المحادثة الصحية</strong>

              <div style={{
                color: colors.muted,
                fontSize: 11
              }}>
                MedMind AI
              </div>
            </div>
          </div>

          <div style={{
            minHeight: 250,
            maxHeight: 520,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 13
          }}>

            {messages.map((message, index) => (
              <div
                key={message.id || index}
                style={{
                  alignSelf:
                    message.role === "user"
                      ? "flex-start"
                      : "flex-end",

                  maxWidth: "90%",
                  background:
                    message.role === "user"
                      ? "#0D9488"
                      : colors.assistant,

                  color:
                    message.role === "user"
                      ? "white"
                      : colors.text,

                  border:
                    message.role === "assistant"
                      ? `1px solid ${colors.border}`
                      : "none",

                  padding: "12px 15px",
                  borderRadius: 14,
                  fontSize: 14,
                  lineHeight: 2,
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere"
                }}
              >
                <div style={{
                  fontSize: 11,
                  fontWeight: 800,
                  marginBottom: 5,
                  opacity: 0.8
                }}>
                  {message.role === "user"
                    ? "أنت"
                    : "MedMind"
                  }
                </div>

                {message.text}
              </div>
            ))}

            {loading &&
              messages[messages.length - 1]?.text === "" && (
                <div style={{
                  color: "#0D9488",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13
                }}>
                  <Loader2 size={18} />
                  MedMind يفكر...
                </div>
              )}

            <div ref={bottomRef} />
          </div>

          {error && (
            <div style={{
              color: "#ef4444",
              fontSize: 13,
              marginTop: 12
            }}>
              {error}
            </div>
          )}

          {/* Message Input */}

          <form
            onSubmit={sendMessage}
            style={{
              marginTop: 20,
              borderTop: `1px solid ${colors.border}`,
              paddingTop: 15
            }}
          >

            <textarea
              ref={textareaRef}
              value={question}
              onChange={e =>
                setQuestion(e.target.value)
              }
              onKeyDown={e => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault();

                  if (
                    question.trim() &&
                    !loading
                  ) {
                    e.currentTarget.form.requestSubmit();
                  }
                }
              }}
              placeholder="اكتب مشكلتك أو اسأل عن أعراضك..."
              rows={3}
              disabled={loading}
              style={{
                width: "100%",
                boxSizing: "border-box",
                resize: "vertical",
                background: colors.soft,
                color: colors.text,
                border: `1px solid ${colors.border}`,
                borderRadius: 12,
                padding: 14,
                outline: "none",
                fontFamily: "inherit",
                fontSize: 14,
                lineHeight: 1.8
              }}
            />

            <button
              type="submit"
              disabled={loading || !question.trim()}
              style={{
                marginTop: 12,
                width: "100%",
                background: "#0D9488",
                color: "white",
                border: "none",
                borderRadius: 12,
                padding: 14,
                fontWeight: 800,
                fontSize: 14,
                cursor: "pointer",
                opacity:
                  loading || !question.trim()
                    ? 0.55
                    : 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 9
              }}
            >
              {loading
                ? <Loader2 size={18} />
                : <Send size={18} />
              }

              {loading
                ? "جاري إرسال الرسالة..."
                : "إرسال"
              }
            </button>
          </form>

          {/* Disclaimer */}

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            marginTop: 17,
            color: colors.muted,
            fontSize: 11,
            lineHeight: 1.8
          }}>
            <ShieldCheck size={17} />

            المعلومات المقدمة هنا للتوعية والتوجيه
            ولا تمثل تشخيصًا طبيًا مؤكدًا.
          </div>

        </div>
      </div>
    </div>
  );
}

function navButton(colors) {
  return {
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "10px 13px",
    borderRadius: 10,
    border: `1px solid ${colors.border}`,
    background: colors.card,
    color: colors.text,
    cursor: "pointer",
    fontFamily: "inherit"
  };
}
