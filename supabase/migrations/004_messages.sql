-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'teacher', 'support', 'student')),
  content TEXT NOT NULL,
  type TEXT CHECK (type IN ('text', 'file', 'image')) DEFAULT 'text',
  file_name TEXT,
  file_size TEXT,
  file_url TEXT,
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender);

-- Enable RLS on messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies for messages
CREATE POLICY "Users can view messages in their conversations" ON public.messages
  FOR SELECT USING (
    conversation_id LIKE 'student-' || auth.uid()::text OR
    conversation_id LIKE 'teacher-' || auth.uid()::text OR
    conversation_id LIKE 'support-' || auth.uid()::text
  );

CREATE POLICY "Users can insert messages in their conversations" ON public.messages
  FOR INSERT WITH CHECK (
    conversation_id LIKE 'student-' || auth.uid()::text OR
    conversation_id LIKE 'teacher-' || auth.uid()::text OR
    conversation_id LIKE 'support-' || auth.uid()::text
  );

CREATE POLICY "Users can update their own messages" ON public.messages
  FOR UPDATE USING (sender = 'user' OR sender = 'student' OR sender = 'teacher');

-- Create trigger for messages updated_at
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create conversations table for better conversation management
CREATE TABLE IF NOT EXISTS public.conversations (
  id TEXT PRIMARY KEY,
  type TEXT CHECK (type IN ('student-support', 'student-teacher', 'teacher-student')) NOT NULL,
  participant_1 UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  participant_2 UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  unread_count_1 INTEGER DEFAULT 0,
  unread_count_2 INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on conversations
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Create policies for conversations
CREATE POLICY "Users can view their conversations" ON public.conversations
  FOR SELECT USING (participant_1 = auth.uid() OR participant_2 = auth.uid());

CREATE POLICY "Users can update their conversations" ON public.conversations
  FOR UPDATE USING (participant_1 = auth.uid() OR participant_2 = auth.uid());

-- Create trigger for conversations updated_at
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update conversation metadata when new message is added
CREATE OR REPLACE FUNCTION public.update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET
    last_message = NEW.content,
    last_message_at = NEW.created_at,
    unread_count_1 = CASE
      WHEN participant_1 != auth.uid() THEN unread_count_1 + 1
      ELSE unread_count_1
    END,
    unread_count_2 = CASE
      WHEN participant_2 != auth.uid() THEN unread_count_2 + 1
      ELSE unread_count_2
    END,
    updated_at = TIMEZONE('utc'::text, NOW())
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for conversation updates
CREATE TRIGGER update_conversation_on_message_trigger
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_conversation_on_message();