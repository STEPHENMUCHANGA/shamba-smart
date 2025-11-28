import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SoilForm from "../components/SoilForm"; // 👈 make sure this file exists in the same folder

export default function FreeTrial() {
  const navigate = useNavigate();
  const [trialActive, setTrialActive] = useState(false);
  const [trialExpired, setTrialExpired] = useState(false);

  // 🌿 Check if trial is still valid
  const checkTrialStatus = () => {
    const trialStart = localStorage.getItem("trialStart");
    if (!trialStart) {
      setTrialActive(false);
      setTrialExpired(false);
      return;
    }

    const startDate = new Date(trialStart);
    const expiryDate = new Date(startDate);
    expiryDate.setDate(startDate.getDate() + 7);

    if (new Date() <= expiryDate) {
      setTrialActive(true);
      setTrialExpired(false);
    } else {
      setTrialActive(false);
      setTrialExpired(true);
    }
  };

  useEffect(() => {
    checkTrialStatus();
  }, []);

  // 🌱 Handle Start Trial button
  const handleStartTrial = () => {
    const now = new Date();
    localStorage.setItem("trialStart", now.toISOString());
    alert("🎉 Your 7-day free trial has started!");
    setTrialActive(true);
    setTrialExpired(false);
  };

  // 🌾 If trial is active, show the analysis form directly
  if (trialActive) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 px-4 py-10">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl">
          <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
            🌱 Your Free Trial is Active
          </h2>
          <p className="text-gray-700 mb-6 text-center">
            You have full access to the Experts'-powered soil insights tools, crop recommendations, and weather insights for 7 days.
          </p>
          <SoilForm /> {/* 👈 show the form directly */}
        </div>
      </div>
    );
  }

  // 🌾 If trial expired, show a message
  if (trialExpired) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-green-800 mb-4">
            ⏰ Your Free Trial Has Expired
          </h2>
          <p className="text-gray-700 mb-6">
            Your 7-day trial period has ended. Please subscribe to continue using ShambaSmart’s tools.
          </p>
          <button
            onClick={() => navigate("/pricing")}
            className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition"
          >
            View Subscription Plans
          </button>
        </div>
      </div>
    );
  }

  // 🌿 Default: No trial started yet
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-green-800 mb-4">
          Start Your Free Trial 🌱
        </h2>
        <p className="text-gray-700 mb-6">
          Enjoy 7 days of full access to ShambaSmart’s Experts'-powered soil insights tools, crop recommendations, and weather insights.
        </p>
        <button
          onClick={handleStartTrial}
          className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition"
        >
          Start Free Trial
        </button>
      </div>
    </div>
  );
}
