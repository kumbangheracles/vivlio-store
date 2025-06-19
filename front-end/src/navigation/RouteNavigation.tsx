import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import ProtectedRoute from "../helper/protectedRoute";
import React, { Suspense } from "react";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import GlobalLoading from "../components/GlobalLoading";
import { EUserRole } from "../types/user.type";

const RouteNavigation = () => {
  const Home = React.lazy(() => import("../screens/Home"));
  const Unauthorized = React.lazy(() => import("../components/Unoutherized"));
  const NotFound = React.lazy(() => import("../components/NotFound"));
  const RegisterForm = React.lazy(() => import("../screens/auth/register"));
  const LoginForm = React.lazy(() => import("../screens/auth/login"));
  const Verification = React.lazy(
    () => import("../screens/auth/register/Verification")
  );
  return (
    <>
      <Suspense fallback={<GlobalLoading />}>
        <Routes>
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route
            path="/register/verification-code"
            element={<Verification />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute roles={[EUserRole.ADMIN, EUserRole.CUSTOMER]}>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Ini route wildcard untuk semua path yang tidak ditemukan */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default RouteNavigation;
