"use client";
import { createContext, useContext, useEffect, useState } from "react";
// firebase auth stuff
import { onAuthStateChanged } from "firebase/auth";

// firebase config
import { auth } from "../firebase/config";

// create context
const AuthContext = createContext();
// export a provider function
export function AuthProvider({ children }) {
  // use state to set the user variable
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // use effect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  return (
    <AuthContext.provider value={{ authUser, loading }}>
      {children}
    </AuthContext.provider>
  );
}

// export a hook that we can use in our components

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new error("use auth must be used within an auth provider");
  }
  return context;
};
