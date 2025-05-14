// Follow the Supabase Edge Functions setup guide to deploy this
import { createClient } from '@supabase/supabase-js'
import { SmtpClient } from 'https://deno.land/x/smtp/mod.ts'

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
    const { email, otp } = JSON.parse(event.body)

    // Create a Supabase client with the Admin key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check if user exists
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (userError) {
      // Don't reveal if user exists or not for security
      return new Response(
        JSON.stringify({ success: true, message: 'If your email exists in our system, a code has been sent.' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Configure SMTP client (use your email service credentials)
    const client = new SmtpClient()
    await client.connect({
      hostname: Deno.env.get('SMTP_HOST'),
      port: parseInt(Deno.env.get('SMTP_PORT')),
      username: Deno.env.get('SMTP_USERNAME'),
      password: Deno.env.get('SMTP_PASSWORD'),
    })

    // Send email with OTP
    await client.send({
      from: Deno.env.get('EMAIL_FROM'),
      to: email,
      subject: 'Your Password Reset Code',
      content: `
        <html>
          <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
              <h2 style="color: #4E6E4E;">Password Reset</h2>
              <p>You requested to reset your password for your Terra Guide account.</p>
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                <h3 style="margin: 0; font-size: 24px;">${otp}</h3>
              </div>
              <p>Enter this code on the password reset page to continue.</p>
              <p>This code will expire in 10 minutes.</p>
              <p>If you did not request this password reset, please ignore this email.</p>
              <p style="margin-top: 30px; font-size: 12px; color: #777;">
                This is an automated email, please do not reply.
              </p>
            </div>
          </body>
        </html>
      `,
      html: true,
    })

    await client.close()

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error sending OTP email:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to send verification code' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
}