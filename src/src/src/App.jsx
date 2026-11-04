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
  Moon,
  Sun,
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

const THEME_KEY = "medmind-theme";

export default function App() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState("home");
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) === "dark";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const theme = darkMode ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // The theme still works for this visit if storage is unavailable.
    }
  }, [darkMode]);

  const filteredTools = tools.filter((tool) =>
    (tool.title + tool.subtitle + tool.desc)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const selectedTool = tools.find((tool) => tool.id === selected);

  if (page === "tutor") {
    return <Tutor onBack={() => setPage("home")} darkMode={darkMode} setDarkMode={setDarkMode} />;
  }

  return (
    <div dir="rtl" className="medmind-app" id="dashboard">
      <header className="dashboard-header">
        <div className="container dashboard-header-inner">
          <a href="#dashboard" className="dashboard-brand">
            <Stethoscope size={28} />
            MedMind
          </a>

          <nav className="dashboard-nav">
            <a href="#dashboard" className="active">الرئيسية</a>
            <a href="#tools">الأدوات</a>
            <a href="#about">عن المنصة</a>
          </nav>

          <button
            type="button"
            className="theme-toggle"
            onClick={() => setDarkMode((current) => !current)}
            aria-label={darkMode ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الليلي"}
            title={darkMode ? "الوضع الفاتح" : "الوضع الليلي"}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span>{darkMode ? "الوضع الفاتح" : "الوضع الليلي"}</span>
          </button>
        </div>
      </header>

      <main className="container dashboard-main">
        <section className="dashboard-hero">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <Sparkles size={15} />
              YOUR MEDICAL LEARNING SPACE
            </div>
            <h1>أهلاً بك في MedMind 🩺</h1>
            <p>رحلتك نحو فهم أعمق للطب تبدأ من هنا.</p>
          </div>
          <Stethoscope className="hero-watermark" size={150} />
        </section>

        <section id="tools" className="dashboard-tools-section">
          <div className="tools-heading">
            <div>
              <h2>أدواتك التعليمية</h2>
              <p>كل ما تحتاجه في رحلتك الدراسية في مكان واحد.</p>
            </div>
            <div className="student-badge">MEDICAL STUDENT</div>
          </div>

          <div className="dashboard-search">
            <Search color="#087E78" size={20} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ابحث عن أداة..."
              aria-label="ابحث عن أداة"
            />
          </div>

          <div className="tools-grid">
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
                >
                  <div className="dashboard-tool-icon" style={{ background: tool.bg, color: tool.color }}>
                    <Icon size={26} />
                  </div>
                  <div className="dashboard-tool-subtitle" style={{ color: tool.color }}>
                    {tool.subtitle}
                  </div>
                  <h3>{tool.title}</h3>
                  <p>{tool.desc}</p>
                  <span className="dashboard-tool-link" style={{ color: tool.color }}>
                    استكشف الأداة <ChevronLeft size={17} />
                  </span>
                </button>
              );
            })}
          </div>

          {filteredTools.length === 0 && (
            <p className="dashboard-empty">لا توجد أدوات مطابقة للبحث.</p>
          )}
        </section>

        {selectedTool && (
          <section className="selected-tool-panel">
            <div className="selected-tool-heading">
              <h2>{selectedTool.title}</h2>
              <button type="button" onClick={() => setSelected(null)} aria-label="إغلاق">
                <X size={20} />
              </button>
            </div>
            <p>{selectedTool.desc}</p>
            <p className="development-note">
              هذه الأداة قيد التطوير. سنضيف وظائفها الفعلية في المراحل القادمة.
            </p>
          </section>
        )}

        <section id="about" className="dashboard-about">
          <GraduationCap size={45} className="about-graduation-icon" />
          <div>
            <h2>التعلم الطبي بطريقة أذكى</h2>
            <p>
              MedMind منصة تعليمية تهدف إلى مساعدة طلاب الطب على الفهم والتدريب والتطور.
            </p>
          </div>
        </section>
      </main>

      <footer className="dashboard-footer">
        © 2026 MedMind · Made for medical students
      </footer>
    </div>
  );
}
