import { supabase } from './supabase';

// Create a new user with email and password
export const doCreateUserWithEmailAndPassword = async (email, password) => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        
        if (error) throw error;
        return data;
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