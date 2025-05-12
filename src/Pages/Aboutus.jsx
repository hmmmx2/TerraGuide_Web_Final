import Top from '../components/Top'
import Footer1 from '../components/Footer1';
import "../styles.css";
import Alwin from "../assets/alwin.jpg";
import Desmond from "../assets/des1.jpg";
import Angel from "../assets/ang.jpg";
import Chin from "../assets/chin.jpg";
import JZ from "../assets/jz.jpg";
import Daryl from "../assets/daryl.jpg";
import Aeron from "../assets/aeron.jpg";

export default function AboutUs() {
  return (
    <>
      <Top/>
      <div className="about-us-container">
        {/* Alwin at the top */}
        <div className="profile-top">
  <div className="profile-item">
    <div className="profile-image-container">
      <img
        src={Alwin}
        className="profile-image"
        alt="Alwin"
      />
    </div>
    <div className="profile-description">
      <h3>Alwin Jing Xue TAY</h3>
      <p><strong>Student ID:</strong> 104399430</p>
      <p><strong>Hobby:</strong> Cook different cuisine and bake dessert from around the world</p>
      <p><strong>Dream:</strong> Build my own LLM and write a research paper</p>
      <p><strong>Zodiac:</strong> Gemini</p>
      <p><strong>Favorite Movie:</strong> Violet Evergarden: The Movie</p>
      <p><strong>Favorite Game:</strong> Wuthering Waves</p>
    </div>
  </div>
</div>


        {/* First row of three people */}
        <div className="profile-row">
          <div className="profile-item">
            <div className="profile-image-container">
              <img
                src={Desmond}
                className="profile-image"
                alt="Desmond"
              />
            </div>
            <div className="profile-description">
              <h3>Li Yi CHUA</h3>
              <p><strong>Student ID:</strong> 104401021</p>
              <p><strong>Hobby:</strong> Electric guitar</p>
              <p><strong>Dream:</strong> Play solos with 0 mistakes</p>
              <p><strong>Zodiac:</strong> Scorpio</p>
              <p><strong>Favorite Movies:</strong> Inception, Interstellar</p>
              <p><strong>Favorite Games:</strong> Minecraft, Team Fortress 2</p>
            </div>
          </div>

          <div className="profile-item">
            <div className="profile-image-container">
              <img
                src={Angel}
                className="profile-image"
                alt="Angel"
              />
            </div>
            <div className="profile-description">
              <h3>Angel Lek</h3>
              <p><strong>Student ID:</strong> 1044398660</p>
              <p><strong>Hobby:</strong> Sleep</p>
              <p><strong>Zodiac:</strong> Scorpio</p>
              <p><strong>Favorite Movie:</strong> Can't recall any (Best movie in 1984)</p>
              <p><strong>Favorite Games:</strong> Little Nightmare 1&2, Resident Evil, Crime Scene Cleaner</p>
            </div>
          </div>

          <div className="profile-item">
            <div className="profile-image-container">
              <img
                src={Chin}
                className="profile-image"
                alt="Chin"
              />
            </div>
            <div className="profile-description">
              <h3>Wei Chien CHIN</h3>
              <p><strong>Hobby:</strong> Cooking</p>
              <p><strong>Dream:</strong> Traveling Abroad</p>
              <p><strong>Zodiac:</strong> Leo</p>
              <p><strong>Favorite Movie:</strong> Ultraman</p>
              <p><strong>Favorite Game:</strong> Clash of Clans</p>
            </div>
          </div>
        </div>

        {/* Second row of three people */}
        <div className="profile-row">
          <div className="profile-item">
            <div className="profile-image-container">
              <img
                src={JZ}
                className="profile-image"
                alt="Jun Zhen"
              />
            </div>
            <div className="profile-description">
              <h3>Jun Zhen WONG</h3>
              <p><strong>Student ID:</strong> 104385730</p>
              <p><strong>Hobby:</strong> Video games, guitar (starter)</p>
              <p><strong>Zodiac:</strong> Taurus</p>
              <p><strong>Favorite Movies:</strong> Interstellar, John Wick</p>
              <p><strong>Favorite Games:</strong> Warframe, Monster Hunter, GTA V</p>
            </div>
          </div>

          <div className="profile-item">
            <div className="profile-image-container">
              <img
                src={Daryl}
                className="profile-image"
                alt="Daryl"
              />
            </div>
            <div className="profile-description">
              <h3>Daryl Lim</h3>
              <p><strong>Student ID:</strong> 102779043</p>
              <p><strong>Hobby:</strong> Having fun</p>
              <p><strong>Zodiac:</strong> Taurus</p>
              <p><strong>Favorite Movie:</strong> Iron Man 1</p>
              <p><strong>Favorite Games:</strong> Minecraft, The Sims 4</p>
            </div>
          </div>

          <div className="profile-item">
            <div className="profile-image-container">
              <img
                src={Aeron}
                className="profile-image"
                alt="Aeron"
              />
            </div>
            <div className="profile-description">
              <h3>Aeron Liu</h3>
              <p><strong>Student ID:</strong> 102769264</p>
              <p><strong>Hobby:</strong> Casual gaming, aeroplane</p>
              <p><strong>Zodiac:</strong> Aries</p>
              <p><strong>Favorite Movie:</strong> The Truman Show</p>
              <p><strong>Favorite Games:</strong> Sekiro, Resident Evil, Monster Hunter, Minecraft</p>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <Footer1/>
      </footer>
    </>
  );
}