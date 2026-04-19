import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft, Trophy, Users, Zap, RefreshCw, Gamepad2, Bell,
  LogOut, Star, Shield, Swords, X, Phone,
} from "lucide-react";
import { InCallGame } from "../arena/InCallGame";
import { NotificationsOverlay } from "../shared/NotificationsOverlay";

type PageState = "browse" | "battle" | "ingame" | "postgame";
type GameResult = "win" | "lose" | "draw";

interface GameItem {
  id: string;
  emoji: string;
  name: string;
  tag: string;
  color: string;
  players: string;
}

const C = {
  blue: "#007BFF",
  blueDark: "#0056b3",
  green: "#28A745",
  yellow: "#FFC107",
  red: "#DC3545",
  purple: "#7C3AED",
  slate: "#0d1117",
  slateMid: "#161b22",
  slateLight: "#21262d",
};

/* ── Navy/teal tokens matching arena ── */
const N = {
  bg:       "#0F1923",
  surface:  "#162030",
  border:   "#1E2D40",
  accent:   "#4DD9C0",
  textPrim: "#C8D8E0",
  textMid:  "#4A6A7A",
  iconInact:"#3A5060",
};

const GAMES: GameItem[] = [
  { id: "chess",  emoji: "♟️", name: "Chess",               tag: "Strategy", color: "#7C3AED", players: "1v1" },
  { id: "ttt",    emoji: "⭕", name: "Tic-Tac-Toe",         tag: "Classic",  color: "#007BFF", players: "1v1" },
  { id: "memory", emoji: "🃏", name: "Memory Match",         tag: "Focus",    color: "#F59E0B", players: "1v1" },
  { id: "rps",    emoji: "✊", name: "Rock Paper Scissors",  tag: "Luck",     color: "#0EA5E9", players: "1v1" },
];

const LEADERBOARD = [
  { rank: 1, name: "IIT Delhi",         emoji: "🏛️", wins: 18294, students: "42.1k", winRate: 84, delta: "+12", medal: "1st", isMe: false },
  { rank: 2, name: "IIT Bombay",        emoji: "🎓", wins: 16820, students: "38.7k", winRate: 79, delta: "+5",  medal: "2nd", isMe: false },
  { rank: 3, name: "Oxford University", emoji: "🏰", wins: 14930, students: "31.4k", winRate: 74, delta: "+8",  medal: "3rd", isMe: false },
  { rank: 4, name: "MIT Manipal",       emoji: "⚡", wins: 11200, students: "28.2k", winRate: 68, delta: "+3",  medal: null,  isMe: true  },
  { rank: 5, name: "BITS Pilani",       emoji: "📚", wins:  9803, students: "21.2k", winRate: 62, delta: "-2",  medal: null,  isMe: false },
  { rank: 6, name: "VIT Vellore",       emoji: "🎯", wins:  8541, students: "19.8k", winRate: 58, delta: "+1",  medal: null,  isMe: false },
  { rank: 7, name: "NIT Trichy",        emoji: "🔬", wins:  7220, students: "16.4k", winRate: 53, delta: "0",   medal: null,  isMe: false },
  { rank: 8, name: "DTU Delhi",         emoji: "⚙️", wins:  6105, students: "14.9k", winRate: 49, delta: "-4",  medal: null,  isMe: false },
];

const MY_COLLEGE   = LEADERBOARD[3]; // MIT Manipal
const PEER_COLLEGE = LEADERBOARD[1]; // IIT Bombay

const COUNTDOWN_SEQUENCE = ["3", "2", "1", "FIGHT!"];

export function GamesPage() {
  const navigate = useNavigate();
  const [pageState, setPageState]       = useState<PageState>("browse");
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null);
  const [gameResult, setGameResult]     = useState<GameResult | null>(null);

  const [phase, setPhase]               = useState(0);
  const [countdownIdx, setCountdownIdx] = useState(-1);
  const [shake, setShake]               = useState(false);

  const [camError, setCamError]     = useState(false);
  const [notifOpen, setNotifOpen]   = useState(false);
  const [notifSeen, setNotifSeen]   = useState(false);
  const ownVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef   = useRef<MediaStream | null>(null);

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

  useEffect(() => {
    if (pageState !== "battle") {
      setPhase(0); setCountdownIdx(-1); setShake(false);
      return;
    }
    setPhase(0); setCountdownIdx(-1);

    const t1 = setTimeout(() => setPhase(1), 900);
    const t2 = setTimeout(() => {
      setPhase(2);
      let idx = 0;
      setCountdownIdx(0);
      const doNext = () => {
        setShake(true);
        setTimeout(() => setShake(false), 350);
        idx++;
        if (idx < COUNTDOWN_SEQUENCE.length) {
          setCountdownIdx(idx);
          setTimeout(doNext, idx === COUNTDOWN_SEQUENCE.length - 1 ? 600 : 700);
        }
      };
      setTimeout(doNext, 700);
    }, 1800);
    const t3 = setTimeout(() => setPageState("ingame"), 4400);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [pageState]);

  const handleGameClick = (game: GameItem) => {
    setSelectedGame(game);
    setGameResult(null);
    setPageState("battle");
  };

  const handleGameEnd = (result: GameResult) => {
    setGameResult(result);
    setTimeout(() => setPageState("postgame"), 1200);
  };

  const handleRematch = () => {
    setGameResult(null);
    setPageState("battle");
  };

  const handleContinueCall = () => { navigate("/arena"); };
  const handleCloseAll = () => { setPageState("browse"); setSelectedGame(null); setGameResult(null); };

  return (
    <div style={{ display: "flex", height: "100vh", background: C.slate, fontFamily: "'Inter', system-ui, sans-serif", overflow: "hidden" }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: "66px", background: C.slateMid,
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "0.875rem 0", flexShrink: 0, zIndex: 30,
      }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #007BFF, #0056b3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
          <Zap size={17} color="#fff" fill="#fff" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem", width: "100%" }}>
          <SideNavItem icon={<RefreshCw size={16} />} label="Roll"  onClick={() => navigate("/arena")} />
          <SideNavItem icon={<Gamepad2 size={16} />}  label="Play"  active activeColor={C.blue} />
          <div style={{ position: "relative", margin: "0.25rem 0" }}>
            <button
              onClick={() => { setNotifOpen(!notifOpen); setNotifSeen(true); }}
              style={{ width: "46px", height: "46px", borderRadius: "12px", background: notifOpen ? "rgba(77,217,192,0.1)" : "transparent", border: notifOpen ? "1px solid rgba(77,217,192,0.25)" : "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.2rem", color: notifOpen ? "#4DD9C0" : "rgba(255,255,255,0.35)" }}
            >
              <Bell size={16} />
              <span style={{ fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>Alerts</span>
            </button>
            {!notifSeen && (
              <div style={{ position: "absolute", top: "9px", right: "9px", width: "7px", height: "7px", borderRadius: "50%", background: C.red, border: `1.5px solid ${C.slateMid}`, pointerEvents: "none" }} />
            )}
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
          <button onClick={() => navigate("/profile")} style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #007BFF, #0056b3)", border: "2px solid rgba(255,255,255,0.15)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 800, color: "#fff" }}>
            AH
          </button>
          <button onClick={() => navigate("/")} style={{ width: "40px", height: "40px", borderRadius: "12px", background: "transparent", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.15rem", color: "rgba(255,255,255,0.25)" }}>
            <LogOut size={15} />
            <span style={{ fontSize: "0.48rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>Out</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>

        {/* Top bar */}
        <header style={{ height: "48px", background: C.slateMid, borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.25rem", flexShrink: 0, zIndex: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {(pageState !== "browse") && (
              <button onClick={handleCloseAll} style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "8px", padding: "0.3rem 0.65rem", color: "rgba(255,255,255,0.55)", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                <ArrowLeft size={13} /> Back
              </button>
            )}
            <span style={{ fontSize: "0.95rem", fontWeight: 900, letterSpacing: "-0.5px", background: "linear-gradient(90deg, #4DD9C0 0%, #A855F7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>CAMPZZY</span>
            <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {pageState === "browse" ? "Game Arena" : pageState === "battle" ? "Entering Battle…" : pageState === "ingame" ? `${selectedGame?.name} · Live` : "Result"}
            </span>
          </div>
          {pageState === "ingame" && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "rgba(220,53,69,0.12)", border: "1px solid rgba(220,53,69,0.25)", borderRadius: "6px", padding: "0.2rem 0.55rem" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.red, animation: "live-blink 1.4s ease-in-out infinite" }} />
              <span style={{ fontSize: "0.65rem", fontWeight: 800, color: C.red, letterSpacing: "0.08em" }}>LIVE</span>
            </div>
          )}
        </header>

        {/* ════ BROWSE ════ */}
        {pageState === "browse" && (
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

            {/* LEFT — Leaderboard — navy/teal themed */}
            <div style={{ width: "38%", background: N.bg, borderRight: `1px solid ${N.border}`, display: "flex", flexDirection: "column", overflowY: "auto", flexShrink: 0 }}>

              {/* Header */}
              <div style={{ padding: "1rem 1.25rem 0.75rem", borderBottom: `1px solid ${N.border}`, flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.red, animation: "live-blink 1.4s ease-in-out infinite" }} />
                  <span style={{ fontSize: "0.6rem", fontWeight: 800, color: C.red, textTransform: "uppercase", letterSpacing: "0.1em" }}>Live Season #3</span>
                </div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: N.textPrim, margin: "0 0 0.1rem", letterSpacing: "-0.5px" }}>Global Leaderboard</h2>
                <p style={{ fontSize: "0.68rem", color: N.textMid, margin: 0, fontWeight: 500 }}>Updated 42 seconds ago</p>
              </div>

              {/* Podium — no container, three positions floating on navy */}
              <div style={{ padding: "1rem 1.25rem", borderBottom: `1px solid ${N.border}`, flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
                  {/* 2nd place — steel blue-navy */}
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "#93C5FD", margin: "0 0 0.3rem", lineHeight: 1.2 }}>2nd</p>
                    <p style={{ fontSize: "0.62rem", fontWeight: 600, color: "#93C5FD", margin: "0 0 0.15rem", lineHeight: 1.2 }}>{LEADERBOARD[1].name.split(" ")[0]}</p>
                    <div style={{ background: "#1E3A5F", borderRadius: "6px 6px 0 0", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#FFFFFF" }}>{LEADERBOARD[1].winRate}%</span>
                    </div>
                  </div>
                  {/* 1st place — dark gold/amber */}
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "#FDE68A", margin: "0 0 0.3rem", lineHeight: 1.2 }}>1st</p>
                    <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#FDE68A", margin: "0 0 0.15rem", lineHeight: 1.2 }}>{LEADERBOARD[0].name}</p>
                    <div style={{ background: "#854D0E", borderRadius: "8px 8px 0 0", height: "46px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#FFFFFF" }}>{LEADERBOARD[0].winRate}%</span>
                    </div>
                  </div>
                  {/* 3rd place — dark bronze */}
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "#FCA5A5", margin: "0 0 0.3rem", lineHeight: 1.2 }}>3rd</p>
                    <p style={{ fontSize: "0.62rem", fontWeight: 600, color: "#FCA5A5", margin: "0 0 0.15rem", lineHeight: 1.2 }}>{LEADERBOARD[2].name.split(" ")[0]}</p>
                    <div style={{ background: "#3B1F1F", borderRadius: "6px 6px 0 0", height: "22px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#FFFFFF" }}>{LEADERBOARD[2].winRate}%</span>
                    </div>
                  </div>
                </div>
                {/* Champion stats */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "0.75rem" }}>
                  {[{ label: "Total Wins", val: "18,294" }, { label: "Active Users", val: "42.1k" }].map((s) => (
                    <div key={s.label} style={{ background: N.surface, border: `1px solid ${N.border}`, borderRadius: "8px", padding: "0.45rem 0.6rem" }}>
                      <p style={{ fontSize: "0.82rem", fontWeight: 800, color: N.textPrim, margin: 0, lineHeight: 1 }}>{s.val}</p>
                      <p style={{ fontSize: "0.58rem", color: N.textMid, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0.2rem 0 0" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filter tabs — underline style */}
              <div style={{ padding: "0.6rem 1.25rem", display: "flex", gap: "0", borderBottom: `1px solid ${N.border}`, flexShrink: 0 }}>
                {["All Institutions", "Ivy League", "Public Universities"].map((t, i) => (
                  <button
                    key={t}
                    style={{
                      padding: "0.4rem 0.75rem",
                      border: "none", borderBottom: i === 0 ? `2px solid ${N.accent}` : "2px solid transparent",
                      background: "transparent",
                      color: i === 0 ? N.textPrim : N.textMid,
                      fontSize: "0.65rem", fontWeight: i === 0 ? 700 : 500,
                      cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
                      transition: "color 0.15s",
                    }}
                  >{t}</button>
                ))}
              </div>

              {/* Table header */}
              <div style={{ display: "grid", gridTemplateColumns: "36px 1fr 70px 56px", padding: "0.5rem 1.25rem", borderBottom: `1px solid rgba(30,45,64,0.5)`, flexShrink: 0 }}>
                {["#", "College", "Win Rate", "Wins"].map((h) => (
                  <span key={h} style={{ fontSize: "0.58rem", fontWeight: 700, color: N.iconInact, textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</span>
                ))}
              </div>

              {/* Rows — no emoji, teal win bars, navy text */}
              <div>
                {LEADERBOARD.map((entry) => (
                  <div key={entry.rank} style={{ display: "grid", gridTemplateColumns: "36px 1fr 70px 56px", padding: "0.65rem 1.25rem", borderBottom: `1px solid rgba(30,45,64,0.4)`, background: entry.isMe ? "rgba(77,217,192,0.05)" : "transparent", alignItems: "center", position: "relative" }}>
                    {entry.isMe && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "2px", background: N.accent }} />}
                    <div>
                      {entry.rank === 1 ? <span style={{ fontSize: "1rem" }}>🥇</span>
                        : entry.rank === 2 ? <span style={{ fontSize: "1rem" }}>🥈</span>
                        : entry.rank === 3 ? <span style={{ fontSize: "1rem" }}>🥉</span>
                        : <span style={{ fontSize: "0.78rem", fontWeight: 700, color: N.iconInact }}>{entry.rank}</span>
                      }
                    </div>
                    <div>
                      <p style={{ fontSize: "0.78rem", fontWeight: 600, color: entry.isMe ? N.accent : N.textPrim, margin: 0, lineHeight: 1.2 }}>{entry.name}</p>
                      {entry.isMe && <span style={{ fontSize: "0.55rem", color: N.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Your College</span>}
                    </div>
                    <div>
                      <div style={{ height: "4px", background: "rgba(30,45,64,0.8)", borderRadius: "99px", overflow: "hidden", marginBottom: "0.2rem" }}>
                        <div style={{ height: "100%", width: `${entry.winRate}%`, background: N.accent, borderRadius: "99px" }} />
                      </div>
                      <span style={{ fontSize: "0.58rem", color: N.textMid, fontWeight: 600 }}>{entry.winRate}%</span>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.78rem", fontWeight: 700, color: entry.isMe ? N.accent : N.textPrim, margin: 0, lineHeight: 1.2 }}>{entry.wins.toLocaleString()}</p>
                      <span style={{ fontSize: "0.55rem", fontWeight: 700, color: entry.delta.startsWith("+") ? C.green : entry.delta === "0" ? N.iconInact : C.red }}>{entry.delta}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ padding: "0.6rem 1.25rem", borderTop: `1px solid ${N.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                <span style={{ fontSize: "0.62rem", color: N.textMid, fontWeight: 500 }}>Showing 1–8 of 460 colleges</span>
                <div style={{ display: "flex", gap: "0.25rem" }}>
                  {[1, 2, 3].map((p) => (
                    <button key={p} style={{ width: "22px", height: "22px", borderRadius: "6px", border: `1px solid ${N.border}`, background: p === 1 ? N.surface : "transparent", color: p === 1 ? N.accent : N.textMid, fontSize: "0.65rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{p}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — Games grid */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ padding: "0.875rem 1.25rem 0.6rem", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ fontSize: "1rem", fontWeight: 900, color: "#fff", margin: "0 0 0.1rem", letterSpacing: "-0.3px" }}>Pick Your Game</h3>
                    <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", margin: 0, fontWeight: 600 }}>Challenge a random opponent from any college</p>
                  </div>
                  {/* Online counter — plain text, no pill, no dot */}
                  <span style={{ fontSize: "12px", fontWeight: 400, color: N.textMid }}>1,247 online</span>
                </div>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.25rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.875rem" }}>
                  {GAMES.map((game) => (
                    <button
                      key={game.id}
                      onClick={() => handleGameClick(game)}
                      style={{ background: C.slateLight, border: "1px solid rgba(255,255,255,0.06)", borderRadius: "18px", padding: "1.1rem 0.75rem 0.9rem", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.55rem", fontFamily: "inherit", transition: "all 0.18s", position: "relative", overflow: "hidden" }}
                      onMouseEnter={(e) => {
                        const b = e.currentTarget as HTMLButtonElement;
                        b.style.background = `${game.color}18`;
                        b.style.borderColor = `${game.color}40`;
                        b.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        const b = e.currentTarget as HTMLButtonElement;
                        b.style.background = C.slateLight;
                        b.style.borderColor = "rgba(255,255,255,0.06)";
                        b.style.transform = "translateY(0)";
                      }}
                    >
                      {/* Icon — flat, no glow/shadow */}
                      <div style={{ width: "58px", height: "58px", borderRadius: "16px", background: `${game.color}18`, border: `1.5px solid ${game.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem" }}>
                        {game.emoji}
                      </div>
                      <p style={{ fontSize: "0.78rem", fontWeight: 800, color: "#fff", margin: 0, textAlign: "center", lineHeight: 1.3 }}>{game.name}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <span style={{ fontSize: "0.58rem", fontWeight: 700, color: game.color, background: `${game.color}15`, borderRadius: "4px", padding: "0.1rem 0.35rem" }}>{game.tag}</span>
                        <span style={{ fontSize: "0.58rem", fontWeight: 600, color: "rgba(255,255,255,0.25)" }}>{game.players}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ BATTLE ════ */}
        {pageState === "battle" && selectedGame && (
          <BattleScreen game={selectedGame} phase={phase} countdownIdx={countdownIdx} shake={shake} />
        )}

        {/* ════ IN-GAME ════ */}
        {(pageState === "ingame" || pageState === "postgame") && (
          <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
            <div style={{ width: "34%", display: "flex", flexDirection: "column", borderRight: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
              <div style={{ flex: 1, position: "relative", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "#111827" }}>
                <PeerCameraPlaceholder compact />
                <div style={{ position: "absolute", bottom: "0.5rem", left: "0.5rem", zIndex: 10 }}>
                  <span style={{ background: "rgba(255,255,255,0.85)", borderRadius: "6px", padding: "0.2rem 0.5rem", fontSize: "0.65rem", fontWeight: 700, color: "#111" }}>
                    {PEER_COLLEGE.emoji} {PEER_COLLEGE.name.split(" ")[0]}
                  </span>
                </div>
                <div style={{ position: "absolute", top: "0.5rem", right: "0.5rem", zIndex: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "rgba(124,58,237,0.8)", borderRadius: "6px", padding: "0.2rem 0.5rem" }}>
                    <Star size={9} color="#fff" fill="#fff" />
                    <span style={{ fontSize: "0.6rem", fontWeight: 800, color: "#fff" }}>#{PEER_COLLEGE.rank}</span>
                  </div>
                </div>
              </div>
              <div style={{ flex: 1, position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, background: "#111827", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <video ref={ownVideoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", display: !camError ? "block" : "none", transform: "scaleX(-1)" }} />
                  {camError && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "linear-gradient(135deg, #374151, #4B5563)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "rgba(255,255,255,0.6)" }}>A</span>
                      </div>
                      <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.65rem", fontWeight: 600, margin: 0 }}>Camera off</p>
                    </div>
                  )}
                </div>
                <div style={{ position: "absolute", bottom: "0.5rem", left: "0.5rem", zIndex: 10 }}>
                  <span style={{ background: "rgba(0,123,255,0.85)", borderRadius: "6px", padding: "0.2rem 0.5rem", fontSize: "0.65rem", fontWeight: 700, color: "#fff" }}>
                    {MY_COLLEGE.emoji} You
                  </span>
                </div>
                <div style={{ position: "absolute", top: "0.5rem", right: "0.5rem", zIndex: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "rgba(0,123,255,0.8)", borderRadius: "6px", padding: "0.2rem 0.5rem" }}>
                    <Shield size={9} color="#fff" />
                    <span style={{ fontSize: "0.6rem", fontWeight: 800, color: "#fff" }}>#{MY_COLLEGE.rank}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ flex: 1, overflow: "hidden" }}>
              <InCallGame onGameEnd={handleGameEnd} />
            </div>

            {pageState === "postgame" && gameResult && (
              <PostGameModal
                result={gameResult}
                game={selectedGame!}
                onRematch={handleRematch}
                onContinueCall={handleContinueCall}
                onClose={handleCloseAll}
              />
            )}
          </div>
        )}
      </div>

      {/* Global notifications overlay */}
      <NotificationsOverlay open={notifOpen} onClose={() => setNotifOpen(false)} />

      <style>{`
        @keyframes live-blink    { 0%,100%{opacity:1} 50%{opacity:0.25} }
        @keyframes shake-frame   { 0%,100%{transform:translate(0,0)} 20%{transform:translate(-8px,4px)} 40%{transform:translate(8px,-4px)} 60%{transform:translate(-6px,2px)} 80%{transform:translate(6px,-2px)} }
        @keyframes slide-left    { from{opacity:0;transform:translateX(-80px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slide-right   { from{opacity:0;transform:translateX(80px)}  to{opacity:1;transform:translateX(0)} }
        @keyframes logo-rush-l   { 0%{transform:scale(1) translateX(0)} 60%{transform:scale(1.15) translateX(18px)} 100%{transform:scale(1) translateX(0)} }
        @keyframes logo-rush-r   { 0%{transform:scale(1) translateX(0)} 60%{transform:scale(1.15) translateX(-18px)} 100%{transform:scale(1) translateX(0)} }
        @keyframes clash-burst   { 0%{opacity:0;transform:scale(0.5)} 30%{opacity:1;transform:scale(1.3)} 60%{opacity:1;transform:scale(1)} 100%{opacity:0.8;transform:scale(1)} }
        @keyframes lightning     { 0%,100%{opacity:0} 10%,30%,50%,70%,90%{opacity:1} 20%,40%,60%,80%{opacity:0.3} }
        @keyframes countdown-pop { 0%{opacity:0;transform:scale(0.4)} 40%{opacity:1;transform:scale(1.15)} 70%{transform:scale(0.95)} 100%{opacity:1;transform:scale(1)} }
        @keyframes particle-fly  { from{opacity:1;transform:translate(0,0) scale(1)} to{opacity:0;transform:translate(var(--tx),var(--ty)) scale(0)} }
        @keyframes scanline      { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes modal-in      { from{opacity:0;transform:translate(-50%,-46%) scale(0.92)} to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
        @keyframes vs-shake      { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-4deg) scale(1.1)} 75%{transform:rotate(4deg) scale(1.1)} }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   BATTLE SCREEN
══════════════════════════════════════════════════════ */
function BattleScreen({
  game, phase, countdownIdx, shake,
}: {
  game: GameItem;
  phase: number;
  countdownIdx: number;
  shake: boolean;
}) {
  const particles = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const dist  = 60 + Math.random() * 80;
    return { tx: Math.cos(angle) * dist, ty: Math.sin(angle) * dist, size: 3 + Math.random() * 5, delay: Math.random() * 0.3 };
  });

  const cdLabel = countdownIdx >= 0 ? COUNTDOWN_SEQUENCE[countdownIdx] : "";

  return (
    <div style={{ flex: 1, position: "relative", overflow: "hidden", animation: shake ? "shake-frame 0.35s ease" : "none" }}>
      <div style={{
        position: "absolute", top: 0, left: 0, bottom: 0, width: "50%",
        background: "linear-gradient(135deg, #001a3d 0%, #003580 60%, #0056b3 100%)",
        clipPath: "polygon(0 0, 100% 0, 88% 100%, 0 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        animation: "slide-left 0.6s cubic-bezier(0.22,1,0.36,1) forwards", zIndex: 2,
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")", opacity: 0.5, pointerEvents: "none" }} />
        <div style={{ textAlign: "center", paddingRight: "8%", animation: phase >= 1 ? "logo-rush-l 0.5s ease" : "none" }}>
          <div style={{ width: "110px", height: "110px", borderRadius: "50%", background: "rgba(0,123,255,0.15)", border: "4px solid rgba(0,123,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3.5rem", margin: "0 auto 1rem" }}>
            {MY_COLLEGE.emoji}
          </div>
          <p style={{ fontSize: "1.15rem", fontWeight: 900, color: "#fff", margin: "0 0 0.3rem", letterSpacing: "-0.5px", textShadow: "0 0 20px rgba(0,123,255,0.8)" }}>
            {MY_COLLEGE.name}
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(0,123,255,0.2)", border: "1px solid rgba(0,123,255,0.4)", borderRadius: "8px", padding: "0.3rem 0.7rem" }}>
            <Shield size={11} color="#7dd3fc" />
            <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#7dd3fc" }}>RANK #{MY_COLLEGE.rank}</span>
          </div>
          <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", margin: "0.5rem 0 0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {MY_COLLEGE.winRate}% Win Rate
          </p>
        </div>
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)", pointerEvents: "none" }} />
      </div>

      <div style={{
        position: "absolute", top: 0, right: 0, bottom: 0, width: "50%",
        background: "linear-gradient(225deg, #1a0038 0%, #3b0068 60%, #6d28d9 100%)",
        clipPath: "polygon(12% 0, 100% 0, 100% 100%, 0 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        animation: "slide-right 0.6s cubic-bezier(0.22,1,0.36,1) forwards", zIndex: 2,
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")", opacity: 0.5, pointerEvents: "none" }} />
        <div style={{ textAlign: "center", paddingLeft: "8%", animation: phase >= 1 ? "logo-rush-r 0.5s ease" : "none" }}>
          <div style={{ width: "110px", height: "110px", borderRadius: "50%", background: "rgba(124,58,237,0.15)", border: "4px solid rgba(124,58,237,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3.5rem", margin: "0 auto 1rem" }}>
            {PEER_COLLEGE.emoji}
          </div>
          <p style={{ fontSize: "1.15rem", fontWeight: 900, color: "#fff", margin: "0 0 0.3rem", letterSpacing: "-0.5px", textShadow: "0 0 20px rgba(124,58,237,0.8)" }}>
            {PEER_COLLEGE.name}
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)", borderRadius: "8px", padding: "0.3rem 0.7rem" }}>
            <Star size={11} color="#c4b5fd" fill="#c4b5fd" />
            <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#c4b5fd" }}>RANK #{PEER_COLLEGE.rank}</span>
          </div>
          <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", margin: "0.5rem 0 0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {PEER_COLLEGE.winRate}% Win Rate
          </p>
        </div>
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)", pointerEvents: "none" }} />
      </div>

      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 20, textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)", border: `1px solid ${game.color}50`, borderRadius: "100px", padding: "0.3rem 0.9rem", marginBottom: "1rem", justifyContent: "center", whiteSpace: "nowrap" }}>
          <span style={{ fontSize: "0.85rem" }}>{game.emoji}</span>
          <span style={{ fontSize: "0.7rem", fontWeight: 800, color: game.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{game.name}</span>
        </div>
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #DC3545, #7f1d1d)", border: "4px solid rgba(220,53,69,0.5)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", animation: "vs-shake 0.4s ease-in-out infinite", margin: "0 auto 0.75rem" }}>
          <Swords size={20} color="#fff" />
          <span style={{ fontSize: "0.65rem", fontWeight: 900, color: "#fff", letterSpacing: "0.08em", lineHeight: 1 }}>VS</span>
        </div>
        {phase >= 1 && (
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 25, pointerEvents: "none" }}>
            <svg width="120" height="200" viewBox="0 0 120 200" style={{ animation: "lightning 0.1s infinite", filter: "drop-shadow(0 0 12px #FFC107)" }}>
              <polyline points="70,0 40,90 65,90 30,200" fill="none" stroke="#FFC107" strokeWidth="3" strokeLinejoin="round" />
              <polyline points="70,0 40,90 65,90 30,200" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
        )}
        {phase >= 1 && particles.map((p, i) => (
          <div key={i} style={{
            position: "absolute", top: "50%", left: "50%",
            width: `${p.size}px`, height: `${p.size}px`, borderRadius: "50%",
            background: i % 3 === 0 ? "#007BFF" : i % 3 === 1 ? "#FFC107" : "#DC3545",
            // @ts-ignore
            "--tx": `${p.tx}px`, "--ty": `${p.ty}px`,
            animation: `particle-fly 0.8s ${p.delay}s ease-out forwards`,
            transform: "translate(-50%, -50%)", pointerEvents: "none",
          } as React.CSSProperties} />
        ))}
        {phase >= 2 && cdLabel && (
          <div key={cdLabel} style={{
            marginTop: "0.75rem",
            fontSize: cdLabel === "FIGHT!" ? "2.5rem" : "4rem",
            fontWeight: 900,
            color: cdLabel === "FIGHT!" ? "#FFC107" : "#fff",
            textShadow: cdLabel === "FIGHT!" ? "0 0 40px #FFC107, 0 0 80px #FFC10750" : "0 0 30px rgba(255,255,255,0.5)",
            letterSpacing: "-1px", lineHeight: 1,
            animation: "countdown-pop 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards",
            userSelect: "none",
          }}>
            {cdLabel}
          </div>
        )}
      </div>

      <div style={{ position: "absolute", top: "1.25rem", left: "50%", transform: "translateX(-50%)", zIndex: 30, textAlign: "center", whiteSpace: "nowrap" }}>
        <p style={{ fontSize: "0.65rem", fontWeight: 900, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.2em", margin: 0, textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}>
          ⚡ College Battle · {game.name} ⚡
        </p>
      </div>

      <div style={{ position: "absolute", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)", zIndex: 30, display: "flex", alignItems: "center", gap: "1.5rem", whiteSpace: "nowrap" }}>
        <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#7dd3fc", textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}>#{MY_COLLEGE.rank} {MY_COLLEGE.name}</span>
        <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
        <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#c4b5fd", textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}>#{PEER_COLLEGE.rank} {PEER_COLLEGE.name}</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   POST-GAME MODAL
══════════════════════════════════════════════════════ */
function PostGameModal({
  result, game, onRematch, onContinueCall, onClose,
}: {
  result: GameResult;
  game: GameItem;
  onRematch: () => void;
  onContinueCall: () => void;
  onClose: () => void;
}) {
  const isWin  = result === "win";
  const isDraw = result === "draw";

  const titleText  = isWin ? "VICTORY!" : isDraw ? "DRAW!" : "DEFEAT";
  const titleColor = isWin ? "#FFC107" : isDraw ? "#007BFF" : "#DC3545";
  const titleGlow  = isWin ? "rgba(255,193,7,0.7)" : isDraw ? "rgba(0,123,255,0.6)" : "rgba(220,53,69,0.6)";
  const bigEmoji   = isWin ? "🏆" : isDraw ? "🤝" : "💀";
  const subtitle   = isWin ? `${MY_COLLEGE.name} dominates!` : isDraw ? "An honourable stalemate." : `${PEER_COLLEGE.name} wins this round.`;

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.82)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}>
      <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.5)", zIndex: 60 }} title="End game">
        <X size={16} strokeWidth={2.5} />
      </button>

      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: "min(420px, 90%)",
        background: "linear-gradient(160deg, #1a1f2e, #0d1117)",
        border: `1px solid ${titleColor}30`, borderRadius: "28px",
        padding: "2.5rem 2rem 2rem", textAlign: "center",
        animation: "modal-in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        <div style={{ position: "absolute", top: "-40px", left: "50%", transform: "translateX(-50%)", width: "200px", height: "200px", borderRadius: "50%", background: `radial-gradient(${titleGlow}30, transparent 70%)`, filter: "blur(20px)", pointerEvents: "none" }} />
        <div style={{ fontSize: "4rem", lineHeight: 1, marginBottom: "0.75rem" }}>{bigEmoji}</div>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 900, margin: "0 0 0.25rem", letterSpacing: "-1.5px", lineHeight: 1, color: titleColor, textShadow: `0 0 30px ${titleGlow}` }}>
          {titleText}
        </h1>
        <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", fontWeight: 600, margin: "0 0 1.5rem" }}>{subtitle}</p>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "0.875rem 1rem", marginBottom: "1.75rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>{MY_COLLEGE.emoji}</div>
            <p style={{ fontSize: "0.72rem", fontWeight: 800, color: isWin ? "#7dd3fc" : "rgba(255,255,255,0.4)", margin: 0 }}>{MY_COLLEGE.name.split(" ")[0]}</p>
            <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.25)", fontWeight: 600, margin: "0.1rem 0 0" }}>#{MY_COLLEGE.rank}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.3rem", fontWeight: 900, color: isWin ? titleColor : "rgba(255,255,255,0.3)" }}>{isWin ? "3" : isDraw ? "2" : "1"}</span>
              <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.2)", fontWeight: 700 }}>:</span>
              <span style={{ fontSize: "1.3rem", fontWeight: 900, color: !isWin && !isDraw ? "#DC3545" : "rgba(255,255,255,0.3)" }}>{!isWin && !isDraw ? "3" : isDraw ? "2" : "1"}</span>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", background: `${game.color}18`, border: `1px solid ${game.color}35`, borderRadius: "6px", padding: "0.15rem 0.5rem" }}>
              <span style={{ fontSize: "0.75rem" }}>{game.emoji}</span>
              <span style={{ fontSize: "0.6rem", fontWeight: 800, color: game.color }}>{game.name}</span>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>{PEER_COLLEGE.emoji}</div>
            <p style={{ fontSize: "0.72rem", fontWeight: 800, color: !isWin && !isDraw ? "#c4b5fd" : "rgba(255,255,255,0.4)", margin: 0 }}>{PEER_COLLEGE.name.split(" ")[0]}</p>
            <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.25)", fontWeight: 600, margin: "0.1rem 0 0" }}>#{PEER_COLLEGE.rank}</p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <button onClick={onRematch} style={{ width: "100%", padding: "0.875rem", borderRadius: "14px", border: "none", background: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`, color: "#fff", fontSize: "0.9rem", fontWeight: 800, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", letterSpacing: "0.02em" }}>
            <RefreshCw size={16} strokeWidth={2.5} /> REMATCH
          </button>
          <button onClick={onContinueCall} style={{ width: "100%", padding: "0.875rem", borderRadius: "14px", border: "1px solid rgba(40,167,69,0.35)", background: "rgba(40,167,69,0.1)", color: "#4ade80", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <Phone size={15} /> Continue to Call
          </button>
          <button onClick={onClose} style={{ width: "100%", padding: "0.6rem", borderRadius: "10px", border: "none", background: "transparent", color: "rgba(255,255,255,0.2)", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            End Session
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */
function SideNavItem({ icon, label, active = false, activeColor = "#007BFF", onClick }: {
  icon: React.ReactNode; label: string; active?: boolean; activeColor?: string; onClick?: () => void;
}) {
  return (
    <button onClick={onClick} style={{ width: "46px", padding: "0.55rem 0", borderRadius: "12px", background: active ? `${activeColor}18` : "transparent", border: active ? `1px solid ${activeColor}35` : "1px solid transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.2rem", color: active ? activeColor : "rgba(255,255,255,0.32)", transition: "all 0.15s" }}>
      {icon}
      <span style={{ fontSize: "0.5rem", fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</span>
    </button>
  );
}

function PeerCameraPlaceholder({ compact = false }: { compact?: boolean }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(145deg, #1a1f2e, #0d1117)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ backgroundImage: "radial-gradient(ellipse at 50% 40%, rgba(124,58,237,0.08) 0%, transparent 65%)", position: "absolute", inset: 0 }} />
      <div style={{ position: "relative", textAlign: "center" }}>
        <div style={{ width: compact ? "48px" : "72px", height: compact ? "48px" : "72px", borderRadius: "50%", background: "linear-gradient(135deg, #2d3748, #4a5568)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.4rem", border: "2px solid rgba(255,255,255,0.08)" }}>
          <span style={{ fontSize: compact ? "1rem" : "1.5rem" }}>{PEER_COLLEGE.emoji}</span>
        </div>
        {!compact && <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.65rem", fontWeight: 600, margin: 0 }}>Camera off</p>}
      </div>
    </div>
  );
}
