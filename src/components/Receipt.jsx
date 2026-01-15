import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Clock, Loader2, ArrowLeft, Download } from "lucide-react";
import domtoimage from "dom-to-image-more";

const Receipt = ({ transaction, onHome }) => {
  const receiptRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!transaction) return null;

  const status = (transaction.status || "successful").toLowerCase();

  const statusConfig = {
    successful: { icon: <CheckCircle2 size={48} />, label: "Transaction Successful" },
    failed: { icon: <XCircle size={48} />, label: "Transaction Failed" },
    pending: { icon: <Clock size={48} />, label: "Transaction Pending" },
    processing: {
      icon: <Loader2 size={48} className={isDownloading ? "" : "animate-spin"} />,
      label: "Processing",
    },
  };

  const current = statusConfig[status] || statusConfig.successful;

  // --------------------------
  // Download receipt as PNG
  // --------------------------
  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      const card = receiptRef.current?.querySelector(".receipt-card");
      if (!card) return;

      const clone = card.cloneNode(true);

      // Reset all styling for download
      Object.assign(clone.style, {
        backgroundColor: "white",
        border: "1px solid #ddd",
        padding: "20px",
        color: "black",
        fontFamily: "Arial, sans-serif",
        width: `${card.offsetWidth}px`,
        position: "absolute",
        top: "-99999px",
      });
      clone.className = "";

      clone.querySelectorAll("*").forEach(el => {
        el.style.color = "black";
        el.style.background = "transparent";
        el.style.border = "none";
        el.style.boxShadow = "none";
      });

      // Hide dividers
      clone.querySelectorAll(".h-px").forEach(div => (div.style.display = "none"));

      // Center the amount
      const amountEl = clone.querySelector(".amount-text");
      if (amountEl) {
        Object.assign(amountEl.style, {
          textAlign: "center",
          width: "100%",
          display: "block",
          margin: "0 auto",
          fontWeight: "800",
          fontSize: "32px",
        });
      }

      document.body.appendChild(clone);

      const imageUrl = await domtoimage.toPng(clone, {
        bgcolor: "white",
        width: clone.offsetWidth,
        height: clone.scrollHeight,
      });

      document.body.removeChild(clone);

      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `DAVEBANK_Receipt_${transaction.reference || "Transaction"}.png`;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download receipt.");
    } finally {
      setIsDownloading(false);
    }
  };

  // --------------------------
  // Prepare info grid fields
  // --------------------------
  const infoFields = [
    { label: "Transaction Type", value: transaction.type },
    { label: "Status", value: current.label.replace("Transaction ", "") },
    { label: "Network", value: transaction.provider },
    { label: "Plan", value: transaction.plan },
    { label: "Recipient", value: transaction.recipient },
    { label: "Phone", value: transaction.phone },
    { label: "Expiry Date", value: transaction.expiry },
    { label: "Reference", value: transaction.reference },
    { label: "Date", value: transaction.date ? new Date(transaction.date).toLocaleString() : "-" },
    { label: "Balance After", value: transaction.balanceAfter ? `₦${Number(transaction.balanceAfter).toLocaleString()}` : undefined },
  ];

  return (
    <motion.div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-black text-yellow-400 font-sans">
      <motion.div ref={receiptRef} className="w-full max-w-md rounded-3xl p-[2px] bg-yellow-500 shadow-[0_0_25px_rgba(255,215,0,0.3)]">
        <div className="receipt-card rounded-3xl bg-black/90 border border-yellow-600 shadow-2xl p-6 text-center space-y-6">

          {/* Status Icon */}
          <div className="flex justify-center">
            <div className="p-5 rounded-full bg-yellow-900/20 text-yellow-400 shadow-md">
              {current.icon}
            </div>
          </div>

          {/* Amount */}
          <h2 className="amount-text text-4xl sm:text-5xl font-extrabold tracking-wide text-yellow-400">
            ₦{Number(transaction.amount || 0).toLocaleString()}
          </h2>

          {/* Status Badge */}
          <div className="inline-block px-4 py-1.5 text-xs font-semibold rounded-full bg-yellow-900/30 text-yellow-400">
            {current.label}
          </div>

          <div className="h-px bg-yellow-700/30 w-full my-4" />

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 text-left text-sm">
            {infoFields.filter(f => f.value !== undefined).map(f => (
              <React.Fragment key={f.label}>
                <p className="font-medium">{f.label}:</p>
                <p className="text-right">{f.value}</p>
              </React.Fragment>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <motion.button
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-yellow-500 text-black font-semibold shadow-lg hover:bg-yellow-400 transition"
          onClick={onHome}
        >
          <ArrowLeft size={18} /> Back
        </motion.button>

        <motion.button
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-yellow-400 text-black font-semibold shadow-lg hover:bg-yellow-500 transition"
          onClick={handleDownload}
        >
          <Download size={18} /> Download Receipt
        </motion.button>
      </div>

      <div className="text-xs text-yellow-300 mt-5">
        Powered by <span className="font-semibold text-yellow-400">DAVEBANK</span>
      </div>
    </motion.div>
  );
};

export default Receipt;
