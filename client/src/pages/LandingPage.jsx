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
 const [activeTab, setActiveTab] = useState("home");

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
  
  // INTERSECTION OBSERVER FOR CARDS

 useEffect(() => {
    const sections = [
      { ref: HomeRef, name: "home" },
      { ref: servicesRef, name: "services" },
      { ref: teamRef, name: "team" },
      { ref: contactUsRef, name: "contact" },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        console.log(entries);
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const activeSection = sections.find(
              (sec) => sec.ref.current === entry.target
            );
            if (activeSection) {
              setActiveTab(activeSection.name);
            }
          }
        });
      },
      { threshold: 0.5 } // Triggers when 50% of the section is visible
    );

    sections.forEach((sec) => {
      if (sec.ref.current) {
        observer.observe(sec.ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);
  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => {
    setShowLoginModal(false);
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTimeout(()=>{
     setLoading(true);
    }, 2000);
    

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
              
              }}
              className={`hover:text-black cursor-pointer transition-colors bg-blue-200 px-10 py-3 rounded-full ${activeTab === "home" ? "bg-blue-300 text-gray-900" : ""}`}
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

     
        <div ref={whyChooseUsRef} className="py-16 sm:py-24 px-4 sm:px-6 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div className="max-w-2xl text-center md:text-left">
              <h2 className="text-10xl sm:text-5xl text-black font-poppins tracking-tight mb-4">
                Why Choose Us
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Experience healthcare management designed with precision, security, and the modern professional in mind.
              </p>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto">
            <div className="flex overflow-x-auto gap-6 pb-12 pt-4 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              
              {/* Card 1 */}
              <div className="bg-white rounded-[2rem] p-8 border border-gray-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[320px] w-[85vw] sm:w-[400px] flex-shrink-0 snap-center group">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-50/50 flex items-center justify-center mb-8 group-hover:bg-blue-50 transition-colors">
                    <Activity className="text-blue-600" size={26} />
                  </div>
                  <h3 className="text-2xl font-medium text-gray-900 mb-3">Expert Team</h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    Our experienced professionals ensure top-quality care and seamless operational efficiency for every single patient.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-8 text-blue-600 font-medium cursor-pointer w-max group/btn">
                  <span onClick={() => setShowLoginModal(true)}>Learn more</span>
                  <ArrowRight size={18} className="transform group-hover/btn:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-[2rem] p-8 border border-gray-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[320px] w-[85vw] sm:w-[400px] flex-shrink-0 snap-center group">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50/50 flex items-center justify-center mb-8 group-hover:bg-emerald-50 transition-colors">
                    <Check className="text-emerald-600" size={26} />
                  </div>
                  <h3 className="text-2xl font-medium text-gray-900 mb-3">Reliable Services</h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    Dependable healthcare software solutions you can trust every day, backed by enterprise-grade stability.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-8 text-emerald-600 font-medium cursor-pointer w-max group/btn">
                  <span onClick={() => setShowLoginModal(true)}>Learn more</span>
                  <ArrowRight size={18} className="transform group-hover/btn:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-[2rem] p-8 border border-gray-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[320px] w-[85vw] sm:w-[400px] flex-shrink-0 snap-center group">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-purple-50/50 flex items-center justify-center mb-8 group-hover:bg-purple-50 transition-colors">
                    <Phone className="text-purple-600" size={26} />
                  </div>
                  <h3 className="text-2xl font-medium text-gray-900 mb-3">24/7 Support</h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    Round-the-clock technical assistance and medical triage support for all your operational needs.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-8 text-purple-600 font-medium cursor-pointer w-max group/btn">
                  <span onClick={() => setShowLoginModal(true)}>Learn more</span>
                  <ArrowRight size={18} className="transform group-hover/btn:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Our Services Section */}
        <div ref={servicesRef} className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-50/50 overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl sm:text-5xl font-medium text-gray-900 tracking-tight mb-4">
                Explore our services
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Everything you need to manage your clinic efficiently in one centralized, secure location.
              </p>
            </div>
            <button className="hidden sm:block border-2 border-gray-200 text-gray-900 px-6 py-3 rounded-full font-medium hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300">
              Explore all services
            </button>
          </div>
          
          <div className="max-w-7xl mx-auto">
            <div className="flex overflow-x-auto gap-6 pb-12 pt-4 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-white rounded-[2rem] p-8 border border-gray-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[320px] w-[85vw] sm:w-[400px] flex-shrink-0 snap-center group"
                  style={{
                    animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s both`,
                  }}
                >
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                      <service.icon className="text-gray-900" size={26} />
                    </div>
                    <h3 className="text-2xl font-medium text-gray-900 mb-3">{service.name}</h3>
                    <p className="text-base text-gray-600 leading-relaxed">
                      Simplify and manage {service.name.toLowerCase()} efficiently in one location. Built for speed and accuracy.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-8 text-gray-900 font-medium cursor-pointer w-max group/btn">
                    <span onClick={() => setShowLoginModal(true)}>Learn more</span>
                    <ArrowRight size={18} className="transform group-hover/btn:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto mt-2 sm:hidden">
            <button className="w-full border-2 border-gray-200 text-gray-900 px-6 py-3 rounded-full font-medium hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300">
              Explore all services
            </button>
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


      {showLoginModal && (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center">
        
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={closeLoginModal}
          ></div>

          
          <div className="relative z-[10000] bg-white rounded-md shadow-[0_24px_38px_3px_rgba(0,0,0,0.14),0_9px_46px_8px_rgba(0,0,0,0.12),0_11px_15px_-7px_rgba(0,0,0,0.2)] max-w-[450px] w-full mx-4 animate-modalSlideIn overflow-hidden p-10">
            
          
            <button
              onClick={closeLoginModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 hover:bg-red-100 p-2 rounded-md transition-colors"
            >
              <X size={24} strokeWidth={1.5} />
            </button>

          
            <div className="text-center mb-10 mt-2">
              <div className="w-12 h-12 bg-[#f0f4f9] rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="text-[#33cc82]" size={24} />
              </div>
              <h2 className="text-[32px] font-normal text-gray-900 mb-2">
                Sign in
              </h2>
              <p className="text-[16px] text-gray-600 font-poppins">
                to continue to Clinic Workspace
              </p>
            </div>

          
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              
           
              <div className="relative mt-2">
                <input
                  type="email"
                  id="email1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block px-4 pb-3.5 pt-4 w-full text-[16px] text-gray-900 bg-transparent rounded-md border border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-2 focus:border-[#1bc247] peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="email1"
                  className="absolute text-[16px] text-gray-500 bg-white px-1 duration-200 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] left-3 peer-focus:text-[#1bc247] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 cursor-text"
                >
                  Email Address
                </label>
              </div>

            
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block px-4 pb-3.5 pt-4 w-full text-[16px] text-gray-900 bg-transparent rounded-md border border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-2 focus:border-[#1bc24s7] peer pr-12"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="password1"
                  className="absolute text-[16px] text-gray-500 bg-white px-1 duration-200 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] left-3 peer-focus:text-[#1a73e8] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 cursor-text"
                >
                  Password
                </label>
                
                
                <button
                  type="button"
                  className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  onClick={handleShowPassword}
                >
                  {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
                </button>
              </div>

            
              <div className="flex items-center justify-between mt-2 px-1">
                <div className="flex items-center gap-3">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 text-[#33cc82] bg-white border-gray-400 rounded focus:ring-[#33cc82] focus:ring-2 cursor-pointer transition-all"
                  />
                  <label htmlFor="remember" className="text-[14px] text-gray-700 cursor-pointer font-medium">
                    Remember me
                  </label>
                </div>
              </div>

              <div className="flex justify-between items-center mt-8">
                <button
                  type="button"
                  className="text-[#33cc82] text-[14px] font-medium hover:bg-green-50 px-4 py-2 rounded-full transition-colors"
                >
                  Forgot password?
                </button>
                <button
                  type="submit"
                  className="bg-[#33cc82] hover:bg-[#33cc82] text-white font-medium text-[14px] px-6 py-2.5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors tracking-wide"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <ClipLoader color="white" size={16} />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Next"
                  )}
                </button>
              </div>
            </form>
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
