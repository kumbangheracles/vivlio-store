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
