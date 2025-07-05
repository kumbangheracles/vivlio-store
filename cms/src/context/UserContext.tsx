import { createContext, useState, useEffect, type ReactNode } from "react";
import { type UserProperties } from "../types/user.type";
import { useSessionManager } from "./UseSessionManager";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
type UserContextType = {
  user: UserProperties | undefined;
  setUser: (user: UserProperties | undefined) => void;
  isLoading?: boolean;
  setEmail?: (user: any | undefined) => void;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProperties | undefined>(undefined);
  const auth = useAuthUser<UserProperties>();

  const { ModalComponent } = useSessionManager(auth!, setUser);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
      {ModalComponent}
    </UserContext.Provider>
  );
};
