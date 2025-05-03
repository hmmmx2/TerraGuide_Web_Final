import React, { useEffect, useState } from "react";
import icon1 from "../assets/icon1.svg";
import icon2 from "../assets/icon2.svg";
import icon3 from "../assets/icon3.svg";
import "../slideshow.css"

const slidesData = [
  {
    title: "BOOK A PARK GUIDE",
    text: [
      "Park Guide can help you explore the entire Semenggoh Nature Reserve.",
      "Book it Now!"
    ],
    image: icon1,
    buttonText: "BOOK NOW",
    buttonLink: "dexai.html"
  },
  {
    title: "FLORA & FAUNA",
    text: [
      "Our AI can identify any endangered animal and plants in the National Park",
      "Give it a try now!"
    ],
    image: icon2,
    buttonText: "GET STARTED",
    buttonLink: "dexai.html"
  },
  {
    title: "RECOMMENDATION SYSTEM",
    text: [
      "Our AI can recommend any further course after taking the Introduction to Park Guide",
      "Give it a try now!"
    ],
    image: icon3,
    buttonText: "GET STARTED",
    buttonLink: "dexai.html"
  }
];

export default function Slideshow() {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slidesData.length);
    }, 5000); // Auto-slide every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="registration-height-containerSS1">
      <div className="registration-svg-form-indexSS1">
        <div className="slideshow-containerSS1">
          {slidesData.map((slide, i) => (
            <div
              className="mySlidesSS1"
              style={{ display: i === slideIndex ? "flex" : "none" }}
              key={i}
            >
              <div className="slide-leftSS1">
                <h1>{slide.title}</h1>
                <div className="slieshow1text">
                  {slide.text.map((line, j) => (
                    <p key={j}>{line}</p>
                  ))}
                </div>
              </div>
              <div className="slide-rightSS1">
                <img src={slide.image} alt={`Slide ${i + 1} Image`} />
                <a href={slide.buttonLink} className="slide-btnSS1">
                  {slide.buttonText}
                </a>
              </div>
            </div>
          ))}

          <div className="dot-containerSS1">
            {slidesData.map((_, i) => (
              <span
                key={i}
                className={`dotSS1 ${i === slideIndex ? "active" : ""}`}
                onClick={() => setSlideIndex(i)}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
