import React, { useState } from 'react'
import { FaSearch, FaChevronDown } from 'react-icons/fa'
import '../database.css'

const SECTIONS = [
  'Learner Enrollment & Progress',
  'Course Performance & Feedback',
  'Periodic Assessment Results',
  'Instructor Activity & Engagement',
  'Subscription & Payment History'
]

export default function App() {
  const [selected, setSelected] = useState(SECTIONS[0])
  const [open, setOpen] = useState(false)

  return (
    <div className="container">
      {/* Section Selector */}
      <div
        className="dropdown"
        onClick={() => setOpen(o => !o)}
      >
        <span>{selected}</span>
        <FaChevronDown className={open ? 'rotated' : ''}/>
      </div>
      {open && (
        <ul className="menu">
          {SECTIONS.map(sec => (
            <li key={sec} onClick={() => { setSelected(sec); setOpen(false) }}>
              {sec}
            </li>
          ))}
        </ul>
      )}

      {/* Search & Action Toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <FaSearch className="icon"/>
          <input type="text" placeholder="Search" />
        </div>
        <button className="action-btn">Action</button>
      </div>

      {/* Table Placeholder */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Column A</th>
              <th>Column B</th>
              <th>Column C</th>
            </tr>
          </thead>
          <tbody>
            {/* render as many empty rows as you like */}
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
