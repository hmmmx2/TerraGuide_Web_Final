import { HashRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
// Updated to use Supabase authentication instead of Firebase
import { AuthProvider, useAuth } from "./contexts/authContext/supabaseAuthContext";
import Register from "./Pages/Register.jsx";
import Login from "./Pages/Login.jsx";
import Blogmenu from "./Pages/blogmenu";
import Test from "./Pages/Test";
import Blogs from "./Pages/blogs";
import Blogs2 from "./Pages/blogs2";
import Template from "./Pages/Template";
import Index from "./Pages/index";
import Profile from "./Pages/Profile";
import Timetable from "./Pages/Timetable";
import Guide from "./Pages/Guide";
import ParkMap from "./Pages/ParkMap";
import Aboutus from "./Pages/Aboutus";
import SessionTimeoutManager from './components/SessionTimeoutManager';
import Course1 from './Pages/Course1';
import MyCourses from './Pages/MyCourses';
import Course2 from './Pages/Course2';
import Blogs3 from './Pages/Blogs3';
import Ai from './Pages/Ai';
import Dashboard from './Pages/Dashboard';
import React, { useEffect, useState } from 'react';
import { supabase } from './supabase/supabase';

// More efficient ProtectedRoute using Outlet
function ProtectedRoutes() {
  const { currentUser, loading, userLoggedIn } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Show loading state while checking auth
  }

  // Check userLoggedIn which handles both regular users and guest mode
  return userLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
}

// New AdminRoutes component for admin/controller only pages
function AdminRoutes() {
  const { currentUser, loading, userLoggedIn, userRole } = useAuth();
  const [authorized, setAuthorized] = useState(false);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  
  useEffect(() => {
    const checkAdminRole = async () => {
      if (!currentUser) {
        setAuthorized(false);
        setAuthCheckComplete(true);
        return;
      }
      
      try {
        // Get user role from context instead of checking metadata again
        const isAdmin = userRole === 'admin' || userRole === 'controller';
        setAuthorized(isAdmin);
        
        // Log the authorization state for debugging
        console.log('Admin authorization check:', { 
          userRole, 
          isAdmin, 
          authorized: isAdmin 
        });
      } catch (error) {
        console.error('Role check failed:', error);
        setAuthorized(false);
      } finally {
        setAuthCheckComplete(true);
      }
    };
    
    checkAdminRole();
  }, [currentUser, userRole]);

  // Add effect to reset authorized state when user logs out
  useEffect(() => {
    if (!userLoggedIn) {
      setAuthorized(false);
    }
  }, [userLoggedIn]);

  // Show loading state until both auth loading is complete AND our own check is complete
  if (loading || !authCheckComplete) {
    return <div>Loading...</div>;
  }

  return authorized ? <Outlet /> : <Navigate to="/index" replace />;
}

// Optional: PublicOnlyRoutes for login/signup
function PublicOnlyRoutes() {
  const { userLoggedIn, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>; // Show loading state while checking auth
  }
  
  return !userLoggedIn ? <Outlet /> : <Navigate to="/index" replace />;
}

// New component to conditionally redirect admin users from index to dashboard
function IndexRedirect() {
  const { userRole, loading } = useAuth();
  
  // Show loading state while checking auth
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // // If user is admin, redirect to dashboard
  // if (userRole === 'admin' || userRole === 'controller') {
  //   return <Navigate to="/dashboard" replace />;
  // }
  
  // Otherwise, show the Index component with a key to force a fresh render
  return <Index key="index-page" />;
}

function App() {
  return (
      // Added AuthProvider by Desmond @ 18 April 2025
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public only routes (login/signup) */}
            <Route element={<PublicOnlyRoutes />}>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Register />} />
            </Route>

            {/* Admin/Controller only routes */}
            <Route element={<AdminRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* All protected routes in one group */}
            <Route element={<ProtectedRoutes />}>
              {/* Conditional redirect for admin users */}
              <Route path="/index" element={<IndexRedirect />} />
              <Route path="/blogmenu" element={<Blogmenu />} />
              <Route path="/test" element={<Test />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs2" element={<Blogs2 />} />
              <Route path="/template" element={<Template />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/timetable" element={<Timetable />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/parkmap" element={<ParkMap />} />
              <Route path="/aboutus" element={<Aboutus />} />
              <Route path="/course1" element={<Course1 />} />
              <Route path="/mycourses" element={<MyCourses />} />
              <Route path="/course2" element={<Course2 />} />
              <Route path="/blogs3" element={<Blogs3 />} />
              <Route path="/ai" element={<Ai />} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <SessionTimeoutManager timeoutDuration={60000} /> {/* 1 minute timeout */}
        </Router>
      </AuthProvider>
  );
}

export default App;