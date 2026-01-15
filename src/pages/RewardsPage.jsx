// src/pages/RewardsPage.jsx
import React, { useContext, useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  Star,
  Crown,
  Wallet,
  UserCheck,
  BarChart2,
  Trophy,
} from "lucide-react";
import Footer from "../components/Footer";
import { AccountContext } from "../context/AccountContext";
import ConfirmationModal from "../components/ConfirmationModal";
import { Tooltip } from "react-tooltip"; // optional

const POINTS_PER_TRANSACTION = 100;
const NAIRA_PER_100_POINTS = 20;

const baseRewards = [
  {
    title: "Referral Bonus",
    description: "Invite friends and earn ₦500 when they sign up and make their first transaction.",
    points: 500,
    icon: <Gift size={28} className="text-yellow-400" />,
    color: "from-amber-900 to-amber-800",
  },
  {
    title: "Loyalty Milestone",
    description: "Consistent savings for 3 months unlock exclusive cashback rewards.",
    points: 1200,
    icon: <Crown size={28} className="text-yellow-300" />,
    color: "from-yellow-800 to-amber-700",
  },
  {
    title: "Transaction Streak",
    description: "Earn bonus points for completing 20+ transactions in a month.",
    points: 800,
    icon: <Star size={28} className="text-yellow-500" />,
    color: "from-amber-800 to-yellow-700",
  },
];

const RewardsPage = () => {
  const { account, transactions, addTransaction } = useContext(AccountContext);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [recentPoints, setRecentPoints] = useState(0);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);

  // Compute total points, stats & tier
  const { totalPoints, referrals, milestones, transactionCount, tier } = useMemo(() => {
    const rewardTx = transactions.filter(tx => tx.points && tx.type !== "Reward Redemption");
    const referralTx = transactions.filter(tx => tx.type === "Referral Bonus").length;
    const milestoneTx = transactions.filter(tx => tx.type === "Milestone").length;

    const transactionCount = transactions.length;
    const totalPoints =
      rewardTx.reduce((acc, tx) => acc + (tx.points || POINTS_PER_TRANSACTION), 0) +
      referralTx * 500 +
      milestoneTx * 1200;

    let tier = "Bronze";
    if (totalPoints >= 5000) tier = "Platinum";
    else if (totalPoints >= 2500) tier = "Gold";
    else if (totalPoints >= 1000) tier = "Silver";

    return { totalPoints, referrals: referralTx, milestones: milestoneTx, transactionCount, tier };
  }, [transactions]);

  const progress = Math.min((totalPoints / 5000) * 100, 100).toFixed(0);

  // Animate +points earned
  useEffect(() => {
    if (transactions.length === 0) return;
    const lastTx = transactions[0];
    if (lastTx.points && lastTx.type !== "Reward Redemption") {
      setRecentPoints(lastTx.points);
      const timer = setTimeout(() => setRecentPoints(0), 2000);
      return () => clearTimeout(timer);
    }
  }, [transactions]);

  const handleOpenModal = (reward) => {
    setSelectedReward(reward);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedReward(null);
  };

  const handleRedeemConfirm = (points, cash) => {
    addTransaction({
      type: "Reward Redemption",
      amount: cash,
      pointsDeducted: points,
      description: `Redeemed ${points} points for ₦${cash}`,
    });
    handleCloseModal();
  };

  // ----------------- Bulk Claim -----------------
  const availableRewards = baseRewards.filter(r => totalPoints >= r.points);
  const totalBulkPoints = availableRewards.reduce((sum, r) => sum + r.points, 0);
  const totalBulkCash = Math.floor(totalBulkPoints / 100 * NAIRA_PER_100_POINTS);

  const handleBulkRedeem = () => {
    if (availableRewards.length === 0) return;
    setBulkModalOpen(true);
  };

  const handleBulkConfirm = () => {
    addTransaction({
      type: "Reward Redemption",
      amount: totalBulkCash,
      pointsDeducted: totalBulkPoints,
      description: `Redeemed ${totalBulkPoints} points for ₦${totalBulkCash} (Bulk Rewards)`,
    });
    setBulkModalOpen(false);
  };

  const stats = [
    { icon: <UserCheck size={24} className="text-yellow-400" />, label: "Referrals", value: referrals },
    { icon: <Trophy size={24} className="text-yellow-300" />, label: "Milestones", value: milestones },
    { icon: <BarChart2 size={24} className="text-yellow-500" />, label: "Transactions", value: transactionCount },
  ];

  const sortedRewards = [...baseRewards].sort((a, b) => b.points - a.points);

  return (
    <div className="min-h-screen flex flex-col bg-amber-950 text-white p-6 md:p-12 space-y-12">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <h1 className="text-4xl font-bold text-yellow-400 flex items-center gap-3">
          <Gift size={32} /> Rewards & Loyalty
        </h1>
        <AnimatePresence>
          {recentPoints > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: -20 }}
              exit={{ opacity: 0, y: -30 }}
              className="absolute top-24 right-12 text-green-400 font-bold text-xl"
            >
              +{recentPoints} Points!
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Dashboard Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-yellow-900 to-amber-800 rounded-3xl p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div className="flex flex-col gap-3">
          <h2 className="text-xl md:text-2xl font-semibold text-yellow-300">Total Reward Points</h2>
          <p className="text-5xl md:text-6xl font-extrabold text-yellow-400">{totalPoints.toLocaleString()}</p>
          <p className="text-sm md:text-base text-yellow-100/70 mt-1">
            Current Tier: <span className="font-semibold">{tier}</span>
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 md:ml-12 w-full md:w-auto">
          <p className="text-sm text-yellow-100/70 mb-1">Progress to Platinum Tier</p>
          <div className="w-full bg-yellow-900/40 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2 }}
              className="bg-yellow-400 h-4 rounded-full"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-6 mt-4 md:mt-0">
          {stats.map(stat => (
            <div key={stat.label} className="flex items-center gap-3 bg-amber-950/20 p-3 rounded-2xl shadow-md">
              {stat.icon}
              <div className="flex flex-col">
                <span className="font-semibold text-yellow-200">{stat.value}</span>
                <span className="text-xs text-yellow-100/70">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bulk Claim Button */}
      {availableRewards.length > 1 && (
        <button
          onClick={handleBulkRedeem}
          className="bg-green-500 hover:bg-green-400 text-amber-950 font-semibold py-3 px-6 rounded-xl w-full md:w-auto transition"
        >
          Claim All Available Rewards ({totalBulkPoints} pts → ₦{totalBulkCash})
        </button>
      )}

      {/* Reward Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedRewards.map((reward, index) => {
          const disabled = totalPoints < reward.points;
          return (
            <motion.div
              key={reward.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`relative bg-gradient-to-br ${reward.color} p-6 rounded-3xl shadow-xl hover:shadow-yellow-700/40 transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-amber-950/20 p-3 rounded-lg">{reward.icon}</div>
                <span className="text-xs bg-yellow-400 text-amber-950 px-3 py-1 rounded-full font-semibold">{reward.points} Points</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-yellow-200">{reward.title}</h3>
              <p className="text-sm md:text-base text-yellow-100/80 mt-2 leading-relaxed">{reward.description}</p>
              <button
                onClick={() => handleOpenModal(reward)}
                disabled={disabled}
                aria-label={`Redeem ${reward.title} for ${reward.points} points`}
                className={`mt-4 w-full py-2 rounded-xl ${
                  disabled ? "bg-yellow-700 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-400"
                } text-amber-950 font-semibold transition`}
                data-tooltip-id={`tooltip-${reward.title}`}
                data-tooltip-content={disabled ? `You need ${reward.points - totalPoints} more points` : ""}
              >
                {disabled ? "Insufficient Points" : "Redeem"}
              </button>
              <Tooltip id={`tooltip-${reward.title}`} />
            </motion.div>
          );
        })}
      </div>

      {/* Confirmation Modals */}
      {selectedReward && (
        <ConfirmationModal
          isOpen={modalOpen}
          title="Redeem Reward Points"
          amount={Math.floor(selectedReward.points / 100 * NAIRA_PER_100_POINTS)}
          pointsToRedeem={selectedReward.points}
          transactionType="Rewards Redemption"
          requirePin={true}
          correctPin={account.pin}
          userBalance={account.balance}
          onConfirm={handleRedeemConfirm}
          onCancel={handleCloseModal}
          iconType="success"
          confirmText="Redeem Now"
          cancelText="Cancel"
          feeConfig={{ flat: 0, percent: 0 }}
        />
      )}

      {bulkModalOpen && (
        <ConfirmationModal
          isOpen={bulkModalOpen}
          title="Redeem All Rewards"
          amount={totalBulkCash}
          pointsToRedeem={totalBulkPoints}
          transactionType="Rewards Redemption"
          requirePin={true}
          correctPin={account.pin}
          userBalance={account.balance}
          onConfirm={handleBulkConfirm}
          onCancel={() => setBulkModalOpen(false)}
          iconType="success"
          confirmText="Redeem All"
          cancelText="Cancel"
          feeConfig={{ flat: 0, percent: 0 }}
        />
      )}

      <Footer />
    </div>
  );
};

export default RewardsPage;
