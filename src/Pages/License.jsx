// src/components/License.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../license.css";

const sampleData = [
  { name: 'Timmy He', course: 'Completed', program: 'Completed', exam: 'Pass', status: 'approve' },
  { name: 'Jimmy He', course: 'Completed', program: 'Completed', exam: 'Pass', status: 'approve' },
  { name: 'Gimmy He', course: 'Completed', program: 'Completed', exam: 'Pass', status: 'approve' },
  { name: 'Alvin He', course: 'Completed', program: 'Completed', exam: 'Pass', status: 'approve' },
  { name: 'Aaron He', course: 'Completed', program: 'Completed', exam: 'Pass', status: 'approve' },
  { name: 'Timmy He', course: 'Completed', program: 'Completed', exam: 'Failed', status: 'reject' },
  { name: 'Timmy He', course: 'Completed', program: 'Completed', exam: 'Failed', status: 'reject' },
  { name: 'Timmy He', course: 'Completed', program: 'In Progress', exam: 'Not Started', status: 'pending' },
  { name: 'Timmy He', course: 'Completed', program: 'Incomplete', exam: 'Not Started', status: 'pending' },
  { name: 'Timmy He', course: 'In Progress', program: 'Not Started', exam: 'Not Started', status: 'pending' },
  { name: 'Timmy He', course: 'In Progress', program: 'Not Started', exam: 'Not Started', status: 'pending' },
  { name: 'Timmy He', course: 'In Progress', program: 'Not Started', exam: 'Not Started', status: 'pending' },
];

// 取姓名首字母
const getInitials = (fullName) =>
  fullName
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase();

export default function License() {
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
          {sampleData.map((row, i) => (
            <tr key={i}>
              {/* 姓名 + 大頭貼圈 */}
              <td className="px-4 py-3">
                <div className="d-flex align-items-center">
                  <span
                    className="rounded-circle bg-light text-primary d-inline-flex align-items-center justify-content-center fw-bold me-3"
                    style={{
                      width: "3rem",
                      height: "3rem",
                      fontSize: "1rem",
                    }}
                  >
                    {getInitials(row.name)}
                  </span>
                  <Link to="#" className="text-reset fw-bold">
                    {row.name}
                  </Link>
                </div>
              </td>

              {/* 其它欄位置中 */}
              <td className="px-4 py-3 text-center">{row.course}</td>
              <td className="px-4 py-3 text-center">{row.program}</td>
              <td className="px-4 py-3 text-center">{row.exam}</td>

              {/* 狀態 badge */}
              <td className="px-4 py-3 text-center">
                {row.status === 'approve' && (
                  <span className="badge bg-success px-3 py-2">Approved</span>
                )}
                {row.status === 'reject' && (
                  <span className="badge bg-danger px-3 py-2">Rejected</span>
                )}
                {row.status === 'pending' && (
                  <span className="badge bg-secondary px-3 py-2">Pending</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
