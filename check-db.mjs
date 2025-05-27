// Script to check database structure
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with the same credentials from the app
const supabase = createClient(
  'https://wxvnjjxbvbevwmvqyack.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4dm5qanhidmJldndtdnF5YWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMDYyMDAsImV4cCI6MjA2MTc4MjIwMH0.-Lstafz3cOl5KHuCpKgG-Xt9zRi12aJDqZr0mdHMzXc'
);

async function checkDatabase() {
  console.log('Checking database structure...');
  
  // Check if guide_bookings table exists
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
      console.log('Sample data:', bookings);
    }
  } catch (err) {
    console.error('Exception checking guide_bookings:', err);
  }
  
  // Check if park_guides table exists
  try {
    console.log('\nChecking park_guides table...');
    const { data: guides, error: guidesError } = await supabase
      .from('park_guides')
      .select('*')
      .limit(5);
    
    if (guidesError) {
      console.error('Error accessing park_guides table:', guidesError);
    } else {
      console.log('park_guides table exists');
      console.log('Sample data:', guides);
    }
  } catch (err) {
    console.error('Exception checking park_guides:', err);
  }
  
  // Try to execute the create_bookings_table_if_not_exists RPC
  try {
    console.log('\nTrying to execute create_bookings_table_if_not_exists RPC...');
    const { data: rpcResult, error: rpcError } = await supabase.rpc('create_bookings_table_if_not_exists');
    
    if (rpcError) {
      console.error('Error executing RPC:', rpcError);
    } else {
      console.log('RPC executed successfully:', rpcResult);
    }
  } catch (err) {
    console.error('Exception executing RPC:', err);
  }
  
  // Try to list all tables in the public schema
  try {
    console.log('\nTrying to list all tables...');
    const { data: tables, error: tablesError } = await supabase.rpc('execute_sql', {
      sql: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`
    });
    
    if (tablesError) {
      console.error('Error listing tables:', tablesError);
    } else {
      console.log('Tables in public schema:', tables);
    }
  } catch (err) {
    console.error('Exception listing tables:', err);
  }
}

// Run the check
checkDatabase().catch(err => {
  console.error('Top-level error:', err);
});