import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import CountUp from "react-countup";

import rekerPayLogo from "../assets/Reker-logo.png";
import heroPhone from "../assets/Reker-background.jpg";

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  return (
    <div className="bg-[#F4F7FC] text-gray-900 overflow-x-hidden">

      {/* GLASS NAVBAR */}
      <motion.header
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="fixed left-6 right-6 top-6 z-40 
          bg-white/40 backdrop-blur-2xl 
          px-10 py-4 rounded-2xl shadow-xl 
          border border-white/30 flex justify-between items-center"
      >
        <img src={rekerPayLogo} className="h-12" alt="RekerPay" />

        <nav className="hidden md:flex gap-10 text-gray-700 font-medium text-sm">
          <button className="hover:text-green-600 transition">Home</button>
          <button className="hover:text-green-600 transition">About</button>
          <button className="hover:text-green-600 transition">Solutions</button>
          <button className="hover:text-green-600 transition">Support</button>
        </nav>

        <div className="flex gap-3">
          <button
            className="hover:text-green-600 transition"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="px-5 py-2 bg-gradient-to-r from-yellow-500 to-green-600 
              text-white rounded-full shadow-lg hover:scale-[1.07] transition-all"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </button>
        </div>
      </motion.header>

      {/* HERO SECTION */}
      <section className="pt-40 pb-28 px-6 md:px-16 relative overflow-hidden">

        {/* BACKGROUND GRADIENT MESH */}
        <div className="absolute inset-0 z-0">
          <div className="absolute w-[500px] h-[500px] bg-yellow-300/25 blur-[200px] rounded-full top-0 left-0"></div>
          <div className="absolute w-[500px] h-[500px] bg-green-300/25 blur-[200px] rounded-full bottom-0 right-0"></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-20">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            className="md:w-1/2"
          >
            <span className="inline-block bg-white/70 backdrop-blur-xl 
              text-green-700 px-5 py-2 rounded-full text-sm font-semibold shadow">
              Powering India's Modern Businesses
            </span>

            <h1 className="text-[48px] md:text-[62px] font-extrabold mt-6 leading-tight">
              Fast. Secure. <br />
              <span className="bg-gradient-to-r from-yellow-500 to-green-600 
                bg-clip-text text-transparent">
                Smarter Payments.
              </span>
            </h1>

            <p className="mt-5 text-gray-600 text-lg leading-relaxed">
              Accept payments instantly with a fintech platform designed for
              speed, security, and reliability.
            </p>

            <div className="flex gap-6 mt-10">
              <button
                className="px-8 py-3 bg-gradient-to-r 
                  from-yellow-500 to-green-600
                  text-white rounded-full font-semibold
                  shadow-xl hover:scale-105 transition"
                onClick={() => navigate("/signup")}
              >
                Get Started
              </button>

              <button className="px-8 py-3 rounded-full bg-white/70 
                backdrop-blur-xl border shadow hover:bg-gray-100 transition">
                Learn More
              </button>
            </div>
          </motion.div>

          {/* RIGHT FLOATING IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 70 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="md:w-1/2 relative flex justify-center"
          >
            {/* Glow Elements */}
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute w-80 h-80 bg-yellow-400/30 
                blur-3xl rounded-full -top-14 -left-10"
            />

            <motion.div
              animate={{ opacity: [0.6, 0.3, 0.6] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute w-72 h-72 bg-green-400/30 
                blur-3xl rounded-full bottom-0 right-0"
            />

            {/* Floating Phone */}
            <motion.img
              src={heroPhone}
              alt="phone"
              animate={{ y: [0, -18, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="h-[480px] rounded-[2rem] shadow-2xl relative z-10 border border-white/20"
            />
          </motion.div>

        </div>
      </section>

      {/* STATS SECTION (Premium) */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-14 px-10">

          {[
            [20, "M+", "Transactions Processed"],
            [99.9, "%", "Success Rate"],
            [500, "Cr+", "Monthly Volume"],
            [40, "K+", "Merchants"]
          ].map(([value, suffix, label], i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="text-center"
            >
              <h3 className="text-5xl font-extrabold 
                bg-gradient-to-r from-yellow-500 to-green-600 
                bg-clip-text text-transparent">
                <CountUp end={value} duration={2} />{suffix}
              </h3>

              <p className="text-gray-500 mt-2 text-lg">{label}</p>
            </motion.div>
          ))}

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 md:px-16 bg-[#F9FBFF]">
        <h2
          data-aos="fade-up"
          className="text-center text-4xl font-extrabold mb-14"
        >
          How RekerPay Works
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">

          {[
            ["⚙️", "Create Your Account", "Sign up & complete quick verification."],
            ["💳", "Accept Payments Easily", "Enable UPI, cards & wallet instantly."],
            ["📈", "Grow With Insights", "Track revenue & business analytics."]
          ].map(([icon, title, desc], i) => (
            <motion.div
              key={title}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.2 }}
              className="p-10 bg-white border rounded-2xl 
                shadow-md hover:shadow-2xl transition 
                cursor-pointer backdrop-blur-xl"
            >
              <div className="text-5xl">{icon}</div>
              <h3 className="font-bold text-2xl mt-4">{title}</h3>
              <p className="text-gray-600 mt-3 text-md">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="py-24 bg-white">
        <h2 data-aos="fade-up" className="text-center text-4xl font-extrabold mb-16">
          Pricing That Works For You
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-14 px-10">

          {/* Pricing Cards */}
          {[ "Starter", "Business", "Enterprise" ].map((pkg, i) => (
            <motion.div
              key={pkg}
              data-aos="zoom-in"
              className={`rounded-2xl p-10 shadow-xl border 
                ${i === 1 
                  ? "bg-gradient-to-r from-yellow-500 to-green-600 text-white scale-[1.05]" 
                  : "bg-white"
                }`}
            >
              <h3 className="text-xl font-bold">{pkg}</h3>

              {i === 2 ? (
                <h4 className="text-4xl font-extrabold mt-6 
                  bg-gradient-to-r from-yellow-500 to-green-600 bg-clip-text 
                  text-transparent">
                  Custom
                </h4>
              ) : (
                <h4 className="text-4xl font-extrabold mt-6">
                  {i === 0 ? "1.8%" : "2.0%"}
                </h4>
              )}

              <ul className={`mt-6 space-y-3 text-md 
                ${i === 1 ? "opacity-90" : "text-gray-600"}
              `}>
                <li>✔ All Payment Methods</li>
                <li>✔ Dashboard Access</li>
                <li>✔ 24/7 Support</li>
              </ul>

              <button
                className={`w-full mt-8 px-4 py-2 rounded-full
                  ${i === 1 
                    ? "bg-white text-green-600" 
                    : "bg-white border hover:bg-gray-100"
                  }`}
              >
                {i === 2 ? "Contact Us" : "Choose Plan"}
              </button>
            </motion.div>
          ))}

        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-[#F7FAFF]">
        <h2 data-aos="fade-up" className="text-center text-4xl font-extrabold mb-16">
          What Our Clients Say
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 px-10">
          {[ 
            ["Aarav Sharma", "RekerPay scaled our payments with ease."],
            ["Priya Mehta", "Smooth payouts and great dashboard."],
            ["Rahul Verma", "Best UPI success rate we've seen."]
          ].map(([name, text], i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.2 }}
              className="p-10 bg-white rounded-2xl border shadow-xl 
                hover:shadow-2xl transition"
            >
              <p className="text-gray-700 italic">“{text}”</p>
              <h3 className="mt-5 font-bold text-green-600 text-lg">{name}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="py-24 bg-gradient-to-r from-yellow-500 to-green-600 text-white text-center"
      >
        <h2 className="text-5xl font-extrabold">Ready to Move Faster?</h2>
        <p className="mt-3 text-lg opacity-90">
          Join thousands of businesses using RekerPay.
        </p>

        <button
          className="mt-8 px-12 py-3 bg-white text-green-700 rounded-full 
            shadow-xl hover:scale-105 transition"
          onClick={() => navigate("/signup")}
        >
          Get Started
        </button>
      </motion.section>

      {/* FOOTER */}
      <footer className="bg-white py-12 border-t">
        <div className="max-w-6xl mx-auto px-10 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <img src={rekerPayLogo} className="h-12 mb-4" />
            <p className="text-gray-500">
              RekerPay — India's Trusted Payment Partner.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-3">Products</h4>
            <ul className="space-y-2 text-gray-600">
              <li>Payments</li>
              <li>Subscriptions</li>
              <li>Smart Checkout</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3">Company</h4>
            <ul className="space-y-2 text-gray-600">
              <li>About</li>
              <li>Careers</li>
              <li>Support</li>
            </ul>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} RekerPay — All Rights Reserved
        </p>
      </footer>

    </div>
  );
}
