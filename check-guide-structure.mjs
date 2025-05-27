// Script to check the structure of the park_guides table
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with the same credentials from the app
const supabase = createClient(
  'https://wxvnjjxbvbevwmvqyack.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4dm5qanhidmJldndtdnF5YWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMDYyMDAsImV4cCI6MjA2MTc4MjIwMH0.-Lstafz3cOl5KHuCpKgG-Xt9zRi12aJDqZr0mdHMzXc'
);

async function checkGuideStructure() {
  console.log('Checking park_guides table structure...');
  
  // First, check if the table exists and what columns it has
  try {
    console.log('Fetching a sample from park_guides table to see columns...');
    const { data: guides, error: guidesError } = await supabase
      .from('park_guides')
      .select('*')
      .limit(1);
    
    if (guidesError) {
      console.error('Error accessing park_guides table:', guidesError);
    } else {
      console.log('park_guides table exists');
      if (guides && guides.length > 0) {
        console.log('Columns in park_guides table:', Object.keys(guides[0]));
        console.log('Sample guide data:', guides[0]);
      } else {
        console.log('No guides found in the database');
      }
    }
  } catch (err) {
    console.error('Exception checking park_guides:', err);
  }
  
  // Now check the guide_bookings table structure
  try {
    console.log('\nFetching a sample from guide_bookings table to see columns...');
    const { data: bookings, error: bookingsError } = await supabase
      .from('guide_bookings')
      .select('*')
      .limit(1);
    
    if (bookingsError) {
      console.error('Error accessing guide_bookings table:', bookingsError);
    } else {
      console.log('guide_bookings table exists');
      if (bookings && bookings.length > 0) {
        console.log('Columns in guide_bookings table:', Object.keys(bookings[0]));
        console.log('Sample booking data:', bookings[0]);
      } else {
        console.log('No bookings found in the database');
      }
    }
  } catch (err) {
    console.error('Exception checking guide_bookings:', err);
  }
}

// Run the check
checkGuideStructure().catch(err => {
  console.error('Top-level error:', err);
});