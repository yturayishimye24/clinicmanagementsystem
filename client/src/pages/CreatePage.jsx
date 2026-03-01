import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { Badge } from "flowbite-react";
import { FileInput, Label } from "flowbite-react";

import {
  Bell,
  Calendar,
  Users,
  ClipboardList,
  Loader2,
  Home,
  Trash2,
  Search,
  Plus,
  LogOut,
  Settings,
  User,
  Edit,
  ActivitySquare,
  AlertCircle,
  BarChart3,
  MessageSquare,
  Save,
  Check,
  Clock,
  X,
  Play,
  Grid,
  Moon,
  ArrowUpRight,
} from "lucide-react";
import {SignedIn, UserButton} from "@clerk/clerk-react"

// --- CUSTOM STYLES & FONTS ---
const FontStyles = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
      
      body, .font-sans {
        font-family: 'Plus Jakarta Sans', sans-serif;
      }
      
      .cozy-shadow {
        box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.03);
      }
      
      .cozy-transition {
        transition: all 0.2s ease-in-out;
      }

     /* Base styling for the layout and shape */
.sidebar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 20px;
  border-radius: 24px; /* Gives it that smooth, rounded box shape */
  gap: 8px; /* Spacing between the icon and the text */
  transition: background-color 0.2s ease-in-out;
  cursor: pointer;
  width: fit-content; 
}

/* 1. The Light Gray Background on Hover */
.sidebar-item:hover {
  background-color: #f4f5f7; 
}

/* 2. The Gradient Text on Hover */
.sidebar-item:hover .menu-text {
  /* Creates the green-to-teal gradient seen in the image */
  background: linear-gradient(to right, #65a30d, #06b6d4); 
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 500;
}

/* (Optional) Keep the icon a solid green on hover if needed */
.sidebar-item:hover .icon {
  fill: #65a30d; 
}
      
      /* Form Modal Blur */
      .modal-backdrop-blur {
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
      }
    `}
  </style>
);

export default function NursePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // --- STATES ---
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  // Patient Form States
  const [firstName, setFirstName] = useState("");
  const [gender, setGender] = useState("");
  const [lastName, setLastName] = useState("");
  const [date, setDate] = useState("");
  const [patientImage, setPatientImage] = useState(null);
  const [disease, setDisease] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [formError, setFormError] = useState("");

  // Report States
  const [reportTitle, setReportTitle] = useState("");
  const [body, setBody] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [reporting, setReporting] = useState(false);
  const [reports, setReports] = useState([]);
  const [reportForm, ShowReportForm] = useState(false);

  // Request Form States
  const [requestType, setRequestType] = useState("Medicine Request");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [urgency, setUrgency] = useState("medium");
  const [reason, setReason] = useState("");
  const [patientCount, setPatientCount] = useState(0);

  // UI & Data States
  const [myRequests, setMyRequests] = useState([]);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Determine current page
  const isOnPatients = location.pathname === "/home/patients";
  const isOnRequests = location.pathname === "/home/requests";
  const isOnReports = location.pathname === "/home/reports";
  const isOnSettings = location.pathname === "/home/settings";
  const isOnDashboard =
    location.pathname === "/home" || location.pathname === "/home/";

  // --- FETCHING DATA ---
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${backendUrl}/api/patients/displayPatients`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const d = response.data;
      setPatients(Array.isArray(d) ? d : (d.users ?? []));
    } catch (error) {
      toast.error("Failed to fetch patients.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${backendUrl}/api/requests/showRequests`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const d = response.data;
      setMyRequests(
        Array.isArray(d) ? d : Array.isArray(d.requests) ? d.requests : [],
      );
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEmail = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendUrl}/api/infos/email`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmail(response.data.email);
      setUsername(response.data.username);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/");
      return;
    }
    if (role !== "nurse") {
      toast.error("Unauthorized access");
      navigate("/");
    }

    fetchEmail();
    fetchPatients();
    fetchRequests();
  }, [navigate]);

  // --- ACTIONS ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setTimeout(() => navigate("/"), 2000);
    setTimeout(() => toast.success("Logged out Successfully!"), 2000);
  };

  const Report = async (e) => {
    e.preventDefault();
    setReporting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${backendUrl}/api/report/create_report`,
        { title: reportTitle, body, conclusion },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Report generated!");

      ShowReportForm(false);
      setReportTitle("");
      setBody("");
      setConclusion("");
    } catch (error) {
      toast.error("Failed to generate report.");
    } finally {
      setReporting(false);
    }
  };
  const displayReports = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${backendUrl}/api/report/display-report`,
      );
      if (response.data.success) {
        setReports(response.data.report);
      }
    } catch (error) {
      console.log("Error displaying reports", error);
    }
  };
  const handleHospitalize = async (patientId) => {
    if (!window.confirm("Hospitalize this patient?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${backendUrl}/api/patients/${patientId}/hospitalize`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Status updated");
      fetchPatients();
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  const handleDelete = async (patientId) => {
    if (!window.confirm("Delete this patient?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${backendUrl}/api/patients/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients((prev) => prev.filter((p) => p._id !== patientId));
      toast.success("Patient deleted");
    } catch (error) {
      toast.error("Error deleting patient");
    }
  };

  const handleDeleteRequest = async (requestId, e) => {
    e.preventDefault();
    if (!window.confirm("Delete this request?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${backendUrl}/api/requests/removeRequests/${requestId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setMyRequests((prev) => prev.filter((r) => r._id !== requestId));
      toast.success("Request deleted");
    } catch (error) {
      toast.error("Error deleting request");
    }
  };

  // --- FORM HANDLERS ---
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
        gender,
      };

      if (editingPatientId) {
        const response = await axios.put(
          `${backendUrl}/api/patients/${editingPatientId}`,
          patientData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setPatients((prev) =>
          prev.map((p) => (p._id === editingPatientId ? response.data : p)),
        );
        toast.success("Patient updated");
      } else {
        const response = await axios.post(
          `${backendUrl}/api/patients/create`,
          patientData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setPatients((prev) => [...prev, response.data.patient]);
        toast.success("Patient added");
      }
      setShowForm(false);
      resetForm();
    } catch (error) {
      setFormError("Failed to save patient.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
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
        `${backendUrl}/api/requests/createRequests`,
        requestData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.data.success) {
        toast.success("Request submitted");
        setShowRequestForm(false);
        fetchRequests();
        // Reset request form
        setItemName("");
        setQuantity("");
        setReason("");
      }
    } catch (error) {
      toast.error("Failed to submit request");
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const userFullName =
      `${patient.firstName} ${patient.lastName}`.toLowerCase();
    return (
      userFullName.includes(searchTerm.toLowerCase()) ||
      patient.disease.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // --- SUB COMPONENTS ---

  const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <div
      onClick={onClick}
      className={`sidebar-item flex flex-col items-center justify-center gap-1.5 p-3 cursor-pointer group w-full ${active ? "text-emerald-600" : "text-gray-400"}`}
    >
      <div
        className={`icon-container w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${active ? "bg-emerald-50 text-emerald-600 shadow-sm" : "bg-transparent group-hover:bg-gray-50 text-gray-400"}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-[10px] font-semibold tracking-wide">{label}</span>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const s = status?.toLowerCase() || "";
    if (s === "approved" || s === "active")
      return (
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200">
          <Check className="w-4 h-4 text-emerald-600" />
        </div>
      );
    if (s === "hospitalized" || s === "rejected")
      return (
        <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center border border-rose-200">
          <X className="w-4 h-4 text-rose-600" />
        </div>
      );
    return (
      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center border border-amber-200">
        <Clock className="w-4 h-4 text-amber-600" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-base-200 font-sans flex">
      <FontStyles />

      {/* --- SIDEBAR (Full height from top) --- */}
      <aside className="fixed left-0 top-0 h-screen w-25 bg-base-100 border-r border-base-300 z-40 flex flex-col items-center py-6 gap-2 overflow-y-auto shadow-lg">
        <SidebarItem
          icon={Home}
          label="Dashboard"
          active={isOnDashboard}
          onClick={() => navigate("/home")}
        />
        <SidebarItem
          icon={Users}
          label="Patients"
          active={isOnPatients}
          onClick={() => navigate("/home/patients")}
        />
        <SidebarItem
          icon={ClipboardList}
          label="Requests"
          active={isOnRequests}
          onClick={() => navigate("/home/requests")}
          count={myRequests.length}
        />
        <SidebarItem
          icon={BarChart3}
          label="Reports"
          active={isOnReports}
          onClick={() => navigate("/home/reports")}
        />

        <div className="mt-auto">
          <SidebarItem
            icon={Settings}
            label="Settings"
            active={isOnSettings}
            onClick={() => navigate("/home/settings")}
          />
        </div>
      </aside>

      {/* --- Main Container (Sidebar + Content) --- */}
      <div className="flex-1 flex flex-col ml-25">
        {/* --- NAVBAR --- */}
        <div className="navbar bg-base-200/50 rounded-box p-3 shadow-sm flex justify-between">
          {/* --- LEFT: Search Bar --- */}
          <div className="flex-1">
            <label className="input flex items-center gap-2 rounded-full bg-base-100 border-none shadow-sm h-11 w-full max-w-xs px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-5 h-5 opacity-50"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="text"
                className="grow text-sm placeholder:text-base-content/40"
                placeholder="Search task"
              />
              <div className="flex gap-1">
                <kbd className="kbd kbd-sm bg-base-200/70 border-none text-base-content/60 font-sans">
                  ⌘
                </kbd>
                <kbd className="kbd kbd-sm bg-base-200/70 border-none text-base-content/60 font-sans">
                  F
                </kbd>
              </div>
            </label>
          </div>

          {/* --- RIGHT: Actions & Profile --- */}
          <div className="flex-none flex items-center gap-3">
            {/* Mail Button */}
            <button className="btn btn-circle bg-base-100 border-none shadow-sm hover:bg-base-200 h-11 w-11 min-h-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-base-content/70"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
            </button>

            {/* Notification Button */}
            <button className="btn btn-circle bg-base-100 border-none shadow-sm hover:bg-base-200 h-11 w-11 min-h-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-base-content/70"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
            </button>

            {/* Profile Dropdown */}
            <div className="dropdown dropdown-end ml-1">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost hover:bg-base-200/50 h-auto min-h-0 py-1 px-2 rounded-full flex items-center gap-3 border-none shadow-none"
              >
                {/* Avatar */}
                <SignedIn>
                  <UserButton/>
                </SignedIn>
                <div className="avatar">
                  <div className="w-10 rounded-full bg-rose-200">
                    <img
                      alt="User avatar"
                      src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    />
                  </div>
                </div>

                {/* User Info (Hidden on very small screens) */}
                <div className="hidden sm:flex flex-col items-start text-left pr-2">
                  <span className="text-sm font-bold text-base-content leading-tight">
                    Totok Michael
                  </span>
                  <span className="text-xs text-base-content/60 font-normal mt-0.5">
                    tmichael20@mail.com
                  </span>
                </div>
              </div>

              {/* Dropdown Menu */}
              <ul
                tabIndex="-1"
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border border-base-200"
              >
                <li>
                  <a className="justify-between">
                    Profile
                    <span className="badge badge-sm badge-primary">New</span>
                  </a>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li className="text-error" onClick={() => handleLogout()}>
                  <a>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 pt-4 px-6 lg:px-10 pb-10 overflow-y-auto">
          {isOnDashboard ? (
            <>
              {/* Header & Actions */}
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-base-content tracking-tight">
                    Overview
                  </h1>
                  <p className="text-base-content/60 mt-1 font-medium">
                    Welcome back, {username || "Nurse"} 👋
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRequestForm(true)}
                    className="btn btn-outline btn-sm gap-2"
                  >
                    <ClipboardList className="w-4 h-4" /> Request Item
                  </button>
                  <button
                    onClick={() => setShowForm(true)}
                    className="btn btn-primary btn-sm gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Patient
                  </button>
                  <button
                    onClick={() => ShowReportForm(true)}
                    className="btn btn-ghost btn-circle btn-sm"
                  >
                    <BarChart3 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* --- CARDS (Based on Dashboard.png) --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {/* Card 1: Green Primary */}
                <div className="bg-[#134e4a] rounded-3xl p-6 relative overflow-hidden group">
                  <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition"></div>
                  <div className="relative z-10 flex justify-between items-start">
                    <span className="text-emerald-100/80 font-medium text-sm">
                      Total Patients
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                  <h2 className="relative z-10 text-5xl font-bold text-white mt-4">
                    {patients.length}
                  </h2>
                  <div className="relative z-10 mt-4 flex items-center gap-2">
                    <span className="bg-emerald-500/20 text-emerald-100 text-xs px-2 py-1 rounded-lg border border-emerald-500/30">
                      +2 New
                    </span>
                  </div>
                </div>

                {/* Card 2: Hospitalized */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 cozy-shadow hover:-translate-y-0.5 transition duration-300">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-500 font-medium text-sm">
                      Hospitalized
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-emerald-600">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                  <h2 className="text-5xl font-bold text-gray-800 mt-4">
                    {patients.filter((p) => p.isHospitalized).length}
                  </h2>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="bg-rose-50 text-rose-600 text-xs px-2 py-1 rounded-lg">
                      Critical Care
                    </span>
                  </div>
                </div>

                {/* Card 3: Requests */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 cozy-shadow hover:-translate-y-0.5 transition duration-300">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-500 font-medium text-sm">
                      Pending Requests
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                  <h2 className="text-5xl font-bold text-gray-800 mt-4">
                    {myRequests.filter((r) => r.Status === "pending").length}
                  </h2>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="bg-amber-50 text-amber-600 text-xs px-2 py-1 rounded-lg">
                      Awaiting Approval
                    </span>
                  </div>
                </div>

                {/* Card 4: Reports */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 cozy-shadow hover:-translate-y-0.5 transition duration-300">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-500 font-medium text-sm">
                      Reports Generated
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                  <h2 className="text-5xl font-bold text-gray-800 mt-4">
                    {reports.length}
                  </h2>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="bg-blue-50 text-blue-600 text-px-2 py-1 rounded-lg">
                      This Month
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* --- PATIENTS TABLE --- */}
                <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 cozy-shadow overflow-hidden">
                  <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-800">
                      Assigned Patients
                    </h3>
                    <div className="relative">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-emerald-500/20 w-48"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50/50">
                        <tr>
                          <th className="pl-6 py-4 text-xs font-semibold text-gray-400 uppercase">
                            Patient
                          </th>
                          <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase">
                            Condition
                          </th>
                          <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase">
                            Status
                          </th>
                          <th className="pr-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-base-300">
                        {loading ? (
                          <tr>
                            <td colSpan="4" className="p-6">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-4 mb-4 p-4 rounded-lg bg-base-100"
                                >
                                  <div className="skeleton h-10 w-10 rounded-full shrink-0"></div>
                                  <div className="flex-1">
                                    <div className="skeleton h-4 w-32 mb-2"></div>
                                    <div className="skeleton h-3 w-24"></div>
                                  </div>
                                  <div className="skeleton h-8 w-16"></div>
                                </div>
                              ))}
                            </td>
                          </tr>
                        ) : (
                          filteredPatients.slice(0, 8).map((patient) => (
                            <tr
                              key={patient._id}
                              className="hover:bg-base-200 transition group"
                            >
                              <td className="pl-6 py-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={`${backendUrl}/uploads/${patient.image}`}
                                    alt=""
                                    className="w-10 h-10 rounded-xl object-cover bg-base-300"
                                  />
                                  <div>
                                    <p className="font-bold text-sm text-base-content">
                                      {patient.firstName} {patient.lastName}
                                    </p>
                                    <p className="text-xs text-base-content/60">
                                      {patient.gender},{" "}
                                      {new Date().getFullYear() -
                                        new Date(
                                          patient.date,
                                        ).getFullYear()}{" "}
                                      yrs
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-sm text-base-content/80 font-medium">
                                {patient.disease}
                              </td>
                              <td className="px-4 py-4">
                                <span
                                  className={`badge ${patient.isHospitalized ? "badge-error" : "badge-success"}`}
                                >
                                  {patient.isHospitalized
                                    ? "Hospitalized"
                                    : "Active"}
                                </span>
                              </td>
                              <td className="pr-6 py-4 text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => handleEdit(patient)}
                                    className="btn btn-ghost btn-xs btn-circle"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleHospitalize(patient._id)
                                    }
                                    className="btn btn-warning btn-xs btn-circle"
                                  >
                                    <ActivitySquare className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(patient._id)}
                                    className="btn btn-error btn-xs btn-circle"
                                  >
                                    <Trash2 className="w-4 h-4" />
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

                {/* --- REQUESTS LIST (Based on Requests.png style) --- */}
                <div className="card bg-base-100 shadow-md flex flex-col h-150">
                  <div className="card-body p-4 pb-0 border-b border-base-300 flex justify-between items-center flex-row">
                    <h3 className="card-title text-lg">My Requests</h3>
                    <button
                      onClick={fetchRequests}
                      className="btn btn-ghost btn-sm"
                    >
                      {" "}
                      Refresh
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-2">
                    {myRequests.length === 0 ? (
                      <div className="text-center text-base-content/50 py-10">
                        No requests
                      </div>
                    ) : (
                      myRequests.map((req) => (
                        <div
                          key={req._id}
                          className="flex items-center justify-between p-4 hover:bg-base-200 rounded-lg transition border border-transparent hover:border-base-300 mb-1 group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="badge badge-primary">
                              {req.itemName.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-base-content">
                                {req.itemName}
                              </p>
                              <p className="text-xs text-base-content/60">
                                {req.requestType} • Qty: {req.quantity}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <StatusBadge status={req.Status} />
                            <button
                              onClick={(e) => handleDeleteRequest(req._id, e)}
                              className="btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-4 border-t border-base-300">
                    <button
                      onClick={() => setShowRequestForm(true)}
                      className="btn btn-outline w-full btn-sm"
                    >
                      <Plus className="w-4 h-4" /> New Request
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Outlet
              context={{
                username,
                email,
                myRequests,
                patients,
                reports,
                showForm,
                setShowForm,
                showRequestForm,
                setShowRequestForm,
                filteredPatients,
                loading,
                searchTerm,
                setSearchTerm,
                handleEdit,
                handleDelete,
                handleHospitalize,
                handleDeleteRequest,
                handleRequestSubmit,
                StatusBadge,
                firstName,
                setFirstName,
                lastName,
                setLastName,
                gender,
                setGender,
                date,
                setDate,
                disease,
                setDisease,
                maritalStatus,
                setMaritalStatus,
                formError,
                editingPatientId,
                resetForm,
                handleSubmit,
                backendUrl,
                itemName,
                setItemName,
                quantity,
                setQuantity,
                urgency,
                setUrgency,
                reason,
                setReason,
                requestType,
                setRequestType,
              }}
            />
          )}
        </main>
      </div>

      {reportForm && (
        <dialog
          className="modal modal-open"
          onClick={() => ShowReportForm(false)}
        >
          <div
            className="modal-box w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-bold text-lg mb-6">Generate Report</h2>
            <form onSubmit={Report} className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Title</span>
                </label>
                <input
                  type="text"
                  required
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="Enter report title"
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Observations</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Enter observations"
                  className="textarea textarea-bordered w-full"
                ></textarea>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Conclusion</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={conclusion}
                  onChange={(e) => setConclusion(e.target.value)}
                  placeholder="Enter conclusion"
                  className="textarea textarea-bordered w-full"
                ></textarea>
              </div>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => ShowReportForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {reporting ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    "Submit Report"
                  )}
                </button>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => ShowReportForm(false)}>close</button>
          </form>
        </dialog>
      )}

      {showForm && (
        <dialog className="modal modal-open" onClick={() => setShowForm(false)}>
          <div
            className="modal-box w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-bold text-lg mb-6">
              {editingPatientId ? "Edit Patient" : "Add Patient"}
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="label">
                  <span className="label-text font-semibold">First Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter first name"
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Last Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter last name"
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">
                    Date of Birth
                  </span>
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Gender</span>
                </label>
                <select
                  required
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="label">
                  <span className="label-text font-semibold">
                    Condition / Disease
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={disease}
                  onChange={(e) => setDisease(e.target.value)}
                  placeholder="Enter condition"
                  className="input input-bordered w-full"
                />
              </div>
              <div className="md:col-span-2 modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Record
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowForm(false)}>close</button>
          </form>
        </dialog>
      )}

      {showRequestForm && (
        <dialog
          className="modal modal-open"
          onClick={() => setShowRequestForm(false)}
        >
          <div
            className="modal-box w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-bold text-lg mb-6">New Request</h2>
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Type</span>
                </label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option>Medicine Request</option>
                  <option>Equipment Request</option>
                  <option>Supply Request</option>
                </select>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Item Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Enter item name"
                  className="input input-bordered w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Quantity</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0"
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Urgency</span>
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Reason</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason"
                  className="textarea textarea-bordered w-full"
                ></textarea>
              </div>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowRequestForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowRequestForm(false)}>close</button>
          </form>
        </dialog>
      )}

      <ToastContainer
        position="bottom-right"
        toastClassName="!bg-white !text-gray-800 !rounded-xl !shadow-lg"
      />
    </div>
  );
}
