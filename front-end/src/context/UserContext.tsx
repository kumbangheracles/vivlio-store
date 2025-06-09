import { createContext, useState, type ReactNode } from "react";
import { initialUser, type UserProperties } from "../types/user.type";

type UserContextType = {
  user: UserProperties | undefined;
  setUser: (user: UserProperties | undefined) => void;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProperties | undefined>(initialUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// import { createContext, useState, useEffect, type ReactNode } from "react";
// import { initialUser, type UserProperties } from "../types/user.type";

// type UserContextType = {
//   user: UserProperties | undefined;
//   setUser: (user: UserProperties | undefined) => void;
// };

// export const UserContext = createContext<UserContextType | undefined>(
//   undefined
// );

// export const UserProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<UserProperties | undefined>(initialUser);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     console.log("User:", storedUser);
//     if (storedUser) {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (e) {
//         console.error("Failed to parse user from localStorage", e);
//         setUser(undefined);
//       }
//     }
//   }, []);

//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };
