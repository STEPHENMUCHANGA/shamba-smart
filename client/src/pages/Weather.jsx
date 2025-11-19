import React, { useState } from "react";

function Weather() {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recommendation, setRecommendation] = useState("");

  const fetchWeather = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setWeatherData(null);
    setRecommendation("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/weather`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to fetch weather data");
      }

      const data = await response.json();
      setWeatherData(data);
      generateRecommendation(data);
    } catch (err) {
      console.error("❌ fetchWeather error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🌱 AI-based recommendation logic
  const generateRecommendation = (data) => {
    const temp = data.temperature;
    const humidity = data.humidity;
    const condition = data.condition.toLowerCase();

    let advice = "";

    if (condition.includes("rain")) {
      advice =
        "🌧️ Expect rainfall — ideal for planting and irrigation. Avoid spraying pesticides today.";
    } else if (temp > 30) {
      advice = "🔥 High temperatures — ensure adequate irrigation and mulch to retain soil moisture.";
    } else if (temp >= 20 && temp <= 30 && humidity >= 50) {
      advice = "🌤️ Warm and moderately humid — perfect for maize, beans, and vegetables.";
    } else if (humidity < 40) {
      advice = "💨 Low humidity — monitor crops for water stress and irrigate early morning or late evening.";
    } else {
      advice = "🌿 Conditions are stable. Monitor weather changes and plan accordingly.";
    }

    setRecommendation(advice);
  };

  return (
    <div className="page-content flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-bold text-green-700 mb-4">🌤️ ShambaSmart Weather Insights</h1>
      <p className="max-w-xl text-gray-700 mb-6">
        Get real-time insights from our partners' expertise or AI-predicted weather conditions based on your location’s geospatial data.
      </p>

      <form onSubmit={fetchWeather} className="flex flex-col items-center gap-3">
        <input
          type="text"
          placeholder="Enter your location (e.g., Nairobi, Kenya)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-80"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition"
        >
          {loading ? "Fetching..." : "Check Weather"}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {weatherData && (
        <div className="glass-card mt-8 bg-white shadow-lg border border-green-100 rounded-2xl p-6 max-w-md text-left">
          <h2 className="text-2xl font-semibold text-green-800 mb-2">📍 {weatherData.location}</h2>
          <p>🌡️ Temperature: <strong>{weatherData.temperature}°C</strong></p>
          <p>☁️ Condition: <strong>{weatherData.condition}</strong></p>
          <p>💧 Humidity: <strong>{weatherData.humidity}%</strong></p>
          <p>💨 Wind Speed: <strong>{weatherData.wind_speed} km/h</strong></p>
          <p>🤖 AI Prediction: <strong>{weatherData.ai_prediction}</strong></p>

          {recommendation && (
            <div className="mt-4 bg-green-50 border-l-4 border-green-600 p-3 rounded-md text-green-900">
              <p className="font-semibold">🌾 ShambaSmart partners' expertise and AI Recommendation:</p>
              <p>{recommendation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Weather;
