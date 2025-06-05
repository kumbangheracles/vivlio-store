import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import RegisterForm from "./screens/auth/register";
import "./App.css";
import Home from "./screens/Home";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ConfigProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegisterForm />} />
          </Routes>
        </Router>
      </ConfigProvider>
    </>
  );
}

export default App;
