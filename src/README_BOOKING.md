# Park Guide Booking System

This document provides detailed information about the park guide booking system implemented in the Terra Guide application.

## Overview

The park guide booking system allows visitors to:
1. View park guides on the homepage and dedicated guides page
2. Book a specific guide for a tour on a specific date
3. Provide their contact information and special requests

Park guides can:
1. Receive notifications when new bookings are made
2. View and manage their bookings
3. Update booking status (confirm, complete, or cancel)

## Database Structure

The booking system uses a `guide_bookings` table with the following structure:

```sql
CREATE TABLE guide_bookings (
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
```

## Setup Instructions

1. Execute the SQL script at `src/supabase/sql/setup_booking_system.sql` in the Supabase SQL editor
2. This will create:
   - The `guide_bookings` table
   - Functions and triggers for guide username updates
   - Functions and triggers for booking notifications
   - Row Level Security (RLS) policies for data access control

## Components

### Data Handling
- `src/data/parkGuideData.js`: Handles fetching park guides from the database
- `src/data/bookingData.js`: Provides functionality for creating and managing bookings

### Pages
- `src/Pages/Guide.jsx`: Displays all park guides with booking buttons
- `src/Pages/Booking/BookGuide.jsx`: Form for booking a specific guide
- `src/Pages/Booking/GuideBookings.jsx`: Dashboard for guides to manage their bookings

### Notifications
- `src/components/GlobalNotificationListener.jsx`: Listens for new booking notifications

## Booking Flow

1. **Visitor views guides**:
   - On homepage (`/index`) - Shows up to 3 guides
   - On guides page (`/guide`) - Shows all guides

2. **Visitor books a guide**:
   - Clicks "Book this Guide" button
   - Redirected to `/book-guide/:guideId`
   - Fills out booking form with name, contact, date, and optional message
   - Submits form

3. **Guide receives notification**:
   - Real-time notification appears for the guide
   - Booking appears in the guide's booking dashboard (`/my-bookings`)

4. **Guide manages booking**:
   - Views booking details
   - Updates status (confirm, complete, or cancel)

## Booking Statuses

- **Pending**: Initial status when a booking is created
- **Confirmed**: Guide has accepted and confirmed the booking
- **Completed**: Tour has been completed
- **Cancelled**: Booking has been cancelled

## Security

- Row Level Security (RLS) policies ensure guides can only see their own bookings
- Admin users can view all bookings
- Booking creation is allowed for both authenticated and anonymous users

## Future Enhancements

Potential future enhancements for the booking system:
1. Email notifications for guides and guests
2. Calendar view for bookings
3. Payment integration
4. Booking availability management
5. Guest reviews and ratings 