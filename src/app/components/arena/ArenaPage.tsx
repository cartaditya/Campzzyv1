import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Mic, MicOff, Video, VideoOff, MessageSquare,
  Plus, X, Bell, LogOut, Gamepad2, Zap,
  Shield, Star, Swords, Users, User,
  SkipForward, Send, Link2, RefreshCw,
} from "lucide-react";
import { InCallGame } from "./InCallGame";
import { useNotificationsOverlay } from "../shared/notifications-overlay-context";

type CallState = "idle" | "searching" | "calling" | "battling" | "gaming";

interface ChatMsg {
  id: number;
  from: "me" | "system";
  text: string;
  platform?: "linkedin" | "social";
  ts: string;
}

interface GameChallenge { id: number; name: string; game: string; dismissed: boolean; }

/* ── Design tokens ── */
const T = {
  bg:          "#0F1923",
  surface:     "#162030",
  surfaceUp:   "#1A2D3D",
  border:      "#1E2D40",
  borderUp:    "#1A2A38",
  accent:      "#4DD9C0",
  iconInact:   "#3A5060",
  textPrim:    "#C8D8E0",
  textMid:     "#4A6A7A",
  textDim:     "#2E4A5A",
  textDimmer:  "#243545",
  notifDot:    "#E05555",
  greenDark:   "#1A3A28",
  greenBright: "#4ADE80",
  red:         "#DC3545",
  purpleDark:  "#1E103A",
};

const ME   = { initials: "AH", name: "Aditya Harsora", college: "MIT Manipal",  flair: "Vibe Coder",   rank: 4, emoji: "⚡", winRate: 68 };
const PEER = { initials: "RK", name: "Rahul Kumar",    college: "IIT Bombay",   flair: "🎸 Guitarist", rank: 2, emoji: "🎓", winRate: 79 };

const BATTLE_COUNTDOWN = ["3", "2", "1", "FIGHT!"];

/* Demo profile socials — production: shared state / localStorage */
const SOCIALS = {
  linkedin:    "aditya.harsora",
  otherSocials: "@aditya.h | adityah99",  // free-text from profile "Other Socials"
};

const GAME_DEFS = [
  { name: "Chess",               key: "chess"  as const, emoji: "♟️", color: "#7C3AED" },
  { name: "Tic-Tac-Toe",        key: "ttt"   as const, emoji: "⭕", color: "#007BFF" },
  { name: "Memory Match",        key: "memory"as const, emoji: "🃏", color: "#F59E0B" },
  { name: "Rock Paper Scissors", key: "rps"  as const, emoji: "✊", color: "#0EA5E9" },
];

type IdleOrb = {
  id: string;
  initials: string;
  color: "#4DD9C0" | "#60A5FA" | "#A78BFA" | "#F472B6";
  x: number;
  y: number;
  size: number;
  dx: number;
  dy: number;
  duration: number;
  delay: number;
};

function seededRandom(seed: number) {
  const value = Math.sin(seed) * 10000;
  return value - Math.floor(value);
}

function randomInRange(min: number, max: number, seed: number) {
  return min + (max - min) * seededRandom(seed);
}

const IDLE_ORBS: IdleOrb[] = [
  { id: "am", initials: "AM", color: "#4DD9C0", x: randomInRange(10, 24, 1), y: randomInRange(10, 24, 2), size: 48, dx: randomInRange(7, 13, 3), dy: randomInRange(-12, -6, 4), duration: randomInRange(4.6, 6.2, 5), delay: randomInRange(0, 1.1, 6) },
  { id: "nm", initials: "NM", color: "#60A5FA", x: randomInRange(72, 88, 7), y: randomInRange(12, 28, 8), size: 48, dx: randomInRange(-13, -7, 9), dy: randomInRange(7, 13, 10), duration: randomInRange(5.2, 6.9, 11), delay: randomInRange(0.3, 1.4, 12) },
  { id: "at", initials: "AT", color: "#A78BFA", x: randomInRange(14, 30, 13), y: randomInRange(40, 56, 14), size: 48, dx: randomInRange(6, 12, 15), dy: randomInRange(8, 14, 16), duration: randomInRange(4.8, 6.5, 17), delay: randomInRange(0.6, 1.7, 18) },
  { id: "ra", initials: "RA", color: "#4DD9C0", x: randomInRange(68, 86, 19), y: randomInRange(42, 60, 20), size: 48, dx: randomInRange(-12, -6, 21), dy: randomInRange(-12, -7, 22), duration: randomInRange(5.4, 7.2, 23), delay: randomInRange(0.9, 2.0, 24) },
  { id: "lt", initials: "LT", color: "#60A5FA", x: randomInRange(12, 28, 25), y: randomInRange(70, 88, 26), size: 48, dx: randomInRange(7, 13, 27), dy: randomInRange(-11, -6, 28), duration: randomInRange(4.4, 6.1, 29), delay: randomInRange(1.2, 2.3, 30) },
  { id: "sk", initials: "SK", color: "#F472B6", x: randomInRange(70, 90, 31), y: randomInRange(72, 90, 32), size: 48, dx: randomInRange(-11, -6, 33), dy: randomInRange(7, 12, 34), duration: randomInRange(5.8, 7.8, 35), delay: randomInRange(1.5, 2.6, 36) },
];

function getNearestOrbLinks(orbs: IdleOrb[]) {
  const unique = new Set<string>();
  const links: Array<{ a: IdleOrb; b: IdleOrb }> = [];

  for (const orb of orbs) {
    let nearest: IdleOrb | null = null;
    let minDist = Number.POSITIVE_INFINITY;

    for (const candidate of orbs) {
      if (orb.id === candidate.id) continue;
      const dx = orb.x - candidate.x;
      const dy = orb.y - candidate.y;
      const dist = dx * dx + dy * dy;
      if (dist < minDist) {
        minDist = dist;
        nearest = candidate;
      }
    }

    if (!nearest) continue;
    const key = [orb.id, nearest.id].sort().join(":");
    if (unique.has(key)) continue;
    unique.add(key);
    links.push({ a: orb, b: nearest });
  }

  return links;
}

const IDLE_ORB_LINKS = getNearestOrbLinks(IDLE_ORBS);

/* ══════════════════════════════════════════════════════
   ARENA PAGE
══════════════════════════════════════════════════════ */
export function ArenaPage() {
  /* ─ call ─ */
  const [callState, setCallState]   = useState<CallState>("idle");
  const [micOn, setMicOn]           = useState(true);
  const [videoOn, setVideoOn]       = useState(true);
  const [camError, setCamError]     = useState(false);
  const [queueCount, setQueueCount] = useState(47);
  const [connBorder, setConnBorder] = useState<null | "blue" | "green">(null);

  /* ─ battle ─ */
  const [battlePhase, setBattlePhase] = useState(0);
  const [battleCdIdx, setBattleCdIdx] = useState(-1);
  const [battleShake, setBattleShake] = useState(false);

  /* ─ celebrations ─ */
  const [socialCelebration, setSocialCelebration] = useState(false);
  const [proCelebration,    setProCelebration]    = useState(false);

  /* ─ notifications ─ */
  const [notifSeen, setNotifSeen]   = useState(false);

  /* ─ challenge toasts ─ */
  const [challenges, setChallenges] = useState<GameChallenge[]>([
    { id: 1, name: "Riya", game: "Chess", dismissed: false },
  ]);

  /* ─ games panel / modals ─ */
  const [gamesPanelOpen, setGamesPanelOpen]     = useState(false);
  const [gameConfirmModal, setGameConfirmModal] = useState<string | null>(null);
  const [gameSwitchModal, setGameSwitchModal]   = useState<string | null>(null);
  const [activeGameName, setActiveGameName]     = useState<string | null>(null);

  /* ─ chat ─ */
  const [chatOpen, setChatOpen]         = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput]       = useState("");

  /* ─ social share panel ─ */
  const [socialPanel, setSocialPanel] = useState(false);

  /* ─ toast ─ */
  const [toast, setToast] = useState<string | null>(null);

  const ownVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef   = useRef<MediaStream | null>(null);
  const chatEndRef  = useRef<HTMLDivElement>(null);
  const navigate    = useNavigate();
  const location    = useLocation();
  const { isNotificationsOpen, toggleNotifications } = useNotificationsOverlay();
  const isArenaRoute = location.pathname === "/arena";
  const isGamesRoute = location.pathname === "/games";
  const isAlertsRoute = isNotificationsOpen;
  const isProfileRoute = location.pathname === "/profile";

  /* ── Camera / mic ── */
  useEffect(() => {
    let active = true;
    navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
      .then((s) => {
        if (!active) { s.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = s;
        if (ownVideoRef.current) ownVideoRef.current.srcObject = s;
      })
      .catch(() => { if (active) setCamError(true); });
    return () => { active = false; streamRef.current?.getTracks().forEach((t) => t.stop()); };
  }, []);
  useEffect(() => { streamRef.current?.getVideoTracks().forEach((t) => { t.enabled = videoOn; }); }, [videoOn]);
  useEffect(() => { streamRef.current?.getAudioTracks().forEach((t) => { t.enabled = micOn; });  }, [micOn]);

  /* ── Searching → calling ── */
  useEffect(() => {
    if (callState !== "searching") return;
    const iv = setInterval(() => setQueueCount((n) => n + Math.floor(Math.random() * 3 - 1)), 1800);
    const t  = setTimeout(() => setCallState("calling"), 3000);
    return () => { clearInterval(iv); clearTimeout(t); };
  }, [callState]);

  /* ── Battle sequence ── */
  useEffect(() => {
    if (callState !== "battling") { setBattlePhase(0); setBattleCdIdx(-1); setBattleShake(false); return; }
    setBattlePhase(0); setBattleCdIdx(-1);
    const t1 = setTimeout(() => setBattlePhase(1), 900);
    const t2 = setTimeout(() => {
      setBattlePhase(2);
      let idx = 0; setBattleCdIdx(0);
      const tick = () => {
        setBattleShake(true);
        setTimeout(() => setBattleShake(false), 320);
        idx++;
        if (idx < BATTLE_COUNTDOWN.length) {
          setBattleCdIdx(idx);
          setTimeout(tick, idx === BATTLE_COUNTDOWN.length - 1 ? 550 : 680);
        }
      };
      setTimeout(tick, 650);
    }, 1800);
    const t3 = setTimeout(() => setCallState("gaming"), 4300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [callState]);

  /* ── Auto-scroll chat ── */
  useEffect(() => {
    if (chatOpen) chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatOpen]);

  /* ── Helpers ── */
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const addChatMsg = (msg: Omit<ChatMsg, "id" | "ts">) => {
    setChatMessages((prev) => [
      ...prev,
      { ...msg, id: Date.now(), ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    ]);
  };

  /* ── Handlers ── */
  const handleRoll = () => setCallState("searching");

  const handleSkip = () => {
    setCallState("searching");
    setConnBorder(null);
    setActiveGameName(null);
    setGamesPanelOpen(false);
    setChatOpen(false);
    setSocialPanel(false);
  };

  const handleEnd = () => {
    setCallState("idle");
    setConnBorder(null);
    setActiveGameName(null);
    setGamesPanelOpen(false);
    setChatOpen(false);
    setSocialPanel(false);
  };

  const handleGamesButton = () => {
    if (!isInCall || callState === "battling") return;
    setGamesPanelOpen((p) => !p);
    setSocialPanel(false);
    setChatOpen(false);
  };

  const handleGameIconTap = (gameName: string) => {
    setGamesPanelOpen(false);
    if (callState === "gaming") {
      setGameSwitchModal(gameName);
    } else {
      setGameConfirmModal(gameName);
    }
  };

  const handleConfirmStart = () => {
    if (!gameConfirmModal) return;
    setActiveGameName(gameConfirmModal);
    setGameConfirmModal(null);
    setCallState("battling");
  };

  const handleConfirmSwitch = () => {
    if (!gameSwitchModal) return;
    setGameConfirmModal(gameSwitchModal);
    setGameSwitchModal(null);
  };

  /* Blue+ — LinkedIn: BOTH celebration popup AND chat bubble simultaneously */
  const handleBluePlus = () => {
    if (!isInCall) return;
    if (!SOCIALS.linkedin) { showToast("Add your LinkedIn in profile first"); return; }
    // 1. Chat bubble
    addChatMsg({ from: "system", platform: "linkedin", text: `${ME.name} shared their LinkedIn — ${SOCIALS.linkedin}` });
    setChatOpen(true);
    setConnBorder("blue");
    // 2. Celebration popup (simultaneously)
    setProCelebration(true);
    setTimeout(() => setProCelebration(false), 4500);
  };

  const handleGreenPlus = () => {
    if (!isInCall) return;
    if (!SOCIALS.otherSocials) { showToast("Add your socials in profile first"); return; }
    setSocialPanel((p) => !p);
    setGamesPanelOpen(false);
  };

  /* Green+ Share: BOTH celebration popup AND chat bubble simultaneously */
  const handleShareSocial = () => {
    if (!SOCIALS.otherSocials) { showToast("Add your socials in profile first"); return; }
    // 1. Chat bubble
    addChatMsg({ from: "system", platform: "social", text: `${ME.name} shared their socials — ${SOCIALS.otherSocials}` });
    setSocialPanel(false);
    setChatOpen(true);
    setConnBorder("green");
    // 2. Celebration popup (simultaneously)
    setSocialCelebration(true);
    setTimeout(() => setSocialCelebration(false), 4500);
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    addChatMsg({ from: "me", text: chatInput.trim() });
    setChatInput("");
  };

  /* ── Derived ── */
  const isInCall      = callState !== "idle" && callState !== "searching";
  const isGameActive  = callState === "gaming" || callState === "battling";
  const pendingChallenges = challenges.filter((c) => !c.dismissed);
  const isFullBleedVideo = callState === "idle" || callState === "calling";

  const gameInfo = (name: string) => GAME_DEFS.find((g) => g.name === name);

  return (
    <div style={{ display: "flex", height: "100vh", background: T.bg, fontFamily: "'Inter', system-ui, sans-serif", overflow: "hidden" }}>

      {/* ══ SIDEBAR ══ */}
      <aside style={{ width: "66px", background: T.bg, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", alignItems: "center", padding: "0.875rem 0", flexShrink: 0, zIndex: 30, position: "relative" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: T.surface, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", flexShrink: 0 }}>
          <Zap size={17} color={T.accent} fill={T.accent} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem", width: "100%" }}>
          <SideNavItem icon={<RefreshCw size={16} />} label="Roll" onClick={() => navigate("/arena")} active={isArenaRoute} />
          <SideNavItem icon={<Gamepad2 size={16} />} label="Play" onClick={() => navigate("/games")} active={isGamesRoute} />
          <div style={{ position: "relative", margin: "0.25rem 0" }}>
            <SideNavItem
              icon={<Bell size={16} />}
              label="Alerts"
              onClick={() => { toggleNotifications(); setNotifSeen(true); }}
              active={isAlertsRoute}
            />
            {!notifSeen && <div style={{ position: "absolute", top: "9px", right: "9px", width: "7px", height: "7px", borderRadius: "50%", background: T.notifDot, border: `1.5px solid ${T.bg}`, pointerEvents: "none" }} />}
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
          <button onClick={() => navigate("/profile")} style={{ width: "42px", height: "42px", borderRadius: "50%", background: "#22c55e", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 800, color: "#ffffff", transition: "color 0.2s ease, opacity 0.2s ease" }}>
            {ME.initials}
          </button>
          <button onClick={() => navigate("/")} style={{ width: "40px", height: "40px", borderRadius: "12px", background: "transparent", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.15rem", color: T.iconInact }}>
            <LogOut size={15} />
            <span style={{ fontSize: "0.48rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Out</span>
          </button>
        </div>
      </aside>

      {/* ══ LEFT PANEL (30%) - ONLY WHEN IDLE ══ */}
      {callState === "idle" && (
        <div style={{ width: "30%", background: "#0F1923", borderRight: `1px solid rgba(77,217,192,0.1)`, display: "flex", flexDirection: "column", padding: "2.5rem 2rem", flexShrink: 0, overflow: "auto", position: "relative" }}>
          {/* Network connecting lines */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}>
            {IDLE_ORB_LINKS.map((link) => (
              <line
                key={`${link.a.id}-${link.b.id}`}
                x1={`${link.a.x}%`}
                y1={`${link.a.y}%`}
                x2={`${link.b.x}%`}
                y2={`${link.b.y}%`}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            ))}
          </svg>
        {/* Floating orbs background */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
          {/* Floating avatar circles */}
          {IDLE_ORBS.map((orb) => (
            <FloatingAvatarCircle key={orb.id} orb={orb} />
          ))}
        </div>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
          {/* Header */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2.5rem" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(77,217,192,0.15)", border: "1px solid rgba(77,217,192,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Zap size={20} color="#4DD9C0" fill="#4DD9C0" />
              </div>
              <span style={{ fontSize: "1.3rem", fontWeight: 900, letterSpacing: "-0.5px", background: "linear-gradient(90deg, #4DD9C0 0%, #A855F7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>CAMPZZY</span>
            </div>

            <h1 style={{ fontSize: "2.8rem", fontWeight: 900, color: "#FFFFFF", margin: "0 0 1rem", lineHeight: 1.1, letterSpacing: "-1px" }}>Coolest on Campus</h1>
            <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.65)", margin: "0 0 2rem", fontWeight: 500, lineHeight: 1.5 }}>Meet. Compete. Connect. Roll.</p>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
              <div className="idle-stat-card" style={{ textAlign: "center", padding: "0.75rem", background: "rgba(77,217,192,0.08)", borderRadius: "12px", border: "1px solid rgba(77,217,192,0.15)" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#4DD9C0", marginBottom: "0.25rem" }}>12K+</div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Students</div>
              </div>
              <div className="idle-stat-card" style={{ textAlign: "center", padding: "0.75rem", background: "rgba(77,217,192,0.08)", borderRadius: "12px", border: "1px solid rgba(77,217,192,0.15)" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#4DD9C0", marginBottom: "0.25rem" }}>340+</div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Colleges</div>
              </div>
              <div className="idle-stat-card" style={{ textAlign: "center", padding: "0.75rem", background: "rgba(77,217,192,0.08)", borderRadius: "12px", border: "1px solid rgba(77,217,192,0.15)" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#4DD9C0", marginBottom: "0.25rem" }}>98K+</div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Connections</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      )}

      {/* ══ MAIN COLUMN - DYNAMIC WIDTH ══ */}
      <div style={{ width: callState === "idle" ? "70%" : "calc(100% - 66px)", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", flexShrink: 0 }}>

        {/* HEADER */}
        {callState !== "calling" && callState !== "battling" && (
          <header style={{ height: "48px", background: isFullBleedVideo ? "transparent" : T.bg, borderBottom: "none", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.25rem", flexShrink: 0, zIndex: 20, position: isFullBleedVideo ? "absolute" : "relative", inset: isFullBleedVideo ? "0 0 auto 0" : undefined, pointerEvents: "none" }}>
            <div>
              <span style={{ fontSize: "0.95rem", fontWeight: 900, letterSpacing: "-0.5px", background: "linear-gradient(90deg, #4DD9C0 0%, #A855F7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>CAMPZZY</span>
              <span style={{ fontSize: "0.6rem", color: T.iconInact, fontWeight: 600, marginLeft: "0.5rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Coolest on Campus</span>
            </div>
            <div style={{ pointerEvents: "auto" }}>
              {(isInCall || callState === "searching") && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "rgba(220,53,69,0.1)", border: "1px solid rgba(220,53,69,0.2)", borderRadius: "6px", padding: "0.2rem 0.55rem" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: T.red, animation: "live-blink 1.4s ease-in-out infinite" }} />
                  <span style={{ fontSize: "0.65rem", fontWeight: 800, color: T.red, letterSpacing: "0.08em" }}>
                    {callState === "searching" ? "MATCHING…" : "LIVE"}
                  </span>
                </div>
              )}
            </div>
          </header>
        )}

        {/* VIDEO / GAME AREA */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>

          {callState === "idle" && (
            <div style={{ flex: 1, position: "relative", background: T.bg }}>
              <CameraView videoRef={ownVideoRef} isMuted videoOn={videoOn} camError={camError} label="You" style={{ position: "absolute", inset: 0 }} />
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", pointerEvents: "none", zIndex: 10 }}>
                <p style={{ color: T.textDim, fontSize: "13px", fontWeight: 400, margin: 0 }}>Hit <span style={{ color: T.accent, fontWeight: 600 }}>ROLL</span> to find your match</p>
              </div>
              <div style={{ position: "absolute", bottom: "1rem", left: "1rem", zIndex: 20 }}>
                <div style={{ background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "10px", padding: "10px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "3px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 500, color: "#1A1A1A" }}>{ME.name}</span>
                    <span style={{ fontSize: "11px", fontWeight: 500, color: "#1A1A1A", background: "#F4F4F4", borderRadius: "5px", padding: "0.1rem 0.4rem" }}>⚡ {ME.flair}</span>
                  </div>
                  <p style={{ fontSize: "12px", color: "#888888", margin: 0 }}>{ME.college}</p>
                </div>
              </div>
            </div>
          )}

          {callState === "searching" && (
            <div style={{ flex: 1, position: "relative", background: `radial-gradient(ellipse at center, #162030 0%, ${T.bg} 75%)`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {[0,1,2,3].map((i) => (
                <div key={i} style={{ position: "absolute", width: `${140+i*90}px`, height: `${140+i*90}px`, borderRadius: "50%", border: `1.5px solid rgba(77,217,192,${0.14-i*0.03})`, animation: `radar-expand 2.4s ${i*0.6}s ease-out infinite`, pointerEvents: "none" }} />
              ))}
              <div style={{ position: "absolute", width: "320px", height: "320px", borderRadius: "50%", overflow: "hidden", pointerEvents: "none" }}>
                <div style={{ position: "absolute", inset: 0, background: "conic-gradient(from 0deg, rgba(77,217,192,0.08) 0deg, transparent 60deg)", animation: "radar-spin 2s linear infinite", borderRadius: "50%" }} />
              </div>
              <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
                <div style={{ position: "relative" }}>
                  <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, #2ABDA6)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: 900, color: T.bg }}>{ME.initials}</div>
                  <div style={{ position: "absolute", inset: "-10px", border: `2px dashed rgba(77,217,192,0.3)`, borderRadius: "50%", animation: "spin-slow 3s linear infinite" }} />
                  <div style={{ position: "absolute", inset: "-22px", border: `1.5px dashed rgba(77,217,192,0.12)`, borderRadius: "50%", animation: "spin-rev 5s linear infinite" }} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "1.1rem", fontWeight: 900, color: T.textPrim, margin: "0 0 0.35rem", letterSpacing: "-0.5px" }}>Scanning Campus Network</p>
                  <p style={{ fontSize: "0.72rem", color: T.textMid, fontWeight: 500, margin: "0 0 1.25rem" }}>Looking for someone amazing from a top college…</p>
                  <div style={{ width: "240px", background: T.surface, borderRadius: "99px", height: "4px", overflow: "hidden", margin: "0 auto 0.75rem" }}>
                    <div style={{ height: "100%", background: `linear-gradient(90deg, ${T.accent}, #2ABDA6)`, borderRadius: "99px", animation: "scan-bar 1.8s ease-in-out infinite" }} />
                  </div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: T.surface, border: `1px solid ${T.border}`, borderRadius: "100px", padding: "0.3rem 0.9rem" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: T.greenBright, animation: "live-blink 1s infinite" }} />
                    <span style={{ fontSize: "0.68rem", fontWeight: 600, color: T.textMid }}><span style={{ color: T.textPrim, fontWeight: 800 }}>{queueCount}</span> students in queue</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  {[0,1,2,3,4].map((i) => <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: T.accent, animation: `campzzy-bounce 1.4s ${i*0.15}s ease-in-out infinite`, opacity: 0.7 }} />)}
                </div>
              </div>
            </div>
          )}

          {callState === "calling" && (
            <div style={{ flex: 1, position: "relative" }}>
              {connBorder && <div style={{ position: "absolute", inset: 0, zIndex: 50, pointerEvents: "none", boxShadow: connBorder === "green" ? "inset 0 0 0 3px #28A745" : `inset 0 0 0 3px ${T.accent}`, animation: "border-glow-pulse 1.2s ease-in-out 3" }} />}
              <PeerCameraPlaceholder />
              <div style={{ position: "absolute", top: "1rem", right: "1rem", width: "280px", height: "180px", borderRadius: "14px", border: `2px solid rgba(77,217,192,0.2)`, overflow: "hidden", zIndex: 20 }}>
                <CameraView videoRef={ownVideoRef} isMuted videoOn={videoOn} camError={camError} label="You" style={{ position: "absolute", inset: 0 }} />
                <div style={{ position: "absolute", bottom: "0.3rem", left: "0.4rem", zIndex: 5 }}>
                  <span style={{ fontSize: "0.58rem", fontWeight: 700, background: `rgba(77,217,192,0.75)`, borderRadius: "4px", padding: "0.1rem 0.35rem", color: T.bg }}>{ME.name.split(" ")[0]}</span>
                </div>
              </div>
              <div style={{ position: "absolute", bottom: "1rem", left: "1rem", zIndex: 20 }}>
                <div style={{ background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "10px", padding: "10px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "3px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 500, color: "#1A1A1A" }}>{PEER.name}</span>
                    <span style={{ fontSize: "11px", fontWeight: 500, color: "#1A1A1A", background: "#F4F4F4", borderRadius: "5px", padding: "0.1rem 0.4rem" }}>{PEER.flair}</span>
                  </div>
                  <p style={{ fontSize: "12px", color: "#888888", margin: 0 }}>{PEER.college}</p>
                </div>
              </div>
            </div>
          )}

          {callState === "battling" && (
            <ArenaBattleOverlay phase={battlePhase} countdownIdx={battleCdIdx} shake={battleShake} gameLabel={activeGameName ?? "Tic-Tac-Toe"} />
          )}

          {callState === "gaming" && (
            <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
              {connBorder && <div style={{ position: "absolute", inset: 0, zIndex: 50, pointerEvents: "none", boxShadow: connBorder === "green" ? "inset 0 0 0 2px #28A745" : `inset 0 0 0 2px ${T.accent}` }} />}
              <div style={{ width: "34%", display: "flex", flexDirection: "column", borderRight: `1px solid ${T.border}`, flexShrink: 0 }}>
                <div style={{ flex: 1, position: "relative", borderBottom: `1px solid ${T.border}` }}>
                  <PeerCameraPlaceholder compact />
                  <div style={{ position: "absolute", bottom: "0.5rem", left: "0.5rem", zIndex: 10 }}>
                    <span style={{ background: "rgba(22,32,48,0.85)", borderRadius: "6px", padding: "0.2rem 0.5rem", fontSize: "0.65rem", fontWeight: 600, color: T.textPrim }}>{PEER.name.split(" ")[0]} · {PEER.college}</span>
                  </div>
                </div>
                <div style={{ flex: 1, position: "relative" }}>
                  <CameraView videoRef={ownVideoRef} isMuted videoOn={videoOn} camError={camError} label="You" style={{ position: "absolute", inset: 0 }} />
                  <div style={{ position: "absolute", bottom: "0.5rem", left: "0.5rem", zIndex: 10 }}>
                    <span style={{ background: `rgba(77,217,192,0.8)`, borderRadius: "6px", padding: "0.2rem 0.5rem", fontSize: "0.65rem", fontWeight: 700, color: T.bg }}>{ME.name.split(" ")[0]} · You</span>
                  </div>
                </div>
              </div>
              <div style={{ flex: 1, overflow: "hidden" }}><InCallGame /></div>
            </div>
          )}

          {/* ── CELEBRATIONS ── */}
          {socialCelebration && isInCall && (
            <CelebrationPopup type="social" name={ME.name} onClose={() => setSocialCelebration(false)} />
          )}
          {proCelebration && isInCall && (
            <CelebrationPopup type="pro" name={ME.name} onClose={() => setProCelebration(false)} />
          )}

          {/* ── CHAT PANEL (white theme) ── */}
          {chatOpen && isInCall && (
            <>
              <div onClick={() => setChatOpen(false)} style={{ position: "absolute", inset: 0, zIndex: 34 }} />
              <div
                onClick={(e) => e.stopPropagation()}
                style={{ position: "absolute", top: callState === "calling" ? "calc(1rem + 180px + 1rem)" : "1rem", right: "1rem", bottom: "96px", width: "300px", background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", zIndex: 35, display: "flex", flexDirection: "column", animation: "chat-panel-in 0.2s cubic-bezier(0.22,1,0.36,1)", overflow: "hidden" }}
              >
                {/* Chat header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 1rem", borderBottom: "1px solid #F0F0F0", background: "#FFFFFF", flexShrink: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#F5F5F5", border: "1px solid #E5E5E5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, color: "#1A1A1A" }}>{PEER.initials}</div>
                    <div>
                      <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: "#1A1A1A" }}>{PEER.name.split(" ")[0]}</p>
                      <p style={{ margin: 0, fontSize: "11px", color: "#AAAAAA" }}>{PEER.college}</p>
                    </div>
                  </div>
                  <button onClick={() => setChatOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#888888", display: "flex", alignItems: "center", padding: "4px" }}>
                    <X size={16} />
                  </button>
                </div>
                {/* Messages */}
                <div style={{ flex: 1, overflowY: "auto", padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem", background: "#FFFFFF" }}>
                  {chatMessages.length === 0 && (
                    <p style={{ textAlign: "center", color: "#AAAAAA", fontSize: "0.72rem", margin: "auto 0" }}>No messages yet. Say hi! 👋</p>
                  )}
                  {chatMessages.map((msg) => {
                    if (msg.from === "me") return (
                      <div key={msg.id} style={{ display: "flex", justifyContent: "flex-end" }}>
                        <div style={{ maxWidth: "80%" }}>
                          <div style={{ background: "#0F1923", borderRadius: "16px 16px 0 16px", padding: "8px 12px" }}>
                            <p style={{ margin: 0, fontSize: "13px", color: "#C8D8E0", lineHeight: 1.4 }}>{msg.text}</p>
                          </div>
                          <p style={{ margin: "2px 4px 0", fontSize: "10px", color: "#AAAAAA", textAlign: "right" }}>{msg.ts}</p>
                        </div>
                      </div>
                    );
                    if (msg.from === "system") return (
                      <div key={msg.id} style={{ display: "flex", justifyContent: "flex-start" }}>
                        <div style={{ maxWidth: "90%" }}>
                          <div style={{ background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: "10px", padding: "10px 12px", display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ flexShrink: 0 }}>
                              {msg.platform === "linkedin" ? (
                                <div style={{ width: "22px", height: "22px", borderRadius: "4px", background: "#0A66C2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                </div>
                              ) : (
                                <div style={{ width: "22px", height: "22px", borderRadius: "4px", background: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <Link2 size={12} color="white" />
                                </div>
                              )}
                            </div>
                            <p style={{ margin: 0, fontSize: "13px", color: "#1A1A1A", lineHeight: 1.4 }}>{msg.text}</p>
                          </div>
                          <p style={{ margin: "2px 4px 0", fontSize: "10px", color: "#AAAAAA" }}>{msg.ts}</p>
                        </div>
                      </div>
                    );
                    return null;
                  })}
                  <div ref={chatEndRef} />
                </div>
                {/* Input */}
                <div style={{ padding: "0.75rem", borderTop: "1px solid #F0F0F0", flexShrink: 0, background: "#FFFFFF", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSendChat(); }}
                    placeholder="Type a message"
                    className="campzzy-chat-input"
                    style={{ flex: 1, background: "#F5F5F5", border: "1px solid #EBEBEB", borderRadius: "20px", padding: "0.55rem 1rem", fontSize: "0.82rem", color: "#1A1A1A", fontFamily: "inherit", outline: "none" }}
                  />
                  <button
                    onClick={handleSendChat}
                    style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#3B82F6", border: "none", cursor: chatInput.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                  >
                    <Send size={14} color="#FFFFFF" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── GAMES PANEL — vertical list, rises above control bar ── */}
        {gamesPanelOpen && isInCall && callState !== "battling" && (
          <div style={{ position: "absolute", bottom: "78px", left: "50%", transform: "translateX(-50%)", background: "#FFFFFF", borderRadius: "14px", padding: "8px", zIndex: 25, display: "flex", flexDirection: "column", gap: "4px", width: "72px", boxShadow: "0 4px 24px rgba(0,0,0,0.18)", animation: "panel-rise 0.18s ease" }}>
            {GAME_DEFS.map((g) => (
              <button
                key={g.key}
                onClick={() => handleGameIconTap(g.name)}
                title={g.name}
                style={{ width: "52px", height: "52px", borderRadius: "10px", background: `${g.color}18`, border: `1.5px solid ${g.color}30`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", transition: "all 0.12s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${g.color}30`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${g.color}18`; }}
              >
                {g.emoji}
              </button>
            ))}
          </div>
        )}

        {/* ── SOCIAL SHARE PANEL ── */}
        {socialPanel && isInCall && (
          <div style={{ position: "absolute", bottom: "86px", right: "32px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: "12px", padding: "12px", zIndex: 25, minWidth: "230px", animation: "panel-rise 0.18s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "4px", background: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Link2 size={13} color="white" />
              </div>
              <span style={{ flex: 1, fontSize: "13px", color: SOCIALS.otherSocials ? T.textPrim : T.textMid, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {SOCIALS.otherSocials || "No social added"}
              </span>
              <button
                onClick={handleShareSocial}
                disabled={!SOCIALS.otherSocials}
                style={{ background: T.border, border: "none", borderRadius: "6px", padding: "4px 10px", fontSize: "11px", color: SOCIALS.otherSocials ? T.accent : T.textMid, cursor: SOCIALS.otherSocials ? "pointer" : "not-allowed", fontFamily: "inherit", fontWeight: 600 }}
              >
                Share
              </button>
            </div>
          </div>
        )}

        {/* ── TOAST ── */}
        {toast && (
          <div style={{ position: "absolute", bottom: "90px", left: "50%", transform: "translateX(-50%)", background: "#1C1C1C", borderRadius: "8px", padding: "8px 14px", zIndex: 30, whiteSpace: "nowrap", animation: "toast-in 0.18s ease" }}>
            <span style={{ fontSize: "12px", color: T.textPrim }}>{toast}</span>
          </div>
        )}

        {/* ── CONTROL BAR ── */}
        <div style={{ height: "78px", background: "transparent", borderTop: "none", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0, position: "absolute", left: "50%", bottom: "1rem", transform: "translateX(-50%)", zIndex: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#FFFFFF", borderRadius: "100px", padding: "0.55rem 1rem", border: "1px solid rgba(0,0,0,0.08)" }}>

            {/* Mic + Camera — always visible, dark bg */}
            <DarkCtrlBtn onClick={() => setMicOn(!micOn)} danger={!micOn}>
              {micOn ? <Mic size={16} /> : <MicOff size={16} />}
            </DarkCtrlBtn>
            <DarkCtrlBtn onClick={() => setVideoOn(!videoOn)} danger={!videoOn}>
              {videoOn ? <Video size={16} /> : <VideoOff size={16} />}
            </DarkCtrlBtn>
            <Divider />

            {/* STATE 3 — not in call */}
            {!isInCall && callState === "idle" && (
              <BigBtn color="#22C55E" onClick={handleRoll}>
                <span style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.04em", color: "#FFFFFF" }}>ROLL</span>
              </BigBtn>
            )}
            {!isInCall && callState === "searching" && (
              <BigBtn color="#EF4444" onClick={() => setCallState("idle")} border="none">
                <X size={17} strokeWidth={2.5} color="#FFFFFF" />
              </BigBtn>
            )}

            {/* STATE 1 — in call, no game */}
            {isInCall && !isGameActive && (
              <>
                <BigBtn color="#22C55E" onClick={handleSkip}>
                  <SkipForward size={16} color="#FFFFFF" />
                </BigBtn>
                <DarkCtrlBtn onClick={() => { setChatOpen(!chatOpen); setSocialPanel(false); setGamesPanelOpen(false); }} active={chatOpen}>
                  <MessageSquare size={16} />
                </DarkCtrlBtn>
                <BigBtn color={gamesPanelOpen ? "#4338CA" : "#312E81"} onClick={handleGamesButton} border={gamesPanelOpen ? "1px solid rgba(99,102,241,0.6)" : "none"} size={42}>
                  <Gamepad2 size={16} color="#FFFFFF" />
                </BigBtn>
                <Divider />
                <BigBtn color="#2563EB" onClick={handleBluePlus}>
                  <Plus size={17} strokeWidth={2.5} color="#FFFFFF" />
                </BigBtn>
                <BigBtn color="#16A34A" onClick={handleGreenPlus} border={socialPanel ? "2px solid #15803D" : "none"}>
                  <Plus size={17} strokeWidth={2.5} color="#FFFFFF" />
                </BigBtn>
                <Divider />
                <BigBtn color="#EF4444" onClick={handleEnd}>
                  <X size={17} strokeWidth={2.5} color="#FFFFFF" />
                </BigBtn>
              </>
            )}

            {/* STATE 2 — game active */}
            {isInCall && isGameActive && (
              <>
                <DarkCtrlBtn onClick={() => { setChatOpen(!chatOpen); setGamesPanelOpen(false); }} active={chatOpen}>
                  <MessageSquare size={16} />
                </DarkCtrlBtn>
                <BigBtn color={callState === "gaming" ? (gamesPanelOpen ? "#4338CA" : "#312E81") : "#1E103A"} onClick={handleGamesButton} border={gamesPanelOpen ? "1px solid rgba(99,102,241,0.6)" : "none"} size={42} disabled={callState === "battling"}>
                  <Gamepad2 size={16} color={callState === "battling" ? "#6B7280" : "#FFFFFF"} />
                </BigBtn>
                <Divider />
                <BigBtn color="#EF4444" onClick={handleEnd}>
                  <X size={17} strokeWidth={2.5} color="#FFFFFF" />
                </BigBtn>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── CHALLENGE TOASTS ── */}
      {pendingChallenges.map((c) => (
        <motion.div key={c.id} initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.4, ease: "easeOut" }} style={{ position: "fixed", top: "16px", right: "16px", zIndex: 9999, display: "flex", alignItems: "center", gap: "10px", background: "#1a5c2a", border: `1px solid ${T.border}`, borderRadius: "10px", padding: "12px 14px", width: "256px", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(120deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01), rgba(255,255,255,0.03))", animation: "pitch-pan 12s linear infinite" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", width: "70px", height: "70px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.22)", transform: "translate(-50%, -50%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: "1px", background: "rgba(255,255,255,0.22)", transform: "translateX(-50%)", pointerEvents: "none" }} />
          <User size={16} color={T.iconInact} strokeWidth={1.6} />
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "2px", position: "relative", zIndex: 1 }}>
            <span style={{ fontSize: "13px", fontWeight: 500, color: T.textPrim, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name} · {c.game}</span>
            <span style={{ fontSize: "12px", color: T.textMid }}>wants to play</span>
          </div>
          <div style={{ display: "flex", gap: "6px", flexShrink: 0, position: "relative", zIndex: 1 }}>
            <button onClick={() => setChallenges((p) => p.map((x) => x.id === c.id ? { ...x, dismissed: true } : x))} style={{ width: "28px", height: "28px", background: "#16a34a", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px" }} title="Accept">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><polyline points="2,7 5.5,10.5 12,3.5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button onClick={() => setChallenges((p) => p.map((x) => x.id === c.id ? { ...x, dismissed: true } : x))} style={{ width: "28px", height: "28px", background: "#dc2626", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px" }} title="Decline">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><line x1="1.5" y1="1.5" x2="10.5" y2="10.5" stroke="#ffffff" strokeWidth="1.7" strokeLinecap="round"/><line x1="10.5" y1="1.5" x2="1.5" y2="10.5" stroke="#ffffff" strokeWidth="1.7" strokeLinecap="round"/></svg>
            </button>
          </div>
        </motion.div>
      ))}

      {/* ── GAME START MODAL ── */}
      {gameConfirmModal && (() => { const g = gameInfo(gameConfirmModal); return (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(15,25,35,0.60)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: "14px", padding: "20px", width: "min(300px, 90vw)", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: g ? `${g.color}18` : T.bg, border: `1.5px solid ${g ? g.color + "30" : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
                {g?.emoji ?? "🎮"}
              </div>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: T.textPrim }}>{gameConfirmModal}</p>
              <p style={{ margin: 0, fontSize: "13px", color: T.textMid, textAlign: "center" }}>Challenge {PEER.name.split(" ")[0]} to {gameConfirmModal}?</p>
            </div>
            <button onClick={handleConfirmStart} style={{ width: "100%", padding: "11px", borderRadius: "8px", border: "none", background: T.accent, color: T.bg, fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Let's play</button>
            <button onClick={() => setGameConfirmModal(null)} style={{ width: "100%", padding: "11px", borderRadius: "8px", border: "none", background: T.border, color: T.textMid, fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          </div>
        </div>
      );})()}

      {/* ── GAME SWITCH MODAL ── */}
      {gameSwitchModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(15,25,35,0.60)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: "14px", padding: "20px", width: "min(300px, 90vw)", display: "flex", flexDirection: "column", gap: "12px" }}>
            <p style={{ margin: 0, fontSize: "14px", color: T.textPrim, textAlign: "center", lineHeight: 1.5 }}>
              End <strong style={{ color: T.accent }}>{activeGameName}</strong> and start <strong style={{ color: T.textPrim }}>{gameSwitchModal}</strong>?
            </p>
            <button onClick={handleConfirmSwitch} style={{ width: "100%", padding: "11px", borderRadius: "8px", border: "none", background: "#E05555", color: "#FFFFFF", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Yes, switch</button>
            <button onClick={() => setGameSwitchModal(null)} style={{ width: "100%", padding: "11px", borderRadius: "8px", border: "none", background: T.border, color: T.textMid, fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Keep playing</button>
          </div>
        </div>
      )}
      <style>{`
        .idle-stat-card {
          cursor: pointer;
          transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease;
        }

        .idle-stat-card:hover {
          transform: translateY(-2px);
          border-color: rgba(77, 217, 192, 0.45) !important;
          box-shadow: 0 0 0 1px rgba(77, 217, 192, 0.14), 0 10px 24px rgba(77, 217, 192, 0.12);
          background: rgba(77, 217, 192, 0.11) !important;
        }

        .sidenav-click-scale:active {
          transform: scale(1.1) !important;
        }

        .campzzy-chat-input::placeholder { color: #AAAAAA; }
        @keyframes live-blink        { 0%,100%{opacity:1} 50%{opacity:0.25} }
        @keyframes challenge-toast-in{ from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pitch-pan         { 0%{transform:translateX(-6px)} 50%{transform:translateX(6px)} 100%{transform:translateX(-6px)} }
        @keyframes radar-expand      { 0%{transform:scale(0.4);opacity:0.7} 100%{transform:scale(1.8);opacity:0} }
        @keyframes radar-spin        { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes spin-slow         { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes spin-rev          { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
        @keyframes scan-bar          { 0%{width:0%;margin-left:0} 50%{width:70%;margin-left:0} 100%{width:0%;margin-left:100%} }
        @keyframes campzzy-bounce    { 0%,60%,100%{transform:translateY(0);opacity:0.7} 30%{transform:translateY(-8px);opacity:1} }
        @keyframes border-glow-pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes shake-frame       { 0%,100%{transform:translate(0,0)} 20%{transform:translate(-7px,3px)} 40%{transform:translate(7px,-3px)} 60%{transform:translate(-5px,2px)} 80%{transform:translate(5px,-2px)} }
        @keyframes slide-in-l        { from{opacity:0;transform:translateX(-80px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slide-in-r        { from{opacity:0;transform:translateX(80px)} to{opacity:1;transform:translateX(0)} }
        @keyframes logo-rush-l       { 0%{transform:scale(1) translateX(0)} 60%{transform:scale(1.15) translateX(16px)} 100%{transform:scale(1) translateX(0)} }
        @keyframes logo-rush-r       { 0%{transform:scale(1) translateX(0)} 60%{transform:scale(1.15) translateX(-16px)} 100%{transform:scale(1) translateX(0)} }
        @keyframes lightning         { 0%,100%{opacity:0} 15%,35%,55%,75%,95%{opacity:1} 25%,45%,65%,85%{opacity:0.2} }
        @keyframes vs-shake          { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-4deg) scale(1.1)} 75%{transform:rotate(4deg) scale(1.1)} }
        @keyframes countdown-pop     { 0%{opacity:0;transform:scale(0.3)} 40%{opacity:1;transform:scale(1.2)} 70%{transform:scale(0.95)} 100%{opacity:1;transform:scale(1)} }
        @keyframes particle-fly      { from{opacity:1;transform:translate(0,0) scale(1)} to{opacity:0;transform:translate(var(--tx),var(--ty)) scale(0)} }
        @keyframes celeb-in          { from{opacity:0;transform:translate(-50%,-40%) scale(0.88)} to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
        @keyframes confetti-fall     { 0%{opacity:1;transform:translateY(0) rotate(0deg)} 100%{opacity:0;transform:translateY(220px) rotate(var(--rot))} }
        @keyframes burst-pop         { 0%{transform:scale(0) translateY(0)} 50%{transform:scale(1.3) translateY(-30px)} 100%{transform:scale(1) translateY(-50px);opacity:0} }
        @keyframes chat-panel-in     { from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:translateX(0)} }
        @keyframes panel-rise        { from{opacity:0;transform:translateX(-50%) translateY(12px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes toast-in          { from{opacity:0;transform:translateX(-50%) translateY(8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes orb-drift         {
          0%, 100% { transform: translate(calc(-50% + 0px), calc(-50% + 0px)); }
          50% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))); }
        }
        @keyframes line-pulse        { 0%, 100%{stroke-opacity:0.15} 50%{stroke-opacity:0.5} }
        @keyframes line-flow         { from{stroke-dashoffset:0} to{stroke-dashoffset:-48} }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   CELEBRATION POPUP — kept intact
══════════════════════════════════════════════════════ */
function CelebrationPopup({ type, name, onClose }: { type: "social" | "pro"; name: string; onClose: () => void }) {
  const isSocial    = type === "social";
  const accentColor = isSocial ? "#28A745" : "#2563EB";
  const bgGradient  = isSocial
    ? "linear-gradient(160deg, #0a1f0f, #0d2818, #0f3a1a)"
    : "linear-gradient(160deg, #0F1923, #0F1A35, #0F1F40)";
  const title   = isSocial ? "🎊 Social Connected!" : "🤝 LinkedIn Shared!";
  const message = isSocial ? `${name} shared their social handle with you` : `${name} shared their LinkedIn with you`;
  const subtext = isSocial ? "Keep the vibe going — follow each other!" : "A new professional connection unlocked!";

  const confetti = Array.from({ length: 28 }, (_, i) => ({
    color: ["#FFC107","#28A745","#4DD9C0","#DC3545","#7C3AED","#00BCD4","#FF5722"][i % 7],
    left: `${4 + i * 3.3}%`,
    delay: `${(i * 0.08).toFixed(2)}s`,
    rot: `${-180 + Math.random() * 360}deg`,
    shape: i % 3 === 0 ? "circle" : "rect",
    size: 6 + Math.random() * 6,
    duration: `${0.8 + Math.random() * 0.6}s`,
  }));
  const bursts = isSocial ? ["🎉","🎊","🥳","✨","🎈","💚"] : ["🤝","💼","⭐","🔗","💎","🚀"];

  useEffect(() => {
    const t = setTimeout(onClose, 4500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", background: isSocial ? "transparent" : "rgba(37,99,235,0.10)" }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {confetti.map((c, i) => (
          <div key={i} style={{ position: "absolute", top: "-10px", left: c.left, width: c.shape === "circle" ? `${c.size}px` : `${c.size * 0.6}px`, height: `${c.size}px`, borderRadius: c.shape === "circle" ? "50%" : "2px", background: c.color,
            // @ts-ignore
            "--rot": c.rot, animation: `confetti-fall ${c.duration} ${c.delay} ease-in forwards` } as React.CSSProperties} />
        ))}
        {bursts.map((b, i) => (
          <div key={i} style={{ position: "absolute", top: "50%", left: `${10 + i * 14}%`, fontSize: "1.3rem", animation: `burst-pop 0.7s ${i * 0.1}s ease-out forwards`, opacity: 0 }}>{b}</div>
        ))}
      </div>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "min(360px, 85%)", background: bgGradient, border: isSocial ? `1.5px solid ${accentColor}40` : `2px solid #2563EB`, borderRadius: "24px", padding: "2rem 1.75rem 1.75rem", textAlign: "center", animation: "celeb-in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards", pointerEvents: "all" }}>
        <button onClick={onClose} style={{ position: "absolute", top: "0.75rem", right: "0.75rem", width: "28px", height: "28px", borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)" }}>
          <X size={13} strokeWidth={2.5} />
        </button>
        {isSocial ? (
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: `${accentColor}20`, border: `2.5px solid ${accentColor}50`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
            <Users size={26} color={accentColor} />
          </div>
        ) : (
          <div style={{ width: "56px", height: "56px", borderRadius: "12px", background: "#0A66C2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="white"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </div>
        )}
        <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#fff", margin: "0 0 0.35rem", letterSpacing: "-0.5px" }}>{title}</h3>
        <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "rgba(255,255,255,0.75)", margin: "0 0 0.25rem" }}>{message}</p>
        <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", fontWeight: 600, margin: "0 0 1.25rem" }}>{subtext}</p>
        <div style={{ height: "3px", borderRadius: "99px", background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`, marginBottom: "1.25rem" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, #2ABDA6)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 800, color: T.bg }}>AH</div>
          <div style={{ display: "flex", gap: "3px" }}>{[0,1,2].map((i) => <div key={i} style={{ width: "4px", height: "4px", borderRadius: "50%", background: accentColor, opacity: 0.6 + i * 0.2 }} />)}</div>
          <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: T.surfaceUp, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 800, color: T.textPrim }}>RK</div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ARENA BATTLE OVERLAY
══════════════════════════════════════════════════════ */
function ArenaBattleOverlay({ phase, countdownIdx, shake, gameLabel }: {
  phase: number; countdownIdx: number; shake: boolean; gameLabel: string;
}) {
  const particles = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2;
    const dist  = 50 + Math.random() * 70;
    return { tx: Math.cos(angle) * dist, ty: Math.sin(angle) * dist, size: 3 + Math.random() * 4, delay: Math.random() * 0.25 };
  });
  const cdLabel = countdownIdx >= 0 ? BATTLE_COUNTDOWN[countdownIdx] : "";

  return (
    <div style={{ flex: 1, position: "relative", overflow: "hidden", animation: shake ? "shake-frame 0.32s ease" : "none" }}>
      <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "50%", background: "linear-gradient(135deg, #001a3d 0%, #003580 55%, #0062cc 100%)", clipPath: "polygon(0 0, 100% 0, 87% 100%, 0 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", animation: "slide-in-l 0.55s cubic-bezier(0.22,1,0.36,1) forwards", zIndex: 2 }}>
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)", pointerEvents: "none" }} />
        <div style={{ textAlign: "center", paddingRight: "9%", animation: phase >= 1 ? "logo-rush-l 0.5s ease" : "none" }}>
          <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "rgba(0,123,255,0.15)", border: "4px solid rgba(0,123,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3.2rem", margin: "0 auto 0.875rem" }}>{ME.emoji}</div>
          <p style={{ fontSize: "1.05rem", fontWeight: 900, color: "#fff", margin: "0 0 0.3rem", letterSpacing: "-0.5px" }}>{ME.college}</p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(0,123,255,0.2)", border: "1px solid rgba(0,123,255,0.4)", borderRadius: "8px", padding: "0.28rem 0.65rem" }}>
            <Shield size={10} color="#7dd3fc" />
            <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#7dd3fc" }}>RANK #{ME.rank}</span>
          </div>
          <p style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.3)", margin: "0.45rem 0 0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>{ME.winRate}% Win Rate</p>
        </div>
      </div>
      <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "50%", background: "linear-gradient(225deg, #1a0038 0%, #3b0068 55%, #6d28d9 100%)", clipPath: "polygon(13% 0, 100% 0, 100% 100%, 0 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", animation: "slide-in-r 0.55s cubic-bezier(0.22,1,0.36,1) forwards", zIndex: 2 }}>
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)", pointerEvents: "none" }} />
        <div style={{ textAlign: "center", paddingLeft: "9%", animation: phase >= 1 ? "logo-rush-r 0.5s ease" : "none" }}>
          <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "rgba(124,58,237,0.15)", border: "4px solid rgba(124,58,237,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3.2rem", margin: "0 auto 0.875rem" }}>{PEER.emoji}</div>
          <p style={{ fontSize: "1.05rem", fontWeight: 900, color: "#fff", margin: "0 0 0.3rem", letterSpacing: "-0.5px" }}>{PEER.college}</p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)", borderRadius: "8px", padding: "0.28rem 0.65rem" }}>
            <Star size={10} color="#c4b5fd" fill="#c4b5fd" />
            <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#c4b5fd" }}>RANK #{PEER.rank}</span>
          </div>
          <p style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.3)", margin: "0.45rem 0 0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>{PEER.winRate}% Win Rate</p>
        </div>
      </div>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 20, textAlign: "center" }}>
        <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "linear-gradient(135deg, #DC3545, #7f1d1d)", border: "4px solid rgba(220,53,69,0.5)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", animation: "vs-shake 0.4s ease-in-out infinite", margin: "0 auto 0.5rem" }}>
          <Swords size={18} color="#fff" />
          <span style={{ fontSize: "0.62rem", fontWeight: 900, color: "#fff", letterSpacing: "0.06em", lineHeight: 1 }}>VS</span>
        </div>
        {phase >= 1 && (
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none", zIndex: 25 }}>
            <svg width="100" height="180" viewBox="0 0 100 180" style={{ animation: "lightning 0.12s infinite", filter: "drop-shadow(0 0 10px #FFC107)" }}>
              <polyline points="60,0 35,80 55,80 25,180" fill="none" stroke="#FFC107" strokeWidth="3" strokeLinejoin="round" />
              <polyline points="60,0 35,80 55,80 25,180" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
        )}
        {phase >= 1 && particles.map((p, i) => (
          <div key={i} style={{ position: "absolute", top: "50%", left: "50%", width: `${p.size}px`, height: `${p.size}px`, borderRadius: "50%", background: i % 3 === 0 ? "#007BFF" : i % 3 === 1 ? "#FFC107" : "#DC3545",
            // @ts-ignore
            "--tx": `${p.tx}px`, "--ty": `${p.ty}px`,
            animation: `particle-fly 0.8s ${p.delay}s ease-out forwards`, transform: "translate(-50%,-50%)", pointerEvents: "none" } as React.CSSProperties} />
        ))}
        {phase >= 2 && cdLabel && (
          <div key={cdLabel} style={{ marginTop: "0.5rem", fontSize: cdLabel === "FIGHT!" ? "2.2rem" : "3.5rem", fontWeight: 900, color: cdLabel === "FIGHT!" ? "#FFC107" : "#fff", textShadow: cdLabel === "FIGHT!" ? "0 0 35px #FFC107" : "0 0 25px rgba(255,255,255,0.5)", letterSpacing: "-1px", lineHeight: 1, animation: "countdown-pop 0.32s cubic-bezier(0.34,1.56,0.64,1) forwards", userSelect: "none" }}>
            {cdLabel}
          </div>
        )}
      </div>
      <div style={{ position: "absolute", top: "1rem", left: "50%", transform: "translateX(-50%)", zIndex: 30, whiteSpace: "nowrap" }}>
        <p style={{ fontSize: "0.62rem", fontWeight: 900, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.2em", margin: 0, textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}>⚡ College Battle · {gameLabel} ⚡</p>
      </div>
    </div>
  );
}

/* ══ Sub-components ══ */
function SideNavItem({ icon, label, active = false, onClick }: {
  icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void;
}) {
  return (
    <button onClick={onClick} style={{ width: "46px", padding: "0.55rem 0", borderRadius: "12px", background: "transparent", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.2rem", color: active ? "#FFFFFF" : "rgba(255,255,255,0.4)", transition: "color 0.2s ease, opacity 0.2s ease", opacity: active ? 1 : 0.4 }}>
      {icon}
      <span style={{ fontSize: "0.5rem", fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</span>
    </button>
  );
}

function CameraView({ videoRef, isMuted, videoOn, camError, label, style }: { videoRef: React.RefObject<HTMLVideoElement>; isMuted?: boolean; videoOn: boolean; camError: boolean; label: string; style?: React.CSSProperties; }) {
  return (
    <div style={{ background: T.bg, ...style, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <video ref={videoRef} autoPlay playsInline muted={isMuted} style={{ width: "100%", height: "100%", objectFit: "cover", display: videoOn && !camError ? "block" : "none", transform: "scaleX(-1)" }} />
      {(!videoOn || camError) && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: T.surface, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "1.1rem", fontWeight: 600, color: T.textDim }}>{label[0]}</span>
          </div>
          <p style={{ color: T.textDimmer, fontSize: "11px", fontWeight: 400, margin: 0 }}>{camError ? "Camera unavailable" : "Camera off"}</p>
        </div>
      )}
    </div>
  );
}

function PeerCameraPlaceholder({ compact = false }: { compact?: boolean }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: T.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ backgroundImage: `radial-gradient(ellipse at 50% 40%, rgba(77,217,192,0.05) 0%, transparent 65%)`, position: "absolute", inset: 0 }} />
      <div style={{ textAlign: "center" }}>
        <div style={{ width: compact ? "52px" : "80px", height: compact ? "52px" : "80px", borderRadius: "50%", background: T.surface, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.5rem", border: `2px solid ${T.border}` }}>
          <span style={{ fontSize: compact ? "1.1rem" : "1.7rem", fontWeight: 800, color: T.textDim }}>{PEER.initials}</span>
        </div>
        {!compact && <p style={{ color: T.textDimmer, fontSize: "11px", fontWeight: 400, margin: 0 }}>Camera off</p>}
      </div>
    </div>
  );
}

/* Dark (navy) control button — mic, camera, chat */
function DarkCtrlBtn({ onClick, danger = false, active = false, children }: { onClick: () => void; danger?: boolean; active?: boolean; children: React.ReactNode; }) {
  return (
    <button onClick={onClick} style={{ width: "40px", height: "40px", borderRadius: "50%", border: danger ? "1.5px solid rgba(239,68,68,0.4)" : active ? `1.5px solid rgba(77,217,192,0.35)` : "none", background: danger ? "rgba(239,68,68,0.2)" : active ? "rgba(77,217,192,0.15)" : "#1E2D40", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: danger ? "#EF4444" : active ? T.accent : "#8BA3B8", transition: "all 0.15s", flexShrink: 0 }}>
      {children}
    </button>
  );
}

function BigBtn({ onClick, color, children, size = 44, border, disabled }: { onClick: () => void; color: string; children: React.ReactNode; size?: number; border?: string; disabled?: boolean; }) {
  return (
    <button onClick={disabled ? undefined : onClick} style={{ width: `${size}px`, height: `${size}px`, borderRadius: "50%", background: color, border: border ?? "none", cursor: disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.18s", flexShrink: 0, opacity: disabled ? 0.4 : 1 }}>
      {children}
    </button>
  );
}

function Divider() {
  return <div style={{ width: "1px", height: "28px", background: "#E5E7EB", margin: "0 0.1rem", flexShrink: 0 }} />;
}

/* Floating Avatar Circle */
function FloatingAvatarCircle({ orb }: { orb: IdleOrb }) {
  const orbVisuals: Record<IdleOrb["color"], { glowA: string; glowB: string }> = {
    "#4DD9C0": {
      glowA: "rgba(77, 217, 192, 0.7)",
      glowB: "rgba(77, 217, 192, 0.3)",
    },
    "#60A5FA": {
      glowA: "rgba(96, 165, 250, 0.7)",
      glowB: "rgba(96, 165, 250, 0.3)",
    },
    "#A78BFA": {
      glowA: "rgba(167, 139, 250, 0.7)",
      glowB: "rgba(167, 139, 250, 0.3)",
    },
    "#F472B6": {
      glowA: "rgba(244, 114, 182, 0.7)",
      glowB: "rgba(244, 114, 182, 0.3)",
    },
  };
  const visual = orbVisuals[orb.color];

  return (
    <motion.div
      style={{
        position: "absolute",
        left: `${orb.x}%`,
        top: `${orb.y}%`,
        width: `${orb.size}px`,
        height: `${orb.size}px`,
        borderRadius: "50%",
        background: orb.color,
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "13px",
        fontWeight: 700,
        color: "#FFFFFF",
        transform: "translate(-50%, -50%)",
        boxShadow: `0 0 15px ${visual.glowA}, 0 0 30px ${visual.glowB}`,
      }}
      animate={{ x: [0, orb.dx, 0], y: [0, orb.dy, 0] }}
      transition={{ duration: orb.duration, delay: orb.delay, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
    >
      {orb.initials}
    </motion.div>
  );
}
