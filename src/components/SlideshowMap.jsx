import React from 'react';
import { Link } from 'react-router-dom';
import Slideshow from './Slideshow';
import Map from './Map';
import '../SlideshowMap.css';  // keep whatever path is correct

export default function SlideshowMap() {
  return (
    <section className="hero-section">
      {/* Slide card */}
      <div className="hero-card slideshow-card">
        <Slideshow />
      </div>

      {/* Map card */}
      <div className="hero-card map-card">
        <h3 className="map-title">
          <Link to="/parkmap" className="map-link">
            The Parks Map
          </Link>
        </h3>
        <div className="map-wrapper">
          <Map />
        </div>
      </div>
    </section>
  );
}
