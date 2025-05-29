export const verifyRecaptcha = async (token) => {
  try {
    console.log('Attempting to verify reCAPTCHA with token:', token.substring(0, 10) + '...');
    
    const url = 'https://wxvnjjxbvbevwmvqyack.supabase.co/functions/v1/verify-captcha';
    console.log('Calling Edge Function at:', url);

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4dm5qanhidmJldndtdnF5YWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMDYyMDAsImV4cCI6MjA2MTc4MjIwMH0.-Lstafz3cOl5KHuCpKgG-Xt9zRi12aJDqZr0mdHMzXc'
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ token })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Edge Function returned error:', response.status, errorText);
      if (response.status === 404 || errorText.includes('NOT_FOUND')) {
        console.warn('Supabase Edge Function "verify-captcha" not found. Please ensure the function is deployed in your Supabase project (ID: wxvnjjxbvbevwmvqyack) with the exact name "verify-captcha". Steps: 1) Go to Supabase Dashboard → Edge Functions. 2) Deploy the function using `supabase functions deploy verify-captcha`. 3) Verify the RECAPTCHA_SECRET_KEY is set in Project Settings → Secrets.');
        return false;
      } else if (response.status === 401 || errorText.includes('Missing authorization header')) {
        console.error('Authorization failed. Ensure the hardcoded Supabase anonymous key is correct and matches your Supabase project’s anonymous key.');
        return false;
      } else {
        console.error('Request failed:', response.status, errorText);
        return false;
      }
    }
    
    const data = await response.json();
    console.log('reCAPTCHA verification result:', data);
    return data.success;
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error);
    return false;
    }
};