import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom'; // Add this import
import Top from '../components/Top';
import Footer1 from '../components/Footer1';
import SlideshowMap from '../components/SlideshowMap';
import Slideshow2 from '../components/Slideshow2';
import Screenshot from "../components/Screenshot";
import ExampleImage from "../assets/parkguide_example.jpg";
import ExampleImage4 from "../assets/jz.jpg";
import ExampleImage3 from "../assets/des1.jpg";
import { useEffect, useState } from 'react';

export default function Index() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success'); // Add this state
  const [alertMessage, setAlertMessage] = useState('Login successful!'); // Add this state
  const location = useLocation(); // Add this hook
  
  useEffect(() => {
    // Check if user just logged in
    const loginSuccess = sessionStorage.getItem('loginSuccess');
    if (loginSuccess === 'true') {
      // Show alert
      setShowAlert(true);
      setAlertType('success');
      setAlertMessage('Login successful!');
      
      // Remove the flag from sessionStorage
      sessionStorage.removeItem('loginSuccess');
      
      // Auto-hide alert after 3 seconds
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
    
    // Check for logout message from location state
    if (location.state?.message) {
      setShowAlert(true);
      setAlertType(location.state.type || 'danger');
      setAlertMessage(location.state.message);
      
      // Clear the location state
      window.history.replaceState({}, document.title);
      
      // Auto-hide alert after 3 seconds
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [location]);
  
  return (
    <>
      <Top />
      
      {/* Bootstrap 5 Alert - Top Center */}
      {showAlert && (
        <div className="position-fixed top-0 start-50 translate-middle-x mt-3" style={{ zIndex: 1100, width: "auto" }}>
          <div className={`alert alert-${alertType} d-flex align-items-center py-2 px-4`} role="alert">
            <div className="d-flex w-100 justify-content-between align-items-center">
              <div>
                <i className={`bi ${alertType === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'} me-2`}></i>
                <strong>{alertMessage}</strong>
              </div>
              <button 
                type="button" 
                className="btn-close ms-3" 
                onClick={() => setShowAlert(false)} 
                aria-label="Close"
              ></button>
            </div>
          </div>
        </div>
      )}
      
      <div className="container-fluid p-0">
        <Screenshot />
        
        <div className="container-fluid pt-5 mt-4">
          <SlideshowMap />
        </div>
        
        {/* Featured Blogs Section */}
        <div className="container mt-5 pt-5">
          <div className="row mb-4 align-items-center">
            <div className="col">
              <h2 className="text-dark fw-bold">Featured Blogs</h2>
            </div>
            <div className="col-auto">
              <Link to="/blogmenu" className="btn btn-outline-success">All Blogs</Link>
            </div>
          </div>
          
          <div className="row">
            <div className="col-12">
              <Slideshow2 />
            </div>
          </div>
        </div>
        
        {/* Timetable Section */}
        <div className="container my-5">
          <div className="row mb-4 align-items-center">
            <div className="col">
              <h2 className="text-dark fw-bold">Timetable</h2>
            </div>
            <div className="col-auto">
              <Link to="/timetable" className="btn btn-outline-success">See all activities</Link>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <div className="badge bg-success text-white mb-2">9:00am</div>
                  <h4 className="card-title">Morning Briefing & Preparation</h4>
                  <p className="card-text text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut erat et metus varius.</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <div className="badge bg-success text-white mb-2">10:30am</div>
                  <h4 className="card-title">Morning Guided Nature Walk</h4>
                  <p className="card-text text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut erat et metus varius.</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <div className="badge bg-success text-white mb-2">12:00pm</div>
                  <h4 className="card-title">Break & Rest</h4>
                  <p className="card-text text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut erat et metus varius. Nulla vitae et amet.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Park Guides Section */}
        <div className="container my-5 pb-5">
          <div className="row mb-4 align-items-center">
            <div className="col">
              <h2 className="text-dark fw-bold">Park Guides</h2>
            </div>
            <div className="col-auto">
              <Link to="/guide" className="btn btn-outline-success">See all guides</Link>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-img-top overflow-hidden" style={{ height: "200px" }}>
                  <img src={ExampleImage} alt="Aeron Liu" className="img-fluid w-100 h-100 object-fit-cover" />
                </div>
                <div className="card-body">
                  <h4 className="card-title">Aeron Liu</h4>
                  <p className="card-text text-muted">Entomologist with a passion for Borneo's insect diversity. Leads specialized tours focusing on the fascinating world of tropical insects.</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-img-top overflow-hidden" style={{ height: "200px" }}>
                  <img src={ExampleImage4} alt="Jun Zhen" className="img-fluid w-100 h-100 object-fit-cover" />
                </div>
                <div className="card-body">
                  <h4 className="card-title">Jun Zhen</h4>
                  <p className="card-text text-muted">Botanist specializing in Borneo's unique plant species. Offers tours focused on medicinal plants and traditional uses of rainforest flora.</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-img-top overflow-hidden" style={{ height: "200px" }}>
                  <img src={ExampleImage3} alt="Desmond Li" className="img-fluid w-100 h-100 object-fit-cover" />
                </div>
                <div className="card-body">
                  <h4 className="card-title">Desmond Li</h4>
                  <p className="card-text text-muted">Former park ranger with extensive knowledge of Semenggoh's trails and wildlife habitats. Specializes in night safari experiences at 3 a.m.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer1 />
    </>
  );
}

