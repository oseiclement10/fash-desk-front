import { createContext, useState, useEffect, type ReactNode, useContext } from "react";
import {
  getUserFromStorage,
  saveUserToStorage,
} from "@/services/storageService";
import type { AuthUser } from "@/@types/users";
import { postHelper } from "@/services/apiService";

type AuthContextProps = {
  addUser: (val: AuthUser) => void;
  updateUserInfo: (info: AuthUser) => void;
  removeUser: () => void;
  user: AuthUser | null;
};

export const AuthContext = createContext<AuthContextProps>({
  addUser: () => { },
  removeUser: () => { },
  updateUserInfo: () => { },
  user: null,
});

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(getUserFromStorage());

  const addUser = (user: AuthUser) => {
    setUser(user);
    saveUserToStorage(user);
  };

  const removeUser = () => {
    postHelper("logout", {});
    localStorage.removeItem("usr");
    window.location.href = "/login";
  };

  const updateUserInfo = (userInfo: AuthUser) => {
    setUser(userInfo)
  }

  useEffect(() => {
    saveUserToStorage(user as AuthUser);
  }, [user]);

  return (
    <AuthContext.Provider value={{ addUser, user, removeUser, updateUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within a AuthContextProvider");
  }

  return context;
}

export const useAuthUser = () => {
  const { user } = useAuthContext();
  return user?.user;
}



export const useIsAuthenticated = () => {
  const { user } = useContext(AuthContext);
  return !!user?.token;
};

export default AuthContextProvider;
