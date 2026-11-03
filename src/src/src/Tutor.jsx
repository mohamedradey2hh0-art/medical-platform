
import React, { useState } from "react";
import { ArrowLeft, Brain, Send, BookOpen, Loader2 } from "lucide-react";

export default function Tutor({ onBack }) {
  const [subject, setSubject] = useState("Anatomy");
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "https://medmind-ai.mohamedradey2hh0.workers.dev/";

  async function askAI(e) {
    e.preventDefault();

    if (!question.trim() || loading) return;

    const currentQuestion = question.trim();

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          topic,
          question: currentQuestion
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
    <div style={{
      minHeight: "100vh",
      background: "#f5f7fb",
      padding: "25px 16px",
      fontFamily: "Arial, sans-serif",
      color: "#172554"
    }}>
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

        <div style={{
          background: "white",
          padding: "25px",
          borderRadius: "18px",
          boxShadow: "0 5px 25px #00000008"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "10px"
          }}>
            <Brain size={32} color="#2563eb" />
            <h1 style={{ margin: 0, fontSize: "26px" }}>Medical AI Tutor</h1>
          </div>

          <p style={{ color: "#64748b", lineHeight: 1.6 }}>
            Your intelligent medical learning companion.
            Ask questions, understand concepts, and learn step by step.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
            marginTop: "25px"
          }}>
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
                  "Anatomy", "Physiology", "Biochemistry",
                  "Pathology", "Pharmacology", "Internal Medicine",
                  "Surgery", "Pediatrics", "Ophthalmology",
                  "ENT", "Other"
                ].map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>

            <label>
              <span style={{ display: "block", marginBottom: "8px" }}>Topic</span>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Heart failure"
                style={fieldStyle}
              />
            </label>
          </div>

          <div style={{
            marginTop: "25px",
            minHeight: "180px",
            maxHeight: "450px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "14px"
          }}>
            {messages.length === 0 && (
              <div style={{
                textAlign: "center",
                padding: "35px 10px",
                color: "#64748b"
              }}>
                <Brain size={38} color="#93c5fd" />
                <p>What would you like to understand today?</p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                  background: message.role === "user" ? "#2563eb" : "#eff6ff",
                  color: message.role === "user" ? "white" : "#1e293b",
                  padding: "14px 17px",
                  borderRadius: "14px",
                  maxWidth: "90%",
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere"
                }}
              >
                {message.text}
              </div>
            ))}

            {loading && (
              <div style={{ color: "#2563eb", padding: "10px" }}>
                <Loader2 size={18} className="animate-spin" />
                MedMind is thinking...
              </div>
            )}
          </div>

          {error && (
            <p style={{ color: "#dc2626", fontSize: "14px" }}>{error}</p>
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

          <p style={{
            color: "#94a3b8",
            fontSize: "12px",
            marginTop: "20px",
            lineHeight: 1.5
          }}>
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
