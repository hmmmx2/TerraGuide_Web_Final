import React from "react";
import { Link } from "react-router-dom";
import AdminTop from "../components/AdminTop";
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
      <AdminTop />

      
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
      <Footer1/>

    </>
  );
}
