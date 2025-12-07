import React from "react";
import LoginPage from "./pages/LoginPage.jsx";
import { ToastContainer, toast } from "react-toastify";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import CreatePage from "./pages/CreatePage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import {AuthContext} from "../context/authContext.jsx"
import "./index.css";
import 'flowbite';


export const backendUrl = "http://localhost:4000";
const App = () => {
  return (
    <div data-theme="cupcake">
      <AuthContext>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<CreatePage />} />
          <Route path="/home/admin" element={<AdminPage/>} />
        </Routes>
        <ToastContainer containerStyle={{ zIndex: 99999 }} />
      </BrowserRouter>
      </AuthContext>
    </div>
  );
};

export default App;
