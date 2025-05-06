import Top from '../components/Top';
import Footer1 from '../components/Footer1';
import "../styles.css";
import ExampleImage from "../assets/Image.jpg";

export default function Guide() {
  return (
    <>
      <Top />
      <div className="parkguide-page-container">
        <h1 className="parkguide-page-title">Park Guides</h1>
       

        <div className="parkguide-container">
          <div className="parkguide-box">
            <div className="guide-image">
              <img src={ExampleImage} alt="Emily Chen" />
            </div>
            <h3>Emily Chen</h3>
            <p>Conservation photographer and naturalist with expertise in Borneo's bird species. Leads specialized birdwatching tours.</p>
          </div>
          
          <div className="parkguide-box">
            <div className="guide-image">
              <img src={ExampleImage} alt="David Tan" />
            </div>
            <h3>David Tan</h3>
            <p>Former park ranger with extensive knowledge of Semenggoh's trails and wildlife habitats. Specializes in night safari experiences.</p>
          </div>
          
          <div className="parkguide-box">
            <div className="guide-image">
              <img src={ExampleImage} alt="Lisa Rahman" />
            </div>
            <h3>Lisa Rahman</h3>
            <p>Environmental educator focusing on conservation efforts and sustainable tourism. Expert in engaging visitors of all ages.</p>
          </div>
        </div>

        <div className="parkguide-container" style={{ marginTop: '40px', marginBottom: '60px' }}>
          <div className="parkguide-box">
            <div className="guide-image">
              <img src={ExampleImage} alt="Robert Lim" />
            </div>
            <h3>Robert Lim</h3>
            <p>Botanist specializing in Borneo's unique plant species. Offers tours focused on medicinal plants and traditional uses of rainforest flora.</p>
          </div>
          
          <div className="parkguide-box">
            <div className="guide-image">
              <img src={ExampleImage} alt="Maria Santos" />
            </div>
            <h3>Maria Santos</h3>
            <p>Wildlife photographer and conservation advocate. Helps visitors capture amazing wildlife moments while teaching about ethical wildlife photography.</p>
          </div>
          
          <div className="parkguide-box">
            <div className="guide-image">
              <img src={ExampleImage} alt="James Lee" />
            </div>
            <h3>James Lee</h3>
            <p>Entomologist with a passion for Borneo's insect diversity. Leads specialized tours focusing on the fascinating world of tropical insects.</p>
          </div>
        </div>
      </div>
      <Footer1 />
    </>
  );
}