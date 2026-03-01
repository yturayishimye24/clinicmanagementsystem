import * as React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthContext } from "../context/authContext.jsx";
import { ThemeProvider } from "./context/themeContext.jsx";
import "./index.css";
import "flowbite";
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error(
    "Missing Clerk publishable key. Please set VITE_CLERK_PUBLISHABLE_KEY in your environment variables.",
  );
}
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
    >
      <ThemeProvider>
        <AuthContext>
          <App />
        </AuthContext>
      </ThemeProvider>
    </ClerkProvider>
  </React.StrictMode>,
);
