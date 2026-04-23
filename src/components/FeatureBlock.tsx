import { RefreshCw, Instagram, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import connectImage from "@/assets/connect.jpeg";
import Reveal from "@/components/Reveal";
import { useEffect, useRef } from "react";
import { attachMagneticEffect } from "@/lib/magnetic";

interface FeatureBlockProps {
  icon: "interact" | "connect" | "clash";
  title: string;
  body: string;
  index?: number;
}

const iconMap: Record<string, LucideIcon> = {
  interact: RefreshCw,
  connect: Instagram,
  clash: Zap,
};

const mediaMap: Record<string, { type: "video" | "image" | "youtube"; src: string }> = {
  interact: { type: "video", src: "/interact-video.mp4" },
  connect: { type: "image", src: connectImage },
  clash: { type: "video", src: "/clash-video.mp4" }
};

const FeatureBlock = ({ icon, title, body, index = 0 }: FeatureBlockProps) => {
  const Icon = iconMap[icon];
  const media = mediaMap[icon];
  const reverseRow = index % 2 === 1;
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mediaRef.current) return;
    return attachMagneticEffect(mediaRef.current, 9);
  }, []);

  return (
    <section id={`${icon}-section`} className="section-shell snap-start scroll-mt-24 max-w-7xl mx-auto px-6 py-16 md:py-24">
      <div className={`flex flex-col items-start gap-10 md:gap-16 ${reverseRow ? "md:flex-row-reverse" : "md:flex-row"}`}>
        <Reveal className="flex-1 max-w-lg" delay={120 + index * 100}>
          <div className="mb-5 w-fit rounded-xl border border-border/70 bg-card/40 p-3 backdrop-blur-sm">
            <Icon className="w-8 h-8 icon-gradient-campzzy" strokeWidth={2} />
          </div>
          <h3 className="wordmark-font wordmark-gradient text-2xl md:text-3xl font-semibold mb-4">{title}</h3>
          <p className="max-w-prose text-[0.98rem] md:text-lg text-muted-foreground leading-7 md:leading-relaxed">{body}</p>
        </Reveal>

        <Reveal className="flex-1 w-full" delay={200 + index * 110}>
          <div ref={mediaRef} className="magnetic-target media-interactive glass-card w-full aspect-video rounded-2xl overflow-hidden shadow-xl">
            {media.type === "video" ? (
              <video
                src={media.src}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                onError={(e) => {
                  (e.target as HTMLVideoElement).style.display = "none";
                }}
              />
            ) : media.type === "youtube" ? (
              <iframe
                src={media.src}
                title={`${title} preview`}
                className="w-full h-full"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <img src={media.src} alt={title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default FeatureBlock;