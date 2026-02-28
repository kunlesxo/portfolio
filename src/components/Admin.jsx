import { useState, useEffect, useRef } from "react";
import { Routes, Route, useNavigate, useParams, Navigate } from "react-router-dom";

/* ─────────────────────────────────────────────────────────────
   CONFIG  — change BASE_URL to match your Django server
───────────────────────────────────────────────────────────── */
const BASE_URL = "http://127.0.0.1:8000/api/v1";

/* ─────────────────────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Syne:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #07080D;
    --surface:  #0D0F18;
    --panel:    #111420;
    --border:   #1C2035;
    --border2:  #262B42;
    --accent:   #3B6EFF;
    --accentL:  #6B93FF;
    --accentD:  #1A3FA0;
    --red:      #FF4455;
    --redL:     #FF7A85;
    --green:    #00C896;
    --yellow:   #FFB830;
    --white:    #E8EAF6;
    --muted:    #4A5070;
    --muted2:   #7880A0;
    --mono:     'IBM Plex Mono', monospace;
    --sans:     'Syne', sans-serif;
  }

  html, body { height: 100%; }
  body {
    background: var(--bg); color: var(--white);
    font-family: var(--sans); -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }
  button, input { font-family: var(--sans); }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: var(--surface); }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
  @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes slideIn  { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
  @keyframes blink    { 0%,100%{opacity:1} 49%{opacity:1} 50%{opacity:0} }

  .btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 20px; border-radius: 3px; border: none;
    font-family: var(--sans); font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.18s; letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .btn-primary {
    background: var(--accent); color: #fff;
    box-shadow: 0 0 20px rgba(59,110,255,0.3);
  }
  .btn-primary:hover { background: var(--accentL); box-shadow: 0 0 30px rgba(59,110,255,0.5); transform: translateY(-1px); }
  .btn-ghost {
    background: transparent; color: var(--muted2);
    border: 1px solid var(--border2);
  }
  .btn-ghost:hover { border-color: var(--accent); color: var(--accentL); }
  .btn-danger {
    background: rgba(255,68,85,0.12); color: var(--red);
    border: 1px solid rgba(255,68,85,0.25);
  }
  .btn-danger:hover { background: rgba(255,68,85,0.2); }
  .btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none !important; }

  .input {
    width: 100%; padding: 10px 14px;
    background: var(--bg); border: 1px solid var(--border2);
    border-radius: 3px; color: var(--white);
    font-family: var(--mono); font-size: 13px; outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(59,110,255,0.12); }
  .input::placeholder { color: var(--muted); }

  .tag {
    display: inline-flex; align-items: center;
    padding: 2px 8px; border-radius: 2px;
    font-family: var(--mono); font-size: 10px; font-weight: 500;
    letter-spacing: 0.06em; text-transform: uppercase;
  }

  .scanline-wrap { position: fixed; inset: 0; pointer-events: none; z-index: 9998; overflow: hidden; }
  .scanline {
    position: absolute; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent 0%, rgba(59,110,255,0.06) 50%, transparent 100%);
    animation: scanline 8s linear infinite;
  }

  .grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(59,110,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59,110,255,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
  }
`;

/* ─────────────────────────────────────────────────────────────
   UUID GENERATOR
───────────────────────────────────────────────────────────── */
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/* ─────────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────────── */
const Ic = {
  lock:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  eye:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  eyeOff:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  search:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  refresh:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
  logout:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  card:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  shield:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  user:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  copy:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
  check:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  warning:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  filter:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  chevDown: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>,
};

/* ─────────────────────────────────────────────────────────────
   BRAND HELPER
───────────────────────────────────────────────────────────── */
const BRAND_COLORS = {
  visa:       { bg: "#1A1F6E", text: "#7B93FF" },
  mastercard: { bg: "#3D1515", text: "#FF7A5A" },
  amex:       { bg: "#0C2A4A", text: "#5BB8FF" },
  discover:   { bg: "#3D2500", text: "#FFB830" },
  other:      { bg: "#1C2035", text: "#7880A0" },
};

function BrandTag({ brand }) {
  const c = BRAND_COLORS[brand] || BRAND_COLORS.other;
  return (
    <span className="tag" style={{ background: c.bg, color: c.text, border: `1px solid ${c.text}22` }}>
      {brand}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   LOGIN PANEL — WITH API CALL
───────────────────────────────────────────────────────────── */
function LoginPanel() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode]         = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleLogin = async () => {
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/admin/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, access_code: code }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Login failed.");
      const authData = {
        token: json.data.tokens.access,
        accessCode: code,
        user: json.data.user,
        sessionId: generateUUID(),
      };
      sessionStorage.setItem("adminAuth", JSON.stringify(authData));
      navigate("/admin/dashboard");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
      <div style={{ width: 420, animation: "fadeUp 0.5s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 52, height: 52, borderRadius: 4, background: "linear-gradient(135deg, var(--accent), var(--accentL))", marginBottom: 20, boxShadow: "0 0 40px rgba(59,110,255,0.4)" }}>
            {Ic.shield}
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 10 }}>
            KNGEGO TICKETING
          </div>
          <h1 style={{ fontFamily: "var(--sans)", fontSize: 28, fontWeight: 800, color: "var(--white)", letterSpacing: "-0.02em" }}>
            Admin Console
          </h1>
          <p style={{ fontSize: 13, color: "var(--muted2)", marginTop: 8 }}>
            Credit Card Vault · Restricted Access
          </p>
        </div>

        <div style={{ padding: "10px 14px", marginBottom: 24, background: "rgba(255,184,48,0.06)", border: "1px solid rgba(255,184,48,0.2)", borderRadius: 3, display: "flex", alignItems: "flex-start", gap: 10, fontSize: 12, color: "#FFB830", lineHeight: 1.6 }}>
          <span style={{ flexShrink: 0, marginTop: 1 }}>{Ic.warning}</span>
          <span><strong>Practice environment.</strong> Raw card data is visible. Never do this in production.</span>
        </div>

        <div style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 4, padding: "28px 28px 24px" }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: "var(--muted2)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>Admin Email</label>
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: "var(--muted2)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>Password</label>
            <div style={{ position: "relative" }}>
              <input className="input" type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ paddingRight: 40 }} onKeyDown={e => e.key === "Enter" && handleLogin()} />
              <button onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--muted)", cursor: "pointer", display: "flex", alignItems: "center" }}>
                {showPw ? Ic.eyeOff : Ic.eye}
              </button>
            </div>
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: "var(--muted2)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>8-Char Access Code</label>
            <div style={{ position: "relative" }}>
              <input className="input" type={showCode ? "text" : "password"} value={code} onChange={e => setCode(e.target.value.slice(0, 8))} placeholder="Ab3Xy7Qz" maxLength={8} style={{ paddingRight: 40, letterSpacing: "0.2em" }} onKeyDown={e => e.key === "Enter" && handleLogin()} />
              <button onClick={() => setShowCode(!showCode)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--muted)", cursor: "pointer", display: "flex", alignItems: "center" }}>
                {showCode ? Ic.eyeOff : Ic.eye}
              </button>
            </div>
            <div style={{ marginTop: 6, display: "flex", gap: 4 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ flex: 1, height: 2, borderRadius: 1, background: i < code.length ? "var(--accent)" : "var(--border2)", transition: "background 0.15s" }} />
              ))}
            </div>
          </div>

          {error && (
            <div style={{ marginBottom: 16, padding: "10px 14px", background: "rgba(255,68,85,0.08)", border: "1px solid rgba(255,68,85,0.2)", borderRadius: 3, fontSize: 13, color: "var(--red)", display: "flex", alignItems: "center", gap: 8 }}>
              {Ic.warning} {error}
            </div>
          )}

          <button onClick={handleLogin} disabled={loading || !email || !password || code.length < 8} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px" }}>
            {loading
              ? <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Authenticating...</>
              : <>{Ic.lock} Access Vault</>
            }
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 16, fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em" }}>
          JWT + ACCESS CODE REQUIRED · ADMIN ONLY
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   DATA BLOCK
───────────────────────────────────────────────────────────── */
function DataBlock({ label, children, warn = false, span = 1 }) {
  return (
    <div style={{ gridColumn: span > 1 ? `span ${span}` : undefined, padding: "12px 14px", background: "var(--bg)", borderRadius: 3, border: `1px solid ${warn ? "rgba(255,184,48,0.15)" : "var(--border)"}` }}>
      <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", color: warn ? "var(--yellow)" : "var(--muted)", textTransform: "uppercase", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
        {warn && <span style={{ fontSize: 11 }}>⚠</span>}
        {label}
      </div>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CARD ROW (expandable)
───────────────────────────────────────────────────────────── */
function CardRow({ card, idx }) {
  const [expanded, setExpanded] = useState(false);
  const [showCvv, setShowCvv]   = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [copied, setCopied]     = useState(null);

  const copy = (val, key) => {
    navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const expired = (() => {
    const now = new Date();
    return card.exp_year < now.getFullYear() ||
      (card.exp_year === now.getFullYear() && card.exp_month < now.getMonth() + 1);
  })();

  const maskedNum = card.digit
    ? card.digit.replace(/(.{4})/g, "$1 ").trim().replace(/\d(?=.{5})/g, "•")
    : "•••• •••• •••• " + (card.last4 || "????");

  const fullNum = card.digit
    ? card.digit.replace(/(.{4})/g, "$1 ").trim()
    : "N/A";

  return (
    <div
      style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}
      onMouseEnter={e => { if (!expanded) e.currentTarget.style.background = "rgba(59,110,255,0.03)"; }}
      onMouseLeave={e => { if (!expanded) e.currentTarget.style.background = "transparent"; }}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        style={{ display: "grid", gridTemplateColumns: "32px 1fr 160px 120px 100px 90px 60px", alignItems: "center", gap: 12, padding: "14px 20px", cursor: "pointer" }}
      >
        <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", textAlign: "right" }}>{String(idx + 1).padStart(2, "0")}</div>
        <div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--white)", marginBottom: 2 }}>{card.email}</div>
          <div style={{ fontSize: 11, color: "var(--muted2)" }}>{card.card_holder_name}</div>
        </div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted2)", letterSpacing: "0.06em" }}>
          •••• •••• •••• {card.last4 || card.digit?.slice(-4) || "????"}
        </div>
        <BrandTag brand={card.brand} />
        <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: expired ? "var(--red)" : "var(--muted2)" }}>
          {String(card.exp_month).padStart(2, "0")}/{card.exp_year}
          {expired && <span style={{ marginLeft: 5, fontSize: 9, background: "rgba(255,68,85,0.15)", color: "var(--red)", padding: "1px 5px", borderRadius: 2 }}>EXP</span>}
        </div>
        <div>
          {card.is_default
            ? <span className="tag" style={{ background: "rgba(0,200,150,0.1)", color: "var(--green)", border: "1px solid rgba(0,200,150,0.2)" }}>Default</span>
            : <span style={{ fontSize: 11, color: "var(--muted)" }}>—</span>
          }
        </div>
        <div style={{ display: "flex", justifyContent: "center", color: "var(--muted)", transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "none" }}>
          {Ic.chevDown}
        </div>
      </div>

      {expanded && (
        <div style={{ padding: "0 20px 20px 64px", animation: "fadeIn 0.2s ease" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>

            <DataBlock label="Card Number" warn>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <code style={{ fontFamily: "var(--mono)", fontSize: 13, letterSpacing: "0.12em", color: showFull ? "#FFB830" : "var(--white)" }}>
                  {showFull ? fullNum : maskedNum}
                </code>
                <button onClick={() => setShowFull(!showFull)} style={{ background: "none", border: "none", color: "var(--muted2)", cursor: "pointer", display: "flex", padding: 2 }}>
                  {showFull ? Ic.eyeOff : Ic.eye}
                </button>
                {showFull && (
                  <button onClick={() => copy(card.digit, "num")} style={{ background: "none", border: "none", color: copied === "num" ? "var(--green)" : "var(--muted2)", cursor: "pointer", display: "flex", padding: 2 }}>
                    {copied === "num" ? Ic.check : Ic.copy}
                  </button>
                )}
              </div>
            </DataBlock>

            <DataBlock label="CVV" warn>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <code style={{ fontFamily: "var(--mono)", fontSize: 14, color: showCvv ? "#FFB830" : "var(--white)" }}>
                  {showCvv ? card.cvv : "•••"}
                </code>
                <button onClick={() => setShowCvv(!showCvv)} style={{ background: "none", border: "none", color: "var(--muted2)", cursor: "pointer", display: "flex", padding: 2 }}>
                  {showCvv ? Ic.eyeOff : Ic.eye}
                </button>
                {showCvv && (
                  <button onClick={() => copy(card.cvv, "cvv")} style={{ background: "none", border: "none", color: copied === "cvv" ? "var(--green)" : "var(--muted2)", cursor: "pointer", display: "flex", padding: 2 }}>
                    {copied === "cvv" ? Ic.check : Ic.copy}
                  </button>
                )}
              </div>
            </DataBlock>

            <DataBlock label="Expiry">
              <code style={{ fontFamily: "var(--mono)", fontSize: 13, color: expired ? "var(--red)" : "var(--white)" }}>
                {String(card.exp_month).padStart(2, "0")} / {card.exp_year}
              </code>
            </DataBlock>

            <DataBlock label="Billing Address" span={2}>
              <div style={{ fontSize: 12, color: "var(--muted2)", lineHeight: 1.7 }}>
                {card.billing_address_line1}{card.billing_address_line2 ? `, ${card.billing_address_line2}` : ""}<br />
                {card.billing_city}, {card.billing_state} {card.billing_postal_code}<br />
                {card.billing_country}
              </div>
            </DataBlock>

            <DataBlock label="Linked User">
              {card.user_id
                ? <div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--accentL)" }}>ID #{card.user_id}</div>
                    <div style={{ fontSize: 11, color: "var(--muted2)", marginTop: 2 }}>{card.user_email || "—"}</div>
                  </div>
                : <span style={{ fontSize: 11, color: "var(--muted)" }}>Guest (no account)</span>
              }
            </DataBlock>

            <DataBlock label="Created">
              <code style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted2)" }}>
                {new Date(card.created_at).toLocaleString()}
              </code>
            </DataBlock>

            <DataBlock label="Last Updated">
              <code style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted2)" }}>
                {new Date(card.updated_at).toLocaleString()}
              </code>
            </DataBlock>

            <DataBlock label="Card ID">
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <code style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--white)" }}>#{card.id}</code>
                <button onClick={() => copy(String(card.id), "id")} style={{ background: "none", border: "none", color: copied === "id" ? "var(--green)" : "var(--muted)", cursor: "pointer", display: "flex", padding: 2 }}>
                  {copied === "id" ? Ic.check : Ic.copy}
                </button>
              </div>
            </DataBlock>

          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   DASHBOARD — WITH API CALLS
───────────────────────────────────────────────────────────── */
function Dashboard() {
  const navigate = useNavigate();
  const [auth, setAuth]           = useState(null);
  const [cards, setCards]         = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [search, setSearch]       = useState("");
  const [filterBrand, setFilter]  = useState("all");
  const [filterDefault, setFD]    = useState("all");
  const [sortField, setSortField] = useState("created_at");
  const [sortDir, setSortDir]     = useState("desc");
  const [count, setCount]         = useState(0);
  const [emailSearch, setESearch] = useState("");

  useEffect(() => {
    const savedAuth = sessionStorage.getItem("adminAuth");
    if (savedAuth) {
      setAuth(JSON.parse(savedAuth));
    } else {
      navigate("/admin/login");
    }
  }, [navigate]);

  const fetchCards = async (currentAuth, emailFilter = "") => {
    if (!currentAuth) return;
    setLoading(true); setError("");
    try {
      const url = new URL(`${BASE_URL}/admin/credit-cards`);
      if (emailFilter) url.searchParams.set("email", emailFilter);
      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${currentAuth.token}`,
          "X-Access-Code": currentAuth.accessCode,
        },
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Failed to fetch cards.");
      setCards(json.data);
      setCount(json.count);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth) fetchCards(auth);
  }, [auth]);

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    navigate("/admin/login");
  };

  const ColHeader = ({ field, label }) => (
    <button
      onClick={() => {
        if (sortField === field) {
          setSortDir(d => d === "asc" ? "desc" : "asc");
        } else {
          setSortField(field);
          setSortDir("asc");
        }
      }}
      style={{
        background: "none", border: "none",
        color: sortField === field ? "var(--accentL)" : "var(--muted2)",
        fontSize: 10, fontWeight: 600, letterSpacing: "0.15em",
        textTransform: "uppercase", cursor: "pointer",
        display: "flex", alignItems: "center", gap: 4,
        fontFamily: "var(--sans)",
      }}
    >
      {label}
      {sortField === field && (
        <span style={{ fontSize: 8, opacity: 0.7 }}>{sortDir === "asc" ? "▲" : "▼"}</span>
      )}
    </button>
  );

  const filtered = cards
    .filter(c => {
      const q = search.toLowerCase();
      const matchSearch = !q
        || c.email?.toLowerCase().includes(q)
        || c.card_holder_name?.toLowerCase().includes(q)
        || c.last4?.includes(q)
        || c.digit?.includes(q);
      const matchBrand = filterBrand === "all" || c.brand === filterBrand;
      const matchDef   = filterDefault === "all" || (filterDefault === "yes" ? c.is_default : !c.is_default);
      return matchSearch && matchBrand && matchDef;
    })
    .sort((a, b) => {
      let av = a[sortField], bv = b[sortField];
      if (typeof av === "string") { av = av.toLowerCase(); bv = bv.toLowerCase(); }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const brands = ["all", ...Array.from(new Set(cards.map(c => c.brand).filter(Boolean)))];

  const stats = {
    total:    cards.length,
    defaults: cards.filter(c => c.is_default).length,
    expired:  cards.filter(c => {
      const now = new Date();
      return c.exp_year < now.getFullYear() ||
        (c.exp_year === now.getFullYear() && c.exp_month < now.getMonth() + 1);
    }).length,
    linked: cards.filter(c => c.user_id).length,
  };

  if (!auth) return null;

  return (
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>

      {/* Top bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(7,8,13,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border)", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 3, background: "linear-gradient(135deg, var(--accent), var(--accentL))", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {Ic.card}
            </div>
            <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 800, color: "var(--white)", letterSpacing: "-0.01em" }}>KNGEGO</span>
          </div>
          <div style={{ width: 1, height: 20, background: "var(--border2)" }} />
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted2)", letterSpacing: "0.12em" }}>CREDIT CARD VAULT</span>
          <span className="tag" style={{ background: "rgba(255,184,48,0.08)", color: "var(--yellow)", border: "1px solid rgba(255,184,48,0.2)", fontSize: 9 }}>
            ⚠ PRACTICE ONLY
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "rgba(0,200,150,0.07)", border: "1px solid rgba(0,200,150,0.15)", borderRadius: 3 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", animation: "pulse 2s infinite" }} />
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--green)" }}>{auth.user?.email}</span>
          </div>
          <button onClick={handleLogout} className="btn btn-ghost" style={{ padding: "7px 14px", fontSize: 11 }}>
            {Ic.logout} Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "28px 24px 60px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28, animation: "fadeUp 0.4s ease" }}>
          {[
            { label: "Total Cards",    value: stats.total,    color: "var(--accentL)" },
            { label: "Default Cards",  value: stats.defaults, color: "var(--green)"   },
            { label: "Expired",        value: stats.expired,  color: "var(--red)"     },
            { label: "Linked to User", value: stats.linked,   color: "var(--yellow)"  },
          ].map(s => (
            <div key={s.label} style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 4, padding: "16px 20px" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 28, fontWeight: 500, color: s.color, letterSpacing: "-0.02em" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "var(--muted2)", marginTop: 4, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center", animation: "fadeUp 0.4s ease 0.05s both" }}>
          <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }}>{Ic.search}</span>
            <input className="input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search email, name, last 4..." style={{ paddingLeft: 36 }} />
          </div>

          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }}>{Ic.filter}</span>
            <input
              className="input"
              value={emailSearch}
              onChange={e => setESearch(e.target.value)}
              onKeyDown={e => e.key === "Enter" && fetchCards(auth, emailSearch)}
              placeholder="Filter by email (Enter)"
              style={{ paddingLeft: 36, width: 220 }}
            />
          </div>

          <select
            value={filterBrand}
            onChange={e => setFilter(e.target.value)}
            style={{ padding: "10px 14px", background: "var(--bg)", border: "1px solid var(--border2)", borderRadius: 3, color: filterBrand === "all" ? "var(--muted2)" : "var(--white)", fontFamily: "var(--sans)", fontSize: 12, fontWeight: 600, cursor: "pointer", letterSpacing: "0.04em", textTransform: "uppercase", outline: "none" }}
          >
            {brands.map(b => <option key={b} value={b}>{b === "all" ? "All Brands" : b}</option>)}
          </select>

          <select
            value={filterDefault}
            onChange={e => setFD(e.target.value)}
            style={{ padding: "10px 14px", background: "var(--bg)", border: "1px solid var(--border2)", borderRadius: 3, color: "var(--muted2)", fontFamily: "var(--sans)", fontSize: 12, fontWeight: 600, cursor: "pointer", letterSpacing: "0.04em", textTransform: "uppercase", outline: "none" }}
          >
            <option value="all">All Cards</option>
            <option value="yes">Default Only</option>
            <option value="no">Non-default</option>
          </select>

          <button onClick={() => fetchCards(auth, emailSearch)} className="btn btn-ghost" style={{ padding: "10px 16px", fontSize: 11 }}>
            {Ic.refresh} Refresh
          </button>

          <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", marginLeft: "auto" }}>
            {filtered.length} / {count} cards
          </span>
        </div>

        {/* Error */}
        {error && (
          <div style={{ marginBottom: 16, padding: "12px 16px", background: "rgba(255,68,85,0.08)", border: "1px solid rgba(255,68,85,0.2)", borderRadius: 3, fontSize: 13, color: "var(--red)", display: "flex", gap: 8 }}>
            {Ic.warning} {error}
          </div>
        )}

        {/* Table */}
        <div style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 4, overflow: "hidden", animation: "fadeUp 0.4s ease 0.1s both" }}>
          <div style={{ display: "grid", gridTemplateColumns: "32px 1fr 160px 120px 100px 90px 60px", gap: 12, padding: "11px 20px", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
            <div style={{ fontSize: 10, color: "var(--muted)", fontFamily: "var(--mono)" }}>#</div>
            <ColHeader field="email"      label="Owner / Holder" />
            <ColHeader field="digit"      label="Card Number" />
            <ColHeader field="brand"      label="Brand" />
            <ColHeader field="exp_year"   label="Expiry" />
            <ColHeader field="is_default" label="Default" />
            <div />
          </div>

          {loading ? (
            <div style={{ padding: "60px 20px", textAlign: "center" }}>
              <div style={{ width: 24, height: 24, border: "2px solid var(--border2)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 14px" }} />
              <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>Fetching cards from API...</div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🗂</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>No cards found.</div>
            </div>
          ) : (
            filtered.map((card, i) => <CardRow key={card.id} card={card} idx={i} />)
          )}
        </div>

        {/* Footer warning */}
        <div style={{ marginTop: 20, padding: "12px 16px", background: "rgba(255,184,48,0.04)", border: "1px solid rgba(255,184,48,0.12)", borderRadius: 3, display: "flex", alignItems: "flex-start", gap: 10, fontSize: 11, color: "var(--yellow)", lineHeight: 1.7 }}>
          <span style={{ flexShrink: 0 }}>{Ic.warning}</span>
          <span>
            <strong>Practice environment only.</strong> This page retrieves full card numbers and CVV codes — a severe PCI-DSS violation in production. In production: store only last 4 digits + a tokenized reference from your payment processor (Stripe, Braintree, etc.) and never expose CVV post-submit.
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CARD DETAIL PAGE — WITH API CALL
───────────────────────────────────────────────────────────── */
function CardDetailPage() {
  const { cardId } = useParams();
  const navigate   = useNavigate();
  const [auth, setAuth]     = useState(null);
  const [card, setCard]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    const savedAuth = sessionStorage.getItem("adminAuth");
    if (savedAuth) {
      setAuth(JSON.parse(savedAuth));
    } else {
      navigate("/admin/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!auth || !cardId) return;
    const fetchCard = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/tickets/admin/credit-cards/${cardId}/`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "X-Access-Code": auth.accessCode,
          },
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message || "Failed to fetch card.");
        setCard(json.data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCard();
  }, [auth, cardId]);

  if (!auth) return null;

  return (
    <div style={{ padding: "100px 24px", maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
      <button onClick={() => navigate("/admin/dashboard")} className="btn btn-ghost" style={{ marginBottom: 24 }}>
        ← Back to Dashboard
      </button>
      {loading && <div style={{ fontFamily: "var(--mono)", color: "var(--muted)" }}>Loading...</div>}
      {error   && <div style={{ fontFamily: "var(--mono)", color: "var(--red)" }}>Error: {error}</div>}
      {card    && (
        <pre style={{ background: "var(--panel)", border: "1px solid var(--border)", padding: 24, borderRadius: 4, overflow: "auto", fontFamily: "var(--mono)", fontSize: 12, color: "var(--white)", lineHeight: 1.6 }}>
          {JSON.stringify(card, null, 2)}
        </pre>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ROOT
───────────────────────────────────────────────────────────── */
export default function AdminCreditCards() {
  return (
    <>
      <style>{CSS}</style>
      <div className="grid-bg" />
      <div className="scanline-wrap"><div className="scanline" /></div>

      <Routes>
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
        <Route path="/login"         element={<LoginPanel />} />
        <Route path="/dashboard"     element={<Dashboard />} />
        <Route path="/cards/:cardId" element={<CardDetailPage />} />
      </Routes>
    </>
  );
}