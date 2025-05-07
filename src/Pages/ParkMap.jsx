import React from "react";
import Top from "../components/Top";
import Footer1 from "../components/Footer1";
import Map from "../components/Map";        // ← if you have a Map component
import "../styles.css";

export default function ParkMap() {
  return (
    <>
      <Top />

      <section className="semenggoh-park-map-section">
        <div className="title-container">
          <h1 className="semenggoh-title">Semenggoh Parks Map</h1>
        </div>
        <div className="map-wrapper">
          <Map />
        </div>
      </section>

      <Footer1 />
    </>
  );
}
