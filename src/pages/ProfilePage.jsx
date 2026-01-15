// src/pages/ProfilePage.jsx
import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AccountContext } from "../context/AccountContext";
import CustomToast from "../components/CustomToast";
import toast, { Toaster } from "react-hot-toast";
import { User, Shield, Wallet, Edit3, Save, Camera } from "lucide-react";
import Footer from "../components/Footer";
import ConfirmModal from "../components/ConfirmModal";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const ProfilePage = () => {
  const { account, updateAccount } = useContext(AccountContext);

  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
  });

  // Sync formData when account changes
  useEffect(() => {
    if (account) {
      setFormData({
        full_name: account.full_name || "",
        email: account.email || "",
        phone: account.phone || "",
      });
    }
  }, [account]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Upload profile picture
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      await updateAccount({ profilePic: file }, true); // context handles upload
      toast.custom(<CustomToast type="success" message="Profile picture updated!" />, { duration: 2500 });
    } catch {
      toast.custom(<CustomToast type="error" message="Failed to upload profile picture" />, { duration: 2500 });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveClick = () => setShowConfirmModal(true);

  const handleConfirmSave = async () => {
    setIsProcessing(true);
    try {
      await updateAccount(formData); // update account info via context
      setIsEditing(false);
      setShowConfirmModal(false);
      toast.custom(<CustomToast type="success" message="Profile updated successfully!" />, { duration: 2500 });
    } catch {
      toast.custom(<CustomToast type="error" message="Failed to update profile!" />, { duration: 2500 });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen flex items-center justify-center text-yellow-400 bg-black">
        Loading profile...
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col bg-black text-yellow-400 font-[Inter]"
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.2 }}
    >
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex-1 px-8 py-10 space-y-10">
        {/* Header */}
        <motion.div variants={fadeInUp}>
          <h1 className="text-3xl font-bold text-yellow-300 mb-2">My Profile</h1>
          <p className="text-yellow-200/70 text-sm">
            Manage your personal details and account preferences.
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          variants={fadeInUp}
          className="relative bg-gradient-to-br from-[#1a1a1a] to-[#2a1a00] border border-yellow-700/30 rounded-2xl pt-16 pb-8 px-8 shadow-[0_0_15px_rgba(255,215,0,0.15)] max-w-3xl mx-auto"
        >
          {/* Avatar */}
          <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">
            <div className="relative group">
              <img
                src={account.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${account.full_name || "user"}`}
                alt="avatar"
                className="w-28 h-28 rounded-full border-4 border-yellow-500 shadow-lg bg-black object-cover"
              />
              {isEditing && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isProcessing}
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                    <Camera size={20} className="text-yellow-300" />
                  </div>
                </>
              )}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="absolute bottom-1 right-1 bg-yellow-400 text-black p-1 rounded-full hover:bg-yellow-300 transition disabled:opacity-50"
                disabled={isProcessing}
              >
                {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col items-center mt-8 space-y-4 w-full">
            {["full_name", "email", "phone"].map((field) => (
              <div key={field} className="w-full">
                <label className="block text-sm text-yellow-200/70 text-center sm:text-left">
                  {field === "full_name"
                    ? "Full Name"
                    : field === "email"
                    ? "Email"
                    : "Phone Number"}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={formData[field]}
                  disabled={!isEditing || isProcessing}
                  onChange={handleChange}
                  className={`w-full bg-transparent border-b border-yellow-600 text-yellow-300 py-1 outline-none text-center sm:text-left transition ${
                    isEditing ? "border-yellow-400" : "border-yellow-800"
                  }`}
                />
              </div>
            ))}

            {isEditing && (
              <button
                onClick={handleSaveClick}
                className="mt-6 px-5 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg shadow-md transition disabled:opacity-50"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Save Changes"}
              </button>
            )}
          </div>
        </motion.div>

        {/* Account Stats */}
        <motion.div
          variants={fadeInUp}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {[
            {
              title: "Account Balance",
              value: `₦${account.balance?.toLocaleString() || 0}`,
              icon: <Wallet size={24} />,
            },
            { title: "Security Level", value: "High", icon: <Shield size={24} /> },
            {
              title: "Member Since",
              value: new Date(account.date_joined).toLocaleDateString(),
              icon: <User size={24} />,
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="bg-gradient-to-br from-yellow-800/20 to-yellow-900/10 border border-yellow-700/20 rounded-xl p-5 flex flex-col items-center justify-center shadow-[0_0_10px_rgba(255,215,0,0.1)] cursor-default"
            >
              <div className="text-yellow-400 mb-2">{stat.icon}</div>
              <p className="text-yellow-200/70 text-sm">{stat.title}</p>
              <p className="font-semibold text-yellow-300 mt-1">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <Footer />

      {/* Confirm Modal */}
      <ConfirmModal
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSave}
        title="Confirm Changes"
        message="Are you sure you want to save your updated profile information?"
        processing={isProcessing}
      />
    </motion.div>
  );
};

export default ProfilePage;
