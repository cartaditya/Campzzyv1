import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Zap } from "lucide-react";
import { NetworkAnimation } from "./NetworkAnimation";

type AuthMode = "signup" | "signin";
type Tier = 1 | 2 | 3;

const C = {
  blue: "#007BFF",
  blueDark: "#0056b3",
  border: "#E5E7EB",
  text: "#111827",
  muted: "#6B7280",
  subtle: "#374151",
  bg: "#F9FAFB",
};

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white" style={{ flexShrink: 0 }}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("signup");
  const [selectedTier, setSelectedTier] = useState<Tier | null>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/arena");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.7rem 0.875rem 0.7rem 2.6rem",
    border: `1.5px solid ${C.border}`,
    borderRadius: "10px",
    outline: "none",
    fontSize: "0.9rem",
    boxSizing: "border-box",
    background: "#fff",
    color: C.text,
    fontFamily: "inherit",
    transition: "border-color 0.15s",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.75rem",
    fontWeight: 700,
    color: C.muted,
    display: "block",
    marginBottom: "0.4rem",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  };

  const tiers: { id: Tier; label: string; bg: string; activeBg: string }[] = [
    { id: 1, label: "Tier-1", bg: "#EFF6FF", activeBg: C.blue },
    { id: 2, label: "Tier-2", bg: "#F0FDF4", activeBg: "#16a34a" },
    { id: 3, label: "Tier-3", bg: "#FFF7ED", activeBg: "#ea580c" },
  ];

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        fontFamily: "'Inter', system-ui, sans-serif",
        background: "#0d1117",
      }}
    >
      {/* Full-screen animated background */}
      <NetworkAnimation />

      {/* Brand content — left side, sits on the background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          pointerEvents: "none",
          zIndex: 5,
        }}
      >
        <div style={{ paddingLeft: "6vw", maxWidth: "500px" }}>
          {/* Logo pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              background: "rgba(0,123,255,0.12)",
              border: "1px solid rgba(0,123,255,0.3)",
              borderRadius: "14px",
              padding: "0.6rem 1.2rem",
              marginBottom: "1.5rem",
              backdropFilter: "blur(8px)",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "9px",
                background: "linear-gradient(135deg, #007BFF, #0056b3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,123,255,0.4)",
              }}
            >
              <Zap size={18} color="#fff" fill="#fff" />
            </div>
            <span
              style={{
                fontSize: "1.75rem",
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "-1px",
              }}
            >
              CAMPZZY
            </span>
          </div>

          <p
            style={{
              fontSize: "2.6rem",
              fontWeight: 800,
              color: "#fff",
              margin: "0 0 0.5rem",
              letterSpacing: "-0.5px",
              lineHeight: 1.15,
            }}
          >
            Coolest on<br />Campus
          </p>
          <p
            style={{
              fontSize: "1rem",
              color: "rgba(255,255,255,0.4)",
              margin: "0 0 2.5rem",
              fontWeight: 500,
            }}
          >
            Meet. Compete. Connect. Roll.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: "2.5rem" }}>
            {[
              { val: "12K+", label: "Students" },
              { val: "340+", label: "Colleges" },
              { val: "98K+", label: "Connections" },
            ].map((s) => (
              <div key={s.label}>
                <p style={{ fontSize: "1.5rem", fontWeight: 900, color: "#007BFF", margin: 0, lineHeight: 1 }}>
                  {s.val}
                </p>
                <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", fontWeight: 700, margin: "0.2rem 0 0", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating signup card — right side */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "5vw",
          transform: "translateY(-50%)",
          zIndex: 20,
          width: "100%",
          maxWidth: "420px",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(24px)",
            borderRadius: "24px",
            padding: "2rem 2rem 1.75rem",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          {/* Card header */}
          <div style={{ marginBottom: "1.25rem" }}>
            <h2
              style={{
                fontSize: "1.6rem",
                fontWeight: 900,
                color: C.text,
                margin: "0 0 0.2rem",
                letterSpacing: "-0.5px",
              }}
            >
              {mode === "signup" ? "Create your account" : "Welcome back"}
            </h2>
            <p
              style={{
                fontSize: "1rem",
                fontWeight: 800,
                color: C.blue,
                margin: 0,
                letterSpacing: "-0.3px",
              }}
            >
              CAMPZZY
            </p>
          </div>

          {/* Mode toggle */}
          <div
            style={{
              display: "flex",
              background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: "10px",
              padding: "3px",
              marginBottom: "1.25rem",
            }}
          >
            {(["signup", "signin"] as AuthMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  background: mode === m ? C.blue : "transparent",
                  color: mode === m ? "#fff" : C.muted,
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  fontFamily: "inherit",
                  transition: "all 0.18s",
                  boxShadow: mode === m ? "0 2px 8px rgba(0,123,255,0.28)" : "none",
                }}
              >
                {m === "signup" ? "Sign Up" : "Sign In"}
              </button>
            ))}
          </div>

          {/* Social Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.1rem" }}>
            <button
              onClick={() => navigate("/arena")}
              style={{
                width: "100%",
                padding: "0.7rem 1.25rem",
                borderRadius: "100px",
                border: `1.5px solid ${C.border}`,
                background: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.625rem",
                fontFamily: "inherit",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: C.text,
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <button
              onClick={() => navigate("/arena")}
              style={{
                width: "100%",
                padding: "0.7rem 1.25rem",
                borderRadius: "100px",
                border: "none",
                background: "#0A66C2",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.625rem",
                fontFamily: "inherit",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#fff",
                boxShadow: "0 2px 10px rgba(10,102,194,0.3)",
              }}
            >
              <LinkedInIcon />
              Sign up via LinkedIn
            </button>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.1rem" }}>
            <div style={{ flex: 1, height: "1px", background: C.border }} />
            <span style={{ fontSize: "0.72rem", color: "#9CA3AF", fontWeight: 600 }}>or</span>
            <div style={{ flex: 1, height: "1px", background: C.border }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            {mode === "signup" && (
              <div>
                <label style={labelStyle}>Full Name</label>
                <div style={{ position: "relative" }}>
                  <User size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
                  <input type="text" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
                </div>
              </div>
            )}

            <div>
              <label style={labelStyle}>Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
                <input type="email" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ ...inputStyle, paddingRight: "2.75rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 0, display: "flex",
                  }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Tier Selection */}
            {mode === "signup" && (
              <div>
                <label style={labelStyle}>Select Tier</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
                  {tiers.map((tier) => {
                    const active = selectedTier === tier.id;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setSelectedTier(tier.id)}
                        style={{
                          padding: "0.65rem 0",
                          borderRadius: "9px",
                          border: `2px solid ${active ? tier.activeBg : C.border}`,
                          background: active ? tier.activeBg : tier.bg,
                          color: active ? "#fff" : C.subtle,
                          fontWeight: 800,
                          fontSize: "0.82rem",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          transition: "all 0.18s",
                          boxShadow: active ? `0 3px 12px ${tier.activeBg}40` : "none",
                        }}
                      >
                        {tier.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "0.8rem",
                background: C.blue,
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontWeight: 800,
                fontSize: "0.95rem",
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "0 4px 14px rgba(0,123,255,0.35)",
                marginTop: "0.1rem",
              }}
            >
              {mode === "signup" ? "Sign Up" : "Sign In →"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.75rem", color: "#9CA3AF" }}>
            {mode === "signup" ? (
              <>
                Already have an account?{" "}
                <button onClick={() => setMode("signin")} style={{ background: "none", border: "none", color: C.blue, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: "0.75rem" }}>
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button onClick={() => setMode("signup")} style={{ background: "none", border: "none", color: C.blue, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: "0.75rem" }}>
                  Sign Up
                </button>
              </>
            )}
          </p>
          <p style={{ textAlign: "center", marginTop: "0.5rem", fontSize: "0.65rem", color: "#D1D5DB" }}>
            By continuing, you agree to Campzzy's Terms & Privacy Policy
          </p>
        </div>
      </div>

      {/* Bottom tagline */}
      <div style={{ position: "absolute", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
        <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.15)", textAlign: "center", margin: 0, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          India's Student Battle Network
        </p>
      </div>
    </div>
  );
}