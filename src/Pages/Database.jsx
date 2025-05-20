import React, { useState } from 'react'
import { FaSearch, FaChevronDown } from 'react-icons/fa'
import '../database.css'
import AdminTop from '../components/AdminTop'
import Footer1 from '../components/Footer1'

const SECTIONS = [
  'Learner Enrollment & Progress',
  'Course Performance & Feedback',
  'Periodic Assessment Results',
  'Instructor Activity & Engagement',
  'Subscription & Payment History'
]

// Sample data — replace with your real data!
const SAMPLE_DATA = Array.from({ length: 20 }, (_, i) => ({
  col1: `Item ${i + 1} A`,
  col2: `Item ${i + 1} B`
}))

export default function Database() {
  const [selected, setSelected] = useState(SECTIONS[0])
  const [open, setOpen]         = useState(false)
  const [expanded, setExpanded] = useState(false)

  const visibleData = expanded
    ? SAMPLE_DATA
    : SAMPLE_DATA.slice(0, 5)

  return (
    <>
      <AdminTop />

      <div className="container">
        {/* ==== Top Search ==== */}
        <div className="header">
          <div className="search-box">
            <FaSearch className="icon" />
            <input type="text" placeholder="Search" />
          </div>
        </div>

        {/* ==== Table ==== */}
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th className="dropdown-cell">
                  <div
                    className="dropdown"
                    onClick={() => setOpen(o => !o)}
                  >
                    <span>{selected}</span>
                    <FaChevronDown className={open ? 'rotated' : ''} />
                  </div>
                </th>
                <th className="action-cell">
                  {/* No onClick here */}
                  <button
                    type="button"
                    className="action-btn"
                  >
                    Action
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleData.map((row, idx) => (
                <tr key={idx}>
                  <td className="data-cell">{row.col1}</td>
                  <td className="data-cell">{row.col2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ==== See More / See Less ==== */}
        <button
          className="see-more-btn"
          onClick={() => setExpanded(e => !e)}
        >
          {expanded ? 'See Less' : 'See More'}
        </button>

        {/* ==== Dropdown Menu ==== */}
        {open && (
          <ul className="menu">
            {SECTIONS.map(sec => (
              <li
                key={sec}
                onClick={() => {
                  setSelected(sec)
                  setOpen(false)
                }}
              >
                {sec}
              </li>
            ))}
          </ul>
        )}
      </div>

      <Footer1 />
    </>
  )
}
