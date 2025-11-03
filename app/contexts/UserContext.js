"use client";

import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [localUser, setLocalUser] = useState({
    name: "Herbert",
    loggedIn: false,
  });
  const toggleLocalUserLogin = () => {
    setLocalUser((prev) => ({ ...prev, loggedIn: !prev.loggedIn }));
  };
  return (
    <UserContext.Provider value={{ localUser, toggleLocalUserLogin }}>
      {children}
    </UserContext.Provider>
  );
}
export const useUser = () => useContext(UserContext);
