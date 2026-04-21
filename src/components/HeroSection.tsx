import { useEffect, useRef } from "react";
import { RefreshCw, Instagram, Zap } from "lucide-react";
import FloatingOrbs from "@/components/FloatingOrbs";
import Reveal from "@/components/Reveal";
import { attachMagneticEffect } from "@/lib/magnetic";

const heroSteps = [
  { label: "Interact", href: "#interact-section", Icon: RefreshCw },
  { label: "Connect", href: "#connect-section", Icon: Instagram },
  { label: "Clash", href: "#clash-section", Icon: Zap },
];

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

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
          <div className="flex justify-center mt-10">
            <button
              ref={ctaRef}
              className="magnetic-target cta-shimmer min-h-12 px-10 py-4 bg-primary text-primary-foreground rounded-full text-base font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(91,200,245,0.35)]"
            >
              Coming Soon
            </button>
          </div>
        </Reveal>

      </div>

      <Reveal delay={320}>
        <h2 className="relative z-20 mt-24 md:mt-32 text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-center">
          Something Exciting Incoming
        </h2>
      </Reveal>
    </section>
  );
};

export default HeroSection;