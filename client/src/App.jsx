import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FreeTrial from "./pages/FreeTrial";
import Pricing from "./pages/Pricing";
import Weather from "./pages/Weather";
import About from "./pages/About";
import SoilForm from "./components/SoilForm";
import { AuthContext } from "./context/AuthContext";
import "./index.css";

// Navbar component
function Navbar({ user, logout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container flex items-center justify-between">
          <div className="logo-container flex flex-col leading-tight">
          <span className="logo">🌾 ShambaSmart</span>
          <br />
          <span className="text-sm text-gray-600">AI-powered agriculture platform in Kenya</span>
          </div>
        <div className="nav-left">
          {user && <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Home</NavLink>}
        </div>
          

        <ul className="nav-center">
          {user && (
            <>
              <li><NavLink to="/about">About</NavLink></li>
              <li><NavLink to="/free-trial">Free Trial</NavLink></li>
              <li><NavLink to="/pricing">Subscription</NavLink></li>
              <li><NavLink to="/weather">Weather</NavLink></li>
            </>
          )}
        </ul>

        <ul className="nav-right">
          {!user ? (
            <>
              <li><NavLink to="/signup">Sign Up</NavLink></li>
              <li><NavLink to="/login">Login</NavLink></li>
            </>
          ) : (
            <li className="flex items-center gap-3">
              <span style={{ color: "#166534", fontWeight: "600" }}>👋 {user.email}</span>
              <button
                onClick={handleLogout}
                style={{ background: "transparent", border: "none", color: "#166534", fontWeight: "600", cursor: "pointer" }}
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

// Free Trial Button
function StartFreeTrialButton() {
  const navigate = useNavigate();

  const handleStartTrial = () => {
    const now = new Date();
    localStorage.setItem("trialStart", now.toISOString());
    alert("🎉 Your 7-day free trial has started!");
    navigate("/soil-analysis");
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

// RequireAuth wrapper
const RequireAuth = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Router>
      <Navbar user={user} logout={logout} />

      <div className="page-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route path="/" element={<RequireAuth user={user}><Home /></RequireAuth>} />
          <Route path="/about" element={<RequireAuth user={user}><About /></RequireAuth>} />
          <Route path="/free-trial" element={<RequireAuth user={user}><FreeTrial StartButton={StartFreeTrialButton} /></RequireAuth>} />
          <Route path="/pricing" element={<RequireAuth user={user}><Pricing /></RequireAuth>} />
          <Route path="/weather" element={<RequireAuth user={user}><Weather /></RequireAuth>} />
          <Route path="/soil-analysis" element={<RequireAuth user={user}><SoilForm /></RequireAuth>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
