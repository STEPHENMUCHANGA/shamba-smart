import React from "react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-green-800 mb-4">About ShambaSmart 🌍</h2>
        <p className="text-gray-700 mb-4">
          ShambaSmart empowers farmers with AI-driven soil and crop insights, helping improve yield, efficiency, and sustainability.
        </p>
        <p className="text-gray-700 mb-4">
          Our platform combines cutting-edge technology with local expertise to deliver actionable recommendations.
        </p>
        <p className="text-gray-700 mb-4">
          Our mission is to bridge the gap between technology and agriculture by making data-driven farming accessible to all.
        </p>
        <p className="text-gray-700">
          Whether you are a smallholder or a large-scale farmer, ShambaSmart helps you make smarter, greener, and more profitable farming decisions.
        </p>
      </div>
    </div>
  );
}
