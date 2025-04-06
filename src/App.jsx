import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Reg from "./Pages/Reg";
import  Signup from "./Pages/Signup";
import Blogmenu from "./Pages/blogmenu";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Reg />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/blogmenu" element={<Blogmenu/>} />
      </Routes>
    </Router>
  );
}

export default App;