import { useEffect, useRef, useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { MessageCircle, Send, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { readSupportMessages, sendSupportMessage } from '@/lib/support.functions';

type ChatMessage = { id: string; sender: string; body: string; created_at: string };

export function TelegramSupport() {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const end = useRef<HTMLDivElement>(null);
  const readMessages = useServerFn(readSupportMessages);
  const sendMessage = useServerFn(sendSupportMessage);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('heritage-support-access');
      const value = stored && /^[a-f0-9]{64}$/.test(stored) ? stored : Array.from(crypto.getRandomValues(new Uint8Array(32)), n => n.toString(16).padStart(2, '0')).join('');
      localStorage.setItem('heritage-support-access', value);
      setToken(value);
    } catch {
      setToken(Array.from(crypto.getRandomValues(new Uint8Array(32)), n => n.toString(16).padStart(2, '0')).join(''));
    }
  }, []);

  useEffect(() => {
    if (!open || !token) return;
    let active = true;
    const refresh = async () => {
      try {
        const rows = await readMessages({ data: { token } });
        if (active) setMessages(rows);
      } catch {
        if (active) setError('Unable to load messages. Please try again.');
      }
    };
    void refresh();
    const interval = setInterval(refresh, 4000);
    return () => { active = false; clearInterval(interval); };
  }, [open, token, readMessages]);

  useEffect(() => { end.current?.scrollIntoView({ block: 'nearest' }); }, [messages.length, open]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const body = draft.trim();
    if (!body || body.length > 2000 || sending || !token) return;
    setSending(true);
    setError('');
    try {
      await sendMessage({ data: { token, body } });
      setDraft('');
      setMessages(await readMessages({ data: { token } }));
    } catch {
      setError('Telegram support is temporarily unavailable. Please email heritagebsupport@gmail.com.');
    } finally { setSending(false); }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <section aria-label="Telegram support chat" className="flex h-[430px] max-h-[calc(100dvh-110px)] w-[350px] max-w-[calc(100vw-40px)] flex-col overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-xl">
          <header className="flex shrink-0 items-center gap-3 border-b border-border bg-surface-deep px-4 py-3">
            <MessageCircle className="size-6 text-primary" />
            <div className="min-w-0 flex-1"><h2 className="text-sm font-semibold">Heritage Bank Support</h2><p className="text-xs text-muted-foreground">Telegram</p></div>
            <Button variant="ghost" size="icon" aria-label="Close support chat" title="Close chat" onClick={() => setOpen(false)}><X /></Button>
          </header>
          <div role="log" aria-live="polite" aria-label="Support messages" className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
            <p className="w-fit max-w-[90%] rounded-lg bg-secondary px-3 py-2 text-sm">Welcome to Heritage Bank. How can we help you?</p>
            {messages.map(message => (
              <div key={message.id} className={`w-fit max-w-[90%] rounded-lg px-3 py-2 ${message.sender === 'visitor' ? 'ml-auto bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                <p className="whitespace-pre-wrap break-words text-sm">{message.body}</p>
                <time className="mt-1 block text-right text-[10px] opacity-70" dateTime={message.created_at}>{new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>
              </div>
            ))}
            <div ref={end} />
          </div>
          {error && <div role="alert" className="px-4 pb-3 text-xs text-destructive">{error} <a href="mailto:heritagebsupport@gmail.com" className="text-primary underline">Email support</a></div>}
          <form onSubmit={submit} className="flex shrink-0 gap-2 border-t border-border p-3">
            <Input aria-label="Support message" placeholder="Your message…" maxLength={2000} value={draft} onChange={event => setDraft(event.target.value)} disabled={sending} autoComplete="off" />
            <Button type="submit" size="icon" disabled={!draft.trim() || sending || !token} aria-label="Send support message" title="Send message">{sending ? <Loader2 className="motion-safe:animate-spin" /> : <Send />}</Button>
          </form>
        </section>
      )}
      <Button size="icon" className="h-12 w-12 rounded-full border border-primary/40 shadow-lg" aria-label={open ? 'Close Telegram support' : 'Open Telegram support'} aria-expanded={open} title="Telegram support" onClick={() => setOpen(!open)}>{open ? <X className="size-5" /> : <MessageCircle className="size-5" />}</Button>
    </div>
  );
}