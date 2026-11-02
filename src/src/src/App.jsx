

import React, { useState } from "react";
import {
  Stethoscope,
  Brain,
  BookOpen,
  ClipboardList,
  Search,
  GraduationCap,
  Sparkles,
  ChevronLeft,
  X,
} from "lucide-react";
import Tutor from "./Tutor.jsx";

const tools = [
  {
    id: "assistant",
    icon: Brain,
    title: "المساعد الطبي الذكي",
    subtitle: "Medical AI Tutor",
    desc: "اسأل عن أي موضوع طبي واحصل على شرح منظم ومبسط.",
    color: "#0D9488",
    bg: "#E0F2F1",
  },
  {
    id: "lectures",
    icon: BookOpen,
    title: "مساعد المحاضرات",
    subtitle: "Lecture Assistant",
    desc: "نظّم محاضراتك واستعد لفهمها ومراجعتها.",
    color: "#2563EB",
    bg: "#DBEAFE",
  },
  {
    id: "questions",
    icon: ClipboardList,
    title: "بنك الأسئلة",
    subtitle: "MCQ Bank",
    desc: "تدرّب على أسئلة الاختيار من متعدد وافهم الإجابات.",
    color: "#D97706",
    bg: "#FEF3C7",
  },
  {
    id: "cases",
    icon: Stethoscope,
    title: "الحالات الإكلينيكية",
    subtitle: "Clinical Cases",
    desc: "طوّر تفكيرك الإكلينيكي من خلال حالات تدريبية.",
    color: "#7C3AED",
    bg: "#EDE9FE",
  },
];

export default function App() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState("home");

  // فتح المساعد الطبي
  if (page === "tutor") {
    return <Tutor onBack={() => setPage("home")} />;
  }

  const filteredTools = tools.filter((tool) =>
    (tool.title + tool.subtitle + tool.desc)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const selectedTool = tools.find((tool) => tool.id === selected);

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "#F6F9FC",
        color: "#172B4D",
        fontFamily: "Cairo, sans-serif",
      }}
    >
      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid #E5EAF0",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <div
          className="container"
          style={{
            minHeight: 75,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <a
            href="#dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "#087E78",
              fontSize: 23,
              fontWeight: 900,
              textDecoration: "none",
            }}
          >
            <Stethoscope size={28} />
            MedMind
          </a>

          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: 25,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            <a href="#dashboard" style={{ color: "#087E78", textDecoration: "none" }}>
              الرئيسية
            </a>
            <a href="#tools" style={{ color: "#64748B", textDecoration: "none" }}>
              الأدوات
            </a>
            <a href="#about" style={{ color: "#64748B", textDecoration: "none" }}>
              عن المنصة
            </a>
          </nav>
        </div>
      </header>

      <main
        className="container"
        id="dashboard"
        style={{ paddingTop: 40, paddingBottom: 60 }}
      >
        <section
          style={{
            background: "linear-gradient(120deg, #087E78, #075B63)",
            color: "white",
            borderRadius: 24,
            padding: "35px 30px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#FFFFFF20",
                borderRadius: 30,
                padding: "7px 13px",
                fontSize: 12,
              }}
            >
              <Sparkles size={15} />
              YOUR MEDICAL LEARNING SPACE
            </div>

            <h1 style={{ fontSize: 32, margin: "18px 0 8px", fontWeight: 900 }}>
              أهلاً بك في MedMind 🩺
            </h1>
            <p style={{ color: "#D9F3EF", lineHeight: 2, margin: 0 }}>
              رحلتك نحو فهم أعمق للطب تبدأ من هنا.
            </p>
          </div>

          <Stethoscope
            size={150}
            style={{
              position: "absolute",
              left: 25,
              top: 15,
              opacity: 0.12,
            }}
          />
        </section>

        <section id="tools" style={{ marginTop: 38 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <h2 style={{ fontSize: 23, margin: 0 }}>أدواتك التعليمية</h2>
              <p style={{ color: "#718096", fontSize: 14 }}>
                كل ما تحتاجه في رحلتك الدراسية في مكان واحد.
              </p>
            </div>

            <div
              style={{
                background: "#E0F2F1",
                color: "#087E78",
                borderRadius: 30,
                padding: "7px 14px",
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              MEDICAL STUDENT
            </div>
          </div>

          <div
            style={{
              background: "white",
              border: "1px solid #E5EAF0",
              borderRadius: 13,
              padding: "11px 15px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              margin: "20px 0",
            }}
          >
            <Search color="#087E78" size={20} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن أداة..."
              style={{
                border: 0,
                outline: 0,
                width: "100%",
                fontSize: 14,
                background: "transparent",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div className="tools-grid">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;

              return (
                <button
                  key={tool.id}
                  onClick={() => {
                    if (tool.id === "assistant") {
                      setPage("tutor");
                    } else {
                      setSelected(tool.id);
                    }
                  }}
                  style={{
                    textAlign: "right",
                    fontFamily: "inherit",
                    background: "white",
                    border: "1px solid #E5EAF0",
                    borderRadius: 18,
                    padding: 22,
                    cursor: "pointer",
                    color: "#172B4D",
                    transition: "0.2s",
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 15,
                      background: tool.bg,
                      color: tool.color,
                      display: "grid",
                      placeItems: "center",
                      marginBottom: 15,
                    }}
                  >
                    <Icon size={26} />
                  </div>

                  <div style={{ fontSize: 11, color: tool.color, fontWeight: 800 }}>
                    {tool.subtitle}
                  </div>

                  <h3 style={{ fontSize: 17, margin: "8px 0" }}>
                    {tool.title}
                  </h3>

                  <p
                    style={{
                      color: "#718096",
                      fontSize: 13,
                      lineHeight: 1.9,
                      minHeight: 48,
                    }}
                  >
                    {tool.desc}
                  </p>

                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      color: tool.color,
                      fontSize: 13,
                      fontWeight: 800,
                    }}
                  >
                    استكشف الأداة <ChevronLeft size={17} />
                  </span>
                </button>
              );
            })}
          </div>

          {filteredTools.length === 0 && (
            <p style={{ textAlign: "center", color: "#718096" }}>
              لا توجد أدوات مطابقة للبحث.
            </p>
          )}
        </section>

        {selectedTool && (
          <section
            style={{
              marginTop: 30,
              background: "white",
              border: "1px solid #E5EAF0",
              borderRadius: 18,
              padding: 25,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ fontSize: 20 }}>{selectedTool.title}</h2>

              <button
                onClick={() => setSelected(null)}
                style={{
                  border: 0,
                  background: "#F1F5F9",
                  borderRadius: 10,
                  padding: 8,
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ color: "#64748B", lineHeight: 2 }}>
              {selectedTool.desc}
            </p>

            <p
              style={{
                background: "#F0F7F6",
                color: "#087E78",
                borderRadius: 10,
                padding: 13,
                fontSize: 13,
              }}
            >
              هذه الأداة قيد التطوير. سنضيف وظائفها الفعلية في المراحل القادمة.
            </p>
          </section>
        )}

        <section
          id="about"
          style={{
            marginTop: 45,
            background: "#EAF4F3",
            borderRadius: 20,
            padding: 28,
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <GraduationCap size={45} color="#087E78" />
          <div>
            <h2 style={{ margin: "0 0 8px", fontSize: 20 }}>
              التعلم الطبي بطريقة أذكى
            </h2>
            <p style={{ margin: 0, color: "#64748B", lineHeight: 2, fontSize: 14 }}>
              MedMind منصة تعليمية تهدف إلى مساعدة طلاب الطب على الفهم والتدريب والتطور.
            </p>
          </div>
        </section>
      </main>

      <footer
        style={{
          background: "#102C38",
          color: "white",
          textAlign: "center",
          padding: 25,
          fontSize: 13,
        }}
      >
        © 2026 MedMind · Made for medical students
      </footer>
    </div>
  );
}
