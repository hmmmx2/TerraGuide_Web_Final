import React, { useState } from "react";
import "../slideshow2.css";
import Slideshow2Image1 from "../assets/smg1.png";
import Slideshow2Image2 from "../assets/smg2.png";
import Slideshow2Image3 from "../assets/smg3.jpg";

export default function Slideshow2() {
  const slides = [
    { image: Slideshow2Image1, caption: "The History of Semenggoh Nature Reserve" },
    { image: Slideshow2Image2, caption: "Species of Orangutan" },
    { image: Slideshow2Image3, caption: "Species of Birds in Semenggoh" },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const plusSlides2 = (n) => {
    let newIndex = currentSlide + n;
    if (newIndex >= slides.length) newIndex = 0;
    if (newIndex < 0) newIndex = slides.length - 1;
    setCurrentSlide(newIndex);
  };

  return (
    <div className="slideshow-container-SS2">
      {slides.map((slide, index) => (
        <div
          key={index}
          className="mySlidesSS2"
          style={{ display: index === currentSlide ? "flex" : "none" }}
        >
          {/* WRAPPER to crop the image */}
          <div className="slide-image-containerSS2">
            <img
              src={slide.image}
              className="slide-imageSS2"
              alt={`Slide ${index + 1}`}
            />
          </div>
          <div className="green-box-SS2">{slide.caption}</div>
        </div>
      ))}

      <div className="arrow-containerSS2">
        <span className="arrowSS2" onClick={() => plusSlides2(-1)}>
          &#10094;
        </span>
        <span className="arrowSS2" onClick={() => plusSlides2(1)}>
          &#10095;
        </span>
      </div>
    </div>
  );
}
