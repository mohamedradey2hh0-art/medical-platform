
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
  FileText,
  Upload,
  Download,
  Printer,
  Trash2,
  FileDown,
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
  {
    name: "Urology",
    ar: "المسالك البولية",
    icon: Activity,
    color: "#0284C7",
    caseId: "urology_renal_colic",
    caseTitle: "Renal Colic / حصوة بالحالب",
  },
  {
    name: "Obstetrics & Gynecology",
    ar: "النسا والتوليد",
    icon: HeartPulse,
    color: "#DB2777",
    caseId: "obgyn_ectopic_pregnancy",
    caseTitle: "Ectopic Pregnancy / حمل خارج الرحم",
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
  const [readyCaseId, setReadyCaseId] = useState("chest_pain_001");
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

  const readyCases = {
    chest_pain_001: {
      specialty: "Internal Medicine",
      title: "Chest Pain in a 58-year-old Male",
      stem: <>A 58-year-old male presents with severe central pressure-like chest pain for 2 hours, radiating to his left arm. He has hypertension and diabetes. <br/><strong>Vitals:</strong> BP 150/90, HR 105, RR 22, SpO₂ 95%. <br/><strong>ECG:</strong> ST elevation in II, III and aVF with reciprocal depression in I and aVL. <br/><strong>Troponin:</strong> 96 ng/L, rising to 540 ng/L after 3 hours.</>,
      options: ["Acute myocardial infarction", "Gastroesophageal reflux disease", "Musculoskeletal chest pain", "Pneumonia"],
    },
    pediatrics_fever: {
      specialty: "Pediatrics",
      title: "Fever in a 3-year-old Child",
      stem: <>A 3-year-old girl presents with fever for 2 days, runny nose and mild cough. Temperature is 38.5°C, HR 120/min, RR 28/min, SpO₂ 98%. She is alert, drinking fluids, passing urine normally, and has no respiratory distress, rash or neck stiffness. CBC shows WBC 9,800/µL and CRP 7 mg/L.</>,
      options: ["Uncomplicated viral upper respiratory infection", "Bacterial meningitis", "Severe bacterial pneumonia", "Urinary tract infection"],
    },
    surgery_abdominal_pain: {
      specialty: "Surgery",
      title: "Acute Right Lower Quadrant Pain",
      stem: <>A 22-year-old man presents with 14 hours of abdominal pain that began around the umbilicus and migrated to the right lower quadrant. He has anorexia, nausea, one episode of vomiting and low-grade fever. Examination shows localized guarding and rebound tenderness. WBC is 14,800/µL with 82% neutrophils. Ultrasound shows a non-compressible 8.5 mm appendix with periappendiceal inflammation.</>,
      options: ["Acute appendicitis", "Acute gastroenteritis", "Renal colic", "Acute cholecystitis"],
    },
    cardiology_palpitations: {
      specialty: "Cardiology",
      title: "Sudden-Onset Palpitations in a 28-year-old Female",
      stem: <>A 28-year-old woman presents with sudden-onset regular palpitations for one hour and mild lightheadedness. HR is 186/min and regular, BP 112/72 mmHg. ECG shows a regular narrow-complex tachycardia; P waves are not clearly visible. She has no signs of shock or pulmonary edema.</>,
      options: ["Paroxysmal supraventricular tachycardia", "Atrial fibrillation", "Ventricular tachycardia", "Sinus tachycardia"],
    },
    neurology_headache: {
      specialty: "Neurology",
      title: "Recurrent Headache in a 25-year-old Female",
      stem: <>A 25-year-old woman presents with an 8-hour gradual-onset unilateral throbbing headache, moderate to severe in intensity, associated with nausea, photophobia and phonophobia. She has had similar episodes several times yearly. There is no thunderclap onset, fever, neck stiffness, trauma or focal neurological deficit.</>,
      options: ["Migraine without aura", "Subarachnoid hemorrhage", "Bacterial meningitis", "Cluster headache"],
    },
    emergency_trauma: {
      specialty: "Emergency",
      title: "Blunt Abdominal Trauma after a Motorcycle Collision",
      stem: <>A 31-year-old man is brought in 25 minutes after a motorcycle collision. He has left upper abdominal pain, dizziness and weakness. He is pale and clammy; BP 94/62 mmHg, HR 122/min, RR 26/min. Examination shows left upper quadrant tenderness and guarding. eFAST demonstrates free intraperitoneal fluid.</>,
      options: ["Splenic injury with intra-abdominal hemorrhage", "Uncomplicated abdominal wall contusion", "Acute appendicitis", "Renal colic"],
    },
    urology_renal_colic: {
      specialty: "Urology",
      title: "Acute Flank Pain in a 32-year-old Male",
      stem: <>A 32-year-old man presents with sudden severe right flank pain radiating to the groin, associated with nausea and microscopic hematuria. He is afebrile and hemodynamically stable. <br/><strong>Urinalysis:</strong> microscopic blood, no nitrites or significant pyuria. <br/><strong>Imaging:</strong> non-contrast CT shows a 6 mm distal right ureteric calculus with mild hydroureteronephrosis.</>,
      options: ["Ureteric stone (renal colic)", "Acute pyelonephritis", "Acute appendicitis", "Abdominal aortic aneurysm"],
    },
    urology_acute_retention: {
      specialty: "Urology",
      title: "Acute Urinary Retention in a 70-year-old Male",
      stem: <>A 70-year-old man presents with painful inability to pass urine for 10 hours and lower abdominal distension. He reports months of weak stream, hesitancy and nocturia. He is afebrile. Bladder scan shows approximately 850 mL retained urine.</>,
      options: ["Acute urinary retention due to benign prostatic enlargement", "Acute glomerulonephritis", "Renal colic", "Stress urinary incontinence"],
    },
    obgyn_ectopic_pregnancy: {
      specialty: "Obstetrics & Gynecology",
      title: "Early Pregnancy with Pelvic Pain",
      stem: <>A 27-year-old woman presents with 6 weeks of amenorrhea, right-sided pelvic pain and light vaginal bleeding. Urine pregnancy test is positive. Transvaginal ultrasound shows no definite intrauterine pregnancy and a right adnexal mass. She requires urgent assessment for ectopic pregnancy and possible rupture.</>,
      options: ["Ectopic pregnancy", "Threatened miscarriage", "Pelvic inflammatory disease", "Ovarian cyst without complication"],
    },
    obgyn_preeclampsia: {
      specialty: "Obstetrics & Gynecology",
      title: "Hypertension in a 34-week Pregnancy",
      stem: <>A 29-year-old primigravida at 34 weeks presents with severe headache and blurred vision. BP is 168/112 mmHg on repeat measurement. Urine protein is positive and platelet count is reduced. This is a maternal emergency requiring urgent obstetric assessment.</>,
      options: ["Preeclampsia with severe features", "Gestational hypertension without severe features", "Chronic hypertension", "Simple migraine"],
    },
  };
  const selectedReadyCase = readyCases[readyCaseId] || readyCases.chest_pain_001;
  const caseOptions = selectedReadyCase.options;

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
          caseId: readyCaseId,
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
          caseId: readyCaseId,
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
                {selectedReadyCase.specialty} · Clinical Case
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
              {selectedReadyCase.title}
            </h2>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16, marginBottom: 14 }}>
              {Object.entries(readyCases).map(([id, item]) => (
                <button key={id} onClick={() => { setReadyCaseId(id); resetCase(); }} style={{
                  ...buttonStyle, width: "auto", padding: "9px 12px", fontSize: 12,
                  borderColor: readyCaseId === id ? "#0D9488" : colors.border,
                  background: readyCaseId === id ? (dark ? "#123b3b" : "#f0fdfa") : colors.card,
                }}>{({
                  "Internal Medicine": "الباطنة",
                  "Pediatrics": "الأطفال",
                  "Surgery": "الجراحة",
                  "Cardiology": "القلب",
                  "Neurology": "المخ والأعصاب",
                  "Emergency": "الطوارئ",
                  "Urology": "المسالك",
                  "Obstetrics & Gynecology": "النسا والتوليد",
                })[item.specialty] || item.specialty} · {item.title.split(" ").slice(0,3).join(" ")}</button>
              ))}
            </div>

            <div style={{
              background: colors.soft,
              padding: 17,
              borderRadius: 12,
              lineHeight: 2,
              fontSize: 14,
            }}>
              {selectedReadyCase.stem}
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
// NEBRAS EXAM STUDIO
// ==========================================

// Personal sources are stored locally in IndexedDB (per browser/device).
// Shared sources require authenticated server-side storage and are intentionally
// not exposed as public until that backend is configured.
const NEBRAS_DB_NAME = "nebras-exam-studio-db";
const NEBRAS_DB_VERSION = 1;
const NEBRAS_STORE = "personal-sources";

function openNebrasDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) return reject(new Error("المتصفح لا يدعم التخزين المحلي للمصادر."));
    const request = window.indexedDB.open(NEBRAS_DB_NAME, NEBRAS_DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(NEBRAS_STORE)) db.createObjectStore(NEBRAS_STORE, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("تعذر فتح مكتبة المصادر الشخصية."));
  });
}

async function nebrasSourceRequest(mode, action, value) {
  const db = await openNebrasDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(NEBRAS_STORE, mode);
    const store = tx.objectStore(NEBRAS_STORE);
    const request = action === "all" ? store.getAll() : action === "put" ? store.put(value) : store.delete(value);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("تعذر تنفيذ العملية على المصدر."));
    tx.oncomplete = () => db.close();
    tx.onerror = () => { db.close(); reject(tx.error || new Error("فشلت عملية حفظ المصدر.")); };
  });
}

function ExamStudio({ darkMode, onBack }) {
  const TOPICS_KEY = "nebras-exam-studio-topics-v3";
  const [sourceMode, setSourceMode] = useState("personal");
  const [personalSources, setPersonalSources] = useState([]);
  const [sourceBusy, setSourceBusy] = useState(false);
  const [activeSourceId, setActiveSourceId] = useState("");
  const [sourceTitle, setSourceTitle] = useState("");
  const [fileName, setFileName] = useState("");
  const [examText, setExamText] = useState("");
  const [subject, setSubject] = useState("");
  const [classificationMode, setClassificationMode] = useState("auto");
  const [topicsText, setTopicsText] = useState(() => {
    try { return localStorage.getItem(TOPICS_KEY) || ""; }
    catch { return ""; }
  });
  const [questions, setQuestions] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("All");
  const [quizQuestions, setQuizQuestions] = useState(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showQuizResult, setShowQuizResult] = useState(false);
  const dark = darkMode;
  const palette = {
    page: dark ? "#0b1220" : "#f4f7fb", card: dark ? "#151f30" : "#ffffff",
    text: dark ? "#e5edf7" : "#172b4d", muted: dark ? "#a8b6c9" : "#64748b",
    border: dark ? "#29364a" : "#e5eaf0", soft: dark ? "#1e293b" : "#f1f5f9", accent: "#0D9488"
  };
  const topics = [...new Set(topicsText.split(/\r?\n|,/).map(x => x.trim()).filter(Boolean))];
  const isAutoClassification = classificationMode === "auto";

  useEffect(() => {
    let alive = true;
    nebrasSourceRequest("readonly", "all").then(rows => {
      if (alive) setPersonalSources((rows || []).sort((a,b) => (b.updatedAt || 0) - (a.updatedAt || 0)));
    }).catch(() => { if (alive) setError("تعذر تحميل المصادر الشخصية من هذا المتصفح."); });
    return () => { alive = false; };
  }, []);

  const savePersonalSource = async () => {
    if (!examText.trim()) { setError("ارفع ملفًا أو الصق نص المصدر أولًا قبل الحفظ."); return; }
    setSourceBusy(true); setError("");
    try {
      const now = Date.now();
      const id = activeSourceId || (window.crypto?.randomUUID ? window.crypto.randomUUID() : `src-${now}-${Math.random().toString(36).slice(2,8)}`);
      const previous = personalSources.find(x => x.id === id);
      const record = { id, title: (sourceTitle.trim() || fileName || previous?.title || "مصدر بدون اسم").slice(0,120), fileName: fileName || previous?.fileName || "نص ملصق", subject: subject.trim(), text: examText, questions: questions.length ? questions : (previous?.questions || []), createdAt: previous?.createdAt || now, updatedAt: now };
      await nebrasSourceRequest("readwrite", "put", record);
      const rows = await nebrasSourceRequest("readonly", "all");
      setPersonalSources((rows || []).sort((a,b) => (b.updatedAt || 0) - (a.updatedAt || 0)));
      setActiveSourceId(id); setSourceTitle(record.title); setStatus("تم حفظ المصدر في مصادرك الخاصة على هذا الجهاز.");
    } catch (e) { setError(e.message || "تعذر حفظ المصدر. قد تكون مساحة التخزين ممتلئة."); }
    finally { setSourceBusy(false); }
  };

  const loadPersonalSource = source => {
    setExamText(source.text || ""); setFileName(source.fileName || ""); setSubject(source.subject || "");
    setQuestions(Array.isArray(source.questions) ? source.questions : []); setActiveSourceId(source.id); setSourceTitle(source.title || "");
    setQuizQuestions(null); setError(""); setStatus(`تم فتح المصدر: ${source.title}`);
  };

  const deletePersonalSource = async id => {
    if (!window.confirm("هل تريد حذف هذا المصدر من هذا الجهاز؟")) return;
    try {
      await nebrasSourceRequest("readwrite", "delete", id);
      setPersonalSources(rows => rows.filter(x => x.id !== id));
      if (activeSourceId === id) { setActiveSourceId(""); setSourceTitle(""); }
      setStatus("تم حذف المصدر من هذا الجهاز.");
    } catch (e) { setError(e.message || "تعذر حذف المصدر."); }
  };
  const loadScript = (src, test) => new Promise((resolve, reject) => {
    if (test()) return resolve();
    const existing = document.querySelector(`script[data-nebras-src="${src}"]`);
    if (existing) { existing.addEventListener("load", resolve, { once: true }); existing.addEventListener("error", reject, { once: true }); return; }
    const script = document.createElement("script"); script.src = src; script.async = true; script.dataset.nebrasSrc = src;
    script.onload = resolve; script.onerror = () => reject(new Error("تعذر تحميل أداة قراءة الملف. اتأكد من الإنترنت أو الصق نص الامتحان.")); document.head.appendChild(script);
  });
  const extractFileText = async file => {
    const ext = file.name.split(".").pop().toLowerCase();
    if (file.size > 12 * 1024 * 1024) throw new Error("حجم الملف أكبر من 12 MB.");
    if (["txt", "md", "csv"].includes(ext)) return file.text();
    if (ext === "pdf") {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js", () => Boolean(window.pdfjsLib));
      const pdfjs = window.pdfjsLib; pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
      const pages = [];
      for (let n = 1; n <= pdf.numPages; n++) { const page = await pdf.getPage(n); const content = await page.getTextContent(); pages.push(content.items.map(x => x.str).join(" ")); }
      return pages.join("\n\n");
    }
    if (ext === "docx") {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.8.0/mammoth.browser.min.js", () => Boolean(window.mammoth));
      return (await window.mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })).value || "";
    }
    throw new Error("الصيغ المدعومة: PDF وDOCX وTXT وMD وCSV.");
  };
  const handleFile = async event => {
    const file = event.target.files?.[0]; if (!file) return;
    setError(""); setStatus("جاري قراءة الملف..."); setQuestions([]);
    try { const text = await extractFileText(file); if (!text.trim()) throw new Error("لم أستطع استخراج نص. قد يحتاج الملف المصوّر إلى OCR."); setExamText(text); setFileName(file.name); setSourceTitle(current => current || file.name.replace(/\.[^.]+$/, "")); setActiveSourceId(""); setStatus(`تمت قراءة الملف (${text.length.toLocaleString()} حرف).`); }
    catch (e) { setError(e.message || "تعذرت قراءة الملف."); setStatus(""); }
    event.target.value = "";
  };
  const splitExamIntoChunks = (source, maxChars = 9000) => {
    const chunks = []; let rest = source.trim();
    while (rest.length > maxChars) {
      let cut = Math.max(rest.lastIndexOf("\n\n", maxChars), rest.lastIndexOf("\n", maxChars));
      if (cut < maxChars * .5) cut = maxChars;
      chunks.push(rest.slice(0, cut).trim()); rest = rest.slice(cut).trim();
    }
    if (rest) chunks.push(rest); return chunks;
  };
  const parseJsonQuestions = raw => {
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    const first = cleaned.indexOf("{"); const last = cleaned.lastIndexOf("}");
    if (first < 0 || last <= first) throw new Error("تعذر قراءة النتيجة المنظمة من المحرك. جرّب تقسيم الملف أو تقليل حجمه.");
    const data = JSON.parse(cleaned.slice(first, last + 1));
    if (!Array.isArray(data.questions)) throw new Error("المحرك لم يرجع قائمة أسئلة صالحة.");
    return data.questions;
  };
  const generateExam = async () => {
    if (!examText.trim()) { setError("ارفع ملف الامتحان أو الصق النص أولًا."); return; }
    if (!isAutoClassification && !topics.length) { setError("اكتب أسماء الـChapters، كل Chapter في سطر منفصل، أو اختر التصنيف التلقائي."); return; }
    setBusy(true); setError(""); setStatus("بدء استخراج وتصنيف الأسئلة..."); setQuestions([]); setQuizQuestions(null);
    try {
      if (!isAutoClassification) { try { localStorage.setItem(TOPICS_KEY, topics.join("\n")); } catch {} }
      // Keep the answer-key section available to every chunk, even when it is at the end of the source.
      const keyMatch = examText.match(/(?:answer\s*key|answers?\s*key|model\s*answers?|الإجابات\s*النموذجية|مفتاح\s*الإجابة|الإجابات)[:\s\-\n]*[\s\S]{0,12000}$/i);
      const answerKey = keyMatch ? keyMatch[0] : "غير محدد بوضوح في النص المستخرج.";
      const chunks = splitExamIntoChunks(examText);
      let extracted = [];
      for (let i = 0; i < chunks.length; i++) {
        setStatus(`استخراج وتصنيف الجزء ${i + 1} من ${chunks.length}...`);
        const prompt = `مهمتك استخراج الأسئلة الموجودة في الجزء المرفق فقط، وتصنيف كل سؤال حسب المادة والـChapter.
المادة/التخصص الذي حدده المستخدم: ${subject.trim() || "غير محدد؛ استنتج المادة من محتوى الملف دون افتراض غير مدعوم."}
وضع التصنيف: ${isAutoClassification ? "تلقائي" : "يدوي حسب القائمة"}
${isAutoClassification
  ? "استنتج أسماء Chapters طبية واضحة ومتسقة من محتوى الملف. استخدم أسماء Chapters قصيرة باللغة الإنجليزية الطبية. إذا لم تستطع تحديد Chapter بثقة، استخدم Unclassified. لا تستخدم اسم المادة كـChapter إلا إذا كان السؤال عامًا فعلًا."
  : `الموضوعات المسموح بها (استخدم الاسم حرفيًا ولا تنشئ غيرها):\n${topics.map((t,i)=>`${i+1}. ${t}`).join("\n")}`}
قواعد إلزامية:
- استخرج كل سؤال كاملًا مع كل الاختيارات المتاحة. لا تتجاهل أي سؤال.
- لا تضع أي رقم أصلي من الملف في الناتج، ولا تحفظه في أي حقل. الترقيم سيُنشأ لاحقًا داخل كل Chapter.
- لا تكرر السؤال. اختر Topic واحدًا فقط لكل سؤال. إذا تعذر التصنيف استخدم "Unclassified".
- لا تخترع إجابة. استخدم مفتاح الإجابات المرفق إذا كان واضحًا، وإلا اجعل correctAnswer فارغًا وanswerStatus="not_found".
- أعد JSON فقط دون Markdown أو شرح خارجه، بالشكل التالي:
{"questions":[{"topic":"اسم الموضوع أو Unclassified","stem":"نص السؤال","options":["..."],"correctAnswer":"نص الاختيار الصحيح أو فارغ","answerStatus":"key|uncertain|not_found","explanation":"شرح عربي مختصر","optionExplanations":[{"option":"...","explanation":"..."}],"clinicalPearl":"","examTip":""}]}
- لا تضف حقولًا أخرى. احتفظ بصياغة السؤال والاختيارات كما في المصدر. اشرح الاختيارات فقط إذا كان ذلك مدعومًا أو واضحًا علميًا، وميّز عدم اليقين.
هذا الجزء ${i+1} من ${chunks.length}.
مفتاح الإجابات المستخرج من نهاية الملف (قد لا يكون موجودًا):\n${answerKey}
`;
        const response = await fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: "exam_studio", question: prompt, examText: chunks[i], subject, classificationMode, allowedTopics: isAutoClassification ? [] : topics }) });
        if (!response.ok) { let msg = "فشل تحليل جزء من الملف."; try { msg = (await response.json()).error || msg; } catch {} throw new Error(msg); }
        if (!response.body) throw new Error("السيرفر لم يرجع نتيجة.");
        const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = "", output = "";
        while (true) {
          const { value, done } = await reader.read(); if (done) break;
          buffer += decoder.decode(value, { stream: true }); const frames = buffer.split(/\r?\n\r?\n/); buffer = frames.pop() || "";
          for (const frame of frames) { const data = frame.split(/\r?\n/).filter(x => x.startsWith("data:")).map(x => x.slice(5).trim()).join("\n"); if (!data || data === "[DONE]") continue; const parsed = JSON.parse(data); if (parsed.error) throw new Error(parsed.error); if (parsed.text) output += parsed.text; }
        }
        if (buffer.trim()) { const data = buffer.split(/\r?\n/).filter(x=>x.startsWith("data:")).map(x=>x.slice(5).trim()).join("\n"); if (data && data !== "[DONE]") { const parsed=JSON.parse(data); if(parsed.text) output+=parsed.text; if(parsed.error) throw new Error(parsed.error); } }
        extracted = extracted.concat(parseJsonQuestions(output));
      }
      // Keep only allowed topics; any unexpected topic is explicitly unclassified.
      const normalized = extracted.map(q => {
        const proposedTopic = String(q.topic || "").trim();
        return {
          topic: isAutoClassification
            ? (proposedTopic && proposedTopic !== "Unclassified" ? proposedTopic : "Unclassified")
            : (topics.includes(proposedTopic) ? proposedTopic : "Unclassified"),
          stem: String(q.stem || "").trim().replace(/^\s*(?:Q(?:uestion)?\s*)?\d{1,4}\s*[\).:\-]\s*/i, ""),
          options: Array.isArray(q.options) ? q.options.map(String) : [],
          correctAnswer: String(q.correctAnswer || ""),
          answerStatus: ["key","uncertain","not_found"].includes(q.answerStatus) ? q.answerStatus : "uncertain",
          explanation: String(q.explanation || ""),
          optionExplanations: Array.isArray(q.optionExplanations) ? q.optionExplanations : [],
          clinicalPearl: String(q.clinicalPearl || ""), examTip: String(q.examTip || "")
        };
      }).filter(q => q.stem);
      // Remove duplicate questions across chunks using normalized stem + choices.
      const seenQuestions = new Set();
      const uniqueQuestions = normalized.filter(q => {
        const fingerprint = `${q.stem} ${q.options.join(" ")}`.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
        if (!fingerprint || seenQuestions.has(fingerprint)) return false;
        seenQuestions.add(fingerprint);
        return true;
      });
      // Renumber from 1 independently inside each chapter. Original source numbers are discarded.
      const counters = {};
      const numbered = uniqueQuestions.map(q => { counters[q.topic] = (counters[q.topic] || 0) + 1; return { ...q, displayNumber: counters[q.topic] }; });
      setQuestions(numbered);
      if (activeSourceId) {
        const savedSource = personalSources.find(x => x.id === activeSourceId);
        if (savedSource) {
          try {
            const updated = { ...savedSource, questions: numbered, subject: subject.trim() || savedSource.subject || "", updatedAt: Date.now() };
            await nebrasSourceRequest("readwrite", "put", updated);
            setPersonalSources(rows => rows.map(x => x.id === activeSourceId ? updated : x));
          } catch { /* The generated questions remain available in the current session. */ }
        }
      }
      const unclassified = numbered.filter(q => q.topic === "Unclassified").length;
      setStatus(`اكتمل التحليل: ${numbered.length} سؤال بعد إزالة التكرار. ${isAutoClassification ? "تم استنتاج الـChapters تلقائيًا." : "تم الالتزام بالـChapters التي حددتها."} غير مصنف: ${unclassified}. تمت إعادة الترقيم من 1 داخل كل Chapter.`);
    } catch (e) { setError(e.message || "حدث خطأ أثناء التحليل."); setStatus(""); }
    finally { setBusy(false); }
  };
  const moveQuestion = (index, topic) => {
    setQuestions(prev => {
      const copy = prev.map(q => ({ ...q })); copy[index].topic = topic;
      const counters = {}; return copy.map(q => { counters[q.topic] = (counters[q.topic] || 0) + 1; return { ...q, displayNumber: counters[q.topic] }; });
    });
  };
  const chapterNames = [...topics, ...(questions.some(q => q.topic === "Unclassified") ? ["Unclassified"] : [])];
  const chapterCounts = chapterNames.map(topic => ({ topic, count: questions.filter(q => q.topic === topic).length }));
  const startQuiz = topic => {
    const chosen = topic === "All" ? questions : questions.filter(q => q.topic === topic);
    setQuizQuestions(chosen); setQuizIndex(0); setQuizAnswers({}); setShowQuizResult(false);
  };
  const exportWord = () => {
    if (!questions.length) return;
    const content = questions.map(q => `Chapter: ${q.topic}\nQuestion ${q.displayNumber}: ${q.stem}\n${q.options.map((o,i)=>`${String.fromCharCode(65+i)}. ${o}`).join("\n")}\nCorrect answer: ${q.correctAnswer || "Not available in source"}\nExplanation: ${q.explanation}\nClinical Pearl: ${q.clinicalPearl}\nExam Tip: ${q.examTip}`).join("\n\n--------------------\n\n");
    const safe = content.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br>");
    const html = `<!doctype html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;direction:ltr;line-height:1.8;color:#172b4d;padding:36px}header{text-align:center;border-bottom:3px solid #0D9488;padding-bottom:18px;margin-bottom:28px}.brand{font-size:28px;font-weight:700;color:#0D9488}</style></head><body><header><div class="brand">نَبْراس · NEBRAS EXAM STUDIO</div></header>${safe}</body></html>`;
    const url = URL.createObjectURL(new Blob(["\ufeff", html], {type:"application/msword"})); const a=document.createElement("a"); a.href=url; a.download="NEBRAS-Exam-Studio.doc"; a.click(); URL.revokeObjectURL(url);
  };
  const exportPdf = () => {
    if (!questions.length) return;
    const text = questions.map(q => `Chapter: ${q.topic}\nQuestion ${q.displayNumber}: ${q.stem}\n${q.options.map((o,i)=>`${String.fromCharCode(65+i)}. ${o}`).join("\n")}\nCorrect answer: ${q.correctAnswer || "Not available"}\nExplanation: ${q.explanation}\nClinical Pearl: ${q.clinicalPearl}\nExam Tip: ${q.examTip}`).join("\n\n--------------------\n\n");
    const safe=text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br>"); const win=window.open("","_blank");
    if(!win){setError("اسمح بفتح النوافذ المنبثقة لحفظ PDF.");return;}
    win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>NEBRAS Exam Studio</title><style>body{font-family:Arial,sans-serif;line-height:1.9;color:#172b4d;padding:30px}@media print{body{padding:12mm}}</style></head><body><h1>نَبْراس · NEBRAS EXAM STUDIO</h1>${safe}<script>window.onload=()=>window.print();</script></body></html>`); win.document.close();
  };
  const buttonStyle = { border: 0, borderRadius: 12, padding: "12px 16px", background: palette.accent, color: "white", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 };
  const fieldStyle = { width: "100%", boxSizing: "border-box", border: `1px solid ${palette.border}`, borderRadius: 12, padding: 13, background: palette.card, color: palette.text, font: "inherit", outlineColor: palette.accent };
  const quizQuestion = quizQuestions?.[quizIndex];
  return (
    <div dir="rtl" style={{ minHeight:"100vh", background:palette.page, color:palette.text, padding:"22px 16px 48px" }}>
      <div style={{maxWidth:1050,margin:"0 auto"}}>
        <button type="button" onClick={onBack} style={{...buttonStyle,background:palette.soft,color:palette.text,marginBottom:18}}><ChevronLeft size={18}/> رجوع للرئيسية</button>
        <section style={{background:`linear-gradient(135deg,${dark?"#123b42":"#e0f2f1"},${palette.card})`,border:`1px solid ${palette.border}`,borderRadius:22,padding:24,marginBottom:18}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,flexWrap:"wrap"}}><div><div style={{color:palette.accent,fontSize:13,fontWeight:800,letterSpacing:2}}>NEBRAS · EXAM STUDIO</div><h1 style={{margin:"8px 0",fontSize:30}}>نَبْراس</h1><p style={{margin:0,color:palette.muted}}>حدد موضوعاتك، ارفع الامتحان، ودع النظام يصنّف الأسئلة ويجهز امتحانات الفصول.</p></div><div style={{width:76,height:76,borderRadius:22,background:palette.accent,color:"white",display:"grid",placeItems:"center"}}><GraduationCap size={42}/></div></div>
        </section>
        {!quizQuestions && <>
          <section style={{background:palette.card,border:`1px solid ${palette.border}`,borderRadius:18,padding:18,marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
              <div><div style={{fontSize:12,fontWeight:900,color:palette.accent,letterSpacing:1}}>SOURCE LIBRARY</div><h2 style={{margin:"5px 0",fontSize:20}}>مصادر نَبْراس</h2><p style={{margin:0,color:palette.muted,fontSize:12,lineHeight:1.8}}>اختر مصدرًا محفوظًا أو أضف ملفًا جديدًا لتحويله إلى أسئلة وامتحانات.</p></div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <button type="button" onClick={()=>setSourceMode("shared")} style={{...buttonStyle,background:sourceMode==="shared"?palette.accent:palette.soft,color:sourceMode==="shared"?"white":palette.text}}>المكتبة الرسمية</button>
                <button type="button" onClick={()=>setSourceMode("personal")} style={{...buttonStyle,background:sourceMode==="personal"?palette.accent:palette.soft,color:sourceMode==="personal"?"white":palette.text}}>مصادري الخاصة ({personalSources.length})</button>
              </div>
            </div>
            {sourceMode==="shared" ? <div style={{marginTop:15,padding:15,borderRadius:13,border:`1px dashed ${palette.border}`,background:palette.soft}}>
              <strong>المكتبة الرسمية — Shared Sources</strong><p style={{margin:"7px 0 0",fontSize:13,lineHeight:1.9,color:palette.muted}}>واجهة المكتبة جاهزة، لكن لا توجد مصادر رسمية منشورة ومتصلة بالخادم في هذه النسخة. لن نعرض ملفات الطلاب لبعضهم أو نخلطها بالمكتبة الرسمية. تفعيل المشاركة يتطلب قاعدة بيانات وتسجيل دخول وصلاحيات وصول على الخادم.</p>
              <span style={{display:"inline-block",marginTop:9,fontSize:11,fontWeight:800,color:palette.muted}}>بانتظار ربط التخزين المشترك والصلاحيات</span>
            </div> : <div style={{marginTop:15}}>
              {personalSources.length===0 ? <div style={{padding:16,borderRadius:13,background:palette.soft,color:palette.muted,fontSize:13,lineHeight:1.9}}>لسه مفيش مصادر محفوظة. ارفع ملفًا من القسم التالي، ثم اضغط «حفظ في مصادري الخاصة» علشان تقدر ترجع له بعدين على نفس المتصفح والجهاز.</div> : <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10}}>{personalSources.map(source=><article key={source.id} style={{padding:13,border:`1px solid ${palette.border}`,borderRadius:13,background:palette.soft,minWidth:0}}><div style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"start"}}><strong style={{fontSize:14,overflowWrap:"anywhere"}}>{source.title}</strong><button type="button" title="حذف المصدر" onClick={()=>deletePersonalSource(source.id)} style={{border:0,background:"transparent",color:palette.muted,cursor:"pointer"}}><Trash2 size={16}/></button></div><p style={{fontSize:11,color:palette.muted,margin:"7px 0",lineHeight:1.7}}>{source.subject||"بدون مادة محددة"} · {(source.text||"").length.toLocaleString()} حرف · {(source.questions||[]).length} سؤال محفوظ</p><button type="button" onClick={()=>loadPersonalSource(source)} style={{...buttonStyle,width:"100%",justifyContent:"center",padding:"9px 11px",background:activeSourceId===source.id?"#2563eb":palette.accent}}>{activeSourceId===source.id?"المصدر الحالي":"فتح المصدر"}</button></article>)}</div>}
              <p style={{fontSize:11,color:palette.muted,margin:"12px 0 0",lineHeight:1.8}}>خصوصية التخزين: المصادر محفوظة محليًا داخل متصفحك باستخدام IndexedDB، ولا تُرفع إلى خادم مشترك في هذه المرحلة. مسح بيانات المتصفح قد يؤدي لفقدها؛ صدّر أو احتفظ بنسخة أصلية من ملفاتك.</p>
            </div>}
          </section>
          <section style={{background:palette.card,border:`1px solid ${palette.border}`,borderRadius:18,padding:18,marginBottom:16}}>
            <label style={{display:"block",fontWeight:800,marginBottom:8}}>المادة / Subject (اختياري لكنه يساعد على دقة التصنيف)</label>
            <input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="مثال: Pediatrics, Internal Medicine, Surgery..." style={fieldStyle}/>
            <label style={{display:"block",fontWeight:800,margin:"16px 0 8px"}}>طريقة تحديد الـChapter</label>
            <select value={classificationMode} onChange={e=>setClassificationMode(e.target.value)} style={fieldStyle}>
              <option value="auto">تلقائي — لو نسيت، النظام يصنّف الأسئلة طبيًا</option>
              <option value="manual">يدوي — استخدم قائمة الـChapters التي أحددها</option>
            </select>
            <p style={{color:palette.muted,fontSize:12,lineHeight:1.7,marginBottom:0}}>لو اخترت التلقائي، سيستنتج النظام الفصول من محتوى الأسئلة. ولو اخترت اليدوي، سيحترم قائمتك حرفيًا.</p>
          </section>
          <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
            <div style={{background:palette.card,border:`1px solid ${palette.border}`,borderRadius:18,padding:20}}>
              <h2 style={{marginTop:0,fontSize:19}}><Upload size={19} style={{verticalAlign:"middle",marginLeft:7}}/> ملف الامتحان</h2>
              <label style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,padding:24,border:`2px dashed ${palette.accent}`,borderRadius:14,cursor:"pointer",background:palette.soft,textAlign:"center"}}><FileText size={34} color={palette.accent}/><strong>اضغط لاختيار ملف</strong><span style={{color:palette.muted,fontSize:12}}>PDF · DOCX · TXT · MD · CSV (حتى 12 MB)</span><input type="file" accept=".pdf,.docx,.txt,.md,.csv" onChange={handleFile} style={{display:"none"}}/></label>
              {fileName && <p style={{color:palette.accent,fontSize:13}}>الملف: {fileName}</p>}
              <label style={{display:"block",margin:"16px 0 8px",fontWeight:700}}>اسم المصدر (اختياري)</label><input value={sourceTitle} onChange={e=>setSourceTitle(e.target.value)} placeholder="مثال: Pediatrics - Respiratory" style={fieldStyle}/><label style={{display:"block",margin:"16px 0 8px",fontWeight:700}}>أو الصق نص الامتحان</label><textarea value={examText} onChange={e=>{setExamText(e.target.value);setFileName("");setActiveSourceId("");}} rows={9} placeholder="الصق الأسئلة ومفتاح الإجابات هنا..." style={{...fieldStyle,resize:"vertical",lineHeight:1.7}}/>
              <div style={{display:"flex",justifyContent:"space-between",color:palette.muted,fontSize:12,marginTop:7}}><span>{examText.length.toLocaleString()} حرف</span><button type="button" onClick={()=>{setExamText("");setFileName("");setSourceTitle("");setActiveSourceId("");setQuestions([]);setError("");setStatus("");}} style={{border:0,background:"transparent",color:palette.muted,cursor:"pointer"}}><Trash2 size={14} style={{verticalAlign:"middle"}}/> مسح</button></div>
              <button type="button" disabled={!examText.trim()||sourceBusy} onClick={savePersonalSource} style={{...buttonStyle,width:"100%",justifyContent:"center",marginTop:12,opacity:(!examText.trim()||sourceBusy) ? .6 : 1}}>{sourceBusy?"جاري الحفظ...":activeSourceId?"تحديث المصدر المحفوظ":"حفظ في مصادري الخاصة"}</button>
            </div>
            <div style={{background:palette.card,border:`1px solid ${palette.border}`,borderRadius:18,padding:20}}>
              <h2 style={{marginTop:0,fontSize:19}}><ClipboardList size={19} style={{verticalAlign:"middle",marginLeft:7}}/> الموضوعات / Chapters</h2>
              {isAutoClassification
                ? <p style={{color:palette.muted,fontSize:13,lineHeight:1.9}}>التصنيف التلقائي مفعّل. لن تحتاج لكتابة الفصول؛ سيستنتجها النظام من محتوى كل سؤال، ويمكنك تعديل الفصل بعد ظهور النتائج.</p>
                : <>
                    <p style={{color:palette.muted,fontSize:13,lineHeight:1.7}}>اكتب كل Chapter في سطر منفصل. سيتم حفظ قائمتك تلقائيًا لاستخدامها مع الملفات القادمة.</p>
                    <textarea value={topicsText} onChange={e=>setTopicsText(e.target.value)} rows={9} style={{...fieldStyle,resize:"vertical",lineHeight:1.8}}/>
                    <button type="button" onClick={()=>{try{localStorage.setItem(TOPICS_KEY,topics.join("\n"));setStatus("تم حفظ قائمة الـChapters على هذا الجهاز.");}catch{setError("تعذر حفظ الموضوعات في المتصفح.");}}} style={{...buttonStyle,marginTop:10,background:palette.soft,color:palette.text}}>حفظ الـChapters</button>
                  </>
              }
              <button type="button" disabled={busy||!examText.trim()||(!isAutoClassification&&!topics.length)} onClick={generateExam} style={{...buttonStyle,width:"100%",justifyContent:"center",marginTop:12,opacity:busy||!examText.trim()||(!isAutoClassification&&!topics.length) ? .6 : 1}}>{busy?<Loader2 size={18} className="exam-studio-spin"/>:<Sparkles size={18}/>} {busy?"جاري التصنيف...":"استخرج وصنّف كل الأسئلة"}</button>
            </div>
          </section>
          {(status||error)&&<div role="status" style={{marginTop:16,padding:13,borderRadius:12,background:error?(dark?"#451f28":"#fff1f2"):palette.soft,color:error?(dark?"#fecdd3":"#be123c"):palette.text}}>{error||status}</div>}
          {questions.length>0&&<section style={{marginTop:18,background:palette.card,border:`1px solid ${palette.border}`,borderRadius:18,padding:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,flexWrap:"wrap"}}><div><h2 style={{margin:"0 0 6px"}}>نتيجة التصنيف</h2><p style={{margin:0,color:palette.muted}}>إجمالي الأسئلة: {questions.length} · غير مصنف: {questions.filter(q=>q.topic==="Unclassified").length}</p></div><div style={{display:"flex",gap:8,flexWrap:"wrap"}}><button type="button" onClick={()=>startQuiz("All")} style={buttonStyle}>امتحان شامل</button><button type="button" onClick={exportWord} style={buttonStyle}><FileDown size={16}/> Word</button><button type="button" onClick={exportPdf} style={buttonStyle}><Printer size={16}/> PDF</button></div></div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10,marginTop:16}}>{chapterCounts.map(c=><div key={c.topic} style={{padding:13,border:`1px solid ${palette.border}`,borderRadius:12,background:palette.soft}}><strong>{c.topic}</strong><div style={{color:palette.accent,fontWeight:800,marginTop:5}}>{c.count} سؤال</div><button type="button" disabled={!c.count} onClick={()=>startQuiz(c.topic)} style={{...buttonStyle,marginTop:9,padding:"8px 11px",opacity:c.count?1:.45}}>امتحان الفصل</button></div>)}</div>
            <label style={{display:"block",marginTop:20,marginBottom:8,fontWeight:700}}>عرض أسئلة الفصل</label><select value={selectedChapter} onChange={e=>setSelectedChapter(e.target.value)} style={fieldStyle}><option value="All">كل الفصول</option>{chapterNames.map(t=><option key={t}>{t}</option>)}</select>
            {(selectedChapter==="All"?questions:questions.filter(q=>q.topic===selectedChapter)).map(q=>{const index=questions.indexOf(q);return <article key={index} style={{marginTop:14,padding:16,border:`1px solid ${palette.border}`,borderRadius:14}}><div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"center",flexWrap:"wrap"}}><strong>{q.topic} · Question {q.displayNumber}</strong><select value={q.topic} onChange={e=>moveQuestion(index,e.target.value)} style={{...fieldStyle,width:"auto",minWidth:170}}>{chapterNames.filter(t=>t!=="Unclassified").map(t=><option key={t}>{t}</option>)}<option value="Unclassified">Unclassified</option></select></div><p style={{lineHeight:1.8}}>{q.stem}</p><ol type="A">{q.options.map((o,i)=><li key={i} style={{marginBottom:5}}>{o}</li>)}</ol><p><strong>الإجابة:</strong> {q.correctAnswer||"غير موجودة بوضوح في مفتاح الإجابات"} <span style={{color:palette.muted,fontSize:12}}>({q.answerStatus})</span></p><p style={{lineHeight:1.8}}>{q.explanation}</p>{q.clinicalPearl&&<p><strong>Clinical Pearl:</strong> {q.clinicalPearl}</p>}{q.examTip&&<p><strong>Exam Tip:</strong> {q.examTip}</p>}</article>})}
          </section>}
        </>}
        {quizQuestions&&<section style={{marginTop:18,background:palette.card,border:`1px solid ${palette.border}`,borderRadius:18,padding:22}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,flexWrap:"wrap"}}><h2 style={{margin:0}}>{quizQuestions.length?`امتحان ${quizQuestions[0].topic===quizQuestions.at(-1).topic?quizQuestions[0].topic:"شامل"}`:"لا توجد أسئلة"}</h2><button type="button" onClick={()=>setQuizQuestions(null)} style={{...buttonStyle,background:palette.soft,color:palette.text}}>إنهاء الامتحان</button></div>
          {quizQuestions.length>0&&quizQuestion&&<><p style={{color:palette.muted}}>Question {quizIndex+1} / {quizQuestions.length}</p><h3 style={{lineHeight:1.8}}>{quizQuestion.stem}</h3>{quizQuestion.options.map((o,i)=><label key={i} style={{display:"flex",gap:10,alignItems:"center",padding:12,marginTop:8,border:`1px solid ${palette.border}`,borderRadius:12,cursor:"pointer"}}><input type="radio" name={`quiz-${quizIndex}`} checked={quizAnswers[quizIndex]===o} onChange={()=>setQuizAnswers(p=>({...p,[quizIndex]:o}))}/>{o}</label>)}<div style={{display:"flex",gap:8,marginTop:18,flexWrap:"wrap"}}><button type="button" disabled={quizIndex===0} onClick={()=>setQuizIndex(i=>i-1)} style={{...buttonStyle,opacity:quizIndex === 0 ? .5 : 1}}>السابق</button><button type="button" disabled={quizIndex===quizQuestions.length-1} onClick={()=>setQuizIndex(i=>i+1)} style={{...buttonStyle,opacity:quizIndex === quizQuestions.length - 1 ? .5 : 1}}>التالي</button><button type="button" onClick={()=>setShowQuizResult(true)} style={{...buttonStyle,background:"#2563eb"}}>إنهاء وعرض النتيجة</button></div>{showQuizResult&&<div style={{marginTop:18,padding:16,borderRadius:12,background:palette.soft}}><h3>نتيجتك: {quizQuestions.filter((q,i)=>quizAnswers[i]&&quizAnswers[i]===q.correctAnswer).length} / {quizQuestions.length}</h3>{quizQuestions.map((q,i)=><p key={i}>Question {i+1}: {quizAnswers[i]===q.correctAnswer?"✓ صحيح":"✗ خطأ أو بدون إجابة"} — {q.correctAnswer||"الإجابة غير متاحة"}</p>)}</div>}</>}
        </section>}
      </div><style>{`@keyframes examStudioSpin{to{transform:rotate(360deg)}} .exam-studio-spin{animation:examStudioSpin 1s linear infinite}`}</style>
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

  if (page === "exam") {
    return (
      <ExamStudio
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
            نَبْراس <span style={{ fontSize: 11, letterSpacing: 2, marginRight: 7 }}>NEBRAS</span>
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
              أهلاً بك في نَبْراس 🩺
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

                    } else if (tool.id === "questions") {
                      setPage("exam");

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
                        : tool.id === "questions"
                          ? "افتح Exam Studio"
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
        © 2026 نَبْراس NEBRAS · Powered by MedMind
      </footer>

    </div>
  );
}
