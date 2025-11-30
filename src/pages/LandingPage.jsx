import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // <-- added
import "../styles/Landing.css";

import rekerPayLogo from "../assets/Reker-logo.png";
import heroPhone from "../assets/Reker-background.jpg";

const features = [
  { title: "Instant Settlements", desc: "Get payouts in seconds, not days", icon: "⚡" },
  { title: "D2C Growth Tools", desc: "Checkout, analytics, subscriptions", icon: "📦" },
  { title: "WhatsApp Commerce", desc: "Sell & collect payments instantly", icon: "💬" },
  { title: "Secure Payments", desc: "Reliable and trusted payment system", icon: "🔒" },
];

export default function LandingPage() {
  const revealRefs = useRef([]);
  const navigate = useNavigate(); // <-- for navigation

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("landing-reveal-visible");
        });
      },
      { threshold: 0.2 }
    );
    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page min-h-screen bg-gradient-to-br from-[#F3F7F3] to-[#EBF4EC] overflow-x-hidden relative">

      {/* NAVBAR */}
      <header className="landing-navbar fixed left-6 right-6 top-6 z-40 bg-white/40 backdrop-blur-xl px-10 py-4 rounded-2xl shadow-sm flex justify-between items-center">
        <img src={rekerPayLogo} className="h-12" alt="RekerPay" />
        <nav className="hidden md:flex gap-8 text-gray-700">
          <button className="landing-nav-link" onClick={() => navigate("/")}>Home</button>
          <button className="landing-nav-link">About Us</button>
          <button className="landing-nav-link">Services</button>
          <button className="landing-nav-link">Contact</button>
        </nav>
        <div className="flex gap-3">
          <button className="hover:text-green-600" onClick={() => navigate("/login")}>Login</button>
          <button
            className="px-5 py-2 bg-green-600 text-white rounded-full shadow-md hover:scale-[1.03]"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="pt-36 px-6 md:px-12">
        <section className="flex flex-col md:flex-row items-center gap-12">

          {/* LEFT SIDE */}
          <div className="md:w-1/2">
            <span className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold mb-4">
              India’s Fastest Growing Payment System
            </span>

            <h1 className="mt-4 text-[44px] md:text-[54px] leading-tight font-extrabold text-gray-900">
              Simple. Secure. <br />
              Smarter Payments.
            </h1>
            <p className="mt-4 text-gray-600 text-lg">
              Empower your business with a next-gen payment experience built <br />
              for speed, trust, and growth.
            </p>

            <div className="flex gap-4 mt-8 landing-reveal" ref={el => revealRefs.current.push(el)}>
              <button
                className="px-8 py-3 rounded-full bg-green-600 text-white shadow-xl hover:scale-[1.02]"
                onClick={() => navigate("/signup")} // <-- Start Now navigates to signup
              >
                Start Now
              </button>
              <button className="px-8 py-3 rounded-full bg-white border shadow-sm hover:bg-gray-50">
                Know More
              </button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="md:w-1/2 relative flex justify-center landing-reveal" ref={el => revealRefs.current.push(el)}>
            <img src={heroPhone} alt="phone" className="h-[430px] shadow-xl rounded-3xl" />
          </div>

        </section>

        {/* FEATURES GRID */}
        <section className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-lg border flex flex-col items-center text-center transition-transform transform hover:scale-105 landing-reveal"
              ref={el => revealRefs.current.push(el)}
            >
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl mb-4">
                {f.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-24 bg-white/70 backdrop-blur-xl border-t">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <img src={rekerPayLogo} className="h-12 mb-4" />
            <p className="text-gray-500 text-sm">Powering payments for modern India.</p>
          </div>
          <div>
            <h4 className="text-sm font-bold mb-3">Products</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Payments</li>
              <li>Checkout</li>
              <li>Subscriptions</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>About</li>
              <li>Careers</li>
              <li>Support</li>
            </ul>
          </div>
        </div>
        <div className="text-center py-4 border-t text-gray-500 text-sm">
          © {new Date().getFullYear()} RekerPay — All Rights Reserved
        </div>
      </footer>
    </div>
  );
}
