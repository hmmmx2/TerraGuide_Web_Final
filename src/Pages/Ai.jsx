import Top from '../components/Top'
import Footer1 from '../components/Footer1';
import "../styles.css";
import ExampleImage from "../assets/chin.jpg";



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

      <p>insert ai here</p>
      </>

  

      
    
     <footer>
        <Footer1/>
      </footer>
    </>
  );
    
}
