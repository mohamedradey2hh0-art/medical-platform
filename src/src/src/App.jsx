import React, { useEffect, useState } from "react";
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
  Sun,
  Moon,
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
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("medmind-theme") === "dark";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("medmind-theme", darkMode ? "dark" : "light");
    } catch {
      // Ignore storage errors; the theme still works for this session.
    }
  }, [darkMode]);

  const isDark = darkMode;
  const colors = {
    page: isDark ? "#0B1220" : "#F6F9FC",
    surface: isDark ? "#151F30" : "#FFFFFF",
    surfaceSoft: isDark ? "#1D2A3D" : "#EAF4F3",
    text: isDark ? "#E5EDF7" : "#172B4D",
    muted: isDark ? "#A7B4C7" : "#718096",
    border: isDark ? "#2B3A50" : "#E5EAF0",
    input: isDark ? "#101A2A" : "#FFFFFF",
  };

  const filteredTools = tools.filter((tool) =>
    (tool.title + tool.subtitle + tool.desc)
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  
  const selectedTool = tools.find((tool) => tool.id === selected);

  if (page === "tutor") {
    return <Tutor onBack={() => setPage("home")} />;
  }

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: colors.page,
        color: colors.text,
        fontFamily: "Cairo, sans-serif",
        transition: "background 0.2s ease, color 0.2s ease",
      }}
    >
      <header
        style={{
          background: colors.surface,
          borderBottom: `1px solid ${colors.border}`,
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
            gap: 16,
            flexWrap: "wrap",
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
            className="dashboard-nav"
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
            <a href="#tools" style={{ color: colors.muted, textDecoration: "none" }}>
              الأدوات
            </a>
            <a href="#about" style={{ color: colors.muted, textDecoration: "none" }}>
              عن المنصة
            </a>
          </nav>

          <button
            type="button"
            className="theme-toggle"
            onClick={() => setDarkMode((current) => !current)}
            aria-label={darkMode ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الليلي"}
            title={darkMode ? "الوضع الفاتح" : "الوضع الليلي"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: `1px solid ${colors.border}`,
              borderRadius: 12,
              padding: "9px 13px",
              background: colors.surfaceSoft,
              color: colors.text,
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 700,
            }}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span>{darkMode ? "الوضع الفاتح" : "الوضع الليلي"}</span>
          </button>
        </div>
      </header>

      <main
        className="container dashboard-main"
        id="dashboard"
        style={{ paddingTop: 40, paddingBottom: 60 }}
      >
        <section
          className="dashboard-hero"
              style={{
            background: "linear-gradient(120deg, #087E78, #075B63)",
            color: "white",
            borderRadius: 24,
            padding: "35px 30px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="hero-copy" style={{ position: "relative", zIndex: 1 }}>
            <div
              className="hero-eyebrow"
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
            className="hero-watermark"
            size={150}
            style={{
              position: "absolute",
              left: 25,
              top: 15,
              opacity: 0.12,
            }}
          />
        </section>

        <section id="tools" className="dashboard-tools-section" style={{ marginTop: 38 }}>
          <div
            className="tools-heading"
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
              <p style={{ color: colors.muted, fontSize: 14 }}>
                  كل ما تحتاجه في رحلتك الدراسية في مكان واحد.
              </p>
            </div>
            <div
              className="student-badge"
              style={{
                background: isDark ? "#153B3B" : "#E0F2F1",
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
            className="dashboard-search"
            style={{
              background: colors.surface,
              border: `1px solid ${colors.border}`,
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
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ابحث عن أداة..."
              aria-label="ابحث عن أداة"
              style={{
                border: 0,
                outline: 0,
                width: "100%",
                fontSize: 14,
                background: "transparent",
                color: colors.text,
                fontFamily: "inherit",
              }}
            />
          </div>

          <div
            className="tools-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: 18,
            }}
          >
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  type="button"
                  className="dashboard-tool-card"
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
                    background: colors.surface,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 18,
                    padding: 22,
                    cursor: "pointer",
                    color: colors.text,
                    transition: "background 0.2s ease, border 0.2s ease",
                  }}
                >
                  <div
                    className="dashboard-tool-icon"
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
                  <div
                    className="dashboard-tool-subtitle"
                    style={{ fontSize: 11, color: tool.color, fontWeight: 800 }}
                  >
                    {tool.subtitle}
                  </div>
                  <h3 style={{ fontSize: 17, margin: "8px 0" }}>{tool.title}</h3>
                  <p
                    style={{
                      color: colors.muted,
                      fontSize: 13,
                      lineHeight: 1.9,
                      minHeight: 48,
                    }}
                  >
                    {tool.desc}
                  </p>
                  <span
                    className="dashboard-tool-link"
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
            <p className="dashboard-empty" style={{ textAlign: "center", color: colors.muted }}>
              لا توجد أدوات مطابقة للبحث.
            </p>
          )}
        </section>

        {selectedTool && (
          <section
            className="selected-tool-panel"
            style={{
              marginTop: 30,
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: 18,
              padding: 25,
            }}
          >
            <div
              className="selected-tool-heading"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ fontSize: 20 }}>{selectedTool.title}</h2>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="إغلاق"
                style={{
                  border: 0,
                  background: colors.surfaceSoft,
                  color: colors.text,
                  borderRadius: 10,
                  padding: 8,
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>
            <p style={{ color: colors.muted, lineHeight: 2 }}>{selectedTool.desc}</p>
            <p
              className="development-note"
              style={{
                background: isDark ? "#173536" : "#F0F7F6",
                color: isDark ? "#9DE1D8" : "#087E78",
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
          className="dashboard-about"
          style={{
            marginTop: 45,
            background: colors.surfaceSoft,
            border: `1px solid ${colors.border}`,
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
            <p style={{ margin: 0, color: colors.muted, lineHeight: 2, fontSize: 14 }}>
              MedMind منصة تعليمية تهدف إلى مساعدة طلاب الطب على الفهم والتدريب والتطور.
            </p>
          </div>
        </section>
      </main>

      <footer
        className="dashboard-footer"
        style={{
          background: isDark ? "#080F1B" : "#102C38",
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
