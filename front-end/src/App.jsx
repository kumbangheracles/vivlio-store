import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./components/Home";
import Layout from "./components/Layout";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
