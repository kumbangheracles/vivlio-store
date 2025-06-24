import { createContext, useState, useEffect, type ReactNode } from "react";
import { type UserProperties } from "../types/user.type";
import { useSessionManager } from "./UseSessionManager";

type UserContextType = {
  user: UserProperties | undefined;
  setUser: (user: UserProperties | undefined) => void;
  isLoading?: boolean;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProperties | undefined>(undefined);

  const { ModalComponent } = useSessionManager(user, setUser);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
      {ModalComponent}
    </UserContext.Provider>
  );
};
