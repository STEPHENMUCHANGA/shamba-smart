import React, { createContext, useState, useEffect } from "react";

// ✅ Create the context
export const AuthContext = createContext();

// ✅ Create the provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on page reload
  useEffect(() => {
    const savedUser = localStorage.getItem("shambaUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save user to localStorage when logged in
  const login = (email, password) => {
    // ✅ Normally you'd call your backend here to verify credentials
    const savedUser = JSON.parse(localStorage.getItem("shambaUser"));
    if (savedUser && savedUser.email === email && savedUser.password === password) {
      setUser(savedUser);
      alert("Login successful!");
      return true;
    } else {
      alert("Invalid credentials or account not found.");
      return false;
    }
  };

  // ✅ Prevent multiple signups with same email
  const signup = (email, password) => {
    const savedUser = JSON.parse(localStorage.getItem("shambaUser"));
    if (savedUser && savedUser.email === email) {
      alert("This email is already registered. Please log in instead.");
      return false;
    }

    const newUser = { email, password };
    localStorage.setItem("shambaUser", JSON.stringify(newUser));
    setUser(newUser);
    alert("Signup successful!");
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("shambaUser");
    alert("Logged out successfully.");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
