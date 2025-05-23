// src/pages/ParkMap.jsx
import React, { useEffect, useRef, useState } from "react";
import Top from "../components/Top";
import Footer1 from "../components/Footer1";
import "../parkmap.css";
import { Link } from 'react-router-dom';
// ← make sure these paths & extensions match your files!
import Blogs2Image from "../assets/smg2.png"
import OrchidImg from "../assets/Orchid.jpg";
import DurianImg   from "../assets/Durian.jpeg";
// PDF map and cover image
import pdfMap   from "../assets/semenggoh-map.pdf";
import mapCover from "../assets/semenggoh-map.jpg";
export default function ParkMap() {
  const mapRef = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [showAll, setShowAll] = useState(false);

  // Toggle handler for spots
  const toggleSpots = () => setShowAll((prev) => !prev);

  useEffect(() => {
    if (!window.google?.maps?.places) {
      console.error("Google Maps Places library not found");
      return;
    }

    const center = { lat: 1.4017, lng: 110.3145 };
    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 15,
      mapTypeId: window.google.maps.MapTypeId.HYBRID,
      fullscreenControl: true,
      mapTypeControl: true,
    });
    new window.google.maps.Marker({ position: center, map });

    const input = document.getElementById("pac-input");
    const searchBox = new window.google.maps.places.SearchBox(input);

    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds());
    });

    const markers = [];
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces() || [];
      markers.forEach((m) => m.setMap(null));
      markers.length = 0;

      const bounds = new window.google.maps.LatLngBounds();
      places.forEach((place) => {
        if (!place.geometry?.location) return;
        markers.push(
          new window.google.maps.Marker({
            map,
            position: place.geometry.location,
            title: place.name,
          })
        );
        place.geometry.viewport
          ? bounds.union(place.geometry.viewport)
          : bounds.extend(place.geometry.location);
      });
      map.fitBounds(bounds);
    });
  }, []);

  const clearSearch = () => {
    setSearchText("");
    const input = document.getElementById("pac-input");
    if (input) input.value = "";
  };

  // 👇 Define your spots array explicitly:
  const spots = [
    {
      title: "Orang Utan Feeding Platform",
      description: "Come witness rescued orangutans up close in their natural habitat. ",
      img: Blogs2Image,
    },
    {
      title: "Wild Orchids Garden",
      description: "Stroll through a vibrant display of native orchids, featuring delicate blooms in every shade. .",
      img: OrchidImg,
    },
    {
      title: "Wild Fruits Garden",
      description: "Wander among tropical fruit trees bearing durian, rambutan, and langsat.",
      img: DurianImg ,
    },
   
    // add more spot objects here as needed
  ];

  return (
    <>
      <Top />

      <section className="semenggoh-park-map-section">
        {/* Title */}
        <div className="title-container">
          <h1 className="semenggoh-title">Semenggoh Parks Map</h1>
        </div>

        {/* Search box */}
        <div className="search-container">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              id="pac-input"
              className="map-search-box"
              type="text"
              placeholder="Semenggoh"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            {searchText && (
              <button className="clear-btn" onClick={clearSearch}>
                ×
              </button>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="map-wrapper">
          <div ref={mapRef} className="map-element" />
        </div>

        {/* Popular Tourist Spot */}
        <div className="P-container">
          <h3>
            Popular Tourist Spot{" "}
            <span className="tgl-btn" onClick={toggleSpots}>
              {showAll ? "See Less" : "See All"}
            </span>
          </h3>
          <div className="pm-grid" id="pm-spots">
            {spots.map((spot, idx) => (
              <div
                key={idx}
                className={`card ${idx >= 3 && !showAll ? "hidden" : ""}`}
              >
                <div className="top-text">Top {idx + 1}</div>
                <div className="image-container">
                  <img
                    src={spot.img}
                    alt={spot.title}
                    className="card-image"
                  />
                </div>
                <div className="card-title">{spot.title}</div>
                <div className="card-description">{spot.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ← New PDF Map section */}
        <div className="pdf-map-container">
          <div className="map-header">
            <h3 className="pdf-map-title">View Tourist Map</h3>
            <a
              href={pdfMap}                   
              target="_blank"
              rel="noopener noreferrer"
              className="view-pdf"
            >
              View in PDF
            </a>
          </div>
          <div className="map-box">
            <img
               src={mapCover}                
                alt="Tourist Map Cover"
                className="map-image"
            />
          </div>
        </div>

        {/* Back button */}
          <div className="back-button-container">
            <Link to="/index" className="back-button">
              Back
            </Link>
          </div>
      </section>

      <Footer1 />
    </>
  );
}
