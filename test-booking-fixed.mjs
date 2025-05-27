// Script to test booking functionality with valid guide ID
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with the same credentials from the app
const supabase = createClient(
  'https://wxvnjjxbvbevwmvqyack.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4dm5qanhidmJldndtdnF5YWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMDYyMDAsImV4cCI6MjA2MTc4MjIwMH0.-Lstafz3cOl5KHuCpKgG-Xt9zRi12aJDqZr0mdHMzXc'
);

async function testBookingWithValidGuide() {
  console.log('Testing booking system with valid guide ID...');
  
  // 1. First, get a valid guide ID from the park_guides table
  let validGuideId = null;
  try {
    console.log('Fetching valid guide IDs from park_guides table...');
    const { data: guides, error: guidesError } = await supabase
      .from('park_guides')
      .select('user_id, username')
      .limit(5);
    
    if (guidesError) {
      console.error('Error accessing park_guides table:', guidesError);
      return;
    } else {
      console.log('Available guides:', guides);
      if (guides && guides.length > 0) {
        validGuideId = guides[0].user_id;
        console.log(`Selected guide ID: ${validGuideId} (${guides[0].username})`);
      } else {
        console.log('No guides found in the database');
        return;
      }
    }
  } catch (err) {
    console.error('Exception checking park_guides:', err);
    return;
  }
  
  if (!validGuideId) {
    console.log('No valid guide ID found, cannot proceed with test');
    return;
  }
  
  // 2. Try to insert a test booking with a valid guide ID and { returning: 'minimal' }
  try {
    console.log('\nAttempting to insert a test booking with valid guide ID and { returning: "minimal" }...');
    const bookingId = `TEST-${Date.now().toString(36)}`;
    const { data: insertResult, error: insertError } = await supabase
      .from('guide_bookings')
      .insert([
        {
          booking_id: bookingId,
          guide_id: validGuideId,
          guest_name: 'Test Guest',
          contact_number: '1234567890',
          booking_date: new Date().toISOString().split('T')[0],
          status: 'test',
          created_at: new Date().toISOString(),
          user_id: validGuideId // Adding user_id as well since it might be required
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
testBookingWithValidGuide().catch(err => {
  console.error('Top-level error:', err);
});