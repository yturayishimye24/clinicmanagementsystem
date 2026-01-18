import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Badge } from "@heroui/react";
import { Alert } from "flowbite-react";
import { HiEye, HiInformationCircle } from "react-icons/hi";
import { Card } from "flowbite-react";
import {
  Calendar,
  PlusCircle,
  FileText,
  X,
  Users,
  UserCheck,
  Bell,
  Hospital,
  Menu,
  Home,
  Inbox,
  Mail,
  LogOut,
  UserPlus,
  FolderPlus,
  Percent,
  BarChart3,
  TrendingUp,
  RefreshCw,
  ChevronDown,
  Settings,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext.jsx";

export default function AdminPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [requests, setRequests] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [email, setEmails] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [loadingNurses, setLoadingNurses] = useState(false);
  const [em,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [nurseUsername,setNurseUsername]= useState("");
  const [showForm, setShowForm] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [alert, setShowAlert] = useState(true);
  const [adding,setAdding] = useState(false);
  //const [reports, setReports] = useState([]);
  //const [reportForm, setReportForm] = useState(false);

  const handleAccount = async (e) => {
    e.preventDefault();
    const response = await axios.post("http://localhost:4000/api/users/signup",{nurseUsername,em,password,role});
    if (response.data.success) {
      toast.success("Account created successfully");
      setAdding(true);
      setNurses(response.data);
      setEmail("")
      setPassword("")
      setRole("");
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      toast.error("Please login to access dashboard");
      navigate("/");
      return;
    }

    if (role !== "admin") {
      toast.error("Unauthorized access - Admins only");
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setShowAlert(true);
    }, 5000);

    const disappearTimer = setTimeout(() => {
      setShowAlert(false);
    }, 6000);

    clearTimeout(delayTimer);
    clearTimeout(disappearTimer);
  }, []);

  const fetchRequests = async () => {
    setLoadingRequests(true);
    try {
      const response = await axios.get(
        "http://localhost:4000/api/requests/showRequests",
      );
      const d = response.data;
      const arr = Array.isArray(d)
        ? d
        : Array.isArray(d.requests)
          ? d.requests
          : [];
      setRequests(arr);
    } catch (err) {
      console.error("fetchRequests error:", err);
      toast.error("Error getting requests");
      setRequests([]);
    } finally {
      setLoadingRequests(false)
      setAdding(false);
    }
  };

  const fetchEmail = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:4000/api/infos/email",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setEmails(response.data.email);
      setUsername(response.data.username);
      setRole(response.data.role);
    } catch (error) {
      console.error("Error fetching email:", error);
    }
  };

  const fetchPatients = async () => {
    setLoadingPatients(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:4000/api/patients/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = response.data;
      const arr = Array.isArray(d) ? d : (d.users ?? []);
      setPatients(arr);
    } catch (err) {
      console.error("fetchPatients error:", err.message);
      toast.error(err.message);
      setPatients([]);
    } finally {
      setLoadingPatients(false);
    }
  };

  useEffect(() => {
    fetchEmail();
    fetchRequests();
    fetchPatients();
  }, []);

  const handleLogout = () => {
    toast.info("Logging out...");
    setTimeout(() => {
      logout();
      navigate("/");
      toast.success("Successfully logged out!");
    }, 1200);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const setActiveItemAndClose = (item) => {
    setActiveItem(item);
    if (window.innerWidth < 1024) {
      closeSidebar();
    }
  };

  const pendingRequests = requests.filter((r) => r.Status === "pending").length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-dropdown")) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        closeSidebar();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const GoogleWorkspaceIcon = ({ icon: Icon, color, label, onClick }) => (
    <div
      className={`group relative flex items-center justify-center w-12 h-12 rounded-lg cursor-pointer transition-all duration-200 ease-out hover:scale-110 hover:bg-white hover:shadow-lg`}
      onClick={onClick}
    >
      <div
        className={`absolute inset-0 ${color} rounded-lg group-hover:bg-white transition-colors duration-200`}
      ></div>
      <Icon
        className={`relative w-6 h-6 text-white group-hover:${color.replace(
          "bg-",
          "text-",
        )} transition-colors duration-200`}
      />
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-2">
        <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {label}
        </span>
      </div>
    </div>
  );
  const handleApprove = async (requestId, e) => {
    if (!window.confirm("Are you sure you want to approve this request?"))
      return;
    e.preventDefault();
    const response = await axios.post(
      `http://localhost:4000/api/requests/approve/:${requestId}`,
    );
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

        * {
          font-family:
            "Poppins",
            -apple-system,
            BlinkMacSystemFont,
            sans-serif;
        }
        .smooth-transition {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .sidebar-item.active::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 0 2px 2px 0;
        }

        .notification-dot {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 18px;
          height: 18px;
          background: #ef4444;
          color: white;
          font-size: 10px;
          font-weight: 600;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e0 transparent;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e0;
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #a0aec0;
        }

        .modal-backdrop {
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 6px;
        }

        .status-active {
          background-color: #10b981;
        }

        .dark .glass-effect {
          background: rgba(24, 24, 27, 0.95);
          border: 1px solid rgba(39, 39, 42, 0.3);
        }

        @media (max-width: 1024px) {
          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            z-index: 50;
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .sidebar-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 40;
            opacity: 0;
            visibility: hidden;
            transition:
              opacity 0.3s ease,
              visibility 0.3s ease;
          }

          .sidebar-overlay.visible {
            opacity: 1;
            visibility: visible;
          }

          .requests-sidebar {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .header-title {
            font-size: 1.25rem;
          }
        }
      `}</style>

      {alert && (
        <Alert
          additionalContent={"Here are some requests that are trending up"}
          color="success"
          icon={HiInformationCircle}
          onDismiss={() => setShowAlert(false)}
          className="fixed w-full z-50 top-0 left-0"
          rounded
        >
          <span className="font-medium">Info alert!</span> Welcome to admin
          page. You have got `${requests.length}` requests.
        </Alert>
      )}

      <header className="border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shodow-lg">
        <div className="flex items-center justify-around gap-10">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 smooth-transition"
            >
              <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>

            <div className="w-10 h-10 ">
              <img src="/images/asyv.png" className="rounded-full" />
            </div>
            <h1 className="header-title text-2xl font-bold text-gray-800 dark:text-white">
              Clinic Admin
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 smooth-transition relative">
                <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                {pendingRequests > 0 && (
                  <div className="notification-dot">{pendingRequests}</div>
                )}
              </button>
            </div>

            <div className="relative">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
                <Users className="w-6 h-6 text-emerald-600" />
                <div className="notification-dot bg-emerald-500">
                  {patients.length}
                </div>
              </div>
            </div>

            <div className="relative user-dropdown">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 smooth-transition"
              >
                <img
                  src="/images/userIcon.png"
                  alt="Admin"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {username}
                  </div>
                  <div className="text-xs text-gray-500">{email}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {username}
                    </div>
                    <div className="text-sm text-gray-500">
                      {email || "admin@clinic.com"}
                    </div>
                  </div>
                  <div className="py-2">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <HelpCircle className="w-4 h-4 mr-3" />
                      Help
                    </button>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-140px)] mt-20">
        <div
          className={`sidebar-overlay ${sidebarOpen ? "visible" : ""}`}
          onClick={closeSidebar}
        />

        <aside
          className={`sidebar ${
            sidebarOpen ? "open" : ""
          } w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 flex flex-col mt-[30px]`}
        >
          <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
            <img
              src="/images/userIcon.png"
              alt="Admin"
              className="w-20 h-20 rounded-full mx-auto object-cover relative"
            />
            <img
              src="/images/camera.png"
              className="absolute w-5 h-5 left-[160px] hover:bg-gray-50 transition-all cursor-pointer bottom-[500px] rounded-full"
            />
            <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">
              {username}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {email || "admin@clinic.com"}
            </p>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {[
                { key: "Home", icon: Home, label: "Home" },
                {
                  key: "Requests",
                  icon: Inbox,
                  label: "Requests",
                  badge: pendingRequests,
                  badgeColor: "bg-red-500",
                },
                {
                  key: "Nurses",
                  icon: Users,
                  label: "Nurses",
                  badge: nurses.length,
                  badgeColor: "bg-emerald-500",
                },
                {
                  key: "Messages",
                  icon: Mail,
                  label: "Messages",
                  badge: requests.length,
                  badgeColor: "bg-blue-500",
                },
                {
                  key: "Patients",
                  icon: UserCheck,
                  label: "Patients",
                  badge: patients.length,
                  badgeColor: "bg-purple-500",
                },
              ].map(({ key, icon: Icon, label, badge, badgeColor }) => (
                <li key={key}>
                  <button
                    onClick={() => setActiveItemAndClose(key)}
                    className={`
                      sidebar-item w-full flex items-center px-4 py-3 text-left rounded-lg smooth-transition relative overflow-hidden
                      ${
                        activeItem === key
                          ? "active text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {label}
                    {badge > 0 && (
                      <span
                        className={`ml-auto px-2 py-1 text-xs font-semibold text-white rounded-full ${badgeColor}`}
                      >
                        {activeItem === key ? "" : `${badge}`}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg smooth-transition"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-center gap-6 mb-8">
            <GoogleWorkspaceIcon
              icon={UserPlus}
              color="bg-blue-500"
              label="Add Nurse"
              onClick={() => setShowForm(true)}
            />
            <GoogleWorkspaceIcon
              onClick={() => setReportForm(true)}
              icon={FolderPlus}
              color="bg-gray-400"
              label="Add Report"
            />
            <GoogleWorkspaceIcon
              icon={Percent}
              color="bg-purple-500"
              label="Create Discount"
            />
            <GoogleWorkspaceIcon
              icon={BarChart3}
              color="bg-orange-500"
              label="Track Metrics"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Current Patients
                  </h2>
                  <div className="flex items-center space-x-3">
                    <input
                      type="search"
                      placeholder="Search patients..."
                      className="px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      onClick={fetchPatients}
                      className="p-2 text-gray-500 hover:text-emerald-600 smooth-transition"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-auto max-h-96 custom-scrollbar">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Disease
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {loadingPatients ? (
                      <tr>
                        <td
                          colSpan="3"
                          className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                        >
                          <div className="flex flex-col items-center">
                            <Loader2 className="w-8 h-8 animate-spin mb-2" />
                            <p>Loading patients...</p>
                          </div>
                        </td>
                      </tr>
                    ) : patients.length === 0 ? (
                      <tr>
                        <td
                          colSpan="3"
                          className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                        >
                          <div className="flex flex-col items-center">
                            <Users className="w-8 h-8 mb-2" />
                            <p>No patients found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      patients.map((patient) => (
                        <tr
                          key={patient._id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 smooth-transition"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={
                                  patient.avatarUrl || "/images/patientt.png"
                                }
                                alt={patient.firstName}
                                className="w-10 h-10 rounded-full object-cover mr-3"
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {patient.firstName} {patient.lastName || ""}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {patient.disease || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`status-dot ${patient.Status === "hospitalized" ? "bg-red-500" : "bg-green-500"}`}
                            ></span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {patient.Status || "Active"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Nurses Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Latest Nurses
                  </h3>
                  <button className="text-sm text-emerald-600 hover:underline">
                    View all
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {loadingNurses ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-500 dark:text-gray-400">
                          Loading nurses...
                        </p>
                      </div>
                    </div>
                  ) : nurses.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <Users className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-500 dark:text-gray-400">
                          No nurses found
                        </p>
                      </div>
                    </div>
                  ) : (
                    nurses.map((nurse, index) => (
                      <div
                        key={nurse._id || nurse.email || index}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 smooth-transition"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face"
                          alt={nurse.firstName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {nurse.firstName} {nurse.lastName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {nurse.email}
                          </p>
                        </div>
                        <div className="text-xs text-gray-400">
                          {nurse.hireDate
                            ? new Date(nurse.hireDate).getFullYear()
                            : new Date().getFullYear()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        <aside className="requests-sidebar w-80 bg-white dark:bg-gray-800 border-l overflow-y-scroll h-[400px] border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Requests
              </h3>
              <button
                onClick={fetchRequests}
                className="text-sm text-emerald-600 hover:underline"
              >
                Refresh
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
              {loadingRequests ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Loading requests...
                    </p>
                  </div>
                </div>
              ) : requests.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <Inbox className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No requests found
                    </p>
                  </div>
                </div>
              ) : (
                requests.map((request, index) => (
                  <div
                    key={request._id || request.id || index}
                    className="flex items-start space-x-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 smooth-transition border border-gray-200 dark:border-gray-600"
                  >
                    <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {request.reason || request.itemName || "Request"}
                        </h4>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            request.Status === "approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : request.Status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {request.Status === "pending" ? (
                            <button onClick={() => handleApprove(request._id)}>
                              Approve
                            </button>
                          ) : (
                            request.Status || "pending"
                          )}
                        </span>
                      </div>
                      {(request.quantity ||
                        request.patientCount ||
                        request.urgency) && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          {request.quantity
                            ? `Qty: ${request.quantity} · `
                            : ""}
                          {request.patientCount
                            ? `Patients: ${request.patientCount} · `
                            : ""}
                          {request.urgency ? `Urgency: ${request.urgency}` : ""}
                        </p>
                      )}
                      {request.createdAt && (
                        <div className="text-xs text-gray-400">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setShowForm(true)}
                className="w-full flex items-center px-4 py-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 smooth-transition"
              >
                <UserPlus className="w-5 h-5 text-emerald-600 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">
                  Add Nurse
                </span>
              </button>
              <button className="w-full flex items-center px-4 py-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 smooth-transition">
                <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">
                  Schedule Shift
                </span>
              </button>
              <button className="w-full flex items-center px-4 py-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 smooth-transition">
                <FileText className="w-5 h-5 text-purple-600 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">
                  View Reports
                </span>
              </button>
            </div>
          </div>
        </aside>
      </div>

      {showForm && (
        <div className="modal-backdrop fixed inset-0 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleAccount}
            className="relative max-w-md mx-auto bg-white p-6 rounded-xl shadow-md space-y-5"
          >
            <X onClick={()=>setShowForm(false)} className="absolute top-1 bg-red-100 text-red-500 align-center justify-center rounded-full right-[50%] cursor-pointer" />
            <h2 className="text-xl font-semibold text-gray-800 text-center">
              Create User Account
            </h2>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter username"
                name="username"
                value={nurseUsername}
                onChange={(e)=>setNurseUsername(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="example@email.com"
                name="email"
                value={em}
                onChange={(e)=>setEmail(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

          
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                placeholder="••••••••"
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

           
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Role</label>
              <select
                className="px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select role</option>
                <option name="nurse" value={role}>Nurse</option>
                <option name="admin" value={role}>Admin</option>
              </select>
            </div>

            
            <button
              type="submit"
              disabled={adding}
              onClick={()=>alert("working")}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              {adding===true? ("Creating nurse"):("Add nurse")}
            </button>
          </form>
        </div>
      )}

      <ToastContainer position="bottom-right" className="z-50" />
    </div>
  );
}
