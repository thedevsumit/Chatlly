import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import SignUpPage from "./pages/SignUpPage";
import { Loader } from "lucide-react";
import { userAuthStore } from "./store/userAuthStore";
import { ToastContainer } from "react-toastify";
const App = () => {
  const { checkAuth, authUser, isCheckingAuth,onlineUsers } = userAuthStore();
  console.log(onlineUsers)
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-17 animate-spin" />
      </div>
    );
  }
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
