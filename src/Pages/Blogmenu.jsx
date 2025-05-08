import React from "react";
import { Link } from "react-router-dom";
import Top from "../components/Top";
import Footer1 from "../components/Footer1";
import Blogs1Image from "../assets/smg1.png";
import Blogs2Image from "../assets/smg2.png";
import Blogs3Image from "../assets/smg3.jpg";
import "../blogmenu.css";  // make sure this points to your main stylesheet

export default function Blogmenu() {
  return (
    <>
      <Top />

      <div className="b-containerBM">
        <h3>Blogs</h3>

        <div className="blog-gridBM">
          {/* 1st card */}
          <Link to="/blogs" className="b-card-linkBM">
            <div className="b-cardBM">
              <div className="b-image-containerBM">
                <img
                  className="b-card-imageBM"
                  src={Blogs1Image}
                  alt="The History of Semenggoh"
                />
              </div>
              <div className="b-contentBM">
                <div className="b-card-titleBM">
                  The History of Semenggoh...
                </div>
                <div className="b-card-descriptionBM">
                  Semenggoh Wildlife Centre enables tourists to interact with wild orang utans and enjoy the orang utans feeding time for the amazing experience.
                </div>
              </div>
            </div>
          </Link>

          {/* 2nd card */}
          <Link to="/blogs2" className="b-card-linkBM">
            <div className="b-cardBM">
              <div className="b-image-containerBM">
                <img
                  className="b-card-imageBM"
                  src={Blogs2Image}
                  alt="Species of Orang Utan"
                />
              </div>
              <div className="b-contentBM">
                <div className="b-card-titleBM">
                  Species of Orang Utan
                </div>
                <div className="b-card-descriptionBM">
                  Orangutans typically inhabit the majority of Sarawak's southern region. There are currently only a few orangutans in Sarawak, with the majority of them living in the Batang Ai National Park (BANP).
                </div>
              </div>
            </div>
          </Link>

            {/* 3rd card */}
            <Link to="/blogs3" className="b-card-linkBM">
            <div className="b-cardBM">
              <div className="b-image-containerBM">
                <img
                  className="b-card-imageBM"
                  src={Blogs3Image}
                  alt="Species of Orang Utan"
                />
              </div>
              <div className="b-contentBM">
                <div className="b-card-titleBM">
                  Species of Bird in Semenggoh
                </div>
                <div className="b-card-descriptionBM">
                Malaysia is home to ten species of hornbills, known for their large, distinctive beaks and cultural significance in the region. These birds are endangered and need protection.
                </div>
              </div>
            </div>
          </Link>

          {/* 4th “Coming Soon” card */}
          <div className="coming-soon-cardBM">
            <div className="coming-soon-boxBM">Coming Soon</div>
            <div className="coming-soon-titleBM">Coming Soon</div>
            <div className="coming-soon-textBM">Coming Soon</div>
          </div>
        </div>
      </div>

      <footer>
        <Footer1 />
      </footer>
    </>
  );
}
