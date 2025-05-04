// src/components/Slideshow.jsx
import React, { useState } from 'react'
import icon1 from '../assets/icon1.svg'
import icon2 from '../assets/icon2.svg'
import icon3 from '../assets/icon3.svg'
import '../slideshow.css'

const slides = [
  {
    title: "BOOK A PARK GUIDE",
    lines: [
      "Park Guide can help you explore the entire Semenggoh Nature Reserve.",
      "Book it now!"
    ],
    image: icon1,
    button: { text: "BOOK NOW", link: "/dexai" }
  },
  {
    title: "FLORA & FAUNA",
    lines: [
      "Our AI can identify any endangered animal and plants in the National Park.",
      "Give it a try now!"
    ],
    image: icon2,
    button: { text: "GET STARTED", link: "/dexai" }
  },
  {
    title: "RECOMMENDATION SYSTEM",
    lines: [
      "Our AI can recommend any further course after taking the Introduction to Park Guide.",
      "Give it a try now!"
    ],
    image: icon3,
    button: { text: "GET STARTED", link: "/dexai" }
  }
]

export default function Slideshow() {
  const [idx, setIdx] = useState(0)
  const last = slides.length - 1

  const prev = () => setIdx(i => i === 0 ? last : i - 1)
  const next = () => setIdx(i => i === last ? 0 : i + 1)

  return (
    <div className="slideshow">
      <button className="arrow left" onClick={prev}>&lsaquo;</button>

      <div
        className="slides"
        style={{ transform: `translateX(-${idx * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div className="slide" key={i}>
            <div className="slide-text">
              <h2>{slide.title}</h2>
              {slide.lines.map((line, j) => <p key={j}>{line}</p>)}
            </div>

            <div className="slide-media">
              <img
                src={slide.image}
                alt={slide.title}
                className="slide-img"
              />
              <a href={slide.button.link} className="slide-btn">
                {slide.button.text}
              </a>
            </div>
          </div>
        ))}
      </div>

      <button className="arrow right" onClick={next}>&rsaquo;</button>

      <div className="dots">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === idx ? 'active' : ''}`}
            onClick={() => setIdx(i)}
          />
        ))}
      </div>
    </div>
  )
}
