import React from "react";
import { Link } from "react-router-dom";


export default function License(){
  // inside your component…
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

return (
  <div className="table-responsive shadow-sm rounded-3 border">
    <table className="table table-hover align-middle mb-0">
      <thead className="bg-light">
        <tr>
          <th className="text-center fw-bold px-4 py-3">User Name</th>
          <th className="text-center fw-bold px-4 py-3">Course</th>
          <th className="text-center fw-bold px-4 py-3">Mentor Programme</th>
          <th className="text-center fw-bold px-4 py-3">Exam</th>
          <th className="text-center fw-bold px-4 py-3">Status</th>
        </tr>
      </thead>
      <tbody>
        {sampleData.map((row, i) => (
          <tr key={i}>
            <td className="px-4 py-3 text-center">{row.name}</td>
            <td className="px-4 py-3 text-center">{row.course}</td>
            <td className="px-4 py-3 text-center">{row.program}</td>
            <td className="px-4 py-3 text-center">{row.exam}</td>
            <td className="px-4 py-3 text-center">
              {row.status === 'approve' && (
                <button className="btn btn-sm btn-outline-success">
                  <i className="bi bi-check-square-fill me-1"></i>
                  Approve
                </button>
              )}
              {row.status === 'reject' && (
                <button className="btn btn-sm btn-outline-danger">
                  <i className="bi bi-x-square-fill me-1"></i>
                  Reject
                </button>
              )}
              {row.status === 'pending' && (
                <button className="btn btn-sm btn-outline-secondary">
                  <i className="bi bi-clock-fill me-1"></i>
                  Pending
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

}