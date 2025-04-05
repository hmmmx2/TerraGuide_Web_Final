import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Reg from "./Pages/Reg";
import  Signup from "./Pages/Signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Reg />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;