import { useState, useEffect, useRef } from "react";
import { useAdminLogin, useAdminLogout, useGetAdminStatus, useGetGuidesStatus, useListSubscribers } from "@workspace/api-client-react";
import { apiUrl } from "@/lib/api-url";

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const login = useAdminLogin();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    login.mutate(
      { data: { password } },
      {
        onSuccess: (data) => {
          if (data.authenticated) onSuccess();
        },
        onError: () => setError("Invalid password"),
      }
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-primary block mb-3">EverydayGenius</span>
          <h1 className="text-3xl font-serif font-bold">Admin Access</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4" data-testid="form-admin-login">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full bg-background border border-border/60 focus:border-primary/60 outline-none px-4 py-3 text-sm placeholder:text-muted-foreground/40 transition-colors"
            data-testid="input-admin-password"
          />
          {error && (
            <p className="text-sm text-destructive font-mono" data-testid="text-admin-error">{error}</p>
          )}
          <button
            type="submit"
            disabled={login.isPending}
            className="w-full bg-foreground text-background hover:bg-foreground/85 disabled:opacity-50 py-3 text-sm font-bold uppercase tracking-widest transition-colors"
            data-testid="button-admin-login"
          >
            {login.isPending ? "Checking..." : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}

interface GuideStatus {
  id: string;
  title: string;
  hasFile: boolean;
  fileName?: string | null;
}

function GuideUploadCard({ guide, onUploaded }: { guide: GuideStatus; onUploaded: () => void }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(apiUrl(`/api/guides/${guide.id}/upload`), {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        setUploadError(data.error ?? "Upload failed");
      } else {
        setUploadSuccess(true);
        onUploaded();
      }
    } catch {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="border border-border/50 p-6 space-y-4" data-testid={`card-guide-${guide.id}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-primary block mb-1">
            SECRET KNOWLEDGE
          </span>
          <h3 className="font-serif font-bold text-lg leading-snug">{guide.title}</h3>
        </div>
        <div className={`shrink-0 px-2 py-1 border text-[10px] font-mono uppercase tracking-widest ${
          guide.hasFile || uploadSuccess
            ? "border-primary/40 text-primary bg-primary/5"
            : "border-border/40 text-muted-foreground"
        }`}>
          {guide.hasFile || uploadSuccess ? "Uploaded" : "No File"}
        </div>
      </div>

      {(guide.fileName || uploadSuccess) && (
        <p className="text-xs text-muted-foreground font-mono" data-testid={`text-filename-${guide.id}`}>
          {uploadSuccess ? "File uploaded successfully" : guide.fileName}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
          data-testid={`input-file-${guide.id}`}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 border border-border/60 hover:border-primary/60 text-sm font-medium uppercase tracking-wider transition-colors disabled:opacity-50"
          data-testid={`button-upload-${guide.id}`}
        >
          {uploading ? "Uploading..." : guide.hasFile || uploadSuccess ? "Replace PDF" : "Upload PDF"}
        </button>
        {(guide.hasFile || uploadSuccess) && (
          <a
            href={apiUrl(`/api/guides/${guide.id}/download`)}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 text-sm font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            data-testid={`link-preview-${guide.id}`}
          >
            Preview
          </a>
        )}
      </div>

      {uploadError && (
        <p className="text-xs text-destructive font-mono" data-testid={`text-upload-error-${guide.id}`}>{uploadError}</p>
      )}
    </div>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const logout = useAdminLogout();
  const { data: guides, refetch: refetchGuides } = useGetGuidesStatus();
  const { data: subscribers } = useListSubscribers();

  function handleLogout() {
    logout.mutate(undefined, { onSuccess: onLogout });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-serif font-bold text-lg">EverydayGenius</span>
          <span className="text-muted-foreground/40">·</span>
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Admin</span>
        </div>
        <button
          onClick={handleLogout}
          disabled={logout.isPending}
          className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          data-testid="button-admin-logout"
        >
          Sign Out
        </button>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-3xl space-y-16">
        {/* Guides Section */}
        <section>
          <div className="flex items-end justify-between mb-8 border-b border-border/30 pb-4">
            <h2 className="text-2xl font-serif font-bold">Guide Files</h2>
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              {guides?.filter((g) => g.hasFile).length ?? 0} / {guides?.length ?? 0} uploaded
            </span>
          </div>
          <div className="space-y-4">
            {guides ? (
              guides.map((guide) => (
                <GuideUploadCard
                  key={guide.id}
                  guide={guide}
                  onUploaded={() => refetchGuides()}
                />
              ))
            ) : (
              <div className="text-muted-foreground font-mono text-sm">Loading...</div>
            )}
          </div>
        </section>

        {/* Subscribers Section */}
        <section>
          <div className="flex items-end justify-between mb-8 border-b border-border/30 pb-4">
            <h2 className="text-2xl font-serif font-bold">Subscribers</h2>
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              {subscribers?.length ?? 0} total
            </span>
          </div>
          {subscribers && subscribers.length > 0 ? (
            <div className="space-y-0 border border-border/40">
              {subscribers.map((sub, i) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between px-4 py-3 border-b border-border/30 last:border-0"
                  data-testid={`row-subscriber-${sub.id}`}
                >
                  <span className="text-sm font-mono">{sub.email}</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-border/30 py-12 text-center">
              <p className="text-muted-foreground/60 font-mono text-sm uppercase tracking-wider">
                No subscribers yet
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default function Admin() {
  const { data: statusData, isLoading } = useGetAdminStatus();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (statusData?.authenticated) {
      setAuthenticated(true);
    }
  }, [statusData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground animate-pulse">
          Checking access...
        </span>
      </div>
    );
  }

  if (!authenticated) {
    return <LoginForm onSuccess={() => setAuthenticated(true)} />;
  }

  return <AdminDashboard onLogout={() => setAuthenticated(false)} />;
}
