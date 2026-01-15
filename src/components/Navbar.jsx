// import React, { useState } from "react";
// import { Menu, Bell } from "lucide-react";

// const Navbar = ({ onMenuToggle }) => {
//   const [open, setOpen] = useState(false);

//   const toggleMenu = () => {
//     setOpen(!open);
//     onMenuToggle && onMenuToggle();
//   };

//   return (
//     <header className="w-full bg-white shadow-sm border-b border-gray-100 h-16 flex items-center justify-between px-4 md:px-8 fixed top-0 left-0 z-40 md:ml-64">
//       {/* Mobile menu button */}
//       <button
//         className="md:hidden p-2 text-gray-600 hover:text-green-600"
//         onClick={toggleMenu}
//       >
//         <Menu size={22} />
//       </button>

//       <h2 className="font-semibold text-gray-700 text-lg">Transfer Funds</h2>

//       <div className="flex items-center gap-4">
//         <Bell className="text-gray-500 cursor-pointer hover:text-green-600" size={20} />
//         <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
//           D
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;
