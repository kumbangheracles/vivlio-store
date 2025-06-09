import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import RegisterForm from "./screens/auth/register";
import "./App.css";
import Home from "./screens/Home";
import { UserProvider } from "./context/UserContext";
import Verification from "./screens/auth/register/Verification";
import NotFound from "./components/NotFound";
import AOS from "aos";
import "aos/dist/aos.css";
import LoginForm from "./screens/auth/login";
function App() {
  AOS.init();
  return (
    <>
      <ConfigProvider>
        <UserProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/login" element={<LoginForm />} />
              <Route
                path="/register/verification-code"
                element={<Verification />}
              />

              {/* Ini route wildcard untuk semua path yang tidak ditemukan */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </UserProvider>
      </ConfigProvider>
    </>
  );
}

export default App;
