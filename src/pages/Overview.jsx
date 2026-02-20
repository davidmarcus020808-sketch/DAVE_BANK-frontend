// src/pages/OverviewPage.jsx
import React, { useContext, useMemo, useState } from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  ShieldCheck,
  CreditCard,
  BarChart3,
  PieChart as PieIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import { AccountContext } from "../context/AccountContext";

const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const COLORS = ["#facc15", "#b45309", "#fde68a", "#a16207", "#fcd34d"];

const categoryMap = {
  "Airtime & Data": ["Data Purchase", "Airtime Top-up"],
  Bills: ["Bill Payment"],
  Betting: ["Betting"],
};

const OverviewPage = () => {
  const { account, transactions, loading } = useContext(AccountContext);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDuration, setSelectedDuration] = useState("Monthly");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-yellow-400">
        Loading dashboard...
      </div>
    );
  }

  const parsedTransactions = useMemo(
    () =>
      transactions.map((t) => ({
        ...t,
        dateObj: new Date(t.date),
        amount: Number(t.amount) || 0,
      })),
    [transactions]
  );

  const filteredTransactions = useMemo(() => {
    let filtered = parsedTransactions;
    if (selectedCategory !== "All") {
      filtered = filtered.filter((t) =>
        categoryMap[selectedCategory]?.includes(t.type)
      );
    }

    const now = new Date();
    return filtered.filter((t) => {
      const d = t.dateObj;
      if (selectedDuration === "Daily") return d.toDateString() === now.toDateString();
      if (selectedDuration === "Monthly") return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      if (selectedDuration === "Yearly") return d.getFullYear() === now.getFullYear();
      return true;
    });
  }, [parsedTransactions, selectedCategory, selectedDuration]);

  const totalIncome = filteredTransactions
    .filter((t) => t.amount > 0)
    .reduce((a, t) => a + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.amount < 0)
    .reduce((a, t) => a + Math.abs(t.amount), 0);

  const barChartData = useMemo(() => {
    const now = new Date();

    if (selectedDuration === "Daily") {
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(now.getDate() - (6 - i));
        const dayTransactions = filteredTransactions.filter(
          (t) => t.dateObj.toDateString() === d.toDateString()
        );
        return {
          label: d.toLocaleDateString("en-US", { weekday: "short" }),
          income: dayTransactions.filter((t) => t.amount > 0).reduce((a, t) => a + t.amount, 0),
          expenses: dayTransactions.filter((t) => t.amount < 0).reduce((a, t) => a + Math.abs(t.amount), 0),
        };
      });
    }

    if (selectedDuration === "Monthly") {
      const monthLabels = [...new Set(filteredTransactions.map(t => t.dateObj.toLocaleString("en-US", { month: "short" })))];
      return monthLabels.map((month) => {
        const monthTransactions = filteredTransactions.filter(
          (t) => t.dateObj.toLocaleString("en-US", { month: "short" }) === month
        );
        return {
          label: month,
          income: monthTransactions.filter((t) => t.amount > 0).reduce((a, t) => a + t.amount, 0),
          expenses: monthTransactions.filter((t) => t.amount < 0).reduce((a, t) => a + Math.abs(t.amount), 0),
        };
      });
    }

    if (selectedDuration === "Yearly") {
      const yearLabels = [...new Set(filteredTransactions.map(t => t.dateObj.getFullYear()))];
      return yearLabels.map((year) => {
        const yearTransactions = filteredTransactions.filter((t) => t.dateObj.getFullYear() === year);
        return {
          label: year,
          income: yearTransactions.filter((t) => t.amount > 0).reduce((a, t) => a + t.amount, 0),
          expenses: yearTransactions.filter((t) => t.amount < 0).reduce((a, t) => a + Math.abs(t.amount), 0),
        };
      });
    }

    return [];
  }, [filteredTransactions, selectedDuration]);

  const pieData = useMemo(() => {
    const categories = Object.keys(categoryMap);
    const data = categories.map((cat) => {
      const value = filteredTransactions
        .filter((t) => categoryMap[cat].includes(t.type))
        .reduce((a, t) => a + Math.abs(t.amount), 0);
      return { name: cat, value };
    });
    return data.filter(d => d.value > 0);
  }, [filteredTransactions]);

  const summaryItems = [
    { title: "Total Balance", value: account?.balance || 0, icon: <Wallet size={26} />, color: "from-yellow-700 to-yellow-800" },
    { title: `Income (${selectedDuration})`, value: totalIncome, icon: <ArrowUpRight size={26} />, color: "from-green-700 to-green-800" },
    { title: `Expenses (${selectedDuration})`, value: totalExpenses, icon: <ArrowDownRight size={26} />, color: "from-red-700 to-red-800" },
    { title: "Total Transactions", value: filteredTransactions.length, icon: <Users size={26} />, color: "from-yellow-600 to-yellow-700" },
  ];

  return (
    <motion.div className="min-h-screen flex flex-col bg-black text-yellow-400 font-[Inter]" initial="hidden" animate="visible" transition={{ staggerChildren: 0.2 }}>
      <div className="flex-1 px-4 sm:px-6 md:px-10 lg:px-16 py-6 sm:py-10 space-y-8 sm:space-y-10">
        {/* Header */}
        <motion.div variants={fadeInUp}>
          <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-yellow-300 mb-2 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-yellow-200/70 text-xs sm:text-sm md:text-base">
            Welcome back to <span className="text-yellow-400 font-medium">Dave Bank</span> — your secure, smart, and modern financial hub.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4" variants={fadeInUp}>
          <select className="bg-black text-yellow-400 border border-yellow-700 rounded px-3 py-2 w-full sm:w-auto" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
            <option value="All">All</option>
            {Object.keys(categoryMap).map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select className="bg-black text-yellow-400 border border-yellow-700 rounded px-3 py-2 w-full sm:w-auto" value={selectedDuration} onChange={e => setSelectedDuration(e.target.value)}>
            <option value="Daily">Daily</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </motion.div>

        {/* Summary Cards */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" variants={{ visible: { transition: { staggerChildren: 0.15 } } }}>
          {summaryItems.map((item, i) => (
            <motion.div key={i} className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-br ${item.color} shadow-[0_0_15px_rgba(255,215,0,0.15)] border border-yellow-700/30 flex items-center justify-between`} variants={fadeInUp} whileHover={{ scale: 1.03 }}>
              <div>
                <h2 className="text-xs sm:text-sm text-yellow-200/70">{item.title}</h2>
                <p className="text-lg sm:text-xl font-bold text-yellow-300 mt-1">₦{Number(item.value).toLocaleString()}</p>
              </div>
              <div className="text-yellow-300">{item.icon}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts */}
        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6" variants={{ visible: { transition: { staggerChildren: 0.25 } } }}>
          {/* Bar Chart */}
          <motion.div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a1a00] border border-yellow-700/20 rounded-2xl p-4 sm:p-6 shadow-[0_0_15px_rgba(255,215,0,0.15)]" variants={fadeInUp}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm sm:text-lg font-semibold text-yellow-300">Income vs Expenses</h3>
              <BarChart3 size={18} className="text-yellow-400" />
            </div>
            <div className="w-full h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3a2f00" />
                  <XAxis dataKey="label" stroke="#fcd34d" />
                  <YAxis stroke="#fcd34d" />
                  <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #fcd34d", borderRadius: "8px", color: "#fcd34d" }} />
                  <Bar dataKey="income" fill="#facc15" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="#b45309" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Pie Chart */}
          <motion.div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a1a00] border border-yellow-700/20 rounded-2xl p-4 sm:p-6 shadow-[0_0_15px_rgba(255,215,0,0.15)]" variants={fadeInUp}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm sm:text-lg font-semibold text-yellow-300">Spending Breakdown</h3>
              <PieIcon size={18} className="text-yellow-400" />
            </div>
            <div className="w-full h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} sm:innerRadius={60} outerRadius={60} sm:outerRadius={90} paddingAngle={4} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #fcd34d", borderRadius: "8px", color: "#fcd34d" }} />
                  <Legend verticalAlign="bottom" align="center" wrapperStyle={{ color: "#fcd34d", fontSize: "10px sm:12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.div>

        {/* Security Section */}
        <motion.div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a1a00] border border-yellow-700/20 rounded-2xl p-4 sm:p-6 shadow-[0_0_15px_rgba(255,215,0,0.15)]" variants={fadeInUp}>
          <h3 className="text-sm sm:text-lg font-semibold text-yellow-300 mb-3 sm:mb-4">Security & Performance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[ 
              { title: "System Status", desc: "All systems operational", icon: <ShieldCheck size={20} className="text-yellow-400" />, status: "Active" },
              { title: "Card Protection", desc: "Advanced fraud monitoring", icon: <CreditCard size={20} className="text-yellow-400" />, status: "Enabled" },
              { title: "Performance", desc: "Last updated: 2 mins ago", icon: <BarChart3 size={20} className="text-yellow-400" />, status: "Optimized" },
            ].map((sec, i) => (
              <motion.div key={i} className="bg-yellow-900/10 p-3 sm:p-4 rounded-xl border border-yellow-700/20 flex justify-between items-center" variants={fadeInUp} whileHover={{ scale: 1.03 }}>
                <div className="flex items-center gap-2 sm:gap-3">
                  {sec.icon}
                  <div>
                    <p className="font-medium text-yellow-300 text-xs sm:text-sm">{sec.title}</p>
                    <p className="text-yellow-200/70 text-xs sm:text-sm">{sec.desc}</p>
                  </div>
                </div>
                <span className="text-green-400 font-semibold text-xs sm:text-sm">{sec.status}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div className="text-center py-6 sm:py-10" variants={fadeInUp} transition={{ delay: 0.2 }}>
          <p className="text-yellow-200/80 text-xs sm:text-sm mb-2 sm:mb-3">Experience next-level banking with Dave Bank.</p>
          <motion.button className="bg-yellow-400 text-black px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-yellow-300 hover:shadow-[0_0_15px_rgba(255,215,0,0.8)] transition-all duration-300" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Explore More Features
          </motion.button>
        </motion.div>
      </div>

      <Footer />
    </motion.div>
  );
};

export default OverviewPage;
