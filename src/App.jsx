// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App


import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

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



export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp-verify" element={<OtpVerify />} />

           {/* Merchant Module */}
          <Route path="/merchant-dashboard" element={<MerchantDashboard />} />
          <Route path="/merchant/create" element={<CreateMerchant />} />
          <Route path="/merchant/list" element={<MerchantList />} />
          <Route path="/merchant/profile" element={<MerchantProfile />} />

          {/* Coupons Module */}
          <Route path="/coupons/verify" element={<VerifyCoupon />} />
          <Route path="/coupons/apply" element={<ApplyCoupon />} />
          <Route path="/coupons/list" element={<CouponList />} />
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
