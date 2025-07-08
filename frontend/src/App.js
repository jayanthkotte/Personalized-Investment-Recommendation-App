import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RiskProfile from "./pages/RiskProfile";
import Dashboard from "./pages/Dashboard";
import BankUpload from "./pages/BankUpload";
import Investment from "./pages/Investment";
import Recommendation from "./pages/Recommendation";
import Tips from "./pages/Tips";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/risk-profile" element={<RiskProfile />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/bank-upload" element={<BankUpload />} />
      <Route path="/investment" element={<Investment />} />
      <Route path="/recommendation" element={<Recommendation />} />
      <Route path="/tips" element={<Tips />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App; 