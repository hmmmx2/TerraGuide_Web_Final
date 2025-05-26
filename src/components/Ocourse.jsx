import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import OC1Image from '../assets/onlineC1.png'
import OC2Image from '../assets/onlineC2.png'
import OC3Image from '../assets/onlineC3.png'
import OC4Image from '../assets/onlineC4.png'
import OC5Image from '../assets/MasterParkGuide.png'
import '../cardoc.css'

const COURSE_DATA = [
  {
    id: 1,
    image: OC1Image,
    title: 'Introduction to Park Guide',
    rating: '★ 4.8',
    count: '7,983 Students',
    instructor: 'Jason Lee',
    category: 'Park Guide',
    badge: 'Free',
    link: '/courseabout'
  },
  {
    id: 2,
    image: OC2Image,
    title: 'Nature Guide Fundamentals',
    rating: '★ 4.7',
    count: '7,761 Students',
    instructor: 'Nur Natasha',
    category: 'Park Guide',
    badge: 'Free'
  },
  {
    id: 3,
    image: OC3Image,
    title: 'Eco-Guide Trainig: Field & ...',
    rating: '★ 4.7',
    count: '6,383 Students',
    instructor: 'Jason Lee',
    category: 'Park Guide',
    badge: 'Free'
  },
  {
    id: 4,
    image: OC4Image,
    title: 'Advanced Park Guiding',
    rating: '★ 4.6',
    count: '5,561 Students',
    instructor: 'Melvin Wong',
    category: 'Park Guide',
    badge: 'Free'
  },
  {
    id: 5,
    image: OC5Image,
    title: 'Master Park Guide Certification',
    rating: '★ 4.6',
    count: '4,683 Students',
    instructor: 'William Eng',
    category: 'Park Guide',
    badge: 'Free'
  },
  
]

export default function Ocourse() {
  const [showAll, setShowAll] = useState(false)

  return (
    <div className="b-containerCM">
      <div className="b-headerCM">
        <h3>Online Course</h3>
        <a
          className="see-all-link"
          onClick={() => setShowAll(x => !x)}
        >
          {showAll ? 'See less' : 'See all'}
        </a>
      </div>

      <div className={`blog-gridCM ${showAll ? '' : 'one-row'}`}>
        {/* real courses */}
        {COURSE_DATA.map(course => (
          <div key={course.id} className="b-cardCM">
            <div className="b-image-containerCM">
              <img
                className="b-card-imageCM"
                src={course.image}
                alt={course.title}
              />
              <span className="b-badgeCM">{course.badge}</span>
            </div>
            <div className="b-contentCM">
              <h4 className="b-card-titleCM">{course.title}</h4>
              <div className="b-card-ratingCM">
                <span className="b-rating-starCM">{course.rating}</span>
                <span className="b-rating-separatorCM">|</span>
                <span className="b-rating-countCM">{course.count}</span>
              </div>
              <div className="b-card-footerCM">
                {course.instructor}
                <span className="b-footer-separatorCM">|</span>
                {course.category}
              </div>
            </div>
          </div>
        ))}

        {/* Coming Soon placeholder — only when expanded */}
        {showAll && (
          <div className="b-cardCM coming-soon-card">
            <div className="b-image-containerCM">
              <span className="coming-text">Coming Soon</span>
            </div>
            <div className="b-contentCM">
              <h4 className="b-card-titleCM">Coming Soon</h4>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
