import React, { useRef, useEffect } from 'react'
import '../map.css'

export default function Map() {
  const mapRef = useRef(null)

  useEffect(() => {
    if (!window.google?.maps) {
      console.error("Google Maps API not found");
      return;
    }
  
    const center = { lat: 1.4017, lng: 110.3145 };
    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 15,
      mapTypeId: window.google.maps.MapTypeId.HYBRID,  // satellite + labels
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
  
    new window.google.maps.Marker({
      position: center,
      map,
      title: "Semenggoh Nature Reserve",
    });
  }, []);
  

  return <div className="map-container" ref={mapRef} />
}
