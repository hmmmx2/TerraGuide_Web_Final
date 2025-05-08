import { supabase } from './supabase';
import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_yx9p58h'; // Replace with your actual service ID
const EMAILJS_TEMPLATE_ID = 'template_gyfdcna'; // Replace with your actual template ID
const EMAILJS_PUBLIC_KEY = 'A3nQuKIZXjQuSXSKz'; // Replace with your actual public key

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

// Generate a random 4-digit OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Store OTP in Supabase
const storeOTP = async (email, otp) => {
  try {
    const { error } = await supabase
      .from('password_reset_otps')
      .upsert([
        {
          email,
          otp,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 15 * 60000).toISOString(), // 15 minutes expiry
          used: false
        }
      ]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error storing OTP:', error);
    throw error;
  }
};

// Send OTP email using EmailJS
const sendOTPEmail = async (email, otp) => {
  try {
    const templateParams = {
      email: email,
      otp: otp
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    if (response.status !== 200) {
      throw new Error('Failed to send email');
    }

    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email. Please try again.');
  }
};

// Verify OTP
const verifyOTP = async (email, otp) => {
  try {
    const { data, error } = await supabase
      .from('password_reset_otps')
      .select('*')
      .eq('email', email)
      .eq('otp', otp)
      .eq('used', false)
      .single();

    if (error) throw error;

    if (!data) {
      throw new Error('Invalid or expired OTP');
    }

    // Check if OTP has expired
    if (new Date(data.expires_at) < new Date()) {
      throw new Error('OTP has expired');
    }

    // Mark OTP as used
    await supabase
      .from('password_reset_otps')
      .update({ used: true })
      .eq('id', data.id);

    return true;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

// Send password reset email with OTP
export const sendPasswordResetOTP = async (email) => {
  try {
    // Generate OTP
    const otp = generateOTP();

    // Store OTP in database
    await storeOTP(email, otp);

    // Send OTP email using EmailJS
    await sendOTPEmail(email, otp);

    return true;
  } catch (error) {
    console.error('Error sending password reset OTP:', error);
    throw error;
  }
};

// Reset password with OTP verification
export const resetPasswordWithOTP = async (email, otp, newPassword) => {
  try {
    // Verify OTP
    await verifyOTP(email, otp);

    // Update password
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
}; 