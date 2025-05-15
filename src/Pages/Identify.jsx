import { useState, useRef } from "react";
import Top from "../components/Top";
import Footer1 from "../components/Footer1";
import "../styles.css";
import UploadIcon from "../assets/upload.svg";


export default function Identify() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/jpg")) {
      setSelectedFile(file);
    } else {
      alert("Only PNG, JPG, or JPEG files are allowed.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/jpg")) {
      setSelectedFile(file);
    } else {
      alert("Only PNG, JPG, or JPEG files are allowed.");
    }
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      alert("Please upload a file first.");
      return;
    }
    // You can use FormData here to send the file to a backend API
    alert(`Submitted file: ${selectedFile.name}`);
  };

  return (
    <>
      <Top />
      <div className="identify-container">
        <div className="text-box-identify-plant">
          <h1 className="text-title-identify-plant">Identify Plants</h1>
        </div>

        <section>
          <div className="cs-guide-content">
            <div className="cs-upload-guide">
              <h2>Photo upload guidelines</h2>
              <ol type="1" className="cs-upload-guide-content">
                <li><strong>File format:</strong> only PNG and JPG/JPEG format are accepted</li>
                <li><strong>Quality:</strong> High resolution and compression are ideal</li>
                <li><strong>Position:</strong> Image should be right side up</li>
                <li><strong>Size:</strong> Each photo should not be larger than 1MB</li>
              </ol>

              <div
                className={`dropzone ${dragActive ? "dropzone-active" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
              >
                <img src={UploadIcon} className="cs-upload-logo" alt="Upload icon" />
                <p className="dropzoneMessage">Drag or Drop the photo here to upload<br />or click to browse</p>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  ref={inputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>

              {selectedFile && (
                <p style={{ marginTop: "1rem", color: "#4E6E4E" }}>
                  <strong>Selected File:</strong> {selectedFile.name}
                </p>
              )}

              <button type="button" onClick={handleSubmit} className="cs-identify-btn">
                Submit Now
              </button>
            </div>
          </div>
        </section>

        {/* Output Section... */}
        <section>
          <div className="text-box-output-image">
            <h2 className="text-title-output-image">Output Images</h2>
          </div>

          <div className="cs-identify-container">
            <div className="cs-identify-plant">
              <div className="cs-identify-grid-container">
                <div className="cs-identify-grid-item">
                  <figure>
                    <a href="https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:462286-1">
                      <img className="cs-plant-picture-1" src="/species.png" alt="Plant species" />
                    </a>
                    <figcaption className="cs-caption"><strong>Species</strong></figcaption>
                  </figure>
                </div>
                <div className="cs-identify-grid-item">
                  <strong>File Name: example.png</strong>
                  <dl>
                    <dt className="cs-definition-list"><strong>Datetime:</strong></dt>
                    <dd>15/05/2025</dd>
                    <dt className="cs-definition-list"><strong>Normal Name:</strong></dt>
                    <dd>Aeron Liu</dd>
                    <dt className="cs-definition-list"><strong>Scientific Name:</strong></dt>
                    <dd>ᚨᛖᚱᛟᚾ ᛚᛁᚢ</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer>
        <Footer1 />
      </footer>
    </>
  );
}
