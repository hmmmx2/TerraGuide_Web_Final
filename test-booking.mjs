// Script to test booking functionality
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with the same credentials from the app
const supabase = createClient(
  'https://wxvnjjxbvbevwmvqyack.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4dm5qanhidmJldndtdnF5YWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMDYyMDAsImV4cCI6MjA2MTc4MjIwMH0.-Lstafz3cOl5KHuCpKgG-Xt9zRi12aJDqZr0mdHMzXc'
);

async function testBookingSystem() {
  console.log('Testing booking system...');
  
  // 1. Check if guide_bookings table exists by querying it
  try {
    console.log('Checking guide_bookings table...');
    const { data: bookings, error: bookingsError } = await supabase
      .from('guide_bookings')
      .select('*')
      .limit(5);
    
    if (bookingsError) {
      console.error('Error accessing guide_bookings table:', bookingsError);
    } else {
      console.log('guide_bookings table exists');
      console.log('Current data:', bookings);
    }
  } catch (err) {
    console.error('Exception checking guide_bookings:', err);
  }
  
  // 2. Try to insert a test booking with { returning: 'minimal' }
  try {
    console.log('\nAttempting to insert a test booking with { returning: "minimal" }...');
    const bookingId = `TEST-${Date.now().toString(36)}`;
    const { data: insertResult, error: insertError } = await supabase
      .from('guide_bookings')
      .insert([
        {
          booking_id: bookingId,
          guide_id: '00000000-0000-0000-0000-000000000000', // Placeholder UUID
          guest_name: 'Test Guest',
          contact_number: '1234567890',
          booking_date: new Date().toISOString().split('T')[0],
          status: 'test',
          created_at: new Date().toISOString()
        }
      ], { returning: 'minimal' });
    
    if (insertError) {
      console.error('Error inserting test booking:', insertError);
    } else {
      console.log('Test booking inserted successfully:', insertResult);
      console.log('Booking ID:', bookingId);
    }
    
    // Check if the booking was actually inserted
    console.log('\nVerifying if test booking was inserted...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('guide_bookings')
      .select('*')
      .eq('booking_id', bookingId);
    
    if (verifyError) {
      console.error('Error verifying test booking:', verifyError);
    } else {
      console.log('Verification result:', verifyData);
      if (verifyData && verifyData.length > 0) {
        console.log('Test booking was successfully inserted and retrieved');
      } else {
        console.log('Test booking was not found in the database');
      }
    }
  } catch (err) {
    console.error('Exception during test booking insertion:', err);
  }
}

// Run the test
testBookingSystem().catch(err => {
  console.error('Top-level error:', err);
});