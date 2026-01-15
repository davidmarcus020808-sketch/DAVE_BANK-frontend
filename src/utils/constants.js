import { Send, Zap, Wallet, CreditCard } from "lucide-react";

export const PRIMARY_COLOR = "bg-green-600";
export const SECONDARY_COLOR = "bg-green-50";
export const PRIMARY_TEXT = "text-green-600";

export const MOCK_TRANSACTIONS = [
  { id: 1, type: "Transfer", amount: -2500.0, date: "Today, 10:30 AM", description: "To John Doe", icon: Send },
  { id: 2, type: "Airtime Top-up", amount: -500.0, date: "Yesterday, 04:15 PM", description: "MTN Nigeria", icon: Zap },
  { id: 3, type: "Income", amount: 15000.0, date: "Yesterday, 02:00 PM", description: "Salary Deposit", icon: Wallet, isCredit: true },
  { id: 4, type: "Transfer", amount: -1200.0, date: "2 days ago", description: "To Sarah Connor", icon: Send },
];

export const MOCK_ACCOUNT_DETAILS = {
  accountNumber: "9034567890",
  bankName: "Simulated OPay Bank",
  accountHolder: "Opay User",
};

export const MOCK_NETWORKS = [
  { name: "MTN", logo: "M", color: "bg-yellow-500" },
  { name: "GLO", logo: "G", color: "bg-green-700" },
  { name: "Airtel", logo: "A", color: "bg-red-600" },
  { name: "9mobile", logo: "9", color: "bg-green-400" },
];

export const MOCK_BILL_TYPES = [
  { type: "Electricity", icon: "⚡", providers: ["Ikeja Electric", "Eko Disco", "PHCN"] },
  { type: "Cable TV", icon: "📺", providers: ["DSTV", "GOtv", "StarTimes"] },
  { type: "Internet Data", icon: "🌐", providers: ["MTN Data", "Glo Data", "Airtel Data"] },
];
