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
import SettingsPage from "./pages/SettingsPage.jsx";

export const backendUrl = "http://localhost:4000";

// ErrorBoundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
      console.log("Encountered a big error ",error);
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Log error details to console (or send to a logging service)
    console.error("Error caught by ErrorBoundary:", error);
    console.error("Component Stack:", info.componentStack);
  }

 render() {
  if (this.state.hasError) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#161618', // Dark background matching the image
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '20px',
        gap: '8vw', // Creates a responsive gap between the text and the image
        flexWrap: 'wrap-reverse' // Ensures the text stacks under the image on mobile
      }}>
        
        {/* Left Side: Text and Button */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          maxWidth: '400px'
        }}>
          <h1 style={{ 
            fontSize: '42px', 
            fontWeight: 'bold', 
            margin: '0 0 16px 0',
            letterSpacing: '-0.5px'
          }}>
            Error occurred
          </h1>
          <p style={{ 
            color: '#d1d5db', 
            margin: '0 0 32px 0', 
            fontSize: '18px', 
            lineHeight: '1.5' 
          }}>
            An error has occurred. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 28px',
              backgroundColor: '#e5e5e5',
              color: '#111827',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              letterSpacing: '0.5px'
            }}
          >
            TRY AGAIN
          </button>
        </div>

        {/* Right Side: Neon Sign Image */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {/* Be sure to update the src path to wherever you save your image asset */}
          <img 
            src="/public/images/GlowingError.jpg" 
            alt="Glowing error warning sign" 
            style={{
              maxWidth: '100%',
              height: 'auto',
              maxHeight: '400px',
              objectFit: 'contain'
            }}
          />
        </div>

      </div>
    );
  }

  return this.props.children;
}
}

const App = () => {
  return (
    <ErrorBoundary>
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
              <Route path="settings" element={<SettingsPage />} />
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
    </ErrorBoundary>
  );
};

export default App;
