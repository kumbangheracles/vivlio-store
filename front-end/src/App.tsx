import { ConfigProvider } from "antd";
import "./App.css";
import { UserProvider } from "./context/UserContext";
import AOS from "aos";
import "aos/dist/aos.css";
import RouteNavigation from "./navigation/RouteNavigation";
import { BrowserRouter } from "react-router-dom";
// import AuthProvider from "react-auth-kit";
// import createStore from "react-auth-kit/createStore";

function App() {
  AOS.init();
  // const myStore = createStore({
  //   authName: "_auth",
  //   authType: "cookie",
  //   cookieDomain: window.location.hostname,
  //   cookieSecure: false,
  // });
  return (
    <>
      <ConfigProvider>
        {/* <AuthProvider store={myStore}> */}
        <BrowserRouter>
          <UserProvider>
            <RouteNavigation />
          </UserProvider>
        </BrowserRouter>
        {/* </AuthProvider> */}
      </ConfigProvider>
    </>
  );
}

export default App;
