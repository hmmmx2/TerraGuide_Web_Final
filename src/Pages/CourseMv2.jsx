import React from "react";
import { Link } from "react-router-dom";
import Top from "../components/Top";
import Footer1 from "../components/Footer1";
import ProgressSummary from "../components/ProgressSummary";
import Ocourse from "../components/Ocourse";
import "../coursem.css";
import LicenseC from "../components/LicenseC";
import MentorP from "../components/MentorP";

export default function CourseMv2() {
  const handleContinue = () => {
    console.log("continue clicked");
    // e.g. navigate("/next-lesson");
  };

  return (
    <>
      <Top />
      <div className="mt-3 mb-3 p-4">
      
        {/* Progress card */}
          <ProgressSummary
            percentage={80}
            course="Introduction to Park Guide"
            message="Hurry up! Keep making progress."
            onContinue={handleContinue}
          />
        
        <Ocourse/>

        <LicenseC/>
        
        <MentorP/>

      </div>
      <Footer1/>

    </>
  );
}
