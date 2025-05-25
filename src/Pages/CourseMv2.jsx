import React from "react";
import { Link } from "react-router-dom";
import AdminTop from "../components/AdminTop";
import Footer1 from "../components/Footer1";
import ProgressSummary from "../components/ProgressSummary";
import Blogs1Image from "../assets/MasterParkGuide.png";
import Blogs2Image from "../assets/Nature_Guide.png";
import "../coursem.css";

export default function CourseMv2() {
  const handleContinue = () => {
    console.log("continue clicked");
    // e.g. navigate("/next-lesson");
  };

  return (
    <>
      <AdminTop />

      <main className="course-page">
        {/* Progress card */}
        <section className="progress-wrapper">
          <ProgressSummary
            percentage={80}
            course="Introduction to Park Guide"
            message="Hurry up! Keep making progress."
            onContinue={handleContinue}
          />
        </section>

        {/* My Courses grid */}
        <section className="c-container">
          <h3>My Courses</h3>
          <div className="course-grid">
            {/* Course 1 */}
            <Link to="/Course1" className="course-card-link">
              <article className="course-card">
                <div className="course-image-container">
                  <img
                    className="course-card-image"
                    src={Blogs1Image}
                    alt="Semenggoh Wildlife Centre Team"
                  />
                </div>
                <div className="course-content">
                  <h4 className="course-card-title">Course 1</h4>
                  <p className="course-card-description">
                    This course will test your various knowledge as a Park Guide for
                    Semengguh Wildlife Centre
                  </p>
                </div>
              </article>
            </Link>

            {/* Course 2 */}
            <Link to="/Course2" className="course-card-link">
              <article className="course-card">
                <div className="course-image-container">
                  <img
                    className="course-card-image"
                    src={Blogs2Image}
                    alt="Orangutan Behavior"
                  />
                </div>
                <div className="course-content">
                  <h4 className="course-card-title">Course 2</h4>
                  <p className="course-card-description">
                    This course will test your various knowledge on orangutan and other
                    animal's behavior in Semengguh Wildlife Centre
                  </p>
                </div>
              </article>
            </Link>

            {/* Coming Soon */}
            <div className="coming-soon-card">
              <div className="coming-soon-box">Coming Soon</div>
              <h4 className="coming-soon-title">Coming Soon</h4>
              <p className="coming-soon-text">Coming Soon</p>
            </div>
          </div>
        </section>
      </main>

      <Footer1 />
    </>
  );
}
