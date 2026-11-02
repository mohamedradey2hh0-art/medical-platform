

import { useState } from "react";
import { ArrowRight, Brain, Send, BookOpen } from "lucide-react";

export default function Tutor({ onBack }) {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");

  const subjects = [
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
    "Other",
  ];

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "#F6F9FC",
        color: "#172B4D",
        fontFamily: "Cairo, sans-serif",
        padding: "25px 16px",
      }}
    >
      <div style={{ maxWidth: 900, margin: "auto" }}>

        <button
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            border: "1px solid #E5EAF0",
            background: "white",
            color: "#087E78",
            borderRadius: 10,
            padding: "10px 16px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 700,
          }}
        >
          <ArrowRight size={18} />
          العودة إلى الرئيسية
        </button>

        <section
          style={{
            marginTop: 25,
            background: "linear-gradient(120deg, #087E78, #075B63)",
            color: "white",
            borderRadius: 22,
            padding: "30px 25px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Brain size={38} />
            <div>
              <h1 style={{ margin: 0, fontSize: 26 }}>
                المساعد الطبي الذكي
              </h1>
              <p style={{ margin: "7px 0 0", color: "#D9F3EF" }}>
                Medical AI Tutor
              </p>
            </div>
          </div>

          <p style={{ lineHeight: 2, color: "#E0F2F1", marginBottom: 0 }}>
            اسأل، افهم، وتعلّم الطب بطريقة تناسب مستواك.
          </p>
        </section>

        <section
          style={{
            background: "white",
            border: "1px solid #E5EAF0",
            borderRadius: 18,
            padding: 25,
            marginTop: 22,
          }}
        >
          <h2 style={{ fontSize: 21, marginTop: 0 }}>
            <BookOpen
              size={21}
              style={{ verticalAlign: "middle", marginLeft: 8 }}
            />
            ابدأ سؤالك
          </h2>

          <label style={labelStyle}>اختر المادة الطبية</label>

          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={fieldStyle}
          >
            <option value="">اختر المادة...</option>
            {subjects.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <label style={labelStyle}>الموضوع (اختياري)</label>

          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="مثلاً: Heart Failure"
            style={fieldStyle}
          />

          <label style={labelStyle}>اكتب سؤالك</label>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="اشرح لي الموضوع أو اسأل عن نقطة مش واضحة..."
            rows={5}
            style={{ ...fieldStyle, resize: "vertical" }}
          />

          <button
            onClick={() =>
              alert(
                "واجهة المساعد جاهزة! سنربط الذكاء الاصطناعي في المرحلة القادمة."
              )
            }
            disabled={!question.trim()}
            style={{
              width: "100%",
              padding: 15,
              border: 0,
              borderRadius: 11,
              background: question.trim() ? "#087E78" : "#A7C7C3",
              color: "white",
              fontSize: 16,
              fontWeight: 800,
              fontFamily: "inherit",
              cursor: question.trim() ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 9,
            }}
          >
            <Send size={18} />
            ابدأ المحادثة
          </button>

          <p
            style={{
              fontSize: 12,
              color: "#94A3B8",
              textAlign: "center",
              marginBottom: 0,
            }}
          >
            المساعد ما زال في مرحلة التطوير، ولا يقدم تشخيصًا طبيًا.
          </p>
        </section>

      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: 8,
  fontWeight: 700,
  fontSize: 14,
};

const fieldStyle = {
  display: "block",
  width: "100%",
  padding: 13,
  marginBottom: 20,
  border: "1px solid #D5DCE5",
  borderRadius: 9,
  fontSize: 15,
  fontFamily: "inherit",
  background: "white",
  boxSizing: "border-box",
};
