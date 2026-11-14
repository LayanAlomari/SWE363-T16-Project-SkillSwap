import React, { createContext, useContext, useState } from "react";
import {
  initialUsers,
  initialCategories,
  adminChats,
  adminNotifications,
} from "../data/mockAdminData"; 
const Context = createContext(null);
export function AdminProvider({ children }) {
  const [users, setUsers] = useState(initialUsers);
  const [categories, setCategories] = useState(initialCategories);
  const [chats, setChats] = useState(adminChats);
  const [notifications, setNotifications] = useState(adminNotifications);
  const [settings, setSettings] = useState({
    welcomeCredits: 2,
    creditsPerHour: 1,
  });
  function updateUser(id, patch) {
    setUsers((prev) =>
      prev.map((u) => (u.id === Number(id) ? { ...u, ...patch } : u)),
    );
  }
  return (
    <Context.Provider
      value={{
        users,
        updateUser,
        categories,
        setCategories,
        chats,
        setChats,
        notifications,
        setNotifications,
        settings,
        setSettings,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useAdmin = () => useContext(Context);