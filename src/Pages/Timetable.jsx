import Top from '../components/Top';
import Footer1 from '../components/Footer1';
import "../styles.css";

export default function Index() {
  return (
    <>
      <Top />
      
      <div className="timetable-page-container">
        <h1 className="timetable-page-title">Timetable</h1>
        
        <div className="timetable-container">
          <div className="timetable-box">
            <div className="time-badge">9:00am</div>
            <h3>Morning Briefing & Preparation</h3>
            <p>Start your day with a comprehensive briefing about the park, safety guidelines, and what to expect during your visit.</p>
          </div>
          
          <div className="timetable-box">
            <div className="time-badge">10:30am</div>
            <h3>Morning Guided Nature Walk</h3>
            <p>Explore the lush rainforest with our experienced guides who will point out interesting flora and fauna along the way.</p>
          </div>
          
          <div className="timetable-box">
            <div className="time-badge">12:00pm</div>
            <h3>Break & Rest</h3>
            <p>Take some time to relax, have lunch, and recharge for the afternoon activities. Enjoy the peaceful surroundings of the park.</p>
          </div>
        </div>
        
        <div className="timetable-container" style={{ marginTop: '40px' }}>
          <div className="timetable-box">
            <div className="time-badge">2:00pm</div>
            <h3>Orangutan Feeding Session</h3>
            <p>Witness the orangutans during their feeding time. Learn about their diet, behavior, and conservation efforts to protect these amazing primates.</p>
          </div>
          
          <div className="timetable-box">
            <div className="time-badge">3:30pm</div>
            <h3>Conservation Talk</h3>
            <p>Join our conservation experts for an informative session about the challenges facing Borneo's wildlife and how we can help protect them.</p>
          </div>
          
          <div className="timetable-box">
            <div className="time-badge">4:30pm</div>
            <h3>Afternoon Nature Walk</h3>
            <p>Experience the rainforest as it transitions into evening. Different wildlife becomes active during this time, offering new sightings.</p>
          </div>
        </div>
        
        <div className="timetable-container" style={{ marginTop: '40px', marginBottom: '60px' }}>
          <div className="timetable-box">
            <div className="time-badge">6:00pm</div>
            <h3>Evening Briefing</h3>
            <p>Gather for a summary of the day's activities and prepare for any evening programs if you're staying overnight at the park.</p>
          </div>
          
          <div className="timetable-box">
            <div className="time-badge">7:30pm</div>
            <h3>Night Safari (Optional)</h3>
            <p>For overnight guests, join our guided night safari to spot nocturnal creatures and experience the rainforest after dark.</p>
          </div>
          
          <div className="timetable-box">
            <div className="time-badge">9:00pm</div>
            <h3>Stargazing Session</h3>
            <p>End your day by observing the stars from our viewing platform. Learn about constellations and enjoy the peaceful night atmosphere.</p>
          </div>
        </div>
      </div>
      
      <Footer1 />
    </>
  );
}