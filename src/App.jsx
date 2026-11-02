
import React, { useState } from "react";
import {
  Stethoscope,
  Brain,
  BookOpen,
  ClipboardList,
  Search,
  Menu,
  X,
  ArrowLeft,
  GraduationCap,
  Sparkles,
  HeartPulse,
  FileText,
  MessageCircle,
  ChevronLeft,
} from "lucide-react";

export default function App() {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const tools = [
    {
      icon: Brain,
      title: "المساعد الطبي الذكي",
      desc: "افهم المعلومات الطبية بطريقة مبسطة ومنظمة.",
      tag: "AI Assistant",
    },
    {
      icon: BookOpen,
      title: "شرح المحاضرات",
      desc: "حوّل الموضوعات الصعبة إلى شرح سهل ومفهوم.",
      tag: "Smart Learning",
    },
    {
      icon: ClipboardList,
      title: "بنك الأسئلة",
      desc: "اختبر معلوماتك بأسئلة اختيار من متعدد.",
      tag: "MCQs",
    },
    {
      icon: FileText,
      title: "ملخصات طبية",
      desc: "راجع أهم النقاط والمعلومات قبل الامتحان.",
      tag: "Summaries",
    },
  ];

  const filteredTools = tools.filter((tool) =>
    tool.title.includes(search) || tool.desc.includes(search)
  );

  const comingSoon = () => {
    alert("الأداة ستكون متاحة قريبًا بإذن الله.");
  };

  return (
    <div className="app" dir="rtl">
      <header className="navbar">
        <div className="container nav-content">
          <a href="#" className="brand">
            <div className="brand-icon">
              <Stethoscope size={25} />
            </div>
            <span>MedMind</span>
          </a>

          <nav className={menuOpen ? "nav-links open" : "nav-links"}>
            <a href="#home" onClick={() => setMenuOpen(false)}>الرئيسية</a>
            <a href="#tools" onClick={() => setMenuOpen(false)}>الأدوات</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>عن المنصة</a>
          </nav>

          <button
            className="menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="القائمة"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="container hero-content">
            <div className="hero-text">
              <div className="hero-badge">
                <Sparkles size={15} />
                مستقبل التعليم الطبي يبدأ هنا
              </div>

              <h1>
                تعلّم الطب
                <br />
                <span>بطريقة أذكى</span>
              </h1>

              <p>
                منصة تعليمية ذكية تساعد طلاب الطب على الفهم،
                المراجعة، والاستعداد للامتحانات باستخدام أدوات
                تعليمية حديثة.
              </p>

              <div className="hero-actions">
                <a href="#tools" className="primary-btn">
                  اكتشف الأدوات <ArrowLeft size={18} />
                </a>
                <a href="#about" className="secondary-btn">
                  اعرف المزيد
                </a>
              </div>

              <div className="hero-note">
                <HeartPulse size={18} />
                صُممت لتجعل رحلة دراسة الطب أسهل
              </div>
            </div>

            <div className="hero-visual">
              <div className="visual-circle">
                <div className="visual-icon">
                  <Stethoscope size={75} />
                </div>
                <div className="floating-card card-one">
                  <Brain size={20} />
                  <span>تعلم بذكاء</span>
                </div>
                <div className="floating-card card-two">
                  <GraduationCap size={20} />
                  <span>طوّر مستواك</span>
                </div>
                <div className="floating-card card-three">
                  <BookOpen size={20} />
                  <span>افهم أكثر</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="container features-grid">
            <div className="feature-item">
              <Brain />
              <div>
                <h3>فهم أعمق</h3>
                <p>مش مجرد حفظ للمعلومات</p>
              </div>
            </div>
            <div className="feature-item">
              <BookOpen />
              <div>
                <h3>تعلم منظم</h3>
                <p>كل أدواتك في مكان واحد</p>
              </div>
            </div>
            <div className="feature-item">
              <GraduationCap />
              <div>
                <h3>تطور مستمر</h3>
                <p>خطوة بخطوة نحو التميز</p>
              </div>
            </div>
          </div>
        </section>

        <section className="tools-section" id="tools">
          <div className="container">
            <div className="section-heading">
              <span className="section-label">اكتشف المنصة</span>
              <h2>أدوات تساعدك في رحلتك الطبية</h2>
              <p>
                مجموعة من الأدوات التعليمية المصممة لتسهيل دراسة الطب.
              </p>
            </div>

            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="ابحث عن أداة..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="tools-grid">
              {filteredTools.map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <article className="tool-card" key={index}>
                    <div className="tool-icon">
                      <Icon size={27} />
                    </div>
                    <span className="tool-tag">{tool.tag}</span>
                    <h3>{tool.title}</h3>
                    <p>{tool.desc}</p>
                    <button onClick={comingSoon} className="tool-link">
                      استكشف الأداة <ChevronLeft size={18} />
                    </button>
                  </article>
                );
              })}
            </div>

            {filteredTools.length === 0 && (
              <p className="no-results">لا توجد أدوات مطابقة للبحث.</p>
            )}
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="container about-content">
            <div className="about-icon">
              <Stethoscope size={48} />
            </div>
            <div>
              <span className="section-label">عن MedMind</span>
              <h2>التكنولوجيا في خدمة التعليم الطبي</h2>
              <p>
                هدفنا بناء تجربة تعليمية تساعد طالب الطب على الوصول
                للمعلومة وفهمها وتطبيقها، من خلال أدوات ذكية ومحتوى
                تعليمي منظم.
              </p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <MessageCircle size={35} />
            <h2>رحلتك في تعلم الطب تستحق بداية أفضل</h2>
            <p>ابدأ اكتشاف الأدوات التعليمية المتاحة على المنصة.</p>
            <a href="#tools" className="primary-btn">
              ابدأ الآن <ArrowLeft size={18} />
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-content">
          <a href="#" className="brand">
            <div className="brand-icon">
              <Stethoscope size={22} />
            </div>
            <span>MedMind</span>
          </a>
          <p>© 2026 MedMind. جميع الحقوق محفوظة.</p>
          <span>Made for medical students</span>
        </div>
      </footer>
    </div>
  );
}
