import { useState } from "react";

export default function Tutor() {
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
    "Other",
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f7fb",
      padding: "30px",
      direction: "rtl",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{ maxWidth: "850px", margin: "auto" }}>
        <h1 style={{ color: "#173b57" }}>MedMind AI Tutor 🩺</h1>
        <p style={{ color: "#64748b" }}>
          Your personal medical learning assistant
        </p>

        <div style={{
          background: "white",
          padding: "25px",
          borderRadius: "16px",
          marginTop: "25px"
        }}>
          <h2>ابدأ رحلتك في الفهم</h2>

          <label>اختر المادة</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={fieldStyle}
          >
            <option value="">اختر المادة...</option>
            {subjects.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <label>الموضوع (اختياري)</label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="مثلاً: Heart Failure"
            style={fieldStyle}
          />

          <label>اكتب سؤالك الطبي</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="اشرح لي الموضوع أو اسأل عن أي نقطة مش واضحة..."
            rows={5}
            style={fieldStyle}
          />

          <button
            onClick={() => alert("واجهة المساعد جاهزة، وسنربط الذكاء الاصطناعي في الخطوة القادمة.")}
            style={{
              background: "#176b87",
              color: "white",
              padding: "14px 25px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              width: "100%",
              fontSize: "16px",
              marginTop: "10px"
            }}
          >
            ابدأ المحادثة
          </button>
        </div>
      </div>
    </div>
  );
}

const fieldStyle = {
  display: "block",
  width: "100%",
  padding: "13px",
  margin: "10px 0 20px",
  border: "1px solid #d5dce5",
  borderRadius: "8px",
  fontSize: "15px",
  boxSizing: "border-box"
};
