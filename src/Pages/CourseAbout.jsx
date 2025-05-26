import Top from '../components/Top';
import Footer1 from '../components/Footer1';
import "../courseabout.css"; // Ensure this path is correct
import courseBanner from "../assets/onlineC1.png"; // Use the actual screenshot as the banner
import instructorAvatar from "../assets/ang.jpg"; // You'll need to add an image for Steven He

export default function CourseAbout() {
  return (
    <>
      <Top />
      <div className="course-about-page-container">
        {/* Header Image Section */}
        <div className="course-banner-container">
          <img
            src={courseBanner} // The main course image
            alt="Park Ranger Course Banner"
            className="course-banner-image"
          />
          <span className="course-free-tag">Free</span>
        </div>

        {/* Course Main Info */}
        <div className="course-main-info">
          <h1 className="course-title">Introduction to Park Guide</h1>
          <p className="course-rating">
            <span className="star-icon">★</span> 4.8 (2,678 reviews) | Park Guide
          </p>

          {/* Info Cards */}
          <div className="info-cards-container">
            <div className="info-card">
              <div className="info-icon">👥</div> {/* Placeholder for students icon */}
              <p className="info-text">7,983 students</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🕒</div> {/* Placeholder for hours icon */}
              <p className="info-text">3.5 hours</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🏆</div> {/* Placeholder for sponsored icon */}
              <p className="info-text">Sponsored</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="course-tabs-container">
          <div className="course-tab active">About</div>
          <div className="course-tab">Lessons</div>
          <div className="course-tab">Reviews</div>
        </div>

        {/* Instructor Section */}
        <div className="instructor-section">
          <img
            src={instructorAvatar} // Instructor's image
            alt="Steven He"
            className="instructor-avatar"
          />
          <div className="instructor-details">
            <p className="instructor-name">Steven He</p>
            <p className="instructor-role">Park Ranger</p>
          </div>
        </div>

        {/* About Course Content */}
        <div className="about-course-content">
          <h2 className="section-title">About Course</h2>
          <p className="course-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.
          </p>
        </div>
      </div>

      <footer>
        <Footer1 />
      </footer>
    </>
  );
}