import react from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { SingleBR, TripleBR } from "./pages";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/single" element={<SingleBR />} />
        <Route path="/triple" element={<TripleBR />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;

function Home() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/single">Single Border Resize</Link>
        </li>
        <li>
          <Link to="/triple">Triple Border Resize</Link>
        </li>
      </ul>
    </nav>
  );
}
