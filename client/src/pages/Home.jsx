import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import SoilForm from "../components/SoilForm";
import { motion } from "framer-motion";
import { Leaf, Droplets, Sun } from "lucide-react";
import { AuthContext } from "../context/AuthContext"; // ✅ Ensure this exists

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleProtectedAccess = () => {
    if (!user) {
      alert("Please sign up or log in to access the Soil Analysis Tool.");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 flex flex-col items-center">
      {/* ✅ Add top padding to ensure content shows below fixed navbar */}
      <div className="w-full mt-20 flex flex-col items-center">
        {/* Header Section */}
        <header className="w-full text-center px-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-extrabold text-green-800 flex justify-center items-center gap-2"
          >
            <Leaf className="text-green-600" size={40} />
            ShambaSmart
          </motion.h1>
          <p className="text-gray-600 text-lg mt-2">
            Smarter farming decisions through our partners'
            <br />
            expertise-powered soil insights.
          </p>
        </header>

        {/* Info Cards Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-8 mt-12 max-w-6xl w-full">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-green-100 text-center transition-transform"
          >
            <Sun className="mx-auto text-yellow-500 mb-3" size={44} />
            <h3 className="font-semibold text-green-700 text-xl mb-2">
              Optimise Yield
            </h3>
            <p className="text-gray-600 text-sm">
              Use expertise-powered insights and our partners to analyse soil data
              <br />
              and improve your crop performance.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-green-100 text-center transition-transform"
          >
            <Droplets className="mx-auto text-blue-500 mb-3" size={44} />
            <h3 className="font-semibold text-green-700 text-xl mb-2">
              Monitor Moisture
            </h3>
            <p className="text-gray-600 text-sm">
              Track soil moisture levels and plan irrigation effectively.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-green-100 text-center transition-transform"
          >
            <Leaf className="mx-auto text-green-500 mb-3" size={44} />
            <h3 className="font-semibold text-green-700 text-xl mb-2">
              Sustainable Growth
            </h3>
            <p className="text-gray-600 text-sm">
              Promote eco-friendly and efficient farming practices.
            </p>
          </motion.div>
        </section>

        {/* Soil Analysis Section */}
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white shadow-2xl rounded-3xl mt-16 mb-20 w-full max-w-2xl p-10 border border-green-200"
        >
          <h2 className="text-2xl font-semibold text-green-800 mb-4 text-center">
            Soil Analysis Tool
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Enter your soil data to get tailored insights and 
            <br />
            recommendations based on our partners' expertise.
          </p>

          {/* ✅ Only show form if logged in */}
          {user ? (
            <SoilForm />
          ) : (
            <div
              onClick={handleProtectedAccess}
              className="text-center cursor-pointer py-6 bg-green-50 border border-green-300 rounded-xl hover:bg-green-100 transition"
            >
              <p className="text-green-800 font-medium">
                You must sign up or log in to use this tool.
              </p>
              <button className="mt-3 px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800">
                Go to Login / Signup
              </button>
            </div>
          )}
        </motion.section>
      </div>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-4 text-center w-full mt-auto">
        <p className="text-sm opacity-90">
          © {new Date().getFullYear()} ShambaSmart — Built for Smart Agriculture
        </p>
      </footer>
    </div>
  );
}
