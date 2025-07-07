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
import GuestRoute from "../helper/GuestRoute";

const RouteNavigation = () => {
  const Unauthorized = React.lazy(() => import("../components/Unoutherized"));
  const NotFound = React.lazy(() => import("../components/NotFound"));
  const RegisterForm = React.lazy(() => import("../screens/auth/register"));
  const LoginForm = React.lazy(() => import("../screens/auth/login"));
  const Verification = React.lazy(
    () => import("../screens/auth/register/Verification")
  );
  // Dashboard
  const DashboardIndex = React.lazy(() => import("../screens/dashboard/index"));

  // Category
  const CategoryIndex = React.lazy(() => import("../screens/category/index"));
  return (
    <>
      <Suspense fallback={<GlobalLoading />}>
        <Routes>
          <Route
            path="/register"
            element={
              <GuestRoute>
                <RegisterForm />
              </GuestRoute>
            }
          />

          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginForm />
              </GuestRoute>
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route
            path="/register/verification-code"
            element={<Verification />}
          />

          <Route
            path="/"
            element={
              <ProtectedRoute roles={[EUserRole.ADMIN]}>
                <DashboardIndex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/category"
            element={
              <ProtectedRoute roles={[EUserRole.ADMIN]}>
                <CategoryIndex />
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
