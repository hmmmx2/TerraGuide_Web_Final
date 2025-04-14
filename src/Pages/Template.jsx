import Top from '../components/Top'
import Footer1 from '../components/Footer1';
import "../styles.css";
import ExampleImage from "../assets/image.jpg";
import Slideshow2 from '../components/Slideshow2';


export default function Test() {
  return (
    <>
      <Top/>
      <>

       <img
                      src={ExampleImage}
                      className="registration-svg-image"
                      alt="Login Illustration"
                    />

      <p>Make sure change information at App.jsx to make it work and place images in assets folder.</p>
      </>

      <Slideshow2/>

      
    
     <footer>
        <Footer1/>
      </footer>
    </>
  );
    
}
