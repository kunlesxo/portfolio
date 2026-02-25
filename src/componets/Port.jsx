import { useState, useRef, useEffect } from "react";
import Front_pics from "../assets/komi pics/komi 1 landing page.png";
import Front_pics1 from "../assets/komi pics/komi album pics 1.png";
import Front_pics2 from "../assets/komi pics/komi album pics 2.png";
import Front_pics3 from "../assets/komi pics/komi album pics 3.png";
import Front_pics4 from "../assets/komi pics/komi album pics 4.png";
import Front_pics5 from "../assets/komi pics/komi album pics 5.png";
import Front_pics6 from "../assets/komi pics/komi album pics 6.png";
import Front_pics7 from "../assets/komi pics/komi backseat.png";
import Front_pics9 from "../assets/komi pics/komi big mood.png";
import Front_pics10 from "../assets/komi pics/komi demon time.png";
import Front_pics12 from "../assets/komi pics/komi sneaky.png";
import Front_pics13 from "../assets/komi pics/komi whiskey.png";
import Front_pics14 from "../assets/komi pics/komi whiskey beat.png";
import Front_pics15 from "../assets/komi pics/komi twang.png";

/* ─── YouTube ID extractor ─── */
function getYTId(url = "") {
  if (!url) return null;
  let m = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (m) return m[1];
  m = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (m) return m[1];
  return null;
}

/* ─── DATA ─── */
const ARTIST = { name: "KNGEGO", tag: "American country-rap · Nashville", image: Front_pics };

const SOCIALS = [
  { icon: "instagram", label: "Instagram", color: "#E1306C", svg: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
  { icon: "twitter",   label: "X / Twitter", color: "#fff",     svg: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.737-8.835L1.254 2.25H8.08l4.259 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { icon: "tiktok",    label: "TikTok",      color: "#69C9D0",  svg: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.16 8.16 0 004.77 1.52V6.82a4.85 4.85 0 01-1-.13z"/></svg> },
  { icon: "youtube",   label: "YouTube",     color: "#FF0000",  svg: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
  { icon: "spotify",   label: "Spotify",     color: "#1DB954",  svg: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg> },
];

const TOURS = [
  { date: "APR 4 2026",  title: "The Cowan",                 location: "Nashville, TN",  img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80" },
  { date: "APR 10 2026", title: "The Hidden Gem Music Club", location: "Dayton, OH",     img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=80" },
  { date: "APR 11 2026", title: "Shenanigans",               location: "Portage, IN",    img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80" },
  { date: "APR 24 2026", title: "Gregory Lake RV Park",      location: "Drakesboro, KY", img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80" },
  { date: "MAY 16 2026", title: "The Vortex",                location: "Akron, OH",      img: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&q=80" },
  { date: "MAY 30 2026", title: "MACS BAR",                  location: "Lansing, MI",    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80" },
];

const ALBUMS = [
  { title: "Family Ties 2",   artist: "Kne Ego, JOYBVND",  img: Front_pics1 },
  { title: "Country Gangsta", artist: "Kne Ego",            img: Front_pics2 },
  { title: "ARIES SZN",       artist: "Kne Ego",            img: Front_pics3 },
  { title: "Made For This",   artist: "Kne Ego",            img: Front_pics4 },
  { title: "Family Ties",     artist: "Kne Ego, JOYBVAND", img: Front_pics5 },
  { title: "Enough Said",     artist: "Kne Ego",            img: Front_pics6 },
];

const VIDEOS = [
  { title: "Greetings From The Top", artist: "Kng Ego x Joybvnd", url: "https://www.youtube.com/watch?v=jLdzyCK37FA" },
  { title: "Sneakey Link",           artist: "Kng Ego x Joybvnd", url: "https://www.youtube.com/watch?v=HcLzQuAeRhE" },
  { title: "Ziplock",                artist: "Kng Ego x Joybvnd", url: "https://www.youtube.com/watch?v=RDl6BRtEIJ4" },
  { title: "Big Dawg",               artist: "Kng Ego",            url: "https://www.youtube.com/watch?v=fFbxSXZfB3Q" },
  { title: "Fuck Love",              artist: "Kng Ego",            url: "https://youtu.be/A_VQWvItqXE" },
  { title: "256 To 615",             artist: "Kng Ego x Joybvnd", url: "https://youtu.be/Fthr4KZD9c4" },
  { title: "Memories",               artist: "Kng Ego x Joybvnd", url: "https://www.youtube.com/watch?v=SKr_BIBfUCk" },
  { title: "Backseat",               artist: "Kng Ego",            url: "https://www.youtube.com/watch?v=zBzNLkbb-IA" },
  { title: "Whiskey Bent",           artist: "Kng Ego",            url: "https://www.youtube.com/watch?v=uUfM5V0_Aro" },
];

const TOP_SONGS = [
  { title: "Sneaky Link",   artist: "Kng Ego, JOYBVND",        plays: "12.4M", img: Front_pics12 },
  { title: "Big Deal",      artist: "Kng Ego, JOYBVND",        plays: "9.1M",  img: Front_pics1  },
  { title: "Backseat",      artist: "Kng Ego, JOYBVND",        plays: "7.8M",  img: Front_pics7  },
  { title: "Whiskey Bent",  artist: "Kng Ego, Peezy RUBouton", plays: "6.2M",  img: Front_pics14 },
  { title: "Twang",         artist: "Kng Ego, Kingery",         plays: "5.5M",  img: Front_pics15 },
  { title: "Big Mood",      artist: "Kng Ego, JOYBVND",        plays: "5.5M",  img: Front_pics9  },
  { title: "Demon Time",    artist: "Kng Ego, JOYBVND",        plays: "5.5M",  img: Front_pics10 },
  { title: "Whiskey & You", artist: "Kng Ego, Kid Ziggy",      plays: "5.5M",  img: Front_pics13 },
];

const REMIXES = [
  { title: "Remix 1", artist: "Kng Ego", url: "https://www.youtube.com/watch?v=C9xphg5j6bM" },
  { title: "Remix 2", artist: "Kng Ego", url: "https://youtu.be/oYmpgm3RiDQ" },
  { title: "Remix 3", artist: "Kng Ego", url: "https://youtu.be/bxP7qHKqkis" },
  { title: "Remix 4", artist: "Kng Ego", url: "https://www.youtube.com/watch?v=x8bKvIP-UJg" },
];

/* ─── STREAMING SERVICES ─── */
const STREAMING = [
  {
    name: "Spotify",
    color: "#1DB954",
    bg: "#1DB95422",
    border: "#1DB95455",
    url: "https://open.spotify.com/artist/",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
  },
  {
    name: "Apple Music",
    color: "#fc3c44",
    bg: "#fc3c4422",
    border: "#fc3c4455",
    url: "https://music.apple.com/",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.769-.75c-.69-.15-1.39-.2-2.09-.2H6.3a7.56 7.56 0 00-1.36.12 5.085 5.085 0 00-2.46 1.08A5.032 5.032 0 00.974 3.917 6.258 6.258 0 00.24 6.084C.043 6.98 0 7.9 0 8.814v6.372c0 .927.043 1.847.24 2.756a5.49 5.49 0 001.356 2.607 5.148 5.148 0 002.46 1.3c.71.157 1.43.2 2.155.2h11.177c.853 0 1.697-.07 2.52-.32a5.198 5.198 0 002.21-1.28 5.274 5.274 0 001.359-2.607c.197-.91.24-1.83.24-2.756V8.814c0-.914-.043-1.834-.24-2.69zM12.145 4.5c2.072 0 3.75 1.678 3.75 3.75S14.217 12 12.145 12s-3.75-1.678-3.75-3.75S10.073 4.5 12.145 4.5zM17.5 17.25H6.645a.75.75 0 010-1.5H17.5a.75.75 0 010 1.5z"/>
      </svg>
    ),
  },
  {
    name: "Deezer",
    color: "#A238FF",
    bg: "#A238FF22",
    border: "#A238FF55",
    url: "https://www.deezer.com/search/",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M18.81 11.834H24v2.33h-5.19zM18.81 7.165H24v2.33h-5.19zM18.81 16.501H24v2.33h-5.19zM12.853 16.501h5.19v2.33h-5.19zM12.853 11.834h5.19v2.33h-5.19zM6.896 16.501h5.19v2.33h-5.19zM0 16.501h5.19v2.33H0z"/>
      </svg>
    ),
  },
];

/* ─── HOOKS ─── */
function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

/* ═══════════════════════════════════════════════════════════════
   SONG DETAIL MODAL
═══════════════════════════════════════════════════════════════ */
function SongModal({ item, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // lock scroll
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => setVisible(true));
    const onKey = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      onClick={handleClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: `rgba(0,0,0,${visible ? 0.85 : 0})`,
        backdropFilter: visible ? "blur(18px)" : "blur(0px)",
        transition: "all 0.3s ease",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        padding: "0 0 0 0",
      }}
    >
      {/* Sheet */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 520,
          background: "linear-gradient(180deg, #111 0%, #0a0a0a 100%)",
          borderRadius: "28px 28px 0 0",
          border: "1px solid rgba(255,255,255,0.1)",
          borderBottom: "none",
          overflow: "hidden",
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.35s cubic-bezier(0.32,0.72,0,1)",
          maxHeight: "95svh",
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "14px 0 0" }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
        </div>

        {/* Close btn */}
        <button
          onClick={handleClose}
          style={{ position: "absolute", top: 18, right: 18, width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}
        >×</button>

        {/* Big cover image — full width, tall */}
        <div style={{ margin: "16px 20px 0", borderRadius: 20, overflow: "hidden", position: "relative" }}>
          <img
            src={item.img}
            alt={item.title}
            style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }}
          />
          {/* subtle overlay gradient */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,10,0.6) 0%, transparent 50%)" }} />
        </div>

        {/* Artist avatar + name + title */}
        <div style={{ padding: "20px 24px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            {/* Artist avatar circle with Front_pics */}
            <div style={{ width: 48, height: 48, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(245,166,35,0.5)", flexShrink: 0 }}>
              <img src={Front_pics} alt="KNGEGO" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Syne',sans-serif", color: "#fff", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 3 }}>{item.artist}</div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)", marginBottom: 22 }} />

          {/* Streaming buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingBottom: 32 }}>
            {STREAMING.map((s) => (
              <StreamingButton key={s.name} service={s} query={`${item.title} ${item.artist}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── STREAMING BUTTON ─── */
function StreamingButton({ service, query }) {
  const [hov, setHov] = useState(false);
  const href = `${service.url}${encodeURIComponent(query)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 20px",
        borderRadius: 16,
        background: hov ? service.bg : "rgba(255,255,255,0.04)",
        border: `1px solid ${hov ? service.border : "rgba(255,255,255,0.08)"}`,
        textDecoration: "none",
        transition: "all 0.25s ease",
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov ? `0 8px 30px ${service.color}22` : "none",
        cursor: "pointer",
      }}
    >
      <div style={{ color: service.color, display: "flex", alignItems: "center", flexShrink: 0 }}>
        {service.svg}
      </div>
      <span style={{ fontSize: 15, fontWeight: 700, color: "#fff", flex: 1 }}>
        Listen on {service.name}
      </span>
      <span style={{ fontSize: 12, color: service.color, fontWeight: 600 }}>→</span>
    </a>
  );
}

/* ─── SECTION HEADER ─── */
function SectionHeader({ title }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ padding: "36px 20px 14px", opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(16px)", transition: "all 0.55s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 3, height: 24, background: "linear-gradient(180deg,#F5A623,#FF6B35)", borderRadius: 2, flexShrink: 0 }} />
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff" }}>{title}</h2>
      </div>
    </div>
  );
}

/* ─── HORIZONTAL SCROLL ─── */
function HScroll({ children }) {
  return (
    <div style={{ display: "flex", gap: 14, overflowX: "auto", padding: "4px 20px 18px", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none" }}>
      {children}
    </div>
  );
}

/* ─── TOUR CARD ─── */
function TourCard({ show }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ flexShrink: 0, width: 240, borderRadius: 18, overflow: "hidden", background: "#111", border: `1px solid ${hov ? "rgba(245,166,35,0.4)" : "rgba(255,255,255,0.07)"}`, scrollSnapAlign: "start", transition: "all 0.3s ease", transform: hov ? "translateY(-5px)" : "none", boxShadow: hov ? "0 20px 50px rgba(0,0,0,0.7)" : "none" }}>
      <div style={{ position: "relative", height: 150, overflow: "hidden" }}>
        <img src={show.img} alt={show.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s", transform: hov ? "scale(1.08)" : "scale(1)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,#111 0%,transparent 55%)" }} />
        <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,0.55)", border: "1px solid rgba(245,166,35,0.5)", borderRadius: 7, padding: "3px 9px", fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: "#F5A623", backdropFilter: "blur(6px)" }}>{show.date}</div>
      </div>
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{show.title}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", marginBottom: 14 }}>📍 {show.location}</div>
        <button style={{ width: "100%", padding: "9px 0", borderRadius: 9, border: "1px solid rgba(245,166,35,0.5)", background: hov ? "linear-gradient(135deg,#F5A623,#FF6B35)" : "transparent", color: hov ? "#000" : "#F5A623", fontWeight: 700, fontSize: 11, letterSpacing: "0.08em", cursor: "pointer", transition: "all 0.3s" }}>GET TICKETS</button>
      </div>
    </div>
  );
}

function TourRow({ show }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "flex", gap: 14, padding: "12px 14px", background: hov ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)", border: `1px solid ${hov ? "rgba(245,166,35,0.2)" : "rgba(255,255,255,0.06)"}`, borderRadius: 14, alignItems: "center", transition: "all 0.25s" }}>
      <img src={show.img} alt={show.title} style={{ width: 58, height: 58, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: "#F5A623", letterSpacing: "0.1em", marginBottom: 2 }}>{show.date}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{show.title}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", marginTop: 2 }}>📍 {show.location}</div>
      </div>
      <button style={{ flexShrink: 0, padding: "7px 13px", borderRadius: 8, border: "1px solid rgba(245,166,35,0.45)", background: hov ? "linear-gradient(135deg,#F5A623,#FF6B35)" : "transparent", color: hov ? "#000" : "#F5A623", fontSize: 11, fontWeight: 700, cursor: "pointer", letterSpacing: "0.05em", transition: "all 0.25s" }}>TICKETS</button>
    </div>
  );
}

/* ─── ALBUM CARD — clicking play opens modal ─── */
function AlbumCard({ album, onPlay }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ flexShrink: 0, width: 155, scrollSnapAlign: "start" }}>
      <div style={{ position: "relative", width: 155, height: 155, borderRadius: 14, overflow: "hidden", marginBottom: 10 }}>
        <img src={album.img} alt={album.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s", transform: hov ? "scale(1.08)" : "none" }} />
        <div onClick={() => onPlay(album)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", opacity: hov ? 1 : 0, transition: "opacity 0.3s", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#F5A623", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>▶</div>
        </div>
      </div>
      {/* artist avatar + name */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
        <div style={{ width: 22, height: 22, borderRadius: "50%", overflow: "hidden", border: "1px solid rgba(245,166,35,0.4)", flexShrink: 0 }}>
          <img src={Front_pics} alt="KNGEGO" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{album.artist}</div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{album.title}</div>
      <button onClick={() => onPlay(album)} style={{ marginTop: 8, background: "transparent", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 20, padding: "5px 12px", fontSize: 11, color: "rgba(255,255,255,0.55)", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ fontSize: 10 }}>▶</span> Play
      </button>
    </div>
  );
}

/* ─── VIDEO CARD — YouTube embed, artist avatar = Front_pics ─── */
function VideoCard({ video }) {
  const [active, setActive] = useState(false);
  const [hov, setHov] = useState(false);
  const ytId = getYTId(video.url);
  const thumbUrl = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null;

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ flexShrink: 0, width: 280, scrollSnapAlign: "start" }}>
      {/* top row */}
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
        {/* artist avatar = Front_pics */}
        <div style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", border: "1.5px solid rgba(245,166,35,0.45)", flexShrink: 0 }}>
          <img src={Front_pics} alt="KNGEGO" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ overflow: "hidden" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 220 }}>{video.title}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.38)" }}>{video.artist}</div>
        </div>
      </div>
      {/* video */}
      <div style={{ position: "relative", width: 280, height: 158, borderRadius: 13, overflow: "hidden", background: "#000" }}>
        {active && ytId ? (
          <iframe src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ width: "100%", height: "100%", border: "none", display: "block" }} />
        ) : (
          <div onClick={() => ytId && setActive(true)} style={{ width: "100%", height: "100%", cursor: ytId ? "pointer" : "default", position: "relative" }}>
            {thumbUrl ? <img src={thumbUrl} alt={video.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.35s", transform: hov ? "scale(1.04)" : "none" }} /> : <div style={{ width: "100%", height: "100%", background: "#1a1a1a" }} />}
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s", transform: hov ? "scale(1.1)" : "scale(1)" }}>
                <svg viewBox="0 0 24 24" fill="white" width="22" height="22"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
            <div style={{ position: "absolute", bottom: 7, right: 8, display: "flex", alignItems: "center", gap: 4, background: "rgba(0,0,0,0.75)", borderRadius: 5, padding: "3px 7px" }}>
              <svg viewBox="0 0 24 24" fill="#FF0000" width="12" height="12"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              <span style={{ fontSize: 10, color: "#fff", fontWeight: 600 }}>YouTube</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── TOP SONG CARD — clicking play opens modal ─── */
function TopSongCard({ song, rank, onPlay }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ flexShrink: 0, width: 155, scrollSnapAlign: "start" }}>
      <div style={{ position: "relative", width: 155, height: 155, borderRadius: 14, overflow: "hidden", marginBottom: 10 }}>
        <img src={song.img} alt={song.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s", transform: hov ? "scale(1.08)" : "none" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.7),transparent 55%)" }} />
        <div style={{ position: "absolute", top: 8, left: 10, fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, color: "rgba(255,255,255,0.13)" }}>#{rank}</div>
        <div onClick={() => onPlay(song)} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: hov ? 1 : 0, transition: "opacity 0.3s", cursor: "pointer" }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#F5A623", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>▶</div>
        </div>
        <div style={{ position: "absolute", bottom: 8, left: 8, fontSize: 10, color: "rgba(255,255,255,0.45)" }}>🎵 {song.plays}</div>
      </div>
      {/* artist avatar + name */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
        <div style={{ width: 22, height: 22, borderRadius: "50%", overflow: "hidden", border: "1px solid rgba(245,166,35,0.4)", flexShrink: 0 }}>
          <img src={Front_pics} alt="KNGEGO" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{song.artist}</div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{song.title}</div>
      <button onClick={() => onPlay(song)} style={{ marginTop: 8, background: "transparent", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 20, padding: "5px 12px", fontSize: 11, color: "rgba(255,255,255,0.55)", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ fontSize: 10 }}>▶</span> Play
      </button>
    </div>
  );
}

/* ─── MAIN APP ─── */
export default function KomiProfile() {
  const [mounted, setMounted] = useState(false);
  const [activeNav, setActiveNav] = useState(null);
  const [modal, setModal] = useState(null); // item to show in modal

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  const navItems = [
    { label: "Tour",      id: "tour"     },
    { label: "Albums",    id: "albums"   },
    { label: "Videos",    id: "videos"   },
    { label: "Top Songs", id: "topsongs" },
    { label: "Remixes",   id: "remixes"  },
  ];

  const scrollTo = (id) => {
    setActiveNav(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#fff", fontFamily: "'DM Sans','Helvetica Neue',sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700;9..40,800&family=Syne:wght@700;800&display=swap');
        @keyframes slideUp { from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)} }
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:0;height:0}
        button{font-family:inherit}
        a{text-decoration:none}
      `}</style>

      <div style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.7s ease" }}>

        {/* ══ HERO ══ */}
        <div style={{ position: "relative", width: "100%", height: "100svh", minHeight: 580, maxHeight: 860 }}>
          <img src={ARTIST.image} alt={ARTIST.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(8,8,8,0.05) 0%,rgba(8,8,8,0) 30%,rgba(8,8,8,0.75) 72%,#080808 100%)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 22px 30px" }}>
            <h1 style={{ animation: "slideUp 0.7s ease 0.2s both", fontFamily: "'Syne',sans-serif", fontSize: "clamp(44px,13vw,80px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 0.95, marginBottom: 10, background: "linear-gradient(135deg,#fff 45%,#F5A623 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {ARTIST.name}
            </h1>
            <p style={{ animation: "slideUp 0.7s ease 0.32s both", fontSize: 13, color: "rgba(255,255,255,0.45)", letterSpacing: "0.07em", marginBottom: 22 }}>{ARTIST.tag}</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", animation: "slideUp 0.7s ease 0.44s both" }}>
              {SOCIALS.map((s) => (
                <a key={s.icon} href="#" title={s.label}
                  style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: s.color, backdropFilter: "blur(12px)", transition: "all 0.25s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${s.color}22`; e.currentTarget.style.borderColor = `${s.color}55`; e.currentTarget.style.transform = "translateY(-3px) scale(1.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.transform = "none"; }}
                >{s.svg}</a>
              ))}
            </div>
          </div>
        </div>

        {/* ══ STICKY NAV ══ */}
        <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(8,8,8,0.88)", backdropFilter: "blur(22px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", gap: 4, padding: "11px 16px", overflowX: "auto", scrollbarWidth: "none" }}>
            {navItems.map(({ label, id }) => (
              <button key={id} onClick={() => scrollTo(id)}
                style={{ flexShrink: 0, padding: "7px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", whiteSpace: "nowrap", transition: "all 0.25s", background: activeNav === id ? "linear-gradient(135deg,#F5A623,#FF6B35)" : "rgba(255,255,255,0.07)", color: activeNav === id ? "#000" : "rgba(255,255,255,0.55)" }}
              >{label}</button>
            ))}
          </div>
        </div>

        {/* ══ TOUR ══ */}
        <section id="tour">
          <SectionHeader title="After Party Tour" />
          <HScroll>{TOURS.map((s, i) => <TourCard key={i} show={s} />)}</HScroll>
          <div style={{ padding: "0 20px 6px", display: "flex", flexDirection: "column", gap: 10 }}>
            {TOURS.map((s, i) => <TourRow key={i} show={s} />)}
          </div>
        </section>

        {/* ══ ALBUMS — horizontal only, opens modal ══ */}
        <section id="albums">
          <SectionHeader title="Albums & Music" />
          <HScroll>{ALBUMS.map((a, i) => <AlbumCard key={i} album={a} onPlay={setModal} />)}</HScroll>
        </section>

        {/* ══ MUSIC VIDEOS ══ */}
        <section id="videos">
          <SectionHeader title="Music Videos" />
          <HScroll>{VIDEOS.map((v, i) => <VideoCard key={i} video={v} />)}</HScroll>
        </section>

        {/* ══ TOP SONGS — opens modal ══ */}
        <section id="topsongs">
          <SectionHeader title="Top Songs" />
          <HScroll>{TOP_SONGS.map((s, i) => <TopSongCard key={i} song={s} rank={i + 1} onPlay={setModal} />)}</HScroll>
          <div style={{ padding: "4px 20px 8px", display: "flex", flexDirection: "column", gap: 10 }}>
            {TOP_SONGS.map((song, i) => (
              <div key={i} style={{ display: "flex", gap: 14, padding: "11px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, alignItems: "center" }}>
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: "rgba(255,255,255,0.12)", width: 28, textAlign: "center", flexShrink: 0 }}>#{i + 1}</span>
                <img src={song.img} alt={song.title} style={{ width: 50, height: 50, borderRadius: 9, objectFit: "cover", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{song.title}</div>
                  {/* avatar + artist inline */}
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", overflow: "hidden", border: "1px solid rgba(245,166,35,0.35)", flexShrink: 0 }}>
                      <img src={Front_pics} alt="KNGEGO" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.38)" }}>{song.artist} · {song.plays} plays</div>
                  </div>
                </div>
                <button onClick={() => setModal(song)} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(245,166,35,0.4)", background: "transparent", color: "#F5A623", cursor: "pointer", fontSize: 14, flexShrink: 0 }}>▶</button>
              </div>
            ))}
          </div>
        </section>

        {/* ══ REMIXES — Front_pics avatar ══ */}
        <section id="remixes">
          <SectionHeader title="Remixes" />
          <HScroll>{REMIXES.map((v, i) => <VideoCard key={i} video={v} />)}</HScroll>
        </section>

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "44px 20px 32px", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 32 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.13)", letterSpacing: "0.1em" }}>
            POWERED BY <span style={{ color: "rgba(245,166,35,0.35)", fontWeight: 700 }}>KOMI</span>
          </div>
        </div>

      </div>

      {/* ══ SONG DETAIL MODAL ══ */}
      {modal && <SongModal item={modal} onClose={() => setModal(null)} />}
    </div>
  );
}