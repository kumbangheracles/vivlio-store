// import { Navigate } from "react-router-dom";
// import { useUser } from "@/context/UserContext";
// import { UserProvider } from "../context/UserContext";

// export const ProtectedRoute = ({
//   children,
//   roles,
// }: {
//   children: JSX.Element;
//   roles: ("ADMIN" | "CUSTOMER")[];
// }) => {
//   const { user } = UserProvider();

//   if (!user) return <Navigate to="/login" />;
//   if (!roles.includes(user.role)) return <Navigate to="/unauthorized" />;

//   return children;
// };

import React, { type ReactNode, useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import type { UserProperties } from "../types/user.type";

type ProtectedRouteProps = {
  children: ReactNode;
  roles: UserProperties["role"][]; // array of allowed roles
};

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const userContext = useContext(UserContext);

  if (!userContext) {
    // Context belum tersedia, redirect ke login
    return <Navigate to="/login" />;
  }
  const { user } = userContext;
  useEffect(() => {
    console.log("Current User: ", user);
  }, [user]);

  if (!user) {
    // Belum login, redirect ke login
    return <Navigate to="/login" />;
  }

  if (!roles.includes(user.role)) {
    // Role tidak diizinkan, redirect ke unauthorized page

    return <Navigate to="/unauthorized" />;
  }

  // User valid dan role cocok, render children
  return <>{children}</>;
};

export default ProtectedRoute;
