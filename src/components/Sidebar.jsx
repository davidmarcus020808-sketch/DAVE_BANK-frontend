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
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeItem, setActiveItem] = useState("Overview");
  const navigate = useNavigate();

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleActive = (name, path) => {
    setActiveItem(name);
    if (path) navigate(path);
    setMobileOpen?.(false); // close drawer on mobile
  };

  const sections = [
    {
      title: "Dashboard",
      items: [
        { name: "Overview", icon: BarChart3, path: "/overview" },
        { name: "Notifications", icon: Bell, path: "/notifications" },
      ],
    },
    {
      title: "Finance",
      items: [
        {
          name: "Transactions",
          icon: Wallet,
          dropdown: [
            { name: "Buy / Sell", path: "/buy-sell", icon: DollarSign },
            { name: "Payments", path: "/payments", icon: CreditCard },
            { name: "Income vs Expense", path: "/insights", icon: TrendingUp },
          ],
        },
        { name: "Rewards", icon: Gift, path: "/rewards" },
      ],
    },
    {
      title: "Support",
      items: [
        { name: "Live Chat", icon: MessageSquare, path: "/chat" },
        { name: "Help Center", icon: HelpCircle, path: "/help-center" },
      ],
    },
    {
      title: "Account",
      items: [
        { name: "Profile", icon: User, path: "/profile" },
        { name: "Security", icon: Shield, path: "/security" },
        { name: "Settings", icon: Settings, path: "/settings" },
      ],
    },
  ];

  const SidebarContent = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <h1 className="text-xl font-bold text-yellow-400 tracking-wide">
          DAVEBANK
        </h1>

        {/* Close button (mobile only) */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-yellow-300"
        >
          <X size={20} />
        </button>
      </div>

      {/* Menu */}
      <div className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="text-xs uppercase text-white/50 mb-2 px-2 font-semibold">
              {section.title}
            </p>

            {section.items.map((item) => {
              const isActive = activeItem === item.name;
              const Icon = item.icon;

              return (
                <div key={item.name}>
                  <div
                    onClick={() =>
                      item.dropdown
                        ? toggleDropdown(item.name)
                        : handleActive(item.name, item.path)
                    }
                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer
                      transition
                      ${
                        isActive
                          ? "bg-amber-800 text-yellow-300"
                          : "hover:bg-amber-900/60 text-white/90"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      <span className="text-sm font-medium">
                        {item.name}
                      </span>
                    </div>

                    {item.dropdown &&
                      (openDropdown === item.name ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      ))}
                  </div>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {openDropdown === item.name && item.dropdown && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="pl-7 mt-2 space-y-1 overflow-hidden"
                      >
                        {item.dropdown.map((sub) => {
                          const SubIcon = sub.icon;
                          return (
                            <div
                              key={sub.name}
                              onClick={() =>
                                handleActive(sub.name, sub.path)
                              }
                              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer
                                ${
                                  activeItem === sub.name
                                    ? "bg-amber-900 text-yellow-300"
                                    : "hover:bg-amber-900/70 text-white/90"
                                }
                              `}
                            >
                              <SubIcon size={15} />
                              {sub.name}
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Profile */}
      <div className="border-t border-white/10 bg-amber-900/50 p-4 flex items-center gap-3">
        <img
          src="https://i.pravatar.cc/100?img=12"
          alt="User"
          className="w-9 h-9 rounded-full border border-yellow-400"
        />
        <div>
          <p className="text-sm font-semibold text-yellow-200">
            David Marcus
          </p>
          <p className="text-xs text-yellow-100/70">Premium User</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-amber-950 text-white z-40">
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", stiffness: 220, damping: 30 }}
              className="fixed left-0 top-0 h-screen w-64 bg-amber-950 z-50"
            >
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
