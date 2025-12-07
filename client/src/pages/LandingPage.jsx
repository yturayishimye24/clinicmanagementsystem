import React, { useRef, useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";


import {
  Activity,
  Phone,
  ArrowRight,
  Check,
  Users,
  Clock,
  Shield,
  X,
  Globe,
  Apple,
} from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";
import { backendUrl } from "../App.jsx";
import techImage from "../../images/techImage.png";
import FAQ from "../components/Faqs.jsx";
import TEAM from "../components/teamSection.jsx";
import Footer from "../components/Footer.jsx";
import { useAuth } from "../../context/authContext.jsx";

const LandingPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentState, setCurrentState] = useState("Login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("nurse");
  const teamRef = useRef(null);
  const faqRef = useRef(null);
  const HomeRef = useRef(null);
  const servicesRef = useRef(null);
  const { login } = useAuth();
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const goToHome = () =>
    HomeRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToFaqs = () =>
    faqRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToTeam = () =>
    teamRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToServices = () =>
    servicesRef.current?.scrollIntoView({ behavior: "smooth" });

  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => {
    setShowLoginModal(false);
    setEmail("");
    setUsername("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
          role,
          password,
        });

        if (response.data.success) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("name", response.data.username);
          localStorage.setItem("role", response.data.role);
          if (response.data.role === "nurse") {
            toast.success(response.data.message);
            setTimeout(() => navigate("/home"), 1000);
          } else if (response.data.role === "admin") {
            toast.success(response.data.message);
            setTimeout(() => navigate("/home/admin"), 1000);
          }
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
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("name", response.data.username);
          localStorage.setItem("role", response.data.role);
          const userData = {
            username: response.data.username,
            token: response.data.token,
            role: response.data.role,
          };

          login(userData);

          if (response.data.role === "nurse") {
            setTimeout(() => navigate("/home"), 1000);
            toast.success("Logged in as nurse successfully!");
          } else {
            setTimeout(() => navigate("/home/admin"), 1000);
            toast.success("Logged as Admin successfully!");
          }
        } else {
          toast.error("Incorrect password or email!");
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showLoginModal) {
        closeLoginModal();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showLoginModal]);

  const features = [
    {
      icon: Users,
      title: "Patient Management",
      description:
        "Efficiently manage patient records, appointments, and medical history in one place",
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description:
        "Stay updated with instant notifications and real-time patient data synchronization",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your data is encrypted and protected with industry-standard security measures",
    },
  ];

  const services = [
    "Recording patients",
    "Requesting more medicines from Lab",
    "Updating the patient's infos",
    "Deleting the patient",
    "Reporting",
    "Statistics",
  ];

  return (
    <div className="font-sans min-h-screen bg-gray-50">
      <header className="bg-white text-gray-900 flex items-center justify-between shadow-sm px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
          <Activity size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span className="font-medium hidden sm:inline">
            Welcome to Clinic Workspace
          </span>
          <span className="font-medium sm:hidden">Clinic Workspace</span>
        </div>
        <button
          type="button"
          className="bg-white text-gray-900 border-2 border-gray-200 rounded-xl sm:rounded-2xl px-3 sm:px-5 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 shadow hover:bg-gray-50 transition text-xs sm:text-sm"
        >
          <Phone size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span className="hidden sm:inline">Contact Us</span>
          <span className="sm:hidden">Contact</span>
        </button>
      </header>

      <nav className="bg-white shadow flex items-center justify-between py-3 sm:py-4 px-4 sm:px-6 lg:px-8 sticky top-0 w-full z-50">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black rounded-xl sm:rounded-2xl flex items-center justify-center shadow">
            <Activity color="white" size={16} className="sm:w-5 sm:h-5" />
          </div>
          <h1 className="text-lg sm:text-2xl font-bold">
            <span className="text-black">Clinic</span>{" "}
            <span className="text-gray-600 hidden sm:inline">Workspace</span>
          </h1>
        </div>

        <ul className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-gray-600">
          <li
            onClick={goToHome}
            className="cursor-pointer hover:text-black transition"
          >
            Home
          </li>
          <li
            onClick={scrollToServices}
            className="cursor-pointer hover:text-black transition"
          >
            Services
          </li>
          <li
            onClick={scrollToFaqs}
            className="cursor-pointer hover:text-black transition"
          ></li>
          <li
            onClick={scrollToTeam}
            className="cursor-pointer hover:text-black transition"
          >
            Team
          </li>
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <button className="hidden sm:block px-4 lg:px-5 py-2 lg:py-2.5 rounded-xl lg:rounded-2xl text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-100 transition">
            Admin
          </button>
          <button
            onClick={openLoginModal}
            className="bg-black text-white rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold shadow transition-all flex items-center gap-1.5 sm:gap-2 hover:bg-gray-800"
          >
            <span className="hidden sm:inline">Get Started</span>
            <span className="sm:hidden">Login</span>
            <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
      </nav>

      <main className="min-h-screen">
        <div
          className="text-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white"
          ref={HomeRef}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-gray-900 leading-tight">
            Manage Patients with <br />
            <span className="text-gray-600">Better Communication</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
            Join a community where every patient feels understood and receives
            the desired service. Experience seamless healthcare management with
            our comprehensive platform.
          </p>
          <button
            onClick={openLoginModal}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-black text-white text-base sm:text-lg font-semibold rounded-xl sm:rounded-2xl shadow hover:bg-gray-800 transition flex items-center gap-2 sm:gap-3 mx-auto"
          >
            Get started Now
            <ArrowRight size={20} className="sm:w-[22px] sm:h-[22px]" />
          </button>
        </div>

        <div
          className="bg-fixed bg-cover bg-center w-full h-64 sm:h-80 md:h-96 lg:h-[500px] relative shadow-inner flex items-center justify-center"
          style={{ backgroundImage: `url(${techImage})` }}
        >
          <div className="text-center text-white px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
              Modern Healthcare Technology
            </h2>
            <p className="text-base sm:text-lg md:text-xl">
              Built for efficiency, designed for care
            </p>
          </div>
        </div>

        <div className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-16 text-gray-900">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 sm:p-8 shadow hover:shadow-lg transition border border-gray-100"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-black rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gray-50"
          ref={servicesRef}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-16 text-gray-900">
            Our Services
          </h2>
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow hover:shadow-md transition border flex items-center gap-3 sm:gap-4"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <Check className="text-white" size={18} />
                </div>
                <p className="text-gray-900 font-semibold text-sm sm:text-base">
                  {service}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white text-center">
          <div className="max-w-4xl mx-auto bg-gray-900 rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-white">
              Ready to Transform Your Healthcare Management?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-6 sm:mb-8">
              Join hundreds of healthcare professionals who trust our platform
            </p>
            <button
              onClick={openLoginModal}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-black text-base sm:text-lg font-semibold rounded-xl sm:rounded-2xl shadow hover:bg-gray-100 transition flex items-center gap-2 sm:gap-3 mx-auto"
            >
              Start Your Journey
              <ArrowRight size={20} className="sm:w-[22px] sm:h-[22px]" />
            </button>
          </div>
        </div>

        <div className="sticky top-20 bg-white rounded-full py-2 sm:py-3 px-4 sm:px-6 w-fit mx-auto flex items-center gap-4 sm:gap-8 text-gray-600 shadow mt-6 sm:mt-10 mb-6 sm:mb-10 z-40 border text-xs sm:text-sm">
          <button
            onClick={scrollToTeam}
            className="font-semibold hover:text-black"
          >
            Team
          </button>
          <button
            onClick={scrollToServices}
            className="font-semibold hover:text-black"
          >
            Services
          </button>
          <button
            onClick={scrollToFaqs}
            className="font-semibold hover:text-black"
          >
            FAQs
          </button>
        </div>

        <div ref={teamRef} className="py-5 px-4 bg-white">
          <TEAM />
        </div>

        <div ref={faqRef} className="py-16 px-4 bg-gray-50">
          <FAQ />
        </div>
      </main>

      {showLoginModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={closeLoginModal}
        >
          <div
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeLoginModal}
              className="absolute right-3 top-3 sm:right-4 sm:top-4 p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition z-10"
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>

            <div className="p-6 sm:p-8">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <OrbitProgress />
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center mb-6">
                    <div className="bg-gray-100 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
                      <Activity size={48} className="sm:w-20 sm:h-20" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-center">
                      {currentState} to Clinic
                    </h1>
                  </div>

                  <form onSubmit={handleSubmit}>
                    {currentState === "SignUp" && (
                      <>
                        <div className="mb-4">
                          <label className="block mb-2 font-medium text-sm sm:text-base">
                            Username
                          </label>
                          <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:border-gray-500 focus:ring-2 focus:ring-green-200 transition-all text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 font-arial text-sm sm:text-base">
                            Role
                          </label>

                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md
                                   focus:outline-none focus:ring-2 focus:ring-green-500
                                 focus:border-green-500 bg-white"
                            onChange={(e) => setRole(e.target.value)}
                          >
                            <option value="">Select a role</option>
                            <option value="nurse">Nurse</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      </>
                    )}

                    <div className="mb-4">
                      <label className="block mb-2 font-medium text-sm sm:text-base">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:border-gray-500 focus:ring-2 focus:ring-green-200 transition-all text-sm sm:text-base"
                      />
                    </div>

                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <label className="font-medium text-sm sm:text-base">
                          Password
                        </label>
                        <a
                          href="#"
                          className="text-green-500 hover:underline text-xs sm:text-sm"
                        >
                          Forgot password?
                        </a>
                      </div>
                      <div style={{ position: "relative", width: "100%" }}>
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:border-gray-500 focus:ring-2 focus:ring-green-200 transition-all text-sm sm:text-base"
                        />
                        <span
                          onClick={handleShowPassword}
                          style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                          }}
                        >
                          {showPassword ? <FiEye /> : <FiEyeOff />}
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full p-2.5 sm:p-3 bg-black text-white rounded-lg flex justify-center items-center gap-2 mb-4 font-semibold hover:bg-gray-800 transition text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {currentState === "Login" ? "Sign In" : "Sign Up"}
                    </button>

                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="bg-gray-300 h-0.5 w-full"></span>
                      <span className="text-gray-500 text-xs sm:text-sm">
                        Or
                      </span>
                      <span className="bg-gray-300 h-0.5 w-full"></span>
                    </div>

                    <div className="flex flex-col gap-3 mb-6">
                      <button
                        type="button"
                        className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg p-2.5 sm:p-3 bg-white hover:bg-gray-50 transition text-xs sm:text-sm"
                      >
                        <Globe
                          size={20}
                          className="sm:w-6 sm:h-6"
                          color="#4285F4"
                        />{" "}
                        Continue with Google
                      </button>
                      <button
                        type="button"
                        className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg p-2.5 sm:p-3 bg-white hover:bg-gray-50 transition text-xs sm:text-sm"
                      >
                        <Apple
                          size={20}
                          className="sm:w-6 sm:h-6"
                          color="black"
                        />{" "}
                        Continue with Apple
                      </button>
                    </div>

                    <div className="flex justify-center gap-2 text-xs sm:text-sm flex-wrap">
                      <span className="text-gray-600">
                        {currentState === "Login"
                          ? "New to Clinic?"
                          : "Already have an account?"}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentState(
                            currentState === "Login" ? "SignUp" : "Login"
                          )
                        }
                        className="text-green-500 font-semibold hover:underline"
                      >
                        {currentState === "Login"
                          ? "Create Account"
                          : "Sign In"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
      <Footer />
    </div>
  );
};

export default LandingPage;
