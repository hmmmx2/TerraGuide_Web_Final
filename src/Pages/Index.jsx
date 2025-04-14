import Top from '../components/Top';
import Footer1 from '../components/Footer1';
import Slideshow from '../components/Slideshow'; // import the new component
import Slideshow2 from '../components/Slideshow2'; // import the new component
import Map from '../components/Map';
import "../styles.css";

export default function Index() {
  return (
    <>
      <Top />


      
  <Slideshow />






      <div style={{ marginTop: "900px" }}>
        <div className="table-sectionFB">
          <div className="table-title-containerFB">
            <h1 className="table-titleFB">Featured Blogs</h1>
            <a href="Blogs2.jsx" className="see-all-btn2FB">All blogs</a>
          </div>
        </div>
          <Slideshow2 />
      </div>

      <Map/>






    <div style={{ marginTop: "500px" }}>
      <Footer1/>
    </div>

    </>
  );
}

