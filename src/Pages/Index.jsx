import Top from '../components/Top';
import Footer1 from '../components/Footer1';
import Slideshow from '../components/Slideshow'; // import the new component
import Slideshow2 from '../components/Slideshow2'; // import the new component
import "../styles.css";

export default function Index() {
  return (
    <>
      <Top />
      <Slideshow />






      <div style={{ marginTop: "500px" }}>
        <Slideshow2 />
      </div>







    <div style={{ marginTop: "500px" }}>
      <Footer1/>
      </div>

    </>
  );
}

