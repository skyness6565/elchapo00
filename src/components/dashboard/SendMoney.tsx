import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2, Search, Send } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { money } from "@/lib/bank";
import type { Profile } from "@/lib/bank";
import { OtpDialog } from "@/components/dashboard/OtpDialog";

type Recipient = { id: string; full_name: string; username: string | null; account_number: string };

export function SendMoney({ profile }: { profile: Profile }) {
  const queryClient = useQueryClient();
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<Recipient[]>([]);
  const [searching, setSearching] = useState(false);
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");
  const [step, setStep] = useState<"form" | "confirm" | "done">("form");
  const [otpOpen, setOtpOpen] = useState(false);
  const searchVersion = useRef(0);

  async function search() {
    if (term.trim().length < 3) {
      toast.error("Enter at least 3 characters");
      return;
    }
    const version = ++searchVersion.current;
    setSearching(true);
    try {
      const { data, error } = await supabase.rpc("find_recipient", { _query: term.trim() });
      if (version !== searchVersion.current) return;
      if (error) throw error;
      setResults((data ?? []) as Recipient[]);
      if (!data?.length) toast.error("No Heritage Bank customer found");
    } catch {
      if (version === searchVersion.current) toast.error("Recipient search failed. Please try again.");
    } finally {
      if (version === searchVersion.current) setSearching(false);
    }
  }

  const transfer = useMutation({
    mutationFn: async (otp: string) => {
      if (!recipient) throw new Error("Select a recipient first");
      const { error } = await supabase.rpc("send_money", {
        _recipient_account: recipient.account_number,
        _amount: Number(amount),
        _description: description || undefined,
        _reference: reference || undefined,
        _otp: otp,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setOtpOpen(false);
      setStep("done");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function reset() {
    setStep("form");
    setRecipient(null);
    setResults([]);
    setTerm("");
    setAmount("");
    setDescription("");
    setReference("");
  }

  if (step === "done") {
    return (
      <div className="animate-in fade-in zoom-in-95 flex flex-col items-center rounded-xl border border-border/50 bg-card p-10 text-center duration-500">
        <span className="flex h-20 w-20 animate-bounce items-center justify-center rounded-full bg-primary/15 text-primary">
          <CheckCircle2 className="h-10 w-10" />
        </span>
        <h3 className="mt-6 text-2xl font-bold text-foreground">Transfer Successful</h3>
        <p className="mt-2 text-muted-foreground">
          {money(Number(amount), profile.currency)} sent to {recipient?.full_name}
        </p>
        <Button className="mt-6" onClick={reset}>
          Make another transfer
        </Button>
      </div>
    );
  }

  if (step === "confirm" && recipient) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-3 rounded-xl border border-border/50 bg-card p-6 duration-300">
        <h3 className="text-lg font-bold text-foreground">Confirm Transfer</h3>
        <dl className="mt-5 space-y-3 text-sm">
          {[
            ["Recipient", recipient.full_name],
            ["Account number", recipient.account_number],
            ["Amount", money(Number(amount), profile.currency)],
            ["Description", description || "—"],
            ["Reference", reference || "—"],
            ["Balance after", money(Number(profile.balance) - Number(amount), profile.currency)],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-border/40 pb-2">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="font-semibold text-foreground">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" onClick={() => setStep("form")} className="flex-1">
            Back
          </Button>
          <Button
            className="flex-1"
            disabled={transfer.isPending}
            onClick={() => setOtpOpen(true)}
          >
            {transfer.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm & Send"}
          </Button>
        </div>

        <OtpDialog
          open={otpOpen}
          amount={Number(amount)}
          purpose="internal_transfer"
          verifying={transfer.isPending}
          onCancel={() => setOtpOpen(false)}
          onVerify={(code) => transfer.mutate(code)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-xl border border-border/50 bg-card p-6">
      <div>
        <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
          <Send className="h-5 w-5 text-primary" /> Send Money
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Instant transfers between Heritage Bank customers.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Find recipient (account number, username or full name)</Label>
        <div className="flex gap-2">
          <Input
            value={term}
            onChange={(event) => { searchVersion.current += 1; setSearching(false); setResults([]); setRecipient(null); setTerm(event.target.value); }}
            onKeyDown={(event) => event.key === "Enter" && search()}
            placeholder="e.g. 0123456789"
          />
          <Button type="button" variant="secondary" onClick={search} disabled={searching} aria-label="Search recipient" title="Search recipient">
            {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setRecipient(item)}
              className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-all duration-300 hover:-translate-y-0.5 ${
                recipient?.id === item.id ? "border-primary bg-primary/10" : "border-border/50"
              }`}
            >
              <span>
                <span className="block font-semibold text-foreground">{item.full_name}</span>
                <span className="block text-xs text-muted-foreground">
                  @{item.username ?? "customer"} · {item.account_number}
                </span>
              </span>
              {recipient?.id === item.id && <CheckCircle2 className="h-5 w-5 text-primary" />}
            </button>
          ))}
        </div>
      )}

      {recipient && (
        <div className="animate-in fade-in space-y-4 duration-300">
          <div className="rounded-lg border border-primary/40 bg-primary/5 p-3 text-sm">
            Sending to <span className="font-semibold text-foreground">{recipient.full_name}</span>
          </div>
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(event) => setDescription(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Reference (optional)</Label>
            <Input value={reference} onChange={(event) => setReference(event.target.value)} />
          </div>
          <Button
            className="w-full"
            onClick={() => {
              if (!Number(amount) || Number(amount) <= 0) return toast.error("Enter a valid amount");
              if (Number(amount) > Number(profile.balance)) return toast.error("Insufficient funds");
              setStep("confirm");
            }}
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}
