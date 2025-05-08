import React from "react";
import { Link } from "react-router-dom";
import Top from "../components/Top";
import Footer1 from "../components/Footer1";
import Blogs1Image from "../assets/MasterParkGuide.png";
import Blogs2Image from "../assets/Nature_Guide.png";
import "../blogmenu.css";  // make sure this points to your main stylesheet

export default function Blogmenu() {
  return (
    <>
      <Top />

      <div className="b-containerBM">
        <h3>My Courses</h3>

        <div className="blog-gridBM">
          {/* 1st card */}
          <Link to="/Course1" className="b-card-linkBM">
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
                  Course 1
                </div>
                <div className="b-card-descriptionBM">
                  This course will test your various knowledge as a Park Guide for Semengguh Wildlife Centre
                </div>
              </div>
            </div>
          </Link>

          {/* 2nd card */}
          <Link to="/Course1" className="b-card-linkBM">
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
                  Course 2
                </div>
                <div className="b-card-descriptionBM">
                This course will test your various knowledge on orangutan and other animal's behavior in Semegguh Wildlife Centre
                </div>
              </div>
            </div>
          </Link>

          {/* 3rd “Coming Soon” card */}
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
