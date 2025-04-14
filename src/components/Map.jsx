import { useEffect, useRef } from 'react';
import '../map.css';

export default function Map() {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.google && mapRef.current) {
        clearInterval(interval);

        const defaultLocation = { lat: 1.4017, lng: 110.3145 };
        const map = new google.maps.Map(mapRef.current, {
          center: defaultLocation,
          zoom: 15,
          mapTypeId: "hybrid" 
        });

        const marker = new google.maps.Marker({
          position: defaultLocation,
          map: map,
          title: "Semenggoh Nature Reserve"
        });

        markerRef.current = marker;
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="index-map-box">
      <p>The Parks Map</p>
      <div id="map" ref={mapRef}></div>
    </div>
  );
}
