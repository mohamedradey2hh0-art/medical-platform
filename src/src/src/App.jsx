import React, { useEffect, useRef, useState } from "react";
import {
  Stethoscope, Brain, BookOpen, ClipboardList, Search, GraduationCap,
  Sparkles, ChevronLeft, X, Moon, Sun, Activity, HeartPulse,
  ArrowRight, CheckCircle2, Send, RotateCcw, UserRound, Bot,
  Clock3, Loader2, AlertTriangle, Microscope, ClipboardCheck
} from "lucide-react";

import Tutor from "./Tutor.jsx";
import HealthAssistant from "./HealthAssistant.jsx";

const API_URL = "https://medmind-test.mohamedradey2hh0.workers.dev/";
const THEME_KEY = "medmind-theme";

const tools = [
  { id: "assistant", icon: Brain, title: "المساعد الطبي الذكي", subtitle: "Medical AI Tutor", desc: "اسأل عن أي موضوع طبي واحصل على شرح منظم ومبسط.", color: "#0D9488", bg: "#E0F2F1" },
  { id: "health", icon: HeartPulse, title: "المساعد الصحي الذكي", subtitle: "AI Health Assistant", desc: "تحدث عن مشكلتك الصحية وافهم أعراضك واحصل على توجيه صحي مبدئي.", color: "#0D9488", bg: "#CCFBF1" },
  { id: "lectures", icon: BookOpen, title: "مساعد المحاضرات", subtitle: "Lecture Assistant", desc: "نظّم محاضراتك واستعد لفهمها ومراجعتها.", color: "#2563EB", bg: "#DBEAFE" },
  { id: "questions", icon: ClipboardList, title: "بنك الأسئلة", subtitle: "MCQ Bank", desc: "تدرّب على أسئلة الاختيار من متعدد وافهم الإجابات.", color: "#D97706", bg: "#FEF3C7" },
  { id: "cases", icon: Stethoscope, title: "الحالات الإكلينيكية", subtitle: "Clinical Cases", desc: "طوّر تفكيرك الإكلينيكي من خلال حالات تدريبية تفاعلية.", color: "#7C3AED", bg: "#EDE9FE" }
];

const specialties = [
  { name: "Internal Medicine", ar: "الباطنة", icon: HeartPulse, color: "#0D9488" },
  { name: "Pediatrics", ar: "الأطفال", icon: UserRound, color: "#2563EB" },
  { name: "Surgery", ar: "الجراحة", icon: Activity, color: "#D97706" },
  { name: "Cardiology", ar: "القلب", icon: HeartPulse, color: "#E11D48" },
  { name: "Neurology", ar: "المخ والأعصاب", icon: Brain, color: "#7C3AED" },
  { name: "Emergency", ar: "الطوارئ", icon: Activity, color: "#EA580C" },
  { name: "Obstetrics & Gynecology", ar: "النساء والتوليد", icon: UserRound, color: "#DB2777" },
  { name: "Urology", ar: "المسالك البولية", icon: Microscope, color: "#0284C7" }
];

const CASES = [
  { id: "internal_chest_pain", specialty: "Internal Medicine", title: "Chest Pain", ar: "ألم الصدر", level: "Intermediate" },
  { id: "pediatrics_fever", specialty: "Pediatrics", title: "Fever in a Young Child", ar: "حمّى طفل", level: "Beginner" },
  { id: "surgery_abdominal_pain", specialty: "Surgery", title: "Acute Abdominal Pain", ar: "ألم البطن الحاد", level: "Intermediate" },
  { id: "cardiology_palpitations", specialty: "Cardiology", title: "Palpitations", ar: "خفقان القلب", level: "Intermediate" },
  { id: "neurology_headache", specialty: "Neurology", title: "Recurrent Headache", ar: "صداع متكرر", level: "Beginner" },
  { id: "emergency_trauma", specialty: "Emergency", title: "Road Traffic Trauma", ar: "إصابة وحادث طريق", level: "Advanced" },
  { id: "obgyn_ectopic_pregnancy", specialty: "Obstetrics & Gynecology", title: "Ectopic Pregnancy", ar: "حمل خارج الرحم", level: "Advanced" },
  { id: "obgyn_preeclampsia", specialty: "Obstetrics & Gynecology", title: "Preeclampsia", ar: "ما قبل تسمم الحمل", level: "Advanced" },
  { id: "urology_renal_colic", specialty: "Urology", title: "Renal Colic", ar: "مغص كلوي", level: "Intermediate" },
  { id: "urology_acute_retention", specialty: "Urology", title: "Acute Urinary Retention", ar: "احتباس بول حاد", level: "Intermediate" }
];


// Short Arabic learning guides shown with each reviewed ready-made case.
const CASE_STUDY_GUIDE = {
  internal_chest_pain: {
    summary: "رجل عنده ألم ضاغط شديد في منتصف الصدر ممتد للذراع، مع عرق وغثيان وضيق نفس. رسم القلب فيه ارتفاع ST في leads II, III, aVF مع انخفاض عكسي في I وaVL؛ وده نمط يرجّح جلطة حادة في الجدار السفلي للقلب.",
    terms: [["Pressure-like pain", "ألم ضاغط"], ["Radiating pain", "ألم ممتد إلى مكان آخر"], ["Sweating / diaphoresis", "تعرّق"], ["ST elevation", "ارتفاع مقطع ST في رسم القلب"], ["Reciprocal changes", "تغيرات عكسية في leads مقابلة"], ["Inferior leads", "اشتقاقات الجدار السفلي: II, III, aVF"]],
    steps: ["حدّد طبيعة الألم: ضاغط، شديد، ومستمر في الراحة.", "اربط الأعراض المصاحبة وعوامل الخطورة القلبية بالسياق.", "اقرأ ECG: ارتفاع ST في II وIII وaVF مع reciprocal depression يدعم inferior STEMI.", "اعتبرها حالة طارئة: تقييم فوري للاستقرار وتفعيل مسار STEMI وإعادة التروية دون تأخير غير ضروري."]
  },
  pediatrics_fever: {
    summary: "طفلة عمرها 3 سنوات عندها حرارة ورشح وكحة بسيطة، لكنها نشيطة وبتشرب وبتتبول، ومفيش صعوبة تنفس أو علامات خطر واضحة. الصورة أقرب لعدوى فيروسية بسيطة بالجهاز التنفسي العلوي، مع ضرورة متابعة أي تدهور.",
    terms: [["Upper respiratory tract infection (URTI)", "عدوى الجهاز التنفسي العلوي"], ["Runny nose", "رشح / سيلان الأنف"], ["Hydration", "حالة الترطيب والسوائل"], ["Respiratory distress", "مجهود أو صعوبة في التنفس"], ["Neck stiffness", "تيبّس الرقبة"], ["Red flags", "علامات إنذار تستدعي تقييمًا عاجلًا"]],
    steps: ["ابدأ بالحالة العامة: هل الطفلة واعية ونشيطة وتتفاعل؟", "قيّم التنفس، الترطيب، التروية، وكمية البول.", "الأعراض العلوية البسيطة مع غياب علامات الخطر ترجّح عدوى فيروسية.", "لا تعتمد على درجة الحرارة وحدها؛ أعطِ تعليمات واضحة لإعادة التقييم عند ظهور صعوبة تنفس أو خمول أو قلة بول أو تدهور."]
  },
  surgery_abdominal_pain: {
    summary: "شاب بدأ عنده الألم حول السرة ثم انتقل للجزء السفلي الأيمن من البطن، مع فقدان شهية وغثيان وحرارة بسيطة. الفحص والسونار يدعمان التهاب الزائدة الدودية الحاد.",
    terms: [["Periumbilical", "حول السرة"], ["Right lower quadrant (RLQ)", "الربع السفلي الأيمن من البطن"], ["Migratory pain", "ألم انتقل من مكان لمكان"], ["Guarding", "شدّ لا إرادي في عضلات البطن"], ["Rebound tenderness", "ألم عند رفع اليد بعد الضغط"], ["Non-compressible appendix", "زائدة لا تنضغط بالسونار"]],
    steps: ["انتقال الألم من حول السرة إلى RLQ علامة تاريخ مرضي مهمة.", "اربط فقدان الشهية والغثيان والحرارة مع tenderness وguarding.", "السونار يظهر زائدة متضخمة غير قابلة للانضغاط مع التهاب حولها.", "النتائج ترجّح acute appendicitis وتحتاج تقييمًا جراحيًا عاجلًا ومراجعة علامات المضاعفات."]
  },
  cardiology_palpitations: {
    summary: "سيدة شابة تشعر بخفقان بدأ فجأة، والنبض سريع ومنتظم، ورسم القلب يظهر تسارعًا منتظمًا ضيق المركّب. ده يتماشى مع نوبة PSVT، لكن أول خطوة دائمًا هي التأكد من استقرار الدورة الدموية.",
    terms: [["Palpitations", "إحساس المريض بضربات القلب"], ["Sudden onset", "بداية مفاجئة"], ["Regular rhythm", "نظم منتظم"], ["Narrow-complex tachycardia", "تسرّع بنظم QRS ضيق"], ["Hemodynamic stability", "استقرار الدورة الدموية"], ["Syncope", "إغماء"]],
    steps: ["قيّم الاستقرار: الضغط، الوعي، ألم الصدر، علامات الصدمة أو فشل القلب.", "اقرأ ECG: النظم منتظم وسريع وQRS ضيق.", "البداية المفاجئة مع هذه الصورة ترجّح PSVT.", "التعامل يعتمد على الاستقرار؛ لا تبدأ بمناورة أو دواء قبل تحديد الاستقرار واتباع البروتوكول المناسب."]
  },
  neurology_headache: {
    summary: "سيدة عندها نوبات متكررة من صداع نابض في ناحية واحدة، مع غثيان وحساسية للضوء والصوت، وبداية تدريجية دون علامات إنذار مذكورة. ده يرجّح migraine without aura بعد التأكد من عدم وجود red flags.",
    terms: [["Unilateral", "في ناحية واحدة"], ["Throbbing", "صداع نابض"], ["Photophobia", "حساسية للضوء"], ["Phonophobia", "حساسية للصوت"], ["Thunderclap headache", "صداع مفاجئ شديد جدًا كالصاعقة"], ["Aura", "أعراض عصبية بؤرية مؤقتة تسبق أو تصاحب الصداع"]],
    steps: ["حدّد بداية الصداع: تدريجية أم مفاجئة كالصاعقة؟", "اسأل عن النمط المتكرر، مكان الألم، طبيعته، والغثيان وحساسية الضوء والصوت.", "ابحث عن علامات الخطر: حمى أو تيبس رقبة أو عجز عصبي أو إصابة أو صداع جديد شديد.", "إذا كانت الصورة نمطية ولا توجد red flags، فالشقيقة دون aura هي الاحتمال الأقرب."]
  },
  emergency_trauma: {
    summary: "رجل بعد حادث دراجة نارية، عنده ألم أعلى يسار البطن ودوخة، وضغطه منخفض نسبيًا ونبضه سريع، وFAST يظهر سائلًا حرًا داخل البطن. لازم نفكر في نزيف داخلي وإصابة الطحال مع احتمال صدمة نزفية.",
    terms: [["Road traffic collision", "حادث طريق"], ["Pale and clammy", "شحوب مع جلد بارد ورطب"], ["Hypotension", "انخفاض ضغط الدم"], ["Tachycardia", "سرعة ضربات القلب"], ["eFAST", "فحص موجات فوق صوتية سريع في الطوارئ"], ["Hemorrhagic shock", "صدمة بسبب فقدان الدم"]],
    steps: ["اتبع ABCDE في تقييم الإصابات ولا تنشغل بالتشخيص قبل إنقاذ الحياة.", "النبض السريع والضغط المنخفض والجلد البارد قد تشير إلى صدمة.", "ألم LUQ مع FAST إيجابي يثير اشتباه نزيف داخل البطن وإصابة الطحال.", "ابدأ إنعاش الإصابات واطلب فريق الجراحة/الطوارئ فورًا؛ لا تؤخر التدخل الضروري بسبب فحوص غير لازمة."]
  },
  obgyn_ectopic_pregnancy: {
    summary: "سيدة في بداية الحمل عندها ألم أسفل البطن ناحية واحدة مع نزيف بسيط. اختبار الحمل إيجابي، والسونار يظهر كتلة بالملحقات دون رؤية حمل مؤكد داخل الرحم؛ ده يثير اشتباه حمل خارج الرحم ويحتاج تقييمًا عاجلًا.",
    terms: [["Missed period", "انقطاع أو تأخر الدورة"], ["Spotting", "نزيف مهبلي بسيط / تنقيط"], ["Adnexal mass", "كتلة في منطقة المبيض أو قناة فالوب"], ["Intrauterine pregnancy", "حمل داخل الرحم"], ["Beta-hCG", "هرمون الحمل"], ["Rupture", "تمزق"]],
    steps: ["أي ألم أو نزيف مع اختبار حمل إيجابي يستلزم تحديد مكان الحمل.", "اربط الألم أحادي الجانب والنزيف بنتائج TVUS وbeta-hCG.", "غياب كيس واضح داخل الرحم مع كتلة بالملحقات يرفع الاشتباه في ectopic pregnancy.", "قيّم الاستقرار وعلامات التمزق فورًا؛ عدم الاستقرار أو الاشتباه في rupture حالة طارئة."]
  },
  obgyn_preeclampsia: {
    summary: "سيدة حامل في الأسبوع 34 عندها ضغط شديد الارتفاع مع صداع وزغللة وبروتين في البول وعلامات تأثر أعضاء. ده يتماشى مع preeclampsia with severe features، وهي حالة طوارئ تخص الأم والجنين.",
    terms: [["Gestational age", "عمر الحمل"], ["Blurred vision", "زغللة / تشوش الرؤية"], ["Proteinuria", "وجود بروتين في البول"], ["Hyperreflexia", "زيادة المنعكسات العصبية"], ["Severe features", "سمات أو علامات شديدة"], ["Maternal-fetal assessment", "تقييم حالة الأم والجنين"]],
    steps: ["تأكد من قياس الضغط وتكراره؛ الضغط الشديد ≥160 systolic أو ≥110 diastolic.", "الصداع والزغللة والبروتين في البول مع تأثر التحاليل تدعم severe features.", "اعتبر الحالة طارئة توليديًا واطلب تقييم الأم والجنين بشكل عاجل.", "الأولويات تشمل ضبط الضغط والوقاية من التشنجات وتخطيط الولادة بواسطة فريق النساء والتوليد وفق البروتوكول."]
  },
  urology_renal_colic: {
    summary: "رجل عنده ألم مغصي شديد في الخاصرة اليمنى يمتد للأربية، مع دم مجهري في البول. الأشعة المقطعية أظهرت حصوة بالحالب؛ إذن السبب مغص كلوي بسبب حصوة بالحالب.",
    terms: [["Renal colic", "مغص كلوي"], ["Flank pain", "ألم الخاصرة"], ["Groin", "منطقة الأربية"], ["Hematuria", "وجود دم في البول"], ["Ureteric calculus", "حصوة بالحالب"], ["Hydronephrosis", "توسع حوض الكلية بسبب عائق في تصريف البول"]],
    steps: ["الألم المفاجئ المتقطع من الخاصرة إلى الأربية نمطي للمغص الكلوي.", "ابحث عن hematuria وقيّم الحرارة ووظائف الكلى وعلامات العدوى.", "CT KUB يؤكد وجود حصوة بالحالب مع درجة الانسداد.", "وجود حرارة أو عدوى مع انسداد، أو تدهور وظائف الكلى، يغيّر الأولوية إلى تقييم وتدخل عاجل."]
  },
  urology_acute_retention: {
    summary: "رجل كبير في السن لا يستطيع التبول منذ ساعات، ولديه تاريخ طويل من ضعف اندفاع البول والتردد. المثانة ممتلئة والبروستاتا متضخمة وملساء؛ ده يرجّح احتباس بول حاد بسبب تضخم البروستاتا الحميد.",
    terms: [["Urinary retention", "احتباس البول"], ["Weak stream", "ضعف اندفاع البول"], ["Hesitancy", "تأخر بدء التبول"], ["Suprapubic", "فوق عظمة العانة"], ["Bladder outlet obstruction", "انسداد مخرج المثانة"], ["Benign prostatic enlargement", "تضخم البروستاتا الحميد"]],
    steps: ["ميّز أعراض الانسداد المزمنة مثل weak stream وhesitancy عن المشكلة الحادة الحالية.", "ألم وانتفاخ فوق العانة مع bladder scan مرتفع يؤكد وجود احتباس.", "البروستاتا المتضخمة الملساء تدعم benign prostatic enlargement كسبب محتمل.", "يحتاج المريض تفريغ المثانة سريعًا إذا كان آمنًا، مع تقييم موانع القسطرة ووظائف الكلى والمتابعة."]
  }
};

function ClinicalCases({ darkMode, onBack }) {
  const [mode, setMode] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState("Internal Medicine");
  const [selectedCaseId, setSelectedCaseId] = useState("internal_chest_pain");
  const [readyCase, setReadyCase] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [loadingReady, setLoadingReady] = useState(false);
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
    card: dark ? "#151f30" : "#fff",
    text: dark ? "#e5edf7" : "#172b4d",
    muted: dark ? "#a8b6c9" : "#64748b",
    border: dark ? "#29364a" : "#e5eaf0",
    soft: dark ? "#1e293b" : "#f1f5f9"
  };
  const currentCase = CASES.find(c => c.id === selectedCaseId) || CASES[0];
  const specialtyInfo = specialties.find(s => s.name === selectedSpecialty) || specialties[0];
  const filteredCases = CASES.filter(c => c.specialty === selectedSpecialty);

  const pageStyle = { minHeight: "100vh", background: colors.page, color: colors.text, padding: "24px 16px 60px", fontFamily: "inherit" };
  const cardStyle = { background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 18, padding: 22, color: colors.text };
  const buttonStyle = { border: `1px solid ${colors.border}`, borderRadius: 12, padding: "13px 15px", background: colors.card, color: colors.text, cursor: "pointer", textAlign: "right", width: "100%", fontFamily: "inherit", fontSize: 14 };
  const primaryButton = { border: "none", borderRadius: 12, padding: "13px 20px", background: "#0D9488", color: "white", cursor: "pointer", fontFamily: "inherit", fontWeight: 800 };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  useEffect(() => () => abortRef.current?.abort(), []);

  function chooseSpecialty(name) {
    setSelectedSpecialty(name);
    const first = CASES.find(c => c.specialty === name);
    if (first) setSelectedCaseId(first.id);
  }

  async function loadReadyCase(caseId = selectedCaseId) {
    setLoadingReady(true);
    setError("");
    setReadyCase(null);
    setSelectedAnswer("");
    setShowResult(false);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "ready_case", caseId })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر تحميل الحالة.");
      setReadyCase(data);
      setMode("ready-question");
    } catch (err) {
      setError(err.message || "حصلت مشكلة أثناء تحميل الحالة.");
    } finally {
      setLoadingReady(false);
    }
  }

  async function sendToPatient(message, isStarting = false) {
    if (loading || !message.trim()) return;
    const history = messages.map(m => ({
      role: m.from === "doctor" ? "user" : "assistant",
      text: m.text
    }));
    const patientMessageId = `patient-${Date.now()}`;
    const controller = new AbortController();
    abortRef.current = controller;

    if (isStarting) {
      setMessages([{ id: patientMessageId, from: "patient", text: "" }]);
    } else {
      setMessages(prev => [...prev, { from: "doctor", text: message.trim() }, { id: patientMessageId, from: "patient", text: "" }]);
    }
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "clinical_patient",
          specialty: currentCase.specialty,
          caseId: currentCase.id,
          question: message.trim(),
          history
        })
      });
      if (!response.ok) {
        let msg = "تعذر الاتصال بمحرك الحالات الإكلينيكية.";
        try { msg = (await response.json()).error || msg; } catch {}
        throw new Error(msg);
      }
      if (!response.body) throw new Error("الاتصال لا يدعم استقبال الرد.");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let received = "";
      let finished = false;

      function processFrame(frame) {
        const lines = frame.split(/\r?\n/);
        const eventName = lines.find(x => x.startsWith("event:"))?.slice(6).trim();
        const raw = lines.filter(x => x.startsWith("data:")).map(x => x.slice(5).trim()).join("\n");
        if (!raw) return;
        if (raw === "[DONE]") { finished = true; return; }
        const data = JSON.parse(raw);
        if (eventName === "error" || data.error) throw new Error(data.error || "انقطع الاتصال أثناء الرد.");
        if (typeof data.text === "string") {
          received += data.text;
          setMessages(prev => prev.map(m => m.id === patientMessageId ? { ...m, text: received } : m));
        }
      }

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const frames = buffer.split(/\r?\n\r?\n/);
        buffer = frames.pop() || "";
        frames.forEach(processFrame);
      }
      buffer += decoder.decode();
      if (buffer.trim()) processFrame(buffer);
      if (!received.trim() || !finished) throw new Error("الرد وصل بشكل غير مكتمل. أعد المحاولة.");
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err.message || "حصلت مشكلة أثناء المحاكاة.");
      setMessages(prev => prev.filter(m => m.id !== patientMessageId || m.text.trim()));
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  function startInteractiveCase() {
    setMessages([]);
    setQuestion("");
    setError("");
    setMode("interactive");
    sendToPatient("ابدأ المحاكاة. قدم نفسك للمريض كطبيب وابدأ أول جملة من المريض بشكل طبيعي. لا تكشف التشخيص.", true);
  }

  function sendQuestion(e) {
    e.preventDefault();
    if (!question.trim() || loading) return;
    const value = question.trim();
    setQuestion("");
    sendToPatient(value);
  }

  function resetInteractiveCase() {
    if (loading) return;
    setMessages([]);
    setQuestion("");
    setError("");
    sendToPatient("ابدأ المحاكاة من البداية. قدم نفسك للمريض وابدأ الشكوى الأساسية فقط.", true);
  }

  function goBack() {
    if (loading) return;
    if (mode === "ready-question") setMode("ready-select");
    else if (mode === "interactive") setMode("interactive-select");
    else if (mode === "ready-select" || mode === "interactive-select") setMode(null);
    else onBack();
    setError("");
  }

  const selectedOption = readyCase?.options?.find(o => o.id === selectedAnswer);
  const isCorrect = selectedAnswer === readyCase?.correctOption;

  return (
    <div style={pageStyle} dir="rtl">
      <div style={{ maxWidth: 950, margin: "auto" }}>
        <button onClick={goBack} style={{ ...buttonStyle, width: "auto", display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
          <ArrowRight size={18} /> رجوع
        </button>

        <div style={{ ...cardStyle, background: "linear-gradient(120deg,#087e78,#075b63)", color: "white", marginBottom: 25, padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Stethoscope size={36} />
            <div>
              <h1 style={{ fontSize: 27, fontWeight: 900, margin: 0 }}>Clinical Cases</h1>
              <p style={{ color: "#d9f3ef", fontSize: 13, marginTop: 6 }}>Learn clinical reasoning through real-world scenarios.</p>
            </div>
          </div>
        </div>

        {!mode && <>
          <h2 style={{ fontSize: 21, marginBottom: 8 }}>اختر طريقة التدريب</h2>
          <p style={{ color: colors.muted, marginBottom: 20, fontSize: 14 }}>اختار بين حل الحالات الجاهزة أو مقابلة مريض افتراضي.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
            <button onClick={() => setMode("ready-select")} style={{ ...cardStyle, cursor: "pointer", textAlign: "right" }}>
              <div style={{ width: 52, height: 52, borderRadius: 15, background: "#E0F2F1", color: "#0D9488", display: "grid", placeItems: "center", marginBottom: 16 }}><ClipboardList size={27} /></div>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>Ready-made Cases</h3>
              <p style={{ color: colors.muted, lineHeight: 1.9, fontSize: 13 }}>حالات جاهزة مع تبسيط عربي، ترجمة المصطلحات، تحليل كل اختيار، وخطوات التفكير الإكلينيكي.</p>
              <div style={{ color: "#0D9488", fontWeight: 800, marginTop: 18 }}>ابدأ التدريب <ChevronLeft size={17} style={{ verticalAlign: "middle" }} /></div>
            </button>
            <button onClick={() => setMode("interactive-select")} style={{ ...cardStyle, cursor: "pointer", textAlign: "right" }}>
              <div style={{ width: 52, height: 52, borderRadius: 15, background: "#EDE9FE", color: "#7C3AED", display: "grid", placeItems: "center", marginBottom: 16 }}><Bot size={27} /></div>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>AI Interactive Cases</h3>
              <p style={{ color: colors.muted, lineHeight: 1.9, fontSize: 13 }}>قابل مريضًا افتراضيًا، خذ التاريخ المرضي، اطلب الفحوصات، ثم اطلب تقييم أدائك.</p>
              <div style={{ color: "#7C3AED", fontWeight: 800, marginTop: 18 }}>ابدأ المحاكاة <ChevronLeft size={17} style={{ verticalAlign: "middle" }} /></div>
            </button>
          </div>
          <p style={{ color: colors.muted, fontSize: 12, marginTop: 18 }}>10 حالات تدريبية متاحة حاليًا في 8 تخصصات.</p>
        </>}

        {(mode === "ready-select" || mode === "interactive-select") && (
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <Microscope size={24} color="#0D9488" />
              <div>
                <h2 style={{ margin: 0, fontSize: 20 }}>{mode === "ready-select" ? "اختر الحالة الجاهزة" : "اختر حالة المحاكاة"}</h2>
                <p style={{ marginTop: 5, color: colors.muted, fontSize: 13 }}>اختار التخصص ثم الحالة التي تريد التدريب عليها.</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(135px,1fr))", gap: 9, marginBottom: 20 }}>
              {specialties.map(s => {
                const Icon = s.icon;
                return <button key={s.name} onClick={() => chooseSpecialty(s.name)} style={{ ...buttonStyle, borderColor: selectedSpecialty === s.name ? s.color : colors.border, background: selectedSpecialty === s.name ? (dark ? "#203344" : "#f0fdfa") : colors.card }}>
                  <Icon size={21} color={s.color} />
                  <div style={{ fontWeight: 800, marginTop: 7 }}>{s.ar}</div>
                  <div style={{ fontSize: 10, color: colors.muted }}>{s.name}</div>
                </button>;
              })}
            </div>
            <h3 style={{ fontSize: 16, marginBottom: 10 }}>الحالات المتاحة في {specialtyInfo.ar}</h3>
            <div style={{ display: "grid", gap: 9 }}>
              {filteredCases.map(c => (
                <button key={c.id} onClick={() => setSelectedCaseId(c.id)} style={{ ...buttonStyle, borderColor: selectedCaseId === c.id ? "#0D9488" : colors.border, background: selectedCaseId === c.id ? (dark ? "#123b3b" : "#f0fdfa") : colors.card }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                    <span><strong>{c.ar}</strong><span style={{ display: "block", color: colors.muted, fontSize: 12, marginTop: 4 }}>{c.title}</span></span>
                    <span style={{ color: colors.muted, fontSize: 11 }}>{c.level}</span>
                  </div>
                </button>
              ))}
            </div>
            <button disabled={loadingReady} onClick={() => mode === "ready-select" ? loadReadyCase() : startInteractiveCase()} style={{ ...primaryButton, width: "100%", marginTop: 20, opacity: loadingReady ? .6 : 1, display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
              {loadingReady ? <Loader2 size={18} /> : <Stethoscope size={18} />}
              {mode === "ready-select" ? "ابدأ حل الحالة" : "ابدأ المقابلة مع المريض"}
            </button>
            {error && <p style={{ color: "#ef4444", fontSize: 13, marginTop: 12 }}>{error}</p>}
            <p style={{ fontSize: 11, color: colors.muted, textAlign: "center", marginTop: 12 }}>هذه حالات افتراضية للتدريب والتعليم وليست استشارة لمريض حقيقي.</p>
          </div>
        )}

        {mode === "ready-question" && readyCase && (
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
              <span style={{ color: "#0D9488", fontWeight: 800, fontSize: 13 }}>{readyCase.specialty} · {readyCase.caseNumber}</span>
              <span style={{ color: colors.muted, fontSize: 12 }}><Clock3 size={14} style={{ verticalAlign: "middle" }} /> 5–7 min</span>
            </div>
            <h2 style={{ fontSize: 22, margin: "16px 0 12px" }}>{readyCase.title}</h2>
            <div style={{ background: colors.soft, padding: 17, borderRadius: 12, lineHeight: 2, fontSize: 14, whiteSpace: "pre-line" }}>{readyCase.vignette}</div>
            {CASE_STUDY_GUIDE[readyCase.caseId] && <div style={{ display: "grid", gap: 14, marginTop: 16 }}>
              <section style={{ ...cardStyle, padding: 17, background: dark ? "#172b35" : "#f0fdfa", borderColor: dark ? "#24504e" : "#bce8df" }}>
                <h3 style={{ margin: "0 0 8px", color: "#0D9488", fontSize: 16 }}>افهم الحالة بالعربي</h3>
                <p style={{ margin: 0, lineHeight: 2, fontSize: 14 }}>{CASE_STUDY_GUIDE[readyCase.caseId].summary}</p>
              </section>
              <section style={{ ...cardStyle, padding: 17 }}>
                <h3 style={{ margin: "0 0 12px", fontSize: 16 }}>مصطلحات طبية مهمة | Medical Terms</h3>
                <div style={{ display: "grid", gap: 8 }}>
                  {CASE_STUDY_GUIDE[readyCase.caseId].terms.map(([term, meaning]) => <div key={term} style={{ display: "grid", gridTemplateColumns: "minmax(120px, 1fr) minmax(130px, 1.2fr)", gap: 10, padding: "8px 0", borderBottom: `1px solid ${colors.border}`, fontSize: 13 }}><strong dir="ltr" style={{ textAlign: "left" }}>{term}</strong><span>{meaning}</span></div>)}
                </div>
              </section>
            </div>}
            <h3 style={{ margin: "22px 0 12px", fontSize: 17 }}>{readyCase.question}</h3>
            <div style={{ display: "grid", gap: 10 }}>
              {readyCase.options.map(option => {
                const correct = showResult && option.id === readyCase.correctOption;
                const wrongSelected = showResult && option.id === selectedAnswer && !isCorrect;
                return <button key={option.id} onClick={() => !showResult && setSelectedAnswer(option.id)} style={{ ...buttonStyle, borderColor: correct ? "#16a34a" : wrongSelected ? "#ef4444" : selectedAnswer === option.id ? "#0D9488" : colors.border, background: correct ? (dark ? "#123b2b" : "#ecfdf5") : wrongSelected ? (dark ? "#3b2525" : "#fef2f2") : selectedAnswer === option.id ? (dark ? "#123b3b" : "#f0fdfa") : colors.card, fontWeight: selectedAnswer === option.id ? 800 : 500 }}>
                  <span style={{ marginLeft: 10, color: colors.muted }}>{option.id}.</span>{option.text}
                  {correct && <CheckCircle2 color="#16a34a" size={18} style={{ float: "left" }} />}
                  {wrongSelected && <X color="#ef4444" size={18} style={{ float: "left" }} />}
                </button>;
              })}
            </div>
            {!showResult ? <button disabled={!selectedAnswer} onClick={() => setShowResult(true)} style={{ ...primaryButton, marginTop: 20, opacity: selectedAnswer ? 1 : .5 }}>اعرض الإجابة والتفسير</button> : (
              <div style={{ marginTop: 22, padding: 18, borderRadius: 12, background: isCorrect ? (dark ? "#123b2b" : "#ecfdf5") : (dark ? "#3b2525" : "#fef2f2"), lineHeight: 2 }}>
                <h3 style={{ color: isCorrect ? "#16a34a" : "#ef4444", margin: "0 0 8px" }}>{isCorrect ? "إجابة صحيحة!" : "الإجابة غير صحيحة — راجع التفسير"}</h3>
                <strong>Correct answer: {readyCase.correctOption}. {readyCase.options.find(o => o.id === readyCase.correctOption)?.text}</strong>
                <h4 style={{ margin: "14px 0 5px" }}>ليه الإجابة دي صح؟</h4>
                <p style={{ fontSize: 14, margin: 0 }}>{readyCase.explanationAr}</p>
                <p style={{ fontSize: 14, marginTop: 8 }}><strong>English explanation:</strong> {readyCase.explanationEn}</p>
                <h4 style={{ margin: "14px 0 8px" }}>تحليل كل الاختيارات | Option-by-option explanation</h4>
                <div style={{ display: "grid", gap: 8 }}>
                  {readyCase.options.map(option => {
                    const correctOption = option.id === readyCase.correctOption;
                    const reason = correctOption ? readyCase.explanationAr : readyCase.distractorExplanations?.[option.id];
                    return <div key={option.id} style={{ padding: 12, borderRadius: 10, border: `1px solid ${correctOption ? "#16a34a" : colors.border}`, background: correctOption ? (dark ? "#123b2b" : "#f0fdf4") : colors.soft }}>
                      <strong style={{ color: correctOption ? "#16a34a" : colors.text }}>{option.id}. {option.text} {correctOption ? "— الإجابة الصحيحة" : "— غير صحيح في هذه الحالة"}</strong>
                      <p style={{ margin: "6px 0 0", fontSize: 13, lineHeight: 1.9 }}>{reason || "هذا الاختيار لا يفسر المعطيات الأساسية المذكورة في الحالة."}</p>
                    </div>;
                  })}
                </div>
                <h4 style={{ margin: "18px 0 8px" }}>نفكر إكلينيكيًا خطوة بخطوة | Step-by-step reasoning</h4>
                {CASE_STUDY_GUIDE[readyCase.caseId] ? <ol style={{ paddingRight: 22, margin: 0, fontSize: 14, lineHeight: 2.1 }}>{CASE_STUDY_GUIDE[readyCase.caseId].steps.map((step, index) => <li key={index} style={{ marginBottom: 5 }}>{step}</li>)}</ol> : <p style={{ fontSize: 14, margin: 0 }}>{readyCase.clinicalReasoning}</p>}
                <details style={{ marginTop: 12, padding: 12, borderRadius: 10, background: colors.soft }}>
                  <summary style={{ cursor: "pointer", fontWeight: 800 }}>Clinical reasoning note (تفصيل إضافي)</summary>
                  <p style={{ fontSize: 13, lineHeight: 1.9, marginBottom: 0 }}>{readyCase.clinicalReasoning}</p>
                </details>
                <h4 style={{ margin: "14px 0 5px" }}>Exam answer</h4>
                <p style={{ fontSize: 14, margin: 0 }}>{readyCase.examAnswer}</p>
                <h4 style={{ margin: "14px 0 5px" }}>Clinical pearls</h4>
                <ul style={{ paddingRight: 22, margin: 0, fontSize: 14 }}>{readyCase.pearls.map((p, i) => <li key={i}>{p}</li>)}</ul>
                <div style={{ display: "flex", gap: 9, flexWrap: "wrap", marginTop: 18 }}>
                  <button onClick={() => { setSelectedAnswer(""); setShowResult(false); }} style={{ ...primaryButton, display: "flex", alignItems: "center", gap: 7 }}><RotateCcw size={16} /> حاول مرة أخرى</button>
                  <button onClick={() => { setMode("ready-select"); setReadyCase(null); }} style={{ ...buttonStyle, width: "auto" }}>اختيار حالة أخرى</button>
                </div>
              </div>
            )}
          </div>
        )}

        {mode === "interactive" && (
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, borderBottom: `1px solid ${colors.border}`, paddingBottom: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ background: "#EDE9FE", color: "#7C3AED", width: 45, height: 45, borderRadius: 13, display: "grid", placeItems: "center" }}><Bot size={25} /></div>
                <div><h3 style={{ margin: 0, fontSize: 17 }}>Virtual Patient</h3><p style={{ fontSize: 12, color: colors.muted, marginTop: 5 }}>{specialtyInfo.ar} · {currentCase.ar}</p></div>
              </div>
              <button onClick={resetInteractiveCase} disabled={loading} style={{ ...buttonStyle, width: "auto", display: "flex", alignItems: "center", gap: 7, color: "#0D9488", fontSize: 12, opacity: loading ? .5 : 1 }}><RotateCcw size={15} /> حالة جديدة</button>
            </div>
            <div style={{ background: colors.soft, borderRadius: 12, padding: 13, marginBottom: 15, display: "flex", alignItems: "center", gap: 9 }}>
              <ClipboardCheck size={21} color="#0D9488" />
              <div><strong style={{ fontSize: 13 }}>Clinical Training Session</strong><p style={{ color: colors.muted, fontSize: 11, marginTop: 3 }}>خذ التاريخ المرضي، اطلب الفحوصات، وناقش التشخيص والتعامل مع الحالة.</p></div>
            </div>
            <div style={{ background: dark ? "#101a29" : "#f8fafc", border: `1px solid ${colors.border}`, borderRadius: 14, padding: 15, minHeight: 300, maxHeight: 480, overflowY: "auto", display: "flex", flexDirection: "column", gap: 13 }}>
              {messages.map((m, i) => <div key={m.id || i} style={{ alignSelf: m.from === "doctor" ? "flex-start" : "flex-end", maxWidth: "88%", padding: "12px 15px", borderRadius: 13, background: m.from === "doctor" ? (dark ? "#203344" : "#e0f2fe") : (dark ? "#123b3b" : "#e0f2f1"), color: colors.text, lineHeight: 1.9, fontSize: 14, overflowWrap: "anywhere" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: m.from === "doctor" ? "#3B82F6" : "#0D9488", marginBottom: 5 }}>{m.from === "doctor" ? "Doctor (You)" : "Virtual Patient"}</div>{m.text || (loading ? "..." : "")}
              </div>)}
              {loading && <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#0D9488", fontSize: 13 }}><Loader2 size={18} /> المريض بيرد...</div>}
              <div ref={chatEndRef} />
            </div>
            {error && <div style={{ marginTop: 13, background: dark ? "#3b2525" : "#fef2f2", border: "1px solid #fecaca", padding: 12, borderRadius: 10, fontSize: 12, color: dark ? "#fecaca" : "#b91c1c", lineHeight: 1.8 }}><AlertTriangle size={16} style={{ verticalAlign: "middle" }} /> {error}</div>}
            {messages.length === 0 && !loading && <button onClick={startInteractiveCase} style={{ ...primaryButton, width: "100%", marginTop: 18 }}>ابدأ المقابلة مع المريض</button>}
            {messages.length > 0 && <form onSubmit={sendQuestion} style={{ display: "flex", gap: 8, marginTop: 15 }}>
              <input ref={inputRef} value={question} onChange={e => setQuestion(e.target.value)} disabled={loading} placeholder="اسأل المريض عن الأعراض أو التاريخ المرضي..." style={{ flex: 1, minWidth: 0, padding: 13, borderRadius: 11, border: `1px solid ${colors.border}`, background: colors.soft, color: colors.text, outline: "none", fontFamily: "inherit", fontSize: 13 }} />
              <button type="submit" disabled={loading || !question.trim()} style={{ ...primaryButton, padding: "12px 17px", display: "grid", placeItems: "center", opacity: loading || !question.trim() ? .5 : 1 }}>{loading ? <Loader2 size={19} /> : <Send size={19} />}</button>
            </form>}
            <div style={{ marginTop: 16, padding: 12, borderRadius: 11, background: colors.soft }}><p style={{ fontSize: 12, color: colors.muted, lineHeight: 1.9, margin: 0 }}><strong style={{ color: colors.text }}>لإنهاء الحالة:</strong> اكتب "قيّم أدائي" أو "التشخيص النهائي" للحصول على تقييم يشمل التاريخ المرضي والفحوصات والتشخيص والتعامل مع الحالة.</p></div>
            <p style={{ color: colors.muted, fontSize: 11, lineHeight: 1.8, marginTop: 15 }}>هذه محاكاة تعليمية بحالات افتراضية. المعلومات والنتائج مخصصة للتدريب وليست بديلًا عن البروتوكولات الإكلينيكية.</p>
          </div>
        )}
      </div>
      <style>{`@keyframes medmindSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState("home");
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem(THEME_KEY) === "dark"; } catch { return false; }
  });

  useEffect(() => {
    const theme = darkMode ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch {}
  }, [darkMode]);

  const filteredTools = tools.filter(tool => (tool.title + tool.subtitle + tool.desc).toLowerCase().includes(search.toLowerCase()));
  const selectedTool = tools.find(tool => tool.id === selected);

  if (page === "tutor") return <Tutor onBack={() => setPage("home")} darkMode={darkMode} setDarkMode={setDarkMode} />;
  if (page === "health") return <HealthAssistant onBack={() => setPage("home")} darkMode={darkMode} setDarkMode={setDarkMode} />;
  if (page === "cases") return <ClinicalCases darkMode={darkMode} onBack={() => setPage("home")} />;

  return (
    <div dir="rtl" className="medmind-app" id="dashboard">
      <header className="dashboard-header">
        <div className="container dashboard-header-inner">
          <a href="#dashboard" className="dashboard-brand"><Stethoscope size={28} />MedMind</a>
          <nav className="dashboard-nav"><a href="#dashboard" className="active">الرئيسية</a><a href="#tools">الأدوات</a><a href="#about">عن المنصة</a></nav>
          <button type="button" className="theme-toggle" onClick={() => setDarkMode(v => !v)} aria-label={darkMode ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الليلي"} title={darkMode ? "الوضع الفاتح" : "الوضع الليلي"}>{darkMode ? <Sun size={18} /> : <Moon size={18} />}<span>{darkMode ? "الوضع الفاتح" : "الوضع الليلي"}</span></button>
        </div>
      </header>
      <main className="container dashboard-main">
        <section className="dashboard-hero">
          <div className="hero-copy"><div className="hero-eyebrow"><Sparkles size={15} />YOUR MEDICAL LEARNING SPACE</div><h1>أهلاً بك في MedMind 🩺</h1><p>رحلتك نحو فهم أعمق للطب تبدأ من هنا.</p></div>
          <Stethoscope className="hero-watermark" size={150} />
        </section>
        <section id="tools" className="dashboard-tools-section">
          <div className="tools-heading"><div><h2>أدواتك التعليمية والصحية</h2><p>خدمات تعليمية وصحية ذكية في مكان واحد.</p></div><div className="student-badge">MEDICAL & HEALTH</div></div>
          <div className="dashboard-search"><Search color="#087E78" size={20} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث عن أداة..." aria-label="ابحث عن أداة" /></div>
          <div className="tools-grid">
            {filteredTools.map(tool => {
              const Icon = tool.icon;
              return <button key={tool.id} type="button" className="dashboard-tool-card" onClick={() => {
                if (tool.id === "assistant") setPage("tutor");
                else if (tool.id === "health") setPage("health");
                else if (tool.id === "cases") setPage("cases");
                else setSelected(tool.id);
              }}>
                <div className="dashboard-tool-icon" style={{ background: tool.bg, color: tool.color }}><Icon size={26} /></div>
                <div className="dashboard-tool-subtitle" style={{ color: tool.color }}>{tool.subtitle}</div>
                <h3>{tool.title}</h3><p>{tool.desc}</p>
                <span className="dashboard-tool-link" style={{ color: tool.color }}>{tool.id === "health" ? "ابدأ الاستشارة" : tool.id === "cases" ? "ابدأ التدريب" : "استكشف الأداة"}<ChevronLeft size={17} /></span>
              </button>;
            })}
          </div>
          {filteredTools.length === 0 && <p className="dashboard-empty">لا توجد أدوات مطابقة للبحث.</p>}
        </section>
        {selectedTool && <section className="selected-tool-panel"><div className="selected-tool-heading"><h2>{selectedTool.title}</h2><button type="button" onClick={() => setSelected(null)} aria-label="إغلاق"><X size={20} /></button></div><p>{selectedTool.desc}</p><p className="development-note">هذه الأداة قيد التطوير. سنضيف وظائفها الفعلية في المراحل القادمة.</p></section>}
        <section id="about" className="dashboard-about"><GraduationCap size={45} className="about-graduation-icon" /><div><h2>التعلم والرعاية الصحية بطريقة أذكى</h2><p>MedMind منصة تهدف إلى مساعدة طلاب الطب على التعلم والتدريب، ومساعدة المستخدمين على فهم المعلومات الصحية والحصول على التوجيه المناسب.</p></div></section>
      </main>
      <footer className="dashboard-footer">© 2026 MedMind · Made for learning and better health</footer>
    </div>
  );
}
