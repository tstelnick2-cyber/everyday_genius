import React from "react";
import { Link } from "wouter";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans">
      <header className="border-b border-border/40 sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2" data-testid="link-home">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <span className="text-primary-foreground font-serif font-bold text-xl leading-none">E</span>
            </div>
            <span className="font-serif font-bold text-xl tracking-tight">EverydayGenius</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider" data-testid="link-nav-guides">
              The Vault
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border/40 py-12 md:py-20 mt-24">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-serif font-bold text-lg">EverydayGenius</span>
            <p className="text-sm text-muted-foreground">The knowledge that actually moves the needle.</p>
          </div>
          <div className="text-xs text-muted-foreground/60 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} EverydayGenius. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
