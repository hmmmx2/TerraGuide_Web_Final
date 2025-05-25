import React from 'react'
import mp1 from '../assets/MP1.png'
import mp2 from '../assets/MP2.png'
import '../cardoc.css'

const MENTOR_DATA = [
  {
    id: 1,
    image: mp1,
    title: 'Park Guide in Training',
    rating: '★ 4.8',
    count: '7,983 Students',
    instructor: 'Melvin Wang',
    category: 'Park Guide',
    badge: 'Free'
  },
  {
    id: 2,
    image: mp2,
    title: 'Explore & Lead: Park Guide..',
    rating: '★ 4.6',
    count: '5,561 Students',
    instructor: 'Caleb Eng',
    category: 'Park Guide',
    badge: 'Free'
  }
]

export default function MentorP() {
  return (
    <div className="b-containerCM">
      <div className="b-headerCM">
        <h3>Mentor Programme</h3>
      </div>

      <div className="blog-gridCM">
        {MENTOR_DATA.map(item => (
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

              <div className="b-card-ratingCM">
                <span className="b-rating-starCM">{item.rating}</span>
                <span className="b-rating-separatorCM">|</span>
                <span className="b-rating-countCM">{item.count}</span>
              </div>

              <div className="b-card-footerCM">
                {item.instructor}
                <span className="b-footer-separatorCM">|</span>
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
