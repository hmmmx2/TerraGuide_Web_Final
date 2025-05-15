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
    const [userRole, setUserRole] = useState(null);
    const [redirectInProgress, setRedirectInProgress] = useState(false);

    // Function to redirect admin users to dashboard
    const redirectAdminToDashboard = (role) => {
        // Only redirect if not already in progress to prevent multiple redirects
        if (role === 'admin' && !redirectInProgress) {
            const currentPath = window.location.hash;
            // Only redirect if we're on the index page or login page, not from other admin pages
            if (currentPath === '#/index' || currentPath === '#/' || currentPath === '' || 
                currentPath === '#/login' || !currentPath.includes('#/dashboard')) {
                
                // Set redirect in progress to prevent multiple redirects
                setRedirectInProgress(true);
                
                // Use a single redirect approach with a slight delay to ensure state is settled
                setTimeout(() => {
                    window.location.href = '/#/dashboard';
                    // Reset the flag after redirect is complete
                    setTimeout(() => setRedirectInProgress(false), 500);
                }, 100);
            }
        }
    };

    useEffect(() => {
        // Check for guest mode in localStorage
        const checkGuestMode = () => {
            const guestMode = localStorage.getItem('guestMode');
            if (guestMode === 'true') {
                console.log('Guest mode detected in localStorage');
                setIsGuestMode(true);
                setUserLoggedIn(true); // Treat guest as logged in
                setUserRole('guest'); // Set role as guest
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
                    setUserRole(null);
                }

                if (session) {
                    setCurrentUser(session.user);
                    setUserLoggedIn(true);
                    setIsGuestMode(false); // Real user login overrides guest mode
                    
                    // Set user role from metadata
                    const role = session.user?.user_metadata?.role || 'parkguide';
                    setUserRole(role);
                    
                    // Redirect admin users to dashboard
                    redirectAdminToDashboard(role);
                } else if (!checkGuestMode()) { // Only set logged out if not in guest mode
                    setCurrentUser(null);
                    setUserLoggedIn(false);
                    setUserRole(null);
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
                setUserRole('guest');
                setLoading(false);
                return; // Skip Supabase session check for guest mode
            }

            // Otherwise check for real auth session
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setCurrentUser(session.user);
                setUserLoggedIn(true);
                
                // Set user role from metadata - Fix: Check both user_metadata and raw_user_metadata
                const role = session.user?.user_metadata?.role || session.user?.raw_user_metadata?.role || 'parkguide';
                setUserRole(role);
                
                // Redirect admin users to dashboard
                // redirectAdminToDashboard(role);
            }
            setLoading(false);
        };
        checkUser();

        // Cleanup subscription
        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    // Modify the effect to monitor route changes to use the redirectInProgress flag
    // Comment out or remove this entire useEffect
    // useEffect(() => {
    //   if (userRole === 'admin' && !redirectInProgress) {
    //     const currentPath = window.location.hash;
    //     // Only redirect if we're on the index page specifically
    //     if (currentPath === '#/index') {
    //       // Set redirect in progress to prevent multiple redirects
    //       setRedirectInProgress(true);
    //       
    //       // Use timeout to ensure state is settled
    //       setTimeout(() => {
    //         window.location.href = '/#/dashboard';
    //         // Reset the flag after redirect is complete
    //         setTimeout(() => setRedirectInProgress(false), 1000);
    //       }, 100);
    //     } else {
    //       // If we're not on the index page, we don't need to redirect
    //       setRedirectInProgress(false);
    //     }
    //   }
    // }, [userRole, redirectInProgress]);

    // Function to exit guest mode
    const exitGuestMode = () => {
        localStorage.removeItem('guestMode');
        localStorage.removeItem('guestName');
        setIsGuestMode(false);
        setUserLoggedIn(false);
        setUserRole(null);
    };

    // Function to enable guest mode
    const enableGuestMode = () => {
        localStorage.setItem('guestMode', 'true');
        localStorage.setItem('guestName', 'Guest User');
        setIsGuestMode(true);
        setUserLoggedIn(true);
        setUserRole('guest');
    };

    // Function to check if user can access admin dashboard
    const canAccessDashboard = () => {
        return userRole === 'admin';
    };

    // Add a function to force logout
    const forceLogout = () => {
        localStorage.removeItem('guestMode');
        localStorage.removeItem('guestName');
        setCurrentUser(null);
        setUserLoggedIn(false);
        setIsGuestMode(false);
        setUserRole(null);
        setEmailVerificationSent(false);
        window.location.href = '/';
    };

    // Add session expiration check
    useEffect(() => {
        if (!currentUser) return;

        // Check if session is expired
        const checkSessionExpiration = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session && userLoggedIn) {
                console.log('Session expired, logging out');
                forceLogout();
            }
        };

        // Check session every minute
        const interval = setInterval(checkSessionExpiration, 60000);
        return () => clearInterval(interval);
    }, [currentUser, userLoggedIn]);

    const value = {
        currentUser,
        userLoggedIn,
        loading,
        emailVerificationSent,
        setEmailVerificationSent,
        isGuestMode,
        exitGuestMode,
        enableGuestMode,
        userRole,
        canAccessDashboard,
        redirectInProgress
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}