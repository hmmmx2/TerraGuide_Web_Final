// Script to test booking functionality using service role client to bypass RLS
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with anon key (for reading)
const supabase = createClient(
  'https://wxvnjjxbvbevwmvqyack.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4dm5qanhidmJldndtdnF5YWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMDYyMDAsImV4cCI6MjA2MTc4MjIwMH0.-Lstafz3cOl5KHuCpKgG-Xt9zRi12aJDqZr0mdHMzXc'
);

// Initialize Supabase admin client with service role key (for bypassing RLS)
const supabaseAdmin = createClient(
  'https://wxvnjjxbvbevwmvqyack.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4dm5qanhidmJldndtdnF5YWNrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjIwNjIwMCwiZXhwIjoyMDYxNzgyMjAwfQ.9KKYFmxQH3eXW8TFONRsNXWw5Rw6_Fdpg43DLTmWVcw'
);

// Helper function to log detailed information
function logDetail(message, data) {
  console.log('='.repeat(50));
  console.log(message);
  console.log('-'.repeat(50));
  console.log(JSON.stringify(data, null, 2));
  console.log('='.repeat(50));
}

async function testBookingWithServiceRole() {
  console.log('\n\nTESTING BOOKING SYSTEM WITH SERVICE ROLE CLIENT');
  console.log('='.repeat(50));
  
  // 0. First, check if we can list all tables to verify connection
  try {
    console.log('\nListing all tables to verify connection...');
    const { data: tables, error: tablesError } = await supabaseAdmin
      .from('pg_catalog.pg_tables')
      .select('schemaname, tablename')
      .eq('schemaname', 'public');
    
    if (tablesError) {
      console.error('Error listing tables:', tablesError);
    } else {
      logDetail('Available tables in public schema:', tables);
    }
  } catch (err) {
    console.error('Exception listing tables:', err);
  }
  
  // 1. Check the structure of guide_bookings table
  try {
    console.log('\nChecking structure of guide_bookings table...');
    const { data: columns, error: columnsError } = await supabaseAdmin
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'guide_bookings')
      .eq('table_schema', 'public');
    
    if (columnsError) {
      console.error('Error checking guide_bookings structure:', columnsError);
    } else {
      logDetail('guide_bookings table structure:', columns);
    }
  } catch (err) {
    console.error('Exception checking guide_bookings structure:', err);
  }
  
  // 2. Get a valid guide ID from the park_guides table
  let validGuideId = null;
  let guideUsername = null;
  try {
    console.log('\nFetching valid guide IDs from park_guides table...');
    // Use admin client to bypass RLS for reading
    const { data: guides, error: guidesError } = await supabaseAdmin
      .from('park_guides')
      .select('user_id, username')
      .limit(5);
    
    if (guidesError) {
      console.error('Error accessing park_guides table:', guidesError);
    } else {
      logDetail('Available guides:', guides);
      if (guides && guides.length > 0) {
        validGuideId = guides[0].user_id;
        guideUsername = guides[0].username;
        console.log(`Selected guide ID: ${validGuideId} (${guideUsername})`);
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
  
  // 3. Try to insert a test booking with a valid guide ID using admin client
  try {
    console.log('\nAttempting to insert a test booking with service role client...');
    const bookingId = `TEST-ADMIN-${Date.now().toString(36)}`;
    const bookingDate = new Date().toISOString().split('T')[0];
    const createdAt = new Date().toISOString();
    
    const bookingData = {
      booking_id: bookingId,
      guide_id: validGuideId,
      guest_name: 'Test Guest (Admin)',
      contact_number: '1234567890',
      booking_date: bookingDate,
      message: 'This is a test booking using service role',
      status: 'test',
      created_at: createdAt,
      updated_at: createdAt,
      guide_username: guideUsername
    };
    
    logDetail('Booking data to insert:', bookingData);
    
    // Use admin client to bypass RLS for writing
    const { data: insertResult, error: insertError } = await supabaseAdmin
      .from('guide_bookings')
      .insert([bookingData])
      .select();
    
    if (insertError) {
      console.error('Error inserting test booking with admin client:', insertError);
    } else {
      logDetail('Test booking inserted successfully with admin client:', insertResult);
      console.log('Booking ID:', bookingId);
    }
    
    // 4. Check if the booking was actually inserted using admin client
    console.log('\nVerifying if test booking was inserted...');
    const { data: verifyData, error: verifyError } = await supabaseAdmin
      .from('guide_bookings')
      .select('*')
      .eq('booking_id', bookingId);
    
    if (verifyError) {
      console.error('Error verifying test booking:', verifyError);
    } else {
      logDetail('Verification result:', verifyData);
      if (verifyData && verifyData.length > 0) {
        console.log('Test booking was successfully inserted and retrieved');
      } else {
        console.log('Test booking was not found in the database');
      }
    }
    
    // 5. Also try to verify with regular client to check if RLS is blocking
    console.log('\nVerifying with regular client (to check RLS)...');
    const { data: regularVerifyData, error: regularVerifyError } = await supabase
      .from('guide_bookings')
      .select('*')
      .eq('booking_id', bookingId);
    
    if (regularVerifyError) {
      console.error('Error verifying with regular client:', regularVerifyError);
      console.log('This may be due to RLS policies blocking access');
    } else {
      logDetail('Regular client verification result:', regularVerifyData);
      if (regularVerifyData && regularVerifyData.length > 0) {
        console.log('Test booking was successfully retrieved with regular client');
      } else {
        console.log('Test booking was not found with regular client (likely due to RLS)');
      }
    }
    
    // 6. List all bookings in the table to see what's there
    console.log('\nListing all bookings in guide_bookings table...');
    const { data: allBookings, error: allBookingsError } = await supabaseAdmin
      .from('guide_bookings')
      .select('*')
      .limit(10);
    
    if (allBookingsError) {
      console.error('Error listing all bookings:', allBookingsError);
    } else {
      logDetail('All bookings in guide_bookings table:', allBookings);
    }
  } catch (err) {
    console.error('Exception during test booking insertion:', err);
  }
}

// Run the test
testBookingWithServiceRole().catch(err => {
  console.error('Top-level error:', err);
});