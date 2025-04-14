import Top from '../components/Top'
import Footer1 from '../components/Footer1';
import "../styles.css";
import ExampleImage from "../assets/image.jpg";



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

  

      
    
     <footer>
        <Footer1/>
      </footer>
    </>
  );
    
}
