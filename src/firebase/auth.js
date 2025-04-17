import { auth } from './firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    updatePassword,
    signOut
} from 'firebase/auth';

export const doCreateUserWithEmailAndPassword = async (email, password) => {
    try {
        return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

export const doSignInWithEmailAndPassword = async (email, password) => {
    try {
        return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

export const doPasswordReset = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return true;
    } catch (error) {
        console.error("Password reset error:", error);
        throw error;
    }
};

export const doPasswordChange = async (password) => {
    try {
        if (!auth.currentUser) throw new Error("No authenticated user");
        await updatePassword(auth.currentUser, password);
        return true;
    } catch (error) {
        console.error("Password change error:", error);
        throw error;
    }
};

export const doSignOut = async () => {
    try {
        await signOut(auth);
        return true;
    } catch (error) {
        console.error("Logout error:", error);
        // If we get an error but the user is actually logged out
        if (!auth.currentUser) return true;
        throw error;
    }
};