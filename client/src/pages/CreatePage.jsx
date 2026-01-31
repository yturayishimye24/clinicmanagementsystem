import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Badge } from "flowbite-react";
import {
  Bell,
  Calendar,
  FileText,
  X,
  Users,
  Inbox,
  UserPlus,
  RefreshCw,
  Loader2,
  Home,
  ClipboardList,
  Stethoscope,
  Package,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  LogOut,
  Settings,
  User,
  Edit,
  Trash2,
  Ambulance,
  ActivitySquare,
  AlertCircle,
  Send,
  BarChart3,
  MessageSquare,
  Menu,
  Hospital,
  Save,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronDown,
  Eye,
  Mail,
  Download,
  Share2,
} from "lucide-react";

export default function NursePage() {
  const navigate = useNavigate();

  const [editingPatientId, setEditingPatientId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [gender, setGender] = useState("");
  const [lastName, setLastName] = useState("");
  const [date, setDate] = useState("");
  const [patientImage, setPatientImage] = useState(null);
  const [disease, setDisease] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [formError, setFormError] = useState("");

  // Request form state
  const [requestType, setRequestType] = useState("Medicine Request");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [urgency, setUrgency] = useState("medium");
  const [reason, setReason] = useState("");
  const [patientCount, setPatientCount] = useState(0);

  const [myRequests, setMyRequests] = useState([]);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  // const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Add maritalStatus state
  const [maritalStatus, setMaritalStatus] = useState("");

  

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:4000/api/patients/displayPatients",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const d = response.data;
      const arr = Array.isArray(d) ? d : (d.users ?? []);
      setPatients(arr);
    } catch (error) {
      console.error("Error fetching patients:", error.message);
      toast.error("Failed to fetch patients. Please check your connection.");
      setPatients([]);
    } finally {
      setLoading(false);
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

    if (role !== "nurse") {
      toast.error("Unauthorized access - Nurses only");
      navigate("/");
    }
  }, [navigate]);

  const handleHospitalize = async (patientId) => {
    if (!window.confirm("Hospitalize this patient?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `http://localhost:4000/api/patients/${patientId}/hospitalize`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(res.data.message);
      fetchPatients();
    } catch (error) {
      toast.error(error.message);
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
      setEmail(response.data.email);
      setUsername(response.data.username);
      setRole(response.data.role);
    } catch (error) {
      console.error("Error fetching email:", error);
    }
  };

  useEffect(() => {
    fetchEmail();
    fetchPatients();
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:4000/api/requests/showRequests",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const d = response.data;
      const arr = Array.isArray(d)
        ? d
        : Array.isArray(d.requests)
          ? d.requests
          : [];
      setMyRequests(arr);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setMyRequests([]);
    }
  };
  const handleDeleteRequest = async(requestId,e)=>{
    e.preventDefault();
    if(!window.confirm("Are you sure you want to delete this request?")) return;
    try{
    const token = localStorage.getItem("token");
    const response = await axios.delete(`https://localhost:4000/api/requests/removeRequests/${requestId}`,{
      headers: { Authorization: `Bearer ${token}` },
    })
    if(response.data.success){
      const updatedRequests = myRequests.filter((request) => request._id !== requestId);
      setMyRequests(updatedRequests);
      toast.success("Request deleted successfully!");
    }
    }catch(error){
      console.log(error);
      toast.error(error.message);
    }
  }
  const handleDelete = async (patientId) => {
    if (!window.confirm("Are you sure you want to delete this patient?"))
      return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4000/api/patients/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients((prev) =>
        prev.filter((patient) => patient._id !== patientId),
      );
      toast.success("Patient deleted successfully!");
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast.error("Failed to delete patient. Try later!");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (patient) => {
    setEditingPatientId(patient._id);
    setFirstName(patient.firstName || "");
    setLastName(patient.lastName || "");
    setGender(patient.gender || "");
    setDate(patient.date ? patient.date.split("T")[0] : "");
    setMaritalStatus(patient.maritalStatus || "");
    setDisease(patient.disease || "");
    setShowForm(true);
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setGender("");
    setDate("");
    setMaritalStatus("");
    setDisease("");
    setPatientImage(null);
    setEditingPatientId(null);
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      const patientData = {
        firstName,
        lastName,
        date: new Date(date),
        disease,
        maritalStatus,
        gender,
      };

      if (editingPatientId) {
        const response = await axios.put(
          `http://localhost:4000/api/patients/${editingPatientId}`,
          patientData,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setPatients((prev) =>
          prev.map((patient) =>
            patient._id === editingPatientId ? response.data : patient,
          ),
        );
        toast.success("Patient updated successfully!");
      } else {
        const formData = new FormData();
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("date", date);
        formData.append("disease", disease);
        formData.append("gender", gender);
        formData.append("maritalStatus", maritalStatus);
        if (patientImage) {
          formData.append("Image", patientImage);
        }
        const response = await axios.post(
          "http://localhost:4000/api/patients/create",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          },
        );
        setPatients((prev) => [...prev, response.data.patient]);
        toast.success("Patient added successfully!");
      }

      setShowForm(false);
      resetForm();
    } catch (error) {
      setFormError(
        error.response?.data?.message ||
          "Failed to save patient. Please try again.",
      );
      toast.error("Failed to save patient!");
    } finally {
      setLoading(false);
    }
  };

  const resetRequestForm = () => {
    setRequestType("Medicine Request");
    setItemName("");
    setQuantity("");
    setUrgency("medium");
    setReason("");
    setPatientCount(0);
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!itemName || !quantity || !reason) {
        toast.error("Please fill all required fields!");
        return;
      }

      const token = localStorage.getItem("token");
      const requestData = {
        Status: "pending",
        requestType,
        itemName,
        quantity,
        urgency,
        patientCount,
        reason,
      };

      const response = await axios.post(
        "http://localhost:4000/api/requests/createRequests",
        requestData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        toast.success("Request submitted successfully!");
        setShowRequestForm(false);
        resetRequestForm();
        fetchRequests();
      }
    } catch (error) {
      console.error("Request submission error:", error);
      toast.error("Failed to submit request. Please try again.");
    }
  };

  const handleLogout = () => {
    toast.info("Logging out...");
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/");
      toast.success("Successfully logged out!");
    }, 1000);
  };

  // const markNotificationAsRead = (id) => {
  //   setNotifications(
  //     notifications.map((notif) =>
  //       notif.id === id ? { ...notif, read: true } : notif,
  //     ),
  //   );
  // };

  // const markAllAsRead = () => {
  //   setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  //   toast.success("All notifications marked as read");
  // };

  const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "#" },
    { icon: Users, label: "Patients", href: "#" },
    { icon: Calendar, label: "Appointments", href: "#" },
    {
      icon: ClipboardList,
      label: "Requests",
      href: "#",
      badge: myRequests.length,
    },
    { icon: BarChart3, label: "Reports", href: "#" },
    { icon: MessageSquare, label: "Messages", href: "#" },
    { icon: Settings, label: "Settings", href: "#" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
        * {
          font-family: "Poppins";
        }
        .cozy-shadow {
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06);
        }
        .cozy-shadow-lg {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
        }
        .cozy-transition {
          transition: all 0.2s ease-in-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        .gradient-border {
          position: relative;
        }
        .gradient-border::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
        }
        
        /* Modal blur backdrop */
        .modal-backdrop-blur {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
      `}</style>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 cozy-shadow">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-lg font-semibold text-gray-800 tracking-tight">
                Nurse Dashboard
              </span>
            </div>

            <div className="flex items-center gap-3">
{/*             
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 cozy-transition group"
                >
                  <Bell className="w-5 h-5 text-gray-600 group-hover:text-blue-600 cozy-transition" />
                  <span className="absolute top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                      {notifications.filter((n) => !n.read).length}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl cozy-shadow-lg border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">
                        Notifications
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Mark all read
                        </button>
                        <button className="text-xs text-gray-500 hover:text-gray-700">
                          <Settings className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-gray-500">
                          <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() =>
                              markNotificationAsRead(notification.id)
                            }
                            className={`px-4 py-3 hover:bg-gray-50/80 cozy-transition cursor-pointer border-b border-gray-50 last:border-0 ${
                              !notification.read ? "bg-blue-50/30" : ""
                            }`}
                          >
                            <div className="flex gap-3">
                              <div
                                className={`w-10 h-10 rounded-xl ${notification.color} flex items-center justify-center flex-shrink-0`}
                              >
                                <notification.icon className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="text-sm font-medium text-gray-800 truncate">
                                    {notification.title}
                                  </h4>
                                  {!notification.read && (
                                    <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {notification.description}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {notification.time}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <button className="p-1 hover:bg-gray-200 rounded-lg cozy-transition">
                                      <Eye className="w-3 h-3 text-gray-500" />
                                    </button>
                                    <button className="p-1 hover:bg-gray-200 rounded-lg cozy-transition">
                                      <Mail className="w-3 h-3 text-gray-500" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                      <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div> */}

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-gray-50 cozy-transition"
                >
                  <img
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face"
                    alt="Profile"
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-700">
                      {localStorage.getItem("name") || username || "Nurse"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {email || "nurse@clinic.com"}
                    </p>
                  </div>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl cozy-shadow-lg border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-medium text-gray-800">
                        {localStorage.getItem("name") || username}
                      </p>
                      <p className="text-sm text-gray-500">{email}</p>
                    </div>
                    <div className="py-2">
                      <button className="w-full px-4 py-2.5 text-left text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-3 cozy-transition">
                        <User className="w-4 h-4" />
                        Profile
                      </button>
                      <button className="w-full px-4 py-2.5 text-left text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-3 cozy-transition">
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-3 cozy-transition"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-16 min-h-screen bg-white border-r border-gray-100 cozy-shadow z-30 cozy-transition ${
            collapsed ? "w-20" : "w-64"
          }`}
        >
          <div className="flex flex-col h-full items-center justify-between">
            {/* Collapse Button */}
            <div className="p-4 flex justify-end">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-2 rounded-lg hover:bg-gray-100 cozy-transition"
              >
                {collapsed ? (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronLeft className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 px-3 space-y-1">
              {sidebarItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 cozy-transition group"
                >
                  <item.icon className="w-5 h-5 text-gray-500 group-hover:text-blue-600 cozy-transition" />
                  {!collapsed && (
                    <>
                      <span className="font-medium text-sm">{item.label}</span>
                      {item.badge > 0 && (
                        <span className="ml-auto bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 cozy-transition ${
            collapsed ? "ml-[100px]" : "ml-[300px]"
          }`}
        >
          <div className="p-6 lg:p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome back,{" "}
                {localStorage.getItem("name") || username || "Nurse"} 👩‍⚕️
              </h1>
              <p className="text-gray-500 mt-1">
                Manage patient records and medical requests efficiently.
              </p>
            </div>

            <div>
              <h1 className="text-bold font-Poppins text-3xl ">Actions</h1>
              <div className="flex itemsp-center mb-10 mt-5 flex-start gap-3">
                <button
                  class="group relative flex flex-row items-center bg-[#212121] justify-center gap-2 rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]"
                  onClick={() => setShowRequestForm(true)}
                >
                  <div class="absolute inset-0 block h-full w-full animate-gradient bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:var(--bg-size)_100%] [border-radius:inherit] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] p-[1px] ![mask-composite:subtract]"></div>
                  <svg
                    class="size-4 text-[#ffaa40]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 15 15"
                    height="15"
                    width="15"
                  >
                    <path
                      clip-rule="evenodd"
                      fill-rule="evenodd"
                      fill="currentColor"
                      d="M5 4.63601C5 3.76031 5.24219 3.1054 5.64323 2.67357C6.03934 2.24705 6.64582 1.9783 7.5014 1.9783C8.35745 1.9783 8.96306 2.24652 9.35823 2.67208C9.75838 3.10299 10 3.75708 10 4.63325V5.99999H5V4.63601ZM4 5.99999V4.63601C4 3.58148 4.29339 2.65754 4.91049 1.99307C5.53252 1.32329 6.42675 0.978302 7.5014 0.978302C8.57583 0.978302 9.46952 1.32233 10.091 1.99162C10.7076 2.65557 11 3.57896 11 4.63325V5.99999H12C12.5523 5.99999 13 6.44771 13 6.99999V13C13 13.5523 12.5523 14 12 14H3C2.44772 14 2 13.5523 2 13V6.99999C2 6.44771 2.44772 5.99999 3 5.99999H4ZM3 6.99999H12V13H3V6.99999Z"
                    ></path>
                  </svg>
                  <div
                    class="shrink-0 bg-border w-[1px] h-4"
                    role="none"
                    data-orientation="vertical"
                  ></div>
                  <span class="inline animate-gradient whitespace-pre bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent [--bg-size:300%] text-center">
                    Make a request
                  </span>
                  <svg
                    stroke-linecap="round"
                    class="text-[#9c40ff]"
                    stroke-width="1.5"
                    aria-hidden="true"
                    viewBox="0 0 10 10"
                    height="11"
                    width="11"
                    stroke="currentColor"
                    fill="none"
                  >
                    <path
                      stroke-linecap="round"
                      d="M0 5h7"
                      class="opacity-0 transition group-hover:opacity-100"
                    ></path>
                    <path
                      stroke-linecap="round"
                      d="M1 1l4 4-4 4"
                      class="transition group-hover:translate-x-[3px]"
                    ></path>
                  </svg>
                </button>
                <button
                  class="group relative flex flex-row items-center bg-[#212121] justify-center gap-2 rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]"
                  onClick={() => setShowForm(true)}
                >
                  <div class="absolute inset-0 block h-full w-full animate-gradient bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:var(--bg-size)_100%] [border-radius:inherit] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] p-[1px] ![mask-composite:subtract]"></div>
                  <svg
                    class="size-4 text-[#ffaa40]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 15 15"
                    height="15"
                    width="15"
                  >
                    <path
                      clip-rule="evenodd"
                      fill-rule="evenodd"
                      fill="currentColor"
                      d="M5 4.63601C5 3.76031 5.24219 3.1054 5.64323 2.67357C6.03934 2.24705 6.64582 1.9783 7.5014 1.9783C8.35745 1.9783 8.96306 2.24652 9.35823 2.67208C9.75838 3.10299 10 3.75708 10 4.63325V5.99999H5V4.63601ZM4 5.99999V4.63601C4 3.58148 4.29339 2.65754 4.91049 1.99307C5.53252 1.32329 6.42675 0.978302 7.5014 0.978302C8.57583 0.978302 9.46952 1.32233 10.091 1.99162C10.7076 2.65557 11 3.57896 11 4.63325V5.99999H12C12.5523 5.99999 13 6.44771 13 6.99999V13C13 13.5523 12.5523 14 12 14H3C2.44772 14 2 13.5523 2 13V6.99999C2 6.44771 2.44772 5.99999 3 5.99999H4ZM3 6.99999H12V13H3V6.99999Z"
                    ></path>
                  </svg>
                  <div
                    class="shrink-0 bg-border w-[1px] h-4"
                    role="none"
                    data-orientation="vertical"
                  ></div>
                  <span class="inline animate-gradient whitespace-pre bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent [--bg-size:300%] text-center">
                    Add New Patient
                  </span>
                  <svg
                    stroke-linecap="round"
                    class="text-[#9c40ff]"
                    stroke-width="1.5"
                    aria-hidden="true"
                    viewBox="0 0 10 10"
                    height="11"
                    width="11"
                    stroke="currentColor"
                    fill="none"
                  >
                    <path
                      stroke-linecap="round"
                      d="M0 5h7"
                      class="opacity-0 transition group-hover:opacity-100"
                    ></path>
                    <path
                      stroke-linecap="round"
                      d="M1 1l4 4-4 4"
                      class="transition group-hover:translate-x-[3px]"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-5 cozy-shadow border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-500 text-sm">Total Patients</span>
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {patients.length}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-5 cozy-shadow border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-500 text-sm">Hospitalized</span>
                  <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                    <ActivitySquare className="w-4 h-4 text-red-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {patients.filter((p) => p.isHospitalized).length}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-5 cozy-shadow border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-500 text-sm">
                    Pending Requests
                  </span>
                  <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                    <ClipboardList className="w-4 h-4 text-amber-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {myRequests.filter((r) => r.Status === "pending").length}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Patients Table */}
              <div className="xl:col-span-2 bg-white rounded-2xl cozy-shadow border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Current Patients
                    </h2>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="search"
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9 pr-4 py-2 text-sm bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white w-48"
                        />
                      </div>
                      <button
                        onClick={fetchPatients}
                        className="p-2 rounded-xl hover:bg-gray-50 cozy-transition"
                      >
                        <RefreshCw className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="overflow-auto max-h-96 custom-scrollbar">
                  <table className="w-full">
                    <thead className="bg-gray-50/80 sticky top-0">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Patient
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Condition
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="4" className="px-5 py-12 text-center">
                            <div className="flex flex-col items-center text-gray-400">
                              <Loader2 className="w-6 h-6 animate-spin mb-2" />
                              <p className="text-sm">Loading patients...</p>
                            </div>
                          </td>
                        </tr>
                      ) : patients.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-5 py-12 text-center">
                            <div className="flex flex-col items-center text-gray-400">
                              <Users className="w-6 h-6 mb-2" />
                              <p className="text-sm">No patients found</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        patients.slice(0, 8).map((patient) => (
                          <tr
                            key={patient._id}
                            className="hover:bg-gray-50/50 cozy-transition"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-black bg-blue-50 font-bold">
                                  
                                  {patient.patientImage}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {patient.firstName} {patient.lastName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {patient.gender} •{" "}
                                    {patient.date
                                      ? new Date(
                                          patient.date,
                                        ).toLocaleDateString()
                                      : ""}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span className="text-sm text-gray-600">
                                {patient.disease || "General checkup"}
                              </span>
                            </td>
                            <td className="px-5 py-4 w-1/20">
                              {patient.isHospitalized ? (
                                <Badge color="red">Hospitalized</Badge>
                              ) : (
                                <Badge color="green">Active</Badge>
                              )}
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit(patient)}
                                  className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 cozy-transition"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(patient._id)}
                                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 cozy-transition"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleHospitalize(patient._id)}
                                  className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-600 cozy-transition"
                                >
                                  <ActivitySquare className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-2xl cozy-shadow border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">
                      Recent Requests
                    </h3>
                    <button
                      onClick={fetchRequests}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <RefreshCw className="w-4 h-4 inline mr-1" />
                      Refresh
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                  {myRequests.length === 0 ? (
                    <div className="grid grid-cols-4 items-center py-8 text-gray-400">
                      <ClipboardList className="w-5 h-5 mb-2" />
                      <p className="text-sm">No requests found</p>
                    </div>
                  ) : (
                    myRequests.map((request) => (
                      <div
                        key={request._id}
                        className="p-4 rounded-xl bg-gray-50/50 border border-gray-100 hover:border-gray-200 cozy-transition"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="text-sm font-medium text-gray-800 truncate">
                            {request.itemName || "Request"}
                          </h4>
                          <span
                            className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                              request.Status === "approved"
                                ? "bg-green-100 text-green-700"
                                : request.Status === "rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            <Badge color={request.Status === "approved"
                                ? "success"
                                : request.Status === "rejected"
                                  ? "danger"
                                  : "warning"
                            }>
                              {request.Status}
                            </Badge>
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">
                          {request.requestType}
                        </p>
                        <div className="flex justify-between text-xs text-gray-400">
                          <div className="flex flex-col gap-1">
                            <span>Qty: {request.quantity}</span>
                          <span>Urg: {request.urgency}</span>
                          </div>
                          <div>
                            <Trash2 className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700" onClick={(e)=>handleDeleteRequest(request._id,e)} />
                            </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Patient Form Modal with Blur Effect */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop-blur">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => {
              setShowForm(false);
              resetForm();
            }}
          />

          <div className="relative z-10 bg-white rounded-2xl cozy-shadow-lg w-[500px] h-[500px] overflow-y-auto transform transition-all duration-300 scale-100">
            <div className="sticky top-0 bg-white z-20 flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {editingPatientId ? "Edit Patient" : "Add New Patient"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {editingPatientId
                    ? "Update patient information"
                    : "Add a new patient to the system"}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="p-2 rounded-xl hover:bg-gray-100 cozy-transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {formError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {formError}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white text-sm"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marital Status
                  </label>
                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white text-sm"
                  >
                    <option value="">Select Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                      {patientImage ? (
                        <img
                          src={URL.createObjectURL(patientImage)}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <User className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setPatientImage(e.target.files[0])}
                        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        JPEG, PNG up to 2MB
                      </p>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Disease / Condition *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter disease or condition"
                    value={disease}
                    onChange={(e) => setDisease(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white text-sm"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-5 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl cozy-transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-600 cozy-transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {editingPatientId ? "Updating..." : "Adding..."}
                    </>
                  ) : editingPatientId ? (
                    <>
                      <Save className="w-4 h-4" />
                      Update Patient
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Add Patient
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Form Modal with Blur Effect */}
      {showRequestForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop-blur">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => {
              setShowRequestForm(false);
              resetRequestForm();
            }}
          />

          <div className="relative z-10 bg-white rounded-2xl cozy-shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
            <div className="sticky top-0 bg-white z-20 flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  New Request
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Submit a new request for medicine, equipment, or supplies
                </p>
              </div>
              <button
                onClick={() => {
                  setShowRequestForm(false);
                  resetRequestForm();
                }}
                className="p-2 rounded-xl hover:bg-gray-100 cozy-transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleRequestSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Request Type *
                  </label>
                  <select
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white text-sm"
                  >
                    <option value="Medicine Request">Medicine Request</option>
                    <option value="Equipment Request">Equipment Request</option>
                    <option value="Supply Request">Supply Request</option>
                    <option value="Blood Request">Blood Request</option>
                    <option value="Lab Test Request">Lab Test Request</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency Level *
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white text-sm"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter item name or description"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    placeholder="Enter quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white text-sm"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Count
                  </label>
                  <input
                    type="number"
                    placeholder="Number of patients"
                    value={patientCount}
                    onChange={(e) => setPatientCount(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white text-sm"
                    min="0"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Request *
                  </label>
                  <textarea
                    placeholder="Please provide detailed reason for this request..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white text-sm resize-none"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 text-sm text-blue-700 mb-1">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium">Request Guidelines</span>
                </div>
                <ul className="text-xs text-blue-600 space-y-1 ml-6 list-disc">
                  <li>Please specify exact item names and quantities</li>
                  <li>Critical requests will be prioritized</li>
                  <li>Provide patient count if applicable</li>
                  <li>Requests are typically processed within 24 hours</li>
                </ul>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowRequestForm(false);
                    resetRequestForm();
                  }}
                  className="px-5 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl cozy-transition"
                >
                  Cancel
                </button>
                <button
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

                  <span>Add New</span>
                </button>
                
              </div>
            </form>
          </div>
        </div>
      )}

     
      {(showProfileMenu) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowNotifications(false);
            setShowProfileMenu(false);
          }}
        />
      )}

      <ToastContainer
        position="bottom-right"
        toastClassName="!bg-white !text-gray-800 !rounded-xl !shadow-lg !border !border-gray-100"
      />
    </div>
  );
}
