// src/components/LicenseManagement.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import "../license.css";
import AdminTop from "../components/AdminTop";
import Footer1 from "../components/Footer1";

// ── Data sets ────────────────────────────────────────────────────────
const approvalData = [
  { name: 'Timmy He',   course: 'Completed',    program: 'Completed',    exam: 'Pass',       status: 'approve' },
  { name: 'Jimmy He',   course: 'Completed',    program: 'Completed',    exam: 'Pass',       status: 'approve' },
  { name: 'Gimmy He',   course: 'Completed',    program: 'Completed',    exam: 'Pass',       status: 'approve' },
  { name: 'Alvin He',   course: 'Completed',    program: 'Completed',    exam: 'Pass',       status: 'approve' },
  { name: 'Aaron He',   course: 'Completed',    program: 'Completed',    exam: 'Pass',       status: 'approve' },
  { name: 'Timmy He',   course: 'Completed',    program: 'Completed',    exam: 'Failed',     status: 'reject'  },
  { name: 'Timmy He',   course: 'Completed',    program: 'Completed',    exam: 'Failed',     status: 'reject'  },
  { name: 'Timmy He',   course: 'Completed',    program: 'In Progress',  exam: 'Not Started',status: 'pending' },
  { name: 'Timmy He',   course: 'Completed',    program: 'Incomplete',   exam: 'Not Started',status: 'pending' },
  { name: 'Timmy He',   course: 'In Progress',  program: 'Not Started',  exam: 'Not Started',status: 'pending' },
];

const renewalData = [
  {
    name: 'Timmy He',
    startDate: '14/8/2023',
    expiredDate: '14/8/2026',
    payment: 'None',
    status: 'Expired',
    checked: true,
  },
  {
    name: 'Jimmy He',
    startDate: '19/6/2025',
    expiredDate: '19/6/2028',
    payment: 'Done',
    status: 'Renew Required',
    checked: false,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────
const getInitials = fullName =>
  fullName
    .split(" ")
    .map(p => p[0])
    .join("")
    .toUpperCase();

// ── Component ────────────────────────────────────────────────────────
export default function LicenseManagement() {
  const [view, setView]                 = useState("approval");
  const [rows, setRows]                 = useState(approvalData);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm]     = useState("");
  const [editing, setEditing]           = useState(false);

  const switchView = newView => {
    setView(newView);
    setRows(newView === "approval" ? approvalData : renewalData);
    setDropdownOpen(false);
    setSearchTerm("");
    setEditing(false);
  };

  const handleStatusChange = (i, val) => {
    const updated = [...rows];
    updated[i].status = val;
    setRows(updated);
  };
  const handleCheckChange = (i, checked) => {
    const updated = [...rows];
    updated[i].checked = checked;
    setRows(updated);
  };

  const displayedRows = rows.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const title = view === "approval"
    ? "License Approval Management"
    : "License Renewal Management";

  return (
    <>
      <AdminTop/>
      <div className="license-wrapper">
        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="header-container">
          <div className="controls-left">
            <div className="dropdown me-3">
              <button
                className="mode-dropdown"
                onClick={() => setDropdownOpen(o => !o)}
                type="button"
              >
                {title}
                <span className="dropdown-arrow" />
              </button>
              <ul className={`dropdown-menu${dropdownOpen ? " show" : ""}`}>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => switchView("approval")}
                  >
                    License Approval Management
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => switchView("renewal")}
                  >
                    License Renewal Management
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="search-wrapper">
            <input
              type="text"
              className="table-search"
              placeholder="Search by user name…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="action-buttons">
            <button
              className="action-button"
              onClick={() => setEditing(e => !e)}
            >
              {editing ? "Unedited" : "Edit"}
            </button>
            <button className="action-button">Send</button>
          </div>
        </div>

        {/* ── Table ─────────────────────────────────────────────────────── */}
        <div className="table-responsive shadow-sm rounded-3 border">
          <table className="table">
            <thead>
              <tr>
                <th>User Name</th>
                {view === "approval" ? (
                  <>
                    <th className="text-center">Course</th>
                    <th className="text-center">Mentor Programme</th>
                    <th className="text-center">Exam</th>
                    <th className="text-center">Status</th>
                  </>
                ) : (
                  <>
                    <th className="text-center">Start Date</th>
                    <th className="text-center">Expired Date</th>
                    <th className="text-center">Payment</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Check</th>
                  </>
                )}
                {editing && <th className="text-center"></th>}
              </tr>
            </thead>
            <tbody>
              {displayedRows.map((row, i) => (
                <tr key={i}>
                  <td>
                    <div className="d-inline-flex align-items-center">
                      <span
                        className="rounded-circle bg-light text-primary d-inline-flex align-items-center justify-content-center fw-bold me-3"
                        style={{ width: "3rem", height: "3rem", fontSize: "1rem" }}
                      >
                        {getInitials(row.name)}
                      </span>
                      <Link to="#" className="fw-bold text-reset">
                        {row.name}
                      </Link>
                    </div>
                  </td>

                  {view === "approval" ? (
                    <>
                      <td className="text-center">{row.course}</td>
                      <td className="text-center">{row.program}</td>
                      <td className="text-center">{row.exam}</td>
                      <td className="text-center">
                        <select
                          className={`status-dropdown ${row.status}`}
                          value={row.status}
                          onChange={e => handleStatusChange(i, e.target.value)}
                        >
                          <option value="approve">Approved</option>
                          <option value="reject">Rejected</option>
                          <option value="pending">Pending</option>
                        </select>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="text-center">{row.startDate}</td>
                      <td className="text-center">{row.expiredDate}</td>
                      <td className="text-center">{row.payment}</td>
                      <td className="text-center">{row.status}</td>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          checked={row.checked}
                          onChange={e => handleCheckChange(i, e.target.checked)}
                        />
                      </td>
                    </>
                  )}

                  {editing && (
                    <td className="text-center">
                      <button className="delete-button">
                        <FaTimes />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Save button ───────────────────────────────────────────────── */}
        <div className="save-container">
          <button className="save-button">Save the changes</button>
        </div>
      </div>
      <Footer1/>
    </>
  );
}
