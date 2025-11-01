-- Add display_code column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS display_code VARCHAR(8) UNIQUE;

-- Create function to generate display code based on role
CREATE OR REPLACE FUNCTION generate_display_code(role_name TEXT)
RETURNS TEXT AS $$
DECLARE
  prefix TEXT;
  next_number INTEGER;
  new_code TEXT;
  role_upper TEXT;
BEGIN
  -- Convert role name to uppercase for processing
  role_upper := UPPER(role_name);
  
  -- Generate prefix: first and last character of role name
  prefix := SUBSTRING(role_upper, 1, 1) || SUBSTRING(role_upper, LENGTH(role_upper), 1);
  
  -- Get the next number for this prefix
  SELECT COALESCE(MAX(CAST(SUBSTRING(display_code, 3) AS INTEGER)), -1) + 1
  INTO next_number
  FROM users
  WHERE display_code LIKE prefix || '%';
  
  -- Format the code with 6-digit number
  new_code := prefix || LPAD(next_number::TEXT, 6, '0');
  
  RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Create function to automatically set display_code on insert
CREATE OR REPLACE FUNCTION set_display_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.display_code IS NULL THEN
    NEW.display_code := generate_display_code(NEW.role);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate display_code
DROP TRIGGER IF EXISTS trigger_set_display_code ON users;
CREATE TRIGGER trigger_set_display_code
  BEFORE INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION set_display_code();

-- Update existing users with display codes
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN SELECT id, role FROM users WHERE display_code IS NULL
  LOOP
    UPDATE users 
    SET display_code = generate_display_code(user_record.role)
    WHERE id = user_record.id;
  END LOOP;
END $$;

-- Example display codes based on roles:
-- Manager -> MG000000, MG000001, MG000002...
-- all_users -> AS000000, AS000001, AS000002...
-- digital -> DL000000, DL000001, DL000002...
-- commercial -> CL000000, CL000001, CL000002...

COMMENT ON COLUMN users.display_code IS 'Auto-generated display code: 2 chars (first+last of role) + 6-digit sequential number';
