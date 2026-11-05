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
  Play,
  Lightbulb,
  Trophy,
  Layers,
  Microscope,
  ChevronDown,
  AlertCircle
} from "lucide-react";

import Tutor from "./Tutor";
import HealthAssistant from "./HealthAssistant";

const API_URL =
  "https://medmind-test.mohamedradey2hh0.workers.dev/";

const departments = {
  "Internal Medicine": {
    label: "Internal Medicine",
    icon: Stethoscope,
    branches: {
      Cardiology: [
        "Chest pain",
        "Acute coronary syndrome",
        "Heart failure",
        "Arrhythmias",
        "Valvular heart disease",
        "Hypertension",
        "Infective endocarditis"
      ],
      Respiratory: [
        "Asthma",
        "COPD",
        "Pneumonia",
        "Pulmonary embolism",
        "Pleural effusion",
        "Interstitial lung disease",
        "Respiratory failure"
      ],
      Gastroenterology: [
        "Upper GI bleeding",
        "Lower GI bleeding",
        "Peptic ulcer disease",
        "Liver cirrhosis",
        "Hepatitis",
        "Inflammatory bowel disease",
        "Pancreatitis"
      ],
      Hepatology: [
        "Jaundice",
        "Acute liver failure",
        "Chronic liver disease",
        "Portal hypertension",
        "Hepatic encephalopathy"
      ],
      Nephrology: [
        "Acute kidney injury",
        "Chronic kidney disease",
        "Nephrotic syndrome",
        "Nephritic syndrome",
        "Electrolyte disorders",
        "Acid-base disorders"
      ],
      Endocrinology: [
        "Diabetes mellitus",
        "DKA",
        "HHS",
        "Hypothyroidism",
        "Hyperthyroidism",
        "Adrenal disorders",
        "Pituitary disorders"
      ],
      Hematology: [
        "Iron deficiency anemia",
        "Megaloblastic anemia",
        "Hemolytic anemia",
        "Leukemia",
        "Lymphoma",
        "Bleeding disorders",
        "Thrombosis"
      ],
      Rheumatology: [
        "Rheumatoid arthritis",
        "SLE",
        "Vasculitis",
        "Gout",
        "Osteoarthritis"
      ],
      Infectious_Diseases: [
        "Sepsis",
        "Tuberculosis",
        "Meningitis",
        "Malaria",
        "HIV",
        "Fever of unknown origin"
      ]
    }
  },

  Pediatrics: {
    label: "Pediatrics",
    icon: BabyIcon,
    branches: {
      Neonatology: [
        "Neonatal jaundice",
        "Neonatal sepsis",
        "Respiratory distress",
        "Prematurity",
        "Neonatal resuscitation"
      ],
      Cardiology: [
        "Congenital heart disease",
        "Heart failure",
        "Cyanotic heart disease",
        "Rheumatic fever"
      ],
      Respiratory: [
        "Bronchiolitis",
        "Asthma",
        "Pneumonia",
        "Croup",
        "Foreign body aspiration"
      ],
      Gastroenterology: [
        "Acute gastroenteritis",
        "Dehydration",
        "Intussusception",
        "Pyloric stenosis",
        "Celiac disease"
      ],
      Neurology: [
        "Febrile convulsions",
        "Epilepsy",
        "Meningitis",
        "Developmental delay"
      ],
      Hematology: [
        "Iron deficiency anemia",
        "Thalassemia",
        "Sickle cell disease",
        "ITP",
        "Hemophilia"
      ],
      Endocrinology: [
        "Type 1 diabetes",
        "Diabetic ketoacidosis",
        "Short stature",
        "Growth disorders"
      ],
      Infectious_Diseases: [
        "Measles",
        "Meningitis",
        "Diphtheria",
        "Whooping cough",
        "Sepsis"
      ]
    }
  },

  Surgery: {
    label: "General Surgery",
    icon: Activity,
    branches: {
      General_Surgery: [
        "Acute appendicitis",
        "Intestinal obstruction",
        "Peritonitis",
        "Acute abdomen",
        "Hernias",
        "Abdominal trauma"
      ],
      Breast: [
        "Breast lump",
        "Breast cancer",
        "Fibroadenoma",
        "Mastitis",
        "Breast abscess"
      ],
      Thyroid: [
        "Thyroid nodule",
        "Goiter",
        "Thyroid cancer",
        "Thyrotoxicosis"
      ],
      Vascular: [
        "Acute limb ischemia",
        "Deep vein thrombosis",
        "Varicose veins",
        "Peripheral arterial disease"
      ],
      Trauma: [
        "Hemorrhagic shock",
        "Head injury",
        "Chest trauma",
        "Abdominal trauma",
        "Burns"
      ],
      Urology: [
        "Renal colic",
        "Acute urinary retention",
        "Hematuria",
        "Testicular torsion",
        "Hydrocele"
      ]
    }
  },

  Emergency: {
    label: "Emergency Medicine",
    icon: HeartPulse,
    branches: {
      Resuscitation: [
        "Cardiac arrest",
        "Shock",
        "Airway management",
        "Anaphylaxis"
      ],
      Cardiac_Emergencies: [
        "Acute coronary syndrome",
        "Arrhythmias",
        "Acute heart failure",
        "Hypertensive emergency"
      ],
      Neurological_Emergencies: [
        "Stroke",
        "Status epilepticus",
        "Coma",
        "Meningitis"
      ],
      Trauma: [
        "Polytrauma",
        "Head injury",
        "Chest trauma",
        "Abdominal trauma"
      ],
      Toxicology: [
        "Drug overdose",
        "Paracetamol toxicity",
        "Organophosphate poisoning",
        "Carbon monoxide poisoning"
      ]
    }
  },

  Neurology: {
    label: "Neurology",
    icon: Brain,
    branches: {
      Cerebrovascular: [
        "Ischemic stroke",
        "Hemorrhagic stroke",
        "TIA",
        "Cerebral venous thrombosis"
      ],
      Epilepsy: [
        "Focal seizures",
        "Generalized seizures",
        "Status epilepticus"
      ],
      Headache: [
        "Migraine",
        "Tension headache",
        "Cluster headache",
        "Secondary headache"
      ],
      Movement_Disorders: [
        "Parkinson disease",
        "Essential tremor",
        "Dystonia"
      ],
      Neuromuscular: [
        "Myasthenia gravis",
        "Guillain-Barre syndrome",
        "Peripheral neuropathy"
      ]
    }
  },

  Cardiology: {
    label: "Cardiology",
    icon: HeartPulse,
    branches: {
      Ischemic_Heart_Disease: [
        "Stable angina",
        "Unstable angina",
        "STEMI",
        "NSTEMI"
      ],
      Heart_Failure: [
        "Acute heart failure",
        "Chronic heart failure",
        "Cardiogenic pulmonary edema"
      ],
      Arrhythmias: [
        "Atrial fibrillation",
        "SVT",
        "Ventricular tachycardia",
        "Heart block"
      ],
      Valvular: [
        "Mitral stenosis",
        "Mitral regurgitation",
        "Aortic stenosis",
        "Aortic regurgitation"
      ]
    }
  },

  Urology: {
    label: "Urology",
    icon: Activity,
    branches: {
      Stones: [
        "Renal colic",
        "Ureteric stones",
        "Obstructive uropathy"
      ],
      Lower_Urinary_Tract: [
        "Acute urinary retention",
        "BPH",
        "LUTS",
        "Urinary incontinence"
      ],
      Urological_Emergencies: [
        "Testicular torsion",
        "Priapism",
        "Urological trauma"
      ],
      Oncology: [
        "Bladder cancer",
        "Prostate cancer",
        "Renal cell carcinoma",
        "Testicular tumors"
      ]
    }
  },

  Obstetrics_Gynecology: {
    label: "Obstetrics & Gynecology",
    icon: HeartPulse,
    branches: {
      Obstetrics: [
        "Ectopic pregnancy",
        "Preeclampsia",
        "Eclampsia",
        "Postpartum hemorrhage",
        "Placenta previa",
        "Abruptio placentae",
        "Preterm labor"
      ],
      Gynecology: [
        "Abnormal uterine bleeding",
        "PCOS",
        "Endometriosis",
        "Ovarian cyst",
        "Ovarian torsion",
        "Pelvic inflammatory disease"
      ],
      Infertility: [
        "Primary infertility",
        "Secondary infertility",
        "Ovulatory disorders"
      ]
    }
  },

  Ophthalmology: {
    label: "Ophthalmology",
    icon: Activity,
    branches: {
      Anterior_Segment: [
        "Acute angle closure glaucoma",
        "Cataract",
        "Keratitis",
        "Uveitis"
      ],
      Posterior_Segment: [
        "Retinal detachment",
        "Diabetic retinopathy",
        "Retinal vascular occlusion"
      ],
      Emergencies: [
        "Chemical eye injury",
        "Open globe injury",
        "Acute glaucoma"
      ]
    }
  },

  ENT: {
    label: "ENT",
    icon: Activity,
    branches: {
      Otology: [
        "Acute otitis media",
        "Chronic otitis media",
        "Meniere disease",
        "Sudden sensorineural hearing loss"
      ],
      Rhinology: [
        "Acute sinusitis",
        "Epistaxis",
        "Nasal polyps",
        "Allergic rhinitis"
      ],
      Laryngology: [
        "Epiglottitis",
        "Laryngitis",
        "Vocal cord paralysis",
        "Laryngeal cancer"
      ]
    }
  }
};

function BabyIcon(props) {
  return <UserRound {...props} />;
}

const difficulties = ["Easy", "Medium", "Hard"];
const trainingModes = [
  { id: "mcq", label: "MCQ Case", description: "Progressive clinical questions", icon: ClipboardList },
  { id: "interactive", label: "Virtual Patient", description: "Take history and request investigations", icon: MessageCircle }
];

const styles = {
  page: {
    minHeight: "100vh",
    background: "var(--bg)",
    color: "var(--text)",
    fontFamily: "inherit"
  }
};

function getThemeColors(dark) {
  return dark
    ? {
        bg: "#101827",
        panel: "#182335",
        card: "#1d2b40",
        text: "#f1f5f9",
        muted: "#9eacc0",
        border: "#2b3b52",
        accent: "#42b7a5",
        accentSoft: "rgba(66,183,165,.13)",
        input: "#121d2d",
        correct: "#123b32",
        wrong: "#48252b"
      }
    : {
        bg: "#f5f7fb",
        panel: "#ffffff",
        card: "#ffffff",
        text: "#172033",
        muted: "#64748b",
        border: "#e2e8f0",
        accent: "#159b8b",
        accentSoft: "rgba(21,155,139,.10)",
        input: "#f8fafc",
        correct: "#e4f7ef",
        wrong: "#fff0f0"
      };
}

function Button({ children, onClick, disabled, secondary, style = {} }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        border: secondary ? "1px solid var(--border)" : "none",
        background: secondary ? "var(--card)" : "var(--accent)",
        color: secondary ? "var(--text)" : "#fff",
        padding: "11px 17px",
        borderRadius: 12,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        fontWeight: 700,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        ...style
      }}
    >
      {children}
    </button>
  );
}

function Panel({ children, style = {} }) {
  return (
    <div
      style={{
        background: "var(--panel)",
        border: "1px solid var(--border)",
        borderRadius: 18,
        padding: 20,
        ...style
      }}
    >
      {children}
    </div>
  );
}

function Field({ label, value, onChange, options, placeholder }) {
  return (
    <label style={{ display: "grid", gap: 8, minWidth: 0 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>
        {label}
      </span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%",
          minWidth: 0,
          padding: "12px",
          borderRadius: 11,
          border: "1px solid var(--border)",
          background: "var(--input)",
          color: "var(--text)",
          outline: "none"
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function parseSSE(response, onText) {
  return new Promise(async (resolve, reject) => {
    try {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const frames = buffer.split(/\r?\n\r?\n/);
        buffer = frames.pop() || "";

        for (const frame of frames) {
          const lines = frame.split(/\r?\n/);
          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const raw = line.slice(5).trim();
            if (!raw || raw === "[DONE]") continue;

            try {
              const data = JSON.parse(raw);
              if (data.text) onText(data.text);
            } catch {
              // Ignore malformed chunks.
            }
          }
        }
      }

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

function ClinicalCases({ dark, onBack }) {
  const [department, setDepartment] = useState("Internal Medicine");
  const [branch, setBranch] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [trainingMode, setTrainingMode] = useState("mcq");
  const [clinicalCase, setClinicalCase] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [gradeResult, setGradeResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [patientMessages, setPatientMessages] = useState([]);
  const [patientInput, setPatientInput] = useState("");
  const [patientLoading, setPatientLoading] = useState(false);
  const [caseStage, setCaseStage] = useState("setup");
  const [showFinalFeedback, setShowFinalFeedback] = useState(false);
  const [usedCaseIds, setUsedCaseIds] = useState([]);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const messagesEndRef = useRef(null);

  const colors = getThemeColors(dark);

  useEffect(() => {
    const root = document.documentElement;
    Object.entries({
      "--bg": colors.bg,
      "--panel": colors.panel,
      "--card": colors.card,
      "--text": colors.text,
      "--muted": colors.muted,
      "--border": colors.border,
      "--accent": colors.accent,
      "--accent-soft": colors.accentSoft,
      "--input": colors.input
    }).forEach(([key, value]) => root.style.setProperty(key, value));
  }, [dark]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [patientMessages]);

  const branches = departments[department]?.branches || {};
  const branchNames = Object.keys(branches);
  const topics = branches[branch] || [];

  function resetCase() {
    setClinicalCase(null);
    setQuestionIndex(0);
    setSelectedAnswers({});
    setGradeResult(null);
    setPatientMessages([]);
    setCaseStage("setup");
    setShowFinalFeedback(false);
    setError("");
    setScore(0);
    setAnsweredCount(0);
  }

  function updateDepartment(value) {
    setDepartment(value);
    setBranch("");
    setTopic("");
    resetCase();
  }

  function updateBranch(value) {
    setBranch(value);
    setTopic("");
    resetCase();
  }

  async function generateCase() {
    setLoading(true);
    setError("");
    resetCase();

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "clinical_generate",
          specialty: department,
          subspecialty: branch || "Mixed",
          topic: topic || "Mixed cases",
          difficulty,
          previousCaseIds: usedCaseIds
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not generate a clinical case.");
      }

      if (!data.questions?.length) {
        throw new Error("The generated case has no questions. Please try again.");
      }

      setClinicalCase(data);
      setUsedCaseIds(previous => [...previous, data.caseId].slice(-30));

      if (trainingMode === "mcq") {
        setCaseStage("mcq");
      } else {
        setCaseStage("interactive");
        setPatientMessages([{
          role: "assistant",
          content: data.opening || "Hello doctor, I need your help."
        }]);
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const currentQuestion = clinicalCase?.questions?.[questionIndex];
  const selectedAnswer = selectedAnswers[questionIndex];

  async function submitAnswer() {
    if (!currentQuestion || !selectedAnswer || gradeResult) return;

    const correct = String(currentQuestion.correctAnswer)
      .trim()
      .toUpperCase();

    const isCorrect = selectedAnswer.toUpperCase() === correct;

    setGradeResult({
      isCorrect,
      selectedAnswer,
      correctAnswer: correct,
      explanation: currentQuestion.explanation,
      optionExplanations: currentQuestion.optionExplanations || {}
    });

    setScore(previous => previous + (isCorrect ? 1 : 0));
    setAnsweredCount(previous => previous + 1);
  }

  function nextQuestion() {
    if (questionIndex < clinicalCase.questions.length - 1) {
      setQuestionIndex(previous => previous + 1);
      setGradeResult(null);
    } else {
      setShowFinalFeedback(true);
      setCaseStage("completed");
    }
  }

  async function sendPatientMessage() {
    const question = patientInput.trim();
    if (!question || patientLoading || !clinicalCase) return;

    setPatientInput("");
    setPatientMessages(previous => [
      ...previous,
      { role: "user", content: question },
      { role: "assistant", content: "" }
    ]);

    setPatientLoading(true);

    try {
      const history = patientMessages.map(message => ({
        role: message.role,
        content: message.content
      }));

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "clinical_patient",
          caseId: clinicalCase.caseId,
          specialty: department,
          subspecialty: branch,
          topic,
          clinicalCase,
          question,
          history
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Patient simulation failed.");
      }

      await parseSSE(response, chunk => {
        setPatientMessages(previous => {
          const updated = [...previous];
          const last = updated[updated.length - 1];

          if (last?.role === "assistant") {
            updated[updated.length - 1] = {
              ...last,
              content: last.content + chunk
            };
          }

          return updated;
        });
      });
    } catch (err) {
      setPatientMessages(previous => {
        const updated = [...previous];
        const last = updated[updated.length - 1];

        if (last?.role === "assistant") {
          updated[updated.length - 1] = {
            ...last,
            content: `Error: ${err.message}`
          };
        }

        return updated;
      });
    } finally {
      setPatientLoading(false);
    }
  }

  async function requestFeedback() {
    setPatientLoading(true);
    setPatientMessages(previous => [
      ...previous,
      {
        role: "assistant",
        content: ""
      }
    ]);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "mcq_chat",
          clinicalCase,
          question: "Act as a clinical examiner. Evaluate the student's approach to this case. Give a structured debrief: likely diagnosis, key supporting findings, important differentials, investigations, initial management, mistakes to avoid, and clinical pearls.",
          history: patientMessages
        })
      });

      if (!response.ok) {
        throw new Error("Could not generate feedback.");
      }

      await parseSSE(response, chunk => {
        setPatientMessages(previous => {
          const updated = [...previous];
          const last = updated[updated.length - 1];

          if (last?.role === "assistant") {
            updated[updated.length - 1] = {
              ...last,
              content: last.content + chunk
            };
          }

          return updated;
        });
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setPatientLoading(false);
    }
  }

  function renderSetup() {
    return (
      <div style={{ display: "grid", gap: 20 }}>
        <div>
          <h2 style={{ margin: "0 0 8px", fontSize: 24 }}>
            Build your clinical case
          </h2>
          <p style={{ color: "var(--muted)", margin: 0, lineHeight: 1.7 }}>
            اختار القسم والتخصص الدقيق والموضوع، وسيتم إنشاء حالة جديدة بأسئلة
            مختلفة في كل مرة.
          </p>
        </div>

        <Panel>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 16
          }}>
            <Field
              label="Medical Department"
              value={department}
              onChange={updateDepartment}
              options={Object.entries(departments).map(([value, item]) => ({
                value,
                label: item.label
              }))}
            />

            <Field
              label="Subspecialty"
              value={branch}
              onChange={updateBranch}
              placeholder="Choose subspecialty"
              options={branchNames.map(value => ({
                value,
                label: value.replaceAll("_", " ")
              }))}
            />

            <Field
              label="Clinical Topic"
              value={topic}
              onChange={setTopic}
              placeholder="Mixed topics"
              options={[
                { value: "", label: "Mixed topics" },
                ...topics.map(value => ({ value, label: value }))
              ]}
            />

            <Field
              label="Difficulty"
              value={difficulty}
              onChange={setDifficulty}
              options={difficulties.map(value => ({
                value,
                label: value
              }))}
            />
          </div>
        </Panel>

        <div>
          <h3 style={{ margin: "0 0 12px" }}>Training Mode</h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 12
          }}>
            {trainingModes.map(mode => {
              const Icon = mode.icon;
              const active = trainingMode === mode.id;

              return (
                <button
                  key={mode.id}
                  onClick={() => setTrainingMode(mode.id)}
                  style={{
                    textAlign: "left",
                    padding: 18,
                    borderRadius: 15,
                    border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                    background: active ? "var(--accent-soft)" : "var(--panel)",
                    color: "var(--text)",
                    cursor: "pointer"
                  }}
                >
                  <Icon color="var(--accent)" size={24} />
                  <h4 style={{ margin: "12px 0 5px" }}>{mode.label}</h4>
                  <p style={{
                    margin: 0,
                    color: "var(--muted)",
                    fontSize: 13
                  }}>
                    {mode.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div style={{
            color: "#dc5555",
            background: "rgba(220,85,85,.08)",
            padding: 12,
            borderRadius: 10
          }}>
            <AlertCircle size={16} style={{ verticalAlign: "middle" }} /> {error}
          </div>
        )}

        <Button onClick={generateCase} disabled={loading}>
          {loading ? <Loader2 size={18} className="spin" /> : <Sparkles size={18} />}
          {loading ? "Generating case..." : "Generate New Case"}
        </Button>
      </div>
    );
  }

  function renderMCQ() {
    if (!currentQuestion) return null;

    return (
      <div style={{ display: "grid", gap: 18 }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10
        }}>
          <div>
            <span style={{ color: "var(--muted)", fontSize: 13 }}>
              {clinicalCase.specialty} / {clinicalCase.subspecialty}
            </span>
            <h2 style={{ margin: "6px 0" }}>{clinicalCase.title}</h2>
            <span style={{ color: "var(--muted)", fontSize: 13 }}>
              {clinicalCase.difficulty} · {clinicalCase.topic}
            </span>
          </div>

          <div style={{
            background: "var(--accent-soft)",
            color: "var(--accent)",
            padding: "9px 13px",
            borderRadius: 10,
            height: "fit-content",
            fontWeight: 700
          }}>
            Question {questionIndex + 1} / {clinicalCase.questions.length}
          </div>
        </div>

        <Panel>
          <h3 style={{ marginTop: 0 }}>Clinical Presentation</h3>
          <p style={{ lineHeight: 1.8, marginBottom: 0 }}>
            {clinicalCase.opening}
          </p>
        </Panel>

        <Panel>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
            flexWrap: "wrap"
          }}>
            <span style={{ color: "var(--muted)", fontSize: 13 }}>
              {currentQuestion.stage}
            </span>
            <span style={{ color: "var(--muted)", fontSize: 13 }}>
              Score: {score}/{answeredCount}
            </span>
          </div>

          <h3 style={{ lineHeight: 1.6 }}>
            {currentQuestion.question}
          </h3>

          <div style={{ display: "grid", gap: 10 }}>
            {(currentQuestion.options || []).map((option, index) => {
              const letter = ["A", "B", "C", "D", "E"][index];
              const isSelected = selectedAnswer === letter;
              const correct = gradeResult?.correctAnswer === letter;
              const wrongSelected =
                gradeResult &&
                isSelected &&
                !gradeResult.isCorrect;

              return (
                <button
                  key={letter}
                  disabled={!!gradeResult}
                  onClick={() => setSelectedAnswers(previous => ({
                    ...previous,
                    [questionIndex]: letter
                  }))}
                  style={{
                    padding: 14,
                    borderRadius: 12,
                    textAlign: "left",
                    border: `1px solid ${
                      correct
                        ? "var(--accent)"
                        : wrongSelected
                          ? "#d65a5a"
                          : isSelected
                            ? "var(--accent)"
                            : "var(--border)"
                    }`,
                    background: correct
                      ? colors.correct
                      : wrongSelected
                        ? colors.wrong
                        : isSelected
                          ? "var(--accent-soft)"
                          : "var(--card)",
                    color: "var(--text)",
                    cursor: gradeResult ? "default" : "pointer"
                  }}
                >
                  {option}
                  {correct && <CheckCircle2 size={17} style={{ float: "right" }} />}
                  {wrongSelected && <X size={17} style={{ float: "right" }} />}
                </button>
              );
            })}
          </div>

          {!gradeResult ? (
            <Button
              onClick={submitAnswer}
              disabled={!selectedAnswer}
              style={{ marginTop: 18 }}
            >
              Submit Answer <ArrowRight size={17} />
            </Button>
          ) : (
            <div style={{
              marginTop: 18,
              padding: 16,
              borderRadius: 12,
              background: gradeResult.isCorrect
                ? colors.correct
                : colors.wrong
            }}>
              <h3 style={{ marginTop: 0 }}>
                {gradeResult.isCorrect ? "Correct answer!" : "Not quite."}
              </h3>
              <p style={{ lineHeight: 1.8 }}>
                **Correct answer: {gradeResult.correctAnswer}**
              </p>
              <p style={{ lineHeight: 1.8 }}>
                {gradeResult.explanation}
              </p>

              {Object.entries(gradeResult.optionExplanations).map(([key, value]) => (
                <p key={key} style={{
                  margin: "8px 0",
                  fontSize: 13,
                  lineHeight: 1.7
                }}>
                  <strong>{key}:</strong> {value}
                </p>
              ))}

              <Button onClick={nextQuestion} style={{ marginTop: 10 }}>
                {questionIndex === clinicalCase.questions.length - 1
                  ? "Finish Case"
                  : "Next Question"}
                <ArrowRight size={17} />
              </Button>
            </div>
          )}
        </Panel>
      </div>
    );
  }

  function renderCompleted() {
    const total = clinicalCase?.questions?.length || 0;
    const percentage = total ? Math.round((score / total) * 100) : 0;

    return (
      <div style={{ display: "grid", gap: 18 }}>
        <Panel style={{ textAlign: "center", padding: 30 }}>
          <Trophy size={42} color="var(--accent)" />
          <h2>Case Completed</h2>
          <div style={{
            fontSize: 42,
            fontWeight: 800,
            color: "var(--accent)"
          }}>
            {percentage}%
          </div>
          <p style={{ color: "var(--muted)" }}>
            Your score: {score} / {total}
          </p>
        </Panel>

        <Panel>
          <h3>Final Diagnosis</h3>
          <p>{clinicalCase.finalDiagnosis}</p>

          <h3>Differential Diagnosis</h3>
          <ul>
            {clinicalCase.differentialDiagnosis?.map((item, index) => (
              <li key={index} style={{ marginBottom: 7 }}>{item}</li>
            ))}
          </ul>

          <h3>Management</h3>
          <ol>
            {clinicalCase.management?.map((item, index) => (
              <li key={index} style={{ marginBottom: 7 }}>{item}</li>
            ))}
          </ol>

          <h3>Clinical Pearls</h3>
          <ul>
            {clinicalCase.clinicalPearls?.map((item, index) => (
              <li key={index} style={{ marginBottom: 7 }}>{item}</li>
            ))}
          </ul>

          <h3>Exam Tips</h3>
          <ul>
            {clinicalCase.examTips?.map((item, index) => (
              <li key={index} style={{ marginBottom: 7 }}>{item}</li>
            ))}
          </ul>
        </Panel>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Button onClick={generateCase}>
            <RotateCcw size={17} /> Generate Another Case
          </Button>
          <Button secondary onClick={resetCase}>
            Change Topic
          </Button>
        </div>
      </div>
    );
  }

  function renderInteractive() {
    return (
      <div style={{ display: "grid", gap: 15 }}>
        <Panel>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10
          }}>
            <div>
              <h2 style={{ margin: 0 }}>Virtual Patient</h2>
              <p style={{ color: "var(--muted)", marginBottom: 0 }}>
                {clinicalCase.title} · {clinicalCase.difficulty}
              </p>
            </div>
            <Button secondary onClick={requestFeedback} disabled={patientLoading}>
              <Lightbulb size={16} /> Examiner Feedback
            </Button>
          </div>
        </Panel>

        <Panel style={{
          minHeight: 360,
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{
            flex: 1,
            display: "grid",
            alignContent: "start",
            gap: 14
          }}>
            {patientMessages.map((message, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: message.role === "user"
                    ? "flex-end"
                    : "flex-start"
                }}
              >
                <div style={{
                  maxWidth: "85%",
                  padding: 13,
                  borderRadius: 14,
                  background: message.role === "user"
                    ? "var(--accent-soft)"
                    : "var(--input)",
                  lineHeight: 1.8,
                  whiteSpace: "pre-wrap"
                }}>
                  <div style={{
                    fontSize: 11,
                    color: "var(--muted)",
                    marginBottom: 5
                  }}>
                    {message.role === "user" ? "You" : "Patient / Examiner"}
                  </div>
                  {message.content || (patientLoading ? "..." : "")}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div style={{
            display: "flex",
            gap: 8,
            marginTop: 20,
            borderTop: "1px solid var(--border)",
            paddingTop: 15
          }}>
            <input
              value={patientInput}
              onChange={e => setPatientInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") sendPatientMessage();
              }}
              placeholder="Ask the patient or request an investigation..."
              style={{
                flex: 1,
                minWidth: 0,
                padding: 12,
                borderRadius: 11,
                border: "1px solid var(--border)",
                background: "var(--input)",
                color: "var(--text)"
              }}
            />
            <Button
              onClick={sendPatientMessage}
              disabled={!patientInput.trim() || patientLoading}
            >
              {patientLoading ? <Loader2 size={18} /> : <Send size={18} />}
            </Button>
          </div>
        </Panel>

        <Button secondary onClick={requestFeedback} disabled={patientLoading}>
          <GraduationCap size={17} /> Finish and Get Clinical Feedback
        </Button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      color: "var(--text)",
      padding: "22px 16px 50px"
    }}>
      <div style={{ maxWidth: 950, margin: "0 auto" }}>
        <button
          onClick={onBack}
          style={{
            background: "transparent",
            border: 0,
            color: "var(--muted)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 7,
            marginBottom: 22
          }}
        >
          <ChevronLeft size={19} /> Back to Home
        </button>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 13,
          marginBottom: 25
        }}>
          <div style={{
            background: "var(--accent-soft)",
            color: "var(--accent)",
            padding: 13,
            borderRadius: 15
          }}>
            <Stethoscope size={28} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 26 }}>Clinical Cases</h1>
            <p style={{ margin: "5px 0 0", color: "var(--muted)" }}>
              Learn clinical reasoning through AI-generated cases
            </p>
          </div>
        </div>

        {caseStage === "setup" && renderSetup()}
        {caseStage === "mcq" && renderMCQ()}
        {caseStage === "completed" && renderCompleted()}
        {caseStage === "interactive" && renderInteractive()}

        {caseStage !== "setup" && (
          <div style={{ marginTop: 18 }}>
            <Button secondary onClick={resetCase}>
              <ChevronLeft size={16} /> Back to Case Selection
            </Button>
          </div>
        )}

        <p style={{
          color: "var(--muted)",
          fontSize: 11,
          lineHeight: 1.7,
          marginTop: 25
        }}>
          Educational simulation for medical students. Generated cases may
          require verification against current references and local clinical
          protocols. Not intended for real-patient diagnosis or treatment.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("medmind-theme") === "dark";
    } catch {
      return false;
    }
  });

  const [activeTool, setActiveTool] = useState("home");
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("medmind-theme", dark ? "dark" : "light");
    } catch {
      // Ignore storage errors.
    }
  }, [dark]);

  const colors = getThemeColors(dark);

  useEffect(() => {
    const root = document.documentElement;
    Object.entries({
      "--bg": colors.bg,
      "--panel": colors.panel,
      "--card": colors.card,
      "--text": colors.text,
      "--muted": colors.muted,
      "--border": colors.border,
      "--accent": colors.accent,
      "--accent-soft": colors.accentSoft,
      "--input": colors.input
    }).forEach(([key, value]) => root.style.setProperty(key, value));
  }, [dark]);

  if (activeTool === "clinical") {
    return <ClinicalCases dark={dark} onBack={() => setActiveTool("home")} />;
  }

  if (activeTool === "tutor") {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <button
          onClick={() => setActiveTool("home")}
          style={{
            margin: 15,
            padding: 10,
            border: "1px solid var(--border)",
            borderRadius: 10,
            background: "var(--panel)",
            color: "var(--text)",
            cursor: "pointer"
          }}
        >
          <ChevronLeft size={16} /> Back
        </button>
        <Tutor />
      </div>
    );
  }

  if (activeTool === "health") {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <button
          onClick={() => setActiveTool("home")}
          style={{
            margin: 15,
            padding: 10,
            border: "1px solid var(--border)",
            borderRadius: 10,
            background: "var(--panel)",
            color: "var(--text)",
            cursor: "pointer"
          }}
        >
          <ChevronLeft size={16} /> Back
        </button>
        <HealthAssistant />
      </div>
    );
  }

  const tools = [
    {
      id: "tutor",
      title: "Medical AI Tutor",
      description: "Understand medical topics with an interactive AI tutor.",
      icon: Brain
    },
    {
      id: "clinical",
      title: "Clinical Cases",
      description: "Practice clinical reasoning with generated patient cases.",
      icon: Stethoscope
    },
    {
      id: "health",
      title: "Health Assistant",
      description: "Understand symptoms and get safe health guidance.",
      icon: HeartPulse
    }
  ];

  const visibleTools = tools.filter(tool =>
    `${tool.title} ${tool.description}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main style={{
      minHeight: "100vh",
      background: "var(--bg)",
      color: "var(--text)",
      padding: "24px 18px 60px"
    }}>
      <div style={{ maxWidth: 1050, margin: "0 auto" }}>
        <header style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 15,
          marginBottom: 40
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 11
          }}>
            <div style={{
              background: "var(--accent)",
              color: "#fff",
              padding: 11,
              borderRadius: 13
            }}>
              <Stethoscope size={25} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 23 }}>MedMind</h1>
              <span style={{ color: "var(--muted)", fontSize: 12 }}>
                Medical learning platform
              </span>
            </div>
          </div>

          <button
            onClick={() => setDark(value => !value)}
            aria-label="Toggle theme"
            style={{
              width: 43,
              height: 43,
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--panel)",
              color: "var(--text)",
              cursor: "pointer"
            }}
          >
            {dark ? <Sun size={19} /> : <Moon size={19} />}
          </button>
        </header>

        <section style={{ marginBottom: 30 }}>
          <div style={{
            background: dark
              ? "linear-gradient(120deg,#173b48,#1d2b40)"
              : "linear-gradient(120deg,#e0f5f1,#edf4ff)",
            borderRadius: 22,
            padding: "30px 25px"
          }}>
            <span style={{
              color: "var(--accent)",
              fontWeight: 700,
              fontSize: 13
            }}>
              YOUR MEDICAL LEARNING COMPANION
            </span>
            <h2 style={{
              fontSize: 30,
              margin: "12px 0 8px",
              lineHeight: 1.3
            }}>
              Learn medicine. Think clinically.
            </h2>
            <p style={{
              color: "var(--muted)",
              lineHeight: 1.8,
              maxWidth: 600,
              margin: 0
            }}>
              Understand the mechanisms, connect the clinical findings, and
              build your confidence through active medical learning.
            </p>
          </div>
        </section>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 14px",
          borderRadius: 12,
          background: "var(--panel)",
          border: "1px solid var(--border)",
          marginBottom: 22
        }}>
          <Search size={19} color="var(--muted)" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tools..."
            style={{
              flex: 1,
              border: 0,
              outline: 0,
              background: "transparent",
              color: "var(--text)"
            }}
          />
        </div>

        <h2 style={{ marginBottom: 17 }}>Your Learning Tools</h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(245px,1fr))",
          gap: 16
        }}>
          {visibleTools.map(tool => {
            const Icon = tool.icon;

            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                style={{
                  textAlign: "left",
                  background: "var(--panel)",
                  border: "1px solid var(--border)",
                  borderRadius: 18,
                  padding: 21,
                  color: "var(--text)",
                  cursor: "pointer",
                  minHeight: 180
                }}
              >
                <div style={{
                  width: 45,
                  height: 45,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 13,
                  background: "var(--accent-soft)",
                  color: "var(--accent)"
                }}>
                  <Icon size={23} />
                </div>
                <h3 style={{ margin: "16px 0 8px" }}>{tool.title}</h3>
                <p style={{
                  color: "var(--muted)",
                  fontSize: 13,
                  lineHeight: 1.7,
                  margin: 0
                }}>
                  {tool.description}
                </p>
                <div style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 12,
                  color: "var(--accent)"
                }}>
                  <ArrowRight size={19} />
                </div>
              </button>
            );
          })}
        </div>

        {visibleTools.length === 0 && (
          <p style={{ color: "var(--muted)", textAlign: "center" }}>
            No matching tools found.
          </p>
        )}

        <footer style={{
          marginTop: 45,
          textAlign: "center",
          color: "var(--muted)",
          fontSize: 12
        }}>
          MedMind · Learn with understanding
        </footer>
      </div>
    </main>
  );
}
