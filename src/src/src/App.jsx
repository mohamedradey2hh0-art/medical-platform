
import React, { useEffect, useRef, useState } from "react";
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
  Loader2,
  AlertTriangle,
  Microscope,
  ClipboardCheck,
} from "lucide-react";

import Tutor from "./Tutor.jsx";
import HealthAssistant from "./HealthAssistant.jsx";

const API_URL =
  "https://medmind-test.mohamedradey2hh0.workers.dev/";

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
    id: "health",
    icon: HeartPulse,
    title: "المساعد الصحي الذكي",
    subtitle: "AI Health Assistant",
    desc: "تحدث عن مشكلتك الصحية وافهم أعراضك واحصل على توجيه صحي مبدئي.",
    color: "#0D9488",
    bg: "#CCFBF1",
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
    desc: "طوّر تفكيرك الإكلينيكي من خلال حالات تدريبية تفاعلية.",
    color: "#7C3AED",
    bg: "#EDE9FE",
  },
];

const THEME_KEY = "medmind-theme";

const specialties = [
  {
    name: "Internal Medicine",
    ar: "الباطنة",
    icon: HeartPulse,
    color: "#0D9488",
    caseId: "internal_chest_pain",
    caseTitle: "Chest Pain",
  },
  {
    name: "Pediatrics",
    ar: "الأطفال",
    icon: UserRound,
    color: "#2563EB",
    caseId: "pediatrics_fever",
    caseTitle: "Pediatric Fever",
  },
  {
    name: "Surgery",
    ar: "الجراحة",
    icon: Activity,
    color: "#D97706",
    caseId: "surgery_abdominal_pain",
    caseTitle: "Acute Abdominal Pain",
  },
  {
    name: "Cardiology",
    ar: "القلب",
    icon: HeartPulse,
    color: "#E11D48",
    caseId: "cardiology_palpitations",
    caseTitle: "Palpitations",
  },
  {
    name: "Neurology",
    ar: "المخ والأعصاب",
    icon: Brain,
    color: "#7C3AED",
    caseId: "neurology_headache",
    caseTitle: "Headache",
  },
  {
    name: "Emergency",
    ar: "الطوارئ",
    icon: Activity,
    color: "#EA580C",
    caseId: "emergency_trauma",
    caseTitle: "Emergency Assessment",
  },
];


// ==========================================
// CLINICAL CASES
// ==========================================

function ClinicalCases({ darkMode, onBack }) {
  const [mode, setMode] = useState(null);

  const [specialty, setSpecialty] = useState(
    "Internal Medicine"
  );

  const [answer, setAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [gradeResult, setGradeResult] = useState(null);
  const [grading, setGrading] = useState(false);

  const [caseChatInput, setCaseChatInput] = useState("");
  const [caseChatMessages, setCaseChatMessages] = useState([]);
  const [caseChatLoading, setCaseChatLoading] = useState(false);
  const [caseChatError, setCaseChatError] = useState("");

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  const dark = darkMode;

  const colors = {
    page: dark ? "#0b1220" : "#f5f7fb",
    card: dark ? "#151f30" : "#ffffff",
    text: dark ? "#e5edf7" : "#172b4d",
    muted: dark ? "#a8b6c9" : "#64748b",
    border: dark ? "#29364a" : "#e5eaf0",
    soft: dark ? "#1e293b" : "#f1f5f9",
    assistant: dark ? "#1e293b" : "#f8fafc",
    primary: "#0D9488",
  };

  const selectedSpecialty =
    specialties.find(s => s.name === specialty) ||
    specialties[0];

  const caseOptions = [
    "Acute myocardial infarction",
    "Gastroesophageal reflux disease",
    "Musculoskeletal chest pain",
    "Pneumonia",
  ];

  const pageStyle = {
    minHeight: "100vh",
    background: colors.page,
    color: colors.text,
    padding: "24px 16px 60px",
    transition: "0.2s",
    fontFamily: "inherit",
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

  // Scroll to latest chat message.
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  // Stop reading when component unmounts.
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);


  // ========================================
  // READY-MADE CASE RESET
  // ========================================

  const resetCase = () => {
    setAnswer("");
    setShowResult(false);
    setGradeResult(null);
    setGrading(false);
    setCaseChatInput("");
    setCaseChatMessages([]);
    setCaseChatError("");
  };

  async function submitCaseAnswer() {
    if (!answer || showResult || grading) return;

    setGrading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "mcq_grade",
          caseId: "chest_pain_001",
          answer,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "تعذر تصحيح الإجابة.");
      }

      setGradeResult(data);
      setShowResult(true);
    } catch (err) {
      setError(err.message || "حصلت مشكلة أثناء تصحيح الإجابة.");
    } finally {
      setGrading(false);
    }
  }

  async function sendCaseChat(e) {
    e?.preventDefault();

    const message = caseChatInput.trim();
    if (!message || caseChatLoading || !showResult) return;

    if (!gradeResult?.sessionToken) {
      setCaseChatError("جلسة الحالة غير صالحة. أعد إرسال الإجابة للحصول على جلسة جديدة.");
      return;
    }

    const history = caseChatMessages.map(item => ({
      role: item.from === "user" ? "user" : "assistant",
      text: item.text,
    }));

    const assistantId = `case-chat-${Date.now()}`;
    const controller = new AbortController();

    setCaseChatInput("");
    setCaseChatError("");
    setCaseChatMessages(prev => [
      ...prev,
      { from: "user", text: message },
      { id: assistantId, from: "assistant", text: "" },
    ]);
    setCaseChatLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "mcq_chat",
          caseId: "chest_pain_001",
          // The Worker verifies that the student completed this case first.
          sessionToken: gradeResult?.sessionToken,
          question: message,
          history,
        }),
      });

      if (!response.ok) {
        let messageText = "تعذر الاتصال بمساعد الحالة.";
        try {
          const data = await response.json();
          messageText = data.error || messageText;
        } catch {}
        throw new Error(messageText);
      }

      if (!response.body) {
        throw new Error("الاتصال لا يدعم استقبال الرد.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let receivedText = "";
      let finished = false;

      function processChatFrame(frame) {
        const lines = frame.split(/\r?\n/);
        const eventName = lines.find(line => line.startsWith("event:"))?.slice(6).trim();
        const dataLines = lines.filter(line => line.startsWith("data:")).map(line => line.slice(5).trim());
        if (!dataLines.length) return;

        const rawData = dataLines.join("\n");
        if (rawData === "[DONE]") {
          finished = true;
          return;
        }

        let data;
        try {
          data = JSON.parse(rawData);
        } catch {
          throw new Error("وصلت بيانات غير مكتملة من المساعد.");
        }

        if (eventName === "error" || data.error) {
          throw new Error(data.error || "انقطع الاتصال أثناء الرد.");
        }

        if (typeof data.text === "string") {
          receivedText += data.text;
          setCaseChatMessages(prev => prev.map(item =>
            item.id === assistantId ? { ...item, text: receivedText } : item
          ));
        }
      }

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const frames = buffer.split(/\r?\n\r?\n/);
        buffer = frames.pop() || "";
        for (const frame of frames) processChatFrame(frame);
      }

      buffer += decoder.decode();
      if (buffer.trim()) processChatFrame(buffer);

      if (!receivedText.trim() || !finished) {
        throw new Error("الرد وصل بشكل غير مكتمل. حاول مرة أخرى.");
      }
    } catch (err) {
      setCaseChatError(err.message || "حصلت مشكلة أثناء المحادثة.");
      setCaseChatMessages(prev => prev.filter(item => item.id !== assistantId || item.text.trim()));
    } finally {
      setCaseChatLoading(false);
    }
  }


  // ========================================
  // STREAMING AI PATIENT CHAT
  // ========================================

  async function sendToPatient(
    message,
    isStarting = false
  ) {
    if (loading) return;

    const currentQuestion = message.trim();

    if (!currentQuestion) return;

    const history = messages.map(m => ({
      role: m.from === "doctor"
        ? "user"
        : "assistant",
      text: m.text,
    }));

    const patientMessageId =
      `patient-${Date.now()}-${Math.random()}`;

    const controller = new AbortController();

    abortRef.current = controller;

    if (!isStarting) {
      setMessages(prev => [
        ...prev,
        {
          from: "doctor",
          text: currentQuestion,
        },
        {
          id: patientMessageId,
          from: "patient",
          text: "",
        },
      ]);
    } else {
      setMessages([
        {
          id: patientMessageId,
          from: "patient",
          text: "",
        },
      ]);
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "clinical_patient",
          specialty: selectedSpecialty.name,
          caseId: selectedSpecialty.caseId,
          question: currentQuestion,
          history,
        }),
      });

      if (!response.ok) {
        let message = "تعذر الاتصال بمحرك الحالات الإكلينيكية.";

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
      let finished = false;

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

        if (rawData === "[DONE]") {
          finished = true;
          return;
        }

        let data;

        try {
          data = JSON.parse(rawData);
        } catch {
          throw new Error("وصلت بيانات غير مكتملة من المحرك.");
        }

        if (eventName === "error" || data.error) {
          throw new Error(
            data.error || "انقطع الاتصال أثناء الرد."
          );
        }

        if (typeof data.text === "string") {
          receivedText += data.text;

          setMessages(prev =>
            prev.map(m =>
              m.id === patientMessageId
                ? {
                    ...m,
                    text: receivedText,
                  }
                : m
            )
          );
        }
      }

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, {
          stream: true,
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
        throw new Error("المريض الافتراضي لم يرسل ردًا. حاول مرة أخرى.");
      }

      if (!finished) {
        throw new Error(
          "الرد وصل بشكل غير مكتمل. أعد المحاولة."
        );
      }

    } catch (err) {
      if (err.name === "AbortError") return;

      console.error("Clinical patient error:", err);

      setError(
        err.message || "حصلت مشكلة أثناء المحاكاة."
      );

      setMessages(prev =>
        prev.filter(
          m => m.id !== patientMessageId || m.text.trim()
        )
      );

    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
      }

      setLoading(false);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }


  // ========================================
  // START A NEW INTERACTIVE CASE
  // ========================================

  function startInteractiveCase() {
    setMessages([]);
    setError("");
    setQuestion("");
    setMode("interactive");

    sendToPatient(
      "ابدأ المحاكاة بحالة سريرية مناسبة للتخصص المحدد. قدم نفسك للمريض كطبيب وابدأ أول جملة من المريض بشكل طبيعي. لا تكشف التشخيص.",
      true
    );
  }


  // ========================================
  // SEND DOCTOR QUESTION
  // ========================================

  function sendQuestion(e) {
    e.preventDefault();

    if (!question.trim() || loading) return;

    const currentQuestion = question.trim();

    setQuestion("");

    sendToPatient(currentQuestion);
  }


  // ========================================
  // RESET INTERACTIVE CASE
  // ========================================

  function resetInteractiveCase() {
    if (loading) return;

    setMessages([]);
    setQuestion("");
    setError("");

    startInteractiveCase();
  }


  return (
    <div style={pageStyle} dir="rtl">
      <div style={{ maxWidth: 950, margin: "auto" }}>

        {/* BACK BUTTON */}

        <button
          onClick={() => {
            if (loading) return;

            if (mode) {
              setMode(null);
            } else {
              onBack();
            }
          }}
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


        {/* PAGE HEADER */}

        <div
          style={{
            ...cardStyle,
            background: "linear-gradient(120deg,#087e78,#075b63)",
            color: "white",
            marginBottom: 25,
            padding: 28,
          }}
        >
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}>
            <Stethoscope size={36} />

            <div>
              <h1 style={{
                fontSize: 27,
                fontWeight: 900,
                margin: 0,
              }}>
                Clinical Cases
              </h1>

              <p style={{
                color: "#d9f3ef",
                fontSize: 13,
                marginTop: 6,
              }}>
                Learn clinical reasoning through real-world scenarios.
              </p>
            </div>
          </div>
        </div>


        {/* MAIN MENU */}

        {!mode && (
          <>
            <h2 style={{
              fontSize: 21,
              marginBottom: 8,
            }}>
              اختر طريقة التدريب
            </h2>

            <p style={{
              color: colors.muted,
              marginBottom: 20,
              fontSize: 14,
            }}>
              تدرب على الحالات الطبية بالطريقة التي تناسبك.
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
              gap: 16,
            }}>

              {/* READY CASES */}

              <button
                onClick={() => setMode("ready")}
                style={{
                  ...cardStyle,
                  cursor: "pointer",
                  textAlign: "right",
                }}
              >
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 15,
                  background: "#E0F2F1",
                  color: "#0D9488",
                  display: "grid",
                  placeItems: "center",
                  marginBottom: 16,
                }}>
                  <ClipboardList size={27} />
                </div>

                <h3 style={{
                  fontSize: 18,
                  marginBottom: 8,
                }}>
                  Ready-made Cases
                </h3>

                <p style={{
                  color: colors.muted,
                  lineHeight: 1.9,
                  fontSize: 13,
                }}>
                  حالات سريرية جاهزة بأسئلة واختيارات وتفسير للإجابات.
                </p>

                <div style={{
                  color: "#0D9488",
                  fontWeight: 800,
                  marginTop: 18,
                }}>
                  ابدأ التدريب
                  <ChevronLeft
                    size={17}
                    style={{ verticalAlign: "middle" }}
                  />
                </div>
              </button>


              {/* INTERACTIVE CASES */}

              <button
                onClick={() => setMode("choose-specialty")}
                style={{
                  ...cardStyle,
                  cursor: "pointer",
                  textAlign: "right",
                }}
              >
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 15,
                  background: "#EDE9FE",
                  color: "#7C3AED",
                  display: "grid",
                  placeItems: "center",
                  marginBottom: 16,
                }}>
                  <Bot size={27} />
                </div>

                <h3 style={{
                  fontSize: 18,
                  marginBottom: 8,
                }}>
                  AI Interactive Cases
                </h3>

                <p style={{
                  color: colors.muted,
                  lineHeight: 1.9,
                  fontSize: 13,
                }}>
                  قابل مريضًا افتراضيًا ذكيًا، خذ التاريخ المرضي،
                  واطلب الفحوصات وحدد التشخيص.
                </p>

                <div style={{
                  color: "#7C3AED",
                  fontWeight: 800,
                  marginTop: 18,
                }}>
                  ابدأ المحاكاة
                  <ChevronLeft
                    size={17}
                    style={{ verticalAlign: "middle" }}
                  />
                </div>
              </button>

            </div>


            {/* SPECIALTY SELECTION */}

            <h2 style={{
              fontSize: 19,
              margin: "32px 0 15px",
            }}>
              Choose Specialty
            </h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
              gap: 10,
            }}>
              {specialties.map(s => {
                const Icon = s.icon;

                return (
                  <button
                    key={s.name}
                    onClick={() => setSpecialty(s.name)}
                    style={{
                      ...buttonStyle,
                      borderColor:
                        specialty === s.name
                          ? s.color
                          : colors.border,
                      background:
                        specialty === s.name
                          ? dark
                            ? "#203344"
                            : "#f0fdfa"
                          : colors.card,
                    }}
                  >
                    <Icon size={21} color={s.color} />

                    <div style={{
                      fontWeight: 800,
                      marginTop: 8,
                    }}>
                      {s.ar}
                    </div>

                    <div style={{
                      fontSize: 11,
                      color: colors.muted,
                    }}>
                      {s.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}


        {/* SPECIALTY SELECTION BEFORE INTERACTIVE CASE */}

        {mode === "choose-specialty" && (
          <div style={cardStyle}>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 20,
            }}>
              <Microscope size={25} color="#0D9488" />

              <div>
                <h2 style={{
                  fontSize: 20,
                  margin: 0,
                }}>
                  اختر التخصص
                </h2>

                <p style={{
                  color: colors.muted,
                  fontSize: 13,
                  marginTop: 5,
                }}>
                  حدد المجال الذي تريد التدريب عليه.
                </p>
              </div>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
              gap: 10,
            }}>
              {specialties.map(s => {
                const Icon = s.icon;

                return (
                  <button
                    key={s.name}
                    onClick={() => setSpecialty(s.name)}
                    style={{
                      ...buttonStyle,
                      borderColor:
                        specialty === s.name
                          ? s.color
                          : colors.border,
                      background:
                        specialty === s.name
                          ? dark
                            ? "#203344"
                            : "#f0fdfa"
                          : colors.card,
                    }}
                  >
                    <Icon size={24} color={s.color} />

                    <div style={{
                      marginTop: 8,
                      fontWeight: 800,
                    }}>
                      {s.ar}
                    </div>

                    <div style={{
                      color: colors.muted,
                      fontSize: 11,
                    }}>
                      {s.name}
                    </div>
                  </button>
                );
              })}
            </div>

            <div style={{
              marginTop: 22,
              padding: 15,
              background: colors.soft,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}>
              <Bot size={26} color="#0D9488" />

              <div>
                <strong>
                  {selectedSpecialty.ar}
                </strong>

                <p style={{
                  fontSize: 12,
                  color: colors.muted,
                  marginTop: 4,
                }}>
                  First case: {selectedSpecialty.caseTitle}
                </p>
              </div>
            </div>

            <button
              onClick={startInteractiveCase}
              style={{
                ...primaryButton,
                width: "100%",
                marginTop: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
              }}
            >
              <Stethoscope size={19} />
              ابدأ حالة سريرية
            </button>

            <p style={{
              fontSize: 11,
              color: colors.muted,
              textAlign: "center",
              marginTop: 12,
              lineHeight: 1.8,
            }}>
              هذه محاكاة تعليمية لحالات افتراضية وليست استشارة لمريض حقيقي.
            </p>
          </div>
        )}


        {/* READY-MADE CASE */}

        {mode === "ready" && (
          <div style={cardStyle}>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}>
              <span style={{
                color: "#0D9488",
                fontWeight: 800,
                fontSize: 13,
              }}>
                Internal Medicine · Case 001
              </span>

              <span style={{
                color: colors.muted,
                fontSize: 12,
              }}>
                <Clock3
                  size={14}
                  style={{ verticalAlign: "middle" }}
                />
                {" "}5 min
              </span>
            </div>

            <h2 style={{
              fontSize: 22,
              margin: "18px 0 12px",
            }}>
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

              <br />

              <strong>Initial investigations:</strong>

              <br />

              ECG: ST elevation in leads II, III and aVF, with reciprocal ST depression in I and aVL.

              <br />

              High-sensitivity troponin: 96 ng/L (upper reference limit 26 ng/L), rising to 540 ng/L after 3 hours.
            </div>

            <h3 style={{
              margin: "22px 0 12px",
              fontSize: 17,
            }}>
              What is the most likely diagnosis?
            </h3>

            <div style={{
              display: "grid",
              gap: 10,
            }}>
              {caseOptions.map((option, i) => (
                <button
                  key={option}
                  disabled={showResult || grading}
                  onClick={() => {
                    if (!showResult && !grading) setAnswer(option);
                  }}
                  style={{
                    ...buttonStyle,
                    cursor: showResult ? "default" : "pointer",
                    opacity: showResult ? 0.95 : 1,
                    borderColor:
                      answer === option
                        ? "#0D9488"
                        : colors.border,
                    background:
                      answer === option
                        ? dark
                          ? "#123b3b"
                          : "#f0fdfa"
                        : colors.card,
                    fontWeight:
                      answer === option
                        ? 800
                        : 500,
                  }}
                >
                  <span style={{
                    marginLeft: 10,
                    color: colors.muted,
                  }}>
                    {String.fromCharCode(65 + i)}.
                  </span>

                  {option}

                  {showResult && gradeResult?.correctAnswer === option && (
                    <CheckCircle2
                      color="#16A34A"
                      size={18}
                      style={{ float: "left" }}
                    />
                  )}
                  {showResult && answer === option && !gradeResult?.isCorrect && (
                    <AlertTriangle
                      color="#EF4444"
                      size={18}
                      style={{ float: "left" }}
                    />
                  )}
                </button>
              ))}
            </div>

            {!showResult ? (
              <button
                disabled={!answer || grading}
                onClick={submitCaseAnswer}
                style={{
                  ...primaryButton,
                  marginTop: 20,
                  opacity: answer && !grading ? 1 : 0.5,
                }}
              >
                {grading ? "جاري التصحيح..." : "Check Answer"}
              </button>
            ) : (
              <div style={{
                marginTop: 22,
                padding: 18,
                borderRadius: 12,
                background: gradeResult?.isCorrect
                  ? (dark ? "#123b2b" : "#ecfdf5")
                  : (dark ? "#3b2525" : "#fef2f2"),
                lineHeight: 2,
              }}>
                <h3 style={{
                  color: gradeResult?.isCorrect ? "#16A34A" : "#EF4444",
                  marginBottom: 8,
                }}>
                  {gradeResult?.isCorrect ? "Correct Answer!" : "Not quite. Review the explanation."}
                </h3>

                <strong>{gradeResult?.diagnosis}</strong>

                <p style={{ fontSize: 14, marginTop: 8 }}>
                  {gradeResult?.caseExplanation}
                </p>

                <strong>Why each option?</strong>
                <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
                  {(gradeResult?.optionExplanations || []).map((item, index) => (
                    <div key={item.option} style={{
                      padding: 11,
                      borderRadius: 10,
                      background: colors.soft,
                      border: `1px solid ${colors.border}`,
                    }}>
                      <strong style={{ color: item.correct ? "#16A34A" : colors.text }}>
                        {String.fromCharCode(65 + index)}. {item.option}
                      </strong>
                      <p style={{ fontSize: 13, margin: "4px 0 0" }}>{item.explanation}</p>
                    </div>
                  ))}
                </div>

                <strong style={{ display: "block", marginTop: 15 }}>Important investigations:</strong>
                <ul style={{ paddingRight: 22, fontSize: 14 }}>
                  <li>Immediate 12-lead ECG.</li>
                  <li>Serial cardiac troponins.</li>
                  <li>Continuous cardiac monitoring.</li>
                </ul>

                <strong>Clinical Pearl:</strong>
                <p style={{ fontSize: 14 }}>{gradeResult?.clinicalPearl}</p>

                <strong>Exam Tip:</strong>
                <p style={{ fontSize: 14 }}>{gradeResult?.examTip}</p>

                <button
                  onClick={resetCase}
                  style={{
                    ...primaryButton,
                    marginTop: 15,
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                  }}
                >
                  <RotateCcw size={16} />
                  Reset Case
                </button>
              </div>
            )}

            {error && !showResult && (
              <p style={{ color: "#EF4444", fontSize: 13, marginTop: 10 }}>{error}</p>
            )}

            {showResult && (
              <section style={{
                marginTop: 22,
                padding: 16,
                border: `1px solid ${colors.border}`,
                borderRadius: 14,
                background: colors.soft,
              }}>
                <h3 style={{ margin: "0 0 6px", fontSize: 17 }}>Discuss this case with MedMind</h3>
                <p style={{ color: colors.muted, fontSize: 13, marginTop: 0 }}>
                  اسأل عن التشخيص أو الـ ECG أو سبب استبعاد أي اختيار، واطلب شرحًا أبسط أو أعمق.
                </p>

                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  maxHeight: 360,
                  overflowY: "auto",
                  marginBottom: 12,
                }}>
                  {caseChatMessages.map((item, index) => (
                    <div key={item.id || index} style={{
                      alignSelf: item.from === "user" ? "flex-start" : "flex-end",
                      maxWidth: "90%",
                      padding: 12,
                      borderRadius: 12,
                      background: item.from === "user"
                        ? (dark ? "#203344" : "#e0f2fe")
                        : (dark ? "#123b3b" : "#e0f2f1"),
                      lineHeight: 1.8,
                      fontSize: 13,
                      whiteSpace: "pre-wrap",
                    }}>
                      <strong style={{ display: "block", fontSize: 11, marginBottom: 4 }}>
                        {item.from === "user" ? "You" : "MedMind"}
                      </strong>
                      {item.text}
                    </div>
                  ))}
                  {caseChatLoading && <p style={{ color: "#0D9488", fontSize: 12 }}>MedMind بيرد...</p>}
                </div>

                {caseChatError && (
                  <p style={{ color: "#EF4444", fontSize: 12 }}>{caseChatError}</p>
                )}

                <form onSubmit={sendCaseChat} style={{ display: "flex", gap: 8 }}>
                  <input
                    value={caseChatInput}
                    onChange={event => setCaseChatInput(event.target.value)}
                    disabled={caseChatLoading}
                    placeholder="اكتب سؤالك عن الحالة..."
                    style={{
                      flex: 1,
                      minWidth: 0,
                      padding: 12,
                      borderRadius: 10,
                      border: `1px solid ${colors.border}`,
                      background: colors.card,
                      color: colors.text,
                      fontFamily: "inherit",
                    }}
                  />
                  <button type="submit" disabled={!caseChatInput.trim() || caseChatLoading} style={{
                    ...primaryButton,
                    opacity: !caseChatInput.trim() || caseChatLoading ? 0.5 : 1,
                  }}>
                    {caseChatLoading ? <Loader2 size={18} /> : <Send size={18} />}
                  </button>
                </form>
              </section>
            )}
          </div>
        )}


        {/* AI INTERACTIVE PATIENT */}

        {mode === "interactive" && (
          <div style={cardStyle}>

            {/* PATIENT HEADER */}

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
              borderBottom: `1px solid ${colors.border}`,
              paddingBottom: 16,
              marginBottom: 16,
            }}>

              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}>
                <div style={{
                  background: "#EDE9FE",
                  color: "#7C3AED",
                  width: 45,
                  height: 45,
                  borderRadius: 13,
                  display: "grid",
                  placeItems: "center",
                }}>
                  <Bot size={25} />
                </div>

                <div>
                  <h3 style={{
                    margin: 0,
                    fontSize: 17,
                  }}>
                    Virtual Patient
                  </h3>

                  <p style={{
                    fontSize: 12,
                    color: colors.muted,
                    marginTop: 5,
                  }}>
                    {selectedSpecialty.ar} · AI Simulation
                  </p>
                </div>
              </div>

              <button
                onClick={resetInteractiveCase}
                disabled={loading}
                style={{
                  ...buttonStyle,
                  width: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  color: "#0D9488",
                  fontSize: 12,
                  opacity: loading ? 0.5 : 1,
                }}
              >
                <RotateCcw size={15} />
                حالة جديدة
              </button>
            </div>


            {/* CASE INFORMATION */}

            <div style={{
              background: colors.soft,
              borderRadius: 12,
              padding: 13,
              marginBottom: 15,
              display: "flex",
              alignItems: "center",
              gap: 9,
            }}>
              <ClipboardCheck
                size={21}
                color="#0D9488"
              />

              <div>
                <strong style={{ fontSize: 13 }}>
                  Clinical Training Session
                </strong>

                <p style={{
                  color: colors.muted,
                  fontSize: 11,
                  marginTop: 3,
                }}>
                  خذ التاريخ المرضي واجمع المعلومات قبل تحديد التشخيص.
                </p>
              </div>
            </div>


            {/* CONVERSATION */}

            <div style={{
              background: dark ? "#101a29" : "#f8fafc",
              border: `1px solid ${colors.border}`,
              borderRadius: 14,
              padding: 15,
              minHeight: 300,
              maxHeight: 480,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 13,
            }}>

              {messages.length === 0 && !loading && (
                <div style={{
                  textAlign: "center",
                  margin: "auto",
                  color: colors.muted,
                  padding: 30,
                }}>
                  <Bot
                    size={40}
                    color="#93c5fd"
                  />

                  <p style={{
                    marginTop: 12,
                    fontSize: 14,
                  }}>
                    اضغط ابدأ حالة سريرية لبدء المحاكاة.
                  </p>
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={m.id || i}
                  style={{
                    alignSelf:
                      m.from === "doctor"
                        ? "flex-start"
                        : "flex-end",
                    maxWidth: "88%",
                    padding: "12px 15px",
                    borderRadius: 13,
                    background:
                      m.from === "doctor"
                        ? dark
                          ? "#203344"
                          : "#e0f2fe"
                        : dark
                          ? "#123b3b"
                          : "#e0f2f1",
                    color: colors.text,
                    lineHeight: 1.9,
                    fontSize: 14,
                    overflowWrap: "anywhere",
                  }}
                >
                  <div style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color:
                      m.from === "doctor"
                        ? "#3B82F6"
                        : "#0D9488",
                    marginBottom: 5,
                  }}>
                    {m.from === "doctor"
                      ? "Doctor (You)"
                      : "Virtual Patient"}
                  </div>

                  {m.text}
                </div>
              ))}

              {loading && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#0D9488",
                  fontSize: 13,
                }}>
                  <Loader2
                    size={18}
                    style={{
                      animation: "medmindSpin 1s linear infinite",
                    }}
                  />
                  المريض بيرد...
                </div>
              )}

              <div ref={chatEndRef} />
            </div>


            {/* ERROR */}

            {error && (
              <div style={{
                marginTop: 13,
                background: dark ? "#3b2525" : "#fef2f2",
                border: "1px solid #fecaca",
                padding: 12,
                borderRadius: 10,
                fontSize: 12,
                color: dark ? "#fecaca" : "#b91c1c",
                lineHeight: 1.8,
              }}>
                <AlertTriangle
                  size={16}
                  style={{ verticalAlign: "middle" }}
                />
                {" "}{error}
              </div>
            )}


            {/* START BUTTON */}

            {messages.length === 0 && !loading && (
              <button
                onClick={startInteractiveCase}
                style={{
                  ...primaryButton,
                  width: "100%",
                  marginTop: 18,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Stethoscope size={18} />
                ابدأ المقابلة مع المريض
              </button>
            )}


            {/* DOCTOR INPUT */}

            {messages.length > 0 && (
              <form
                onSubmit={sendQuestion}
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 15,
                }}
              >
                <input
                  ref={inputRef}
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  disabled={loading}
                  placeholder="اسأل المريض عن الأعراض أو التاريخ المرضي..."
                  style={{
                    flex: 1,
                    minWidth: 0,
                    padding: 13,
                    borderRadius: 11,
                    border: `1px solid ${colors.border}`,
                    background: colors.soft,
                    color: colors.text,
                    outline: "none",
                    fontFamily: "inherit",
                    fontSize: 13,
                  }}
                />

                <button
                  type="submit"
                  disabled={loading || !question.trim()}
                  style={{
                    ...primaryButton,
                    padding: "12px 17px",
                    display: "grid",
                    placeItems: "center",
                    opacity:
                      loading || !question.trim()
                        ? 0.5
                        : 1,
                  }}
                >
                  {loading
                    ? <Loader2 size={19} />
                    : <Send size={19} />
                  }
                </button>
              </form>
            )}


            {/* QUICK CLINICAL GUIDANCE */}

            {messages.length > 0 && (
              <div style={{
                marginTop: 16,
                padding: 12,
                borderRadius: 11,
                background: colors.soft,
              }}>
                <p style={{
                  fontSize: 12,
                  color: colors.muted,
                  lineHeight: 1.9,
                }}>
                  <strong style={{ color: colors.text }}>
                    Your role:
                  </strong>

                  {" "}ابدأ بـ History Taking، ثم اطلب الفحوصات اللازمة،
                  وناقش التشخيص والتعامل مع الحالة.
                </p>
              </div>
            )}

            <p style={{
              color: colors.muted,
              fontSize: 11,
              lineHeight: 1.8,
              marginTop: 15,
            }}>
              هذه محاكاة تعليمية بحالات افتراضية. المعلومات والنتائج
              مخصصة للتدريب وليست بديلًا عن البروتوكولات الإكلينيكية.
            </p>
          </div>
        )}

      </div>

      <style>
        {`
          @keyframes medmindSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}


// ==========================================
// MAIN APP
// ==========================================

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

  const filteredTools = tools.filter(tool =>
    (tool.title + tool.subtitle + tool.desc)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const selectedTool = tools.find(
    tool => tool.id === selected
  );

  if (page === "tutor") {
    return (
      <Tutor
        onBack={() => setPage("home")}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    );
  }

  if (page === "health") {
    return (
      <HealthAssistant
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
            <a href="#dashboard" className="active">
              الرئيسية
            </a>

            <a href="#tools">
              الأدوات
            </a>

            <a href="#about">
              عن المنصة
            </a>
          </nav>

          <button
            type="button"
            className="theme-toggle"
            onClick={() =>
              setDarkMode(current => !current)
            }
            aria-label={
              darkMode
                ? "تفعيل الوضع الفاتح"
                : "تفعيل الوضع الليلي"
            }
            title={darkMode ? "الوضع الفاتح" : "الوضع الليلي"}
          >
            {darkMode
              ? <Sun size={18} />
              : <Moon size={18} />
            }

            <span>
              {darkMode
                ? "الوضع الفاتح"
                : "الوضع الليلي"
              }
            </span>
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

            <h1>
              أهلاً بك في MedMind 🩺
            </h1>

            <p>
              رحلتك نحو فهم أعمق للطب تبدأ من هنا.
            </p>
          </div>

          <Stethoscope
            className="hero-watermark"
            size={150}
          />
        </section>


        <section
          id="tools"
          className="dashboard-tools-section"
        >

          <div className="tools-heading">
            <div>
              <h2>
                أدواتك التعليمية والصحية
              </h2>

              <p>
                خدمات تعليمية وصحية ذكية في مكان واحد.
              </p>
            </div>

            <div className="student-badge">
              MEDICAL & HEALTH
            </div>
          </div>


          <div className="dashboard-search">
            <Search color="#087E78" size={20} />

            <input
              value={search}
              onChange={event =>
                setSearch(event.target.value)
              }
              placeholder="ابحث عن أداة..."
              aria-label="ابحث عن أداة"
            />
          </div>


          <div className="tools-grid">
            {filteredTools.map(tool => {
              const Icon = tool.icon;

              return (
                <button
                  key={tool.id}
                  type="button"
                  className="dashboard-tool-card"
                  onClick={() => {
                    if (tool.id === "assistant") {
                      setPage("tutor");

                    } else if (tool.id === "health") {
                      setPage("health");

                    } else if (tool.id === "cases") {
                      setPage("cases");

                    } else {
                      setSelected(tool.id);
                    }
                  }}
                >

                  <div
                    className="dashboard-tool-icon"
                    style={{
                      background: tool.bg,
                      color: tool.color,
                    }}
                  >
                    <Icon size={26} />
                  </div>

                  <div
                    className="dashboard-tool-subtitle"
                    style={{ color: tool.color }}
                  >
                    {tool.subtitle}
                  </div>

                  <h3>
                    {tool.title}
                  </h3>

                  <p>
                    {tool.desc}
                  </p>

                  <span
                    className="dashboard-tool-link"
                    style={{ color: tool.color }}
                  >
                    {tool.id === "health"
                      ? "ابدأ الاستشارة"
                      : tool.id === "cases"
                        ? "ابدأ التدريب"
                        : "استكشف الأداة"
                    }

                    <ChevronLeft size={17} />
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
              <h2>
                {selectedTool.title}
              </h2>

              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="إغلاق"
              >
                <X size={20} />
              </button>
            </div>

            <p>
              {selectedTool.desc}
            </p>

            <p className="development-note">
              هذه الأداة قيد التطوير. سنضيف وظائفها الفعلية في المراحل القادمة.
            </p>

          </section>
        )}


        <section
          id="about"
          className="dashboard-about"
        >
          <GraduationCap
            size={45}
            className="about-graduation-icon"
          />

          <div>
            <h2>
              التعلم والرعاية الصحية بطريقة أذكى
            </h2>

            <p>
              MedMind منصة تهدف إلى مساعدة طلاب الطب على التعلم
              والتدريب، ومساعدة المستخدمين على فهم المعلومات الصحية
              والحصول على التوجيه المناسب.
            </p>
          </div>
        </section>

      </main>


      <footer className="dashboard-footer">
        © 2026 MedMind · Made for learning and better health
      </footer>

    </div>
  );
}
