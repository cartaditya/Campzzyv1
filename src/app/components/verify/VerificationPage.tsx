import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, CheckCircle, ArrowLeft, Shield, AlertCircle } from "lucide-react";

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
};

function isValidCollegeEmail(email: string) {
  const collegePatterns = [
    /\.edu$/i,
    /\.ac\.in$/i,
    /iit[a-z]+\.ac\.in$/i,
    /bits[a-z]*\.in$/i,
    /nit[a-z]+\.ac\.in$/i,
    /vit\.ac\.in$/i,
  ];
  return collegePatterns.some((p) => p.test(email)) && email.includes("@");
}

type VerifyStep = "input" | "otp" | "done";

export function VerificationPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<VerifyStep>("input");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const isValid = isValidCollegeEmail(email);

  const handleSendOtp = () => {
    if (!isValid) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
    }, 1200);
  };

  const handleVerifyOtp = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("done");
    }, 1000);
  };

  const handleOtpChange = (idx: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 5) {
      const next = document.getElementById(`otp-${idx + 1}`);
      next?.focus();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(145deg, #EBF4FF 0%, ${C.bg} 60%, #FFFDF0 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', system-ui, sans-serif",
        padding: "1rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "440px" }}>
        {/* Back link */}
        <button
          onClick={() => navigate("/profile")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: C.muted,
            fontWeight: 700,
            fontSize: "0.85rem",
            fontFamily: "inherit",
            marginBottom: "1.5rem",
          }}
        >
          <ArrowLeft size={15} /> Back to Profile
        </button>

        {/* Card */}
        <div
          style={{
            background: "#fff",
            borderRadius: "22px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 16px 48px rgba(0,0,0,0.08)",
            padding: "2.5rem 2rem",
            border: `1px solid ${C.border}`,
          }}
        >
          {step !== "done" ? (
            <>
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <div
                  style={{
                    width: "68px",
                    height: "68px",
                    borderRadius: "20px",
                    background: `linear-gradient(135deg, ${C.yellow}, #FF8C00)`,
                    margin: "0 auto 1.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 6px 20px rgba(255,193,7,0.35)",
                  }}
                >
                  <Shield size={32} color="#fff" />
                </div>
                <h1
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 900,
                    color: C.text,
                    margin: "0 0 0.4rem",
                    letterSpacing: "-0.5px",
                  }}
                >
                  Claim Your College Identity
                </h1>
                <p
                  style={{
                    color: C.muted,
                    fontSize: "0.85rem",
                    margin: 0,
                    fontWeight: 500,
                    lineHeight: 1.5,
                  }}
                >
                  {step === "input"
                    ? "Verify with your official college email to unlock exclusive Tier features."
                    : `We sent a 6-digit code to ${email}`}
                </p>
              </div>

              {step === "input" ? (
                <>
                  {/* Email input */}
                  <div style={{ marginBottom: "1.25rem" }}>
                    <label
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: 800,
                        color: C.subtle,
                        display: "block",
                        marginBottom: "0.5rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      College Email Address
                    </label>
                    <div style={{ position: "relative" }}>
                      <Mail
                        size={16}
                        style={{
                          position: "absolute",
                          left: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: email
                            ? isValid
                              ? C.green
                              : C.red
                            : "#ADB5BD",
                          transition: "color 0.2s",
                        }}
                      />
                      <input
                        type="email"
                        placeholder="yourname@college.ac.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.75rem 2.75rem 0.75rem 2.75rem",
                          border: `1.5px solid ${
                            email
                              ? isValid
                                ? C.green
                                : C.red
                              : C.border
                          }`,
                          borderRadius: "12px",
                          outline: "none",
                          fontSize: "0.9rem",
                          boxSizing: "border-box",
                          background: "#fff",
                          color: C.text,
                          transition: "border-color 0.2s",
                          fontFamily: "inherit",
                        }}
                      />
                      {email && (
                        <div
                          style={{
                            position: "absolute",
                            right: "14px",
                            top: "50%",
                            transform: "translateY(-50%)",
                          }}
                        >
                          {isValid ? (
                            <CheckCircle size={16} color={C.green} />
                          ) : (
                            <AlertCircle size={16} color={C.red} />
                          )}
                        </div>
                      )}
                    </div>
                    {email && !isValid && (
                      <p
                        style={{
                          color: C.red,
                          fontSize: "0.72rem",
                          margin: "0.4rem 0 0",
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <AlertCircle size={11} />
                        Please use your official college email (.ac.in or .edu)
                      </p>
                    )}
                    {email && isValid && (
                      <p
                        style={{
                          color: C.green,
                          fontSize: "0.72rem",
                          margin: "0.4rem 0 0",
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <CheckCircle size={11} />
                        Valid college email detected
                      </p>
                    )}
                  </div>

                  {/* Info box */}
                  <div
                    style={{
                      background: "rgba(0,123,255,0.04)",
                      border: `1px solid rgba(0,123,255,0.15)`,
                      borderRadius: "12px",
                      padding: "0.875rem",
                      marginBottom: "1.25rem",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.78rem",
                        color: C.blue,
                        margin: 0,
                        fontWeight: 600,
                        lineHeight: 1.5,
                      }}
                    >
                      🔒 Your email is only used for verification. We'll never share it or use it for marketing.
                    </p>
                  </div>

                  <button
                    onClick={handleSendOtp}
                    disabled={!isValid || loading}
                    style={{
                      width: "100%",
                      padding: "0.875rem",
                      background: isValid
                        ? `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`
                        : "#E9ECEF",
                      color: isValid ? "#fff" : "#ADB5BD",
                      border: "none",
                      borderRadius: "12px",
                      fontWeight: 800,
                      fontSize: "0.95rem",
                      cursor: isValid ? "pointer" : "not-allowed",
                      fontFamily: "inherit",
                      boxShadow: isValid ? "0 4px 16px rgba(0,123,255,0.3)" : "none",
                      transition: "all 0.2s",
                    }}
                  >
                    {loading ? "Sending..." : "✉️ Verify Email"}
                  </button>
                </>
              ) : (
                <>
                  {/* OTP step */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <label
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: 800,
                        color: C.subtle,
                        display: "block",
                        marginBottom: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        textAlign: "center",
                      }}
                    >
                      Enter 6-Digit Code
                    </label>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        justifyContent: "center",
                      }}
                    >
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`otp-${idx}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          style={{
                            width: "46px",
                            height: "52px",
                            textAlign: "center",
                            border: `1.5px solid ${digit ? C.blue : C.border}`,
                            borderRadius: "10px",
                            fontSize: "1.25rem",
                            fontWeight: 800,
                            color: C.blue,
                            outline: "none",
                            background: digit ? "rgba(0,123,255,0.04)" : "#fff",
                            fontFamily: "inherit",
                            transition: "all 0.15s",
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleVerifyOtp}
                    disabled={otp.some((d) => !d) || loading}
                    style={{
                      width: "100%",
                      padding: "0.875rem",
                      background:
                        !otp.some((d) => !d)
                          ? `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`
                          : "#E9ECEF",
                      color: !otp.some((d) => !d) ? "#fff" : "#ADB5BD",
                      border: "none",
                      borderRadius: "12px",
                      fontWeight: 800,
                      fontSize: "0.95rem",
                      cursor: !otp.some((d) => !d) ? "pointer" : "not-allowed",
                      fontFamily: "inherit",
                      boxShadow: !otp.some((d) => !d)
                        ? "0 4px 16px rgba(0,123,255,0.3)"
                        : "none",
                      transition: "all 0.2s",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {loading ? "Verifying..." : "Confirm Code"}
                  </button>

                  <div style={{ textAlign: "center" }}>
                    <button
                      onClick={() => setStep("input")}
                      style={{
                        background: "none",
                        border: "none",
                        color: C.muted,
                        cursor: "pointer",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        fontFamily: "inherit",
                      }}
                    >
                      ← Change email address
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            /* Success State */
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "rgba(40,167,69,0.1)",
                  margin: "0 auto 1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `2px solid ${C.green}`,
                  animation: "success-pop 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                }}
              >
                <CheckCircle size={40} color={C.green} />
              </div>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 900,
                  color: C.text,
                  margin: "0 0 0.5rem",
                }}
              >
                Identity Verified! 🎉
              </h2>
              <p
                style={{
                  color: C.muted,
                  fontSize: "0.875rem",
                  margin: "0 0 0.25rem",
                  fontWeight: 500,
                }}
              >
                Your college identity has been confirmed.
              </p>
              <p
                style={{
                  color: C.blue,
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  margin: "0 0 2rem",
                }}
              >
                {email}
              </p>

              <div
                style={{
                  background: "rgba(40,167,69,0.06)",
                  border: `1px solid rgba(40,167,69,0.2)`,
                  borderRadius: "12px",
                  padding: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                <p style={{ fontSize: "0.82rem", color: C.green, fontWeight: 700, margin: 0 }}>
                  ✓ Verified Student Badge unlocked
                  <br />
                  ✓ Full Tier 1 access enabled
                  <br />
                  ✓ College leaderboard joined
                </p>
              </div>

              <button
                onClick={() => navigate("/profile")}
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  background: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`,
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  boxShadow: "0 4px 16px rgba(0,123,255,0.3)",
                }}
              >
                Back to Profile →
              </button>
            </div>
          )}
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.25rem",
            fontSize: "0.75rem",
            color: "#ADB5BD",
          }}
        >
          🔒 Campzzy does not collect or store PII beyond verification
        </p>
      </div>

      <style>{`
        @keyframes success-pop {
          from { transform: scale(0.6); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
