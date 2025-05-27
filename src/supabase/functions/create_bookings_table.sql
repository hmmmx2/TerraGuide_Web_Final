-- SQL to create the guide_bookings table
CREATE TABLE IF NOT EXISTS guide_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id VARCHAR(50) UNIQUE NOT NULL,
  guide_id UUID REFERENCES park_guides(user_id) ON DELETE CASCADE,
  guest_name VARCHAR(100) NOT NULL,
  contact_number VARCHAR(20) NOT NULL,
  booking_date DATE NOT NULL,
  message TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
); 