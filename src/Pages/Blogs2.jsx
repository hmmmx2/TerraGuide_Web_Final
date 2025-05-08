import React from "react";
import Top from "../components/Top";
import Footer1 from "../components/Footer1";
import "../blogs2.css";
import Blogs2Image from "../assets/smg2.png";

export default function Blogs2() {
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
            <h1>Species of Orangutan</h1>
          </div>
        </section>

        {/* Content card */}
        <section className="blog-content-card">
          <h2>Rehabilitation History</h2>
          <p>
            Orangutans typically inhabit the majority of Sarawak's southern
            region. There are currently only a few orangutans in Sarawak,
            mostly in the Batang Ai National Park–Lanjak Entimau Wildlife
            Sanctuary complex. Smaller groups live in the peat swamps of the
            Sedilu-Sebuyau and Gunung Lesong areas. Although Wallace first
            documented them in 1855, formal protective measures only began in
            1958. A first rehabilitation effort at Bako in 1963 failed—but
            the successful Semenggoh programme, started in 1975, produced the
            thriving semi-wild population we see today.
          </p>

          <h2>Conservation &amp; Genetics</h2>
          <p>
            By 1998, Semenggoh’s site was too small, so the programme moved to
            Matang. Ongoing research now focuses on genetic viability and
            habitat requirements, using updated population estimates and threat
            assessments to guide future conservation plans under Sarawak’s
            Wildlife Protection Ordinance.
          </p>

          <h2>Distribution &amp; Subspecies</h2>
          <p>
            Once widespread from China to Java, today orangutans survive only
            in Sumatra (≈6 600 individuals) and Borneo (≈54 000). Two species
            are recognized—P. abelii in Sumatra and P. pygmaeus in Borneo—
            with three Bornean subspecies: W. Borneo (p. pygmaeus), N.
            Borneo (p. morio) and S. Borneo (p. wurmbii). Habitat loss and
            fragmentation continue to drive declines, making habitat
            protection more crucial than ever.
          </p>
        </section>
      </main>

      <footer>
        <Footer1 />
      </footer>
    </>
  );
}
