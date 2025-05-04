import React from 'react'
import Slideshow from './Slideshow'
import Map from './Map'
import '../SlideshowMap.css'

export default function SlideshowMap() {
  return (
    <section className="hero-section">
      {/* Slide card */}
      <div className="hero-card slideshow-card">
        <Slideshow />
      </div>

      {/* Map card */}
      <div className="hero-card map-card">
        <h3 className="map-title">The Parks Map</h3>
        <div className="map-wrapper">
          <Map />
        </div>
      </div>
    </section>
  )
}
