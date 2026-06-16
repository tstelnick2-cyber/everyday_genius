import { useState } from "react";
import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { useCreateSubscriber } from "@workspace/api-client-react";

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

function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const subscribe = useCreateSubscriber();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    subscribe.mutate(
      { data: { email: email.trim() } },
      {
        onSuccess: () => {
          setSubmitted(true);
          setEmail("");
        },
        onError: (err) => {
          const apiErr = err as { status?: number };
          if (apiErr.status === 409) {
            setSubmitted(true);
          }
        }
      }
    );
  }

  return (
    <section className="border-t border-border/30 py-24 md:py-32">
      <div className="container mx-auto px-6 max-w-2xl text-center">
        <span className="inline-block font-mono text-[10px] font-bold uppercase tracking-widest text-primary mb-6 px-3 py-1 border border-primary/30 bg-primary/5">
          Intelligence Briefings
        </span>
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-5 leading-tight">
          Get notified when new guides drop.
        </h2>
        <p className="text-muted-foreground font-light leading-relaxed mb-10 text-lg">
          New knowledge enters the vault periodically. Most people won't know when.
          You will.
        </p>

        {submitted ? (
          <div
            className="flex flex-col items-center gap-3 py-6"
            data-testid="text-subscribe-success"
          >
            <div className="w-10 h-10 rounded-full border border-primary/50 flex items-center justify-center bg-primary/10 mb-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M3 9l4.5 4.5L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
              </svg>
            </div>
            <p className="text-foreground font-medium">You're in the vault.</p>
            <p className="text-muted-foreground text-sm">We'll reach you when the next briefing is ready.</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            data-testid="form-subscribe"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 bg-background border border-border/60 focus:border-primary/60 outline-none px-4 py-3 text-sm placeholder:text-muted-foreground/50 transition-colors duration-200"
              data-testid="input-subscribe-email"
            />
            <button
              type="submit"
              disabled={subscribe.isPending}
              className="bg-foreground text-background hover:bg-foreground/80 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 text-sm font-medium uppercase tracking-wider transition-colors duration-200 whitespace-nowrap"
              data-testid="button-subscribe-submit"
            >
              {subscribe.isPending ? "Sending..." : "Notify Me"}
            </button>
          </form>
        )}
        {subscribe.error && !submitted && (
          <p className="mt-3 text-sm text-destructive/80" data-testid="text-subscribe-error">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </section>
  );
}

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
            {GUIDES.map((guide) => (
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

      {/* Email Capture Section */}
      <EmailCapture />
    </Layout>
  );
}
