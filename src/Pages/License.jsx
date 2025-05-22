// src/components/LicenseManagement.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../license.css";

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
  // …etc
];

const renewalData = [
  { name: 'Alice Smith',   course: 'Renewal A',  program: 'In Progress', exam: 'N/A', status: 'pending' },
  { name: 'Bob Johnson',   course: 'Renewal B',  program: 'Completed',   exam: 'N/A', status: 'approve' },
  { name: 'Carol Lee',     course: 'Renewal C',  program: 'Pending',     exam: 'N/A', status: 'reject'  },
  // …etc
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
  // which view: 'approval' or 'renewal'
  const [view, setView]             = useState("approval");
  // rows to render
  const [rows, setRows]             = useState(approvalData);
  // dropdown open state
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleViewChange = newView => {
    setView(newView);
    setRows(newView === "approval" ? approvalData : renewalData);
    setDropdownOpen(false);
  };

  const title =
    view === "approval"
      ? "License Approval Management"
      : "License Renewal Management";

  return (
    <div>
      {/* ── Header with Management‐Type Dropdown ── */}
      <div className="d-flex align-items-center mb-4">
        <div className="dropdown me-3">
          <button
            className="btn btn-light dropdown-toggle"
            onClick={() => setDropdownOpen(o => !o)}
            type="button"
          >
            {title}
          </button>
          <ul
            className={`dropdown-menu${dropdownOpen ? " show" : ""}`}
            style={{ minWidth: "max-content" }}
          >
            <li>
              <button
                className="dropdown-item"
                onClick={() => handleViewChange("approval")}
              >
                License Approval Management
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => handleViewChange("renewal")}
              >
                License Renewal Management
              </button>
            </li>
          </ul>
        </div>
        {/* TODO: insert your Search / Edit / Send buttons here */}
      </div>

      {/* ── Table ──────────────────────────────────────────────────────── */}
      <div className="table-responsive shadow-sm rounded-3 border">
        <table className="table">
          <thead>
            <tr>
              <th>User Name</th>
              <th className="text-center">Course</th>
              <th className="text-center">Mentor Programme</th>
              <th className="text-center">Exam</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
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
                <td className="text-center">{row.course}</td>
                <td className="text-center">{row.program}</td>
                <td className="text-center">{row.exam}</td>
                <td className="text-center">
                  <select
                    className={`status-dropdown ${row.status}`}
                    value={row.status}
                    onChange={e => {
                      const updated = [...rows];
                      updated[i].status = e.target.value;
                      setRows(updated);
                    }}
                  >
                    <option value="approve">Approved</option>
                    <option value="reject">Rejected</option>
                    <option value="pending">Pending</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
