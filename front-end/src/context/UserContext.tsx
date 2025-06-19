import { createContext, useState, useEffect, type ReactNode } from "react";
import { type UserProperties } from "../types/user.type";
import myAxios from "../helper/myAxios";
import { useSessionManager } from "./UseSessionManager";
type UserContextType = {
  user: UserProperties | undefined;
  setUser: (user: UserProperties | undefined) => void;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProperties | undefined>(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await myAxios.get("/auth/me");
        setUser(res.data.data);
        console.log("User Confirmed: ", res.data.data);
      } catch {
        setUser(undefined);
      }
    };

    fetchUser();
  }, []);

  const { ModalComponent } = useSessionManager(user, setUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
      {ModalComponent}
    </UserContext.Provider>
  );
};
