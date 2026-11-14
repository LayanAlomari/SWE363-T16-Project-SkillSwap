import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(0);

  const isLoggedIn = user !== null;

  const register = (name, email, password) => {
    const newUser = {
      name,
      email,
      password,
    };

    setUser(newUser);
    setCredits(2);
  };

  const login = (email, password) => {
    setUser({
      name: "Fatimah",
      email,
    });

    setCredits(2);
  };

  const logout = () => {
    setUser(null);
    setCredits(0);
  };

  const spendCredit = () => {
    if (credits > 0) {
      setCredits((currentCredits) => currentCredits - 1);
      return true;
    }

    return false;
  };

  return (
    <UserContext.Provider
      value={{
        user,
        credits,
        isLoggedIn,
        register,
        login,
        logout,
        spendCredit,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}