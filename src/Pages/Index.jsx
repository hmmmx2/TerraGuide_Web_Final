import { Link } from 'react-router-dom';
import Top from '../components/Top';
import Footer1 from '../components/Footer1';
import SlideshowMap from '../components/SlideshowMap'; // import the new component
import Slideshow2 from '../components/Slideshow2'; // import the new component
import Screenshot from "../components/Screenshot";
import "../styles.css";
import ExampleImage from "../assets/parkguide_example.jpg";
import ExampleImage4 from "../assets/jz.jpg";
import ExampleImage3 from "../assets/des1.jpg";

export default function Index() {
  return (
    <>
      <Top />
      <>
      <Screenshot />

      <SlideshowMap/>
      
  

 



      <div style={{ marginTop: "400px" }}>

      <div className="table-sectionFB">
    <div className="table-title-containerFB">
      <h1 className="table-titleFB">Featured Blogs</h1>
      <Link to="/blogmenu" className="see-all-btn">All Blogs</Link>

    </div>

  </div>
  </div>
        <Slideshow2 />

      



    <div className="timetable-section">
      <div className="timetable-title-container">
        <h1 className="timetable-title">Timetable</h1>
        <Link to="/timetable" className="see-all-btn">See all activities</Link>
        
      </div>
      
      <div className="timetable-container">
    
        <div className="timetable-box">
          <div className="time-badge">9:00am</div>
          <h3>Morning Briefing & Preparation</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut erat et metus varius.</p>
        </div>
        

        <div className="timetable-box">
          <div className="time-badge">10:30am</div>
          <h3>Morning Guided Nature Walk</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut erat et metus varius.</p>
        </div>
        
        <div className="timetable-box">
          <div className="time-badge">12:00pm</div>
          <h3>Break & Rest</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut erat et metus varius. Nulla vitae et amet.</p>
        </div>
      </div>
    </div>

    <div className="parkguide-section">
      <div className="parkguide-title-container">
        <h1 className="parkguide-title">Park Guides</h1>
        <Link to="/guide" className="see-all-btn">See all guides</Link>
      </div>
      
      <div className="parkguide-container">
   
        <div className="parkguide-box">
          <div className="guide-image">
                   <img
                                        src={ExampleImage}
                                        alt="Login Illustration"
                                      />
                  
          </div>
          <h3>Aeron Liu</h3>
          <p>Entomologist with a passion for Borneo's insect diversity. Leads specialized tours focusing on the fascinating world of tropical insects.</p>
        </div>
        
   
        <div className="parkguide-box">
          <div className="guide-image">
                 <img
                                      src={ExampleImage4}
                                      alt="Login Illustration"
                                    />
                
          </div>
          <h3>Jun Zhen</h3>
          <p>Botanist specializing in Borneo's unique plant species. Offers tours focused on medicinal plants and traditional uses of rainforest flora.</p>
        </div>
        
       
        <div className="parkguide-box">
          <div className="guide-image">
                 <img
                                      src={ExampleImage3}
                                      alt="Login Illustration"
                                    />
                
          </div>
          <h3>Desmond Li</h3>
          <p>Former park ranger with extensive knowledge of Semenggoh's trails and wildlife habitats. Specializes in night safari experiences at 3 a.m.</p>
        </div>
      </div>
    </div>

</>


    <div style={{ marginTop: "0px" }}>
      <Footer1/>
    </div>

    </>
  );
}

