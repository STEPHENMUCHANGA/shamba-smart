import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Leaf, Home } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Use global auth state instead of localStorage
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout(); // Clears session + user
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white shadow-md py-3 px-8 flex items-center justify-between fixed top-0 left-0 z-50">
      {/* Left Section: Brand + Home */}
      <div className="flex flex-col items-start">
        {/* Brand */}
        <div className="flex items-center gap-2 text-green-800 font-bold text-2xl">
          <Leaf className="text-green-700" size={30} />
          <span>ShambaSmart</span>
        </div>

        {/* Home Link */}
        <Link
          to="/"
          className={`flex items-center gap-1 mt-1 text-green-700 hover:text-green-500 transition font-medium ${
            location.pathname === "/" ? "text-green-600" : ""
          }`}
        >
          <Home size={18} />
          Home
        </Link>
      </div>

      {/* Middle Links */}
      <div className="flex items-center gap-10 text-green-700 font-medium">
        <Link
          to="/about"
          className={`hover:text-green-500 transition ${
            location.pathname === "/about" ? "text-green-600" : ""
          }`}
        >
          About
        </Link>

        <Link
          to="/pricing"
          className={`hover:text-green-500 transition ${
            location.pathname === "/pricing" ? "text-green-600" : ""
          }`}
        >
          Subscription
        </Link>

        <Link
          to="/free-trial"
          className={`hover:text-green-500 transition ${
            location.pathname === "/free-trial" ? "text-green-600" : ""
          }`}
        >
          Free Trial
        </Link>

        <Link
          to="/weather"
          className={`hover:text-green-500 transition ${
            location.pathname === "/weather" ? "text-green-600" : ""
          }`}
        >
          Weather
        </Link>
      </div>

      {/* Right Section: User Info or Login/Signup */}
      <div className="flex items-center gap-6">
        {!user ? (
          <>
            {/* Not logged in */}
            <Link
              to="/login"
              className={`text-green-700 hover:text-green-500 transition font-medium ${
                location.pathname === "/login" ? "text-green-600" : ""
              }`}
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="bg-green-700 text-white px-4 py-1.5 rounded-lg hover:bg-green-600 transition font-medium"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            {/* Logged in */}
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg font-medium">
              👋 {user?.name?.split(" ")[0] || user.email}
            </span>

            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800 font-medium transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
