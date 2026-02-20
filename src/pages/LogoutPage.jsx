import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import {
  LogOut,
  LogIn,
  Smartphone,
  Clock,
  Users,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import { AccountContext } from "../context/AccountContext";
import { useToast } from "../context/ToastContext";

const mockDevices = [
  {
    id: 1,
    label: "This device — Chrome on Windows",
    lastActive: "Now",
    current: true,
    icon: <LogIn size={18} className="text-yellow-400" />,
  },
  {
    id: 2,
    label: "iPhone 13 — Safari",
    lastActive: "Oct 30, 2025 — 14:08",
    current: false,
    icon: <Smartphone size={18} className="text-yellow-300" />,
  },
  {
    id: 3,
    label: "Work Laptop — Edge",
    lastActive: "Oct 28, 2025 — 09:22",
    current: false,
    icon: <Users size={18} className="text-yellow-300" />,
  },
];

const LogoutPage = () => {
  const { setAccount } = useContext(AccountContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLogoutAllModal, setShowLogoutAllModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleLogout = async ({ global = false } = {}) => {
    setProcessing(true);
    try {
      await new Promise((res) => setTimeout(res, 900));

      // Clear local storage
      localStorage.removeItem("account");
      localStorage.removeItem("transactions");
      localStorage.removeItem("notificationSettings");

      // Reset account context
      setAccount && setAccount({ name: "", balance: 0 });

      // Show success toast
      showToast(
        "success",
        global
          ? "Signed out from all devices"
          : "Successfully logged out from this device"
      );

      // Close modals
      setShowLogoutModal(false);
      setShowLogoutAllModal(false);

      // Redirect to login
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
      showToast("error", "Unable to logout. Try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
  <motion.div
  className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-black text-yellow-50 p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col"
  initial={{ opacity: 0, y: 6 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.45 }}
>
  {/* Header */}
  <header className="max-w-5xl mx-auto w-full mb-6 sm:mb-8 lg:mb-10">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-yellow-300">
          Logout
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-yellow-200/70 mt-1">
          End your session or sign out from all devices for extra security.
        </p>
      </div>
    </div>
  </header>

  {/* Main Content */}
  <main className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 flex-1">
    {/* Left Section: Profile & Actions */}
    <section className="col-span-1 bg-white/5 backdrop-blur-lg border border-yellow-700/20 rounded-2xl p-4 sm:p-6 md:p-6 flex flex-col gap-3 sm:gap-4 shadow-[0_0_20px_rgba(255,215,0,0.04)]">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-yellow-600 flex items-center justify-center text-black text-lg sm:text-xl font-bold">
          DM
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-yellow-300">
            David Marcus
          </h2>
          <p className="text-xs sm:text-sm text-yellow-200/70">
            david.marcus@example.com
          </p>
        </div>
      </div>

      <div className="mt-2 sm:mt-3">
        <p className="text-xs text-yellow-200/70">Current session</p>
        <div className="mt-1 sm:mt-2 flex items-center gap-2 sm:gap-3">
          <LogIn size={20} className="text-yellow-400" />
          <div>
            <p className="text-sm sm:text-base text-yellow-100 font-medium">
              Chrome • Windows
            </p>
            <p className="text-xs sm:text-sm text-yellow-200/70">
              Active now • Lagos, NG
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 sm:mt-4 border-t border-yellow-700/20 pt-3 sm:pt-4">
        <p className="text-xs sm:text-sm text-yellow-200/70 mb-1 sm:mb-2">Security tip</p>
        <p className="text-sm sm:text-base text-yellow-200/60 leading-relaxed">
          If you suspect unauthorized access, sign out from all devices and
          change your password immediately.
        </p>
      </div>

      {/* Logout Buttons */}
      <div className="mt-auto flex flex-col gap-2 sm:gap-3">
        <button
          onClick={() => !processing && setShowLogoutModal(true)}
          disabled={processing}
          className={`w-full py-2 sm:py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
            processing
              ? "bg-yellow-700/60 cursor-not-allowed"
              : "bg-yellow-400 text-black hover:bg-yellow-300"
          }`}
        >
          <LogOut size={16} /> Logout
        </button>

        <button
          onClick={() => !processing && setShowLogoutAllModal(true)}
          disabled={processing}
          className={`w-full py-2 sm:py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
            processing
              ? "bg-red-700/50 cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-red-500"
          }`}
        >
          Sign out from all devices
        </button>
      </div>
    </section>

    {/* Right Section: Devices & Activity */}
    <section className="lg:col-span-2 flex flex-col gap-4 sm:gap-6">
      {/* Active Devices */}
      <div className="bg-white/5 backdrop-blur-lg border border-yellow-700/20 rounded-2xl p-4 sm:p-6 shadow-sm">
        <h3 className="text-base sm:text-lg font-semibold text-yellow-300 mb-2 sm:mb-3">
          Active devices
        </h3>
        <p className="text-xs sm:text-sm text-yellow-200/70 mb-3 sm:mb-4">
          Devices with active sessions for this account
        </p>

        <ul className="space-y-2 sm:space-y-3">
          {mockDevices.map((d) => (
            <li
              key={d.id}
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 rounded-xl transition ${
                d.current
                  ? "bg-yellow-950/20 border border-yellow-700/40 shadow-[0_0_20px_rgba(255,215,0,0.06)]"
                  : "bg-white/3 border border-yellow-800/10"
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-900/20 flex items-center justify-center">
                  {d.icon}
                </div>
                <div>
                  <p className="text-sm sm:text-base font-medium text-yellow-100">
                    {d.label}
                  </p>
                  <p className="text-xs sm:text-sm text-yellow-200/70">
                    {d.lastActive}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
                {d.current ? (
                  <span className="text-xs sm:text-sm bg-yellow-400 text-black px-2 py-1 rounded-full font-semibold">
                    Current
                  </span>
                ) : (
                  <button
                    className="text-xs sm:text-sm text-yellow-300/90 hover:text-yellow-200 transition px-2 py-1 sm:px-3 sm:py-1 rounded-md border border-yellow-800/20"
                    onClick={() =>
                      showToast("success", `Signed out of ${d.label}`)
                    }
                  >
                    Sign out
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 backdrop-blur-lg border border-yellow-700/20 rounded-2xl p-4 sm:p-6 shadow-sm">
        <h3 className="text-base sm:text-lg font-semibold text-yellow-300 mb-2 sm:mb-3">
          Recent activity
        </h3>
        <p className="text-xs sm:text-sm text-yellow-200/70 mb-3 sm:mb-4">
          Check recent logins and security events
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          <div className="p-3 sm:p-4 rounded-xl border border-yellow-800/10 bg-yellow-900/10">
            <div className="flex items-center gap-2 sm:gap-3">
              <Clock size={18} className="text-yellow-300" />
              <div>
                <p className="text-sm sm:text-base text-yellow-100 font-medium">Login</p>
                <p className="text-xs sm:text-sm text-yellow-200/70">
                  Nov 5, 2025 — 08:42 • Lagos, NG
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl border border-yellow-800/10 bg-yellow-900/10">
            <div className="flex items-center gap-2 sm:gap-3">
              <ShieldCheck size={18} className="text-yellow-300" />
              <div>
                <p className="text-sm sm:text-base text-yellow-100 font-medium">
                  Password change
                </p>
                <p className="text-xs sm:text-sm text-yellow-200/70">
                  Oct 10, 2025 — 12:12 • Via Web
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="text-xs sm:text-sm text-yellow-200/70 mt-2 sm:mt-4">
        Need help? Visit{" "}
        <a
          href="/support"
          className="text-yellow-300 hover:underline font-medium"
        >
          Support
        </a>{" "}
        or contact us at <span className="font-medium">support@davebank.com</span>.
      </div>
    </section>
  </main>
      {/* Confirmation Modals with spinner */}
      <ConfirmModal
        show={showLogoutModal}
        title="Logout of this device?"
        message="You will end your current session on this device. Any unsaved activity may be lost."
        onConfirm={() => handleLogout({ global: false })}
        onClose={() => setShowLogoutModal(false)}
        processing={processing}
      />

      <ConfirmModal
        show={showLogoutAllModal}
        title="Sign out from all devices?"
        message="This will sign you out from every device and end all active sessions. You will need to log in again on other devices."
        onConfirm={() => handleLogout({ global: true })}
        onClose={() => setShowLogoutAllModal(false)}
        processing={processing}
      />
    </motion.div>
  );
};

export default LogoutPage;
