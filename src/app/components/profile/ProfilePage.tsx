import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft, Trophy, CheckCircle, Star, Award, Zap, Target,
  TrendingUp, Users, Shield, Heart, Plus, X,
} from "lucide-react";

const C = {
  blue: "#007BFF",
  blueDark: "#0056b3",
  green: "#28A745",
  yellow: "#FFC107",
  red: "#DC3545",
  bg: "#F8F9FA",
  border: "#DEE2E6",
  text: "#212529",
  muted: "#6C757D",
  subtle: "#495057",
  accent: "#4DD9C0",
  navy: "#162030",
  navyBorder: "#1E2D40",
  navyText: "#C8D8E0",
  navyMid: "#4A6A7A",
};

/* ── Initial profile data ── */
const INIT_COLLEGE  = "MIT Manipal";
const INIT_DEPT     = "Computer Science";
const INIT_YEAR     = "3rd Year";
const INIT_TIER     = "Tier 2";  // stored but hidden if college is set
const INIT_FLAIRS   = ["Vibe Coder", "Guitarist", "Coffee Addict"];
const INIT_ACTIVE   = "Vibe Coder";

export function ProfilePage() {
  const navigate = useNavigate();

  /* ─ profile data ─ */
  const [college]  = useState(INIT_COLLEGE);
  const [dept]     = useState(INIT_DEPT);
  const [year]     = useState(INIT_YEAR);
  const [tier]     = useState(INIT_TIER);

  /* ─ flair library ─ */
  const [flairLibrary, setFlairLibrary] = useState<string[]>(INIT_FLAIRS);
  const [activeFlair, setActiveFlair]   = useState<string | null>(INIT_ACTIVE);

  /* ─ social IDs ─ */
  const [linkedinId, setLinkedinId]         = useState("");
  const [otherSocialsId, setOtherSocialsId] = useState("");

  /* ─ add-flair modal ─ */
  const [modalOpen, setModalOpen]   = useState(false);
  const [flairInput, setFlairInput] = useState("");

  const handleFlairTileClick = (flair: string) => {
    if (activeFlair === flair) {
      setActiveFlair(null); // deactivate on second tap
    } else {
      setActiveFlair(flair);
    }
  };

  const handleAddFlair = () => {
    const trimmed = flairInput.trim();
    if (!trimmed) return;
    if (flairLibrary.length >= 5) return;
    const updated = [...flairLibrary, trimmed];
    setFlairLibrary(updated);
    if (!activeFlair) setActiveFlair(trimmed); // auto-select if none active
    setFlairInput("");
    setModalOpen(false);
  };

  /* ─ College/tier display logic ─
     If college present → show "College · Dept · Year"
     Else if tier present → show tier
     Else → show nothing                               */
  const identityLine = college
    ? `${college} · ${dept} · ${year}`
    : tier
    ? tier
    : null;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Top Bar ── */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${C.border}`, padding: "0 1.25rem", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 30 }}>
        <button onClick={() => navigate("/arena")} style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "none", border: "none", cursor: "pointer", color: C.subtle, fontWeight: 700, fontSize: "0.85rem", fontFamily: "inherit" }}>
          <ArrowLeft size={16} /> Back
        </button>
        <span style={{ fontSize: "1rem", fontWeight: 800, color: C.text }}>My Profile</span>
        <div style={{ width: "60px" }} />
      </div>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "1.5rem 1rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* ── Profile Hero ── */}
        <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: "20px", padding: "1.75rem", display: "flex", alignItems: "flex-start", gap: "1.25rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          {/* Avatar */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{ width: "84px", height: "84px", borderRadius: "50%", background: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", fontWeight: 900, color: "#fff" }}>
              AH
            </div>
            <div style={{ position: "absolute", bottom: -4, right: -4, background: "linear-gradient(135deg, #FFB800, #FF8C00)", borderRadius: "50%", width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff", fontSize: "0.7rem" }}>
              🏆
            </div>
          </div>

          <div style={{ flex: 1 }}>
            {/* Name + active flair */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem", flexWrap: "wrap" }}>
              <h1 style={{ fontSize: "1.3rem", fontWeight: 900, color: C.text, margin: 0 }}>Aditya Harsora</h1>
              <CheckCircle size={16} color={C.blue} fill={C.blue} style={{ flexShrink: 0 }} />
              {activeFlair && (
                <span style={{ fontSize: "0.72rem", fontWeight: 600, color: C.accent, background: "rgba(77,217,192,0.08)", border: "1px solid rgba(77,217,192,0.25)", borderRadius: "6px", padding: "0.15rem 0.55rem" }}>
                  ⚡ {activeFlair}
                </span>
              )}
            </div>

            {/* College / tier identity line */}
            {identityLine && (
              <p style={{ color: "#4A6A7A", fontSize: "13px", margin: "0 0 0.75rem", fontWeight: 500 }}>
                {identityLine}
              </p>
            )}

            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <span style={{ background: "rgba(40,167,69,0.08)", border: `1px solid rgba(40,167,69,0.2)`, borderRadius: "6px", padding: "0.2rem 0.6rem", fontSize: "0.72rem", fontWeight: 700, color: C.green }}>
                Verified Student
              </span>
              <span style={{ background: "rgba(255,193,7,0.12)", border: `1px solid rgba(255,193,7,0.3)`, borderRadius: "6px", padding: "0.2rem 0.6rem", fontSize: "0.72rem", fontWeight: 700, color: "#856404" }}>
                🔥 Win Streak: 4
              </span>
            </div>
          </div>
        </div>

        {/* ── Verify Banner ── */}
        <button onClick={() => navigate("/verify")} style={{ background: `linear-gradient(135deg, ${C.yellow}, #FF8C00)`, border: "none", borderRadius: "16px", padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", width: "100%", boxShadow: "0 4px 16px rgba(255,193,7,0.35)", fontFamily: "inherit" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Award size={20} color="#fff" />
            </div>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: "0.9rem", fontWeight: 800, color: "#fff", margin: 0 }}>Verify Your College Identity</p>
              <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.85)", margin: 0, fontWeight: 600 }}>Use your official college email to unlock all features</p>
            </div>
          </div>
          <span style={{ color: "#fff", fontWeight: 900, fontSize: "1.1rem" }}>→</span>
        </button>

        {/* ── Connections Grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: "16px", padding: "1.25rem", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(0,123,255,0.08)", border: `1px solid rgba(0,123,255,0.15)`, margin: "0 auto 0.75rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users size={22} color={C.blue} />
            </div>
            <p style={{ fontSize: "2rem", fontWeight: 900, color: C.blue, margin: "0 0 0.15rem", lineHeight: 1 }}>48</p>
            <p style={{ fontSize: "0.72rem", color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>Professional<br />Connections</p>
            <div style={{ marginTop: "0.75rem", background: "rgba(0,123,255,0.06)", borderRadius: "8px", padding: "0.3rem", fontSize: "0.65rem", color: C.blue, fontWeight: 700 }}>Blue Dots ●</div>
          </div>

          <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: "16px", padding: "1.25rem", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(40,167,69,0.08)", border: `1px solid rgba(40,167,69,0.15)`, margin: "0 auto 0.75rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Heart size={22} color={C.green} />
            </div>
            <p style={{ fontSize: "2rem", fontWeight: 900, color: C.green, margin: "0 0 0.15rem", lineHeight: 1 }}>127</p>
            <p style={{ fontSize: "0.72rem", color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>Social<br />Connections</p>
            <div style={{ marginTop: "0.75rem", background: "rgba(40,167,69,0.06)", borderRadius: "8px", padding: "0.3rem", fontSize: "0.65rem", color: C.green, fontWeight: 700 }}>Green Dots ●</div>
          </div>
        </div>

        {/* ── Arena Stats ── */}
        <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: "16px", padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h4 style={{ fontSize: "0.75rem", fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 1rem" }}>Arena Stats</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
            {[
              { label: "Matches", value: "14", icon: <Trophy size={14} />, color: C.blue },
              { label: "Wins",    value: "10", icon: <Star size={14} />,   color: C.yellow },
              { label: "Win Rate",value: "71%",icon: <TrendingUp size={14} />, color: C.green },
              { label: "Rank",    value: "#42",icon: <Award size={14} />,  color: C.red },
            ].map((stat) => (
              <div key={stat.label} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "0.75rem 0.5rem", textAlign: "center" }}>
                <div style={{ color: stat.color, marginBottom: "0.4rem", display: "flex", justifyContent: "center" }}>{stat.icon}</div>
                <p style={{ fontSize: "1.2rem", fontWeight: 900, color: stat.color, margin: "0 0 0.1rem" }}>{stat.value}</p>
                <p style={{ fontSize: "0.6rem", color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Flair Library (new system) ── */}
        <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: "16px", padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <div>
              <h4 style={{ fontSize: "0.75rem", fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Flair Library</h4>
              <p style={{ fontSize: "0.68rem", color: C.muted, margin: "0.2rem 0 0", fontWeight: 400 }}>Tap a tile to set as active. Tap again to deactivate.</p>
            </div>
            {/* Add flair button or max hint */}
            {flairLibrary.length >= 5 ? (
              <span style={{ fontSize: "12px", color: "#888888" }}>max 5 reached</span>
            ) : (
              <button
                onClick={() => setModalOpen(true)}
                style={{ display: "flex", alignItems: "center", gap: "0.25rem", background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "#4A6A7A", fontFamily: "inherit", padding: 0 }}
              >
                <Plus size={13} strokeWidth={2} /> add flair
              </button>
            )}
          </div>

          {/* Flair tiles */}
          {flairLibrary.length === 0 ? (
            <p style={{ fontSize: "0.75rem", color: C.muted, margin: 0, fontStyle: "italic" }}>No flairs yet. Add one above.</p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {flairLibrary.map((flair) => {
                const isActive = activeFlair === flair;
                return (
                  <button
                    key={flair}
                    onClick={() => handleFlairTileClick(flair)}
                    style={{
                      background: C.navy,
                      border: isActive ? `2px solid ${C.accent}` : `1px solid ${C.navyBorder}`,
                      borderRadius: "8px",
                      padding: "0.35rem 0.75rem",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: C.navyText,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "border 0.15s",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                  >
                    {isActive && <span style={{ color: C.accent, fontSize: "10px" }}>●</span>}
                    {flair}
                  </button>
                );
              })}
            </div>
          )}

          {/* Active flair indicator */}
          {activeFlair && (
            <div style={{ marginTop: "0.875rem", paddingTop: "0.875rem", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.65rem", fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Showing:</span>
              <span style={{ fontSize: "12px", fontWeight: 600, color: C.accent }}>⚡ {activeFlair}</span>
            </div>
          )}
        </div>

        {/* ── Edit Profile / College+Tier fields (display section) ── */}
        <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: "16px", padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h4 style={{ fontSize: "0.75rem", fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 1rem" }}>Profile Details</h4>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {/* College field */}
            <div>
              <label style={{ fontSize: "0.68rem", fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "0.3rem" }}>College</label>
              <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "0.6rem 0.875rem", fontSize: "0.85rem", color: C.text, fontWeight: 500 }}>
                {college || <span style={{ color: C.muted }}>Not set</span>}
              </div>
            </div>

            {/* Department */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div>
                <label style={{ fontSize: "0.68rem", fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "0.3rem" }}>Department</label>
                <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "0.6rem 0.875rem", fontSize: "0.85rem", color: C.text, fontWeight: 500 }}>
                  {dept || <span style={{ color: C.muted }}>Not set</span>}
                </div>
              </div>
              <div>
                <label style={{ fontSize: "0.68rem", fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "0.3rem" }}>Year</label>
                <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "0.6rem 0.875rem", fontSize: "0.85rem", color: C.text, fontWeight: 500 }}>
                  {year || <span style={{ color: C.muted }}>Not set</span>}
                </div>
              </div>
            </div>

            {/* Tier field — always shown in edit view, hidden in display if college present */}
            <div>
              <label style={{ fontSize: "0.68rem", fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "0.3rem" }}>Tier</label>
              <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "0.6rem 0.875rem", fontSize: "0.85rem", color: college ? C.muted : C.text, fontWeight: 500 }}>
                {tier || <span style={{ color: C.muted }}>Not set</span>}
              </div>
              <p style={{ fontSize: "11px", color: "#888888", margin: "0.3rem 0 0", fontWeight: 400 }}>
                {college
                  ? "Tier is stored but hidden from your profile since college is set."
                  : "Enter tier if you prefer not to share your college."}
              </p>
            </div>

            {/* ─ SOCIAL LINKS ─ */}
            <div style={{ paddingTop: "0.75rem", borderTop: `1px solid ${C.border}` }}>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#888888", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.875rem" }}>Social Links</p>

              {/* LinkedIn */}
              <div style={{ marginBottom: "0.75rem" }}>
                <label style={{ fontSize: "12px", color: "#888888", display: "block", marginBottom: "0.3rem", fontWeight: 500 }}>LinkedIn</label>
                <div style={{ display: "flex", alignItems: "center", border: "1px solid #E8E8E8", borderRadius: "8px", background: "#fff", overflow: "hidden" }}>
                  {/* Official LinkedIn brand icon */}
                  <div style={{ width: "36px", height: "36px", background: "#0A66C2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={linkedinId}
                    onChange={(e) => setLinkedinId(e.target.value)}
                    placeholder="your LinkedIn username"
                    style={{ flex: 1, border: "none", outline: "none", padding: "0.55rem 0.75rem", fontSize: "0.85rem", color: C.text, fontFamily: "inherit", background: "transparent" }}
                  />
                </div>
                <p style={{ fontSize: "11px", color: "#888888", margin: "0.25rem 0 0" }}>Shared via the blue + button during calls</p>
              </div>

              {/* Other Socials — single free-text field */}
              <div>
                <label style={{ fontSize: "12px", color: "#888888", display: "block", marginBottom: "0.25rem", fontWeight: 500 }}>Other Socials</label>
                <p style={{ fontSize: "11px", color: "#AAAAAA", margin: "0 0 0.4rem" }}>e.g. Instagram, Snapchat, WhatsApp — add whichever you use</p>
                <input
                  type="text"
                  value={otherSocialsId}
                  onChange={(e) => setOtherSocialsId(e.target.value)}
                  placeholder="Add your social handle"
                  style={{ width: "100%", border: "1px solid #E8E8E8", borderRadius: "8px", padding: "0.55rem 0.75rem", fontSize: "0.85rem", color: C.text, fontFamily: "inherit", outline: "none", background: "#fff", boxSizing: "border-box" }}
                />
                <p style={{ fontSize: "11px", color: "#888888", margin: "0.25rem 0 0" }}>Shared via the green + button during calls</p>
              </div>
            </div>

            {/* Save */}
            <button style={{ width: "100%", padding: "0.75rem", borderRadius: "12px", border: "none", background: C.blue, color: "#fff", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginTop: "0.25rem" }}>
              Save Profile
            </button>
          </div>
        </div>

      </div>

      {/* ── Add Flair Modal ── */}
      {modalOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "1.75rem", width: "100%", maxWidth: "340px", boxShadow: "0 16px 48px rgba(0,0,0,0.18)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 800, color: C.text, margin: 0 }}>Add a Flair</h3>
              <button onClick={() => { setModalOpen(false); setFlairInput(""); }} style={{ width: "28px", height: "28px", borderRadius: "50%", background: C.bg, border: `1px solid ${C.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>
                <X size={14} />
              </button>
            </div>

            <p style={{ fontSize: "0.78rem", color: C.muted, margin: "0 0 1rem", fontWeight: 400 }}>
              Write anything — like an Instagram bio line. E.g. "Guitarist", "Vibe Coder", "Coffee Addict".
            </p>

            <input
              type="text"
              value={flairInput}
              onChange={(e) => setFlairInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddFlair(); }}
              placeholder="Your flair…"
              maxLength={30}
              autoFocus
              style={{ width: "100%", padding: "0.7rem 0.875rem", border: `1.5px solid ${C.border}`, borderRadius: "10px", fontSize: "0.9rem", color: C.text, fontFamily: "inherit", outline: "none", boxSizing: "border-box", background: C.bg }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.4rem" }}>
              <span style={{ fontSize: "0.65rem", color: C.muted }}>{flairInput.length}/30</span>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
              <button
                onClick={() => { setModalOpen(false); setFlairInput(""); }}
                style={{ flex: 1, padding: "0.75rem", borderRadius: "12px", border: `1px solid ${C.border}`, background: "#fff", color: C.muted, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddFlair}
                disabled={!flairInput.trim()}
                style={{ flex: 1, padding: "0.75rem", borderRadius: "12px", border: "none", background: flairInput.trim() ? C.blue : C.border, color: flairInput.trim() ? "#fff" : C.muted, fontSize: "0.85rem", fontWeight: 700, cursor: flairInput.trim() ? "pointer" : "not-allowed", fontFamily: "inherit", transition: "all 0.15s" }}
              >
                Add Flair
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}