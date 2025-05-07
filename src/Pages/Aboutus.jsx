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

export default function Test() {
  return (
    <>
      <Top/>
      <div className="about-us-container">
        {/* Alwin at the top */}
        <div className="profile-top">
          <div className="profile-image-container">
            <img
              src={Alwin}
              className="profile-image"
              alt="Alwin"
            />
          </div>
          <p className="profile-description">I know I look very ugly and horrible. Can't help, born this way</p>
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
            <p className="profile-description">Hi, I am Desmond. I am studying in Bachelor of Computer Science and majoring in software development. 
            My skill sets include IoT from doing IoT projects at Swinburne, and Java web development when I did internship at SAINS. 
            Additionally, I serve in my church ministry as a guitarist during the weekends.</p>
          </div>

          <div className="profile-item">
            <div className="profile-image-container">
              <img
                src={Angel}
                className="profile-image"
                alt="Angel"
              />
            </div>
            <p className="profile-description">Hobby: sleeping & playing badminton & playing games<br/>
            skill: can sleep anytime no matter how much I've sleep, coffee has zero effect on me🪄✨<br/>
            Course & major: Compsci year 2 sem 2</p>
          </div>

          <div className="profile-item">
            <div className="profile-image-container">
              <img
                src={Chin}
                className="profile-image"
                alt="Chin"
              />
            </div>
            <p className="profile-description"> Name: Wei Chien CHIN <br/>
            Id: 104401173<br/>
            Hobby: Eat delicious food<br/>
            Year: 2<br/>
            Semester: 2<br/>
            Course: Bachelor of Computer Science<br/>
            Major: Data science <br/>
            Skill: Cooking (?)</p>
          </div>
        </div>

        {/* Second row of three people */}
        <div className="profile-row">
          <div className="profile-item">
            <div className="profile-image-container">
              <img
                src={JZ}
                className="profile-image"
                alt="JZ"
              />
            </div>
            <p className="profile-description"> Hi my name is Wong Jun Zhen and I hope we can be friends!</p>
          </div>

          <div className="profile-item">
            <div className="profile-image-container">
              <img
                src={Daryl}
                className="profile-image"
                alt="Daryl"
              />
            </div>
            <p className="profile-description">My name is Daryl Lim. Major Cybersecurity, Y2S2. </p>
          </div>

          <div className="profile-item">
            <div className="profile-image-container">
              <img
                src={Aeron}
                className="profile-image"
                alt="Aeron"
              />
            </div>
            <p className="profile-description">My name is Aeron Liu. Likes tung tung tung tung sahur. Potential sigma boy (?)</p>
          </div>
        </div>
      </div>

      <footer>
        <Footer1/>
      </footer>
    </>
  );
}