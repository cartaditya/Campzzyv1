import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  RefreshCw,
  MessageSquare,
  Plus,
  X,
  Bell,
  Info,
  Check,
  Zap,
  ChevronRight,
} from "lucide-react";
import { ConfettiEffect } from "../shared/ConfettiEffect";

const C = {
  blue: "#007BFF",
  blueDark: "#0056b3",
  green: "#28A745",
  red: "#DC3545",
  bg: "#F8F9FA",
  border: "#DEE2E6",
  text: "#212529",
  muted: "#6C757D",
  slate: "#0d1117",
  slateMid: "#161b22",
  slateLight: "#21262d",
};

function Timer() {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const m = String(Math.floor(secs / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return <>{m}:{s}</>;
}

interface GamePopup {
  id: number;
  name: string;
  game: string;
  dismissed: boolean;
}

export function VideoCallPage() {
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [showPostGame, setShowPostGame] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [blueDotAdded, setBlueDotAdded] = useState(false);
  const [greenDotAdded, setGreenDotAdded] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [popups, setPopups] = useState<GamePopup[]>([
    { id: 1, name: "Riya", game: "Chess", dismissed: false },
    { id: 2, name: "Aditya", game: "Quiz", dismissed: false },
  ]);
  const navigate = useNavigate();

  const dismissPopup = (id: number) =>
    setPopups((p) => p.map((x) => (x.id === id ? { ...x, dismissed: true } : x)));

  const handleSwitch = () => {
    navigate("/arena");
  };

  const handleEnd = () => {
    setShowPostGame(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: C.slate,
        fontFamily: "'Inter', system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      {showConfetti && <ConfettiEffect />}

      {/* ── TOP HEADER ── */}
      <header
        style={{
          height: "52px",
          background: C.slateMid,
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.25rem",
          flexShrink: 0,
          zIndex: 40,
        }}
      >
        {/* Left: Logo + Motto */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "7px",
              background: "linear-gradient(135deg, #007BFF, #0056b3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,123,255,0.4)",
            }}
          >
            <Zap size={14} color="#fff" fill="#fff" />
          </div>
          <div>
            <p
              style={{
                fontSize: "1rem",
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "-0.5px",
                margin: 0,
                lineHeight: 1,
              }}
            >
              CAMPZZY
            </p>
            <p
              style={{
                fontSize: "0.58rem",
                color: "rgba(255,255,255,0.35)",
                fontWeight: 600,
                margin: 0,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Coolest on Campus
            </p>
          </div>
        </div>

        {/* Center: Live indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              background: "rgba(220,53,69,0.15)",
              border: "1px solid rgba(220,53,69,0.3)",
              borderRadius: "6px",
              padding: "0.25rem 0.6rem",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: C.red,
                boxShadow: "0 0 0 2px rgba(220,53,69,0.3)",
                animation: "live-pulse 1.5s ease-in-out infinite",
              }}
            />
            <span style={{ fontSize: "0.7rem", fontWeight: 800, color: C.red, letterSpacing: "0.08em" }}>
              LIVE
            </span>
          </div>
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "rgba(255,255,255,0.6)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            <Timer />
          </span>
        </div>

        {/* Right: Game popups */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {popups
            .filter((p) => !p.dismissed)
            .map((popup) => (
              <div
                key={popup.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  padding: "0.3rem 0.6rem 0.3rem 0.75rem",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>
                  {popup.name} · {popup.game}
                </span>
                <button
                  onClick={() => dismissPopup(popup.id)}
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "5px",
                    background: C.blue,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Check size={12} color="#fff" strokeWidth={3} />
                </button>
              </div>
            ))}
        </div>
      </header>

      {/* ── BODY: SIDEBAR + MAIN VIDEO ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ── LEFT SIDEBAR ── */}
        <aside
          style={{
            width: "62px",
            background: C.slateMid,
            borderRight: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "1rem 0",
            flexShrink: 0,
          }}
        >
          {/* Top: Info icon */}
          <button
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.06)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "auto",
            }}
            title="Community Guidelines"
          >
            <Info size={16} color="rgba(255,255,255,0.45)" />
          </button>

          {/* Center: Vertical nav */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.25rem",
              margin: "auto 0",
            }}
          >
            {/* Roll - active */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.2rem",
                padding: "0.6rem 0.35rem",
                borderRadius: "10px",
                background: "rgba(0,123,255,0.12)",
                border: "1px solid rgba(0,123,255,0.25)",
                cursor: "pointer",
                width: "46px",
              }}
              onClick={handleSwitch}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: C.blue,
                }}
              />
              <span
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  color: C.blue,
                  letterSpacing: "0.04em",
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  transform: "rotate(180deg)",
                }}
              >
                ROLL
              </span>
            </div>

            {/* Play */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.2rem",
                padding: "0.6rem 0.35rem",
                borderRadius: "10px",
                cursor: "pointer",
                width: "46px",
                transition: "background 0.15s",
              }}
              onClick={() => navigate("/games")}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                }}
              />
              <span
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.04em",
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  transform: "rotate(180deg)",
                }}
              >
                PLAY
              </span>
            </div>
          </div>

          {/* Bottom: Profile + Bell */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.75rem",
              marginTop: "auto",
            }}
          >
            <button
              onClick={() => navigate("/profile")}
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #007BFF, #0056b3)",
                border: "2px solid rgba(255,255,255,0.15)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                fontWeight: 800,
                color: "#fff",
                boxShadow: "0 2px 8px rgba(0,123,255,0.3)",
              }}
            >
              AK
            </button>
            <button
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.06)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <Bell size={16} color="rgba(255,255,255,0.45)" />
              <div
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: C.red,
                  border: "1.5px solid #161b22",
                }}
              />
            </button>
          </div>
        </aside>

        {/* ── MAIN VIDEO AREA ── */}
        <main
          style={{
            flex: 1,
            position: "relative",
            background: C.slate,
            overflow: "hidden",
          }}
        >
          {/* Opponent video frame */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Video bg gradient */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(145deg, #1a1f2e 0%, #0d1117 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "radial-gradient(ellipse at 50% 40%, rgba(0,123,255,0.08) 0%, transparent 65%)",
              }}
            />

            {/* Opponent avatar placeholder */}
            <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #2d3748, #4a5568)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 0.75rem",
                  border: "2px solid rgba(255,255,255,0.08)",
                }}
              >
                <span style={{ fontSize: "2.2rem", fontWeight: 800, color: "rgba(255,255,255,0.7)" }}>
                  RK
                </span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem", fontWeight: 600, margin: 0 }}>
                Camera off
              </p>
            </div>

            {/* Card border overlay */}
            <div
              style={{
                position: "absolute",
                inset: "0.75rem",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "18px",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Self video - PiP top-right */}
          <div
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              width: "140px",
              height: "106px",
              background: "linear-gradient(135deg, #007BFF, #0056b3)",
              borderRadius: "14px",
              border: "2px solid rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              zIndex: 20,
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: "1.25rem", color: "#fff", fontWeight: 800 }}>You</span>
            {!videoOn && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.55)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <VideoOff size={20} color="rgba(255,255,255,0.6)" />
              </div>
            )}
          </div>

          {/* Bottom-left: Name + College overlay */}
          <div
            style={{
              position: "absolute",
              bottom: "6.5rem",
              left: "1.25rem",
              zIndex: 20,
              display: "flex",
              alignItems: "flex-end",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(12px)",
                borderRadius: "12px",
                padding: "0.55rem 0.875rem",
                boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
              }}
            >
              <p style={{ fontSize: "0.875rem", fontWeight: 800, color: "#111827", margin: 0, lineHeight: 1.2 }}>
                Rahul Kumar{" "}
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    color: C.blue,
                    background: "rgba(0,123,255,0.1)",
                    borderRadius: "4px",
                    padding: "0.1rem 0.35rem",
                    marginLeft: "0.2rem",
                  }}
                >
                  🎸 Guitarist
                </span>
              </p>
              <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "0.2rem 0 0", fontWeight: 600 }}>
                IIT Bombay · Tier 2
              </p>
            </div>
          </div>

          {/* Bottom-right: College logo circle */}
          <div
            style={{
              position: "absolute",
              bottom: "6.5rem",
              right: "1.25rem",
              zIndex: 20,
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: "#fff",
                border: "2px solid rgba(255,255,255,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
                fontSize: "1.4rem",
              }}
            >
              🎓
            </div>
          </div>

          {/* ── CONTROL BAR ── */}
          <div
            style={{
              position: "absolute",
              bottom: "1.5rem",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 30,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(255,255,255,0.97)",
                backdropFilter: "blur(20px)",
                borderRadius: "100px",
                padding: "0.6rem 1rem",
                boxShadow: "0 8px 40px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.2)",
                border: "1px solid rgba(255,255,255,0.6)",
              }}
            >
              {/* 1. Mic */}
              <CtrlBtn
                onClick={() => setMicOn(!micOn)}
                icon={micOn ? <Mic size={17} /> : <MicOff size={17} />}
                danger={!micOn}
                title={micOn ? "Mute" : "Unmute"}
              />

              {/* 2. Camera */}
              <CtrlBtn
                onClick={() => setVideoOn(!videoOn)}
                icon={videoOn ? <Video size={17} /> : <VideoOff size={17} />}
                danger={!videoOn}
                title={videoOn ? "Camera off" : "Camera on"}
              />

              {/* Thin divider */}
              <div style={{ width: "1px", height: "30px", background: "#E5E7EB", margin: "0 0.1rem" }} />

              {/* 3. Switch User — blue filled circle */}
              <button
                onClick={handleSwitch}
                title="Next / Switch User"
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "50%",
                  background: C.blue,
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  boxShadow: "0 3px 12px rgba(0,123,255,0.45)",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  flexShrink: 0,
                }}
              >
                <RefreshCw size={18} strokeWidth={2.5} />
              </button>

              {/* 4. Chat */}
              <CtrlBtn
                onClick={() => setChatOpen(!chatOpen)}
                icon={<MessageSquare size={17} />}
                active={chatOpen}
                title="Chat"
              />

              <div style={{ width: "1px", height: "30px", background: "#E5E7EB", margin: "0 0.1rem" }} />

              {/* 5. Share LinkedIn — bright blue circle */}
              <BigDot
                color="#007BFF"
                onClick={() => setBlueDotAdded(true)}
                done={blueDotAdded}
                title="Add Professional Connection"
              />

              {/* 6. Share Social — bright green circle */}
              <BigDot
                color="#28A745"
                onClick={() => setGreenDotAdded(true)}
                done={greenDotAdded}
                title="Add Social Connection"
              />

              <div style={{ width: "1px", height: "30px", background: "#E5E7EB", margin: "0 0.1rem" }} />

              {/* 7. Exit — bright red circle */}
              <button
                onClick={handleEnd}
                title="End Call"
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "50%",
                  background: C.red,
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  boxShadow: "0 3px 12px rgba(220,53,69,0.45)",
                  flexShrink: 0,
                }}
              >
                <X size={19} strokeWidth={2.5} />
              </button>
            </div>

            {/* Button labels */}
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                justifyContent: "center",
                marginTop: "0.5rem",
                paddingLeft: "1rem",
                paddingRight: "1rem",
              }}
            >
              {[
                { label: micOn ? "Mute" : "Unmute", w: 44 },
                { label: videoOn ? "Cam off" : "Cam on", w: 44 },
                { label: "", w: 8 },
                { label: "Next", w: 46 },
                { label: "Chat", w: 44 },
                { label: "", w: 8 },
                { label: blueDotAdded ? "Added" : "Pro", w: 46 },
                { label: greenDotAdded ? "Added" : "Social", w: 46 },
                { label: "", w: 8 },
                { label: "End", w: 46 },
              ].map((l, i) =>
                l.label ? (
                  <span
                    key={i}
                    style={{
                      fontSize: "0.52rem",
                      color: "rgba(255,255,255,0.35)",
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      textAlign: "center",
                      width: `${l.w}px`,
                      display: "block",
                      flexShrink: 0,
                    }}
                  >
                    {l.label}
                  </span>
                ) : (
                  <div key={i} style={{ width: `${l.w}px`, flexShrink: 0 }} />
                )
              )}
            </div>
          </div>
        </main>
      </div>

      {/* POST-GAME POPUP */}
      {showPostGame && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            backdropFilter: "blur(6px)",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "24px",
              padding: "2.5rem 2rem 2rem",
              maxWidth: "400px",
              width: "90%",
              textAlign: "center",
              boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
              animation: "popup-scale 0.35s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>🏆</div>
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: 900,
                color: "#111827",
                margin: "0 0 0.25rem",
                letterSpacing: "-0.5px",
              }}
            >
              MATCH COMPLETE!
            </h2>
            <p style={{ color: "#6B7280", fontSize: "0.85rem", margin: "0 0 1.5rem" }}>
              Here's your result
            </p>

            {/* Score */}
            <div
              style={{
                background: "#F9FAFB",
                border: "1px solid #E5E7EB",
                borderRadius: "16px",
                padding: "1.25rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{ display: "flex", justifyContent: "space-around", alignItems: "center", marginBottom: "1rem" }}
              >
                <div>
                  <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.3rem" }}>You</p>
                  <p style={{ fontSize: "2.5rem", fontWeight: 900, color: C.blue, margin: 0, lineHeight: 1 }}>147</p>
                </div>
                <span style={{ fontSize: "1rem", fontWeight: 800, color: "#D1D5DB" }}>VS</span>
                <div>
                  <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.3rem" }}>Rahul K.</p>
                  <p style={{ fontSize: "2.5rem", fontWeight: 900, color: C.red, margin: 0, lineHeight: 1 }}>132</p>
                </div>
              </div>
              <div
                style={{
                  background: "rgba(0,123,255,0.08)",
                  border: "1px solid rgba(0,123,255,0.15)",
                  borderRadius: "10px",
                  padding: "0.55rem",
                  color: C.blue,
                  fontWeight: 800,
                  fontSize: "0.88rem",
                }}
              >
                🎉 You Win! +15 pts
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
              <button
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  background: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`,
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  boxShadow: "0 4px 14px rgba(0,123,255,0.3)",
                }}
              >
                🔄 Rematch
              </button>
              <button
                onClick={() => setShowPostGame(false)}
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  background: "transparent",
                  color: C.blue,
                  border: `1.5px solid ${C.blue}`,
                  borderRadius: "12px",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Continue to Call
              </button>
              <button
                onClick={() => navigate("/arena")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#9CA3AF",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  fontFamily: "inherit",
                  padding: "0.2rem",
                }}
              >
                Exit to Arena
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes live-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes popup-scale {
          from { transform: scale(0.82); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ── Sub-components ── */

function CtrlBtn({
  onClick,
  icon,
  danger = false,
  active = false,
  title,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  danger?: boolean;
  active?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: "42px",
        height: "42px",
        borderRadius: "50%",
        border: `1.5px solid ${danger ? "rgba(220,53,69,0.25)" : active ? "rgba(0,123,255,0.25)" : "#E5E7EB"}`,
        background: danger ? "rgba(220,53,69,0.07)" : active ? "rgba(0,123,255,0.07)" : "#fff",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: danger ? "#DC3545" : active ? "#007BFF" : "#374151",
        transition: "all 0.15s",
        flexShrink: 0,
      }}
    >
      {icon}
    </button>
  );
}

function BigDot({
  color,
  onClick,
  done,
  title,
}: {
  color: string;
  onClick: () => void;
  done: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: "46px",
        height: "46px",
        borderRadius: "50%",
        background: done ? "rgba(0,0,0,0.04)" : color,
        border: done ? `2px solid ${color}` : "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: done ? color : "#fff",
        boxShadow: done ? "none" : `0 3px 12px ${color}60`,
        transition: "all 0.2s",
        flexShrink: 0,
      }}
    >
      <Plus size={19} strokeWidth={done ? 3 : 2.5} />
    </button>
  );
}
