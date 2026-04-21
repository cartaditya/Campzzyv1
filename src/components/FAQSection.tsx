import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Reveal from "@/components/Reveal";

const faqs = [
  {
    q: "What is Campzzy?",
    a: "Campzzy is a real-time college interaction platform which is fueled with games.",
  },
  {
    q: "What is the motive of Campzzy?",
    a: "To remove the hesitation of starting conversations by replacing it with structured interaction, college identity, and competitive engagement.",
  },
  {
    q: "Is Campzzy like a dating or random chat app?",
    a: "No. Campzzy is not for dating or passive chatting.",
  },
  {
    q: "Do I need to verify my college?",
    a: "No, but verification unlocks: Real college identity, full customization, and better visibility in the system.",
  },
  {
    q: "What makes Campzzy different?",
    a: "College identity layer, built-in games, controlled interaction (no chaos), and real-time engagement — not scrolling.",
  },
  {
    q: "Is my privacy safe on Campzzy?",
    a: "Yes. Campzzy is built with controlled interaction in mind. Users sign up with verified accounts. Camera and interaction are user-controlled. Reporting and moderation systems are active. No anonymous chaos or uncontrolled access. You choose how you interact, and the platform ensures a safe and structured environment.",
  },
];

const FAQSection = () => {
  return (
    <section className="section-shell snap-start max-w-4xl mx-auto px-6 py-16 md:py-24">
      <Reveal>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Want to learn more?
        </h2>
      </Reveal>
      <Reveal delay={100}>
        <p className="text-muted-foreground text-base md:text-lg mb-10">
          Here are some answers to common questions.
        </p>
      </Reveal>

      <Reveal delay={160}>
        <Accordion type="single" collapsible className="w-full rounded-2xl border border-border/70 bg-card/35 px-5 backdrop-blur-sm">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-border last:border-b-0">
              <AccordionTrigger className="text-left text-base md:text-lg font-medium py-6 text-[#5BC8F5] hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base pb-6 leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  );
};

export default FAQSection;