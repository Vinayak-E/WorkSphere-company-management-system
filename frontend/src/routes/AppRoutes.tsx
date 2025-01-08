import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../pages/Landing";
import Login from "../components/Log";
import Register from "../components/Register";
import OtpVerification from "../pages/OtpVerification";

const AppRoutes: React.FC = () => {
  return (
  
      <Routes>
        <Route path="/" element={<Navbar/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/verifyOtp" element={<OtpVerification />} />

      </Routes>

  );
};

export default AppRoutes;
