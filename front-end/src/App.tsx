import { ConfigProvider } from "antd";
import "./App.css";
import AOS from "aos";
import "aos/dist/aos.css";
import RouteNavigation from "./navigation/RouteNavigation";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "react-auth-kit";
import createStore from "react-auth-kit/createStore";
import createRefresh from "react-auth-kit/createRefresh";
import myAxios from "./helper/myAxios";
import { UserProvider } from "./context/UserContext";
import { useEffect } from "react";

const refresh = createRefresh({
  interval: 10,
  refreshApiCallback: async ({ authToken }) => {
    try {
      const res = await myAxios.get<{ token: string }>("/auth/refresh", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      return {
        isSuccess: true,
        newAuthToken: res.data.token,
        newAuthTokenExpireIn: 10,
        newRefreshTokenExpiresIn: 60,
      };
    } catch (err) {
      console.error("Refresh failed", err);
      return {
        isSuccess: false,
        newAuthToken: "",
        newAuthTokenExpireIn: 0,
      };
    }
  },
});

function App() {
  useEffect(() => {
    AOS.init();
  }, []);
  const myStore = createStore({
    authName: "_auth",
    authType: "cookie",
    cookieDomain: window.location.hostname,
    cookieSecure: false,
    refresh: refresh,
  });
  return (
    <>
      <ConfigProvider>
        <AuthProvider store={myStore}>
          <BrowserRouter>
            <UserProvider>
              <RouteNavigation />
            </UserProvider>
          </BrowserRouter>
        </AuthProvider>
      </ConfigProvider>
    </>
  );
}

export default App;
