import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

const accessSchema = z.object({ token: z.string().regex(/^[a-f0-9]{64}$/) });

export const readSupportMessages = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => accessSchema.parse(input))
  .handler(async ({ data }) => {
    const { accessHash } = await import('./support.server');
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data: conversation, error } = await supabaseAdmin.from('support_conversations').select('id').eq('access_hash', accessHash(data.token)).maybeSingle();
    if (error) throw new Error('Unable to load support chat.');
    if (!conversation) return [];
    const { data: messages, error: messageError } = await supabaseAdmin.from('support_chat_messages').select('id,sender,body,created_at').eq('conversation_id', conversation.id).order('created_at', { ascending: false }).limit(100);
    if (messageError) throw new Error('Unable to load support messages.');
    return (messages ?? []).reverse();
  });

export const sendSupportMessage = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => accessSchema.extend({ body: z.string().trim().min(1).max(2000) }).parse(input))
  .handler(async ({ data }) => {
    const { accessHash, telegramSend } = await import('./support.server');
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data: conversation, error } = await supabaseAdmin.from('support_conversations').upsert({ access_hash: accessHash(data.token) }, { onConflict: 'access_hash' }).select('id').single();
    if (error || !conversation) throw new Error('Unable to start support chat.');
    const telegramId = await telegramSend(`Heritage Bank website support\nConversation ${conversation.id}\n\n${data.body}\n\nReply to this message to answer this visitor.`);
    const { error: saveError } = await supabaseAdmin.from('support_chat_messages').insert({ conversation_id: conversation.id, sender: 'visitor', body: data.body, telegram_message_id: telegramId });
    if (saveError) throw new Error('Message delivered, but chat could not be saved. Please contact support by email.');
    return { ok: true };
  });