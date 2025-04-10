import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Reg from "./Pages/Reg";
import  Signup from "./Pages/Signup";
import Blogmenu from "./Pages/blogmenu";
import Test from "./Pages/Test";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Reg />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/blogmenu" element={<Blogmenu/>} />
        <Route path="/test" element={<Test/>} />
      </Routes>
    </Router>
  );
}

export default App;