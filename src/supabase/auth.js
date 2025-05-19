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

    if (error) {
      throw error;
    }

    // Check if user has a valid role
    const userRole = data.user?.user_metadata?.role;
    const validRoles = ['admin', 'controller', 'parkguide']; // Define your valid roles
    
    if (!validRoles.includes(userRole)) {
      // Sign out the user immediately
      await supabase.auth.signOut();
      throw new Error('Your account has an outdated role. Please contact an administrator.');
    }

    return data;
  } catch (error) {
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
        // Clear any local storage items that might be keeping the session alive
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('guestMode');
        localStorage.removeItem('guestName');
        
        // Clear any cookies that might be related to authentication
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
        });
        
        // Call the Supabase signOut method
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        // Force reload the page to ensure all state is cleared
        window.location.href = '/';
        
        return true;
    } catch (error) {
        console.error("Logout error:", error);
        throw error;
    }
};
