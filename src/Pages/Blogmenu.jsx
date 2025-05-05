import { Link } from 'react-router-dom';
import Footer1 from '../components/Footer1';
import "../styles.css";
import Blogs1Image from "../assets/smg1.png";
import Blogs2Image from "../assets/smg2.png";
import Top from '../components/Top';



export default function Blogmenu() {
  return (
    <>
      <Top/>


    <div className="b-containerBM">
    <h3>Popular Tourist Spot <span class="tgl-btnBM" onclick="toggleSpots()">See All</span></h3>
    <div className="blog-gridBM" id="pm-spots">
      <a href="blogs.html" class="b-card-linkBM">
      <Link to="/blogs2">
        <div className="b-cardBM">
          <div className="b-image-containerBM">

           <img
                                  src={Blogs1Image}
                             
                                  alt="Login Illustration"
                                  

                                />
          </div>
          <div className="b-contentBM">
            <div className="b-card-titleBM">The History of Semenggoh...</div>
            <div className="b-card-descriptionBM">
              Semenggoh Wildlife Centre enables tourists to interact with wild orang utans and enjoy the orang
              utans feeding time for the amazing experience.
            </div>
          </div>
        </div>
      </Link>
      </a>
      


      
      <a href="blogs2.html" class="b-card-linkBM">
      <div className="b-cardBM">
        <div className="b-image-containerBM">
          <div className="b-card-imageBM">
            <img
                                src={Blogs2Image}
                               
                                alt="Login Illustration"
                              />
                              </div>
        </div>
          <div className="b-contentBM">
            <div className="b-card-titleBM">Species of Orang Utan</div>
            <div className="b-card-descriptionBM">
              Orangutans typically inhabit the majority of Sarawak's southern region.  There are currently only a few orangutans in Sarawak, with the majority of them living in the Batang Ai National Park (BANP)
          </div>
        </div>
      </div>
      </a>

      <div class="coming-soon-cardBM">
        <div class="coming-soon-boxBM">Coming Soon</div>
        <div class="coming-soon-titleBM">Coming Soon</div>
        <div class="coming-soon-textBM">Coming Soon</div>
     </div>    
     
     <div class="coming-soon-card hiddenBM">
      <div class="coming-soon-boxBM">Coming Soon</div>
      <div class="coming-soon-titleBM">Coming Soon</div>
      <div class="coming-soon-textBM">Coming Soon</div>
      </div>  

      <div class="coming-soon-card hiddenBM">
        <div class="coming-soon-boxBM">Coming Soon</div>
        <div class="coming-soon-titleBM">Coming Soon</div>
        <div class="coming-soon-textBM">Coming Soon</div>
      </div>

      <div class="coming-soon-card hiddenBM">
        <div class="coming-soon-boxBM">Coming Soon</div>
        <div class="coming-soon-titleBM">Coming Soon</div>
        <div class="coming-soon-textBM">Coming Soon</div>
      </div>  
      
    </div>
  </div>

  

    
      
    <footer>
        <Footer1 />
      </footer>
    </>
  );
    
}
