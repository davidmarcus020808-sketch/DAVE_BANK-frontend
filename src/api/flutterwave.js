import axiosInstance from "./axiosInstance";

// Init payment
export const initFlutterwavePayment = (amount) => {
  return axiosInstance.post("/flutterwave/init/", { amount });
};

// Verify payment
export const verifyFlutterwavePayment = (tx_ref) => {
  return axiosInstance.post("/flutterwave/verify/", { tx_ref });
};
