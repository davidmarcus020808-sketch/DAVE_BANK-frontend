import React, { useState } from "react";
import { Eye, EyeOff, ArrowUpRight, Plus } from "lucide-react";

const BalanceCard = ({ balance, onAddMoney, onViewHistory }) => {
  const [visible, setVisible] = useState(true);

  return (
    <div className="bg-black text-yellow-400 shadow-xl rounded-2xl p-5 sm:p-8 flex flex-col gap-4 border border-yellow-500/20 transition-all duration-300">
      {/* === Top Section (Balance + History button) === */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center justify-between w-full">
          {/* Balance + Eye toggle */}
          <div>
            <p className="text-yellow-300/80 text-sm font-medium">
              Available Balance
            </p>
            <div className="mt-2 flex items-center gap-3">
              <h2 className="text-3xl sm:text-4xl font-bold text-yellow-400">
                {visible ? `₦${balance.toLocaleString()}` : "••••••"}
              </h2>
              <button
                onClick={() => setVisible(!visible)}
                className="p-1.5 rounded-lg hover:bg-yellow-500/10 active:scale-95 transition"
              >
                {visible ? (
                  <EyeOff size={18} className="text-yellow-400" />
                ) : (
                  <Eye size={18} className="text-yellow-400" />
                )}
              </button>
            </div>
          </div>

          {/* View History (mobile only) */}
          <button
            onClick={onViewHistory}
            className="sm:hidden flex items-center justify-center gap-1.5 bg-yellow-400 text-black font-semibold py-1.5 px-3 rounded-lg transition shadow-sm hover:bg-yellow-300 text-xs whitespace-nowrap"
          >
            <ArrowUpRight size={14} />
            History
          </button>
        </div>
      </div>

      {/* === Add Money (mobile only) === */}
      <div className="sm:hidden">
        <button
          onClick={onAddMoney}
          className="w-full flex items-center justify-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 font-semibold py-2 rounded-lg transition text-sm active:scale-95"
        >
          <Plus size={16} />
          Add Money
        </button>
      </div>

      {/* === Desktop Buttons (right-aligned) === */}
      <div className="hidden sm:flex items-center justify-end gap-3 mt-2">
        <button
          onClick={onViewHistory}
          className="flex items-center justify-center gap-2 bg-yellow-400 text-black hover:bg-yellow-300 font-medium py-2 px-4 rounded-xl transition shadow-sm"
        >
          <ArrowUpRight size={16} />
          View History
        </button>

        <button
          onClick={onAddMoney}
          className="bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 font-semibold py-2 px-6 rounded-xl transition shadow-sm"
        >
          Add Money
        </button>
      </div>
    </div>
  );
};

export default BalanceCard;
