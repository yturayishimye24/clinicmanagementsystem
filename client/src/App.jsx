import * as React from "react";
import LoginPage from "./pages/LoginPage.jsx";
import { ToastContainer } from "react-toastify";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import CreatePage from "./pages/CreatePage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import { AuthContext } from "../context/authContext.jsx";
import "./index.css";
import "flowbite";
import PrivateRoutes from "./utils/PrivateRoutes.jsx";
import RoleBasedRoutes from "./utils/RoleBasedRoutes.jsx";
import PatientList from "./pages/PatientList.jsx";
import RequestList from "./pages/RequestList.jsx";
import ReportList from "./pages/ReportList.jsx";

export const backendUrl = "http://localhost:4000";
const App = () => {
  return (
    <AuthContext>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<CreatePage />}>
            <Route index element={<CreatePage />} />{" "}
            <Route path="patients" element={<PatientList />} />
            <Route path="requests" element={<RequestList />} />
            <Route path="reports" element={<ReportList />} />
          </Route>

          <Route
            path="/home/admin"
            element={
              <PrivateRoutes>
                <RoleBasedRoutes requiredRole={["admin"]}>
                  <AdminPage />
                </RoleBasedRoutes>
              </PrivateRoutes>
            }
          />
        </Routes>
        <ToastContainer containerStyle={{ zIndex: 99999 }} />
      </BrowserRouter>
    </AuthContext>
  );
};

export default App;
