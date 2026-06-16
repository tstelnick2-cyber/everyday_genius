import React from "react";
import { Layout } from "@/components/layout";
import { Link } from "wouter";

const GUIDES = [
  {
    id: "how-to-close-any-deal",
    title: "How to Close Any Business Deal",
    label: "SECRET KNOWLEDGE",
    description: "The psychology, strategy, and unapologetic tactics of high-stakes negotiation.",
    image: "/guide-1-cover.png"
  },
  {
    id: "underground-closing-techniques",
    title: "Underground Techniques Used by 7-Figure Closers",
    label: "SECRET KNOWLEDGE",
    description: "Insider methods that separate top earners from the rest of the room. What they will never teach you in business school.",
    image: "/guide-2-cover.png"
  }
];

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 md:pt-40 md:pb-48 border-b border-border/20">
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="/hero-abstract.png" 
            alt="Hero Background" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-border bg-background/50 backdrop-blur-sm" data-testid="badge-status">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">The Vault is Open</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-foreground leading-[1.1] mb-8">
            Insider intelligence for those paying attention.
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-12 font-light">
            Not hustle-culture noise. Not generic advice. 
            This is a curated private library of the actionable edge you need to move the needle.
          </p>
        </div>
      </section>

      {/* Guides Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-16 border-b border-border/40 pb-6">
            <h2 className="text-3xl font-serif font-bold">Available Briefings</h2>
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest hidden md:inline-block">Exclusive Access</span>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {GUIDES.map((guide, idx) => (
              <Link 
                key={guide.id} 
                href={`/guides/${guide.id}`}
                className="group block relative"
                data-testid={`link-guide-${guide.id}`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-sm -z-10" />
                <div className="aspect-[4/3] w-full overflow-hidden mb-6 border border-border/50 bg-muted/20 relative">
                  <img 
                    src={guide.image} 
                    alt={guide.title}
                    className="w-full h-full object-cover object-center grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                  <div className="absolute top-4 left-4 bg-background border border-border px-3 py-1.5 backdrop-blur-md">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary font-mono">
                      {guide.label}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-serif font-bold group-hover:text-primary transition-colors leading-tight">
                    {guide.title}
                  </h3>
                  <p className="text-muted-foreground font-light leading-relaxed line-clamp-2">
                    {guide.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider mt-4">
                    <span className="border-b border-primary/30 group-hover:border-primary pb-0.5 transition-colors duration-300">Access Document</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-32 pt-16 border-t border-border/20 text-center">
            <span className="inline-block px-4 py-2 border border-dashed border-border text-muted-foreground/60 font-mono text-sm uppercase tracking-widest">
              More Intel Coming Soon
            </span>
          </div>
        </div>
      </section>
    </Layout>
  );
}
