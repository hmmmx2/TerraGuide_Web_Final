import React from 'react'
import License from '../assets/License.png'  // ← swap in your real logo file
import '../cardoc.css'

const LICENSE_DATA = [
  {
    id: 1,
    image: License,
    title: 'License Park Guides',
    instructor: 'Organized by Sarawak Forestry',
    category: 'Exam Based',
    badge: 'Free'
  }
]

export default function LicenseC() {
  return (
    <div className="b-containerCM">
      <div className="b-headerCM">
        <h3>License</h3>
      </div>

      <div className="blog-gridCM">
        {/* real license card */}
        {LICENSE_DATA.map(item => (
          <div key={item.id} className="b-cardCM">
            <div className="b-image-containerCM">
              <img
                className="b-card-imageCM"
                src={item.image}
                alt={item.title}
              />
              <span className="b-badgeCM">{item.badge}</span>
            </div>
            <div className="b-contentCM">
              <h4 className="b-card-titleCM">{item.title}</h4>
              <p className="b-card-instructorCM">{item.instructor}</p>
              <div className="b-card-footerCM">
                {item.category}
              </div>
            </div>
          </div>
        ))}

        {/* Coming Soon placeholder */}
        <div className="b-cardCM coming-soon-card">
          <div className="b-image-containerCM">
            <span className="coming-text">Coming Soon</span>
          </div>
          <div className="b-contentCM">
            <h4 className="b-card-titleCM">Coming Soon</h4>
          </div>
        </div>
      </div>
    </div>
  )
}
