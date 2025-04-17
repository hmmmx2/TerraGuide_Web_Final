import { HashRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
// Added by Desmond @ 18 April 2025, need to include, otherwise view won't display due to Firebase
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Register from "./Pages/Register.jsx";
import Login from "./Pages/Login.jsx";
import Blogmenu from "./Pages/blogmenu";
import Test from "./Pages/Test";
import Blogs2 from "./Pages/blogs2";
import Template from "./Pages/Template";
import Index from "./Pages/index";
import Profile from "./Pages/Profile";
import Timetable from "./Pages/Timetable";
import Guide from "./Pages/Guide";

// More efficient ProtectedRoute using Outlet
function ProtectedRoutes() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Show loading state while checking auth
  }

  return currentUser ? <Outlet /> : <Navigate to="/" replace />;
}

// Optional: PublicOnlyRoutes for login/signup
function PublicOnlyRoutes() {
  const { currentUser } = useAuth();
  return !currentUser ? <Outlet /> : <Navigate to="/index" replace />;
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
              <Route path="/blogs2" element={<Blogs2 />} />
              <Route path="/template" element={<Template />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/timetable" element={<Timetable />} />
              <Route path="/guide" element={<Guide />} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        // Added AuthProvider by Desmond @ 18 April 2025
      </AuthProvider>
  );
}

export default App;