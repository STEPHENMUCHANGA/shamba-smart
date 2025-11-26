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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/weather/get`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ location }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const data = await response.json();
      setWeatherData(data);
      generateRecommendation(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendation = (data) => {
    const temp = data.temperature;
    const humidity = data.humidity;
    const condition = data.condition.toLowerCase();

    let advice = "";

    if (condition.includes("rain")) {
      advice = "🌧️ Expect rainfall — ideal for planting and irrigation.";
    } else if (temp > 30) {
      advice = "🔥 High temperatures — irrigate early morning or evening.";
    } else if (temp >= 20 && temp <= 30 && humidity >= 50) {
      advice = "🌤️ Good for vegetables, maize, and legumes.";
    } else if (humidity < 40) {
      advice = "💨 Low humidity — crops may undergo water stress.";
    } else {
      advice = "🌿 Conditions are stable. Monitor changes.";
    }

    setRecommendation(advice);
  };

  return (
    <div className="page-content flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-bold text-green-700 mb-4">
        🌤️ ShambaSmart Weather Insights
      </h1>

      <form onSubmit={fetchWeather} className="flex flex-col items-center gap-3">
        <input
          type="text"
          placeholder="Enter your location (e.g., Nairobi)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="px-4 py-2 border border-green-300 rounded-lg focus:ring-green-500 w-80"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-700 text-white px-6 py-2 rounded-lg"
        >
          {loading ? "Fetching..." : "Check Weather"}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {weatherData && (
        <div className="glass-card mt-8 bg-white shadow-lg border rounded-2xl p-6 max-w-md text-left">
          <h2 className="text-2xl font-semibold text-green-800 mb-2">
            📍 {weatherData.location}
          </h2>

          <p>🌡️ Temperature: <strong>{weatherData.temperature}°C</strong></p>
          <p>☁️ Condition: <strong>{weatherData.condition}</strong></p>
          <p>💧 Humidity: <strong>{weatherData.humidity}%</strong></p>
          <p>💨 Wind Speed: <strong>{weatherData.wind_speed} km/h</strong></p>
          <p>🤖 Experts' Prediction: <strong>{weatherData.ai_prediction}</strong></p>

          {recommendation && (
            <div className="mt-4 bg-green-50 border-l-4 border-green-600 p-3 rounded-md">
              <p className="font-semibold">🌾 Expert Recommendation:</p>
              <p>{recommendation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Weather;
