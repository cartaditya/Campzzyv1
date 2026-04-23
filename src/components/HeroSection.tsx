import { useEffect, useRef, useState } from "react";
import { RefreshCw, Instagram, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FloatingOrbs from "@/components/FloatingOrbs";
import Reveal from "@/components/Reveal";
import { attachMagneticEffect } from "@/lib/magnetic";

const heroSteps = [
  { label: "Interact", href: "#interact-section", Icon: RefreshCw },
  { label: "Connect", href: "#connect-section", Icon: Instagram },
  { label: "Clash", href: "#clash-section", Icon: Zap },
];

const GoogleGIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 7v10M7 12h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const HeroSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"signup" | "signin">("signup");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpTier, setSignUpTier] = useState("Tier-1");
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;

    const handleMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      target.x = (x - 0.5) * 2;
      target.y = (y - 0.5) * 2;
    };

    const handleLeave = () => {
      target.x = 0;
      target.y = 0;
    };

    const animate = () => {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;

      section.style.setProperty("--mx", current.x.toFixed(4));
      section.style.setProperty("--my", current.y.toFixed(4));

      frame = requestAnimationFrame(animate);
    };

    section.addEventListener("mousemove", handleMove);
    section.addEventListener("mouseleave", handleLeave);
    frame = requestAnimationFrame(animate);

    return () => {
      section.removeEventListener("mousemove", handleMove);
      section.removeEventListener("mouseleave", handleLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!ctaRef.current) return;
    return attachMagneticEffect(ctaRef.current, 11);
  }, []);



  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword.trim() || !signUpTier.trim()) return;
    setIsAuthenticated(true);
    setIsAuthOpen(false);
  };

  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!signInEmail.trim() || !signInPassword.trim()) return;
    setIsAuthenticated(true);
    setIsAuthOpen(false);
  };

  return (
    <section
      ref={sectionRef}
      id="overview"
      className="snap-start relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-24 pb-16 md:pt-32 md:pb-24"
    >
      <div className="hero-parallax-orbs absolute inset-0">
        <FloatingOrbs />
      </div>

      <div className="hero-parallax-mid relative z-20">
        <Reveal>
          <h1 className="hero-parallax-fast hero-title-glow wordmark-font text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-center leading-tight">
            <span className="text-foreground">Connect Across{" "}</span>
            <span className="wordmark-gradient">Campus's</span>
          </h1>
        </Reveal>

        <Reveal delay={120}>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground text-center max-w-2xl mx-auto">
            Turn Rivalry Into Conversations
          </p>
        </Reveal>

        <Reveal delay={170}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 md:gap-3">
            {heroSteps.map(({ label, href, Icon }, index) => (
              <a
                key={label}
                href={href}
                className="glass-card onboarding-chip rounded-full px-4 py-2.5 md:px-5 md:py-3 text-sm md:text-base font-medium text-foreground/90 transition-colors hover:text-[#5BC8F5]"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <Icon className="h-4 w-4 md:h-4.5 md:w-4.5" />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={220}>
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <button
              ref={ctaRef}
              onClick={() => {
                if (!isAuthenticated) {
                  setIsAuthOpen(true);
                } else {
                  navigate("/arena");
                }
              }}
              className={`magnetic-target min-h-12 px-10 py-4 rounded-full text-base font-medium transition-all duration-300 ${
                isAuthenticated
                  ? "cta-shimmer bg-primary text-primary-foreground hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(91,200,245,0.35)]"
                  : "border border-gray-300 bg-white text-gray-800 hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
              }`}
            >
              {isAuthenticated ? "Start Rolling" : "Sign Up / Log In"}
            </button>
          </div>
        </Reveal>

      </div>

      {isAuthOpen && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4"
          onClick={() => setIsAuthOpen(false)}
        >
          <div
            className="relative z-[91] w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_28px_70px_rgba(0,0,0,0.15)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsAuthOpen(false)}
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-800"
              aria-label="Close authentication popup"
            >
              x
            </button>

            <div className="mb-5 flex rounded-full border border-gray-200 bg-gray-100 p-1">
              <button
                onClick={() => setAuthTab("signup")}
                className={`w-1/2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  authTab === "signup"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Sign Up
              </button>
              <button
                onClick={() => setAuthTab("signin")}
                className={`w-1/2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  authTab === "signin"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Sign In
              </button>
            </div>

            {authTab === "signup" ? (
              <form className="space-y-3" onSubmit={handleSignUp}>
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
                <input
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <input
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  type="email"
                  placeholder="Email"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <input
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <select
                  value={signUpTier}
                  onChange={(e) => setSignUpTier(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option>Tier-1</option>
                  <option>Tier-2</option>
                  <option>Tier-3</option>
                </select>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-blue-500 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-blue-600"
                >
                  Sign Up
                </button>
              </form>
            ) : (
              <form className="space-y-3" onSubmit={handleSignIn}>
                <input
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  type="email"
                  placeholder="Email"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <input
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-blue-500 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-blue-600"
                >
                  Sign In
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Reveal delay={320}>
        <h2 className="relative z-20 mt-24 md:mt-32 text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-center">
          Something Exciting Incoming
        </h2>
      </Reveal>
    </section>
  );
};

export default HeroSection;