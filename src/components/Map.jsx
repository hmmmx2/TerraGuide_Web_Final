import React, { useRef, useEffect } from 'react'
import '../map.css'

export default function Map() {
  const mapRef = useRef(null)

  useEffect(() => {
    if (!window.google?.maps) {
      console.error('Google Maps API not found')
      return
    }
    const center = { lat: 1.4017, lng: 110.3145 }
    const map = new window.google.maps.Map(mapRef.current, {
      center, zoom: 15, mapTypeId: 'satellite', fullscreenControl: true,
    })
    new window.google.maps.Marker({ position: center, map })
  }, [])

  return <div className="map-container" ref={mapRef} />
}
