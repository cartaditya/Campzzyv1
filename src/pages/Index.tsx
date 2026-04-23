import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeatureBlock from "@/components/FeatureBlock";
import PrivacySection from "@/components/PrivacySection";
import FAQSection from "@/components/FAQSection";

const Index = () => {
  return (
    <div className="ambient-bg min-h-screen bg-background pb-24 md:pb-0">
      <Navbar />
      <HeroSection />

      <FeatureBlock
        index={0}
        icon="interact"
        title="Interact"
        body="Meet students from colleges across India, skip the awkward first message, and jump straight into something real. Roll into conversations, college battles, and games with people who actually get it — no bios, no swiping, just live interaction the way it was meant to be."
      />

      <FeatureBlock
        index={1}
        icon="connect"
        title="Connect"
        body="Interact across socials, connect via LinkedIn, and take the conversation beyond the platform — turn a great interaction into an actual story."
      />

      <FeatureBlock
        index={2}
        icon="clash"
        title="Clash"
        body="Clash through games, challenge each other, and feel the thrill of every move."
      />

      <PrivacySection />
      <FAQSection />

      <div className="mobile-sticky-cta-wrap md:hidden">
        <a
          href="#overview"
          className="magnetic-target mobile-sticky-cta cta-shimmer inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-primary px-6 text-base font-medium text-primary-foreground shadow-[0_10px_35px_rgba(91,200,245,0.35)]"
        >
          Join Early Access
        </a>
      </div>
    </div>
  );
};

export default Index;