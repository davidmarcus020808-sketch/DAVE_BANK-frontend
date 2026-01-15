// import React from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Home, Send, Phone, FileText, User } from "lucide-react";

// const FooterNav = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const navItems = [
//     { id: "home", icon: Home, label: "Home", path: "/dashboard" },
//     { id: "transfer", icon: Send, label: "Transfer", path: "/transfer" },
//     { id: "airtime", icon: Phone, label: "Airtime", path: "/airtime" },
//     { id: "bills", icon: FileText, label: "Bills", path: "/bills" },
//     { id: "account", icon: User, label: "Account", path: "/accountdetails" },
//   ];

//   return (
//     <nav className="flex justify-between items-center w-full px-2 sm:px-6 py-3 bg-white text-gray-600">
//       {navItems.map((item) => {
//         const active = location.pathname === item.path;
//         const Icon = item.icon;
//         return (
//           <button
//             key={item.id}
//             onClick={() => navigate(item.path)}
//             className={`flex flex-col items-center justify-center flex-1 ${
//               active ? "text-green-600 font-semibold" : "hover:text-green-500"
//             }`}
//           >
//             <Icon size={22} />
//             <span className="text-[11px] sm:text-xs mt-1">{item.label}</span>
//           </button>
//         );
//       })}
//     </nav>
//   );
// };

// export default FooterNav;
