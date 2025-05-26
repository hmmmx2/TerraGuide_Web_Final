import Top from '../components/Top';
import Footer1 from '../components/Footer1';
import "../courseabout.css"; // Ensure this path is correct
import courseBanner from "../assets/onlineC1.png"; // Use the actual screenshot as the banner
import instructorAvatar from "../assets/ang.jpg"; // You'll need to add an image for Steven He
import videoThumbnail1 from "../assets/onlineC2.png"; // Placeholder, create this image
import videoThumbnail2 from "../assets/onlineC3.png"; // Placeholder, create this image

import { useState } from 'react'; // Import useState

export default function CourseAbout() {
  const [activeTab, setActiveTab] = useState('About'); // State for active tab

  // Data for lessons
  const lessons = [
    { id: 1, type: 'video', title: 'Basics of Park Guiding', duration: '45 mins', thumbnail: videoThumbnail1, completed: true },
    { id: 2, type: 'video', title: 'Understanding the Environ...', duration: '45 mins', thumbnail: videoThumbnail2, completed: true },
    { id: 3, type: 'exercise', title: 'Exercise', duration: '15 mins', completed: true },
    { id: 4, type: 'quiz', title: 'Quiz', duration: '45 mins', completed: true },
    { id: 5, type: 'survey', title: 'Survey', duration: '45 mins', completed: false },
  ];

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
          <div
            className={`course-tab ${activeTab === 'About' ? 'active' : ''}`}
            onClick={() => setActiveTab('About')}
          >
            About
          </div>
          <div
            className={`course-tab ${activeTab === 'Lessons' ? 'active' : ''}`}
            onClick={() => setActiveTab('Lessons')}
          >
            Lessons
          </div>
          <div
            className={`course-tab ${activeTab === 'Reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('Reviews')}
          >
            Reviews
          </div>
        </div>

        {/* Conditional Content Rendering */}
        {activeTab === 'About' && (
          <>
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
              <button className="enroll-button">Enroll For Free</button>
            </div>
          </>
        )}

        {activeTab === 'Lessons' && (
          <div className="lessons-list-container">
            {lessons.map(lesson => (
              <div key={lesson.id} className="lesson-item">
                <div className="lesson-icon-container">
                  {lesson.type === 'video' ? (
                    <>
                      <img src={lesson.thumbnail} alt={lesson.title} className="video-thumbnail" />
                      <div className="play-button-overlay">▶</div> {/* Play button overlay */}
                    </>
                  ) : (
                    <div className={`generic-lesson-icon ${lesson.type}-icon`}>
                      {/* Icons for Exercise, Quiz, Survey */}
                      {lesson.type === 'exercise' && '📄'} {/* Document icon */}
                      {lesson.type === 'quiz' && '📝'} {/* Quiz icon */}
                      {lesson.type === 'survey' && '📋'} {/* Survey icon */}
                    </div>
                  )}
                </div>
                <div className="lesson-details">
                  <p className="lesson-title">{lesson.title}</p>
                  <p className="lesson-duration">{lesson.duration}</p>
                </div>
                <div className={`lesson-checkbox ${lesson.completed ? 'completed' : ''}`}>
                  {lesson.completed && '✔'} {/* Checkmark */}
                </div>
              </div>
            ))}
            <button className="enroll-button">Enroll For Free</button>
          </div>
        )}

        {/* You can add a similar block for 'Reviews' tab later if needed */}
      </div>

      <footer>
        <Footer1 />
      </footer>
    </>
  );
}