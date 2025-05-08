// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    })
  }

  try {
    const { email, otp, newPassword } = await req.json()
    
    // Log the request data (excluding password for security)
    console.log('Reset password request for email:', email)

    if (!email || !otp || !newPassword) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    )

    // 1. Verify OTP
    const { data: otpData, error: otpError } = await supabase
      .from('password_reset_otps')
      .select('*')
      .eq('email', email)
      .eq('otp', otp)
      .eq('used', false)
      .single()

    if (otpError) {
      console.error('OTP verification error:', otpError)
      return new Response(
        JSON.stringify({ error: `OTP verification failed: ${otpError.message}` }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }

    if (!otpData) {
      console.error('No OTP found for email:', email)
      return new Response(
        JSON.stringify({ error: 'Invalid or expired OTP' }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }

    // 2. Check if OTP expired
    if (new Date(otpData.expires_at) < new Date()) {
      console.error('OTP expired for email:', email)
      return new Response(
        JSON.stringify({ error: 'OTP has expired' }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }

    // 3. Mark OTP as used
    const { error: updateOTPError } = await supabase
      .from('password_reset_otps')
      .update({ used: true })
      .eq('id', otpData.id)

    if (updateOTPError) {
      console.error('Error marking OTP as used:', updateOTPError)
      return new Response(
        JSON.stringify({ error: `Failed to mark OTP as used: ${updateOTPError.message}` }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }

    // 4. Get user by email using the admin API
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers({ email });

    if (userError || !userData || !userData.users || userData.users.length === 0) {
      console.error('User not found for email:', email, userError);
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }

    const userId = userData.users[0].id;

    // 5. Update password using Admin API
    const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(userId, {
      password: newPassword
    });

    if (updateError) {
      console.error('Password update error:', updateError);
      return new Response(
        JSON.stringify({ error: `Failed to update password: ${updateError.message}` }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }

    console.log('Password update result:', updatedUser);

    if (!updatedUser) {
      return new Response(
        JSON.stringify({ error: 'Password update failed for unknown reasons.' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }

    console.log('Password successfully reset for email:', email)
    return new Response(
      JSON.stringify({ success: true }), 
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: `Unexpected error: ${error.message}` }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    )
  }
})