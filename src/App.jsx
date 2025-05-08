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

// More efficient ProtectedRoute using Outlet
function ProtectedRoutes() {
  const { currentUser, loading, userLoggedIn } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Show loading state while checking auth
  }

  // Check userLoggedIn which handles both regular users and guest mode
  return userLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
}

// Optional: PublicOnlyRoutes for login/signup
function PublicOnlyRoutes() {
  const { userLoggedIn, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>; // Show loading state while checking auth
  }
  
  return !userLoggedIn ? <Outlet /> : <Navigate to="/index" replace />;
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

            {/* All protected routes in one group */}
            <Route element={<ProtectedRoutes />}>
              <Route path="/index" element={<Index />} />
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