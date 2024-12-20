-- Create a function to initialize project context
CREATE OR REPLACE FUNCTION initialize_project_context()
RETURNS void AS $$
BEGIN
  -- Create the app configuration if it doesn't exist
  PERFORM set_config('app.current_project_id', '', true);
EXCEPTION
  WHEN undefined_object THEN
    -- If the parameter doesn't exist, create it
    PERFORM set_config('app.current_project_id', '', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a more robust set_current_project function
CREATE OR REPLACE FUNCTION set_current_project(project_id uuid)
RETURNS void AS $$
BEGIN
  -- Initialize context if needed
  PERFORM initialize_project_context();
  
  -- Validate project exists and user has access
  IF EXISTS (
    SELECT 1 FROM projects 
    WHERE id = project_id 
    AND user_id = auth.uid()
  ) THEN
    PERFORM set_config('app.current_project_id', project_id::text, true);
  ELSE
    RAISE EXCEPTION 'Invalid project ID or insufficient permissions';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get current project
CREATE OR REPLACE FUNCTION get_current_project()
RETURNS uuid AS $$
DECLARE
  current_project uuid;
BEGIN
  SELECT current_setting('app.current_project_id', true)::uuid INTO current_project;
  RETURN current_project;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies to handle NULL project_id
DROP POLICY IF EXISTS "Users can view their own leads" ON leads;
CREATE POLICY "Users can view their own leads"
  ON leads FOR SELECT
  USING (
    auth.uid() = user_id 
    AND (
      project_id = get_current_project() 
      OR (project_id IS NULL AND get_current_project() IS NULL)
    )
  );

DROP POLICY IF EXISTS "Users can view their own conversations" ON conversations;
CREATE POLICY "Users can view their own conversations"
  ON conversations FOR SELECT
  USING (
    auth.uid() = user_id 
    AND (
      project_id = get_current_project() 
      OR (project_id IS NULL AND get_current_project() IS NULL)
    )
  );

DROP POLICY IF EXISTS "Users can view their own lead sources" ON lead_sources;
CREATE POLICY "Users can view their own lead sources"
  ON lead_sources FOR SELECT
  USING (
    auth.uid() = user_id 
    AND (
      project_id = get_current_project() 
      OR (project_id IS NULL AND get_current_project() IS NULL)
    )
  );

DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (
    auth.uid() = user_id 
    AND (
      project_id = get_current_project() 
      OR (project_id IS NULL AND get_current_project() IS NULL)
    )
  );

-- Create trigger to automatically set project_id on insert
CREATE OR REPLACE FUNCTION set_project_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.project_id = get_current_project();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to tables
DROP TRIGGER IF EXISTS set_lead_project_id ON leads;
CREATE TRIGGER set_lead_project_id
  BEFORE INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION set_project_id();

DROP TRIGGER IF EXISTS set_conversation_project_id ON conversations;
CREATE TRIGGER set_conversation_project_id
  BEFORE INSERT ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION set_project_id();

DROP TRIGGER IF EXISTS set_lead_source_project_id ON lead_sources;
CREATE TRIGGER set_lead_source_project_id
  BEFORE INSERT ON lead_sources
  FOR EACH ROW
  EXECUTE FUNCTION set_project_id();

DROP TRIGGER IF EXISTS set_notification_project_id ON notifications;
CREATE TRIGGER set_notification_project_id
  BEFORE INSERT ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION set_project_id();
