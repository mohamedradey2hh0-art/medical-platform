
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
  Activity,
  HeartPulse,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  Send,
  RotateCcw,
  UserRound,
  Bot,
  Clock3,
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

const specialties = [
  { name: "Internal Medicine", ar: "الباطنة", icon: HeartPulse, color: "#0D9488" },
  { name: "Pediatrics", ar: "الأطفال", icon: UserRound, color: "#2563EB" },
  { name: "Surgery", ar: "الجراحة", icon: Activity, color: "#D97706" },
  { name: "Cardiology", ar: "القلب", icon: HeartPulse, color: "#E11D48" },
  { name: "Neurology", ar: "المخ والأعصاب", icon: Brain, color: "#7C3AED" },
  { name: "Emergency", ar: "الطوارئ", icon: Activity, color: "#EA580C" },
];

function ClinicalCases({ darkMode, onBack }) {
  const [mode, setMode] = useState(null);
  const [specialty, setSpecialty] = useState("Internal Medicine");
  const [answer, setAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "patient",
      text: "مرحباً دكتور. أنا جاي المستشفى بسبب ألم في صدري بدأ من حوالي ساعتين.",
    },
  ]);

  const dark = darkMode;

  const colors = {
    page: dark ? "#0b1220" : "#f5f7fb",
    card: dark ? "#151f30" : "#ffffff",
    text: dark ? "#e5edf7" : "#172b4d",
    muted: dark ? "#a8b6c9" : "#64748b",
    border: dark ? "#29364a" : "#e5eaf0",
    soft: dark ? "#1e293b" : "#f1f5f9",
    primary: "#0D9488",
  };

  const caseOptions = [
    "Acute myocardial infarction",
    "Gastroesophageal reflux disease",
    "Musculoskeletal chest pain",
    "Pneumonia",
  ];

  const correctAnswer = "Acute myocardial infarction";

  const resetCase = () => {
    setAnswer("");
    setShowResult(false);
    setMessages([
      {
        from: "patient",
        text: "مرحباً دكتور. أنا جاي المستشفى بسبب ألم في صدري بدأ من حوالي ساعتين.",
      },
    ]);
    setQuestion("");
  };

  const sendQuestion = (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const q = question.trim();
    let reply = "ممكن توضح سؤالك بشكل أكبر؟";

    if (/age|عمر|سن/i.test(q)) {
      reply = "عمري 58 سنة.";
    } else if (/pain|ألم|وجع/i.test(q)) {
      reply = "الألم ضاغط في منتصف الصدر ويمتد إلى الذراع الأيسر.";
    } else if (/breath|تنفس|نفس/i.test(q)) {
      reply = "أشعر بضيق بسيط في التنفس مع الألم.";
    } else if (/history|مرض|تاريخ|ضغط|سكر/i.test(q)) {
      reply = "أعاني من ارتفاع ضغط الدم ومرض السكري منذ عدة سنوات.";
    } else if (/medication|دواء|أدوية/i.test(q)) {
      reply = "أستخدم أدوية الضغط والسكري، لكنني لا أتذكر أسماءها الآن.";
    } else if (/sweat|عرق|تعرق/i.test(q)) {
      reply = "نعم، أعاني من تعرق شديد منذ بداية الألم.";
    } else if (/vomit|قيء|غثيان/i.test(q)) {
      reply = "أشعر ببعض الغثيان.";
    }

    setMessages((prev) => [
      ...prev,
      { from: "doctor", text: q },
      { from: "patient", text: reply },
    ]);
    setQuestion("");
  };

  const pageStyle = {
    minHeight: "100vh",
    background: colors.page,
    color: colors.text,
    padding: "24px 16px 60px",
    transition: "0.2s",
  };

  const cardStyle = {
    background: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: 18,
    padding: 22,
    color: colors.text,
  };

  const buttonStyle = {
    border: `1px solid ${colors.border}`,
    borderRadius: 12,
    padding: "13px 15px",
    background: colors.card,
    color: colors.text,
    cursor: "pointer",
    textAlign: "right",
    width: "100%",
    fontFamily: "inherit",
    fontSize: 14,
  };

  const primaryButton = {
    border: "none",
    borderRadius: 12,
    padding: "13px 20px",
    background: "#0D9488",
    color: "white",
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: 800,
  };

  return (
    <div style={pageStyle} dir="rtl">
      <div style={{ maxWidth: 900, margin: "auto" }}>
        <button
          onClick={mode ? () => setMode(null) : onBack}
          style={{
            ...buttonStyle,
            width: "auto",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 24,
          }}
        >
          <ArrowRight size={18} />
          {mode ? "رجوع" : "الرئيسية"}
        </button>

        <div style={{
          ...cardStyle,
          background: "linear-gradient(120deg,#087e78,#075b63)",
          color: "white",
          marginBottom: 25,
          padding: 28,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Stethoscope size={36} />
            <div>
              <h1 style={{ fontSize: 27, fontWeight: 900 }}>Clinical Cases</h1>
              <p style={{ color: "#d9f3ef", fontSize: 13 }}>
                Learn clinical reasoning through real-world scenarios.
              </p>
            </div>
          </div>
        </div>

        {!mode && (
          <>
            <h2 style={{ fontSize: 21, marginBottom: 8 }}>اختر طريقة التدريب</h2>
            <p style={{ color: colors.muted, marginBottom: 20, fontSize: 14 }}>
              تدرب على الحالات الطبية بالطريقة التي تناسبك.
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
              gap: 16,
            }}>
              <button
                onClick={() => setMode("ready")}
                style={{ ...cardStyle, cursor: "pointer", textAlign: "right" }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 15,
                  background: "#E0F2F1", color: "#0D9488",
                  display: "grid", placeItems: "center", marginBottom: 16,
                }}>
                  <ClipboardList size={27} />
                </div>
                <h3 style={{ fontSize: 18, marginBottom: 8 }}>Ready-made Cases</h3>
                <p style={{ color: colors.muted, lineHeight: 1.9, fontSize: 13 }}>
                  حالات سريرية جاهزة بأسئلة واختيارات وتفسير للإجابات.
                </p>
                <div style={{ color: "#0D9488", fontWeight: 800, marginTop: 18 }}>
                  ابدأ التدريب <ChevronLeft size={17} style={{ verticalAlign: "middle" }} />
                </div>
              </button>

              <button
                onClick={() => setMode("interactive")}
                style={{ ...cardStyle, cursor: "pointer", textAlign: "right" }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 15,
                  background: "#EDE9FE", color: "#7C3AED",
                  display: "grid", placeItems: "center", marginBottom: 16,
                }}>
                  <MessageCircle size={27} />
                </div>
                <h3 style={{ fontSize: 18, marginBottom: 8 }}>Interactive Cases</h3>
                <p style={{ color: colors.muted, lineHeight: 1.9, fontSize: 13 }}>
                  تفاعل مع مريض افتراضي واجمع المعلومات للوصول إلى التشخيص.
                </p>
                <div style={{ color: "#7C3AED", fontWeight: 800, marginTop: 18 }}>
                  ابدأ المحاكاة <ChevronLeft size={17} style={{ verticalAlign: "middle" }} />
                </div>
              </button>
            </div>

            <h2 style={{ fontSize: 19, margin: "32px 0 15px" }}>Choose Specialty</h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
              gap: 10,
            }}>
              {specialties.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.name}
                    onClick={() => setSpecialty(s.name)}
                    style={{
                      ...buttonStyle,
                      borderColor: specialty === s.name ? s.color : colors.border,
                      background: specialty === s.name
                        ? (dark ? "#203344" : "#f0fdfa")
                        : colors.card,
                    }}
                  >
                    <Icon size={21} color={s.color} />
                    <div style={{ fontWeight: 800, marginTop: 8 }}>{s.ar}</div>
                    <div style={{ fontSize: 11, color: colors.muted }}>{s.name}</div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {mode === "ready" && (
          <div style={cardStyle}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", gap: 10, flexWrap: "wrap",
            }}>
              <span style={{ color: "#0D9488", fontWeight: 800, fontSize: 13 }}>
                {specialty} · Case 001
              </span>
              <span style={{ color: colors.muted, fontSize: 12 }}>
                <Clock3 size={14} style={{ verticalAlign: "middle" }} /> 5 min
              </span>
            </div>

            <h2 style={{ fontSize: 22, margin: "18px 0 12px" }}>
              Chest Pain in a 58-year-old Male
            </h2>

            <div style={{
              background: colors.soft,
              padding: 17,
              borderRadius: 12,
              lineHeight: 2,
              fontSize: 14,
            }}>
              A 58-year-old male presents to the emergency department with
              severe central chest pain for 2 hours. The pain is described as
              pressure-like and radiates to his left arm. He has a history of
              hypertension and diabetes mellitus.
              <br />
              <strong>Vital signs:</strong>
              <br />
              BP: 150/90 mmHg · HR: 105 bpm · RR: 22/min · SpO₂: 95%
            </div>

            <h3 style={{ margin: "22px 0 12px", fontSize: 17 }}>
              What is the most likely diagnosis?
            </h3>

            <div style={{ display: "grid", gap: 10 }}>
              {caseOptions.map((option, i) => (
                <button
                  key={option}
                  onClick={() => {
                    if (!showResult) setAnswer(option);
                  }}
                  style={{
                    ...buttonStyle,
                    borderColor: answer === option ? "#0D9488" : colors.border,
                    background: answer === option
                      ? (dark ? "#123b3b" : "#f0fdfa")
                      : colors.card,
                    fontWeight: answer === option ? 800 : 500,
                  }}
                >
                  <span style={{ marginLeft: 10, color: colors.muted }}>
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {option}
                  {showResult && option === correctAnswer && (
                    <CheckCircle2 color="#16A34A" size={18}
                      style={{ float: "left" }} />
                  )}
                </button>
              ))}
            </div>

            {!showResult ? (
              <button
                disabled={!answer}
                onClick={() => setShowResult(true)}
                style={{
                  ...primaryButton,
                  marginTop: 20,
                  opacity: answer ? 1 : 0.5,
                }}
              >
                Check Answer
              </button>
            ) : (
              <div style={{
                marginTop: 22,
                padding: 18,
                borderRadius: 12,
                background: answer === correctAnswer
                  ? (dark ? "#123b2b" : "#ecfdf5")
                  : (dark ? "#3b2525" : "#fef2f2"),
                lineHeight: 2,
              }}>
                <h3 style={{
                  color: answer === correctAnswer ? "#16A34A" : "#EF4444",
                  marginBottom: 8,
                }}>
                  {answer === correctAnswer ? "Correct Answer!" : "Not quite. Review the explanation."}
                </h3>
                <strong>Diagnosis: Acute myocardial infarction (AMI)</strong>
                <p style={{ fontSize: 14, marginTop: 8 }}>
                  The central pressure-like chest pain radiating to the left
                  arm, together with diabetes and hypertension, raises strong
                  suspicion of acute coronary syndrome.
                </p>
                <strong>Important investigations:</strong>
                <ul style={{ paddingRight: 22, fontSize: 14 }}>
                  <li>Immediate 12-lead ECG.</li>
                  <li>Serial cardiac troponins.</li>
                  <li>Continuous cardiac monitoring.</li>
                </ul>
                <strong>Clinical Pearl:</strong>
                <p style={{ fontSize: 14 }}>
                  Do not delay ECG and emergency assessment in suspected ACS.
                  This is a training case, not a substitute for clinical protocols.
                </p>
                <button
                  onClick={resetCase}
                  style={{ ...primaryButton, marginTop: 15 }}
                >
                  <RotateCcw size={16} style={{ verticalAlign: "middle" }} /> Try Again
                </button>
              </div>
            )}
          </div>
        )}

        {mode === "interactive" && (
          <div style={cardStyle}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              borderBottom: `1px solid ${colors.border}`,
              paddingBottom: 16, marginBottom: 16,
            }}>
              <div style={{
                background: "#EDE9FE", color: "#7C3AED",
                width: 43, height: 43, borderRadius: 13,
                display: "grid", placeItems: "center",
              }}>
                <Bot size={24} />
              </div>
              <div>
                <h3>Virtual Patient</h3>
                <p style={{ fontSize: 12, color: colors.muted }}>
                  Internal Medicine · Simulated Case
                </p>
              </div>
            </div>

            <div style={{
              background: dark ? "#101a29" : "#f8fafc",
              border: `1px solid ${colors.border}`,
              borderRadius: 12,
              padding: 15,
              height: 350,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 13,
            }}>
              {messages.map((m, i) => (
                <div key={i} style={{
                  alignSelf: m.from === "doctor" ? "flex-start" : "flex-end",
                  maxWidth: "85%",
                  padding: "11px 14px",
                  borderRadius: 13,
                  background: m.from === "doctor"
                    ? (dark ? "#203344" : "#e0f2fe")
                    : (dark ? "#123b3b" : "#e0f2f1"),
                  lineHeight: 1.8,
                  fontSize: 14,
                }}>
                  <div style={{
                    fontSize: 11, fontWeight: 800,
                    color: m.from === "doctor" ? "#3B82F6" : "#0D9488",
                    marginBottom: 4,
                  }}>
                    {m.from === "doctor" ? "Doctor (You)" : "Patient"}
                  </div>
                  {m.text}
                </div>
              ))}
            </div>

            <form onSubmit={sendQuestion} style={{
              display: "flex", gap: 8, marginTop: 14,
            }}>
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="اسأل المريض عن الأعراض أو التاريخ المرضي..."
                style={{
                  flex: 1, minWidth: 0, padding: 13,
                  borderRadius: 11, border: `1px solid ${colors.border}`,
                  background: colors.soft, color: colors.text,
                  outline: "none", fontFamily: "inherit",
                }}
              />
              <button type="submit" style={primaryButton}>
                <Send size={18} />
              </button>
            </form>

            <p style={{
              color: colors.muted, fontSize: 12,
              lineHeight: 1.8, marginTop: 14,
            }}>
              هذه نسخة أولية لمحاكاة المريض بإجابات تجريبية محددة. سيتم ربط
              المحادثة بمحرك الذكاء الاصطناعي الحقيقي في المرحلة التالية.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

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
      // Theme remains active for this visit.
    }
  }, [darkMode]);

  const filteredTools = tools.filter((tool) =>
    (tool.title + tool.subtitle + tool.desc)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const selectedTool = tools.find((tool) => tool.id === selected);

  if (page === "tutor") {
    return (
      <Tutor
        onBack={() => setPage("home")}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    );
  }

  if (page === "cases") {
    return (
      <ClinicalCases
        darkMode={darkMode}
        onBack={() => setPage("home")}
      />
    );
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
                    } else if (tool.id === "cases") {
                      setPage("cases");
                    } else {
                      setSelected(tool.id);
                    }
                  }}
                >
                  <div
                    className="dashboard-tool-icon"
                    style={{ background: tool.bg, color: tool.color }}
                  >
                    <Icon size={26} />
                  </div>

                  <div
                    className="dashboard-tool-subtitle"
                    style={{ color: tool.color }}
                  >
                    {tool.subtitle}
                  </div>

                  <h3>{tool.title}</h3>
                  <p>{tool.desc}</p>

                  <span
                    className="dashboard-tool-link"
                    style={{ color: tool.color }}
                  >
                    استكشف الأداة <ChevronLeft size={17} />
                  </span>
                </button>
              );
            })}
          </div>

          {filteredTools.length === 0 && (
            <p className="dashboard-empty">
              لا توجد أدوات مطابقة للبحث.
            </p>
          )}
        </section>

        {selectedTool && (
          <section className="selected-tool-panel">
            <div className="selected-tool-heading">
              <h2>{selectedTool.title}</h2>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="إغلاق"
              >
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
