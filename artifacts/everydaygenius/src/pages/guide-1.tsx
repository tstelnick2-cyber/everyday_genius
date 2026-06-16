import React from "react";
import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Guide1() {
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
                src="/guide-1-cover.png" 
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
                How to Close Any Business Deal
              </h1>
              <p className="text-xl text-muted-foreground font-light leading-relaxed pt-6">
                Closing isn't about pushing. It's about positioning. Discover the precise psychological levers and strategic frameworks used by elite negotiators to command the room and dictate the terms.
              </p>
            </div>

            <div className="space-y-8">
              <h2 className="text-2xl font-serif font-bold">What's Inside the Briefing</h2>
              
              <ul className="space-y-6">
                {[
                  "The 'Walk-Away' Framework: How to manufacture genuine leverage in any scenario.",
                  "Price Anchoring 101: Dictating the perceived value before the negotiation even begins.",
                  "Silence as a Weapon: Using calculated pauses to break resistance.",
                  "The Illusion of Choice: Structuring offers so the client always picks exactly what you want them to.",
                  "Overcoming the 'Let me think about it' objection instantly and cleanly."
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="text-primary font-mono mt-1">0{i + 1}</span>
                    <p className="text-foreground leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              <Button size="lg" className="w-full sm:w-auto text-lg h-16 px-12 uppercase tracking-widest font-bold" asChild data-testid="button-download">
                <a href="#">Download Free PDF</a>
              </Button>
              <p className="text-xs text-muted-foreground mt-4 font-mono uppercase tracking-wider text-center sm:text-left">
                Immediate Access • 100% Confidential
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
