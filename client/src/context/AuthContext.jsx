import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  /**
   * ----------------------------------------
   *  LOAD ACTIVE SESSION (NOT SIGNUP DATA)
   * ----------------------------------------
   */
  useEffect(() => {
    const activeSession = sessionStorage.getItem("shambaSession");
    if (activeSession) {
      setUser(JSON.parse(activeSession));   // User is logged in
    } else {
      setUser(null); // No active login session
    }
  }, []);

  /**
   * ----------------------------------------
   *  LOGIN
   * ----------------------------------------
   */
  const login = (email, password) => {
    const registeredUser = JSON.parse(localStorage.getItem("shambaUser"));

    if (
      registeredUser &&
      registeredUser.email === email &&
      registeredUser.password === password
    ) {
      setUser(registeredUser);

      // Create active login session
      sessionStorage.setItem("shambaSession", JSON.stringify(registeredUser));

      alert("Login successful!");
      return true;
    }

    alert("Invalid credentials or account not found.");
    return false;
  };

  /**
   * ----------------------------------------
   *  SIGNUP
   * ----------------------------------------
   */
  const signup = (email, password) => {
    const existingUser = JSON.parse(localStorage.getItem("shambaUser"));

    if (existingUser && existingUser.email === email) {
      alert("This email is already registered. Please log in instead.");
      return false;
    }

    const newUser = { email, password };
    localStorage.setItem("shambaUser", JSON.stringify(newUser));

    // Automatically log in new user
    sessionStorage.setItem("shambaSession", JSON.stringify(newUser));
    setUser(newUser);

    alert("Signup successful!");
    return true;
  };

  /**
   * ----------------------------------------
   *  LOGOUT
   * ----------------------------------------
   */
  const logout = () => {
    setUser(null);

    // Clear ONLY login session, not the saved account
    sessionStorage.removeItem("shambaSession");

    alert("Logged out successfully.");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
