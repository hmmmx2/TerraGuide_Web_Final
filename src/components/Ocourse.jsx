import React, { useState } from 'react'
import Blogs1Image from '../assets/MasterParkGuide.png'
import '../cardoc.css'

const COURSE_DATA = [
  {
    id: 1,
    image: Blogs1Image,
    title: 'Introduction to Park Guide',
    rating: '★ 4.8',
    count: '7,983 Students',
    instructor: 'Jason Lee',
    category: 'Park Guide',
    badge: 'Free'
  },
  {
    id: 2,
    image: Blogs1Image,
    title: 'Introduction to Park Guide',
    rating: '★ 4.8',
    count: '7,983 Students',
    instructor: 'Jason Lee',
    category: 'Park Guide',
    badge: 'Free'
  },
  {
    id: 3,
    image: Blogs1Image,
    title: 'Introduction to Park Guide',
    rating: '★ 4.8',
    count: '7,983 Students',
    instructor: 'Jason Lee',
    category: 'Park Guide',
    badge: 'Free'
  },
  {
    id: 4,
    image: Blogs1Image,
    title: 'Introduction to Park Guide',
    rating: '★ 4.8',
    count: '7,983 Students',
    instructor: 'Jason Lee',
    category: 'Park Guide',
    badge: 'Free'
  },
  {
    id: 5,
    image: Blogs1Image,
    title: 'Introduction to Park Guide',
    rating: '★ 4.8',
    count: '7,983 Students',
    instructor: 'Jason Lee',
    category: 'Park Guide',
    badge: 'Free'
  },
  {
    id: 6,
    image: Blogs1Image,
    title: 'Introduction to Park Guide',
    rating: '★ 4.8',
    count: '7,983 Students',
    instructor: 'Jason Lee',
    category: 'Park Guide',
    badge: 'Free'
  }
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
