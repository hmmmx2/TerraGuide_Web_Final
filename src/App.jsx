import Firstheader from "./components/Firstheader";
import Footer1 from "./components/Footer1";
import Register from "./components/register";


function App() {
  return (
    <div>
      <header class="header">
        <Firstheader />
      </header>
      <Register></Register>
      <footer>
        <Footer1 />
      </footer>
    </div>
  );
}

export default App;
