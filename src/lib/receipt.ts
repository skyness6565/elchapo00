import { jsPDF } from "jspdf";

import { CATEGORY_LABELS, formatDate, formatTime, money } from "@/lib/bank";
import type { Profile, Transaction } from "@/lib/bank";

const NAVY: [number, number, number] = [10, 22, 44];
const GOLD: [number, number, number] = [198, 160, 78];
const GREY: [number, number, number] = [110, 118, 132];

function header(doc: jsPDF, subtitle: string) {
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, 210, 34, "F");

  doc.setFillColor(...GOLD);
  doc.circle(20, 17, 7, "F");
  doc.setTextColor(...NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("H", 20, 19.5, { align: "center" });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text("HERITAGE BANK", 32, 15);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GOLD);
  doc.text("Banking Excellence Since 1885", 32, 21);
  doc.setTextColor(230, 232, 238);
  doc.text(subtitle, 190, 21, { align: "right" });
}

function watermark(doc: jsPDF) {
  doc.saveGraphicsState();
  // @ts-expect-error GState is provided by jsPDF at runtime
  doc.setGState(new doc.GState({ opacity: 0.07 }));
  doc.setTextColor(...NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(40);
  doc.text("HERITAGE BANK", 100, 170, { align: "center", angle: 30 });
  doc.restoreGraphicsState();
}

function footer(doc: jsPDF) {
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.6);
  doc.line(15, 275, 195, 275);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...GREY);
  doc.text(
    "Heritage Bank · 8001 South Orange Blossom Trail, Orlando, FL 32809 · nelsonthunder100@gmail.com",
    105,
    281,
    { align: "center" },
  );
  doc.text("This document was generated electronically and is valid without a signature.", 105, 286, {
    align: "center",
  });
}

function rows(doc: jsPDF, entries: [string, string][], startY: number) {
  let y = startY;
  entries.forEach(([label, value], index) => {
    if (index % 2 === 0) {
      doc.setFillColor(245, 246, 249);
      doc.rect(15, y - 5.5, 180, 9, "F");
    }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...GREY);
    doc.text(label, 20, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...NAVY);
    doc.text(value || "—", 190, y, { align: "right" });
    y += 9;
  });
  return y;
}

export function buildReceipt(tx: Transaction, profile: Profile): jsPDF {
  const doc = new jsPDF();
  header(doc, "Transfer Receipt");
  watermark(doc);

  doc.setTextColor(...NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("Transaction Receipt", 15, 48);

  doc.setFillColor(...GOLD);
  doc.roundedRect(150, 41, 45, 10, 2, 2, "F");
  doc.setFontSize(9);
  doc.setTextColor(...NAVY);
  doc.text(tx.status.toUpperCase(), 172.5, 47.5, { align: "center" });

  const total = Number(tx.amount) + Number(tx.fee ?? 0);
  const entries: [string, string][] = [
    ["Transaction ID", tx.reference],
    ["Date", formatDate(tx.created_at)],
    ["Time", formatTime(tx.created_at)],
    ["Type", CATEGORY_LABELS[tx.category] ?? tx.category],
    ["Sender Name", profile.full_name],
    ["Sender Account Number", profile.account_number],
    ["Beneficiary Name", tx.counterparty_name ?? "—"],
    ["Beneficiary Account", tx.counterparty_account ?? "—"],
    ["Beneficiary Bank", tx.counterparty_bank ?? "—"],
    ["Beneficiary Country", tx.counterparty_country ?? "—"],
    ["SWIFT / BIC Code", tx.swift_code ?? "—"],
    ["IBAN", tx.iban ?? "—"],
    ["Purpose of Payment", tx.purpose ?? "—"],
    ["Narration", tx.narration ?? tx.description ?? "—"],
    ["Currency", tx.currency],
    ["Amount", money(tx.amount, tx.currency)],
    ["Charges", money(tx.fee ?? 0, tx.currency)],
    ["Total Debit", money(total, tx.currency)],
    ["Balance After", tx.balance_after != null ? money(tx.balance_after, tx.currency) : "—"],
  ];

  const y = rows(doc, entries, 62);

  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.8);
  doc.roundedRect(15, y + 4, 180, 16, 2, 2);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...NAVY);
  doc.text("TOTAL", 20, y + 14);
  doc.text(money(total, tx.currency), 190, y + 14, { align: "right" });

  footer(doc);
  return doc;
}

export function downloadReceipt(tx: Transaction, profile: Profile) {
  buildReceipt(tx, profile).save(`heritage-receipt-${tx.reference}.pdf`);
}

export function printReceipt(tx: Transaction, profile: Profile) {
  const doc = buildReceipt(tx, profile);
  doc.autoPrint();
  const url = doc.output("bloburl");
  window.open(url as unknown as string, "_blank");
}

export async function shareReceipt(tx: Transaction, profile: Profile) {
  const doc = buildReceipt(tx, profile);
  const blob = doc.output("blob");
  const file = new File([blob], `heritage-receipt-${tx.reference}.pdf`, { type: "application/pdf" });
  const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean };
  if (nav.share && nav.canShare?.({ files: [file] })) {
    await nav.share({ files: [file], title: "Heritage Bank receipt", text: tx.reference });
    return true;
  }
  await navigator.clipboard.writeText(
    `Heritage Bank transaction ${tx.reference} — ${money(tx.amount, tx.currency)} to ${tx.counterparty_name ?? "beneficiary"}`,
  );
  return false;
}

export function exportStatementPdf(
  transactions: Transaction[],
  profile: Profile,
  title = "Account Statement",
) {
  const doc = new jsPDF();
  header(doc, title);
  watermark(doc);

  doc.setTextColor(...NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(title, 15, 48);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GREY);
  doc.text(`${profile.full_name} · ${profile.account_number} · ${profile.account_type}`, 15, 55);
  doc.text(`Available balance: ${money(profile.balance, profile.currency)}`, 15, 60);

  let y = 72;
  const cols = [16, 52, 92, 130, 158, 194];
  doc.setFillColor(...NAVY);
  doc.rect(15, y - 6, 180, 9, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  ["Date", "Reference", "Description", "Type", "Amount", "Balance"].forEach((label, i) => {
    doc.text(label, cols[i], y, { align: i >= 4 ? "right" : "left" });
  });
  y += 9;

  doc.setFont("helvetica", "normal");
  transactions.forEach((tx, index) => {
    if (y > 262) {
      footer(doc);
      doc.addPage();
      header(doc, title);
      watermark(doc);
      y = 48;
    }
    if (index % 2 === 0) {
      doc.setFillColor(245, 246, 249);
      doc.rect(15, y - 5, 180, 8, "F");
    }
    doc.setTextColor(...NAVY);
    doc.setFontSize(7.6);
    doc.text(formatDate(tx.created_at), cols[0], y);
    doc.text(tx.reference.slice(0, 16), cols[1], y);
    doc.text((tx.description ?? tx.counterparty_name ?? "—").slice(0, 24), cols[2], y);
    doc.text((CATEGORY_LABELS[tx.category] ?? tx.category).slice(0, 16), cols[3], y);
    doc.text(
      `${tx.direction === "credit" ? "+" : "-"}${money(Number(tx.amount) + Number(tx.fee ?? 0), tx.currency)}`,
      cols[4],
      y,
      { align: "right" },
    );
    doc.text(tx.balance_after != null ? money(tx.balance_after, tx.currency) : "—", cols[5], y, {
      align: "right",
    });
    y += 8;
  });

  footer(doc);
  doc.save(`heritage-statement-${Date.now()}.pdf`);
}

export function printStatement(transactions: Transaction[], profile: Profile) {
  const doc = new jsPDF();
  header(doc, "Account Statement");
  watermark(doc);
  doc.setTextColor(...NAVY);
  doc.setFontSize(12);
  doc.text(`${profile.full_name} — ${transactions.length} transactions`, 15, 50);
  let y = 62;
  transactions.forEach((tx) => {
    if (y > 268) {
      doc.addPage();
      header(doc, "Account Statement");
      y = 48;
    }
    doc.setFontSize(8);
    doc.text(
      `${formatDate(tx.created_at)}  ${tx.reference}  ${(tx.description ?? "—").slice(0, 30)}  ${tx.direction === "credit" ? "+" : "-"}${money(tx.amount, tx.currency)}`,
      15,
      y,
    );
    y += 7;
  });
  footer(doc);
  doc.autoPrint();
  window.open(doc.output("bloburl") as unknown as string, "_blank");
}

export function exportCsv(transactions: Transaction[]) {
  const head = [
    "Transaction ID",
    "Date",
    "Time",
    "Description",
    "Category",
    "Counterparty",
    "Direction",
    "Debit",
    "Credit",
    "Fee",
    "Currency",
    "Balance After",
    "Status",
  ];
  const lines = transactions.map((tx) =>
    [
      tx.reference,
      formatDate(tx.created_at),
      formatTime(tx.created_at),
      tx.description ?? "",
      CATEGORY_LABELS[tx.category] ?? tx.category,
      tx.counterparty_name ?? "",
      tx.direction,
      tx.direction === "debit" ? Number(tx.amount) + Number(tx.fee ?? 0) : "",
      tx.direction === "credit" ? Number(tx.amount) : "",
      Number(tx.fee ?? 0),
      tx.currency,
      tx.balance_after ?? "",
      tx.status,
    ]
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(","),
  );
  const blob = new Blob([[head.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `heritage-transactions-${Date.now()}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}
