import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Bell,
  Settings,
  User,
  LogOut,
  ChevronDown,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AccountContext } from "../context/AccountContext";

const TopNav = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const dropdownRef = useRef(null);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const { notifications = [], account } = useContext(AccountContext);

  const hasUnread = notifications.some((n) => !n.read);
  const userName = account?.full_name || "Loading...";

  /* Hide nav on scroll down */
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setHidden(currentY > lastScrollY.current && currentY > 80);
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close dropdown on outside click */
  useEffect(() => {
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const dropdownVariants = {
    hidden: { opacity: 0, y: -8, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, y: -8, scale: 0.95, transition: { duration: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -6 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  const dropdownItems = [
    { icon: User, label: "My Profile", route: "/profile" },
    { icon: Settings, label: "Settings", route: "/settings" },
    { icon: HelpCircle, label: "Support", route: "/help-center" },
  ];

  return (
    <nav
      className={`
        fixed top-0 left-0 z-50 w-full
        lg:left-64 lg:w-[calc(100%-16rem)]
        transition-transform duration-300
        ${hidden ? "-translate-y-full" : "translate-y-0"}
        bg-gradient-to-r from-[#3B1D0A] via-[#4B2A12] to-[#2C1810]
        border-b border-yellow-700 backdrop-blur-md
        px-3 sm:px-6 py-2 sm:py-3
        flex items-center justify-between
        text-white shadow-md
      `}
    >
      {/* Search (hidden on very small screens) */}
      <div className="hidden sm:flex items-center bg-[#4B2A12] rounded-full px-3 py-1 border border-yellow-700 shadow-inner w-48 md:w-64">
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none text-sm text-yellow-100 placeholder-yellow-300 w-full"
        />
      </div>

      {/* Right actions */}
      <div
        className="flex items-center gap-3 sm:gap-4 relative"
        ref={dropdownRef}
      >
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => navigate("/notifications")}
            className="hover:text-yellow-400 transition"
          >
            <Bell size={18} className="sm:size-[20px]" />
          </button>

          {hasUnread && (
            <motion.span
              className="absolute -top-1 -right-1 bg-red-600 rounded-full w-2 h-2"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          )}
        </div>

        {/* Settings */}
        <button
          onClick={() => navigate("/settings")}
          className="hover:text-yellow-400 transition"
        >
          <Settings size={18} className="sm:size-[20px]" />
        </button>

        {/* User dropdown */}
        <div
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 bg-[#4B2A12] px-2 sm:px-3 py-1 rounded-full border border-yellow-700 hover:border-yellow-500 cursor-pointer transition"
        >
          <div className="w-6 h-6 rounded-full bg-yellow-600 flex items-center justify-center text-black">
            <User size={14} />
          </div>

          <span className="hidden sm:inline text-sm font-medium text-yellow-100 max-w-[120px] truncate">
            {userName}
          </span>

          <ChevronDown
            size={14}
            className={`transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* Dropdown menu */}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={dropdownVariants}
              className="absolute top-12 right-0 w-48 rounded-lg bg-[#2C1810] border border-yellow-800 shadow-lg py-2"
            >
              <motion.ul className="flex flex-col text-sm text-yellow-200">
                {dropdownItems.map((item, i) => (
                  <motion.li
                    key={i}
                    variants={itemVariants}
                    className="px-4 py-2 hover:bg-[#4B2A12] cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate(item.route);
                    }}
                  >
                    <item.icon size={16} className="text-yellow-500" />
                    {item.label}
                  </motion.li>
                ))}

                <motion.hr className="border-yellow-900 my-1" />

                <motion.li
                  variants={itemVariants}
                  onClick={() => navigate("/logout")}
                  className="px-4 py-2 hover:bg-[#4B2A12] cursor-pointer flex items-center gap-2 text-red-400"
                >
                  <LogOut size={16} /> Logout
                </motion.li>
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default TopNav;
