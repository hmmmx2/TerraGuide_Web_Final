import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../license.css";

const initialData = [
  { name: 'Timmy He', course: 'Completed', program: 'Completed', exam: 'Pass',    status: 'approve' },
  { name: 'Jimmy He', course: 'Completed', program: 'Completed', exam: 'Pass',    status: 'approve' },
  { name: 'Gimmy He', course: 'Completed', program: 'Completed', exam: 'Pass',    status: 'approve' },
  { name: 'Alvin He', course: 'Completed', program: 'Completed', exam: 'Pass',    status: 'approve' },
  { name: 'Aaron He', course: 'Completed', program: 'Completed', exam: 'Pass',    status: 'approve' },
  { name: 'Timmy He', course: 'Completed', program: 'Completed', exam: 'Failed',  status: 'reject'  },
  { name: 'Timmy He', course: 'Completed', program: 'Completed', exam: 'Failed',  status: 'reject'  },
  { name: 'Timmy He', course: 'Completed', program: 'In Progress', exam: 'Not Started', status: 'pending' },
  { name: 'Timmy He', course: 'Completed', program: 'Incomplete',  exam: 'Not Started', status: 'pending' },
  { name: 'Timmy He', course: 'In Progress', program: 'Not Started', exam: 'Not Started', status: 'pending' },
  { name: 'Timmy He', course: 'In Progress', program: 'Not Started', exam: 'Not Started', status: 'pending' },
  { name: 'Timmy He', course: 'In Progress', program: 'Not Started', exam: 'Not Started', status: 'pending' },
];

// helper: extract initials
const getInitials = fullName =>
  fullName
    .split(" ")
    .map(p => p[0])
    .join("")
    .toUpperCase();

export default function License() {
  const [rows, setRows] = useState(initialData);

  const handleStatusChange = (idx, newStatus) => {
    const updated = [...rows];
    updated[idx].status = newStatus;
    setRows(updated);
    // you can also fire off an API call here
  };

  return (
    <div className="table-responsive shadow-sm rounded-3 border">
      <table className="table table-hover align-middle mb-0">
        <thead className="bg-light">
          <tr>
            <th className="fw-bold px-4 py-3">User Name</th>
            <th className="text-center fw-bold px-4 py-3">Course</th>
            <th className="text-center fw-bold px-4 py-3">Mentor Programme</th>
            <th className="text-center fw-bold px-4 py-3">Exam</th>
            <th className="text-center fw-bold px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {/* Name + avatar */}
              <td className="px-4 py-3">
                <div className="d-flex align-items-center">
                  <span
                    className="rounded-circle bg-light text-primary d-inline-flex align-items-center justify-content-center fw-bold me-3"
                    style={{ width: "3rem", height: "3rem", fontSize: "1rem" }}
                  >
                    {getInitials(row.name)}
                  </span>
                  <Link to="#" className="text-reset fw-bold">
                    {row.name}
                  </Link>
                </div>
              </td>

              {/* Course / Program / Exam */}
              <td className="px-4 py-3 text-center">{row.course}</td>
              <td className="px-4 py-3 text-center">{row.program}</td>
              <td className="px-4 py-3 text-center">{row.exam}</td>

              {/* Status dropdown */}
              <td className="px-4 py-3 text-center">
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
