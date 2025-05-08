import { supabase } from './supabase';

// Create a new user with email and password
export const doCreateUserWithEmailAndPassword = async (email, password, firstName, lastName, userRole) => {
  try {
    // For guest users, we'll skip email confirmation
    const isGuestUser = userRole === 'guest';
    
    // For guest users, we need a different approach
    if (isGuestUser) {
      try {
        // For guest users, we'll use a special approach to bypass email verification
        // First, check if we can sign in directly (in case this guest email was used before)
        const { data: existingData, error: existingError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        // If we can sign in directly, return that session
        if (!existingError && existingData?.session) {
          console.log("Reusing existing guest account");
          return existingData;
        }
        
        // Otherwise, create a new user
        console.log("Creating new guest account");
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              user_role: userRole
            }
          }
        });
        
        if (error) {
          console.error("Guest account creation error:", error);
          throw error;
        }
        
        // For guest accounts, we'll try to sign in immediately even without email verification
        // This is a workaround since we can't force email confirmation through the client API
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          // If we can't sign in, it's likely because email verification is required
          // Let's provide a clear error message
          console.error("Guest sign-in error:", signInError);
          throw new Error("Guest sign-in requires email verification which isn't possible. Please try again or use regular registration.");
        }
        
        return signInData;
      } catch (error) {
        console.error("Complete guest auth flow error:", error);
        throw error;
      }
    }
    
    // For regular users, use the standard sign-up flow
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          user_role: userRole
        },
        emailRedirectTo: window.location.origin + '/index'
      }
    });
    
    if (error) {
      // If there's an error, throw it to be caught by the calling function
      throw error;
    }
    
    // If the user was created successfully but needs email confirmation
    // For guest users, we'll handle this differently
    if (data?.user && data?.session === null && !isGuestUser) {
      // This means the user needs to confirm their email (only for non-guest users)
      return { ...data, emailConfirmation: true };
    }
    
    // We've already handled guest users above, so this is only for regular users
    
    return data;
  } catch (error) {
    // Rethrow the error to be handled by the calling function
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
