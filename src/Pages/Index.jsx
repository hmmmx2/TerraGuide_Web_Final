import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Top from '../components/Top';
import Footer1 from '../components/Footer1';
import SlideshowMap from '../components/SlideshowMap';
import Slideshow2 from '../components/Slideshow2';
import Screenshot from "../components/Screenshot";
import defaultImage from "../assets/parkguide_example.jpg";
import { useEffect, useState } from 'react';
import { getHomepageTimetableData } from '../data/timetableData';
import { getHomepageParkGuides } from '../data/parkGuideData';

export default function Index() {
  const [alert, setAlert] = useState({
    show: false,
    message: 'Login successful!',
    type: 'success'
  });
  const location = useLocation();
  const [timetables, setTimetables] = useState([]);
  const [loadingTimetable, setLoadingTimetable] = useState(true);
  const [timetableError, setTimetableError] = useState(null);
  
  // State for park guides
  const [guides, setGuides] = useState([]);
  const [loadingGuides, setLoadingGuides] = useState(true);
  const [guidesError, setGuidesError] = useState(null);
  
  useEffect(() => {
    const loginSuccess = sessionStorage.getItem('loginSuccess');
    if (loginSuccess === 'true') {
      setAlert({
        show: true,
        message: 'Login successful!',
        type: 'success'
      });
      sessionStorage.removeItem('loginSuccess');
    }
    
    if (location.state?.message) {
      setAlert({
        show: true,
        message: location.state.message,
        type: location.state.type || 'danger'
      });
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  
  useEffect(() => {
    let timer;
    if (alert.show) {
      timer = setTimeout(() => {
        setAlert(prev => ({ ...prev, show: false }));
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [alert.show]);
  
  useEffect(() => {
    const fetchTimetableData = async () => {
      try {
        setLoadingTimetable(true);
        const data = await getHomepageTimetableData();
        setTimetables(data);
      } catch (error) {
        console.error("Error fetching timetable data:", error);
        setTimetableError(error.message);
      } finally {
        setLoadingTimetable(false);
      }
    };
    fetchTimetableData();
  }, []);
  
  // Fetch park guides from database
  useEffect(() => {
    const fetchParkGuides = async () => {
      try {
        setLoadingGuides(true);
        const data = await getHomepageParkGuides();
        setGuides(data);
      } catch (error) {
        console.error("Error fetching park guides:", error);
        setGuidesError(error.message);
      } finally {
        setLoadingGuides(false);
      }
    };

    fetchParkGuides();
  }, []);

  return (
    <>
      <Top />
      
      {alert.show && (
        <div className="position-fixed top-0 start-50 translate-middle-x mt-3" style={{ zIndex: 1100, width: "auto" }}>
          <div className={`alert alert-${alert.type} d-flex align-items-center py-2 px-4`} role="alert">
            <div className="d-flex w-100 justify-content-between align-items-center">
              <div>
                <i className={`bi ${alert.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'} me-2`}></i>
                {alert.message}
              </div>
              <button 
                type="button" 
                className="btn-close ms-3" 
                onClick={() => setAlert(prev => ({ ...prev, show: false }))} 
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
        
        <div className="container mt-5 pt-5">
          <div className="row mb-4 align-items-center">
            <div className="col">
              <h2 className="text-dark fw-bold" style={{ color: '#333' }}>Featured Blogs</h2>
            </div>
            <div className="col-auto">
              <Link 
                to="/blogmenu" 
                className="btn btn-outline-success custom-hover-btn" 
                style={{ borderColor: '#4E6E4E', color: '#4E6E4E' }}
              >
                All Blogs
              </Link>
            </div>
          </div>
          
          <div className="row">
            <div className="col-12">
              <Slideshow2 />
            </div>
          </div>
        </div>
        
        <div className="container my-5">
          <div className="row mb-4 align-items-center">
            <div className="col">
              <h2 className="text-dark fw-bold" style={{ color: '#333' }}>Timetable</h2>
            </div>
            <div className="col-auto">
              <Link 
                to="/timetable" 
                className="btn btn-outline-success custom-hover-btn" 
                style={{ borderColor: '#4E6E4E', color: '#4E6E4E' }}
              >
                See all activities
              </Link>
            </div>
          </div>
          
          <div className="row g-4">
            {loadingTimetable ? (
              <div className="col-12 text-center">
                <div className="spinner-border text-success" role="status" style={{ color: '#4E6E4E' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : timetableError ? (
              <div className="col-12">
                <div className="alert alert-danger" role="alert">
                  Error loading timetable: {timetableError}
                </div>
              </div>
            ) : (
              timetables.map((timetable) => (
                <div key={timetable.id} className="col-md-4">
                  <div className="p-5 shadow-sm" style={{ backgroundColor: '#fff', borderRadius: '10px', height: '100%' }}>
                    <div className="badge terra-green text-white mb-3 fs-5" style={{ backgroundColor: '#4E6E4E' }}>{timetable.time}</div>
                    <h4 className="text-dark mb-3 fs-3" style={{ color: '#333' }}>{timetable.title}</h4>
                    <p className="text-muted mb-0 fs-5" style={{ color: '#666' }}>{timetable.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="container my-5 pb-5">
          <div className="row mb-4 align-items-center">
            <div className="col">
              <h2 className="text-dark fw-bold" style={{ color: '#333' }}>Park Guides</h2>
            </div>
            <div className="col-auto">
              <Link 
                to="/guide" 
                className="btn btn-outline-success custom-hover-btn" 
                style={{ borderColor: '#4E6E4E', color: '#4E6E4E' }}
              >
                See all guides
              </Link>
            </div>
          </div>
          
          <div className="row g-4">
            {loadingGuides ? (
              <div className="col-12 text-center">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : guidesError ? (
              <div className="col-12">
                <div className="alert alert-danger" role="alert">
                  Error loading guides: {guidesError}
                </div>
              </div>
            ) : guides.length === 0 ? (
              <div className="col-12">
                <div className="alert alert-info text-center">
                  No park guides available at the moment.
                </div>
              </div>
            ) : (
              guides.map((guide) => (
                <div key={guide.id} className="col-md-4">
                  <div className="card h-100 shadow-sm border-0">
                    <div className="card-img-top overflow-hidden" style={{ height: "200px" }}>
                      <img 
                        src={guide.avatar_url || defaultImage} 
                        alt={guide.username}
                        className="img-fluid w-100 h-100 object-fit-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultImage;
                        }}
                      />
                    </div>
                    <div className="card-body">
                      <h4 className="card-title">{guide.username}</h4>
                      <p className="card-text text-muted">{guide.bio || guide.designation}</p>
                      <Link to={`/book-guide/${guide.id}`} state={{ guide }} className="btn btn-success mt-2">
                        Book this Guide
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      <Footer1 />
      
      <style>
        {`
          .custom-hover-btn:hover {
            color: #fff !important;
            background-color: #4E6E4E !important;
            border-color: #4E6E4E !important;
          }
          .terra-green {
            background-color: #4E6E4E!important;
          }
        `}
      </style>
    </>
  );
}