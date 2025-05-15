import { useState, useRef } from "react";
import Top from "../components/Top";
import Footer1 from "../components/Footer1";
import "../styles.css";
import UploadIcon from "../assets/upload.svg";

export default function Identify() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/jpg")) {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
      setPredictionResult(null);
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
      setPreviewURL(URL.createObjectURL(file));
      setPredictionResult(null);
    } else {
      alert("Only PNG, JPG, or JPEG files are allowed.");
    }
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please upload a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:8000/", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Prediction failed");

      const data = await response.json();
      setPredictionResult(data);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Something went wrong. Please try again.");
    }
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
                <p style={{ marginTop: "10px", color: "#4E6E4E" }}>
                  <strong>Selected File:</strong> {selectedFile.name}
                </p>
              )}

              <button type="button" onClick={handleSubmit} className="cs-identify-btn">
                Submit Now
              </button>
            </div>
          </div>
        </section>

        <section>
          <div className="text-box-output-image">
            <h2 className="text-title-output-image">Output Images</h2>
          </div>
          <div className="cs-output">
            <div className="cs-predict-output">
              {previewURL && (
                <div className="cs-output-image">
                  <img src={previewURL} alt="Uploaded preview" className="cs-images" />
                </div>
              )}

              {predictionResult && (
                <div className="cs-identify-grid-item">
                  <dl>
                    <dt><strong>Predicted Class:</strong></dt>
                    <dd>{predictionResult.predicted_class}</dd>
                    <dt className="cs-definition-list"><strong>Confidence:</strong></dt>
                    <dd>{(predictionResult.confidence * 100).toFixed(2)}%</dd>
                  </dl>
                </div>
              )}
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
