import React, { useState, useEffect, useRef, useContext } from "react";
import { Bell, Settings, User, LogOut, ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AccountContext } from "../context/AccountContext";

const TopNav = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const dropdownRef = useRef(null);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const { notifications, account } = useContext(AccountContext);

  const hasUnread = notifications.some((n) => !n.read);
  const userName = account?.full_name || "Loading...";

  // Auto-hide nav on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setHidden(scrollY > lastScrollY.current && scrollY > 80);
      lastScrollY.current = scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
      className={`fixed top-0 left-64 z-50 w-[calc(100%-16rem)] transition-transform duration-300
      ${hidden ? "-translate-y-full" : "translate-y-0"}
      bg-gradient-to-r from-[#3B1D0A] via-[#4B2A12] to-[#2C1810]
      text-white shadow-md flex justify-between items-center px-6 py-3
      border-b border-yellow-700 backdrop-blur-md`}
    >
      {/* Search Box */}
      <div className="flex items-center bg-[#4B2A12] rounded-full px-3 py-1 border border-yellow-700 shadow-inner w-48 md:w-64">
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none text-sm text-yellow-100 placeholder-yellow-300 w-full"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 md:gap-4 relative" ref={dropdownRef}>
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => navigate("/notifications")}
            className="hover:text-yellow-400 transition relative"
          >
            <Bell size={20} />
          </button>

          {hasUnread && (
            <motion.span
              className="absolute -top-1 -right-1 bg-red-600 rounded-full w-2 h-2"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
          )}
        </div>

        {/* Settings Icon */}
{/* Settings Icon */}
<button
  onClick={() => navigate("/settings")}
  className="hover:text-yellow-400 transition"
>
  <Settings size={20} />
</button>


        {/* User Dropdown Button */}
        <div
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 bg-[#4B2A12] px-3 py-1 rounded-full border border-yellow-700 hover:border-yellow-500 cursor-pointer transition"
        >
          <div className="w-6 h-6 rounded-full bg-yellow-600 flex items-center justify-center text-black">
            <User size={14} />
          </div>
          <span className="text-sm font-medium text-yellow-100">{userName}</span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
          />
        </div>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={dropdownVariants}
              className="absolute top-12 right-0 bg-[#2C1810] border border-yellow-800 rounded-lg shadow-lg py-2 w-48"
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
                    <item.icon size={16} className="text-yellow-500" /> {item.label}
                  </motion.li>
                ))}

                <motion.hr variants={itemVariants} className="border-yellow-900 my-1" />

                <motion.li
                  variants={itemVariants}
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate("/logout");
                  }}
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
