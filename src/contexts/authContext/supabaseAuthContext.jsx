import React, { useContext, useState, useEffect } from "react";
import { supabase } from "../../supabase/supabase";

const AuthContext = React.createContext(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [emailVerificationSent, setEmailVerificationSent] = useState(false);
    const [isGuestMode, setIsGuestMode] = useState(false);

    useEffect(() => {
        // Check for guest mode in localStorage
        const checkGuestMode = () => {
            const guestMode = localStorage.getItem('guestMode');
            if (guestMode === 'true') {
                console.log('Guest mode detected in localStorage');
                setIsGuestMode(true);
                setUserLoggedIn(true); // Treat guest as logged in
                setLoading(false);
                return true;
            }
            return false;
        };

        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                // If user logs out, also clear guest mode
                if (event === 'SIGNED_OUT') {
                    localStorage.removeItem('guestMode');
                    localStorage.removeItem('guestName');
                    setIsGuestMode(false);
                }

                if (session) {
                    setCurrentUser(session.user);
                    setUserLoggedIn(true);
                    setIsGuestMode(false); // Real user login overrides guest mode
                } else if (!checkGuestMode()) { // Only set logged out if not in guest mode
                    setCurrentUser(null);
                    setUserLoggedIn(false);
                    // Reset email verification state when user logs out
                    setEmailVerificationSent(false);
                }
                setLoading(false);
            }
        );

        // Check for existing session on mount
        const checkUser = async () => {
            // First check for guest mode - this needs to happen immediately
            const guestMode = localStorage.getItem('guestMode');
            if (guestMode === 'true') {
                console.log('Guest mode active - initializing guest session');
                setIsGuestMode(true);
                setUserLoggedIn(true);
                setLoading(false);
                return; // Skip Supabase session check for guest mode
            }

            // Otherwise check for real auth session
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setCurrentUser(session.user);
                setUserLoggedIn(true);
            }
            setLoading(false);
        };
        checkUser();

        // Cleanup subscription
        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    // Function to exit guest mode
    const exitGuestMode = () => {
        localStorage.removeItem('guestMode');
        localStorage.removeItem('guestName');
        setIsGuestMode(false);
        setUserLoggedIn(false);
    };

    // Function to enable guest mode
    const enableGuestMode = () => {
        localStorage.setItem('guestMode', 'true');
        localStorage.setItem('guestName', 'Guest User');
        setIsGuestMode(true);
        setUserLoggedIn(true);
    };

    const value = {
        currentUser,
        userLoggedIn,
        loading,
        emailVerificationSent,
        setEmailVerificationSent,
        isGuestMode,
        exitGuestMode,
        enableGuestMode
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}