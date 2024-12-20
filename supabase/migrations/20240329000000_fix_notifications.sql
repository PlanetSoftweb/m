-- Drop existing notifications table if it exists
DROP TABLE IF EXISTS notifications;

-- Create notifications table
CREATE TABLE notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  type text NOT NULL CHECK (type IN ('lead_due', 'lead_overdue', 'analytics', 'system')),
  title text NOT NULL,
  message text NOT NULL,
  timestamp timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_read boolean DEFAULT false,
  data jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX notifications_user_id_idx ON notifications(user_id);
CREATE INDEX notifications_timestamp_idx ON notifications(timestamp);
CREATE INDEX notifications_is_read_idx ON notifications(is_read);
CREATE INDEX notifications_type_idx ON notifications(type);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notifications"
  ON notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Add some initial notifications for testing
INSERT INTO notifications (user_id, type, title, message, data)
SELECT 
  auth.uid(),
  'system',
  'Welcome to Real Estate CRM',
  'Get started by adding your first lead',
  '{"action": "add_lead"}'::jsonb
FROM auth.users
WHERE auth.uid() IS NOT NULL;
