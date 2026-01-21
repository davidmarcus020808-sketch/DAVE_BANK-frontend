import React, { useState } from "react";
import {
  Bell,
  MessageSquare,
  TrendingUp,
  Gift,
  User,
  DollarSign,
  ChevronDown,
  ChevronRight,
  Settings,
  HelpCircle,
  Shield,
  CreditCard,
  BarChart3,
  Wallet,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // ✅ navigation hook

const Sidebar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeItem, setActiveItem] = useState("Overview");
  const navigate = useNavigate(); // ✅ initialize router navigation

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleActive = (name) => {
    setActiveItem(name);
  };

  const sections = [
    {
      title: "Dashboard",
      items: [
        { name: "Overview", icon: <BarChart3 size={18} />, path: "/overview" },
        { name: "Notifications", icon: <Bell size={18} />, path: "/notifications" },
      ],
    },
    {
      title: "Finance",
      items: [
        {
          name: "Transactions",
          icon: <Wallet size={18} />,
          dropdown: [
            { name: "Buy / Sell", path: "/buy-sell", icon: <DollarSign size={16} /> },
            { name: "Payments", path: "/payments", icon: <CreditCard size={16} /> },
            { name: "Income vs Expense", path: "/insights", icon: <TrendingUp size={16} /> },
          ],
        },
        { name: "Rewards", icon: <Gift size={18} />, path: "/rewards" },
      ],
    },
    {
      title: "Support",
      items: [
        { name: "Live Chat", icon: <MessageSquare size={18} />, path: "/chat" },
        { name: "Help Center", icon: <HelpCircle size={18} />, path: "/help-center" },
      ],
    },
    {
      title: "Account",
      items: [
        { name: "Profile", icon: <User size={18} />, path: "/profile" },
        { name: "Security", icon: <Shield size={18} />, path: "/security" },
        { name: "Settings", icon: <Settings size={18} />, path: "/settings" },
      ],
    },
  ];

  const renderSidebarItem = (item) => {
    const isActive = activeItem === item.name;

    const clickHandler = () => {
      if (item.dropdown) {
        toggleDropdown(item.name);
      } else {
        handleActive(item.name);
        if (item.path) navigate(item.path); // ✅ navigate to route
      }
    };

    const keyHandler = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        clickHandler();
      }
    };

    return (
      <div key={item.name}>
        <div
          onClick={clickHandler}
          onKeyDown={keyHandler}
          tabIndex={0}
          role="button"
          className={`
            flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors duration-200 
            ${isActive
              ? "bg-amber-800 text-yellow-300 shadow-inner"
              : "hover:bg-amber-900/50 text-white/90"}
          `}
        >
          <div className="flex items-center gap-3">
            {item.icon}
            <span className="font-medium text-sm tracking-wide">{item.name}</span>
          </div>

          {item.dropdown && (
            openDropdown === item.name ? (
              <ChevronDown size={16} className={isActive ? "text-yellow-300" : "text-white/70"} />
            ) : (
              <ChevronRight size={16} className={isActive ? "text-yellow-300" : "text-white/70"} />
            )
          )}
        </div>

        {/* Dropdown animation */}
        <AnimatePresence>
          {openDropdown === item.name && item.dropdown && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="pl-8 mt-2 space-y-2 overflow-hidden"
            >
              {item.dropdown.map((sub) => (
                <div
                  key={sub.name}
                  onClick={() => {
                    handleActive(sub.name);
                    navigate(sub.path); // ✅ navigate sub routes too
                  }}
                  onKeyDown={keyHandler}
                  tabIndex={0}
                  role="button"
                  className={`
                    flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors duration-150 
                    ${activeItem === sub.name
                      ? "bg-amber-900 text-yellow-300"
                      : "hover:bg-amber-900/70 text-white/90"}
                  `}
                >
                  {sub.icon}
                  <span className="text-sm">{sub.name}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ x: -260 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 25 }}
      className="w-64 h-screen bg-amber-950 text-white shadow-xl flex flex-col justify-between fixed left-0 top-0 z-50 overflow-y-auto custom-scrollbar"
    >
      {/* Header */}
      <div className="flex items-center justify-center p-5 border-b border-white/10">
        <h1 className="text-2xl font-bold tracking-wider text-yellow-400">DAVEBANK</h1>
      </div>

      {/* Menu Sections */}
      <div className="flex flex-col mt-4 px-3 space-y-4 flex-grow">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-xs uppercase text-white/50 mb-2 px-3 font-semibold tracking-wide">
              {section.title}
            </h2>
            {section.items.map(renderSidebarItem)}
          </div>
        ))}
      </div>

      {/* Bottom Profile Section */}
      <div className="border-t border-white/10 bg-amber-900/50 p-4 flex items-center gap-3">
        <img
          src="https://i.pravatar.cc/100?img=12"
          alt="User"
          className="w-10 h-10 rounded-full border-2 border-yellow-400"
        />
        <div>
          <p className="font-semibold text-sm text-yellow-200">David Marcus</p>
          <p className="text-xs text-yellow-100/70">Premium User</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;      