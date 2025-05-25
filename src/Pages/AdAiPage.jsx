import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext/supabaseAuthContext'; // Import useAuth to access userRole
import DextIllustration from '../assets/flora_and_fauna_identification.png';
import '../adaipage.css';
import AdminTop from '../components/AdminTop';
import Top from '../components/Top'; // Import Top component
import Footer1 from '../components/Footer1';

export default function AdaIPage() {
  const { userRole, userLoggedIn, loading } = useAuth(); // Access userRole from auth context
  const navigate = useNavigate();

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect if user is not logged in or has an unexpected role
  if (!userLoggedIn || (userRole !== 'admin' && userRole !== 'parkguide')) {
    navigate('/index', { replace: true });
    return null;
  }

  // Determine which navbar to render based on userRole
  const NavbarComponent = userRole === 'admin' ? AdminTop : Top;

  return (
    <>
      <NavbarComponent />
      <div className="adaipage" style={{ minHeight: 'calc(90vh - 160px)' }}>
        {/* Title overlapping the box border */}
        <h1 className="adaipage__title fw-bold">DEXT AI</h1>

        <Link to="/identify" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="adaipage__feature-box" style={{ cursor: 'pointer', transition: 'transform 0.2s', ':hover': { transform: 'scale(1.02)' } }}>
            <div className="adaipage__green-card">
              {/* Insert the illustration here */}
              <img
                src={DextIllustration}
                alt="Dext AI illustration"
                className="adaipage__green-card-img"
              />
            </div>

            <div className="adaipage__text-block">
              <h2>Flora & Fauna Identification</h2>
              <p>
                Our AI can identify any endangered animal and plants<br/>
                in the National Park
              </p>
            </div>
          </div>
        </Link>
      </div>
      <Footer1 />
    </>
  );
}