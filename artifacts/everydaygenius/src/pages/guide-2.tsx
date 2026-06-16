import { useState } from "react";
import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { DownloadModal } from "@/components/download-modal";

const GUIDE_ID = "underground-closing-techniques";
const GUIDE_TITLE = "Underground Techniques Used by 7-Figure Closers";

export default function Guide2() {
  const [showModal, setShowModal] = useState(false);

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12 md:py-24">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest mb-16" data-testid="link-back">
          &larr; Back to Vault
        </Link>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-16 lg:gap-24 items-start">
          {/* Image Column */}
          <div className="order-2 lg:order-1 sticky top-32">
            <div className="aspect-[3/4] w-full border border-border p-4 bg-card/30 relative">
              <div className="absolute top-8 -left-4 bg-background border border-border px-4 py-2 z-10 shadow-2xl">
                <span className="text-xs font-bold uppercase tracking-widest text-primary font-mono">
                  SECRET KNOWLEDGE
                </span>
              </div>
              <img
                src="/guide-2-cover.png"
                alt="Guide Cover"
                className="w-full h-full object-cover grayscale contrast-125"
              />
            </div>
          </div>

          {/* Content Column */}
          <div className="order-1 lg:order-2 space-y-12">
            <div className="space-y-4 border-b border-border/40 pb-12">
              <div className="font-mono text-sm uppercase tracking-widest text-primary mb-6">
                SECRET KNOWLEDGE
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold leading-[1.1] tracking-tight">
                {GUIDE_TITLE}
              </h1>
              <p className="text-xl text-muted-foreground font-light leading-relaxed pt-6">
                The playbook they don't want you to see. While average salespeople rely on scripts, the top 1% use invisible influence. Step into the mind of a 7-figure closer.
              </p>
            </div>

            <div className="space-y-8">
              <h2 className="text-2xl font-serif font-bold">What's Inside the Briefing</h2>

              <ul className="space-y-6">
                {[
                  "The Pre-Frame Protocol: Winning the deal before the actual conversation starts.",
                  "Subconscious Authority: Small shifts in body language and tonality that command absolute respect.",
                  "The Disqualification Pitch: Why pushing prospects away actually pulls them in closer.",
                  "Emotional Tying: Linking your offer directly to their deepest unspoken insecurities.",
                  "The 1% Follow-Up: How to stay top-of-mind without ever looking desperate or needy.",
                  "Contract Judo: Reversing aggressive legal pushback effortlessly."
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="text-primary font-mono mt-1">0{i + 1}</span>
                    <p className="text-foreground leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              <Button
                size="lg"
                className="w-full sm:w-auto text-lg h-16 px-12 uppercase tracking-widest font-bold"
                onClick={() => setShowModal(true)}
                data-testid="button-download"
              >
                Get the Guide
              </Button>
              <p className="text-xs text-muted-foreground mt-4 font-mono uppercase tracking-wider text-center sm:text-left">
                Immediate Access • 100% Confidential
              </p>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <DownloadModal
          guideId={GUIDE_ID}
          title={GUIDE_TITLE}
          onClose={() => setShowModal(false)}
        />
      )}
    </Layout>
  );
}
