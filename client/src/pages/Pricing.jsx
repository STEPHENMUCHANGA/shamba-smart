import React from "react";

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 px-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-green-800 mb-8">Pricing Plans 💰</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100">
            <h3 className="text-xl font-semibold text-green-700 mb-2">Free</h3>
            <p className="text-gray-600 mb-4">Basic soil analysis tools.</p>
            <p className="text-2xl font-bold mb-4">KSh250</p>
            <button className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition">
              Get Started
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100">
            <h3 className="text-xl font-semibold text-green-700 mb-2">Pro</h3>
            <p className="text-gray-600 mb-4">Full AI analysis with custom insights from our partners.</p>
            <p className="text-2xl font-bold mb-4">KSh1500/mo</p>
            <button className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition">
              Subscribe
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100">
            <h3 className="text-xl font-semibold text-green-700 mb-2">Enterprise</h3>
            <p className="text-gray-600 mb-4">For co-ops or government use.</p>
            <p className="text-2xl font-bold mb-4">Custom</p>
            <button className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
