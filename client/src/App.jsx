import React from "react";
import LoginPage from "./pages/LoginPage.jsx";
import { ToastContainer, toast } from "react-toastify";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import CreatePage from "./pages/CreatePage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import "./index.css";

export const backendUrl = "http://localhost:4000";
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<CreatePage />} />
        </Routes>
        <ToastContainer containerStyle={{ zIndex: 99999 }} />
      </BrowserRouter>
    </div>
  );
};

export default App;
