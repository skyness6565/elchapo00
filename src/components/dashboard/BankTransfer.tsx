import { useId, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Download, Globe2, Loader2, Printer, Share2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { internationalFee, localFee, money } from "@/lib/bank";
import type { Profile, Transaction } from "@/lib/bank";
import { downloadReceipt, printReceipt, shareReceipt } from "@/lib/receipt";
import { OtpDialog } from "@/components/dashboard/OtpDialog";

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "NGN", "ZAR", "JPY"];

type Form = Record<string, string>;

export function BankTransfer({ profile }: { profile: Profile }) {
  const queryClient = useQueryClient();
  const [receipt, setReceipt] = useState<Transaction | null>(null);
  const [receiptUnavailable, setReceiptUnavailable] = useState(false);
  const [local, setLocal] = useState<Form>({
    bank_name: "",
    account_number: "",
    account_name: "",
    amount: "",
    narration: "",
  });
  const [intl, setIntl] = useState<Form>({
    country: "",
    bank_name: "",
    swift: "",
    iban: "",
    account_number: "",
    account_name: "",
    currency: "USD",
    amount: "",
    purpose: "",
    description: "",
  });
  const [saveBeneficiary, setSaveBeneficiary] = useState(false);

  const [otpKind, setOtpKind] = useState<"local" | "international" | null>(null);

  const submit = useMutation({
    mutationFn: async ({ kind, otp }: { kind: "local" | "international"; otp: string }) => {
      const form = kind === "local" ? local : intl;
      const amount = Number(form.amount);
      if (!amount || amount <= 0) throw new Error("Enter a valid amount");
      if (!form.account_name || !form.account_number || !form.bank_name)
        throw new Error("Complete the beneficiary details");
      const fee = kind === "local" ? localFee(amount) : internationalFee(amount);

      const { data, error } = await supabase.rpc("bank_transfer", {
        _amount: amount,
        _fee: fee,
        _bank_name: form.bank_name,
        _account_number: form.account_number,
        _account_name: form.account_name,
        _narration: kind === "local" ? form.narration : form.description,
        _country: kind === "local" ? "Domestic" : form.country,
        _swift: kind === "local" ? undefined : form.swift,
        _iban: kind === "local" ? undefined : form.iban,
        _currency: kind === "local" ? profile.currency : form.currency,
        _purpose: kind === "local" ? undefined : form.purpose,
        _kind: kind,
        _otp: otp,
      });
      if (error) throw error;

      if (saveBeneficiary) {
        const { error: beneficiaryError } = await supabase.from("beneficiaries").insert({
          user_id: profile.id,
          name: form.account_name,
          account_number: form.account_number,
          bank_name: form.bank_name,
          country: kind === "local" ? "Domestic" : form.country,
          swift_code: form.swift || null,
          iban: form.iban || null,
          kind,
        });
        if (beneficiaryError) toast.warning("Transfer completed, but the beneficiary could not be saved.");
      }

      const id = (data as { id: string }).id;
      const { data: tx, error: receiptError } = await supabase.from("transactions").select("*").eq("id", id).single();
      if (receiptError || !tx) return null;
      return tx as Transaction;
    },
    onSuccess: (tx) => {
      setOtpKind(null);
      setReceipt(tx);
      setReceiptUnavailable(!tx);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (receiptUnavailable) {
    return <div className="rounded-xl border border-border/50 bg-card p-8 text-center">
      <CheckCircle2 className="mx-auto size-10 text-primary" />
      <h3 className="mt-4 text-2xl font-bold">Transfer Completed</h3>
      <p className="mt-3 text-muted-foreground">Your transfer succeeded. The receipt is temporarily unavailable; check Transaction History. Do not repeat this transfer.</p>
      <Button variant="ghost" className="mt-4" onClick={() => setReceiptUnavailable(false)}>New transfer</Button>
    </div>;
  }

  if (receipt) {
    return (
      <div className="animate-in fade-in zoom-in-95 rounded-xl border border-border/50 bg-card p-8 text-center duration-500">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 text-primary">
          <CheckCircle2 className="h-10 w-10" />
        </span>
        <h3 className="mt-6 text-2xl font-bold text-foreground">Transfer Completed</h3>
        <p className="mt-2 text-muted-foreground">
          {money(receipt.amount, receipt.currency)} sent to {receipt.counterparty_name}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Transaction ID: {receipt.reference}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={() => downloadReceipt(receipt, profile)}>
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
          <Button variant="outline" onClick={() => printReceipt(receipt, profile)}>
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              const shared = await shareReceipt(receipt, profile);
              if (!shared) toast.success("Receipt details copied to clipboard");
            }}
          >
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
        </div>
        <Button variant="ghost" className="mt-4" onClick={() => setReceipt(null)}>
          New transfer
        </Button>
      </div>
    );
  }

  const intlAmount = Number(intl.amount) || 0;
  const intlFee = internationalFee(intlAmount);
  const localAmount = Number(local.amount) || 0;

  return (
    <div className="rounded-xl border border-border/50 bg-card p-6">
      <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
        <Globe2 className="h-5 w-5 text-primary" /> Bank Transfer
      </h3>

      <Tabs defaultValue="local" className="mt-5">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="local">Local Transfer</TabsTrigger>
          <TabsTrigger value="international">International Transfer</TabsTrigger>
        </TabsList>

        <TabsContent value="local" className="animate-in fade-in mt-6 space-y-4 duration-300">
          <Field label="Bank Name" value={local.bank_name} onChange={(v) => setLocal({ ...local, bank_name: v })} />
          <Field label="Account Number" value={local.account_number} onChange={(v) => setLocal({ ...local, account_number: v })} />
          <Field label="Account Name" value={local.account_name} onChange={(v) => setLocal({ ...local, account_name: v })} />
          <Field label="Amount" type="number" value={local.amount} onChange={(v) => setLocal({ ...local, amount: v })} />
          <div className="space-y-2">
            <Label>Narration</Label>
            <Textarea value={local.narration} onChange={(e) => setLocal({ ...local, narration: e.target.value })} />
          </div>
          <Summary
            rows={[
              ["Amount", money(localAmount, profile.currency)],
              ["Transfer fee", money(localFee(localAmount), profile.currency)],
              ["Total debit", money(localAmount + localFee(localAmount), profile.currency)],
            ]}
          />
          <SaveBeneficiary checked={saveBeneficiary} onChange={setSaveBeneficiary} />
          <Button className="w-full" disabled={submit.isPending} onClick={() => setOtpKind("local")}>
            {submit.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Transfer"}
          </Button>
        </TabsContent>

        <TabsContent value="international" className="animate-in fade-in mt-6 space-y-4 duration-300">
          <Field label="Country" value={intl.country} onChange={(v) => setIntl({ ...intl, country: v })} />
          <Field label="Bank Name" value={intl.bank_name} onChange={(v) => setIntl({ ...intl, bank_name: v })} />
          <Field label="SWIFT / BIC Code" value={intl.swift} onChange={(v) => setIntl({ ...intl, swift: v })} />
          <Field label="IBAN (where applicable)" value={intl.iban} onChange={(v) => setIntl({ ...intl, iban: v })} />
          <Field label="Account Number" value={intl.account_number} onChange={(v) => setIntl({ ...intl, account_number: v })} />
          <Field label="Beneficiary Name" value={intl.account_name} onChange={(v) => setIntl({ ...intl, account_name: v })} />
          <div className="space-y-2">
            <Label>Currency</Label>
            <select
              value={intl.currency}
              onChange={(e) => setIntl({ ...intl, currency: e.target.value })}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              {CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>
          <Field label="Amount" type="number" value={intl.amount} onChange={(v) => setIntl({ ...intl, amount: v })} />
          <Field label="Purpose of Payment" value={intl.purpose} onChange={(v) => setIntl({ ...intl, purpose: v })} />
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={intl.description} onChange={(e) => setIntl({ ...intl, description: e.target.value })} />
          </div>
          <Summary
            rows={[
              ["Amount", money(intlAmount, intl.currency)],
              ["Transfer fee", money(intlFee, intl.currency)],
              ["Total debit", money(intlAmount + intlFee, intl.currency)],
            ]}
          />
          <SaveBeneficiary checked={saveBeneficiary} onChange={setSaveBeneficiary} />
          <Button className="w-full" disabled={submit.isPending} onClick={() => setOtpKind("international")}>
            {submit.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send International Transfer"}
          </Button>
        </TabsContent>
      </Tabs>

      <OtpDialog
        open={otpKind !== null}
        amount={Number(otpKind === "international" ? intl.amount : local.amount)}
        purpose={otpKind === "international" ? "international_transfer" : "bank_transfer"}
        verifying={submit.isPending}
        onCancel={() => setOtpKind(null)}
        onVerify={(code) => otpKind && submit.mutate({ kind: otpKind, otp: code })}
      />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  const id = useId();
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function Summary({ rows }: { rows: [string, string][] }) {
  return (
    <div className="rounded-lg border border-border/50 bg-surface-deep p-4 text-sm">
      {rows.map(([label, value], index) => (
        <div
          key={label}
          className={`flex justify-between py-1 ${index === rows.length - 1 ? "mt-1 border-t border-border/40 pt-2 font-semibold text-foreground" : "text-muted-foreground"}`}
        >
          <span>{label}</span>
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
}

function SaveBeneficiary({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm text-muted-foreground">
      <Checkbox checked={checked} onCheckedChange={(value) => onChange(Boolean(value))} />
      Save beneficiary for future transfers
    </label>
  );
}
