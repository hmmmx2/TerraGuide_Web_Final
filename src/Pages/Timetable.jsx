import React from "react";
import Top from "../components/Top";
import Footer1 from "../components/Footer1";
import { useTimetableData } from "../data/timetableData";
import "../styles.css";

export default function Timetable() {
  // Use the timetable data hook
  const { timetables, loading, error } = useTimetableData();
  
  // If loading or error, show appropriate message
  if (loading) {
    return (
      <>
        <Top />
        <div className="timetable-page-container">
          <div className="text-center" style={{padding: "50px 0"}}>
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading timetable data...</p>
          </div>
        </div>
        <Footer1 />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Top />
        <div className="timetable-page-container">
          <div className="alert alert-danger" role="alert">
            Error loading timetable: {error}
          </div>
        </div>
        <Footer1 />
      </>
    );
  }
  
  // Group timetables into rows of 3
  const rows = [];
  for (let i = 0; i < timetables?.length || 0; i += 3) {
    rows.push(timetables.slice(i, i + 3));
  }

  return (
    <>
      <Top />

      <div className="timetable-page-container">
        <h1 className="timetable-page-title">Timetable</h1>

        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="timetable-container"
            style={{ marginTop: rowIndex > 0 ? "40px" : 0, marginBottom: rowIndex === rows.length - 1 ? "60px" : 0 }}
          >
            {row.map((timetable) => (
              <div key={timetable.id} className="timetable-box">
                <div className="time-badge">{timetable.time}</div>
                <h3>{timetable.title}</h3>
                <p>{timetable.description}</p>
              </div>
            ))}
          </div>
        ))}
        
        {/* Show message if no timetable entries */}
        {(!timetables || timetables.length === 0) && (
          <div className="alert alert-info text-center my-5">
            No timetable entries found. Please check back later.
          </div>
        )}
      </div>

      <Footer1 />
    </>
  );
}
