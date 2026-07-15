import { useState, useEffect, useRef } from "react";
import { apiUrl } from "@/lib/api-url";

interface DownloadModalProps {
  guideId: string;
  title: string;
  onClose: () => void;
}

const STAGES = [
  { label: "Accessing the vault...", target: 24, duration: 1100 },
  { label: "Decrypting document...", target: 58, duration: 1300 },
  { label: "Verifying clearance level...", target: 84, duration: 1000 },
  { label: "Preparing your briefing...", target: 100, duration: 1200 },
];

export function DownloadModal({ guideId, title, onClose }: DownloadModalProps) {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [fileAvailable, setFileAvailable] = useState<boolean | null>(null);
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef<number>(0);
  const fromRef = useRef<number>(0);

  useEffect(() => {
    let cancelled = false;
    let currentStage = 0;
    let currentProgress = 0;

    function runStage(stageIdx: number, from: number) {
      if (cancelled) return;
      const stage = STAGES[stageIdx];
      setStageIndex(stageIdx);
      const to = stage.target;
      const dur = stage.duration;
      startRef.current = performance.now();
      fromRef.current = from;

      function tick(now: number) {
        if (cancelled) return;
        const elapsed = now - startRef.current;
        const t = Math.min(elapsed / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = Math.round(fromRef.current + (to - fromRef.current) * eased);
        setProgress(val);
        currentProgress = val;

        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          if (stageIdx < STAGES.length - 1) {
            animRef.current = setTimeout(() => {
              runStage(stageIdx + 1, to);
            }, 180);
          } else {
            setDone(true);
          }
        }
      }
      requestAnimationFrame(tick);
    }

    runStage(0, 0);

    return () => {
      cancelled = true;
      if (animRef.current) clearTimeout(animRef.current);
    };
  }, []);

  useEffect(() => {
    if (done) {
      fetch(apiUrl(`/api/guides/${guideId}/download`), { method: "HEAD", credentials: "include" })
        .then((r) => setFileAvailable(r.ok))
        .catch(() => setFileAvailable(false));
    }
  }, [done, guideId]);

  function handleDownload() {
    const a = document.createElement("a");
    a.href = apiUrl(`/api/guides/${guideId}/download`);
    a.download = `${title}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(onClose, 800);
  }

  const stageLabel = done ? "Your briefing is ready." : STAGES[stageIndex]?.label ?? "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget && done) onClose(); }}
      data-testid="modal-download"
    >
      <div className="relative w-full max-w-md mx-4 bg-background border border-border/60 p-10 shadow-2xl">
        {/* Top line accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        {/* Header */}
        <div className="mb-10">
          <span className="font-mono text-[10px] uppercase tracking-widest text-primary block mb-3">
            SECRET KNOWLEDGE
          </span>
          <h3 className="text-xl font-serif font-bold leading-snug text-foreground">
            {title}
          </h3>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-px bg-border/40 w-full relative overflow-hidden mb-1">
            <div
              className="absolute inset-y-0 left-0 bg-primary transition-none"
              style={{ width: `${progress}%` }}
            />
            {/* Glow */}
            <div
              className="absolute inset-y-0 bg-primary/30 blur-sm transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span
              className="text-xs font-mono text-muted-foreground tracking-wider transition-all duration-300"
              data-testid="text-progress-stage"
            >
              {stageLabel}
            </span>
            <span className="text-xs font-mono text-primary" data-testid="text-progress-percent">
              {progress}%
            </span>
          </div>
        </div>

        {/* Stage indicators */}
        <div className="flex gap-2 mb-10">
          {STAGES.map((s, i) => (
            <div
              key={i}
              className={`flex-1 h-0.5 transition-all duration-500 ${
                done || i < stageIndex
                  ? "bg-primary"
                  : i === stageIndex
                  ? "bg-primary/50"
                  : "bg-border/30"
              }`}
            />
          ))}
        </div>

        {/* CTA */}
        {done ? (
          <div className="space-y-4">
            {fileAvailable === false ? (
              <div className="text-center">
                <p className="text-sm text-muted-foreground font-mono mb-2">
                  This guide is not yet available for download.
                </p>
                <button
                  onClick={onClose}
                  className="text-xs text-muted-foreground/60 hover:text-foreground underline transition-colors"
                  data-testid="button-modal-close"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={handleDownload}
                  className="w-full bg-foreground text-background hover:bg-foreground/85 py-4 text-sm font-bold uppercase tracking-widest transition-colors duration-200"
                  data-testid="button-modal-download"
                >
                  Download Now
                </button>
                <button
                  onClick={onClose}
                  className="w-full text-center text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                  data-testid="button-modal-cancel"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1 h-1 rounded-full bg-primary/60 animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            <span className="text-xs font-mono text-muted-foreground/60 uppercase tracking-wider">
              Processing secure transfer
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
