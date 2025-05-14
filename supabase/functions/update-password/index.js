// Follow the Supabase Edge Functions setup guide to deploy this
import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export const handler = async (event) => {
  // Handle CORS
  if (event.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, password, otp } = JSON.parse(event.body)

    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    // Create a Supabase client with the Admin key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify OTP if provided
    if (otp) {
      // Check if OTP exists and is valid
      const { data: otpData, error: otpError } = await supabaseAdmin
        .from('password_reset_otps')
        .select('*')
        .eq('email', email)
        .eq('otp', otp)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (otpError || !otpData) {
        return new Response(
          JSON.stringify({ error: 'Invalid or expired verification code' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        )
      }
      
      // Mark OTP as used
      await supabaseAdmin
        .from('password_reset_otps')
        .update({ used: true })
        .eq('id', otpData.id)
    }

    // Get the user by email
    const { data: user, error: userError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (userError) throw userError
    
    const targetUser = user.users.find(u => u.email === email)
    
    if (!targetUser) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      )
    }

    // Update the user's password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      targetUser.id,
      { password }
    )

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error updating password:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
}