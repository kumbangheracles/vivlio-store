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
import AppLayout from "../components/Layouts";

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
  const CategoryEdit = React.lazy(() => import("../screens/category/Edit"));
  const CategoryDetail = React.lazy(() => import("../screens/category/Detail"));
  const BookIndex = React.lazy(() => import("../screens/books/index"));
  const BookEdit = React.lazy(() => import("../screens/books/Edit"));
  const BookDetail = React.lazy(() => import("../screens/books/Detail"));
  const GenreIndex = React.lazy(() => import("../screens/genre/index"));
  const GenreEdit = React.lazy(() => import("../screens/genre/Edit"));
  const GenreDetail = React.lazy(() => import("../screens/genre/Detail"));
  const UserIndex = React.lazy(() => import("../screens/users/index"));
  const UserEdit = React.lazy(() => import("../screens/users/Edit"));
  const UserDetail = React.lazy(() => import("../screens/users/Detail"));
  const Articleindex = React.lazy(() => import("../screens/articles/index"));
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
              <ProtectedRoute roles={[EUserRole.ADMIN, EUserRole.SUPER_ADMIN]}>
                <AppLayout>
                  <DashboardIndex />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/category"
            element={
              <ProtectedRoute roles={[EUserRole.ADMIN, EUserRole.SUPER_ADMIN]}>
                <AppLayout>
                  <CategoryIndex />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/category/add"
            element={
              <ProtectedRoute roles={[EUserRole.ADMIN, EUserRole.SUPER_ADMIN]}>
                <AppLayout>
                  <CategoryEdit />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/category/:id/edit"
            element={
              <ProtectedRoute roles={[EUserRole.ADMIN, EUserRole.SUPER_ADMIN]}>
                <AppLayout>
                  <CategoryEdit />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/category/:id/detail"
            element={
              <ProtectedRoute roles={[EUserRole.ADMIN, EUserRole.SUPER_ADMIN]}>
                <AppLayout>
                  <CategoryDetail />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/book"
            element={
              <ProtectedRoute roles={[EUserRole.ADMIN, EUserRole.SUPER_ADMIN]}>
                <AppLayout>
                  <BookIndex />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/book/add"
            element={
              <ProtectedRoute roles={[EUserRole.ADMIN, EUserRole.SUPER_ADMIN]}>
                <AppLayout>
                  <BookEdit />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/book/:id/edit"
            element={
              <ProtectedRoute roles={[EUserRole.ADMIN, EUserRole.SUPER_ADMIN]}>
                <AppLayout>
                  <BookEdit />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/book/:id/detail"
            element={
              <ProtectedRoute roles={[EUserRole.ADMIN, EUserRole.SUPER_ADMIN]}>
                <AppLayout>
                  <BookDetail />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/genre"
            element={
              <ProtectedRoute roles={[EUserRole.ADMIN, EUserRole.SUPER_ADMIN]}>
                <AppLayout>
                  <GenreIndex />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/genre/add"
            element={
              <ProtectedRoute roles={[EUserRole.ADMIN, EUserRole.SUPER_ADMIN]}>
                <AppLayout>
                  <GenreEdit />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/genre/:id/edit"
            element={
              <ProtectedRoute roles={[EUserRole.ADMIN, EUserRole.SUPER_ADMIN]}>
                <AppLayout>
                  <GenreEdit />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/genre/:id/detail"
            element={
              <ProtectedRoute roles={[EUserRole.ADMIN, EUserRole.SUPER_ADMIN]}>
                <AppLayout>
                  <GenreDetail />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user"
            element={
              <ProtectedRoute roles={[EUserRole.ADMIN, EUserRole.SUPER_ADMIN]}>
                <AppLayout>
                  <UserIndex />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/add"
            element={
              <ProtectedRoute roles={[EUserRole.ADMIN, EUserRole.SUPER_ADMIN]}>
                <AppLayout>
                  <UserEdit />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/:id/edit"
            element={
              <ProtectedRoute roles={[EUserRole.ADMIN, EUserRole.SUPER_ADMIN]}>
                <AppLayout>
                  <UserEdit />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/:id/detail"
            element={
              <ProtectedRoute roles={[EUserRole.ADMIN, EUserRole.SUPER_ADMIN]}>
                <AppLayout>
                  <UserDetail />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/article"
            element={
              <ProtectedRoute roles={[EUserRole.ADMIN, EUserRole.SUPER_ADMIN]}>
                <AppLayout>
                  <Articleindex />
                </AppLayout>
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
