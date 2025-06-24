import React, { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import GlobalLoading from "../components/GlobalLoading";
import { type UserProperties } from "../types/user.type";

type ProtectedRouteProps = {
  children: ReactNode;
  roles: UserProperties["role"][]; // array of allowed roles
};

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const isAuthenticated = useIsAuthenticated();
  const auth = useAuthUser<UserProperties>();

  console.log("User login: ", auth);
  // if (typeof isAuthenticated !== "boolean" || auth === null) {
  //   return <Navigate to="/login" replace />;
  // }

  if (!isAuthenticated || !auth) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(auth.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
