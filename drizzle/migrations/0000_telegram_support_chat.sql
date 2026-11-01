CREATE TABLE public.support_conversations (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), access_hash text NOT NULL UNIQUE, created_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.support_conversations TO service_role;
ALTER TABLE public.support_conversations ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.support_chat_messages (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), conversation_id uuid NOT NULL REFERENCES public.support_conversations(id) ON DELETE CASCADE, sender text NOT NULL CHECK (sender IN ('visitor','support')), body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000), telegram_message_id bigint UNIQUE, telegram_update_id bigint UNIQUE, created_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.support_chat_messages TO service_role;
ALTER TABLE public.support_chat_messages ENABLE ROW LEVEL SECURITY;
CREATE INDEX support_chat_messages_conversation_idx ON public.support_chat_messages(conversation_id, created_at);