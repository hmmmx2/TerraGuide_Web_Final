// Supabase client configuration
import { createClient } from '@supabase/supabase-js';

// Your Supabase URL and anon key
// Replace these with your actual Supabase project credentials
const supabaseUrl = 'https://wxvnjjxbvbevwmvqyack.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4dm5qanhidmJldndtdnF5YWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMDYyMDAsImV4cCI6MjA2MTc4MjIwMH0.-Lstafz3cOl5KHuCpKgG-Xt9zRi12aJDqZr0mdHMzXc';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };