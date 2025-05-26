import Top from '../components/Top';
import Footer1 from '../components/Footer1';
import "../courseabout.css"; // Ensure this path is correct
import courseBanner from "../assets/onlineC1.png"; // Use the actual screenshot as the banner
import instructorAvatar from "../assets/ang.jpg"; // Re-using for dummy avatars
import videoThumbnail1 from "../assets/onlineC2.png"; // Placeholder, create this image
import videoThumbnail2 from "../assets/onlineC3.png"; // Placeholder, create this image

import { useState } from 'react'; // Import useState

export default function CourseAbout() {
  const [activeTab, setActiveTab] = useState('About'); // State for active tab

  // Data for lessons (existing)
  const lessons = [
    { id: 1, type: 'video', title: 'Basics of Park Guiding', duration: '45 mins', thumbnail: videoThumbnail1, completed: true },
    { id: 2, type: 'video', title: 'Understanding the Environ...', duration: '45 mins', thumbnail: videoThumbnail2, completed: true },
    { id: 3, type: 'exercise', title: 'Exercise', duration: '15 mins', completed: true },
    { id: 4, type: 'quiz', title: 'Quiz', duration: '45 mins', completed: true },
    { id: 5, type: 'survey', title: 'Survey', duration: '45 mins', completed: false },
  ];

  // NEW: Data for Reviews
  const reviews = [
    {
      id: 1,
      name: 'Jimmy He',
      time: '1 hour ago',
      rating: 4, // out of 5
      avatar: instructorAvatar, // Use your actual avatar path for Jimmy
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
    },
    {
      id: 2,
      name: 'Timmy He',
      time: '1 hour ago',
      rating: 4, // out of 5
      avatar: instructorAvatar, // Use your actual avatar path for Timmy
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
    },
    // Add more dummy reviews here if you want to see more in the list
  ];

  // NEW: Data for Rating Distribution
  const ratingDistribution = [
    { stars: 5, percentage: 70 },
    { stars: 4, percentage: 55 },
    { stars: 3, percentage: 42 },
    { stars: 2, percentage: 30 },
    { stars: 1, percentage: 10 },
  ];

  const renderStars = (rating) => {
    const totalStars = 5;
    let stars = [];
    for (let i = 1; i <= totalStars; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'star-filled' : 'star-empty'}>
          ★
        </span>
      );
    }
    return stars;
  };

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

        {/* NEW: Reviews Tab Content */}
        {activeTab === 'Reviews' && (
          <div className="reviews-section">
            <div className="overall-rating-section">
              <div className="overall-rating-summary">
                <p className="overall-rating-number">4.8</p>
                <div className="star-rating-display">
                  {renderStars(4.8)} {/* Assuming 4.8 is the average, pass it here */}
                </div>
              </div>
              <div className="rating-distribution">
                {ratingDistribution.map((dist) => (
                  <div key={dist.stars} className="rating-bar-row">
                    <span className="rating-label">{dist.stars}</span>
                    <div className="rating-bar-bg">
                      <div
                        className="rating-bar-fill"
                        style={{ width: `${dist.percentage}%` }}
                      ></div>
                    </div>
                    <span className="rating-percentage">{dist.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="reviews-header">
              <p className="reviews-count">Reviews ({reviews.length})</p>
              <button className="write-review-button">Write Review</button>
            </div>

            <div className="individual-reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="reviewer-info">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="reviewer-avatar"
                    />
                    <div className="reviewer-details">
                      <p className="reviewer-name">{review.name}</p>
                      <p className="review-time">{review.time}</p>
                    </div>
                    <p className="individual-review-rating">
                      {renderStars(review.rating)} {review.rating}/5
                    </p>
                  </div>
                  <p className="review-text">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer>
        <Footer1 />
      </footer>
    </>
  );
}