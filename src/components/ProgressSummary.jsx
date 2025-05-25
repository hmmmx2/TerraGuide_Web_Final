import React from 'react';
import '../progress.css';

export default function ProgressSummary({
  percentage = 80,
  course = 'Introduction to Park Guide',
  message = 'Hurry up! Keep making progress.',
  onContinue = () => {}
}) {
  return (
    <div className="progress-summary">
      <div className="ps-header">
        <span className="ps-title">PROGRESS SUMMARY</span>
        <span className="ps-perc">{percentage}%</span>
      </div>
      <div className="ps-body">
        <span className="ps-course">
          Current Course:&nbsp;
          <a href="#" className="ps-course-link">
            {course}…
          </a>
        </span>
        <span className="ps-msg">{message}</span>
      </div>
      <button className="ps-btn" onClick={onContinue}>
        CONTINUE
      </button>
    </div>
  );
}
