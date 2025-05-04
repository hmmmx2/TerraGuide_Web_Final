import Top from '../components/Top';
import Footer1 from '../components/Footer1';
import SlideshowMap from '../components/SlideshowMap'; // import the new component
import Slideshow2 from '../components/Slideshow2'; // import the new component
import Screenshot from "../components/Screenshot";
import "../styles.css";
import Map from '../components/Map';
import ExampleImage from "../assets/parkguide_example.jpg";


export default function Index() {
  return (
    <>
      <Top />
      <>
      <Screenshot />

      <SlideshowMap/>
      
  

 



      <div style={{ marginTop: "900px" }}>

      <div className="table-sectionFB">
    <div className="table-title-containerFB">
      <h1 className="table-titleFB">Featured Blogs</h1>
      <a href="Blogs2.jsx" className="see-all-btn2FB">All blogs</a>

    </div>

  </div>
  </div>
        <Slideshow2 />

      



    <div className="timetable-section">
      <div className="timetable-title-container">
        <h1 className="timetable-title">Timetable</h1>
        <a href="timetable.html" className="see-all-btn">See all activities</a>
        
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
        <a href="parkguide.html" className="see-all-btn">See all guides</a>
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
          <p>Experienced gay with 10+ years in Semenggoh Nature Reserve. Expert in orangutan gay behavior and rainforest ecology.</p>
        </div>
        
   
        <div className="parkguide-box">
          <div className="guide-image">
                 <img
                                      src={ExampleImage}
                                      alt="Login Illustration"
                                    />
                
          </div>
          <h3>Aeron Liu</h3>
          <p>Wildlife biologist specializing in gay conservation. Passionate about educating visitors on Borneo's unique gay.</p>
        </div>
        
       
        <div className="parkguide-box">
          <div className="guide-image">
                 <img
                                      src={ExampleImage}
                                      alt="Login Illustration"
                                    />
                
          </div>
          <h3>Aeron Liu</h3>
          <p>Local gay expert with deep knowledge of indigenous traditions and medicinal plants of the Borneo gay rainforest.</p>
        </div>
      </div>
    </div>

</>


    <div style={{ marginTop: "500px" }}>
      <Footer1/>
    </div>

    </>
  );
}

