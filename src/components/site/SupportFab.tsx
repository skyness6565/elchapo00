import { useEffect, useState } from "react";
import { MessageCircle, X, Mail } from "lucide-react";

const EMAIL = "nelsonthunder100@gmail.com";

export function SupportFab() {
  const [open, setOpen] = useState(false);
  const [smartsuppReady, setSmartsuppReady] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const container = document.getElementById("smartsupp-widget-container");
      setSmartsuppReady(!!container && container.getBoundingClientRect().height > 0);
    }, 1500);
    return () => window.clearInterval(timer);
  }, []);

  if (smartsuppReady) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="animate-in fade-in slide-in-from-bottom-2 w-64 rounded-xl border border-border/60 bg-card p-4 shadow-xl duration-200">
          <p className="text-sm font-semibold text-foreground">24/7 Customer Support</p>
          <p className="mt-1 text-xs text-muted-foreground">We usually reply within minutes.</p>
          <div className="mt-3 space-y-2">
            <a
              href={`mailto:${EMAIL}`}
              className="flex items-center gap-2 rounded-md border border-border/60 px-3 py-2 text-sm text-foreground transition-colors hover:border-primary/60 hover:text-primary"
            >
              <Mail className="h-4 w-4" /> Email support
            </a>
          </div>
        </div>
      )}
      <button
        type="button"
        aria-label="Open support chat"
        onClick={() => {
          const api = (window as unknown as { smartsupp?: (...a: unknown[]) => void }).smartsupp;
          if (api) {
            api("chat:show");
            api("chat:open");
          }
          setOpen((value) => !value);
        }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform duration-200 hover:scale-105"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
