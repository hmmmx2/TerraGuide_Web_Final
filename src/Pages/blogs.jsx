import React from "react";
import Top from "../components/Top";
import Footer1 from "../components/Footer1";
import "../blogs.css";
import blogs1 from "../assets/smg1.png";

export default function Blogs() {
  return (
    <>
      <header>
        <Top />
      </header>

      <main className="blog-page">
        {/* Hero banner */}
        <section
          className="blog-hero"
          style={{ backgroundImage: `url(${blogs1})` }}
        >
          <div className="blog-hero-overlay">
            <h1>The History of Semenggoh</h1>
          </div>
        </section>

        {/* Content card */}
        <section className="blog-content-card">
          <p>
            Semenggoh Wildlife Centre enables tourists to interact with wild
            orangutans and enjoy feeding time for an amazing experience. For
            more than thirty years, Semenggoh’s staff have trained young
            orangutans how to survive in the wild. The programme has
            successfully provided previously orphaned or rescued orangutans a
            chance to live freely in their natural habitat.
          </p>

          <p>
            Tour operators often combine visits to Semenggoh with other local
            attractions. Given its marketability and unique draw, it’s vital to
            study tourists’ perceptions of destination competitiveness. Liu
            (2006) notes that in Malaysia, rural tourism competitiveness is
            closely tied to ethnic, geographic, socio-cultural, and economic
            factors.
          </p>

          <h2>Destination Image &amp; Satisfaction</h2>
          <p>
            Jenkins (1999) examined how tourists’ mental images of a
            destination differ from academic or practitioner views. Lawson &
            Bovy (1977) define “destination image” as the sum of all
            objective knowledge, subjective impressions, and emotional thoughts
            held by individuals or groups. To boost competitiveness, positive
            post-purchase behaviour is crucial—Yoon &amp; Uysal (2003) showed
            that higher satisfaction correlates with intention to return.
          </p>

          <h2>Natural Resources &amp; Sustainability</h2>
          <p>
            “Natural resources” include forests, water, land and minerals that
            underlie economic gain. Mazilu (2012) views a destination as the
            nexus of geographic and anthropic elements accessible to tourists.
            Dugulan et al. (2010) stress that natural and cultural heritage are
            pillars of sustainable tourism, with Lumsdon (1997) naming natural
            resources as a key pillar of destination competitiveness.
          </p>
        </section>
      </main>

      <Footer1 />
    </>
  );
}
