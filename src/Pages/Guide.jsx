import Top from '../components/Top';
import Footer1 from '../components/Footer1';
import "../styles.css";
import ExampleImage from "../assets/Image.jpg";
import ExampleImage2 from "../assets/ang.jpg";
import ExampleImage3 from "../assets/des1.jpg";
import ExampleImage4 from "../assets/jz.jpg";
import ExampleImage5 from "../assets/chin.jpg";
import ExampleImage6 from "../assets/daryl.jpg";

export default function Guide() {
  return (
    <>
      <Top />
      <div className="parkguide-page-container">
        <h1 className="parkguide-page-title">Park Guides</h1>
       

        <div className="parkguide-container">
          <div className="parkguide-box">
            <div className="guide-image">
              <img src={ExampleImage2} alt="Angel Lek" />
            </div>
            <h3>Angel Lek</h3>
            <p>Conservation photographer and naturalist with expertise in Borneo's bird species. Leads specialized birdwatching tours. Likes watching birds as in birdwatching.</p>
          </div>
          
          <div className="parkguide-box">
            <div className="guide-image">
              <img src={ExampleImage3} alt="Desmond Li" />
            </div>
            <h3>Desmond Li</h3>
            <p>Former park ranger with extensive knowledge of Semenggoh's trails and wildlife habitats. Specializes in night safari experiences at 3 a.m.</p>
          </div>
          
          <div className="parkguide-box">
            <div className="guide-image">
              <img src={ExampleImage5} alt="Chin" />
            </div>
            <h3>Chin</h3>
            <p>Environmental educator focusing on conservation efforts and sustainable tourism. Expert in engaging visitors of all ages.</p>
          </div>
        </div>

        <div className="parkguide-container" style={{ marginTop: '40px', marginBottom: '60px' }}>
          <div className="parkguide-box">
            <div className="guide-image">
              <img src={ExampleImage4} alt="Robert Lim" />
            </div>
            <h3>Jun Zhen</h3>
            <p>Botanist specializing in Borneo's unique plant species. Offers tours focused on medicinal plants and traditional uses of rainforest flora.</p>
          </div>
          
          <div className="parkguide-box">
            <div className="guide-image">
              <img src={ExampleImage6} alt="Maria Santos" />
            </div>
            <h3>Daryl Lim</h3>
            <p>Wildlife photographer and conservation advocate. Helps visitors capture amazing wildlife moments while teaching about ethical wildlife photography.</p>
          </div>
          
          <div className="parkguide-box">
            <div className="guide-image">
              <img src={ExampleImage} alt="James Lee" />
            </div>
            <h3>Aeron Liu</h3>
            <p>Entomologist with a passion for Borneo's insect diversity. Leads specialized tours focusing on the fascinating world of tropical insects.</p>
          </div>
        </div>
      </div>
      <Footer1 />
    </>
  );
}