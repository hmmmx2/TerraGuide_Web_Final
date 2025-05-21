import { useState, useRef } from "react";
import Top from "../components/Top";
import AdminTop from "../components/AdminTop";
import Footer1 from "../components/Footer1";
import "../styles.css";
import UploadIcon from "../assets/upload.svg";
import { useAuth } from "../contexts/authContext/supabaseAuthContext";

export default function Identify() {
  const { userRole } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const inputRef = useRef(null);

  // Determine which top component to render based on user role
  const TopComponent = userRole === 'admin' ? AdminTop : Top;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting image...");
    
    try {
      if (!selectedFile) {
        alert("Please upload a file first.");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await fetch("http://localhost:8000/api/identify", {
          method: "POST",
          body: formData
        });

        if (!response.ok) throw new Error("Prediction failed");

        const data = await response.json();
        setPredictionResult(data);
        setShowToast(true);
        
        // Auto-hide toast after 5 seconds
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
        
        console.log("Response data:", data);
      } catch (error) {
        console.error("Error submitting image:", error);
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <TopComponent />
      
      {/* Toast notification for results */}
      {showToast && predictionResult && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1100 }}>
          <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header" style={{ backgroundColor: "#4E6E4E", color: "white" }}>
              <strong className="me-auto">Identification Result</strong>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={() => setShowToast(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="toast-body">
              <div className="mb-2">
                <strong>Predicted Class:</strong> {predictionResult.predicted_class}
              </div>
              <div>
                <strong>Confidence:</strong> {(predictionResult.confidence * 100).toFixed(2)}%
                <div className="progress mt-1">
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ 
                      width: `${(predictionResult.confidence * 100).toFixed(2)}%`,
                      backgroundColor: "#4E6E4E" 
                    }}
                    aria-valuenow={(predictionResult.confidence * 100).toFixed(2)}
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="container mt-0 py-5">
        {/* Header Section */}
        <div className="row mb-5">
          <div className="col-12 text-center">
            <h1 className="fw-bold mb-0" style={{ color: "#4E6E4E" }}>Identify Plants</h1>
            <div className="border-bottom border-3 mx-auto mt-2 mb-4" style={{ width: "50px", borderColor: "#4E6E4E !important" }}></div>
          </div>
        </div>
        
        {/* Main Content Section */}
        <div className="row g-4">
          {/* Guidelines Column */}
          <div className="col-md-6">
            <div className="p-4 rounded-3 shadow-sm h-100" style={{ backgroundColor: "#f8f9fa" }}>
              <h2 className="fw-bold mb-4" style={{ color: "#4E6E4E", fontSize: "1.5rem" }}>Photo upload guidelines</h2>
              <ol className="ps-3">
                <li className="mb-3"><span className="fw-medium">File format:</span> only PNG and JPG/JPEG format are accepted</li>
                <li className="mb-3"><span className="fw-medium">Quality:</span> High resolution and compression are ideal</li>
                <li className="mb-3"><span className="fw-medium">Position:</span> Image should be right side up</li>
                <li className="mb-3"><span className="fw-medium">Size:</span> Each photo should not be larger than 1MB</li>
              </ol>
            </div>
          </div>
          
          {/* Upload Column */}
          <div className="col-md-6">
            <div className="p-4 rounded-3 shadow-sm h-100" style={{ backgroundColor: "#f8f9fa" }}>
              <h2 className="fw-bold mb-4" style={{ color: "#4E6E4E", fontSize: "1.5rem" }}>Upload your image</h2>
              
              <div 
                className={`rounded-3 border-2 ${dragActive ? "border-success" : "border-dashed"} border d-flex flex-column align-items-center justify-content-center p-4 mb-4`}
                style={{ 
                  minHeight: "200px", 
                  cursor: "pointer",
                  backgroundColor: dragActive ? "rgba(78, 110, 78, 0.05)" : "white",
                  transition: "all 0.2s ease"
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
              >
                <img src={UploadIcon} alt="Upload icon" className="mb-3" style={{ width: "48px", height: "48px" }} />
                <p className="text-center mb-0">
                  Drag or Drop the photo here to upload<br />or click to browse
                </p>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  ref={inputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>

              {selectedFile && (
                <div className="alert alert-success mb-4 d-flex align-items-center">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  <div>
                    <strong>Selected File:</strong> {selectedFile.name}
                  </div>
                </div>
              )}

              <button 
                type="button" 
                onClick={handleSubmit} 
                className="btn btn-lg w-100 text-white d-flex align-items-center justify-content-center"
                style={{ backgroundColor: "#4E6E4E" }}
              >
                <i className="bi bi-search me-2"></i>
                Identify Plant
              </button>
              
              {/* Inline Preview */}
              {previewURL && (
                <div className="mt-4">
                  <h6 className="fw-bold mb-2" style={{ color: "#4E6E4E" }}>Image Preview</h6>
                  <div className="text-center p-2 rounded-3 border" style={{ backgroundColor: "white" }}>
                    <img 
                      src={previewURL} 
                      alt="Uploaded preview" 
                      className="img-fluid rounded-2" 
                      style={{ maxHeight: "150px", objectFit: "contain" }} 
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer>
        <Footer1 />
      </footer>
    </>
  );
}
