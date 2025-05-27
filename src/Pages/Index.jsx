import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Top from '../components/Top';
import Footer1 from '../components/Footer1';
import SlideshowMap from '../components/SlideshowMap';
import Slideshow2 from '../components/Slideshow2';
import Screenshot from "../components/Screenshot";
import ExampleImage from "../assets/parkguide_example.jpg";
import ExampleImage4 from "../assets/jz.jpg";
import ExampleImage3 from "../assets/des1.jpg";
import { useEffect, useState } from 'react';
import { getHomepageTimetableData, useTimetableData } from '../data/timetableData';

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
            <div className="col-md-4">
              <div className="p-5 shadow-sm" style={{ backgroundColor: '#fff', borderRadius: '10px', height: '100%' }}>
                <div className="overflow-hidden" style={{ height: '250px' }}>
                  <img src={ExampleImage} alt="Aeron Liu" className="img-fluid w-100 h-100 object-fit-cover rounded-3" />
                </div>
                <h4 className="text-dark mt-4 mb-3 fs-3" style={{ color: '#333' }}>Aeron Liu</h4>
                <p className="text-muted mb-0 fs-5" style={{ color: '#666' }}>Entomologist with a passion for Borneo's insect diversity. Leads specialized tours focusing on the fascinating world of tropical insects.</p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="p-5 shadow-sm" style={{ backgroundColor: '#fff', borderRadius: '10px', height: '100%' }}>
                <div className="overflow-hidden" style={{ height: '250px' }}>
                  <img src={ExampleImage4} alt="Jun Zhen" className="img-fluid w-100 h-100 object-fit-cover rounded-3" />
                </div>
                <h4 className="text-dark mt-4 mb-3 fs-3" style={{ color: '#333' }}>Jun Zhen</h4>
                <p className="text-muted mb-0 fs-5" style={{ color: '#666' }}>Botanist specializing in Borneo's unique plant species. Offers tours focused on medicinal plants and traditional uses of rainforest flora.</p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="p-5 shadow-sm" style={{ backgroundColor: '#fff', borderRadius: '10px', height: '100%' }}>
                <div className="overflow-hidden" style={{ height: '250px' }}>
                  <img src={ExampleImage3} alt="Desmond Li" className="img-fluid w-100 h-100 object-fit-cover rounded-3" />
                </div>
                <h4 className="text-dark mt-4 mb-3 fs-3" style={{ color: '#333' }}>Desmond Li</h4>
                <p className="text-muted mb-0 fs-5" style={{ color: '#666' }}>Former park ranger with extensive knowledge of Semenggoh's trails and wildlife habitats. Specializes in night safari experiences at 3 a.m.</p>
              </div>
            </div>
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