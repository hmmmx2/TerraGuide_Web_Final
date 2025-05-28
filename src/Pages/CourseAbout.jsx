import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Top from '../components/Top';
import Footer1 from '../components/Footer1';
import "../courseabout.css"; // Ensure this path is correct

import courseBanner from "../assets/onlineC1.png";
import instructorAvatar from "../assets/ang.jpg";
import videoThumbnail1 from "../assets/onlineC2.png";
import videoThumbnail2 from "../assets/onlineC3.png";

// Replace these with the actual paths to your video files
import basicsVideo from "../assets/basicsOfParkGuiding.mp4";
import environmentVideo from "../assets/understandingEnvironment.mp4";

export default function CourseAbout() {
  const [activeTab, setActiveTab] = useState('About');

  // Lessons data with videoSrc for actual video lessons
  const lessons = [
    {
      id: 1,
      type: 'video',
      title: 'Basics of Park Guiding',
      duration: '45 mins',
      thumbnail: videoThumbnail1,
      videoSrc: basicsVideo,
      completed: true
    },
    {
      id: 2,
      type: 'video',
      title: 'Understanding the Environment',
      duration: '45 mins',
      thumbnail: videoThumbnail2,
      videoSrc: environmentVideo,
      completed: true
    },
    { id: 3, type: 'exercise', title: 'Exercise', duration: '15 mins', completed: true },
    { id: 4, type: 'quiz',     title: 'Quiz',     duration: '45 mins', completed: true },
    { id: 5, type: 'survey',   title: 'Survey',   duration: '45 mins', completed: false },
  ];

  // Reviews data
  const reviews = [
    {
      id: 1,
      name: 'Jimmy He',
      time: '1 hour ago',
      rating: 4,
      avatar: instructorAvatar,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam...',
    },
    {
      id: 2,
      name: 'Timmy He',
      time: '1 hour ago',
      rating: 4,
      avatar: instructorAvatar,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam...',
    },
  ];

  // Rating distribution data
  const ratingDistribution = [
    { stars: 5, percentage: 70 },
    { stars: 4, percentage: 55 },
    { stars: 3, percentage: 42 },
    { stars: 2, percentage: 30 },
    { stars: 1, percentage: 10 },
  ];

  // Render star icons
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

  // Map lesson type to route
  const getLessonLink = (lesson) => {
    switch (lesson.type) {
      case 'exercise': return '/course1';
      case 'quiz':     return '/course2';
      default:         return '#';
    }
  };

  return (
    <>
      <Top />

      <div className="course-about-page-container">
        {/* Banner */}
        <div className="course-banner-container">
          <img
            src={courseBanner}
            alt="Park Ranger Course Banner"
            className="course-banner-image"
          />
          <span className="course-free-tag">Free</span>
        </div>

        {/* Main info */}
        <div className="course-main-info">
          <h1 className="course-title">Introduction to Park Guide</h1>
          <p className="course-rating">
            <span className="star-icon">★</span> 4.8 (2,678 reviews) | Park Guide
          </p>
          <div className="info-cards-container">
            <div className="info-card">
              <div className="info-icon">👥</div>
              <p className="info-text">7,983 students</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🕒</div>
              <p className="info-text">3.5 hours</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🏆</div>
              <p className="info-text">Sponsored</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="course-tabs-container">
          {['About','Lessons','Reviews'].map(tab => (
            <div
              key={tab}
              className={`course-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* About Tab */}
        {activeTab === 'About' && (
          <>
            <div className="instructor-section">
              <img
                src={instructorAvatar}
                alt="Steven He"
                className="instructor-avatar"
              />
              <div className="instructor-details">
                <p className="instructor-name">Steven He</p>
                <p className="instructor-role">Park Ranger</p>
              </div>
            </div>
            <div className="about-course-content">
              <h2 className="section-title">About Course</h2>
              <p className="course-description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam...
              </p>
              <button className="enroll-button">Enroll For Free</button>
            </div>
          </>
        )}

        {/* Lessons Tab */}
        {activeTab === 'Lessons' && (
          <div className="lessons-list-container">
            {lessons.map(lesson => (
              <div key={lesson.id} className="lesson-item">
                <div className="lesson-icon-container">
                  {lesson.type === 'video' ? (
                    // Embedded video player instead of thumbnail
                    <video
                      src={lesson.videoSrc}
                      controls
                      className="lesson-video-player"
                    />
                  ) : (
                    <Link to={getLessonLink(lesson)} className="generic-lesson-icon-link">
                      <div className={`generic-lesson-icon ${lesson.type}-icon`}>
                        {lesson.type === 'exercise' && '📄'}
                        {lesson.type === 'quiz'     && '📝'}
                        {lesson.type === 'survey'   && '📋'}
                      </div>
                    </Link>
                  )}
                </div>

                <div className="lesson-details">
                  <p className="lesson-title">{lesson.title}</p>
                  <p className="lesson-duration">{lesson.duration}</p>
                </div>

                {lesson.completed && (
                  <div className="lesson-checkbox completed">✔</div>
                )}
              </div>
            ))}
            <button className="enroll-button">Enroll For Free</button>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'Reviews' && (
          <div className="reviews-section">
            <div className="overall-rating-section">
              <div className="overall-rating-summary">
                <p className="overall-rating-number">4.8</p>
                <div className="star-rating-display">
                  {renderStars(5)}
                </div>
              </div>
              <div className="rating-distribution">
                {ratingDistribution.map(dist => (
                  <div key={dist.stars} className="rating-bar-row">
                    <span className="rating-label">{dist.stars}★</span>
                    <div className="rating-bar-bg">
                      <div
                        className="rating-bar-fill"
                        style={{ width: `${dist.percentage}%` }}
                      />
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
              {reviews.map(review => (
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

      <Footer1 />
    </>
  );
}
