import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, HeartPulse, Send, RotateCcw, AlertTriangle, UserRound, Bot, Loader2 } from "lucide-react";

const API_URL = "https://medmind-test.mohamedradey2hh0.workers.dev/";

function parseFrame(frame) {
  const lines = String(frame || "").split(/\r?\n/);
  const eventName = lines.find(line => line.startsWith("event:"))?.slice(6).trim();
  const data = lines.filter(line => line.startsWith("data:")).map(line => line.slice(5).trim()).join("\n");
  if (!data || data === "[DONE]") return null;
  let parsed;
  try { parsed = JSON.parse(data); }
  catch { throw new Error("وصل رد غير مفهوم من الخادم. حاول مرة أخرى."); }
  if (eventName === "error" || parsed.event_type === "error" || parsed.error) {
    throw new Error(typeof parsed.error === "string" ? parsed.error : parsed.error?.message || "حدث خطأ أثناء توليد الرد.");
  }
  return typeof parsed.text === "string" ? parsed.text : "";
}

export default function HealthAssistant({ onBack, darkMode = false, setDarkMode }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef(null);
  const abortRef = useRef(null);

  const colors = darkMode
    ? { page: "#0b1220", card: "#111c2e", text: "#e5edf7", muted: "#9aabc0", border: "#26364d", soft: "#17263b", user: "#123b3b" }
    : { page: "#f5f8fb", card: "#ffffff", text: "#172b4d", muted: "#64748b", border: "#e2e8f0", soft: "#f1f5f9", user: "#e0f2f1" };

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages, loading]);
  useEffect(() => () => abortRef.current?.abort(), []);

  async function sendMessage(e) {
    e?.preventDefault();
    const question = input.trim();
    if (!question || loading) return;
    const history = messages.map(m => ({ role: m.role, text: m.text }));
    const assistantId = `health-${Date.now()}`;
    const controller = new AbortController();
    abortRef.current = controller;
    setInput(""); setError(""); setLoading(true);
    setMessages(prev => [...prev, { role: "user", text: question }, { id: assistantId, role: "assistant", text: "" }]);
    try {
      const response = await fetch(API_URL, {
        method: "POST", signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "health_assistant", question, history })
      });
      if (!response.ok) {
        let message = "تعذر الاتصال بالمساعد الصحي.";
        try { const data = await response.json(); message = data.error || message; } catch {}
        throw new Error(message);
      }
      if (!response.body) throw new Error("المتصفح لا يدعم استقبال الرد المتدفق.");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let received = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const frames = buffer.split(/\r?\n\r?\n/);
        buffer = frames.pop() || "";
        for (const frame of frames) {
          const piece = parseFrame(frame);
          if (piece) {
            received += piece;
            setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, text: received } : m));
          }
        }
      }
      if (buffer.trim()) {
        const piece = parseFrame(buffer);
        if (piece) received += piece;
      }
      if (received) setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, text: received } : m));
      else throw new Error("لم يصل رد مكتمل. أعد إرسال رسالتك.");
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "حدث خطأ. حاول مرة أخرى.");
        setMessages(prev => prev.filter(m => m.id !== assistantId));
      }
    } finally { setLoading(false); abortRef.current = null; }
  }

  function resetChat() {
    abortRef.current?.abort();
    setMessages([]); setInput(""); setError(""); setLoading(false);
  }

  const button = { border: `1px solid ${colors.border}`, borderRadius: 12, padding: "10px 14px", background: colors.card, color: colors.text, cursor: "pointer", fontFamily: "inherit", fontWeight: 700 };

  return (
    <div dir="rtl" style={{ minHeight: "100vh", background: colors.page, color: colors.text, padding: "20px 14px 40px", fontFamily: "inherit" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <button onClick={onBack} style={button}><ArrowRight size={17} style={{ verticalAlign: "middle", marginLeft: 6 }} /> رجوع للرئيسية</button>
          <button onClick={resetChat} style={button}><RotateCcw size={16} style={{ verticalAlign: "middle", marginLeft: 6 }} /> محادثة جديدة</button>
        </div>
        <section style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 20, padding: 20, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 52, height: 52, display: "grid", placeItems: "center", borderRadius: 16, background: darkMode ? "#123b3b" : "#ccfbf1", color: "#0d9488" }}><HeartPulse size={28} /></div>
            <div><div style={{ color: "#0d9488", fontSize: 12, fontWeight: 800, letterSpacing: 1 }}>NEBRAS · HEALTH ASSISTANT</div><h1 style={{ margin: "5px 0", fontSize: 23 }}>المساعد الصحي الذكي</h1><p style={{ margin: 0, color: colors.muted, fontSize: 13 }}>اكتب ما تشعر به وسأساعدك على فهم الأعراض والخطوات الآمنة التالية.</p></div>
          </div>
        </section>
        <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 18, padding: 16, minHeight: 360 }}>
          {messages.length === 0 ? <div style={{ maxWidth: 600, margin: "42px auto", textAlign: "center", color: colors.muted, lineHeight: 2 }}><HeartPulse size={38} color="#0d9488" /><h3 style={{ color: colors.text, marginBottom: 6 }}>كيف يمكنني مساعدتك؟</h3><p>صف الأعراض، ومتى بدأت، وما الذي يزيدها أو يخففها. سأطرح أسئلة توضيحية عند الحاجة.</p></div> : messages.map((m, i) => (
            <div key={m.id || i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-start" : "flex-end", margin: "12px 0" }}>
              <div style={{ maxWidth: "88%", padding: "12px 15px", borderRadius: 15, background: m.role === "user" ? colors.user : colors.soft, border: `1px solid ${colors.border}`, lineHeight: 1.9, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: colors.muted, marginBottom: 5 }}>{m.role === "user" ? <><UserRound size={13} /> أنت</> : <><Bot size={13} /> نَبْراس</>}</div>
                {m.text || (loading && i === messages.length - 1 ? "جاري التفكير..." : "")}
              </div>
            </div>
          ))}
          {loading && <div style={{ color: colors.muted, fontSize: 12, padding: 8 }}><Loader2 size={14} /> جاري إعداد الرد...</div>}
          <div ref={endRef} />
        </div>
        {error && <div role="alert" style={{ marginTop: 10, padding: 12, borderRadius: 12, background: darkMode ? "#3b2525" : "#fff1f2", color: darkMode ? "#fecdd3" : "#be123c" }}>{error}</div>}
        <form onSubmit={sendMessage} style={{ display: "flex", gap: 9, marginTop: 12, alignItems: "stretch" }}>
          <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(e); } }} rows={2} placeholder="اكتب الأعراض أو سؤالك الصحي هنا..." style={{ flex: 1, resize: "vertical", minWidth: 0, border: `1px solid ${colors.border}`, borderRadius: 13, padding: 13, background: colors.card, color: colors.text, font: "inherit", lineHeight: 1.7 }} />
          <button type="submit" disabled={!input.trim() || loading} style={{ ...button, background: "#0d9488", color: "white", border: 0, opacity: !input.trim() || loading ? .55 : 1 }} aria-label="إرسال"><Send size={19} /></button>
        </form>
        <div style={{ display: "flex", gap: 7, alignItems: "flex-start", marginTop: 12, color: colors.muted, fontSize: 11, lineHeight: 1.8 }}><AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 3 }} /> هذا المساعد للتوجيه والتثقيف الصحي المبدئي، ولا يستبدل الكشف الطبي أو تشخيص الطبيب. في حالات صعوبة التنفس الشديدة أو ألم الصدر الشديد أو فقدان الوعي أو النزيف الشديد، اطلب الطوارئ فورًا.</div>
      </div>
    </div>
  );
}
