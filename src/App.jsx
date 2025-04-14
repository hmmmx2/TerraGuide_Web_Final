import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Reg from "./Pages/Reg";
import  Signup from "./Pages/Signup";
import Blogmenu from "./Pages/blogmenu";
import Test from "./Pages/Test";
import Blogs2 from "./Pages/blogs2";
import Template from "./Pages/Template";
import Index from "./Pages/index";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Reg />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/blogmenu" element={<Blogmenu/>} />
        <Route path="/test" element={<Test/>} />
        <Route path="/blogs2" element={<Blogs2/>} />
        <Route path="/template" element={<Template/>} />
        <Route path="/index" element={<Index/>} />
      </Routes>
    </Router>
  );
}

export default App;