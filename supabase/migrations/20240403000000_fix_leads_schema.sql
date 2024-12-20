-- Add updated_at column to leads table
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now());

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for leads table
DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update RLS policies to handle project context
DROP POLICY IF EXISTS "Users can update their own leads" ON leads;
CREATE POLICY "Users can update their own leads"
  ON leads FOR UPDATE
  USING (
    auth.uid() = user_id 
    AND (
      project_id = get_current_project() 
      OR (project_id IS NULL AND get_current_project() IS NULL)
    )
  );

-- Create index for updated_at
CREATE INDEX IF NOT EXISTS leads_updated_at_idx ON leads(updated_at);
