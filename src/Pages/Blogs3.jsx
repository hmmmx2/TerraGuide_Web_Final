import React from "react";
import Top from "../components/Top";
import Footer1 from "../components/Footer1";
import "../blogs2.css";
import Blogs2Image from "../assets/smg3.jpg";

export default function Blogs3() {
  return (
    <>
      <header>
        <Top />
      </header>

      <main className="blog-page">
        {/* Hero banner */}
        <section
          className="blog-hero"
          style={{ backgroundImage: `url(${Blogs2Image})` }}
        >
          <div className="blog-hero-overlay">
            <h1>Species of Birds in Semenggoh</h1>
          </div>
        </section>

        {/* Content card */}
        <section className="blog-content-card">
          <h2>History</h2>
          <p>
          Habitat loss affects survival of hornbills in the wild and their dipping numbers has led
Malaysia to classify them as threatened species. Thus, their habitat must be protected
thorough greater conservation efforts to prevent extinction of that species.
          </p>

          <h2>Ecological &amp; Role</h2>
          <p>
          Hornbills congregate in May/June and
disperse in November, moving in a northsouth direction. Studies show that most
hornbills in South-east Asia exploit fruit
resources, which are widely dispersed in
tropical rainforests. Thus, hornbills play a crucial
ecological role in natural rainforests. A
study attempted to determine the population
of hornbills and their density in order to
conserve their habitat.
          </p>

          <h2>Suitable &amp; Habitat</h2>
          <p>
          The most suitable habitat for hornbills
is undoubtedly the primary rainforest, which
has fruit trees favoured by some species and
the shrubs and riverine patches favoured
by others.
          </p>
        </section>
      </main>

      <footer>
        <Footer1 />
      </footer>
    </>
  );
}
