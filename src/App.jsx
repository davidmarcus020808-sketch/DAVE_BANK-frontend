import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import DashboardView from "./pages/DashboardView";
import TransferView from "./pages/TransferView";
import AirtimeView from "./pages/AirtimeView";
import BillPaymentView from "./pages/BillPaymentView";
import AccountDetailsView from "./pages/AccountDetailsView";
import LoginScreen from "./pages/LoginScreen";
import Register from "./pages/Register";
import Terms from "./pages/Terms";
import TransactionHistory from "./pages/TransactionHistory";
import ComingSoon from "./pages/ComingSoon";
import Betting from "./pages/Betting";
import OverviewPage from "./pages/Overview";
import NotificationsPage from "./pages/Notifications";
import RewardsPage from "./pages/RewardsPage";
import ProfilePage from "./pages/ProfilePage";
import ChatPage from "./pages/ChatPage";
import HelpCenter from "./pages/HelpCenter";
import SecurityPage from "./pages/SecurityPage";
import LogoutPage from "./pages/LogoutPage";
import DataPage from "./pages/DataPage";
import SettingsPage from "./pages/SettingsPage"; 
import About from "./pages/About";
import AddMoney from "./pages/AddMoney";


// Components
import ProtectedRoute from "./components/ProtectedRoute"; 

// Contexts
import { NotificationProvider } from "./context/NotificationContext";
import { ToastProvider } from "./context/ToastContext";
import { AccountProvider } from "./context/AccountContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";

const App = () => (
  <ThemeProvider>
    <NotificationProvider>
      <ToastProvider>
        <AccountProvider>
          <Router>
            <Routes>
              {/* Public / Auth Routes */}
              <Route path="/" element={<LoginScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<Register />} />
              <Route path="/terms" element={<Terms />} />

              {/* Protected App Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardView /></ProtectedRoute>} />
              <Route path="/transfer" element={<ProtectedRoute><TransferView /></ProtectedRoute>} />
              <Route path="/airtime" element={<ProtectedRoute><AirtimeView /></ProtectedRoute>} />
              <Route path="/bills" element={<ProtectedRoute><BillPaymentView /></ProtectedRoute>} />
              <Route path="/accountdetails" element={<ProtectedRoute><AccountDetailsView /></ProtectedRoute>} />
              <Route path="/transactionhistory" element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>} />
              <Route path="/coming-soon" element={<ProtectedRoute><ComingSoon /></ProtectedRoute>} />
              <Route path="/betting" element={<ProtectedRoute><Betting /></ProtectedRoute>} />
              <Route path="/overview" element={<ProtectedRoute><OverviewPage /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
              <Route path="/rewards" element={<ProtectedRoute><RewardsPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
              <Route path="/help-center" element={<ProtectedRoute><HelpCenter /></ProtectedRoute>} />
              <Route path="/security" element={<ProtectedRoute><SecurityPage /></ProtectedRoute>} />
              <Route path="/logout" element={<ProtectedRoute><LogoutPage /></ProtectedRoute>} />
              <Route path="/data" element={<ProtectedRoute><DataPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
              <Route path="/add-money" element={<ProtectedRoute><AddMoney /></ProtectedRoute>} />
            </Routes>
          </Router>

          {/* Toast Renderer */}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 2500,
              style: { background: "transparent", boxShadow: "none" },
            }}
          />
        </AccountProvider>
      </ToastProvider>
    </NotificationProvider>
  </ThemeProvider>
);

export default App;
