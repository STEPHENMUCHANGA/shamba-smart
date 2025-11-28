import React from "react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-green-800 mb-4">About ShambaSmart 🌍</h2>
        <p className="text-gray-700 mb-4">
          ShambaSmart empowers farmers with Expert-driven soil and crop, and weather insights, helping improve yield, efficiency, and sustainability.
        </p>
        <p className="text-gray-700 mb-4">
          Our platform combines cutting-edge technology with local expertise to deliver actionable insights and recommendations.
        </p>
        <p className="text-gray-700 mb-4">
          By leveraging data from soil sensors, weather forecasts, and satellite imagery, ShambaSmart provides farmers with the tools they need to optimize their farming practices.
        </p>
        <p className="text-gray-700 mb-4">
          Just by inputing the name of your County, we provide tailored advice on soil properties, recommended crops, and weather insights.
        </p>
        <p className="text-gray-700 mb-4">
          Our mission is to bridge the gap between technology and agriculture by making data-driven farming accessible to all.
        </p>
        <p className="text-gray-700">
          Whether you are a smallholder or a large-scale farmer, ShambaSmart helps you make smarter, greener, and more profitable farming decisions.
        </p>
        <p className="text-gray-700">
          By achieving sustainable agriculture, we attain sustainable development goals (SDGs).
        </p>
      </div>
    </div>
  );
}
