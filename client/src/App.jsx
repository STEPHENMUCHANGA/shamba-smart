import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FreeTrial from "./pages/FreeTrial";
import Pricing from "./pages/Pricing";
import Weather from "./pages/Weather";
import About from "./pages/About";
import SoilForm from "./components/SoilForm";
import "./index.css";

// 🌿 Helper function — check trial validity
const isTrialValid = () => {
  const trialStart = localStorage.getItem("trialStart");
  if (!trialStart) return false;
  const startDate = new Date(trialStart);
  const expiryDate = new Date(startDate);
  expiryDate.setDate(startDate.getDate() + 7);
  return new Date() <= expiryDate;
};

// 🌿 Protected Route logic
const ProtectedRoute = ({ element: Element }) => {
  const isAuthenticated = !!localStorage.getItem("user");
  const hasValidTrial = isTrialValid();
  const hasSubscription = localStorage.getItem("subscriptionActive") === "true";

  if (!isAuthenticated && !hasValidTrial) return <Navigate to="/login" replace />;
  if (!hasValidTrial && !hasSubscription) return <Navigate to="/pricing" replace />;

  return <Element />;
};

// 🌿 Start Free Trial Button
function StartFreeTrialButton() {
  const navigate = useNavigate();

  const handleStartTrial = () => {
    const now = new Date();
    localStorage.setItem("trialStart", now.toISOString());
    alert("🎉 Your 7-day free trial has started!");
    navigate("/soil-analysis"); // Redirect to SoilForm
  };

  return (
    <button
      onClick={handleStartTrial}
      className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition"
    >
      Start Free Trial
    </button>
  );
}

function App() {
  const isLoggedIn = !!localStorage.getItem("user");
  const user = isLoggedIn ? JSON.parse(localStorage.getItem("user")) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("trialStart");
    localStorage.removeItem("subscriptionActive");
    window.location.href = "/login";
  };

  return (
    <Router>
      {/* 🌾 Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="nav-left">
            <span className="logo">🌾 ShambaSmart</span>
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              Home
            </NavLink>
          </div>

          <ul className="nav-center">
            <li>
              <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/free-trial" className={({ isActive }) => (isActive ? "active" : "")}>
                Free Trial
              </NavLink>
            </li>
            <li>
              <NavLink to="/pricing" className={({ isActive }) => (isActive ? "active" : "")}>
                Subscription
              </NavLink>
            </li>
            <li>
              <NavLink to="/weather" className={({ isActive }) => (isActive ? "active" : "")}>
                Weather
              </NavLink>
            </li>
          </ul>

          <ul className="nav-right">
            {!isLoggedIn ? (
              <>
                <li>
                  <NavLink to="/signup" className={({ isActive }) => (isActive ? "active" : "")}>
                    Sign Up
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
                    Login
                  </NavLink>
                </li>
              </>
            ) : (
              <li className="flex items-center gap-3">
                <span style={{ color: "#166534", fontWeight: "600", fontSize: "0.95rem" }}>
                  👋 {user.name ? user.name.split(" ")[0] : user.email}
                </span>
                <button
                  onClick={handleLogout}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#166534",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>

      {/* 🌿 Routes */}
      <div className="page-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/free-trial" element={<FreeTrial StartButton={StartFreeTrialButton} />} />

          {/* Protected Routes */}
          <Route path="/pricing" element={<ProtectedRoute element={Pricing} />} />
          <Route path="/weather" element={<ProtectedRoute element={Weather} />} />
          <Route path="/soil-analysis" element={<ProtectedRoute element={SoilForm} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
