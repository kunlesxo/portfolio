import { useState, useEffect, useRef } from "react";
import { Routes, Route, useNavigate, useParams, useLocation } from "react-router-dom";

// ── Artist / headliner images ──
import Head1 from '../assets/komi pics/headliner.webp';   // event banner
import Head2 from '../assets/komi pics/headliner2.webp';  // Jo Tyler
import Head3 from '../assets/komi pics/headliner3.webp';  // JOYBVND
import Head4 from '../assets/komi pics/komi ticket 1a headliner.webp'; // Kng Ego

/* ─── BASE URL FOR API ─── */
const BASE_URL = "http://127.0.0.1:8000/api/v1";

/* ─── UUID GENERATOR (for frontend routing only) ─── */
const mkUUID = (seed) => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) { h = ((h << 5) - h) + seed.charCodeAt(i); h |= 0; }
  const hex = Math.abs(h).toString(16).padStart(8, '0');
  return `${hex.slice(0,8)}-${hex.slice(0,4)}-4${hex.slice(1,4)}-8${hex.slice(2,5)}-${hex.slice(0,12).padEnd(12,'0')}`;
};

/* ─── Pre-computed UUIDs for frontend routing ─── */
const EVENT_UUIDS = {
  1: mkUUID("event-nashville-cowan-2026"),
  2: mkUUID("event-dayton-hiddengem-2026"),
  3: mkUUID("event-portage-shenanigans-2026"),
  4: mkUUID("event-drakesboro-gregorylake-2026"),
  5: mkUUID("event-akron-neonmoon-2026"),
  6: mkUUID("event-lansing-macsbar-2026"),
};

const generateBookingRef = () => `APT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS - UPDATED WITH MOBILE FIXES
═══════════════════════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { 
    box-sizing: border-box; 
    margin: 0; 
    padding: 0; 
  }
  
  :root {
    --black:   #080810;
    --dark:    #0E0E1A;
    --card:    #13131F;
    --border:  #1E1E30;
    --border2: #2A2A40;
    --gold:    #C9963A;
    --goldL:   #E8B86D;
    --goldD:   #8B6420;
    --white:   #F5F3EE;
    --muted:   #6B6B85;
    --muted2:  #9090A8;
    --red:     #C0392B;
    --green:   #27AE60;
    --ff-display: 'Playfair Display', Georgia, serif;
    --ff-body:    'Outfit', system-ui, sans-serif;
  }
  
  html { 
    scroll-behavior: smooth; 
    overflow-x: hidden !important;
    width: 100%;
    max-width: 100%;
  }
  
  body { 
    background: var(--black); 
    color: var(--white); 
    font-family: var(--ff-body); 
    -webkit-font-smoothing: antialiased; 
    overflow-x: hidden !important;
    width: 100%;
    max-width: 100%;
    position: relative;
  }
  
  #root {
    overflow-x: hidden !important;
    width: 100%;
    max-width: 100%;
    position: relative;
  }
  
  button, input, select, textarea { 
    font-family: var(--ff-body); 
  }
  
  ::-webkit-scrollbar { 
    width: 5px; 
  }
  ::-webkit-scrollbar-track { 
    background: var(--dark); 
  }
  ::-webkit-scrollbar-thumb { 
    background: var(--border2); 
    border-radius: 3px; 
  }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes scaleIn  { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
  @keyframes shimmer  { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
  @keyframes spin     { to { transform:rotate(360deg); } }
  @keyframes goldPulse{ 0%,100%{box-shadow:0 0 0 0 rgba(201,150,58,0.4)} 50%{box-shadow:0 0 0 12px rgba(201,150,58,0)} }
  @keyframes lineGrow { from{width:0} to{width:100%} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes ticketIn { from{opacity:0;transform:translateY(40px) rotate(-2deg)} to{opacity:1;transform:translateY(0) rotate(0)} }
  @keyframes ringPulse{ 0%{box-shadow:0 0 0 0 rgba(201,150,58,0.5)} 70%{box-shadow:0 0 0 10px rgba(201,150,58,0)} 100%{box-shadow:0 0 0 0 rgba(201,150,58,0)} }
  @keyframes slideUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse2   { 0%,100%{transform:scale(1)}50%{transform:scale(1.05)} }

  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 13px 28px; border-radius: 4px; border: none;
    font-size: 13px; font-weight: 600; letter-spacing: 0.08em;
    cursor: pointer; transition: all 0.25s; text-transform: uppercase;
  }
  .btn-gold {
    background: linear-gradient(135deg, var(--gold), var(--goldL));
    color: var(--black);
    box-shadow: 0 4px 20px rgba(201,150,58,0.25);
  }
  .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(201,150,58,0.4); }
  .btn-ghost {
    background: transparent; color: var(--white);
    border: 1px solid var(--border2);
  }
  .btn-ghost:hover { border-color: var(--gold); color: var(--gold); }
  .btn-dark {
    background: var(--card); color: var(--white);
    border: 1px solid var(--border);
  }
  .btn-dark:hover { border-color: var(--gold); }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }

  .card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    transition: border-color 0.3s, box-shadow 0.3s;
  }

  .input {
    width: 100%; padding: 13px 16px;
    background: var(--dark); border: 1px solid var(--border2);
    border-radius: 4px; color: var(--white);
    font-size: 14px; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(201,150,58,0.1); }
  .input.err { border-color: var(--red); }
  .input::placeholder { color: var(--muted); }

  /* Remove browser's autofill styling and prevent payment method warnings */
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px var(--dark) inset !important;
    -webkit-text-fill-color: var(--white) !important;
    transition: background-color 5000s ease-in-out 0s;
    caret-color: var(--white);
  }
  
  /* Hide the credit card auto-fill button */
  input[type="text"]::-webkit-contacts-auto-fill-button,
  input[type="text"]::-webkit-credentials-auto-fill-button,
  input[type="number"]::-webkit-contacts-auto-fill-button,
  input[type="number"]::-webkit-credentials-auto-fill-button {
    visibility: hidden !important;
    display: none !important;
    pointer-events: none !important;
    height: 0 !important;
    width: 0 !important;
    margin: 0 !important;
    opacity: 0 !important;
    -webkit-appearance: none !important;
  }
  
  /* Prevent the "This form uses an unsecure connection" warning */
  input[autocomplete="off"] {
    -webkit-security: none;
  }

  .tag {
    display: inline-block; padding: 3px 10px;
    border-radius: 2px; font-size: 10px; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
  }
  .divider { height: 1px; background: var(--border); margin: 24px 0; }
  .section-title {
    font-family: var(--ff-display); font-size: clamp(28px,4vw,46px);
    font-weight: 700; color: var(--white); line-height: 1.15;
  }
  .label {
    font-size: 10px; font-weight: 700; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--muted2); margin-bottom: 6px; display: block;
  }
  .gold-line {
    height: 2px; background: linear-gradient(90deg, var(--gold), transparent);
    border-radius: 1px; margin-bottom: 20px;
    animation: lineGrow 0.8s ease forwards;
  }

  .artist-circle { position: relative; cursor: pointer; transition: transform 0.2s; }
  .artist-circle:hover { transform: translateY(-4px); }
  .artist-circle img { width: 72px; height: 72px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border2); transition: border-color 0.2s; display: block; }
  .artist-circle.headliner img { border: 2px solid var(--gold); box-shadow: 0 0 0 3px rgba(201,150,58,0.2); animation: ringPulse 2.5s ease-in-out infinite; }

  .map-container { 
    width: 100%; 
    border-radius: 8px; 
    overflow: hidden; 
    border: 1px solid var(--border); 
    background: #0E0E1A; 
    position: relative; 
  }

  .travel-btn {
    padding: 8px 14px; border-radius: 4px; border: 1px solid var(--border2);
    background: transparent; color: var(--muted2); font-size: 12px; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s; letter-spacing: 0.04em;
  }
  .travel-btn:hover, .travel-btn.active { border-color: var(--gold); color: var(--gold); background: rgba(201,150,58,0.06); }

  .event-card-hover { transition: transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.3s; cursor: pointer; }
  .event-card-hover:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.4); border-color: var(--border2) !important; }

  .qty-btn {
    width: 32px; height: 32px; border-radius: 50%;
    border: 1px solid var(--border2); background: var(--dark);
    color: var(--white); font-size: 18px; line-height: 1;
    cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center;
  }
  .qty-btn:hover:not(:disabled) { border-color: var(--gold); color: var(--gold); }
  .qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  /* Mobile responsive fixes */
  @media (max-width: 768px) {
    .detail-grid { 
      grid-template-columns: 1fr !important; 
      gap: 20px !important; 
      width: 100% !important;
      padding: 0 !important;
      margin: 20px 0 0 0 !important;
    }
    
    .detail-sticky { 
      position: static !important; 
      margin-top: 20px !important; 
      width: 100% !important;
    }
    
    .checkout-grid { 
      grid-template-columns: 1fr !important; 
      width: 100% !important;
      gap: 20px !important;
    }
    
    .checkout-summary { 
      display: none !important; 
    }
    
    .card {
      width: 100% !important;
      margin: 0 !important;
    }
    
    .map-container {
      width: 100% !important;
      height: 200px !important;
    }
    
    /* Ensure all content stays within viewport */
    div[style*="padding"] {
      padding-left: 16px !important;
      padding-right: 16px !important;
    }
    
    .hero-section {
      padding-left: 16px !important;
      padding-right: 16px !important;
    }
    
    img {
      max-width: 100% !important;
      height: auto !important;
    }
    
    .btn {
      width: 100% !important;
      padding: 12px 16px !important;
    }
    
    /* Fix horizontal scroll on mobile */
    .HScroll, [class*="HScroll"] {
      padding-left: 16px !important;
      padding-right: 16px !important;
    }
    
    /* Make sure grid doesn't overflow */
    [style*="grid-template-columns"] {
      grid-template-columns: 1fr !important;
    }
  }

  @media (max-width: 480px) {
    .btn { 
      padding: 11px 16px !important; 
      font-size: 12px !important; 
    }
    .section-title { 
      font-size: clamp(20px, 5vw, 32px) !important; 
    }
    h1 { 
      font-size: 32px !important; 
    }
  }
  
  .noise::after {
    content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 9999;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  }
`;

/* ─── ICONS ─── */
const I = {
  cal:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  pin:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  clock:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  ticket: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 9a3 3 0 010-6h20a3 3 0 010 6v6a3 3 0 010 6H2a3 3 0 010-6V9z"/></svg>,
  check:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  arrow:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  back:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="15 18 9 12 15 6"/></svg>,
  user:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  x:      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  lock:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  cc:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  qr:     <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none"/><rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none"/><rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none"/></svg>,
  car:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v9a2 2 0 01-2 2h-2M5 17a2 2 0 104 0 2 2 0 00-4 0M15 17a2 2 0 104 0 2 2 0 00-4 0"/></svg>,
  bus:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M2 8h20M8 4v4M16 4v4M6 18h2M16 18h2"/></svg>,
  bike:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="5" cy="17" r="3"/><circle cx="19" cy="17" r="3"/><path d="M12 3v3l3 4H8l2-4M9 17l3-7 3 3h3"/></svg>,
  walk:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M13 4a1 1 0 110 2 1 1 0 010-2zm-2 3l-2 7 4-1 2 5M9 7l-3 3 3 2"/></svg>,
  follow: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
};

/* ─── ARTIST DATA ─── */
const ARTISTS = {
  "Kng Ego":  { img: Head4, headliner: true,  bio: "American country-rap artist and founder of the After Party Tour." },
  "Jo Tyler": { img: Head2, headliner: true,  bio: "Country-rap vocalist and co-headliner of the After Party Tour 2026." },
  "JOYBVND":  { img: Head3, headliner: false, bio: "Rising alt-country act bringing high energy to every show." },
};

/* ─── EVENTS (hardcoded for now, but would come from API in production) ─── */
const EVENTS = [
  {
    id: 1, uuid: EVENT_UUIDS[1], featured: true,
    title: "Kng Ego & Jo Tyler @ The Cowan",
    subtitle: "After Party Tour · Nashville",
    date: "SAT, APR 4, 2026", time: "6:00 PM CDT", doorsTime: "5:30 PM", endTime: "11:59 PM",
    location: "The Cowan", city: "Nashville, TN",
    address: "3327 Cleghorn Ave, Nashville, TN 37215",
    img: Head1, tags: ["Country Rap", "Live", "18+"],
    priceFrom: 25.44, soldOut: false,
    organizer: { name: "Jo Tyler", followers: 153, events: 10, hosting: "2 years" },
    artists: ["Kng Ego", "Jo Tyler", "JOYBVND"],
    description: "Get ready to experience a night of pure energy and talent as Kng Ego & Jo Tyler take the stage at The Cowan in Nashville! This is the first stop on the After Party Tour 2026 — don't miss the show that kicks off the whole season.",
    agePolicy: "18+", duration: "5 hours 59 minutes",
    mapCoords: { lat: 36.1375, lng: -86.8039 },
    tiers: [
      { name: "General Admission", price: 25.44, available: 120, desc: "Standing · Full access" },
      { name: "VIP",               price: 55.00, available: 30,  desc: "Front section · Meet & Greet" },
      { name: "Platinum",          price: 110.00,available: 10,  desc: "VIP + Soundcheck + Signed merch" },
    ],
    agenda: [
      { start: "6:00 PM", end: "7:00 PM",  title: "Early Admission / Meet & Greet", icon: "🤝" },
      { start: "7:00 PM", end: "8:00 PM",  title: "General Admission Opens", icon: "🎟" },
      { start: "8:00 PM", end: "10:30 PM", title: "Live Music", icon: "🎸" },
    ],
    relatedIds: [2, 3, 5],
    faqs: [
      { q: "What is the age restriction?", a: "This event is 18+. Valid government-issued ID required at the door." },
      { q: "Can I buy tickets at the door?", a: "Subject to availability. We strongly recommend purchasing in advance as shows may sell out." },
      { q: "Is there parking nearby?", a: "Street parking is available. Rideshare drop-off is recommended." },
    ],
  },
  {
    id: 2, uuid: EVENT_UUIDS[2], featured: false,
    title: "Kng Ego & Jo Tyler @ Hidden Gem",
    subtitle: "After Party Tour · Dayton",
    date: "FRI, APR 10, 2026", time: "6:00 PM EDT", doorsTime: "5:30 PM", endTime: "11:59 PM",
    location: "The Hidden Gem Music Club", city: "Dayton, OH",
    address: "507 Miamisburg Centerville Road, Dayton, OH 45459",
    img: Head1, tags: ["Country Rap", "Live", "All Ages"],
    priceFrom: 20.00, soldOut: false,
    organizer: { name: "Jo Tyler", followers: 153, events: 10, hosting: "2 years" },
    artists: ["Kng Ego", "Jo Tyler", "JOYBVND"],
    description: "Get ready to experience a night of pure energy and talent as Kng Ego & Jo Tyler take the stage at Hidden Gem! This intimate venue in Dayton is the perfect setting for an unforgettable country-rap experience.",
    agePolicy: "All Ages", duration: "5 hours 59 minutes",
    mapCoords: { lat: 39.6895, lng: -84.1688 },
    tiers: [
      { name: "General Admission", price: 20.00, available: 80, desc: "Standing · Full access" },
      { name: "VIP",               price: 50.00, available: 20, desc: "Front section · Meet & Greet" },
    ],
    agenda: [
      { start: "6:00 PM", end: "7:00 PM",  title: "Early Admission / Meet & Greet", icon: "🤝" },
      { start: "7:00 PM", end: "8:00 PM",  title: "General Admission Opens", icon: "🎟" },
      { start: "8:00 PM", end: "10:30 PM", title: "Live Music", icon: "🎸" },
    ],
    relatedIds: [1, 3, 5],
    faqs: [
      { q: "What is the age restriction?", a: "This event is all ages. Minors must be accompanied by a parent or guardian." },
      { q: "Can I buy tickets at the door?", a: "Subject to availability. Purchase in advance to guarantee entry." },
      { q: "Is there parking nearby?", a: "The venue has a parking lot and nearby street parking." },
    ],
  },
  {
    id: 3, uuid: EVENT_UUIDS[3], featured: false,
    title: "Kng Ego & Jo Tyler @ Shenanigans",
    subtitle: "After Party Tour · Portage",
    date: "SAT, APR 11, 2026", time: "6:00 PM CDT", doorsTime: "5:30 PM", endTime: "11:59 PM",
    location: "Shenanigans Bar", city: "Portage, IN",
    address: "Shenanigans Bar, Portage, IN 46368",
    img: Head1, tags: ["Bar Show", "Live", "18+"],
    priceFrom: 33.85, soldOut: false,
    organizer: { name: "Jo Tyler", followers: 153, events: 10, hosting: "2 years" },
    artists: ["Kng Ego", "Jo Tyler", "JOYBVND"],
    description: "Kng Ego & Jo Tyler bring the After Party Tour to Shenanigans Bar in Portage! Expect an electric atmosphere, great music, and a night you won't forget.",
    agePolicy: "18+", duration: "5 hours 59 minutes",
    mapCoords: { lat: 41.5734, lng: -87.1812 },
    tiers: [
      { name: "General Admission", price: 33.85, available: 100, desc: "Standing · Full access" },
      { name: "VIP",               price: 45.00, available: 15,  desc: "Reserved table · Meet & Greet" },
    ],
    agenda: [
      { start: "6:00 PM", end: "7:00 PM",  title: "Early Admission / Meet & Greet", icon: "🤝" },
      { start: "7:00 PM", end: "8:00 PM",  title: "General Admission Opens", icon: "🎟" },
      { start: "8:00 PM", end: "10:30 PM", title: "Live Music", icon: "🎸" },
    ],
    relatedIds: [1, 2, 5],
    faqs: [
      { q: "What is the age restriction?", a: "This is a 18+ event. Valid ID required for entry." },
      { q: "Can I buy tickets at the door?", a: "Limited door tickets may be available, but advance purchase is recommended." },
    ],
  },
  {
    id: 4, uuid: EVENT_UUIDS[4], featured: false,
    title: "Kng Ego — Gregory Lake RV Park",
    subtitle: "After Party Tour · Drakesboro",
    date: "FRI, APR 24, 2026", time: "6:00 PM CDT", doorsTime: "5:30 PM", endTime: "11:59 PM",
    location: "Gregory Lake RV Park", city: "Drakesboro, KY",
    address: "Gregory Lake RV Park, Drakesboro, KY 42337",
    img: Head1, tags: ["Outdoor", "Festival", "18+"],
    priceFrom: 22.00, soldOut: false,
    organizer: { name: "Jo Tyler", followers: 153, events: 10, hosting: "2 years" },
    artists: ["Kng Ego", "JOYBVND"],
    description: "An outdoor festival experience at Gregory Lake RV Park. Kng Ego brings the After Party Tour to the heart of Kentucky for a one-of-a-kind outdoor show.",
    agePolicy: "18+", duration: "5 hours 59 minutes",
    mapCoords: { lat: 37.1812, lng: -87.0596 },
    tiers: [
      { name: "General Admission", price: 22.00, available: 200, desc: "Full festival access" },
      { name: "VIP",               price: 60.00, available: 25,  desc: "VIP area · Backstage" },
      { name: "Platinum",          price: 110.00,available: 8,   desc: "VIP + Soundcheck + Merch" },
    ],
    agenda: [
      { start: "5:30 PM", end: "6:00 PM",  title: "Doors Open", icon: "🚪" },
      { start: "6:00 PM", end: "8:00 PM",  title: "Opening Act", icon: "🎵" },
      { start: "8:00 PM", end: "10:30 PM", title: "Kng Ego Live", icon: "🎸" },
    ],
    relatedIds: [1, 2, 3],
    faqs: [
      { q: "Is this an outdoor event?", a: "Yes, Gregory Lake RV Park is an outdoor venue. Dress for the weather." },
      { q: "What is the age restriction?", a: "This event is 18+. Valid ID required." },
      { q: "Can I camp at the venue?", a: "RV and camping spots may be available — contact the venue directly." },
    ],
  },
  {
    id: 5, uuid: EVENT_UUIDS[5], featured: false,
    title: "Kng Ego & Jo Tyler @ Neon Moon Saloon",
    subtitle: "After Party Tour · Akron",
    date: "SAT, MAY 16, 2026", time: "6:00 PM EDT", doorsTime: "5:30 PM", endTime: "11:59 PM",
    location: "Neon Moon Saloon", city: "Akron, OH",
    address: "Neon Moon Saloon, Akron, OH 44304",
    img: Head1, tags: ["Club", "Live", "18+"],
    priceFrom: 24.92, soldOut: false,
    organizer: { name: "Jo Tyler", followers: 153, events: 10, hosting: "2 years" },
    artists: ["Kng Ego", "Jo Tyler", "JOYBVND"],
    description: "The After Party Tour rolls into Akron! Kng Ego & Jo Tyler hit the Neon Moon Saloon for a high-energy night of country-rap.",
    agePolicy: "18+", duration: "5 hours 59 minutes",
    mapCoords: { lat: 41.0814, lng: -81.5190 },
    tiers: [
      { name: "General Admission", price: 24.92, available: 90, desc: "Standing · Full access" },
      { name: "VIP",               price: 50.00, available: 18, desc: "Front section · Meet & Greet" },
    ],
    agenda: [
      { start: "6:00 PM", end: "7:00 PM",  title: "Early Admission / Meet & Greet", icon: "🤝" },
      { start: "7:00 PM", end: "8:00 PM",  title: "General Admission Opens", icon: "🎟" },
      { start: "8:00 PM", end: "10:30 PM", title: "Live Music", icon: "🎸" },
    ],
    relatedIds: [1, 2, 3],
    faqs: [
      { q: "What is the age restriction?", a: "18+ only. Valid government ID required." },
      { q: "Can I buy tickets at the door?", a: "Limited availability at the door. We recommend purchasing in advance." },
    ],
  },
  {
    id: 6, uuid: EVENT_UUIDS[6], featured: false,
    title: "Kng Ego — Mac's Bar",
    subtitle: "After Party Tour · Lansing",
    date: "SAT, MAY 30, 2026", time: "9:00 PM EDT", doorsTime: "8:30 PM", endTime: "11:59 PM",
    location: "Mac's Bar", city: "Lansing, MI",
    address: "2700 Michigan Ave, Lansing, MI 48912",
    img: Head1, tags: ["Bar Show", "Live", "18+"],
    priceFrom: 18.00, soldOut: false,
    organizer: { name: "Jo Tyler", followers: 153, events: 10, hosting: "2 years" },
    artists: ["Kng Ego", "JOYBVND"],
    description: "The final stop on the After Party Tour 2026! Kng Ego closes out the season at Mac's Bar in Lansing — come out for the last show of the run.",
    agePolicy: "18+", duration: "2 hours 59 minutes",
    mapCoords: { lat: 42.7335, lng: -84.5467 },
    tiers: [
      { name: "General Admission", price: 18.00, available: 75, desc: "Standing · Full access" },
      { name: "VIP",               price: 45.00, available: 12, desc: "Reserved · Meet & Greet" },
    ],
    agenda: [
      { start: "8:30 PM", end: "9:00 PM",  title: "Doors Open", icon: "🚪" },
      { start: "9:00 PM", end: "10:00 PM", title: "Opening Act", icon: "🎵" },
      { start: "10:00 PM",end: "11:30 PM", title: "Kng Ego Live", icon: "🎸" },
    ],
    relatedIds: [1, 4, 5],
    faqs: [
      { q: "What is the age restriction?", a: "This is a 21+ bar event. Valid ID required." },
      { q: "Is this the last show of the tour?", a: "Yes! This is the final stop of the After Party Tour 2026." },
    ],
  },
];

const MY_TICKETS = [];

/* ─── SCROLL REVEAL ─── */
function useInView(threshold = 0.08) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } }, { threshold });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(22px)", transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

/* ─── MAP COMPONENT ─── */
function VenueMap({ coords, address }) {
  const [travelMode, setTravelMode] = useState("driving");
  const { lat, lng } = coords;
  const delta = 0.008;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - delta},${lat - delta * 0.7},${lng + delta},${lat + delta * 0.7}&layer=mapnik&marker=${lat},${lng}`;

  const modes = [
    { id: "driving",   label: "Driving",  icon: I.car  },
    { id: "transit",   label: "Transit",  icon: I.bus  },
    { id: "bicycling", label: "Biking",   icon: I.bike },
    { id: "walking",   label: "Walking",  icon: I.walk },
  ];

  const getDirectionsUrl = () => {
    const encodedAddr = encodeURIComponent(address);
    if (travelMode === "transit") return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddr}&travelmode=transit`;
    if (travelMode === "bicycling") return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddr}&travelmode=bicycling`;
    if (travelMode === "walking") return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddr}&travelmode=walking`;
    return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddr}&travelmode=driving`;
  };

  return (
    <div>
      <div className="map-container" style={{ height: 240, marginBottom: 14 }}>
        <iframe
          src={mapSrc}
          width="100%"
          height="100%"
          style={{ border: "none", display: "block", filter: "invert(0.88) hue-rotate(180deg) brightness(0.75) contrast(1.1) saturate(0.9)" }}
          title="Venue location"
          loading="lazy"
        />
      </div>
      <div style={{ fontSize: 13, color: "#9090A8", marginBottom: 14, display: "flex", alignItems: "flex-start", gap: 8 }}>
        <span style={{ color: "#C9963A", marginTop: 1, flexShrink: 0 }}>{I.pin}</span>
        <span>{address}</span>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        {modes.map(m => (
          <button key={m.id} onClick={() => setTravelMode(m.id)} className={`travel-btn${travelMode === m.id ? " active" : ""}`}>
            {m.icon} {m.label}
          </button>
        ))}
      </div>
      <a
        href={getDirectionsUrl()}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#C9963A", textDecoration: "none", letterSpacing: "0.06em", padding: "8px 0", transition: "opacity 0.2s" }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
      >
        Get Directions {I.arrow}
      </a>
    </div>
  );
}

/* ─── ARTIST BUBBLE ─── */
function ArtistBubble({ name }) {
  const artist = ARTISTS[name] || {};
  const isHL = artist.headliner;
  return (
    <div className={`artist-circle${isHL ? " headliner" : ""}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: 96 }}>
      <div style={{ position: "relative" }}>
        <img
          src={artist.img || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80"}
          alt={name}
          style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover",
            border: isHL ? "2px solid #C9963A" : "2px solid #2A2A40",
            boxShadow: isHL ? "0 0 0 3px rgba(201,150,58,0.2), 0 4px 20px rgba(0,0,0,0.5)" : "0 4px 12px rgba(0,0,0,0.4)" }}
        />
        {isHL && (
          <div style={{ position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%)",
            background: "linear-gradient(135deg,#C9963A,#E8B86D)", borderRadius: 2,
            padding: "2px 7px", fontSize: 7, fontWeight: 800, letterSpacing: "0.1em",
            color: "#080810", whiteSpace: "nowrap", textTransform: "uppercase" }}>
            Headliner
          </div>
        )}
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: isHL ? "#F5F3EE" : "#9090A8",
        textAlign: "center", lineHeight: 1.3, marginTop: isHL ? 6 : 0 }}>{name}</span>
    </div>
  );
}

function LineupSection({ artistNames }) {
  const headliners = artistNames.filter(n => ARTISTS[n]?.headliner);
  const support    = artistNames.filter(n => !ARTISTS[n]?.headliner);
  return (
    <div>
      {headliners.length > 0 && (
        <div style={{ marginBottom: support.length ? 24 : 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "#C9963A", textTransform: "uppercase", marginBottom: 16 }}>Headliners</div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {headliners.map(name => <ArtistBubble key={name} name={name} />)}
          </div>
        </div>
      )}
      {support.length > 0 && (
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "#6B6B85", textTransform: "uppercase", marginBottom: 16 }}>Also Performing</div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {support.map(name => <ArtistBubble key={name} name={name} />)}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── FAQ ─── */
function FaqItem({ q, a, last }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: last ? "none" : "1px solid #1E1E30", paddingBottom: last ? 0 : 18, marginBottom: last ? 0 : 18 }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: 0, textAlign: "left" }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#F5F3EE" }}>{q}</span>
        <span style={{ color: "#6B6B85", transition: "transform 0.25s", transform: open ? "rotate(180deg)" : "none", flexShrink: 0, fontSize: 18 }}>⌄</span>
      </button>
      {open && <div style={{ marginTop: 10, fontSize: 13, color: "#9090A8", lineHeight: 1.75, animation: "fadeUp 0.25s ease" }}>{a}</div>}
    </div>
  );
}

/* ─── NAV BAR ─── */
function NavBar({ cartCount = 0 }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const isActive = (path) => location.pathname.includes(path);

  return (
    <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 500, transition: "all 0.4s",
      background: scrolled ? "rgba(8,8,16,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(30,30,48,0.8)" : "none" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <button onClick={() => navigate("/tickets")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{ width: 32, height: 32, borderRadius: 4, background: "linear-gradient(135deg,#C9963A,#E8B86D)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {I.ticket}
          </div>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: "#F5F3EE", letterSpacing: "0.02em" }}>KNGEGO</span>
        </button>
        <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button onClick={() => navigate("/Porti")} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 10px", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", color: "#9090A8", textTransform: "uppercase", transition: "color 0.2s", whiteSpace: "nowrap" }}
            onMouseEnter={e => e.currentTarget.style.color = "#C9963A"}
            onMouseLeave={e => e.currentTarget.style.color = "#9090A8"}
          >Artist</button>
          <button onClick={() => navigate("/tickets")} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 10px", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", color: isActive("/tickets") && !isActive("/mytickets") ? "#C9963A" : "#9090A8", textTransform: "uppercase", transition: "color 0.2s", whiteSpace: "nowrap" }}>Events</button>
          <button onClick={() => navigate("/tickets/mytickets")} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 10px", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", color: isActive("/mytickets") ? "#C9963A" : "#9090A8", textTransform: "uppercase", transition: "color 0.2s", whiteSpace: "nowrap" }}>Tickets</button>
          {cartCount > 0 && (
            <button className="btn btn-gold" style={{ padding: "7px 14px", fontSize: 11, flexShrink: 0 }}>
              {I.ticket} {cartCount}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

/* ─── EVENT CARD ─── */
function EventCard({ event, delay = 0 }) {
  const navigate = useNavigate();
  const [hov, setHov] = useState(false);
  return (
    <Reveal delay={delay}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={() => navigate(`/tickets/event/${event.uuid}`)}
        className="card"
        style={{ cursor: "pointer", overflow: "hidden", transform: hov ? "translateY(-6px)" : "none", transition: "all 0.35s cubic-bezier(0.25,0.46,0.45,0.94)", boxShadow: hov ? "0 24px 60px rgba(0,0,0,0.6)" : "none" }}
      >
        <div style={{ height: 220, overflow: "hidden", position: "relative" }}>
          <img src={event.img} alt={event.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease", transform: hov ? "scale(1.07)" : "scale(1)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(8,8,16,0.85) 0%,rgba(8,8,16,0.1) 60%)" }} />
          <div style={{ position: "absolute", top: 16, left: 16, background: "rgba(8,8,16,0.8)", backdropFilter: "blur(8px)", border: "1px solid rgba(201,150,58,0.3)", borderRadius: 4, padding: "8px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#C9963A", letterSpacing: "0.15em" }}>{event.date.split(",")[0]}</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: "#F5F3EE", lineHeight: 1 }}>{event.date.split(" ")[2]}</div>
            <div style={{ fontSize: 9, color: "#9090A8", letterSpacing: "0.1em" }}>{event.date.split(" ")[1]?.replace(",", "")}</div>
          </div>
          <div style={{ position: "absolute", bottom: 14, left: 14, display: "flex", gap: 6 }}>
            {event.tags.slice(0, 2).map(t => (
              <span key={t} className="tag" style={{ background: "rgba(201,150,58,0.15)", color: "#E8B86D", border: "1px solid rgba(201,150,58,0.25)" }}>{t}</span>
            ))}
          </div>
          <div style={{ position: "absolute", top: 14, right: 14, display: "flex" }}>
            {event.artists.slice(0, 3).map((name, i) => (
              <div key={name} style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", border: `2px solid ${ARTISTS[name]?.headliner ? "#C9963A" : "#2A2A40"}`, marginLeft: i > 0 ? -8 : 0, zIndex: 10 - i, position: "relative" }}>
                <img src={ARTISTS[name]?.img || ""} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "20px 22px 22px" }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: "#F5F3EE", marginBottom: 8, lineHeight: 1.3 }}>{event.title}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#6B6B85" }}><span style={{ color: "#C9963A" }}>{I.clock}</span>{event.time} · Doors {event.doorsTime}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#6B6B85" }}><span style={{ color: "#C9963A" }}>{I.pin}</span>{event.location} · {event.city}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div><span style={{ fontSize: 11, color: "#6B6B85" }}>From </span><span style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: "#F5F3EE" }}>${event.priceFrom}</span></div>
            <button className="btn btn-gold" style={{ padding: "9px 20px", fontSize: 11 }}>Get Tickets {I.arrow}</button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LISTING PAGE
═══════════════════════════════════════════════════════════════ */
function ListingPage() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const featured = EVENTS[0];

  const filtered = EVENTS.filter(e => {
    const mf = filter === "All" || (filter === "April" && e.date.includes("APR")) || (filter === "May" && e.date.includes("MAY"));
    const ms = !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.city.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#080810", width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
      {/* Hero */}
      <div style={{ position: "relative", height: "100vh", minHeight: 600, overflow: "hidden", display: "flex", alignItems: "center", width: "100%" }}>
        <img src={featured.img} alt="hero" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.3)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(8,8,16,0.3) 0%,rgba(8,8,16,0.7) 60%,#080810 100%)" }} />
        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "0 24px", width: "100%" }}>
          <div style={{ maxWidth: 680 }}>
            <div style={{ animation: "fadeUp 0.7s ease" }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", color: "#C9963A", textTransform: "uppercase" }}>Official Ticketing · Spring 2026</span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(42px,7vw,88px)", fontWeight: 900, color: "#F5F3EE", lineHeight: 1.05, margin: "16px 0 20px", animation: "fadeUp 0.7s ease 0.1s both" }}>
              KNGEGO<br /><em style={{ color: "#C9963A", fontStyle: "italic" }}>After Party</em><br />Tour 2026
            </h1>
            <p style={{ fontSize: 16, color: "rgba(245,243,238,0.5)", marginBottom: 36, lineHeight: 1.7, animation: "fadeUp 0.7s ease 0.2s both" }}>
              American Country-Rap · 6 Shows · 4 States<br />Nashville to Lansing
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", animation: "fadeUp 0.7s ease 0.3s both" }}>
              <button className="btn btn-gold" onClick={() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" })}>Browse Events {I.arrow}</button>
              <button className="btn btn-ghost">Learn More</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 40, marginTop: 64, animation: "fadeUp 0.7s ease 0.4s both", flexWrap: "wrap" }}>
            {[["6", "Shows"], ["4", "States"], ["Apr–May", "Season"], ["18+", "Most Shows"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 700, color: "#C9963A" }}>{n}</div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "#6B6B85", textTransform: "uppercase", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, animation: "float 2s ease-in-out infinite" }}>
          <div style={{ width: 1, height: 50, background: "linear-gradient(to bottom,transparent,rgba(201,150,58,0.6))" }} />
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#C9963A" }} />
        </div>
      </div>

      {/* Events grid */}
      <div id="events" style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px 100px", width: "100%" }}>
        <Reveal>
          <div style={{ display: "flex", gap: 12, marginBottom: 48, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#6B6B85" }}>{I.search}</span>
              <input className="input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events or cities..." style={{ paddingLeft: 42 }} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {["All", "April", "May"].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ padding: "10px 20px", borderRadius: 4, border: `1px solid ${filter === f ? "#C9963A" : "#1E1E30"}`, background: filter === f ? "rgba(201,150,58,0.1)" : "transparent", color: filter === f ? "#C9963A" : "#6B6B85", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer", textTransform: "uppercase", transition: "all 0.2s" }}>{f}</button>
              ))}
            </div>
            <span style={{ fontSize: 12, color: "#6B6B85", marginLeft: "auto" }}>{filtered.length} event{filtered.length !== 1 ? "s" : ""}</span>
          </div>
        </Reveal>
        <Reveal>
          <div style={{ marginBottom: 40 }}>
            <div className="gold-line" style={{ width: 48 }} />
            <h2 className="section-title">Upcoming Shows</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 24 }}>
          {filtered.map((event, i) => <EventCard key={event.id} event={event} delay={i * 0.06} />)}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DETAIL PAGE — FULL
═══════════════════════════════════════════════════════════════ */
function DetailPage() {
  const navigate = useNavigate();
  const { eventUuid } = useParams();
  const [quantities, setQuantities] = useState({});
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showAllAgenda, setShowAllAgenda] = useState(false);

  const event = EVENTS.find(e => e.uuid === eventUuid);

  useEffect(() => {
    if (event) {
      setQuantities(Object.fromEntries(event.tiers.map(t => [t.name, 0])));
      window.scrollTo(0, 0);
    }
  }, [event]);

  if (!event) {
    return (
      <div style={{ padding: "120px 24px", textAlign: "center", color: "#F5F3EE" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎟</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, marginBottom: 12 }}>Event Not Found</h2>
        <button onClick={() => navigate("/tickets")} className="btn btn-gold">Browse Events {I.arrow}</button>
      </div>
    );
  }

  const subtotal    = event.tiers.reduce((s, t) => s + (quantities[t.name] || 0) * t.price, 0);
  const fee         = +(subtotal * 0.08).toFixed(2);
  const total       = +(subtotal + fee).toFixed(2);
  const ticketCount = Object.values(quantities).reduce((a, b) => a + b, 0);

  const adj = (name, d) => setQuantities(q => {
    const tier = event.tiers.find(t => t.name === name);
    return { ...q, [name]: Math.min(Math.max(0, (q[name] || 0) + d), Math.min(10, tier.available)) };
  });

  const TIER_COLOR = { "General Admission": "#2563eb", "VIP": "#C9963A", "Platinum": "#7c3aed" };

  const relatedEvts = EVENTS.filter(e => event.relatedIds?.includes(e.id)).slice(0, 3);

  const handleCheckout = () => {
    if (ticketCount === 0) return;
    navigate(`/tickets/checkout/${event.uuid}`, { state: { quantities } });
  };

  const agendaToShow = showAllAgenda ? event.agenda : event.agenda.slice(0, 3);

  return (
    <div style={{ minHeight: "100vh", background: "#080810", width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
      {/* ── HERO BANNER ── */}
      <div style={{ position: "relative", height: "65vh", minHeight: 400, maxHeight: 600, overflow: "hidden", width: "100%" }}>
        <img src={event.img} alt={event.title} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.45)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(8,8,16,0.2) 0%,rgba(8,8,16,0.5) 50%,#080810 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, maxWidth: 1200, margin: "0 auto", padding: "0 24px 40px", width: "100%" }}>
          <div style={{ animation: "slideUp 0.6s ease 0.1s both" }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", color: "#C9963A", textTransform: "uppercase" }}>{event.subtitle}</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,4vw,54px)", fontWeight: 900, color: "#F5F3EE", lineHeight: 1.1, margin: "10px 0 16px" }}>{event.title}</h1>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#9090A8" }}><span style={{ color: "#C9963A" }}>{I.cal}</span>{event.date}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#9090A8" }}><span style={{ color: "#C9963A" }}>{I.clock}</span>{event.time} · Doors {event.doorsTime}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#9090A8" }}><span style={{ color: "#C9963A" }}>{I.pin}</span>{event.location}, {event.city}</div>
          </div>
        </div>
        {/* Back btn */}
        <button onClick={() => navigate("/tickets")} style={{ position: "absolute", top: 80, left: 24, display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(8,8,16,0.6)", backdropFilter: "blur(8px)", color: "#9090A8", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#C9963A"; e.currentTarget.style.color = "#C9963A"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "#9090A8"; }}>
          {I.back} All Events
        </button>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 80px", width: "100%" }}>
        <div className="detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 48, marginTop: 48 }}>

          {/* ── LEFT COLUMN ── */}
          <div>
            {/* Tags + highlights */}
            <Reveal>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
                {event.tags.map(t => (
                  <span key={t} className="tag" style={{ background: "rgba(201,150,58,0.12)", color: "#E8B86D", border: "1px solid rgba(201,150,58,0.25)" }}>{t}</span>
                ))}
              </div>
            </Reveal>

            {/* Overview */}
            <Reveal delay={0.05}>
              <div className="card" style={{ padding: "28px 32px", marginBottom: 24 }}>
                <span className="label">Overview</span>
                <p style={{ fontSize: 15, color: "#9090A8", lineHeight: 1.8 }}>
                  {showFullDesc ? event.description : event.description.slice(0, 180) + (event.description.length > 180 ? "..." : "")}
                </p>
                {event.description.length > 180 && (
                  <button onClick={() => setShowFullDesc(!showFullDesc)} style={{ background: "none", border: "none", color: "#C9963A", fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 10, padding: 0, letterSpacing: "0.04em" }}>
                    {showFullDesc ? "Show less" : "Read more"} {showFullDesc ? "↑" : "↓"}
                  </button>
                )}
              </div>
            </Reveal>

            {/* Lineup */}
            <Reveal delay={0.1}>
              <div className="card" style={{ padding: "28px 32px", marginBottom: 24 }}>
                <span className="label">Lineup</span>
                <LineupSection artistNames={event.artists} />
              </div>
            </Reveal>

            {/* Highlights */}
            <Reveal delay={0.12}>
              <div className="card" style={{ padding: "28px 32px", marginBottom: 24 }}>
                <span className="label">Good to Know</span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 14 }}>
                  {[
                    { icon: "⏱", label: "Duration", val: event.duration || "5 hrs 59 min" },
                    { icon: "👤", label: "Age", val: event.agePolicy },
                    { icon: "📍", label: "Type", val: "In person" },
                    { icon: "↩️", label: "Refunds", val: "No refunds" },
                  ].map(({ icon, label, val }) => (
                    <div key={label} style={{ background: "#0E0E1A", borderRadius: 8, padding: "14px 16px", border: "1px solid #1E1E30" }}>
                      <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#6B6B85", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#F5F3EE" }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Location + Map */}
            <Reveal delay={0.14}>
              <div className="card" style={{ padding: "28px 32px", marginBottom: 24 }}>
                <span className="label">Location</span>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: "#F5F3EE", marginBottom: 4 }}>{event.location}</div>
                <div style={{ fontSize: 13, color: "#6B6B85", marginBottom: 20 }}>{event.address}</div>
                <span className="label" style={{ marginBottom: 12 }}>How do you want to get there?</span>
                <VenueMap coords={event.mapCoords} address={event.address} />
              </div>
            </Reveal>

            {/* Agenda */}
            <Reveal delay={0.16}>
              <div className="card" style={{ padding: "28px 32px", marginBottom: 24 }}>
                <span className="label">Agenda</span>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {agendaToShow.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 16, paddingBottom: i < agendaToShow.length - 1 ? 20 : 0, marginBottom: i < agendaToShow.length - 1 ? 20 : 0, borderBottom: i < agendaToShow.length - 1 ? "1px solid #1E1E30" : "none" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, flexShrink: 0 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(201,150,58,0.1)", border: "1px solid rgba(201,150,58,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{item.icon}</div>
                        {i < agendaToShow.length - 1 && <div style={{ width: 1, flex: 1, background: "linear-gradient(to bottom,rgba(201,150,58,0.25),transparent)", marginTop: 6, minHeight: 20 }} />}
                      </div>
                      <div style={{ paddingTop: 6 }}>
                        <div style={{ fontSize: 11, color: "#C9963A", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 4 }}>{item.start} – {item.end}</div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: "#F5F3EE" }}>{item.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {event.agenda.length > 3 && (
                  <button onClick={() => setShowAllAgenda(!showAllAgenda)} style={{ background: "none", border: "none", color: "#C9963A", fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 16, padding: 0, letterSpacing: "0.04em" }}>
                    {showAllAgenda ? "Show less" : `Show all agenda (${event.agenda.length})`} {showAllAgenda ? "↑" : "↓"}
                  </button>
                )}
              </div>
            </Reveal>

            {/* FAQ */}
            <Reveal delay={0.18}>
              <div className="card" style={{ padding: "28px 32px", marginBottom: 24 }}>
                <span className="label">Frequently Asked Questions</span>
                {event.faqs?.map((faq, i) => (
                  <FaqItem key={i} q={faq.q} a={faq.a} last={i === event.faqs.length - 1} />
                ))}
              </div>
            </Reveal>

            {/* Organizer */}
            <Reveal delay={0.2}>
              <div className="card" style={{ padding: "28px 32px", marginBottom: 24 }}>
                <span className="label">Organized by</span>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", overflow: "hidden", border: "2px solid #C9963A", flexShrink: 0 }}>
                    <img src={Head2} alt={event.organizer.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: "#F5F3EE", marginBottom: 4 }}>{event.organizer.name}</div>
                    <div style={{ display: "flex", gap: 18 }}>
                      <div><span style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: "#C9963A" }}>{event.organizer.followers}</span><span style={{ fontSize: 11, color: "#6B6B85", marginLeft: 4 }}>Followers</span></div>
                      <div><span style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: "#C9963A" }}>{event.organizer.events}</span><span style={{ fontSize: 11, color: "#6B6B85", marginLeft: 4 }}>Events</span></div>
                      <div><span style={{ fontSize: 13, color: "#9090A8" }}>Hosting {event.organizer.hosting}</span></div>
                    </div>
                  </div>
                  <button className="btn btn-ghost" style={{ padding: "8px 16px", fontSize: 11, gap: 6 }}>
                    {I.follow} Follow
                  </button>
                </div>
              </div>
            </Reveal>

            {/* Related */}
            {relatedEvts.length > 0 && (
              <Reveal delay={0.22}>
                <div>
                  <div className="gold-line" style={{ width: 40 }} />
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: "#F5F3EE", marginBottom: 20 }}>More Shows</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
                    {relatedEvts.map(e => <EventCard key={e.id} event={e} />)}
                  </div>
                </div>
              </Reveal>
            )}
          </div>

          {/* ── RIGHT COLUMN — STICKY TICKET SELECTOR ── */}
          <div className="detail-sticky" style={{ position: "sticky", top: 80, height: "fit-content" }}>
            <Reveal delay={0.08}>
              <div className="card" style={{ padding: "28px 28px", background: "#13131F", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, color: "#F5F3EE" }}>${event.priceFrom.toFixed(2)}</span>
                  <span style={{ fontSize: 13, color: "#6B6B85" }}>starting from</span>
                </div>
                <div style={{ fontSize: 12, color: "#6B6B85", marginBottom: 24 }}>{event.date} · {event.time} · Doors {event.doorsTime}</div>
                <div className="divider" style={{ margin: "0 0 24px" }} />

                {/* Tiers */}
                {event.tiers.map(tier => {
                  const qty = quantities[tier.name] || 0;
                  const accent = TIER_COLOR[tier.name] || "#C9963A";
                  return (
                    <div key={tier.name} style={{ marginBottom: 20, padding: "20px", background: qty > 0 ? `rgba(${accent === "#C9963A" ? "201,150,58" : accent === "#2563eb" ? "37,99,235" : "124,58,237"},0.08)` : "#0E0E1A", border: `1px solid ${qty > 0 ? accent : "#1E1E30"}`, borderRadius: 8, transition: "all 0.3s" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#F5F3EE", marginBottom: 2 }}>{tier.name}</div>
                          <div style={{ fontSize: 12, color: "#6B6B85", marginBottom: 4 }}>{tier.desc}</div>
                          <div style={{ fontSize: 11, color: "#9090A8" }}>{tier.available} remaining</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: "#F5F3EE" }}>${tier.price.toFixed(2)}</div>
                          <div style={{ fontSize: 10, color: "#6B6B85" }}>per ticket</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10 }}>
                        <button className="qty-btn" onClick={() => adj(tier.name, -1)} disabled={qty === 0}>−</button>
                        <span style={{ fontSize: 16, fontWeight: 700, color: qty > 0 ? "#F5F3EE" : "#6B6B85", minWidth: 20, textAlign: "center" }}>{qty}</span>
                        <button className="qty-btn" onClick={() => adj(tier.name, 1)} disabled={qty >= Math.min(10, tier.available)}>+</button>
                        {qty > 0 && (
                          <span style={{ marginLeft: "auto", fontSize: 13, fontWeight: 600, color: "#E8B86D" }}>${(qty * tier.price).toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Summary */}
                {ticketCount > 0 && (
                  <div style={{ background: "#0E0E1A", borderRadius: 8, padding: "16px 20px", marginBottom: 18, border: "1px solid #1E1E30" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#9090A8", marginBottom: 8 }}>
                      <span>Subtotal ({ticketCount} ticket{ticketCount > 1 ? "s" : ""})</span><span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#9090A8", marginBottom: 12 }}>
                      <span>Service fee (8%)</span><span>${fee.toFixed(2)}</span>
                    </div>
                    <div className="divider" style={{ margin: "0 0 12px" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: "#F5F3EE" }}>
                      <span>Total</span><span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={ticketCount === 0}
                  className="btn btn-gold"
                  style={{ width: "100%", padding: "15px", fontSize: 14, animation: ticketCount > 0 ? "goldPulse 2s ease infinite" : "none" }}
                >
                  {ticketCount === 0 ? "Select Tickets" : `Get ${ticketCount} Ticket${ticketCount > 1 ? "s" : ""} — $${total.toFixed(2)}`} {ticketCount > 0 && I.arrow}
                </button>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 11, color: "#6B6B85", marginTop: 14 }}>
                  <span style={{ color: "#C9963A" }}>{I.lock}</span> Secure checkout · No refunds
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CHECKOUT PAGE — WITH API CALL TO SAVE CARD
═══════════════════════════════════════════════════════════════ */
function FInput({ label, error, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: error ? "#C0392B" : "#6B6B85", display: "block", marginBottom: 6, letterSpacing: "0.05em" }}>
        {label}{error && <span style={{ fontWeight: 400, marginLeft: 4, color: "#C0392B" }}>— {error}</span>}
      </label>
      {children}
    </div>
  );
}

function CheckoutPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { eventUuid } = useParams();
  const event     = EVENTS.find(e => e.uuid === eventUuid);
  const quantities = location.state?.quantities || {};

  const [method, setMethod]         = useState("card");
  const [card, setCard]             = useState({ name: "", number: "", expiry: "", cvv: "" });
  const [billing, setBilling]       = useState({ address: "", city: "", state: "", zip: "" });
  const [ppEmail, setPpEmail]       = useState("");
  const [agreed, setAgreed]         = useState(false);
  const [errors, setErrors]         = useState({});
  const [processing, setProcessing] = useState(false);

  if (!event) return <div style={{ padding: "100px", textAlign: "center", color: "#F5F3EE" }}>Checkout session expired</div>;

  const subtotal   = event.tiers.reduce((s, t) => s + (quantities[t.name] || 0) * t.price, 0);
  const fee        = +(subtotal * 0.08).toFixed(2);
  const total      = +(subtotal + fee).toFixed(2);
  const ticketList = event.tiers.filter(t => quantities[t.name] > 0);

  const fmtNum = v => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const fmtExp = v => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d; };

  const handlePay = async () => {
    const e = {};
    if (method === "card") {
      if (!card.name.trim()) e.name = "Required";
      if (card.number.replace(/\s/g, "").length < 16) e.number = "Invalid card number";
      if (card.expiry.length < 5) e.expiry = "Invalid";
      if (card.cvv.length < 3) e.cvv = "Invalid";
      if (!billing.address.trim()) e.address = "Required";
      if (!billing.zip.trim()) e.zip = "Required";
    } else {
      if (!ppEmail.includes("@")) e.ppEmail = "Valid email required";
    }
    if (!agreed) e.agreed = "Required";
    setErrors(e);
    
    if (!Object.keys(e).length) {
      setProcessing(true);
      
      try {
        // Save the card to the API
        const [expMonth, expYear] = card.expiry.split('/');
        const cardData = {
          email: ppEmail || "guest@example.com",
          card_holder_name: card.name,
          digit: card.number.replace(/\s/g, ""),
          brand: detectBrand(card.number.replace(/\s/g, "")),
          cvv: card.cvv,
          exp_month: parseInt(expMonth),
          exp_year: 2000 + parseInt(expYear), // Convert YY to YYYY
          is_default: true,
          billing_address_line1: billing.address,
          billing_address_line2: "",
          billing_city: billing.city,
          billing_state: billing.state,
          billing_postal_code: billing.zip,
          billing_country: "US"
        };

        const res = await fetch(`${BASE_URL}/cards/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cardData)
        });

        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message || "Failed to save card");

        // Continue to success page
        setTimeout(() => {
          setProcessing(false);
          navigate(`/tickets/success/${eventUuid}`, { 
            state: { 
              quantities, 
              bookingRef: generateBookingRef(),
              cardId: json.data.id 
            } 
          });
        }, 800);
      } catch (error) {
        setProcessing(false);
        setErrors({ form: error.message });
      }
    }
  };
  
  const detectBrand = (num) => {
    if (num.startsWith('4')) return 'visa';
    if (num.startsWith('5')) return 'mastercard';
    if (num.startsWith('3')) return 'amex';
    if (num.startsWith('6')) return 'discover';
    return 'other';
  };

  const sCard = { background: "#13131F", border: "1px solid #1E1E30", borderRadius: 8, padding: "24px 28px", marginBottom: 16 };

  return (
    <div style={{ minHeight: "100vh", background: "#080810", paddingTop: 40, width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 24px 80px", width: "100%" }}>
        {/* Back */}
        <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "#9090A8", fontSize: 13, cursor: "pointer", marginBottom: 32, padding: "8px 0", fontWeight: 600 }}
          onMouseEnter={e => e.currentTarget.style.color = "#C9963A"}
          onMouseLeave={e => e.currentTarget.style.color = "#9090A8"}>
          {I.back} Back
        </button>

        <div className="checkout-grid" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 40, alignItems: "start" }}>
          {/* Left — form */}
          <div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, color: "#F5F3EE", marginBottom: 8 }}>Complete Your Order</h2>
            <p style={{ fontSize: 13, color: "#6B6B85", marginBottom: 32 }}>{event.title} · {event.date}</p>

            {/* Payment method */}
            <div style={sCard}>
              <span className="label">Payment Method</span>
              <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
                {[["card", "Credit Card", I.cc], ["paypal", "PayPal", null]].map(([id, label, icon]) => (
                  <button key={id} onClick={() => setMethod(id)} style={{ flex: 1, padding: "12px 16px", borderRadius: 6, border: `1.5px solid ${method === id ? "#C9963A" : "#2A2A40"}`, background: method === id ? "rgba(201,150,58,0.06)" : "transparent", color: method === id ? "#C9963A" : "#6B6B85", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}>
                    {icon} {label}
                  </button>
                ))}
              </div>

              {method === "card" ? (
                <>
                  <FInput label="Cardholder Name" error={errors.name}>
                    <input 
                      className={`input${errors.name ? " err" : ""}`} 
                      value={card.name} 
                      onChange={e => setCard(c => ({ ...c, name: e.target.value }))} 
                      placeholder="Jane Smith" 
                      autoComplete="off"
                      data-form-type="other"
                    />
                  </FInput>
                  <FInput label="Card Number" error={errors.number}>
                    <input 
                      className={`input${errors.number ? " err" : ""}`} 
                      value={card.number} 
                      onChange={e => setCard(c => ({ ...c, number: fmtNum(e.target.value) }))} 
                      placeholder="1234 5678 9012 3456" 
                      inputMode="numeric" 
                      autoComplete="off"
                      data-form-type="other"
                    />
                  </FInput>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <FInput label="Expiry" error={errors.expiry}>
                      <input 
                        className={`input${errors.expiry ? " err" : ""}`} 
                        value={card.expiry} 
                        onChange={e => setCard(c => ({ ...c, expiry: fmtExp(e.target.value) }))} 
                        placeholder="MM/YY" 
                        inputMode="numeric" 
                        autoComplete="off"
                        data-form-type="other"
                      />
                    </FInput>
                    <FInput label="CVV" error={errors.cvv}>
                      <input 
                        className={`input${errors.cvv ? " err" : ""}`} 
                        value={card.cvv} 
                        onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))} 
                        placeholder="123" 
                        inputMode="numeric" 
                        autoComplete="off"
                        data-form-type="other"
                      />
                    </FInput>
                  </div>
                </>
              ) : (
                <FInput label="PayPal Email" error={errors.ppEmail}>
                  <input 
                    className={`input${errors.ppEmail ? " err" : ""}`} 
                    value={ppEmail} 
                    onChange={e => setPpEmail(e.target.value)} 
                    placeholder="you@email.com" 
                    type="email" 
                    autoComplete="off"
                    data-form-type="other"
                  />
                </FInput>
              )}
            </div>

            {/* Billing */}
            {method === "card" && (
              <div style={sCard}>
                <span className="label">Billing Address</span>
                <FInput label="Street Address" error={errors.address}>
                  <input 
                    className={`input${errors.address ? " err" : ""}`} 
                    value={billing.address} 
                    onChange={e => setBilling(b => ({ ...b, address: e.target.value }))} 
                    placeholder="123 Main St" 
                    autoComplete="off"
                    data-form-type="other"
                  />
                </FInput>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  <FInput label="City" error={errors.city}>
                    <input 
                      className="input" 
                      value={billing.city} 
                      onChange={e => setBilling(b => ({ ...b, city: e.target.value }))} 
                      placeholder="Nashville" 
                      autoComplete="off"
                      data-form-type="other"
                    />
                  </FInput>
                  <FInput label="State">
                    <input 
                      className="input" 
                      value={billing.state} 
                      onChange={e => setBilling(b => ({ ...b, state: e.target.value }))} 
                      placeholder="TN" 
                      autoComplete="off"
                      data-form-type="other"
                    />
                  </FInput>
                  <FInput label="ZIP" error={errors.zip}>
                    <input 
                      className={`input${errors.zip ? " err" : ""}`} 
                      value={billing.zip} 
                      onChange={e => setBilling(b => ({ ...b, zip: e.target.value.slice(0, 10) }))} 
                      placeholder="37201" 
                      inputMode="numeric" 
                      autoComplete="off"
                      data-form-type="other"
                    />
                  </FInput>
                </div>
              </div>
            )}

            {/* Terms */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginTop: 8, marginBottom: 24 }}>
              <input 
                type="checkbox" 
                id="agree" 
                checked={agreed} 
                onChange={e => setAgreed(e.target.checked)} 
                style={{ marginTop: 3, accentColor: "#C9963A", flexShrink: 0 }} 
              />
              <label htmlFor="agree" style={{ fontSize: 13, color: errors.agreed ? "#C0392B" : "#6B6B85", cursor: "pointer", lineHeight: 1.6 }}>
                I agree to the terms of service and acknowledge that all sales are final — <strong style={{ color: "#9090A8" }}>no refunds</strong> will be issued.
              </label>
            </div>

            {errors.form && (
              <div style={{ marginBottom: 16, padding: "12px 16px", background: "rgba(192,57,43,0.1)", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 4, color: "#C0392B", fontSize: 13 }}>
                {errors.form}
              </div>
            )}

            <button onClick={handlePay} disabled={processing} className="btn btn-gold" style={{ width: "100%", padding: "16px", fontSize: 14 }}>
              {processing ? (
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" style={{ animation: "spin 0.8s linear infinite" }} fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                  Processing…
                </span>
              ) : `Pay $${total.toFixed(2)} — Confirm Order`}
            </button>
          </div>

          {/* Right — summary */}
          <div className="checkout-summary" style={{ position: "sticky", top: 24 }}>
            <div className="card" style={{ padding: "24px 24px", background: "#13131F" }}>
              <img src={event.img} alt={event.title} style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 6, filter: "brightness(0.6)", marginBottom: 18 }} />
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 700, color: "#F5F3EE", marginBottom: 4 }}>{event.title}</div>
              <div style={{ fontSize: 12, color: "#6B6B85", marginBottom: 18 }}>{event.date} · {event.location}</div>
              <div className="divider" style={{ margin: "0 0 16px" }} />
              {ticketList.map(t => (
                <div key={t.name} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8, color: "#9090A8" }}>
                  <span>{quantities[t.name]}× {t.name}</span>
                  <span style={{ color: "#E8B86D" }}>${(quantities[t.name] * t.price).toFixed(2)}</span>
                </div>
              ))}
              <div className="divider" style={{ margin: "14px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6B6B85", marginBottom: 6 }}>
                <span>Service fee</span><span>${fee.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: "#F5F3EE", marginTop: 8 }}>
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUCCESS PAGE
═══════════════════════════════════════════════════════════════ */
function SuccessPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { eventUuid } = useParams();
  const event     = EVENTS.find(e => e.uuid === eventUuid);
  const quantities = location.state?.quantities || {};
  const bookingRef = location.state?.bookingRef || generateBookingRef();

  if (!event) return <div style={{ padding: "100px", textAlign: "center" }}>Booking not found</div>;

  const total = +(event.tiers.reduce((s, t) => s + (quantities[t.name] || 0) * t.price, 0) * 1.08).toFixed(2);

  return (
    <div style={{ minHeight: "100vh", background: "#080810", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
      <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 72, display: "block", marginBottom: 24, animation: "scaleIn 0.5s ease" }}>🎟️</div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 44, fontWeight: 700, color: "#F5F3EE", marginBottom: 8, animation: "fadeUp 0.5s ease 0.1s both" }}>You're In.</h1>
        <p style={{ fontSize: 14, color: "#6B6B85", marginBottom: 36, animation: "fadeUp 0.5s ease 0.2s both", letterSpacing: "0.05em" }}>Check your email for your e-tickets.</p>

        <div style={{ background: "#13131F", border: "1px solid #1E1E30", borderRadius: 8, overflow: "hidden", marginBottom: 28, animation: "ticketIn 0.6s ease 0.3s both" }}>
          <img src={event.img} alt={event.title} style={{ width: "100%", height: 160, objectFit: "cover", filter: "brightness(0.5)" }} />
          <div style={{ padding: "24px 28px" }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: "#F5F3EE", marginBottom: 4 }}>{event.title}</div>
            <div style={{ fontSize: 13, color: "#6B6B85", marginBottom: 20 }}>{event.date} · {event.location}</div>
            {event.tiers.filter(t => quantities[t.name] > 0).map(t => (
              <div key={t.name} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6, color: "#9090A8" }}>
                <span>{quantities[t.name]}× {t.name}</span>
                <span style={{ color: "#E8B86D" }}>${(quantities[t.name] * t.price).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ marginTop: 20, padding: "18px", background: "rgba(201,150,58,0.06)", borderRadius: 6, border: "1px solid rgba(201,150,58,0.2)", animation: "goldPulse 2s ease infinite" }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", color: "#C9963A", marginBottom: 8 }}>BOOKING REFERENCE</div>
              <div style={{ fontFamily: "'Courier New',monospace", fontSize: 18, fontWeight: 700, color: "#E8B86D", wordBreak: "break-all" }}>{bookingRef}</div>
              <div style={{ fontSize: 11, color: "#6B6B85", marginTop: 6 }}>Total paid: ${total}</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", animation: "fadeUp 0.5s ease 0.5s both" }}>
          <button onClick={() => navigate("/tickets/mytickets")} className="btn btn-gold" style={{ padding: "11px 22px", fontSize: 12 }}>
            {I.ticket} My Tickets
          </button>
          <button onClick={() => navigate("/tickets")} className="btn btn-ghost" style={{ padding: "11px 22px", fontSize: 12 }}>
            More Shows
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MY TICKETS PAGE
═══════════════════════════════════════════════════════════════ */
function MyTicketsPage() {
  const navigate = useNavigate();
  const STATUS = {
    confirmed: { color: "#27AE60", bg: "rgba(39,174,96,0.1)", label: "Confirmed" },
    pending:   { color: "#C9963A", bg: "rgba(201,150,58,0.1)", label: "Pending"   },
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080810", width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
      <div style={{ background: "linear-gradient(to bottom,#0E0E1A,#080810)", borderBottom: "1px solid #1E1E30", padding: "100px 24px 48px", width: "100%" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", color: "#C9963A", textTransform: "uppercase" }}>Your Account</span>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,5vw,54px)", fontWeight: 700, color: "#F5F3EE", marginTop: 10, marginBottom: 4 }}>My Tickets</h1>
            <p style={{ fontSize: 14, color: "#6B6B85" }}>
              {MY_TICKETS.length === 0 ? "No purchases yet" : `${MY_TICKETS.length} purchase${MY_TICKETS.length !== 1 ? "s" : ""} · All upcoming shows`}
            </p>
          </Reveal>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 80px", width: "100%" }}>
        {MY_TICKETS.length === 0 ? (
          <Reveal>
            <div style={{ textAlign: "center", padding: "60px 24px" }}>
              <div style={{ fontSize: 64, marginBottom: 20 }}>🎟</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700, color: "#F5F3EE", marginBottom: 10 }}>No tickets yet</h3>
              <p style={{ fontSize: 14, color: "#6B6B85", marginBottom: 28, lineHeight: 1.7 }}>
                You haven't purchased any tickets.<br />Browse the After Party Tour and grab your spot.
              </p>
              <button onClick={() => navigate("/tickets")} className="btn btn-gold" style={{ padding: "13px 28px" }}>
                Browse Shows {I.arrow}
              </button>
            </div>
          </Reveal>
        ) : (
          <>
            {MY_TICKETS.map((ticket, i) => {
              const st = STATUS[ticket.status];
              return (
                <Reveal key={ticket.uuid} delay={i * 0.08}>
                  <div
                    className="card"
                    onClick={() => navigate(`/tickets/event/${ticket.event.uuid}`)}
                    style={{ marginBottom: 16, overflow: "hidden", display: "grid", gridTemplateColumns: "clamp(100px,25vw,180px) 1fr", cursor: "pointer", minHeight: 130 }}
                  >
                    <img src={Head1} alt={ticket.event.title} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.6)" }} />
                    <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(14px,2vw,18px)", fontWeight: 700, color: "#F5F3EE", lineHeight: 1.3 }}>{ticket.event.title}</div>
                          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: st.color, background: st.bg, borderRadius: 2, padding: "3px 8px", flexShrink: 0, textTransform: "uppercase" }}>{st.label}</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          <div style={{ fontSize: 11, color: "#6B6B85", display: "flex", alignItems: "center", gap: 6 }}><span style={{ color: "#C9963A" }}>{I.cal}</span>{ticket.event.date}</div>
                          <div style={{ fontSize: 11, color: "#6B6B85", display: "flex", alignItems: "center", gap: 6 }}><span style={{ color: "#C9963A" }}>{I.pin}</span>{ticket.event.location}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 12, borderTop: "1px solid #1E1E30", flexWrap: "wrap", gap: 6 }}>
                        <span style={{ fontFamily: "monospace", fontSize: 10, color: "#C9963A" }}>{ticket.bookingRef}</span>
                        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: "#F5F3EE" }}>${ticket.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
            <Reveal delay={0.25}>
              <div style={{ background: "#13131F", border: "1px dashed #2A2A40", borderRadius: 8, padding: "32px", textAlign: "center", marginTop: 8 }}>
                <div style={{ color: "#2A2A40", marginBottom: 12, display: "flex", justifyContent: "center" }}>{I.qr}</div>
                <div style={{ fontSize: 13, color: "#6B6B85", marginBottom: 4 }}>Your e-tickets include QR codes</div>
                <div style={{ fontSize: 11, color: "#6B6B85" }}>Check your confirmation email for entry QR codes</div>
              </div>
            </Reveal>
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ROOT — ROUTING
═══════════════════════════════════════════════════════════════ */
export default function TicketingApp() {
  const location = useLocation();
  const showNav = !location.pathname.includes("/checkout") && !location.pathname.includes("/success");

  return (
    <div className="noise" style={{ width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
      <style>{CSS}</style>
      {showNav && <NavBar />}
      <Routes>
        <Route path="/"                    element={<ListingPage />} />
        <Route path="/mytickets"           element={<MyTicketsPage />} />
        <Route path="/event/:eventUuid"    element={<DetailPage />} />
        <Route path="/checkout/:eventUuid" element={<CheckoutPage />} />
        <Route path="/success/:eventUuid"  element={<SuccessPage />} />
      </Routes>
    </div>
  );
}