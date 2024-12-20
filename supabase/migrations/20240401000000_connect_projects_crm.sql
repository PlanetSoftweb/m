-- Add project_id to leads table
ALTER TABLE leads
ADD COLUMN project_id uuid REFERENCES projects(id) ON DELETE CASCADE;

-- Add project_id to conversations table
ALTER TABLE conversations
ADD COLUMN project_id uuid REFERENCES projects(id) ON DELETE CASCADE;

-- Add project_id to lead_sources table
ALTER TABLE lead_sources
ADD COLUMN project_id uuid REFERENCES projects(id) ON DELETE CASCADE;

-- Add project_id to notifications table
ALTER TABLE notifications
ADD COLUMN project_id uuid REFERENCES projects(id) ON DELETE CASCADE;

-- Create indexes for project_id columns
CREATE INDEX leads_project_id_idx ON leads(project_id);
CREATE INDEX conversations_project_id_idx ON conversations(project_id);
CREATE INDEX lead_sources_project_id_idx ON lead_sources(project_id);
CREATE INDEX notifications_project_id_idx ON notifications(project_id);

-- Update RLS policies to include project_id checks
DROP POLICY IF EXISTS "Users can view their own leads" ON leads;
CREATE POLICY "Users can view their own leads"
  ON leads FOR SELECT
  USING (auth.uid() = user_id AND project_id = current_setting('app.current_project_id')::uuid);

DROP POLICY IF EXISTS "Users can view their own conversations" ON conversations;
CREATE POLICY "Users can view their own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id AND project_id = current_setting('app.current_project_id')::uuid);

DROP POLICY IF EXISTS "Users can view their own lead sources" ON lead_sources;
CREATE POLICY "Users can view their own lead sources"
  ON lead_sources FOR SELECT
  USING (auth.uid() = user_id AND project_id = current_setting('app.current_project_id')::uuid);

DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id AND project_id = current_setting('app.current_project_id')::uuid);

-- Create function to set current project context
CREATE OR REPLACE FUNCTION set_current_project(project_id uuid)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_project_id', project_id::text, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
