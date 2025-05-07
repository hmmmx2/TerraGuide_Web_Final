import React, { useEffect, useRef, useState } from "react";
import Top from "../components/Top";
import Footer1 from "../components/Footer1";
import "../parkmap.css";

export default function ParkMap() {
  const mapRef = useRef(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (!window.google?.maps?.places) {
      console.error("Google Maps Places library not found");
      return;
    }

    // 1️⃣ Initialize map centered on Semenggoh
    const center = { lat: 1.4017, lng: 110.3145 };
    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 15,
      mapTypeId: window.google.maps.MapTypeId.HYBRID,
      fullscreenControl: true,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: window.google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        mapTypeIds: [
          window.google.maps.MapTypeId.ROADMAP,
          window.google.maps.MapTypeId.SATELLITE,
          window.google.maps.MapTypeId.HYBRID,
        ],
      },
    });

    // 2️⃣ Place marker at center
    new window.google.maps.Marker({
      position: center,
      map,
      title: "Semenggoh Nature Reserve",
    });

    // 3️⃣ Wire up the search box
    const input = document.getElementById("pac-input");
    const searchBox = new window.google.maps.places.SearchBox(input);

    // bias results to map viewport
    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds());
    });

    // on place selection, clear old markers and add new ones
    const markers = [];
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (!places || places.length === 0) return;
      markers.forEach(m => m.setMap(null));
      markers.length = 0;

      const bounds = new window.google.maps.LatLngBounds();
      places.forEach(place => {
        if (!place.geometry?.location) return;
        markers.push(
          new window.google.maps.Marker({
            map,
            title: place.name,
            position: place.geometry.location,
          })
        );
        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
  }, []);

  const clearSearch = () => {
    setSearchText("");
    const input = document.getElementById("pac-input");
    if (input) input.value = "";
    // optionally clear map markers here
  };

  return (
    <>
      <Top />

      <section className="semenggoh-park-map-section">
        {/* Title + underline bar */}
        <div className="title-container">
          <h1 className="semenggoh-title">Semenggoh Parks Map</h1>
        </div>

        {/* Search box (outside map) */}
        <div className="search-container">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              id="pac-input"
              className="map-search-box"
              type="text"
              placeholder="Search"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
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
      </section>

      <Footer1 />
    </>
  );
}
