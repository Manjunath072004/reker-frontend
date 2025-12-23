import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import ForgotPageScreen from "./pages/ForgotPageScreen";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OtpVerify from "./pages/OtpVerify";
import MerchantDashboard from "./pages/MerchantDashboard";

import CreateMerchant from "./pages/CreateMerchant";
import MerchantList from "./pages/MerchantList";
import MerchantProfile from "./pages/MerchantProfile";

// Coupon Pages
import VerifyCoupon from "./pages/VerifyCoupon";
import ApplyCoupon from "./pages/ApplyCoupon";
import CouponList from "./pages/CouponList";

import LandingPage from "./pages/LandingPage";
import Coupons from "./pages/Coupons";
import POSPage from "./pages/POSPage";

import Notifications from "./pages/Notifications";
// import TransactionsPage from "./pages/TransactionsPage";


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Page */}
          <Route path="/Landing-Page" element={<LandingPage />} />
          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp-verify" element={<OtpVerify />} />
          <Route path="/forgot-password" element={<ForgotPageScreen />} />

          {/* Merchant Module */}
          <Route path="/merchant-dashboard" element={<MerchantDashboard />} />
          <Route path="/merchant/create" element={<CreateMerchant />} />
          <Route path="/merchant/list" element={<MerchantList />} />
          <Route path="/merchant/profile" element={<MerchantProfile />} />

          {/* Coupons Module */}
          <Route path="/coupons/verify" element={<VerifyCoupon />} />
          <Route path="/coupons/apply" element={<ApplyCoupon />} />
          <Route path="/coupons/list" element={<CouponList />} />
          <Route path="/coupons" element={<Coupons />} />
          <Route path="/pos" element={<POSPage />} />

          <Route path="/notifications" element={<Notifications />} />

          {/* <Route path="/dashboard/transactions" element={<TransactionsPage />} /> */}
          

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
