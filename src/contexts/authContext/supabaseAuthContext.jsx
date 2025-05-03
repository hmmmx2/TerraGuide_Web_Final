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

    useEffect(() => {
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (session) {
                    setCurrentUser(session.user);
                    setUserLoggedIn(true);
                } else {
                    setCurrentUser(null);
                    setUserLoggedIn(false);
                }
                setLoading(false);
            }
        );

        // Check for existing session on mount
        const checkUser = async () => {
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

    const value = {
        currentUser,
        userLoggedIn,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}