
import { useState } from "react";
import {
  BookOpen,
  Brain,
  ClipboardList,
  Layers,
  Search,
  Sparkles,
  GraduationCap,
  ArrowLeft,
  Menu,
  X,
  Stethoscope,
  Clock,
  Target
} from "lucide-react";

const tools = [
  {
    icon: BookOpen,
    title: "شرح المحاضرات",
    description: "ارفع ملف المحاضرة وافهم محتواه خطوة بخطوة بالعربي والإنجليزي.",
    color: "blue",
    label: "Lecture Assistant"
  },
  {
    icon: ClipboardList,
    title: "توليد الامتحانات",
    description: "أنشئ MCQs وأسئلة صح وخطأ وأسئلة مقالية مع شرح الإجابات.",
    color: "purple",
    label: "Exam Generator"
  },
  {
    icon: Brain,
    title: "المراجعة الذكية",
    description: "حوّل المعلومات إلى Flashcards وراجعها بطريقة التكرار المتباعد.",
    color: "green",
    label: "Smart Revision"
  },
  {
    icon: Layers,
    title: "المكتبة الطبية",
    description: "نظّم مواد الطب ومصادرك التعليمية في مكان واحد.",
    color: "orange",
    label: "Medical Library"
  }
];

function App() {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#">
          <span className="brand-icon"><Stethoscope size={23} /></span>
          <span>Med<span className="brand-accent">Mind</span></span>
        </a>

        <button
          className="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="القائمة"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <a href="#tools" onClick={() => setMenuOpen(false)}>الأدوات</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>عن المنصة</a>
          <a href="#tools" onClick={() => setMenuOpen(false)}>المكتبة الطبية</a>
        </nav>

        <a className="nav-button" href="#tools">ابدأ التعلم <ArrowLeft size={16} /></a>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="eyebrow">
              <Sparkles size={15} />
              <span>مستقبلك الطبي يبدأ من هنا</span>
            </div>

            <h1>
              تعلّم الطب
              <br />
              <span>بذكاء أكبر.</span>
            </h1>

            <p>
              منصتك التعليمية الذكية المصممة لطلاب الطب.
              افهم محاضراتك، اختبر معلوماتك، ونظّم رحلتك الدراسية في مكان واحد.
            </p>

            <div className="hero-actions">
              <a href="#tools" className="primary-button">
                اكتشف أدوات المنصة <ArrowLeft size={18} />
              </a>
              <a href="#about" className="secondary-button">اعرف المزيد</a>
            </div>

            <div className="hero-note">
              <GraduationCap size={19} />
              <span>مصممة لطلاب كليات الطب</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-glow"></div>
            <div className="medical-card">
              <div className="medical-card-top">
                <span className="live-dot"></span>
                <span>YOUR MEDICAL JOURNEY</span>
                <Sparkles size={17} />
              </div>

              <div className="brain-illustration">
                <Brain size={112} strokeWidth={1.15} />
              </div>

              <div className="visual-message">
                <span>STUDY SMARTER</span>
                <strong>Understand. Practice. Excel.</strong>
              </div>

              <div className="visual-stats">
                <div><BookOpen size={17} /><span>Learn</span></div>
                <div><Target size={17} /><span>Practice</span></div>
                <div><Clock size={17} /><span>Revise</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="tools-section" id="tools">
          <div className="section-heading">
            <div>
              <span className="section-label">YOUR LEARNING TOOLS</span>
              <h2>كل ما تحتاجه في رحلتك الطبية</h2>
              <p>أدوات تعليمية ذكية تساعدك تفهم وتتعلم وتراجع بكفاءة.</p>
            </div>
          </div>

          <div className="search-box">
            <Search size={20} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن أداة تعليمية..."
            />
          </div>

          <div className="tools-grid">
            {tools
              .filter((tool) =>
                `${tool.title} ${tool.description} ${tool.label}`
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )
              .map((tool) => {
                const Icon = tool.icon;
                return (
                  <article className="tool-card" key={tool.title}>
                    <div className={`tool-icon ${tool.color}`}>
                      <Icon size={25} />
                    </div>
                    <span className="tool-label">{tool.label}</span>
                    <h3>{tool.title}</h3>
                    <p>{tool.description}</p>
                    <button className="tool-link" onClick={() => alert("هذه الأداة ستكون متاحة قريبًا.")}>
                      اكتشف الأداة <ArrowLeft size={16} />
                    </button>
                  </article>
                );
              })}
          </div>

          {tools.filter((tool) =>
            `${tool.title} ${tool.description} ${tool.label}`
              .toLowerCase()
              .includes(search.toLowerCase())
          ).length === 0 && (
            <p className="empty-search">لا توجد نتائج مطابقة لبحثك.</p>
          )}
        </section>

        <section className="about-section" id="about">
          <div className="about-icon"><GraduationCap size={30} /></div>
          <div>
            <span className="section-label">BUILT FOR MEDICAL STUDENTS</span>
            <h2>مش مجرد أدوات.. دي بيئة تعليمية متكاملة.</h2>
            <p>
              هدفنا إننا نخلي دراسة الطب أكثر وضوحًا وتنظيمًا،
              ونساعد كل طالب يوصل لأفضل طريقة تعلم تناسبه.
            </p>
          </div>
        </section>
      </main>

      <footer>
        <a className="brand" href="#">
          <span className="brand-icon"><Stethoscope size={20} /></span>
          <span>Med<span className="brand-accent">Mind</span></span>
        </a>
        <p>تعلم بذكاء، واصنع مستقبلك الطبي.</p>
        <span className="copyright">© 2026 MedMind</span>
      </footer>
    </div>
  );
}

export default App;
