-- Function to create the guide_bookings table if it doesn't exist
CREATE OR REPLACE FUNCTION create_bookings_table_if_not_exists()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS guide_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id VARCHAR(50) UNIQUE NOT NULL,
    guide_id UUID REFERENCES park_guides(user_id) ON DELETE CASCADE,
    guide_username VARCHAR(100),
    guest_name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    booking_date DATE NOT NULL,
    message TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Create a trigger to update guide_username when a booking is created
  CREATE OR REPLACE FUNCTION update_guide_username()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.guide_username := (
      SELECT username 
      FROM park_guides 
      WHERE user_id = NEW.guide_id
    );
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
  
  -- Drop the trigger if it exists
  DROP TRIGGER IF EXISTS set_guide_username ON guide_bookings;
  
  -- Create the trigger
  CREATE TRIGGER set_guide_username
  BEFORE INSERT ON guide_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_guide_username();
END;
$$ LANGUAGE plpgsql; 