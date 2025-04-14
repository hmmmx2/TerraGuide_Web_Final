import Top from '../components/Top';
import Footer1 from '../components/Footer1';
import Slideshow from '../components/Slideshow'; // import the new component
import "../styles.css";

export default function Index() {
  return (
    <>
      <Top />
      <Slideshow />
      <p>hello world</p>
      <Footer1 />
    </>
  );
}

