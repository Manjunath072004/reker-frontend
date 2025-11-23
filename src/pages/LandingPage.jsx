import React from "react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white px-10 py-6">
      {/* Navbar */}
      <nav className="flex justify-between items-center py-4">
        <div className="text-2xl font-semibold text-green-600">Logo</div>

        <ul className="flex gap-10 text-orange-500 font-medium">
          <li className="cursor-pointer hover:text-orange-600">Home</li>
          <li className="cursor-pointer hover:text-orange-600">AboutUs</li>
          <li className="cursor-pointer hover:text-orange-600">Services</li>
          <li className="cursor-pointer hover:text-orange-600">ContactUs</li>
        </ul>

        <button className="border border-blue-400 px-4 py-1 rounded-lg text-blue-600 hover:bg-blue-50">
          Login
        </button>
      </nav>

      {/* Main Section */}
      <div className="grid grid-cols-2 mt-16 items-center">

        {/* Left Content */}
        <div>
          <h1 className="text-2xl text-orange-500 font-semibold">
            Easy & Safe Payments
          </h1>

          <p className="mt-4 text-orange-500 leading-relaxed max-w-md">
            From high-growth startups to enterprise giants – accelerate payments
            with the most reliable gateway for India’s modern businesses.
          </p>

          <div className="flex gap-8 mt-8">
            <button className="border border-blue-500 px-6 py-2 rounded-xl text-blue-600 font-medium hover:bg-blue-50">
              SignUp →
            </button>

            <button className="text-blue-700 underline underline-offset-4">
              Know more
            </button>
          </div>
        </div>

        {/* Right – Picture Circle */}
        <div className="flex justify-center">
          <div className="w-64 h-64 border-4 rounded-full border-blue-400 flex items-center justify-center text-blue-600 text-xl">
            Picture
          </div>
        </div>
      </div>

      {/* Slider Arrows + Dots */}
      <div className="flex justify-between px-10 mt-20">
        <div className="text-blue-600 text-3xl cursor-pointer">←</div>
        <div className="flex gap-3">
          <div className="w-3 h-3 rounded-full border border-blue-500"></div>
          <div className="w-3 h-3 rounded-full border border-blue-500"></div>
          <div className="w-3 h-3 rounded-full border border-blue-500"></div>
        </div>
        <div className="text-blue-600 text-3xl cursor-pointer">→</div>
      </div>

    </div>
  );
};

export default LandingPage;
