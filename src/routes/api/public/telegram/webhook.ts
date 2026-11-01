import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const updateSchema = z.object({
  update_id: z.number().int(),
  message: z.object({
    message_id: z.number().int(),
    chat: z.object({ id: z.number().int() }),
    text: z.string().max(2000).optional(),
    reply_to_message: z.object({ message_id: z.number().int() }).optional(),
  }).optional(),
});

export const Route = createFileRoute('/api/public/telegram/webhook')({
  server: { handlers: { POST: async ({ request }) => {
    const token = process.env['TELEGRAM_BOT_TOKEN'];
    if (!token) return new Response('Unavailable', { status: 503 });
    const { validWebhook, supportChatId } = await import('@/lib/support.server');
    if (!validWebhook(request.headers.get('X-Telegram-Bot-Api-Secret-Token') ?? '', token)) return new Response('Unauthorized', { status: 401 });
    const update = updateSchema.safeParse(await request.json().catch(() => null));
    if (!update.success) return new Response('Invalid update', { status: 400 });
    const message = update.data.message;
    if (!message?.text?.trim() || !message.reply_to_message || String(message.chat.id) !== supportChatId) return Response.json({ ok: true, ignored: true });
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data: original, error } = await supabaseAdmin.from('support_chat_messages').select('conversation_id').eq('telegram_message_id', message.reply_to_message.message_id).eq('sender', 'visitor').maybeSingle();
    if (error) return new Response('Unable to match reply', { status: 500 });
    if (!original) return Response.json({ ok: true, ignored: true });
    const { error: saveError } = await supabaseAdmin.from('support_chat_messages').upsert({ conversation_id: original.conversation_id, sender: 'support', body: message.text.trim(), telegram_update_id: update.data.update_id }, { onConflict: 'telegram_update_id', ignoreDuplicates: true });
    if (saveError) return new Response('Unable to save reply', { status: 500 });
    return Response.json({ ok: true });
  } } },
});