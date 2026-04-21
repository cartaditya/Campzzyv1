import { Lock, Shield, ShieldCheck, KeyRound, Eye, EyeOff, Fingerprint } from "lucide-react";
import Reveal from "@/components/Reveal";

const PrivacySection = () => {
  return (
    <section className="section-shell snap-start px-6 py-20 md:py-32 overflow-hidden">
      <Reveal>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl lg:text-[2.6rem] font-bold text-foreground leading-snug mb-6">
            We protect your identity, your interactions, and your college story.
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your conversations, matches, and college identity are yours alone. We never store, sell, or use your interactions to train anything — ever.
          </p>
        </div>
      </Reveal>

      {/* Enhanced security visual */}
      <Reveal className="flex justify-center mt-16 md:mt-20" delay={140}>
        <div className="relative w-[320px] h-[320px] md:w-[420px] md:h-[420px]">
          {/* Outer privacy orbit rotates slowly clockwise */}
          <div className="absolute inset-0 privacy-orbit-slow">
            <div className="absolute inset-0 rounded-full border-2 border-[#5BC8F5]/20" />
            <div className="absolute inset-5 rounded-full border border-[#A855F7]/15" />
            <div className="absolute inset-10 rounded-full border border-[#EC4899]/15" />
            <div className="absolute inset-16 rounded-full border border-[#5BC8F5]/10" />

            {/* Orbiting security icons */}
            <div className="absolute inset-0">
              <div className="absolute top-2 left-1/2 -translate-x-1/2">
                <div className="w-12 h-12 rounded-xl bg-background border border-border shadow-md flex items-center justify-center">
                  <Lock className="w-5 h-5 text-[#5BC8F5]" />
                </div>
              </div>

              <div className="absolute top-[18%] right-[5%]">
                <div className="w-11 h-11 rounded-xl bg-background border border-border shadow-md flex items-center justify-center">
                  <Fingerprint className="w-5 h-5 text-[#A855F7]" />
                </div>
              </div>

              <div className="absolute bottom-[18%] right-[8%]">
                <div className="w-12 h-12 rounded-xl bg-background border border-border shadow-md flex items-center justify-center">
                  <EyeOff className="w-5 h-5 text-[#EC4899]" />
                </div>
              </div>

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                <div className="w-11 h-11 rounded-xl bg-background border border-border shadow-md flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-[#5BC8F5]" />
                </div>
              </div>

              <div className="absolute bottom-[18%] left-[8%]">
                <div className="w-12 h-12 rounded-xl bg-background border border-border shadow-md flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#A855F7]" />
                </div>
              </div>

              <div className="absolute top-[18%] left-[5%]">
                <div className="w-11 h-11 rounded-xl bg-background border border-border shadow-md flex items-center justify-center">
                  <Eye className="w-5 h-5 text-[#EC4899]" />
                </div>
              </div>
            </div>

            {/* Connecting dots along orbit */}
            <div className="absolute inset-0">
              {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-gradient-campzzy opacity-40"
                  style={{
                    top: `${50 - 46 * Math.cos((deg * Math.PI) / 180)}%`,
                    left: `${50 + 46 * Math.sin((deg * Math.PI) / 180)}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Subtle gradient glow behind center */}
          <div className="absolute inset-[30%] rounded-full bg-gradient-to-br from-[#5BC8F5]/5 via-[#A855F7]/5 to-[#EC4899]/5 blur-2xl" />

          {/* Center shield */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-[#5BC8F5]/10 via-[#A855F7]/10 to-[#EC4899]/10 border border-[#A855F7]/20 flex items-center justify-center backdrop-blur-sm shadow-lg shadow-[#A855F7]/5">
              <ShieldCheck className="w-10 h-10 md:w-12 md:h-12 icon-gradient-campzzy" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default PrivacySection;