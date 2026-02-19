import React, { useRef, useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import {
  Spinner,
  Button,
  Card,
  Checkbox,
  Label,
  TextInput,
} from "flowbite-react";

import {
  Activity,
  Phone,
  ArrowRight,
  Check,
  X,
  TrendingUp,
  Users,
  FileText,
  Trash2,
  BarChart3,
  Package,
} from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
// import { backendUrl } from "../App.jsx";
import techImage from "../../public/images/techImage.png";
import stethoscope from "../../public/images/stethoscope.png"
import syringe from "../../public/images/syringe.png"
import house from "../../public/images/house.png"
import FAQ from "../components/Faqs.jsx";
import TEAM from "../components/teamSection.jsx";
import drake from "../../public/images/asyvlogo.png";
import ContactUs from "../components/ContactUs.jsx";
import {
  Footer,
  FooterBrand,
  FooterCopyright,
  FooterDivider,
  FooterLink,
  FooterLinkGroup,
} from "flowbite-react";
import { useAuth } from "../../context/authContext.jsx";

const LandingPage = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toggleBg,setToggleBg] = useState(false);

  const teamRef = useRef(null);
  const faqRef = useRef(null);
  const HomeRef = useRef(null);
  const servicesRef = useRef(null);
  const whyChooseUsRef = useRef(null);
  const contactUsRef = useRef(null);
  const { login } = useAuth();
   
  const handleToggleBg = () => {
    setToggleBg(!toggleBg);
  }
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
  const scrollToContactUs = () => {
    contactUsRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  
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
        localStorage.setItem("email", response.data.email);
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

  const services = [
    { name: "Recording patients", icon: Users },
    { name: "Requesting medicines from Lab", icon: Package },
    { name: "Updating patient's infos", icon: FileText },
    { name: "Deleting patient records", icon: Trash2 },
    { name: "Reporting", icon: BarChart3 },
    { name: "Statistics", icon: TrendingUp },
  ];

  return (
    <div className="font-sans min-h-screen bg-white">
      
      <header className="absolute mb-20 top-0 left-0 w-full z-50 ">
        <nav
          className="mx-auto mt-6 max-w-6xl
               backdrop-blur-lg
               bg-transparent
               border border-white/40
               rounded-full shadow-md
               px-6 py-2.5
               flex items-center justify-between"
        >
         
          <div
            onClick={goToHome}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center">
              <Activity size={15} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900">
              Clinic Workspace
            </span>
          </div>

          {/* Nav */}
          <ul className="hidden md:flex items-center gap-6 text-sm font-poppins text-gray-700">
            <li
              onClick={()=> {
                goToHome();
                handleToggleBg();
              }}
              className={`hover:text-black cursor-pointer transition-colors bg-blue-200 px-10 py-3 rounded-full ${toggleBg ? 'bg-green-200' : ''}`}
            >
              Home
            </li>
            <li
              onClick={scrollToServices}
              className="hover:text-black cursor-pointer transition-colors"
            >
              Services
            </li>
            <li
              onClick={scrollToTeam}
              className="hover:text-black cursor-pointer transition-colors"
            >
              Team
            </li>
            <li
              onClick={scrollToContactUs}
              className="hover:text-black cursor-pointer transition-colors"
            >
              Contact Us
            </li>
          </ul>
          
          {/* CTA */}
          <button
            onClick={openLoginModal}
            className="group relative flex items-center gap-2
                 bg-black text-white
                 px-5 py-2 rounded-full
                 text-sm font-medium
                 hover:bg-gray-900 transition-all overflow-hidden"
          >
            <span className="relative z-10">Get Started</span>
            <ArrowRight
              size={16}
              className="relative z-10 transform rotate-[-45deg] group-hover:translate-x-0.5 group-hover:translate-y-[-2px] transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </nav>
      </header>

      <main className="min-h-screen">
        <section
          ref={HomeRef}
          className="relative min-h-screen overflow-hidden
             pb-20 px-4 sm:px-6 text-center
             bg-gradient-to-b from-blue-100 via-blue-50 to-white"
        >
          {/* Decorative blurs */}
          <div className="absolute top-24 left-24 w-32 h-32 bg-blue-300 rounded-full blur-3xl opacity-40 animate-pulse"></div>
          <div
            className="absolute top-40 right-32 w-36 h-36 bg-green-300 rounded-full blur-3xl opacity-40 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-16 left-1/3 w-28 h-28 bg-purple-300 rounded-full blur-3xl opacity-30 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>

          <div className="flex justify-center items-center gap-10 lg:gap-20 pt-[100px]">
            <div className="pt-20 z-10 max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Manage Patients <br />
                <span className="text-6xl font-extrabold bg-gradient-to-r from-green-500 via-orange-500 to-tan-500 bg-clip-text text-transparent transition-transform">
                  Better Communication
                </span>
              </h1>

              <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-10">
                Join a community where every patient feels understood and
                receives the desired service. Experience seamless healthcare
                management with our comprehensive platform.
              </p>

             

          
                
           <button
                  onClick={openLoginModal}
                  type="submit"
                  class="group inline-flex items-center gap-3
         bg-black text-white font-semibold
         px-6 py-3 pl-5
         rounded-full whitespace-nowrap overflow-hidden
         transition-colors duration-300
         hover:bg-white hover:text-black"
                >
                  <span
                    class="relative flex-shrink-0
           w-[25px] h-[25px]
           grid place-items-center
           rounded-full
           bg-white text-black
           overflow-hidden
           transition-colors duration-300
           group-hover:bg-black group-hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="button1__icon-svg absolute w-4 h-4
             transition-transform duration-300 ease-in-out
             group-hover:translate-x-[150%] group-hover:-translate-y-[150%]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 5v14M5 12h14"
                      />
                    </svg>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="absolute w-4 h-4
             translate-x-[-150%] translate-y-[150%]
             transition-transform duration-300 ease-in-out delay-100
             group-hover:translate-x-0 group-hover:translate-y-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 5v14M5 12h14"
                      />
                    </svg>
                  </span>
                  <span>Get Started</span>
                </button>
             
</div>
            <div className="hidden lg:flex items-center justify-center w-1/4 relative">
              <img
                src={house}
                alt="Medical equipment"
                className="absolute w-[300px] rounded-2xl shadow-2xl
                 transform rotate-[-45deg] -left-20 h-[400px] top-[100px]
                 hover:rotate-[-8deg] transition-transform duration-300"
              />
              <img
                src={syringe}
                alt="Healthcare"
                className="absolute w-[300px] rounded-2xl shadow-2xl
                 transform rotate-[35deg] left-6 top-[100px]
                 hover:rotate-[2deg] hover:left-[30px] transition-transform duration-300"
              />
              <img
                src={stethoscope}
                alt="Medical care"
                className="relative w-[300px] rounded-2xl shadow-2xl z-10 transform rotate-[45deg] top-[100px]
                 hover:-translate-y-5 transition-transform duration-300"
              />
            </div>
          </div>
        </section>

        <div
          className="bg-fixed bg-cover bg-center w-full h-64 sm:h-80 md:h-96 lg:h-[500px] relative shadow-inner flex items-center justify-center"
          style={{ backgroundImage: `url(${techImage})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="text-center text-white px-4 relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-4">
              Modern Healthcare Technology
            </h2>
            <p className="text-base sm:text-lg md:text-xl opacity-90">
              Built for efficiency, designed for care
            </p>
          </div>
        </div>

        <div
          ref={whyChooseUsRef}
          className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-16 text-gray-800">
            Why Choose Us
          </h2>
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-md">
                  <Activity className="text-black" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  Expert Team
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our experienced professionals ensure top-quality care for
                  every patient.
                </p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100 group">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-md">
                  <Check className="text-black" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  Reliable Services
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Dependable healthcare solutions you can trust every day.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100 group">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-md">
                  <Phone className="text-black" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  24/7 Support
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Round-the-clock assistance for all your healthcare needs.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={servicesRef}
          className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gray-50"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-16 text-gray-800">
            Our Services
          </h2>
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 group cursor-pointer"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <div
                  className={` w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}
                >
                  <service.icon className="text-black" size={24} />
                </div>
                <h3 className="text-gray-900 font-semibold text-lg mb-2 group-hover:text-gray-700 transition-colors">
                  {service.name}
                </h3>
                <div className="h-1 w-12 bg-gradient-to-r from-green-400 to-orange-500 rounded-full group-hover:w-full transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white text-center">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10"></div>
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-white">
                Ready to Transform Your Healthcare Management?
              </h2>
              <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-6 sm:mb-8">
                Join hundreds of healthcare professionals who trust our platform
              </p>
              <button
                onClick={openLoginModal}
                className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-white text-black text-base sm:text-lg font-semibold rounded-xl shadow-lg flex items-center gap-3 mx-auto hover:bg-gray-100 transition-all overflow-hidden"
              >
                <span className="relative z-10">Start Your Journey</span>
                <ArrowRight
                  size={20}
                  className="relative z-10 transform rotate-[-45deg] group-hover:translate-x-1 group-hover:translate-y-[-3px] transition-transform duration-300"
                />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-full py-4 px-6 max-w-2xl mx-auto flex justify-center items-center gap-8 text-gray-600 text-sm mt-10 mb-10 sticky top-3 z-40 border border-gray-200">
          <ul className="flex items-center justify-center gap-8">
            <li
              onClick={scrollToServices}
              className="cursor-pointer hover:text-black transition-colors font-medium"
            >
              What's included
            </li>
            <li
              onClick={scrollToFaqs}
              className="cursor-pointer hover:text-black transition-colors font-medium"
            >
              How it works
            </li>
            <li
              onClick={scrollToWhyUs}
              className="cursor-pointer hover:text-black transition-colors font-medium"
            >
              Why us
            </li>
          </ul>
        </div>

        <div ref={teamRef} className="py-5 px-4 bg-white">
          <TEAM />
        </div>

        <div ref={faqRef} className="py-16 px-4 bg-gray-50">
          <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
            Frequently Asked Questions
          </h1>
          <FAQ />
        </div>
      </main>

      {/* Login Modal with fixed z-index */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeLoginModal}
          ></div>

          {/* Modal Content */}
          <div className="relative z-[10000] rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-modalSlideIn">
            <button
              onClick={closeLoginModal}
              className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-white bg-red-500 hover:bg-red-600 flex items-center justify-center rounded-full w-10 h-10 transition-colors shadow-lg"
            >
              <X size={24} />
            </button>

            <Card className="border-0 shadow-2xl">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Welcome Back
                </h2>
                <p className="text-gray-600 mt-2">
                  Sign in to continue to your account
                </p>
              </div>

              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div>
                  <div className="mb-2 block">
                    <Label
                      htmlFor="email1"
                      className="text-gray-700 font-medium"
                    >
                      Email Address
                    </Label>
                  </div>
                  <TextInput
                    id="email1"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label
                      htmlFor="password1"
                      className="text-gray-700 font-medium"
                    >
                      Password
                    </Label>
                  </div>
                  <div className="relative">
                    <TextInput
                      id="password1"
                      type={showPassword ? "text" : "password"}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div
                    className="flex items-center justify-start mt-3 gap-2 text-sm text-gray-600 cursor-pointer select-none"
                    onClick={handleShowPassword}
                  >
                    {showPassword ? (
                      <FiEye className="text-gray-500" size={18} />
                    ) : (
                      <FiEyeOff className="text-gray-500" size={18} />
                    )}
                    <span className="hover:text-gray-900">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    className="text-emerald-500 focus:ring-emerald-500"
                  />
                  <Label htmlFor="remember" className="text-gray-700">
                    Remember me
                  </Label>
                </div>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all py-2.5 rounded-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <ClipLoader color="white" size={20} />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" />
       <ContactUs ref={contactUsRef}/>
      <Footer container className="mt-20 bg-white text-white">
        <div className="w-full text-center">
          <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
            <FooterBrand
              href="https://localhost:5173/"
              src={drake}
              alt="Peace of Mind Logo"
              name="Asyv Clinic"
            />
            <FooterLinkGroup>
              <FooterLink href="#" className="text-gray-300 hover:text-white">
                Team
              </FooterLink>
              <FooterLink href="#" className="text-gray-300 hover:text-white">
                Services
              </FooterLink>
              <FooterLink href="#" className="text-gray-300 hover:text-white">
                FAQs
              </FooterLink>
              <FooterLink href="#" className="text-gray-300 hover:text-white">
                Contact
              </FooterLink>
            </FooterLinkGroup>
          </div>
          <FooterDivider />
          <FooterCopyright
            href="#"
            by="ASYVClinic™"
            year={2025}
            className="text-gray-400"
          />
        </div>
      </Footer>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-modalSlideIn {
          animation: modalSlideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
