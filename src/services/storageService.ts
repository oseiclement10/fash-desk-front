import type { AuthUser } from "@/@types/users";

export const getUserFromStorage = (): AuthUser | null => {
  const usr = localStorage.getItem("usr");
  if (usr) {
    return JSON.parse(usr);
  } else return null;
};

export const saveUserToStorage = (user: AuthUser) => {
  if (user) {
    localStorage.setItem("usr", JSON.stringify(user));
  }
};

export const getToken = () => {
  const user = getUserFromStorage();
  return user ? user.token : null;
};

export const savePagePosition = (identifier: string, position: string) => {
  sessionStorage.setItem(identifier, position);
}

export const getPagePosition = (identifier: string) => {
  const position = sessionStorage.getItem(identifier);
  return position;
}