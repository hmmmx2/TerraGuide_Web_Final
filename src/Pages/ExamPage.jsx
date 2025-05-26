import Top from '../components/Top';
import Footer1 from '../components/Footer1';
import "../exampage.css";
// Assuming you have an image for the banner. Replace 'sarawakForestryBanner.png' with your actual image path.
import sarawakForestryBanner from "../assets/License.png"; // You'll need to add this image

// Placeholder icons (you might want to replace these with actual SVG/font icons)
const OrganizedIcon = () => <span className="icon">🏢</span>;
const TimeIcon = () => <span className="icon">🕒</span>;
const LicenseIcon = () => <span className="icon">📄</span>;
const ExamDocIcon = () => <span className="icon">📝</span>; // Icon for the exam section

export default function ExamPage() { // Renamed from Test to ExamPage for clarity
  return (
    <>
      <Top />
      <div className="exam-page-container">
        {/* Top Banner Section */}
        <div className="exam-banner-section">
          <img
            src={sarawakForestryBanner} // Use the specific image here
            alt="Sarawak Forestry Corporation Banner"
            className="exam-banner-image"
          />
          <span className="exam-price-tag">RM100</span>
        </div>

        {/* Course Title and Prerequisite */}
        <div className="exam-details-section">
          <h1 className="exam-page-title">License Park Guides</h1>
          <p className="exam-prerequisite">
            Prerequisite - Introduction to Park Guide & Advanced Park Guiding
          </p>

          {/* Info Cards */}
          <div className="exam-info-cards">
            <div className="info-card-item">
              <OrganizedIcon />
              <p>Organized by SFC</p>
            </div>
            <div className="info-card-item">
              <TimeIcon />
              <p>1 hour</p>
            </div>
            <div className="info-card-item">
              <LicenseIcon />
              <p>License (3 years)</p>
            </div>
          </div>

          {/* Required Course & Mentoring Programme */}
          <div className="required-courses-section">
            <h2 className="section-header">Required Course & Mentoring Programme</h2>
            <div className="course-item">
              <span className="checkbox checked">✔</span>
              <p>Introduction to Park Guide</p>
            </div>
            <div className="course-item">
              <span className="checkbox checked">✔</span>
              <p>Advanced Park Guiding</p>
            </div>
            <div className="course-item">
              <span className="checkbox checked">✔</span>
              <p>Park Guide in Training: Park Guide Mentors...</p>
            </div>
          </div>

          {/* Exam Section */}
          <div className="exam-item-section">
            <div className="exam-item-icon-container">
              <ExamDocIcon />
            </div>
            <div className="exam-item-details">
              <h2 className="exam-item-title">Exam</h2>
              <p className="exam-item-duration">1 hour</p>
            </div>
            {/* The small square icon on the right, which seems like a placeholder or status indicator */}
            <div className="exam-item-status-icon"></div>
          </div>

          {/* Horizontal Line after Exam Section */}
          <hr className="section-divider" />

          {/* Start Exam Button */}
          <button className="start-exam-button">
            Start Exam
          </button>
        </div>
      </div>

      <footer>
        <Footer1 />
      </footer>
    </>
  );
}