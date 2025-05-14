// Follow the Supabase Edge Functions setup guide to deploy this
import { createClient } from '@supabase/supabase-js'
import { SmtpClient } from "https://deno.land/x/smtp/mod.ts";

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

    if (!email || !otp) {
      throw new Error('Email and OTP are required')
    }

    // Configure SMTP client
    const client = new SmtpClient();
    
    await client.connectTLS({
      hostname: Deno.env.get('SMTP_HOST'),
      port: Number(Deno.env.get('SMTP_PORT')),
      username: Deno.env.get('SMTP_USERNAME'),
      password: Deno.env.get('SMTP_PASSWORD'),
    });

    // Send email with OTP
    await client.send({
      from: Deno.env.get('EMAIL_FROM'),
      to: email,
      subject: "Your Password Reset Code",
      content: `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
              <h2 style="color: #4E6E4E; text-align: center;">Password Reset Code</h2>
              <p>You requested a password reset for your Terra Guide account. Use the following code to reset your password:</p>
              <div style="text-align: center; margin: 30px 0;">
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4E6E4E;">${otp}</div>
              </div>
              <p>This code will expire in 2 minutes.</p>
              <p>If you didn't request this password reset, please ignore this email.</p>
              <p style="margin-top: 30px; font-size: 12px; color: #777; text-align: center;">
                &copy; ${new Date().getFullYear()} Terra Guide. All rights reserved.
              </p>
            </div>
          </body>
        </html>
      `,
      html: true,
    });

    await client.close();

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
}