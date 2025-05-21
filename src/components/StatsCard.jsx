// src/components/StatsCard.jsx
import React, { useState, useEffect } from 'react';

export default function StatsCard({
  examCount = '1,357',
  bookerCount = '357',
}) {
  // State to hold the current animated values
  const [animatedExamCount, setAnimatedExamCount] = useState('0');
  const [animatedBookerCount, setAnimatedBookerCount] = useState('0');
  
  // Parse the target numbers (removing commas)
  const targetExamCount = parseInt(examCount.replace(/,/g, ''));
  const targetBookerCount = parseInt(bookerCount.replace(/,/g, ''));

  useEffect(() => {
    // Reset animation values when component mounts or props change
    setAnimatedExamCount('0');
    setAnimatedBookerCount('0');
    
    // Animation duration in milliseconds (faster animation)
    const duration = 1500;
    // Number of steps in the animation (fewer steps = bigger jumps)
    const steps = 30;
    // Time between steps
    const stepTime = duration / steps;
    
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      
      if (currentStep <= steps) {
        // Calculate current progress (easeOutQuad for smoother ending)
        const progress = 1 - Math.pow(1 - currentStep / steps, 2);
        
        // Calculate current values
        const currentExamValue = Math.round(targetExamCount * progress);
        const currentBookerValue = Math.round(targetBookerCount * progress);
        
        // Format with commas
        setAnimatedExamCount(currentExamValue.toLocaleString());
        setAnimatedBookerCount(currentBookerValue.toLocaleString());
      } else {
        // Ensure we end with the exact target values
        setAnimatedExamCount(examCount);
        setAnimatedBookerCount(bookerCount);
        clearInterval(timer);
      }
    }, stepTime);
    
    // Cleanup
    return () => clearInterval(timer);
  }, [examCount, bookerCount, targetExamCount, targetBookerCount]);

  return (
    <div
      style={{
        background: '#4e6e4e',
        borderRadius: 12,
        padding: '16px 32px',
        width: '100%',
        maxWidth: 900,
        height: 120,
        marginTop: '24px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '24px auto 0',
      }}
    >
      {/* metric 1 */}
      <div style={{ flex: 1, textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', fontWeight: 500, lineHeight: 1 }}>
          {animatedExamCount}
        </div>
        <div style={{ fontSize: '0.875rem', marginTop: 2 }}>
          Exam Takers
        </div>
      </div>

      {/* divider */}
      <div
        style={{
          width: 1,
          height: '50%',
          background: 'rgba(255,255,255,0.3)',
          margin: '0 24px',
        }}
      />

      {/* metric 2 */}
      <div style={{ flex: 1, textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', fontWeight: 500, lineHeight: 1 }}>
          {animatedBookerCount}
        </div>
        <div style={{ fontSize: '0.875rem', marginTop: 2 }}>
          Bookers
        </div>
      </div>
    </div>
  );
}
