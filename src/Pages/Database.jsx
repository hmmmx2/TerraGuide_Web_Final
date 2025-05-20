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

export default function App() {
  const [selected, setSelected] = useState(SECTIONS[0])
  const [open, setOpen]       = useState(false)
  const [enlarged, setEnl]    = useState(false)

  return (
    <>
    <AdminTop/>
    <div className="container">
      {/* ==== Top Search ==== */}
      <div className="header">
        <div className="search-box">
          <FaSearch className="icon" />
          <input type="text" placeholder="Search" />
        </div>
      </div>

      {/* ==== Table Wrapper ==== */}
      <div className={`table-wrapper ${enlarged ? 'enlarged' : ''}`}>
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
                <button
                  className="action-btn"
                  onClick={() => alert('Action clicked')}
                >
                  Action
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                <td className="data-cell">&nbsp;</td>
                <td className="data-cell">&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          className="enlarge-btn"
          onClick={() => setEnl(e => !e)}
        >
          {enlarged ? 'Shrink' : 'Enlarge'}
        </button>
      </div>

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
