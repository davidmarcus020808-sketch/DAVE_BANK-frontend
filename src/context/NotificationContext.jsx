// src/context/NotificationContext.jsx
import React, { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      title: "Transaction Successful",
      message: "₦25,000 was transferred to John Doe.",
      time: "2 mins ago",
      read: false,
    },
    {
      id: 2,
      type: "warning",
      title: "Unusual Login Attempt",
      message: "A new login was detected from a new device in Lagos.",
      time: "10 mins ago",
      read: false,
    },
    {
      id: 3,
      type: "info",
      title: "Card Payment",
      message: "₦3,500 spent at SPAR Supermarket.",
      time: "1 hr ago",
      read: true,
    },
  ]);

  const markAllAsRead = () =>
    setNotifications(notifications.map((n) => ({ ...n, read: true })));

  const clearAll = () => setNotifications([]);

  return (
    <NotificationContext.Provider
      value={{ notifications, markAllAsRead, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
