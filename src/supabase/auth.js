import { supabase } from './supabase';

// Create a new user with email and password
export const doCreateUserWithEmailAndPassword = async (email, password, firstName, lastName, role, username) => {
  try {
    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          role: role || 'parkguide',
          username: username // Add username to user metadata
        },
        emailRedirectTo: `${window.location.origin}/#/email-verification`
      }
    });

    if (authError) {
      console.error("Auth signup error:", authError);
      throw new Error(authError.message);
    }

    // The database trigger will handle inserting records into users, park_guides, and admins tables
    // No need to manually insert records here
    console.log("User created in auth system, database trigger will handle table insertions");

    return authData;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Sign in a user with email and password
export const doSignInWithEmailAndPassword = async (email, password) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

// Sign in with email OTP (magic link)
export const doSignInWithEmailOTP = async (email) => {
    try {
        const { data, error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin + '/index'
            }
        });
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Email OTP login error:", error);
        throw error;
    }
};

// Send password reset email
export const doPasswordReset = async (email) => {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        return true;
    } catch (error) {
        console.error("Password reset error:", error);
        throw error;
    }
};

// Update user password
export const doPasswordChange = async (password) => {
    try {
        const { error } = await supabase.auth.updateUser({
            password: password
        });
        
        if (error) throw error;
        return true;
    } catch (error) {
        console.error("Password change error:", error);
        throw error;
    }
};

// Sign out a user
export const doSignOut = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return true;
    } catch (error) {
        console.error("Logout error:", error);
        throw error;
    }
};

// Create a default admin user with predefined values
export const createDefaultAdmin = async () => {
  const email = 'admin@email.com';
  const password = 'admin'; // Should be changed after first login
  const firstName = 'System';
  const lastName = 'Administrator';
  
  return createAdminUser(email, password, firstName, lastName);
};

// Create a specific admin account
export const createExampleAdmin = async () => {
  try {
    const { data, error } = await createAdminUser(
      'admin@example.com',
      'admin',
      'The',
      'Administrator'
    );
    
    if (error) {
      console.error('Error creating admin:', error);
      return { success: false, error };
    } else {
      console.log('Admin created successfully:', data);
      return { success: true, data };
    }
  } catch (err) {
    console.error('Failed to create admin:', err);
    return { success: false, error: err };
  }
};
