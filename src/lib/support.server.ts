import { createHash, timingSafeEqual } from 'node:crypto';

export const supportChatId = '9133958736';

export function accessHash(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export function webhookSecret(token: string) {
  return createHash('sha256').update(`telegram-webhook:${token}`).digest('base64url');
}

export function validWebhook(actual: string, token: string) {
  const a = Buffer.from(actual);
  const b = Buffer.from(webhookSecret(token));
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function telegramSend(text: string) {
  const token = process.env['TELEGRAM_BOT_TOKEN'];
  if (!token) throw new Error('Telegram support is not configured.');
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: supportChatId, text, reply_markup: { force_reply: true } }),
    signal: AbortSignal.timeout(15000),
  });
  const result = await response.json().catch(() => ({ ok: false })) as { ok: boolean; description?: string; result?: { message_id: number } };
  if (!response.ok || !result.ok || !result.result) {
    // Do not log the request URL: Telegram includes the private bot token in it.
    throw new Error(`Telegram support [${response.status}]: ${result.description ?? 'Message delivery failed'}`);
  }
  return result.result.message_id;
}