import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App.jsx";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";
import { Activity, Globe, Apple, ArrowLeft } from "lucide-react";
import Footer from "../components/Footer.jsx";

const LoginPage = () => {
  const navigate = useNavigate();
  const [currentState, setCurrentState] = useState("Login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [goingBack, setGoingBack] = useState(false);
  const [loading, setLoading] = useState(false);

  const ChangeToSignup = (e) => {
    e.preventDefault();
    setCurrentState("SignUp");
  };

  const ChangeToLogin = (e) => {
    e.preventDefault();
    setCurrentState("Login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTimeout(setLoading(true), 2000);

    try {
      if (currentState === "SignUp") {
        if (!username.trim() || !email.trim() || !password.trim()) {
          toast.error("Please fill all fields.");
          setLoading(false);
          return;
        }
        const response = await axios.post(`${backendUrl}/api/users/signup`, {
          username,
          email,
          password,
        });

        if (response.data.success) {
          setGoingBack(true);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("name", response.data.username);
          toast.success(response.data.message);
          setTimeout(navigate("/home"), 1000);
        } else {
          toast.error("Error signing up: " + response.data.message);
        }
      } else {
        if (!email.trim() || !password.trim()) {
          toast.error("Please fill all fields.");
          setLoading(false);
          return;
        }
        const response = await axios.post(`${backendUrl}/api/users/login`, {
          email,
          password,
        });

        if (response.data.success) {
          
          setTimeout(setLoading(true), 2000);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("name", response.data.username);
          toast.success("Login successfully!");
          setTimeout(() => navigate("/home"), 100);
        } else {
          toast.error("Error logging in");
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      setGointBack(false);
    }
  };
  {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <OrbitProgress />
        </div>
      );
    }
  }
  return (
    <>
      <div className="flex items-center justify-center min-h-screen flex-col ">
        <Link
          to={"/"}
          className="absolute left-20 top-50 flex items-center justify-center bg-white shadow shadow-gray-400 px-2 py-3"
        >
          <>
            {goingBack ? (
              <OrbitProgress
                color="#32cd32"
                size="10"
                text="black"
                textColor=""
              />
            ) : (
              <ArrowLeft />
            )}

            {goingBack ? "Loading..." : "Back Home"}
          </>
        </Link>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <Activity size={80} />
            </div>
            <h1 className="text-2xl font-semibold">{currentState} to Clinic</h1>
          </div>

          {currentState === "SignUp" && (
            <div className="mb-4">
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border border-black rounded-md mb-2 focus:border-gray-500 focus:ring-2 focus:ring-green-200 transition-all"
              />
            </div>
          )}

          <div className="mb-4">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-black rounded-md mb-2 focus:border-gray-500 focus:ring-2 focus:ring-green-200 transition-all"
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center">
              <label>Password</label>
              <a href="#" className="text-green-500 hover:underline">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-black rounded-md mb-2 focus:border-gray-500 focus:ring-2 focus:ring-green-200 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-gray-500 text-white rounded-md flex justify-center items-center gap-2 mb-4"
            disabled={loading}
          >
            {currentState === "Login" ? "Signin" : "Signup"}
          </button>

          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="bg-gray-500 h-0.5 w-[50%]"></span>
            <span>Or</span>
            <span className="bg-black h-0.5 w-[50%]"></span>
          </div>

          <div className="flex flex-col gap-4 mb-6">
            <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-md p-2 bg-gray-100">
              <Globe size={32} color="#4285F4" /> Continue with Google
            </button>
            <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-md p-2 bg-gray-100">
              <Apple size={32} color="black" /> Continue with Apple
            </button>
          </div>

          <div className="flex justify-center gap-2 text-sm">
            <span>
              {currentState === "Login"
                ? "New to Clinic?"
                : "Already have an account?"}
            </span>
            <button
              type="button"
              onClick={
                currentState === "Login" ? ChangeToSignup : ChangeToLogin
              }
              className="text-green-500 font-semibold"
            >
              {currentState === "Login" ? "Create Account" : "Sign In"}
            </button>
          </div>
          <ToastContainer position="bottom-right" />
        </form>
        <Footer />
      </div>
    </>
  );
};

export default LoginPage;
