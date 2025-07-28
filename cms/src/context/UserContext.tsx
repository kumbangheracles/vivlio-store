import { createContext, useState, useEffect, type ReactNode } from "react";
import { type UserProperties } from "../types/user.type";
import { useSessionManager } from "./UseSessionManager";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import myAxios from "../helper/myAxios";
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

  useEffect(() => {
    const interceptor = myAxios.interceptors.request.use(
      (config) => {
        if (auth?.token) {
          config.headers.Authorization = `Bearer ${auth?.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      myAxios.interceptors.request.eject(interceptor);
    };
  }, []);
  const { ModalComponent } = useSessionManager(auth!, setUser);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
      {ModalComponent}
    </UserContext.Provider>
  );
};
