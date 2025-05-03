# Migrating from Firebase to Supabase

This guide explains how to complete the migration from Firebase to Supabase for authentication in the Terra-guide project.

## Setup Instructions

1. **Create a Supabase Project**
   - Go to [Supabase](https://supabase.com/) and sign up for an account
   - Create a new project
   - Once your project is created, navigate to Project Settings > API to find your project URL and anon key

2. **Update Supabase Configuration**
   - Open `src/supabase/supabase.js`
   - Replace the placeholder values with your actual Supabase project URL and anon key:
   ```javascript
   const supabaseUrl = 'https://your-project-id.supabase.co';
   const supabaseAnonKey = 'your-anon-key';
   ```

3. **Update App.jsx**
   - Import the Supabase AuthProvider instead of the Firebase one:
   ```javascript
   import { AuthProvider } from './contexts/authContext/supabaseAuthContext';
   ```

4. **Update Imports in Components**
   - In Login.jsx and Register.jsx, update the import statements:
   ```javascript
   // Change from
   import { doSignInWithEmailAndPassword } from "../firebase/auth";
   import { useAuth } from "../contexts/authContext";
   
   // To
   import { doSignInWithEmailAndPassword } from "../supabase/auth";
   import { useAuth } from "../contexts/authContext/supabaseAuthContext";
   ```

## Using Supabase Authentication

The authentication functions have been implemented to match the Firebase API as closely as possible, so minimal changes are needed in your components:

- **Sign Up**: `doCreateUserWithEmailAndPassword(email, password)`
- **Sign In**: `doSignInWithEmailAndPassword(email, password)`
- **Sign Out**: `doSignOut()`
- **Password Reset**: `doPasswordReset(email)`
- **Password Change**: `doPasswordChange(password)`

## Accessing User Data

User data can be accessed through the auth context:

```javascript
const { currentUser, userLoggedIn } = useAuth();
```

## Additional Supabase Features

Supabase offers additional features beyond authentication:

1. **Database**: PostgreSQL database with real-time capabilities
2. **Storage**: File storage with access controls
3. **Edge Functions**: Serverless functions
4. **Realtime**: WebSocket-based real-time subscriptions

To use these features, refer to the [Supabase documentation](https://supabase.com/docs).