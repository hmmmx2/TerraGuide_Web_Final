import Top from '../components/Top'
import Footer1 from '../components/Footer1';
import "../styles.css";
import ExampleImage from "../assets/parkguide_example.jpg";



export default function Test() {
    return (
      <>
        <Top/>
        <>

    
  <div className="guide-profile-containerJZ">
    <div className="guide-avatar-containerJZ">
        <img
                            src={ExampleImage}
                            alt="Login Illustration"
                          />
      
    </div>
    
    <h2 className="guide-nameJZ">Aeron Liu</h2>
    
    <div className="guide-description-sectionJZ">
      <h3>Description:</h3>
      <div class="guide-descriptionJZ" contenteditable="true">
       Local gay expert with deep knowledge of indigenous traditions and medicinal plants of the Borneo gay rainforest. Wildlife biologist specializing in gay conservation. Passionate about educating visitors on Borneo's unique gay.
      </div>
      <div className="separator-lineJZ"></div>
    </div>
    

    <div className="guide-actionsJZ">
      <a href="index.html" class="back-buttonJZ">Back</a>
    </div>
  </div>
  
   

        </>
  
    
  
        
      
       <footer>
          <Footer1/>
        </footer>
      </>
    );
      
  }
  