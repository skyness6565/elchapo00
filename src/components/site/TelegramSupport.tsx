import { useEffect, useRef, useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { MessageCircle, Send, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { readSupportMessages, sendSupportMessage } from '@/lib/support.functions';

type ChatMessage = { id: string; sender: string; body: string; created_at: string };
let sessionAccess = '';

export function TelegramSupport() {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(false);
  const log = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const keepAtBottom = useRef(true);
  const sendLock = useRef(false);
  const generation = useRef(0);
  const readMessages = useServerFn(readSupportMessages);
  const sendMessage = useServerFn(sendSupportMessage);
  const reader = useRef(readMessages);
  reader.current = readMessages;

  useEffect(() => {
    let stored = '';
    try { stored = localStorage.getItem('heritage-support-access') ?? ''; } catch { /* Session-only chat. */ }
    try {
      sessionAccess = /^[a-f0-9]{64}$/.test(stored) ? stored : sessionAccess || Array.from(crypto.getRandomValues(new Uint8Array(32)), n => n.toString(16).padStart(2, '0')).join('');
      try { localStorage.setItem('heritage-support-access', sessionAccess); } catch { /* Keep in-memory access. */ }
      setToken(sessionAccess);
    } catch { setError('Chat cannot connect in this browser. Please use email support.'); }
  }, []);

  useEffect(() => {
    if (!open || !token) return;
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    setLoading(true);
    const refresh = async () => {
      const requestGeneration = generation.current;
      try {
        if (document.visibilityState === 'hidden' || sendLock.current) return;
        const rows = await reader.current({ data: { token } });
        if (active && requestGeneration === generation.current) {
          setMessages(rows);
          setLoadError('');
        }
      } catch {
        if (active) setLoadError('Connection interrupted. Reconnecting…');
      } finally {
        if (active) {
          setLoading(false);
          timer = setTimeout(refresh, 4000);
        }
      }
    };
    void refresh();
    return () => { active = false; clearTimeout(timer); };
  }, [open, token]);

  useEffect(() => {
    if (open && keepAtBottom.current && log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;
    input.current?.focus({ preventScroll: true });
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); launcher.current?.focus({ preventScroll: true }); }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const body = draft.trim();
    if (!body || body.length > 2000 || sendLock.current || !token) return;
    sendLock.current = true;
    generation.current += 1;
    setSending(true);
    setError('');
    try {
      const result = await sendMessage({ data: { token, body } });
      setDraft('');
      keepAtBottom.current = true;
      if (result.warning) setError(result.warning);
      try {
        setMessages(await reader.current({ data: { token } }));
        setLoadError('');
      } catch { setLoadError('Message sent. Reconnecting to your chat history…'); }
    } catch {
      setError('Telegram support is temporarily unavailable. Please email heritagebsupport@gmail.com.');
    } finally {
      generation.current += 1;
      sendLock.current = false;
      setSending(false);
      requestAnimationFrame(() => input.current?.focus({ preventScroll: true }));
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <section aria-label="Telegram support chat" className="flex h-[430px] max-h-[calc(100dvh-110px)] w-[350px] max-w-[calc(100vw-40px)] flex-col overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-xl motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-200">
          <header className="flex shrink-0 items-center gap-3 border-b border-border bg-surface-deep px-4 py-3">
            <MessageCircle className="size-6 text-primary" />
            <div className="min-w-0 flex-1"><h2 className="text-sm font-semibold">Heritage Bank Support</h2><p className="text-xs text-muted-foreground">Telegram</p></div>
            <Button variant="ghost" size="icon" aria-label="Close support chat" title="Close chat" onClick={() => { setOpen(false); launcher.current?.focus({ preventScroll: true }); }}><X /></Button>
          </header>
          <div ref={log} role="log" aria-live="polite" aria-label="Support messages" onScroll={() => { const el = log.current; if (el) keepAtBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 60; }} className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-4">
            <p className="w-fit max-w-[90%] rounded-lg bg-secondary px-3 py-2 text-sm">Welcome to Heritage Bank. How can we help you?</p>
            {loading && <p role="status" className="flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="size-3 motion-safe:animate-spin" />Connecting…</p>}
            {messages.map(message => (
              <div key={message.id} className={`w-fit max-w-[90%] rounded-lg px-3 py-2 ${message.sender === 'visitor' ? 'ml-auto bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                <p className="whitespace-pre-wrap [overflow-wrap:anywhere] text-sm">{message.body}</p>
                <time className="mt-1 block text-right text-[10px] opacity-70" dateTime={message.created_at}>{new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>
              </div>
            ))}
          </div>
          {loadError && <p role="status" className="shrink-0 px-4 pb-2 text-xs text-muted-foreground">{loadError}</p>}
          {error && <div role="alert" className="shrink-0 px-4 pb-3 text-xs text-destructive [overflow-wrap:anywhere]">{error} <a href="mailto:heritagebsupport@gmail.com" className="text-primary underline">Email support</a></div>}
          <form onSubmit={submit} className="flex shrink-0 gap-2 border-t border-border p-3">
            <Input ref={input} aria-label="Support message" placeholder="Your message…" maxLength={2000} value={draft} onChange={event => setDraft(event.target.value)} disabled={sending} autoComplete="off" enterKeyHint="send" className="min-w-0" />
            <Button type="submit" size="icon" className="shrink-0" disabled={!draft.trim() || sending || !token} aria-label="Send support message" title="Send message">{sending ? <Loader2 className="motion-safe:animate-spin" /> : <Send />}</Button>
          </form>
        </section>
      )}
      <Button ref={launcher} size="icon" className="h-12 w-12 rounded-full border border-primary/40 shadow-lg" aria-label={open ? 'Close Telegram support' : 'Open Telegram support'} aria-expanded={open} title="Telegram support" onClick={() => { keepAtBottom.current = true; setOpen(!open); }}>{open ? <X className="size-5" /> : <MessageCircle className="size-5" />}</Button>
    </div>
  );
}