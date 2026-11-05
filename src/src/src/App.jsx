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
  ArrowLeftRight,
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

  const inputRef = useRef(null);
  const abortRef = useRef(null);

  const [activePatientReplyId, setActivePatientReplyId] = useState(null);
  const [activeCaseReplyId, setActiveCaseReplyId] = useState(null);

  const patientReplyRef = useRef(null);
  const caseReplyRef = useRef(null);
  const casePickerRef = useRef(null);

  // Unique ID for every interactive session.
  const caseSessionRef = useRef(null);

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

  const selectedReadyCase =
    readyCases[readyCaseId] || readyCases.chest_pain_001;

  const caseOptions = selectedReadyCase.options;
  const readyCaseIds = Object.keys(readyCases);

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
    border: 1px solid ${colors.border},
    borderRadius: 18,
    padding: 22,
    color: colors.text,
  };

  const buttonStyle = {
    border: 1px solid ${colors.border},
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


  // ========================================
  // AUTO-SCROLL TO THE START OF NEW REPLIES
  // ========================================

  useEffect(() => {
    if (!patientReplyRef.current) return;

    patientReplyRef.current.scrollIntoView({
      behavior: "auto",
      block: "start",
    });
  }, [messages, loading]);

  useEffect(() => {
    if (!caseReplyRef.current) return;

    caseReplyRef.current.scrollIntoView({
      behavior: "auto",
      block: "start",
    });
  }, [caseChatMessages, caseChatLoading]);


  // Stop active request when leaving the component.
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
    setActiveCaseReplyId(null);
    setError("");
  };


  function chooseReadyCase(id) {
    if (!readyCases[id]) return;

    setReadyCaseId(id);
    resetCase();
  }


  function nextReadyCase() {
    const cu
…
