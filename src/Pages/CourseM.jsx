// src/pages/CourseM.jsx
import React, { useState } from "react";
import AdminTop from "../components/AdminTop";
import Footer1 from "../components/Footer1";
import { FaTimes, FaPlus } from "react-icons/fa";            // ← make sure react-icons is installed
import Blogs1Image from "../assets/MasterParkGuide.png";
import Blogs2Image from "../assets/Nature_Guide.png";
import "../blogmenu.css";

export default function CourseM() {
  const [isEditing, setIsEditing] = useState(false);

  const courses = [
    {
      id: 1,
      title: "Course 1",
      description:
        "This course will test your various knowledge as a Park Guide for Semenggoh Wildlife Centre",
      image: Blogs1Image,
    },
    {
      id: 2,
      title: "Course 2",
      description:
        "This course will test your various knowledge on orangutan and other animal's behavior in Semegguh Wildlife Centre",
      image: Blogs2Image,
    },
  ];

  const handleDelete = (id) => {
    // TODO: hook up your delete logic here
    console.log("Delete course", id);
  };

  const handleAdd = () => {
    // TODO: hook up your “add new course” logic here
    console.log("Add new course");
  };

  return (
    <>
      <AdminTop />

      <div className="b-containerBM">
        {/* header with Edit/Done */}
        <div className="headerBM">
          <h3>Course Management</h3>
          <button
            className="edit-buttonBM"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Done" : "Edit"}
          </button>
        </div>

        <div className="blog-gridBM">
          {/* existing cards */}
          {courses.map((c) => (
            <div key={c.id} className="b-cardBM">
              {isEditing && (
                <FaTimes
                  className="delete-iconBM"
                  onClick={() => handleDelete(c.id)}
                />
              )}
              <div className="b-image-containerBM">
                <img
                  className="b-card-imageBM"
                  src={c.image}
                  alt={c.title}
                />
              </div>
              <div className="b-contentBM">
                <div className="b-card-titleBM">{c.title}</div>
                <div className="b-card-descriptionBM">{c.description}</div>
              </div>
            </div>
          ))}

          {/* “+” card, only in edit mode */}
          {isEditing && (
            <div className="b-cardBM plus-cardBM" onClick={handleAdd}>
              <FaPlus className="plus-iconBM" />
            </div>
          )}
        </div>
      </div>

      <footer>
        <Footer1 />
      </footer>
    </>
  );
}
