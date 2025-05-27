-- SQL script to set up the booking system
-- This should be executed in the Supabase SQL editor

-- Create the guide_bookings table if it doesn't exist
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

-- Create a function to update guide_username when a booking is created
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

-- Create a function to create the bookings table if it doesn't exist
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

-- Create RLS policies for guide_bookings table
ALTER TABLE guide_bookings ENABLE ROW LEVEL SECURITY;

-- Policy for park guides to see only their own bookings
CREATE POLICY guide_bookings_guide_policy ON guide_bookings
  FOR ALL
  TO authenticated
  USING (guide_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin');

-- Policy to allow insertion by anyone (for guest bookings)
CREATE POLICY guide_bookings_insert_policy ON guide_bookings
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Function to update the updated_at timestamp when a booking is updated
CREATE OR REPLACE FUNCTION update_booking_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update timestamp
CREATE TRIGGER update_booking_timestamp
BEFORE UPDATE ON guide_bookings
FOR EACH ROW
EXECUTE FUNCTION update_booking_timestamp();

-- Create notification function for new bookings
CREATE OR REPLACE FUNCTION notify_guide_on_booking()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'guide-bookings-' || NEW.guide_id,
    json_build_object(
      'booking_id', NEW.booking_id,
      'guide_id', NEW.guide_id,
      'guest_name', NEW.guest_name,
      'booking_date', NEW.booking_date
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for booking notifications
CREATE TRIGGER notify_guide_on_booking
AFTER INSERT ON guide_bookings
FOR EACH ROW
EXECUTE FUNCTION notify_guide_on_booking(); 