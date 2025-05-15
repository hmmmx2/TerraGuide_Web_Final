// Supabase admin client configuration
import { createClient } from '@supabase/supabase-js';

// Your Supabase URL and service role key (IMPORTANT: Keep this secure!)
// Replace these with your actual Supabase project credentials
const supabaseUrl = 'https://wxvnjjxbvbevwmvqyack.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4dm5qanhidmJldndtdnF5YWNrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjIwNjIwMCwiZXhwIjoyMDYxNzgyMjAwfQ.9KKYFmxQH3eXW8TFONRsNXWw5Rw6_Fdpg43DLTmWVcw'; // Replace with your actual service role key

// Initialize Supabase admin client with service role key
// This client has admin privileges and should only be used server-side
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export { supabaseAdmin };