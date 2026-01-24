import React, { useRef, useState, useEffect } from "react";
import {FiEye, FiEyeOff} from "react-icons/fi";
import {
  Spinner,
  Button,
  Card,
  Checkbox,
  Label,
  TextInput,
} from "flowbite-react";
import { Alert } from "flowbite-react";

import { Activity, Phone, ArrowRight, Check, X } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {ClipLoader} from "react-spinners";
import { backendUrl } from "../App.jsx";
import techImage from "../../images/techImage.png";
import FAQ from "../components/Faqs.jsx";
import TEAM from "../components/teamSection.jsx";

import {
  Footer,
  FooterBrand,
  FooterCopyright,
  FooterDivider,
  FooterLink,
  FooterLinkGroup,
} from "flowbite-react";
import { useAuth } from "../../context/authContext.jsx";
import { Popover } from "flowbite-react";
const LandingPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const teamRef = useRef(null);
  const faqRef = useRef(null);
  const HomeRef = useRef(null);
  const servicesRef = useRef(null);
  const whyChooseUsRef = useRef(null);
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
  const scrollToWhyUs = () => {
    whyChooseUsRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => {
    setShowLoginModal(false);
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email.trim() || !password.trim()) {
        toast.error("Please fill all fields.");
        setLoading(false);
        return;
      }
      const response = await axios.post(`${backendUrl}/api/accounts/login`, {
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const services = [
    "Recording patients",
    "Requesting more medicines from Lab",
    "Updating the patient's infos",
    "Deleting the patient",
    "Reporting",
    "Statistics",
  ];
  const content = (
    <div className="w-64 text-sm text-gray-500 dark:text-gray-400 z-99">
      <div className="border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Contact Admin
        </h3>
      </div>
      <div className="px-3 py-2 z-99">
        <p>+250 788 932 710</p>
      </div>
    </div>
  );
  return (
    <div
      className={`font-sans min-h-screen bg-white transition-all duraction-300 ${
        showLoginModal === true ? "blur-md pointer-event-none select-none " : ""
      } `}
    >
      {showAlert && (
        <Alert
          color="warning"
          onDismiss={() => setShowAlert(false)}
          className="fixed top-0 left-0 right-0 z-50 p-1 rounded-none flex items-cente justify-center"
        >
          <span className="font-medium">Welcome to Clinic Workspace</span> A
          place where you can manage your patients and their information.
        </Alert>
      )}
      <header className="bg-white text-gray-900 flex items-center justify-between shadow-sm px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-green-600 font-bold">
          <Activity size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span className="font-medium sm:inline">
            Welcome to Clinic Workspace
          </span>
          <span className="font-medium sm:hidden">Clinic Workspace</span>
        </div>

        <Popover content={content} trigger="hover" className="z-99">
          <Button className="bg-white border-gray-900 shadow-sm text-black rounded-lg ">
            Contact Us
          </Button>
        </Popover>

        <span className="sm:hidden">Contact</span>
      </header>

      <nav className="bg-white shadow flex items-center justify-between py-3 sm:py-4 px-4 sm:px-6 lg:px-8 sticky top-0 w-full z-50">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black rounded-xl sm:rounded-2xl flex items-center justify-center shadow">
            <Activity color="black" size={16} className="sm:w-5 sm:h-5" />
          </div>
          <h1 className="text-lg sm:text-2xl font-bold">
            <span className="text-black">Clinic</span>{" "}
            <span className="text-gray-600 sm:inline">Workspace</span>
          </h1>
        </div>

        <ul className="md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-gray-600">
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
            className="bg-black text-black rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold shadow transition-all flex items-center gap-1.5 sm:gap-2"
          >
            <span className="sm:inline text-black">Get Started</span>
            <span className="sm:hidden">Login</span>
            <ArrowRight
              size={16}
              color="black"
              className="sm:w-[18px] sm:h-[18px]"
            />
          </button>
        </div>
      </nav>

      <main className="min-h-screen font-poppins">
        <div ref={HomeRef} className="relative text-center bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 items-center justify-around  clip-path-[ellipse(85%_100%_at_50%_0%)]">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-poppins mb-4 sm:mb-6 text-gray-900 leading-tight">
              <p>Manage Patients</p>
              <p>
        <span className="bg-[#27d895] text-white px-2">
          Better Communication
        </span>
              </p>
            </h1>

            <p className="text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl font-poppins max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
              Join a community where every patient feels understood and receives
              <br />
              the desired service. Experience seamless healthcare management
              with
              <br />
              our comprehensive platform.
            </p>

            <button
                onClick={openLoginModal}
                className="bg-[#2fd033] text-white rounded-xl flex items-center justify-center p-3 gap-2 mx-auto"
            >
              Get started Now
              <ArrowRight size={20} />
            </button>
          </div>
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

        <div
          className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white"
          ref={whyChooseUsRef}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center hover:cursor-pointer mb-10 sm:mb-16 text-gray-400">
            Why Choose Us
          </h2>
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-center md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card
                className="max-w-sm"
                imgAlt="Apple Watch Series 7 in colors pink, silver, and black"
                imgSrc="/images/secure-private.jpeg"
              >
                <a href="#">
                  <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    Scanning eye with modern technology, we ensure efficiency.
                  </h5>
                </a>
                <div className="mb-5 mt-2.5 flex items-center">
                  <svg
                    className="h-5 w-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className="h-5 w-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className="h-5 w-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className="h-5 w-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className="h-5 w-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-3 mr-2 rounded bg-cyan-100 px-2.5 py-0.5 text-xs font-semibold text-cyan-800 dark:bg-cyan-200 dark:text-cyan-800">
                    5.0
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    That is it
                  </span>
                  <a
                    onClick={() => setShowLoginModal(true)}
                    className="rounded-lg bg-cyan-700 hover:cursor-pointer px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                  >
                    Right space
                  </a>
                </div>
              </Card>

              <Card
                className="max-w-sm"
                imgAlt="Apple Watch Series 7 in colors pink, silver, and black"
                imgSrc="/images/techImage.png"
              >
                <a href="#">
                  <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    Patients management with Clinic Workspace
                  </h5>
                </a>
                <div className="mb-5 mt-2.5 flex items-center">
                  <svg
                    className="h-5 w-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className="h-5 w-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className="h-5 w-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className="h-5 w-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className="h-5 w-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-3 mr-2 rounded bg-cyan-100 px-2.5 py-0.5 text-xs font-semibold text-cyan-800 dark:bg-cyan-200 dark:text-cyan-800">
                    5.0
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    Your time
                  </span>
                  <a
                    onClick={() => setShowLoginModal(true)}
                    className="rounded-lg bg-cyan-700 px-5 hover:cursor-pointer py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                  >
                    Be Part of Us
                  </a>
                </div>
              </Card>

              <Card
                className="max-w-sm"
                imgAlt="Apple Watch Series 7 in colors pink, silver, and black"
                imgSrc="/images/patients-management.png"
              >
                <a href="#">
                  <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    First Aid services Available
                  </h5>
                </a>
                <div className="mb-5 mt-2.5 flex items-center">
                  <svg
                    className="h-5 w-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className="h-5 w-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className="h-5 w-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className="h-5 w-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className="h-5 w-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-3 mr-2 rounded bg-cyan-100 px-2.5 py-0.5 text-xs font-semibold text-cyan-800 dark:bg-cyan-200 dark:text-cyan-800">
                    5.0
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    Free tryal
                  </span>
                  <a
                    onClick={() => setShowLoginModal(true)}
                    className="rounded-lg bg-cyan-700 px-5 py-2.5 hover:cursor-pointer text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                  >
                    Join
                  </a>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <div
          className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gray-50"
          ref={servicesRef}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-16 text-gray-400">
            Our Services
          </h2>
          <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-2 gap-4 sm:gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white sm:rounded-2xl p-4 sm:p-6 shadow hover:shadow-md transition border-l-5 border-green-500 flex items-center gap-3 sm:gap-4"
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
          <div className="max-w-4xl mx-auto bg-gray-900 rounded-lg sm:rounded-3xl p-8 sm:p-12 shadow-xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-white">
              Ready to Transform Your Healthcare Management?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-6 sm:mb-8">
              Join hundreds of healthcare professionals who trust our platform
            </p>
            <button
              onClick={openLoginModal}
              className="px-6 sm:px-8 py-3 sm:py-4  text-black backdrop-blur-4xl text-black text-base sm:text-lg font-semibold rounded-xl sm:rounded-2xl shadow bg-gray-100 transition flex items-center gap-2 sm:gap-3 mx-auto"
            >
              Start Your Journey
              <ArrowRight size={20} className="sm:w-[22px] sm:h-[22px]" />
            </button>
          </div>
        </div>
        <div
          className="
  bg-white shadow-md rounded-full
  py-5 px-4 w-[600px] mx-auto
  flex justify-center items-center gap-4 sm:gap-8
  text-gray-600 text-xl sm:text-sm
  mt-6 sm:mt-10 mb-6 sm:mb-10
  sticky top-[80px] z-40
"
        >
          <ul className="flex items-center justify-center gap-5">
            <li className="cursor-pointer" onClick={scrollToServices}>
              What's included
            </li>
            <li className="cursor-pointer" onClick={scrollToFaqs}>
              How it works
            </li>
            <li className="cursor-pointer" onClick={scrollToWhyUs}>
              Why us
            </li>
          </ul>
        </div>

        <div ref={teamRef} className="py-5 px-4 bg-white">
          <TEAM />
        </div>

        <div ref={faqRef} className="py-16 px-4 bg-gray-50">
          <h1 className="text-4xl font-bold text-center mb-10 text-gray-400">
            Frequently Asked Questsions
          </h1>
          <FAQ />
        </div>
      </main>
      {showLoginModal && (
        <div className="fixed bg-[rgba(0,0,0,0.5)] backdrop-blur-3xl inset-0  bg-opacity-60 flex justify-center items-center z-50">
          <div className="relative rounded-lg shadow-xl max-w-sm w-full mx-4 ">
            <button
              onClick={closeLoginModal}
              className="absolute top-[-5px] right-[45%] text-gray-100 bg-red-100 flex items-center justify-center rounded-full w-8 h-8 hover:text-gray-600"
            >
              <X size={25} className="text-red-500" />
            </button>

            <Card className="max-w-sm">
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="email1" className="font-Poppins">Your email</Label>
                  </div>
                  <TextInput
                    id="email1"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter you email"
                    className={"focus:border-green-500"}
                    required
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="password1">Your password</Label>
                  </div>
                  <TextInput
                    id="password1"
                    type={showPassword===true?"text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={"Enter your password"}
                    required
                  />
                  <div className="flex items-center justify-center mt-5 gap-3">
                    {showPassword ?(<FiEye onClick={handleShowPassword}/>):(<FiEyeOff onClick={handleShowPassword}/>)}
                    <span>{showPassword?(<p>Show password</p>):(<p>Hide password</p>)}</span>
                  </div>

                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" required />
                  <Label htmlFor="remember">Remember Me</Label>
                </div>
                <Button
                  type="submit"
                  className="bg-green-600 text-white font-poppins disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (<ClipLoader color={"white"} />) : "Sign in"}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" />
      <Footer container className="mt-40">
        <div className="w-full text-center">
          <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
            <FooterBrand
              href="https://localhost:5173/"
              src="images/asyv.png"
              alt="Asyv Logo"
              name="Asyv Clinic"
            />
            <FooterLinkGroup>
              <FooterLink href="#">Team</FooterLink>
              <FooterLink href="#">Services</FooterLink>
              <FooterLink href="#">FAQs</FooterLink>
              <FooterLink href="#">Contact</FooterLink>
            </FooterLinkGroup>
          </div>
          <FooterDivider />
          <FooterCopyright href="#" by="ASYVClinic™" year={2025} />
        </div>
      </Footer>
    </div>
  );
};
export default LandingPage;
