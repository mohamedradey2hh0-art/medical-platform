
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
  Lightbulb,
  BookMarked,
  GraduationCap as GraduationCapIcon,
  Target,
  ChevronDown,
  ChevronUp,
  Info,
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
// READY-MADE CASE DATA
// ==========================================

const chestPainCase = {
  title: "Chest Pain in a 58-year-old Male",
  specialty: "Internal Medicine",
  caseNumber: "Case 001",

  description:
    "A 58-year-old male presents to the emergency department with severe central chest pain for 2 hours. The pain is described as pressure-like and radiates to his left arm. He has a history of hypertension and diabetes mellitus.",

  vitals: [
    ["BP", "150/90 mmHg"],
    ["HR", "105 bpm"],
    ["RR", "22/min"],
    ["SpO₂", "95%"],
  ],

  question: "What is the most likely diagnosis?",

  options: [
    {
      id: "A",
      text: "Acute myocardial infarction",
      correct: true,
      explanation:
        "ده الاختيار الصحيح. ألم ضاغط في منتصف الصدر، ممتد للذراع الشمال، مع وجود عوامل خطورة للقلب مثل السكر والضغط. الصورة دي تخلينا نشك بقوة في Acute Coronary Syndrome، ومن الاحتمالات المهمة Acute Myocardial Infarction.",
    },
    {
      id: "B",
      text: "Gastroesophageal reflux disease",
      correct: false,
      explanation:
        "ارتجاع المريء غالبًا يسبب Heartburn أو حرقان خلف عظمة القص، وقد يزيد بعد الأكل أو عند الاستلقاء. لكنه لا يفسر بنفس القوة الألم الضاغط الشديد الممتد للذراع الشمال مع عوامل الخطورة القلبية. ومع ذلك، لا يمكن استبعاد مشكلة القلب لمجرد وجود أعراض تشبه الحموضة.",
    },
    {
      id: "C",
      text: "Musculoskeletal chest pain",
      correct: false,
      explanation:
        "ألم العضلات أو جدار الصدر غالبًا يزيد مع الحركة أو الضغط على مكان الألم، وقد يكون موضعيًا. الحالة هنا تصف ألمًا ضاغطًا مركزيًا ممتدًا للذراع، وده يجعل السبب القلبي أخطر وأكثر احتمالًا.",
    },
    {
      id: "D",
      text: "Pneumonia",
      correct: false,
      explanation:
        "الالتهاب الرئوي غالبًا يصاحبه Fever وCough وSputum وقد يحدث Pleuritic chest pain، أي ألم يزيد مع التنفس العميق أو الكحة. المعطيات الحالية لا تذكر أعراضًا تنفسية أو حمى تدعم هذا التشخيص.",
    },
  ],
};


// ==========================================
// REUSABLE UI COMPONENTS
// ==========================================

function SectionTitle({ icon: Icon, title, subtitle, color = "#0D9488" }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      marginBottom: 14,
    }}>
      <div style={{
        width: 38,
        height: 38,
        borderRadius: 11,
        background: `${color}18`,
        color,
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
      }}>
        <Icon size={20} />
      </div>

      <div>
        <h3 style={{
          margin: 0,
          fontSize: 16,
          fontWeight: 900,
        }}>
          {title}
        </h3>

        {subtitle && (
          <p style={{
            margin: "5px 0 0",
            color: "var(--muted, #64748b)",
            fontSize: 12,
            lineHeight: 1.7,
          }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}


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
  const [showExplanation, setShowExplanation] = useState(false);

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

  const correctAnswer = chestPainCase.options.find(
    option => option.correct
  ).text;

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

  const panelStyle = {
    background: dark ? "#101c2b" : "#f8fafc",
    border: `1px solid ${colors.border}`,
    borderRadius: 13,
    padding: 16,
    marginTop: 14,
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

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
    setShowExplanation(false);
  };


  // ========================================
  // STREAMING AI PATIENT CHAT
  // ========================================

  async function sendToPatient(message, isStarting = false) {
    if (loading) return;

    const currentQuestion = message.trim();

    if (!currentQuestion) return;

    const history = messages.map(m => ({
      role: m.from === "doctor" ? "user" : "assistant",
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
        throw new Error("الرد وصل بشكل غير مكتمل. أعد المحاولة.");
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


  // ========================================
  // READY CASE EXPLANATION
  // ========================================

  const reasoningSteps = [
    {
      title: "مكان الألم",
      english: "Central chest pain",
      explanation:
        "الألم موجود في منتصف الصدر. المكان ده مهم لأن القلب موجود داخل التجويف الصدري، وألم نقص التروية القلبية غالبًا يُوصف كألم أو ضغط خلف عظمة القص.",
    },
    {
      title: "طبيعة الألم",
      english: "Pressure-like pain",
      explanation:
        "المريض وصف الألم بأنه ضاغط، مش مجرد وخز بسيط. الألم الضاغط أو العاصر من الأوصاف الكلاسيكية التي ترفع الشك في نقص وصول الدم لعضلة القلب.",
    },
    {
      title: "امتداد الألم",
      english: "Radiation to left arm",
      explanation:
        "الألم ممتد للذراع الشمال. ده نمط معروف في ألم القلب؛ لأن الإشارات العصبية القادمة من القلب قد يشعر بها المريض في الصدر والكتف أو الذراع.",
    },
    {
      title: "عوامل الخطورة",
      english: "Diabetes & Hypertension",
      explanation:
        "السكر والضغط من أهم عوامل الخطورة لأمراض الشرايين التاجية. مع الوقت قد يسببان تلفًا في الأوعية الدموية ويساعدان على تكوّن Atherosclerosis، أي تصلب الشرايين.",
    },
    {
      title: "سرعة القلب",
      english: "Tachycardia",
      explanation:
        "معدل ضربات القلب 105 في الدقيقة، وده أعلى من الطبيعي للبالغ في الراحة. قد يكون استجابة للألم أو التوتر أو مشكلة قلبية، لكنه وحده لا يحدد التشخيص.",
    },
  ];

  const renderReadyExplanation = () => (
    <div style={{
      marginTop: 20,
      display: "grid",
      gap: 14,
    }}>

      <div style={{
        ...panelStyle,
        borderRight: "4px solid #0D9488",
      }}>
        <SectionTitle
          icon={Lightbulb}
          title="أولًا: افهم الحالة ببساطة"
          subtitle="خلينا نترجم القصة الطبية ونفهم معناها."
        />

        <p style={{
          lineHeight: 2.1,
          fontSize: 14,
          margin: 0,
        }}>
          عندنا راجل عمره 58 سنة راح الطوارئ بسبب ألم شديد في منتصف
          الصدر مستمر من ساعتين. الألم شبه الضغط أو العصر، وبيمتد
          للذراع الشمال. عنده تاريخ مرضي من ارتفاع ضغط الدم ومرض
          السكري.
        </p>

        <p style={{
          lineHeight: 2,
          fontSize: 14,
          margin: "10px 0 0",
        }}>
          ببساطة: دي مش شكوى عادية نتعامل معاها على إنها حموضة أو
          شد عضلي قبل ما نستبعد السبب القلبي. لازم نفكر أولًا في
          مشكلة حادة في شرايين القلب؛ لأنها الأخطر والأكثر توافقًا
          مع وصف الألم.
        </p>
      </div>


      <div style={panelStyle}>
        <SectionTitle
          icon={BookOpen}
          title="ثانيًا: ترجمة المصطلحات الطبية"
          subtitle="افهم الكلمات اللي بتتكرر في الـ Clinical Cases."
          color="#2563EB"
        />

        <div style={{
          display: "grid",
          gap: 9,
        }}>
          {[
            ["Presents to the emergency department", "حضر إلى قسم الطوارئ."],
            ["Severe", "شديد."],
            ["Central chest pain", "ألم في منتصف الصدر."],
            ["Pressure-like", "يشبه الضغط أو العصر."],
            ["Radiates to left arm", "يمتد إلى الذراع الأيسر."],
            ["Hypertension", "ارتفاع ضغط الدم."],
            ["Diabetes mellitus", "مرض السكري."],
            ["Vital signs", "العلامات الحيوية."],
            ["Myocardial infarction", "احتشاء عضلة القلب / جلطة القلب."],
            ["Acute coronary syndrome", "متلازمة الشريان التاجي الحادة."],
          ].map(([english, arabic]) => (
            <div
              key={english}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 8,
                padding: "10px 12px",
                borderRadius: 9,
                background: colors.card,
                border: `1px solid ${colors.border}`,
              }}
            >
              <strong
                dir="ltr"
                style={{
                  fontSize: 12,
                  color: "#0D9488",
                  textAlign: "left",
                }}
              >
                {english}
              </strong>

              <span style={{
                fontSize: 13,
                color: colors.text,
              }}>
                {arabic}
              </span>
            </div>
          ))}
        </div>
      </div>


      <div style={panelStyle}>
        <SectionTitle
          icon={Brain}
          title="ثالثًا: اربط المعلومات ببعضها"
          subtitle="دي أهم خطوة في التفكير الإكلينيكي."
          color="#7C3AED"
        />

        <div style={{
          display: "grid",
          gap: 11,
        }}>
          {reasoningSteps.map((step, index) => (
            <div
              key={step.title}
              style={{
                display: "flex",
                gap: 11,
                alignItems: "flex-start",
                padding: 12,
                background: colors.card,
                border: `1px solid ${colors.border}`,
                borderRadius: 11,
              }}
            >
              <div style={{
                width: 29,
                height: 29,
                borderRadius: 9,
                background: "#7C3AED18",
                color: "#A78BFA",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                fontWeight: 900,
                fontSize: 13,
              }}>
                {index + 1}
              </div>

              <div>
                <strong style={{
                  display: "block",
                  fontSize: 14,
                }}>
                  {step.title}
                </strong>

                <span
                  dir="ltr"
                  style={{
                    display: "block",
                    color: "#0D9488",
                    fontSize: 11,
                    marginTop: 3,
                    textAlign: "right",
                  }}
                >
                  {step.english}
                </span>

                <p style={{
                  color: colors.muted,
                  fontSize: 13,
                  lineHeight: 1.9,
                  margin: "7px 0 0",
                }}>
                  {step.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 14,
          padding: 14,
          borderRadius: 10,
          background: dark ? "#123b3b" : "#e0f2f1",
          lineHeight: 2,
        }}>
          <strong style={{ color: "#0D9488" }}>
            الخلاصة من ربط المعلومات:
          </strong>

          <p style={{
            margin: "5px 0 0",
            fontSize: 13,
          }}>
            رجل كبير نسبيًا + ألم صدري ضاغط + امتداد للذراع الشمال
            + سكر وضغط = اشتباه قوي في Acute Coronary Syndrome.
            لازم نستبعد الجلطة القلبية بشكل عاجل.
          </p>
        </div>
      </div>


      <div style={panelStyle}>
        <SectionTitle
          icon={Target}
          title="رابعًا: ما التشخيص الذي نفكر فيه؟"
          subtitle="Clinical reasoning and differential diagnosis."
          color="#D97706"
        />

        <div style={{
          background: dark ? "#123b3b" : "#ecfdf5",
          padding: 15,
          borderRadius: 11,
          border: "1px solid #0D948855",
        }}>
          <strong style={{
            color: "#0D9488",
            fontSize: 15,
          }}>
            Acute Coronary Syndrome (ACS)
          </strong>

          <p style={{
            fontSize: 13,
            lineHeight: 2,
            margin: "8px 0 0",
          }}>
            هو المصطلح الذي يشمل الحالات الناتجة عن نقص حاد في تدفق
            الدم إلى عضلة القلب. ومن ضمنها Unstable Angina و
            Myocardial Infarction.
          </p>

          <p style={{
            fontSize: 13,
            lineHeight: 2,
            margin: "7px 0 0",
          }}>
            السؤال يطلب الاختيار الأكثر احتمالًا من الاختيارات
            الموجودة، وهو Acute Myocardial Infarction. لكن لا يمكن
            تأكيد حدوث جلطة من وصف الألم وحده؛ نحتاج ECG وCardiac
            Troponin مع التقييم الإكلينيكي.
          </p>
        </div>
      </div>


      <div style={panelStyle}>
        <SectionTitle
          icon={Microscope}
          title="خامسًا: الفحوصات المهمة"
          subtitle="إيه اللي نطلبه وليه؟"
          color="#2563EB"
        />

        {[
          {
            name: "12-lead ECG",
            why: "نبحث عن تغيرات كهربائية تشير إلى نقص التروية أو احتشاء عضلة القلب، مثل ST elevation أو ST depression أو T-wave inversion.",
            priority: "يُجرى بشكل عاجل",
          },
          {
            name: "Cardiac Troponin",
            why: "مؤشر على إصابة عضلة القلب. قد نحتاج قياسات متكررة حسب توقيت بداية الأعراض والبروتوكول المتبع.",
            priority: "قياسات متسلسلة عند الحاجة",
          },
          {
            name: "Continuous Cardiac Monitoring",
            why: "لمراقبة ضربات القلب واكتشاف اضطرابات النظم التي قد تحدث مع الحالات القلبية الحادة.",
            priority: "مراقبة مستمرة",
          },
        ].map(item => (
          <div
            key={item.name}
            style={{
              padding: 12,
              borderBottom: `1px solid ${colors.border}`,
            }}
          >
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 7,
            }}>
              <strong
                dir="ltr"
                style={{
                  color: "#0D9488",
                  fontSize: 13,
                }}
              >
                {item.name}
              </strong>

              <span style={{
                color: colors.muted,
                fontSize: 11,
              }}>
                {item.priority}
              </span>
            </div>

            <p style={{
              fontSize: 13,
              lineHeight: 1.9,
              color: colors.muted,
              margin: "7px 0 0",
            }}>
              {item.why}
            </p>
          </div>
        ))}
      </div>


      <div style={{
        ...panelStyle,
        borderRight: "4px solid #D97706",
      }}>
        <SectionTitle
          icon={BookMarked}
          title="سادسًا: Exam Pearl"
          subtitle="معلومة مهمة تثبت في ذهنك."
          color="#D97706"
        />

        <p style={{
          fontSize: 14,
          lineHeight: 2,
          margin: 0,
        }}>
          أي مريض عنده ألم صدري جديد وشديد، خصوصًا لو الألم ضاغط
          أو ممتد للذراع أو الفك، لازم نضع Acute Coronary Syndrome
          ضمن الاحتمالات الخطيرة ونبدأ التقييم العاجل.
        </p>

        <p style={{
          fontSize: 13,
          color: colors.muted,
          lineHeight: 1.9,
          margin: "8px 0 0",
        }}>
          لا تعتمد على الأعراض وحدها لتأكيد أو نفي الجلطة، ولا تؤخر
          ECG والتقييم الإسعافي في حالة الاشتباه.
        </p>
      </div>

    </div>
  );


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

        <div style={{
          ...cardStyle,
          background: "linear-gradient(120deg,#087e78,#075b63)",
          color: "white",
          marginBottom: 25,
          padding: 28,
        }}>
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
                  حالات سريرية جاهزة مع شرح عربي مبسط، وربط العلامات
                  والأعراض، وتحليل الاختيارات والإجابة.
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
                          ? dark ? "#203344" : "#f0fdfa"
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
                          ? dark ? "#203344" : "#f0fdfa"
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
                {chestPainCase.specialty} · {chestPainCase.caseNumber}
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
              {chestPainCase.title}
            </h2>

            <div style={{
              background: colors.soft,
              padding: 17,
              borderRadius: 12,
              lineHeight: 2,
              fontSize: 14,
            }}>
              <div dir="ltr" style={{
                textAlign: "left",
                lineHeight: 2,
              }}>
                {chestPainCase.description}
              </div>

              <div style={{
                marginTop: 13,
                fontWeight: 800,
              }}>
                Vital Signs:
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))",
                gap: 8,
                marginTop: 8,
              }}>
                {chestPainCase.vitals.map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      background: colors.card,
                      border: `1px solid ${colors.border}`,
                      padding: 10,
                      borderRadius: 9,
                    }}
                  >
                    <div style={{
                      color: colors.muted,
                      fontSize: 11,
                    }}>
                      {label}
                    </div>

                    <strong
                      dir="ltr"
                      style={{
                        display: "block",
                        fontSize: 13,
                        marginTop: 4,
                        textAlign: "right",
                      }}
                    >
                      {value}
                    </strong>
                  </div>
                ))}
              </div>
            </div>


            {/* UNDERSTAND CASE BUTTON */}

            <button
              onClick={() => setShowExplanation(value => !value)}
              style={{
                ...buttonStyle,
                marginTop: 15,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                borderColor: "#0D9488",
                background: dark ? "#123b3b" : "#f0fdfa",
              }}
            >
              <span style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                color: "#0D9488",
                fontWeight: 900,
              }}>
                <Brain size={19} />
                {showExplanation
                  ? "إخفاء شرح الحالة"
                  : "افهم الحالة واربط المعلومات قبل الحل"}
              </span>

              {showExplanation
                ? <ChevronUp size={18} color="#0D9488" />
                : <ChevronDown size={18} color="#0D9488" />
              }
            </button>


            {showExplanation && renderReadyExplanation()}


            {/* QUESTION */}

            <div style={{
              marginTop: 24,
              paddingTop: 18,
              borderTop: `1px solid ${colors.border}`,
            }}>
              <h3 style={{
                margin: "0 0 12px",
                fontSize: 17,
              }}>
                {chestPainCase.question}
              </h3>

              <p style={{
                color: colors.muted,
                fontSize: 12,
                marginBottom: 14,
                lineHeight: 1.8,
              }}>
                اختار الإجابة الأقرب للحالة، وبعدها هنراجع مع بعض
                سبب صحة الإجابة وسبب خطأ باقي الاختيارات.
              </p>

              <div style={{
                display: "grid",
                gap: 10,
              }}>
                {chestPainCase.options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => {
                      if (!showResult) setAnswer(option.text);
                    }}
                    style={{
                      ...buttonStyle,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      borderColor:
                        showResult && option.correct
                          ? "#16A34A"
                          : answer === option.text
                            ? "#0D9488"
                            : colors.border,
                      background:
                        showResult && option.correct
                          ? dark ? "#123b2b" : "#ecfdf5"
                          : answer === option.text
                            ? dark ? "#123b3b" : "#f0fdfa"
                            : colors.card,
                      fontWeight:
                        answer === option.text ? 800 : 500,
                    }}
                  >
                    <span style={{
                      width: 27,
                      height: 27,
                      borderRadius: 8,
                      background: colors.soft,
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                      fontSize: 12,
                      fontWeight: 900,
                    }}>
                      {option.id}
                    </span>

                    <span style={{
                      flex: 1,
                    }}>
                      {option.text}
                    </span>

                    {showResult && option.correct && (
                      <CheckCircle2
                        color="#16A34A"
                        size={19}
                      />
                    )}

                    {showResult &&
                      !option.correct &&
                      answer === option.text && (
                        <X color="#EF4444" size={19} />
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
                    cursor: answer ? "pointer" : "not-allowed",
                    width: "100%",
                  }}
                >
                  تحقق من إجابتي
                </button>
              ) : (
                <div style={{
                  marginTop: 22,
                }}>

                  {/* RESULT SUMMARY */}

                  <div style={{
                    padding: 17,
                    borderRadius: 12,
                    background:
                      answer === correctAnswer
                        ? dark ? "#123b2b" : "#ecfdf5"
                        : dark ? "#3b2525" : "#fef2f2",
                    border: `1px solid ${
                      answer === correctAnswer
                        ? "#16A34A55"
                        : "#EF444455"
                    }`,
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                    }}>
                      {answer === correctAnswer
                        ? <CheckCircle2 color="#16A34A" size={23} />
                        : <AlertTriangle color="#EF4444" size={23} />
                      }

                      <h3 style={{
                        margin: 0,
                        color:
                          answer === correctAnswer
                            ? "#16A34A"
                            : "#EF4444",
                        fontSize: 17,
                      }}>
                        {answer === correctAnswer
                          ? "ممتاز! إجابتك صحيحة"
                          : "إجابتك غير صحيحة، تعال نفهم السبب"}
                      </h3>
                    </div>

                    <p style={{
                      margin: "10px 0 0",
                      fontSize: 13,
                      lineHeight: 1.9,
                    }}>
                      الإجابة الصحيحة هي:
                      {" "}
                      <strong style={{ color: "#16A34A" }}>
                        Acute Myocardial Infarction (AMI)
                      </strong>
                    </p>
                  </div>


                  {/* WHY EACH ANSWER */}

                  <div style={{
                    marginTop: 18,
                  }}>
                    <SectionTitle
                      icon={Brain}
                      title="ليه الإجابة دي صح أو غلط؟"
                      subtitle="راجع منطق كل اختيار بدل ما تحفظ الإجابة فقط."
                    />

                    <div style={{
                      display: "grid",
                      gap: 11,
                    }}>
                      {chestPainCase.options.map(option => (
                        <div
                          key={option.id}
                          style={{
                            padding: 14,
                            borderRadius: 11,
                            border: `1px solid ${
                              option.correct
                                ? "#16A34A66"
                                : colors.border
                            }`,
                            background: colors.soft,
                          }}
                        >
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 8,
                          }}>
                            {option.correct
                              ? <CheckCircle2 color="#16A34A" size={18} />
                              : <X color={colors.muted} size={18} />
                            }

                            <strong style={{
                              fontSize: 13,
                              color: option.correct
                                ? "#16A34A"
                                : colors.text,
                            }}>
                              {option.id}. {option.text}
                            </strong>

                            {option.correct && (
                              <span style={{
                                marginRight: "auto",
                                fontSize: 10,
                                color: "#16A34A",
                                fontWeight: 900,
                              }}>
                                CORRECT
                              </span>
                            )}
                          </div>

                          <p style={{
                            fontSize: 13,
                            lineHeight: 2,
                            color: colors.muted,
                            margin: 0,
                          }}>
                            {option.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>


                  {/* FINAL CLINICAL REASONING */}

                  <div style={{
                    ...panelStyle,
                    borderRight: "4px solid #0D9488",
                  }}>
                    <SectionTitle
                      icon={Target}
                      title="Clinical Reasoning Summary"
                      subtitle="الطريقة التي تفكر بها في الامتحان."
                    />

                    <p style={{
                      fontSize: 13,
                      lineHeight: 2.1,
                      margin: 0,
                    }}>
                      عندك مريض عمره 58 سنة يعاني من ألم صدري شديد
                      ضاغط وممتد للذراع الأيسر، ولديه Diabetes و
                      Hypertension. هذه المعطيات ترفع الاشتباه في
                      Acute Coronary Syndrome، ولذلك يكون Acute
                      Myocardial Infarction هو الاختيار الأنسب من
                      الاختيارات المتاحة.
                    </p>
                  </div>


                  {/* NEXT STEPS */}

                  <div style={{
                    ...panelStyle,
                  }}>
                    <SectionTitle
                      icon={ClipboardCheck}
                      title="What should you do next?"
                      subtitle="الخطوة التالية في التعامل مع الحالة."
                      color="#2563EB"
                    />

                    <ol style={{
                      paddingRight: 22,
                      fontSize: 13,
                      lineHeight: 2.2,
                      margin: 0,
                    }}>
                      <li>Immediate clinical assessment and ABC approach.</li>
                      <li>Obtain a 12-lead ECG urgently.</li>
                      <li>Measure cardiac troponin and repeat when indicated.</li>
                      <li>Arrange urgent emergency/cardiology management according to local ACS protocol.</li>
                    </ol>
                  </div>


                  <button
                    onClick={resetCase}
                    style={{
                      ...primaryButton,
                      marginTop: 18,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      width: "100%",
                    }}
                  >
                    <RotateCcw size={17} />
                    أعد حل الحالة
                  </button>
                </div>
              )}
            </div>


            <div style={{
              marginTop: 18,
              padding: 12,
              background: colors.soft,
              borderRadius: 10,
              color: colors.muted,
              fontSize: 11,
              lineHeight: 1.9,
            }}>
              <Info size={15} style={{
                verticalAlign: "middle",
                marginLeft: 5,
              }} />
              هذه حالة تعليمية. التشخيص النهائي يعتمد على التقييم
              الإكلينيكي وECG ونتائج الفحوصات، ولا يُعتمد على وصف
              الألم وحده.
            </div>
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
                        ? dark ? "#203344" : "#e0f2fe"
                        : dark ? "#123b3b" : "#e0f2f1",
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
