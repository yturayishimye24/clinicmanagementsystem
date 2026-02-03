import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Spinner } from "flowbite-react";
import socket, { connectSocket } from "../socket.js";

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
  Trash2,
  ClipboardList,
  MoreVertical,
  Stethoscope,
  Package,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  LogOut,
  Settings,
  User,
} from "lucide-react";

export default function AdminPage() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [requests, setRequests] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [email, setEmails] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [image, setImage] = useState("");
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [em, setEmail] = useState("");
  const [hireDate,setHireDate]=useState(Date.now());
  const [password, setPassword] = useState("");
  const [nurseUsername, setNurseUsername] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formRole, setFormRole] = useState("");
  const [approving, setApproving] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [adding, setAdding] = useState(false);
  const [loadingNurses, setLoadingNurses] = useState(false);
  const nurseRef = useRef(null);
  const patientRef = useRef(null);
  const requestRef = useRef(null);

  const handleGoNurses = () => {
    nurseRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleGoPatients = () => {
    patientRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleGoRequests = () => {
    requestRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAccount = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/accounts/signup",
        {
          username: nurseUsername,
          email: em,
          password,
          role: formRole,
        },
      );
      if (response.data.success) {
        toast.success("Account created successfully");
        // refresh nurses list (do not overwrite admin session/localStorage)
        fetchNurses();
        setEmail("");
        setPassword("");
        setFormRole("");
        setNurseUsername("");
        setShowForm(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Error creating account");
    } finally {
      setAdding(false);
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

    connectSocket();
  }, [navigate]);

  useEffect(() => {
    const handler = (newNurse) => {
      toast.info("New nurse added");
      setNurses((prev) => [newNurse, ...prev]);
    };
    socket.on("newNurse", handler);
    return () => socket.off("newNurse", handler);
  }, []);
  useEffect(() => {
    socket.on("requestCreated", (req) => {
      toast.info("New request received");
      setRequests((prev) => [req, ...prev]);
    });
    return () => socket.off("requestCreated");
  }, []);
useEffect(() => {
  const handler = (requestId) => {
    toast.info("A request has been deleted");
    setRequests((prev) => prev.filter((r) => r._id !== requestId));
  };
  socket.on("requestDeleted", handler);
  return () => socket.off("requestDeleted", handler);
},[])
  useEffect(() => {
    socket.on("patientCreated", (newPatient) => {
      toast.info("New patient added");

      setPatients((prev) => [newPatient, ...prev]);
    });

    return () => {
      socket.off("patientCreated");
    };
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
      console.loge("fetchRequests error:", err);
      toast.error("Error getting requests");
      setRequests([]);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleDeleteRequests = async (requestId, e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try{
    const token = localStorage.getItem("token");
    const response = await axios.delete(`http://localhost:4000/api/requests/removeRequests/${requestId}`,{ headers: { Authorization: `Bearer ${token}` } });
    const d = response.data;
    if (d.success) {
      toast.success("Request deleted successfully");
      setRequests((prev) => prev.filter((request) => request._id !== requestId));
    }
    }catch(err){
      console.log("handleDeleteRequests error:", err);
      toast.error("Error deleting request");
    }
  }
  useEffect(() => {
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
        setImage(response.data.image);
        localStorage.setItem("image", response.data.image);
      } catch (error) {
        console.log("Error fetching email:", error);
      }
    };
    fetchEmail();
  }, []);

  const fetchPatients = async () => {
    setLoadingPatients(true);
    try {
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
    } catch (err) {
      console.error("fetchPatients error:", err.message);
      toast.error(err.message);
      setPatients([]);
    } finally {
      setLoadingPatients(false);
    }
  };

  // Fetch nurses moved to top-level so other handlers (eg. handleAccount) can call it
  const fetchNurses = async (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    setLoadingNurses(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:4000/api/accounts/nurses/",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setNurses(response.data.nurses || []);
    } catch (err) {
      console.log("fetchNurses error:", err.message);
      toast.error("Error getting nurses");
      setNurses([]);
    } finally {
      setLoadingNurses(false);
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const fullName =
      `${patient.firstName} ${patient.lastName || ""}`.toLowerCase();
    const disease = (patient.disease || "General checkup").toLowerCase();
    const status = (patient.Status || "").toLowerCase();

    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      disease.includes(searchTerm.toLowerCase()) ||
      status.includes(searchTerm.toLowerCase())
    );
  });

  useEffect(() => {
    fetchPatients();
    fetchNurses();
  },[]);

  useEffect(() => {
    fetchPatients();
    fetchRequests();
  }, []);

  const handleLogout = () => {
    toast.info("Logging out...");
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/");
      toast.success("Successfully logged out!");
    }, 1000);
  };
  const handleDeleteRequest = async (requestId, e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this request?"))
      return;
    try{
      const token = localStorage.getItem("token");
      const deleleteResponse = await axios.delete(`http://localhost:4000/api/requests/removeRequests/${requestId}`,{
        headers:{ Authorization: `Bearer ${token}` }
      });
      if(!deleleteResponse.data.success){
        toast.error("Error deleting request");
        return;
      }
      toast.success("Request deleted successfully!");
      fetchRequests();
    }catch(errr){
      console.log("handleDeleteRequest error:", errr);
      toast.error("Error deleting request");
    }
  }
  const handleApprove = async (requestId, e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to approve this request?"))
      return;

    try {
      setApproving(true);
      const response = await axios.patch(
        `http://localhost:4000/api/requests/approve/${requestId}`,
      );

      toast.success("Request approved!");
      fetchRequests();
    } catch (error) {
      console.log(error);
      toast.error("Error approving request");
    } finally {
      setApproving(false);
    }
  };

  const sidebarItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Users, label: "Patients", href: { handleGoPatients } },
    {
      icon: Inbox,
      label: "Requests",
      href: { handleGoRequests },
      badge: requests.length,
    },
    { icon: Stethoscope, label: "Nurses", href: { handleGoNurses } },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 cozy-shadow">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-around h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-lg font-semibold text-gray-800 tracking-tight">
                <span classNae="text-5xl text-green-500">
                  Admin
                </span>{" "}
                Dashboard
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 cozy-transition"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  {requests.length > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-200 text-red-300 font-medium rounded-full flex items-center justify-center">
                      {requests.length}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl cozy-shadow-lg border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-800">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                      {requests.length === 0 ? (
                        <div className="px-4 py-8 text-center text-gray-500">
                          No new notifications
                        </div>
                      ) : (
                        requests.slice(0, 5).map((request, index) => (
                          <div
                            key={index}
                            className="px-4 py-3 hover:bg-gray-50 cozy-transition cursor-pointer border-b border-gray-50 last:border-0"
                          >
                            <p className="text-sm text-gray-700">
                              {request.reason}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {request.createdAt
                                ? new Date(
                                    request.createdAt,
                                  ).toLocaleDateString()
                                : "Recently"}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-gray-50 cozy-transition"
                >
                  <img
                    src={localStorage.getItem("image") || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"}
                    alt="Profile"
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-700">
                      {localStorage.getItem("role")}
                    </p>
                    <p className="text-xs text-gray-400">
                      {localStorage.getItem("email") || "admin@clinic.com"}
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
                  onClick={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 cozy-transition group"
                >
                  <item.icon className="w-5 h-5 text-gray-500 group-hover:text-emerald-600 cozy-transition" />
                  {!collapsed && (
                    <>
                      <span className="font-medium text-sm">{item.label}</span>
                      {item.badge > 0 && (
                        <span className="ml-auto bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-0.5 rounded-full">
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

        <main
          className={`flex-1 cozy-transition ${collapsed ? "ml-[100px]" : "ml-[300px]"}`}
        >
          <div className="p-6 lg:p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome back,{" "}
                {localStorage.getItem("name") || username || "Admin"} 👋
                {/* <Badge color="Success">{role}</Badge> */}
              </h1>
              <p className="text-gray-500 mt-1">
                Here's what's happening at your clinic today.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-1">
              <div className="p-1">
                <button
                  className="btn btn-soft btn-secondary"
                  onClick={() => setShowForm(true)}
                >
                  Add new Nurse
                  <Plus size={24} className="ml-2" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-5 cozy-shadow border border-gray-100 flex items-center gap-4 hover:border-emerald-200 cozy-transition cursor-pointer">
                <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Add New Nurse</h3>
                  <p className="text-sm text-gray-500">
                    Record a new patient visit
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 cozy-shadow border border-gray-100 flex items-center gap-4 hover:border-blue-200 cozy-transition cursor-pointer">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Schedule Appointment
                  </h3>
                  <p className="text-sm text-gray-500">
                    Book a new appointment
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-5 cozy-shadow border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-500 text-sm">Total Patients</span>
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {patients.length}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-5 cozy-shadow border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-500 text-sm">
                    Pending Requests
                  </span>
                  <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                    <Inbox className="w-4 h-4 text-amber-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {requests.filter((r) => r.Status === "pending").length}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-5 cozy-shadow border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-500 text-sm">Active Nurses</span>
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Stethoscope className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {nurses.length}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 xl:grid-cols-3 gap-6">
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
                          name={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          type="search"
                          placeholder="Search..."
                          className="pl-9 pr-4 py-2 text-sm bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white w-48"
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
                    <thead className="bg-gray-150 sticky top-0">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Patient
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Created By
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Condition
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingPatients ? (
                        <tr>
                          <td colSpan="3" className="px-5 py-12 text-center">
                            <div className="flex flex-col items-center text-gray-400">
                              <Loader2 className="w-6 h-6 animate-spin mb-2" />
                              <p className="text-sm">Loading patients...</p>
                            </div>
                          </td>
                        </tr>
                      ) : patients.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="px-5 py-12 text-center">
                            <div className="flex flex-col items-center text-gray-400">
                              <Users className="w-6 h-6 mb-2" />
                              <p className="text-sm">No patients found</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredPatients.map((patient) => (
                          <tr
                            key={patient._id}
                            className="hover:bg-gray-100 border-b-green-300 cozy-transition cursor-pointer"
                          >
                            
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src="data:image/png;base64,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"
                                  alt={patient.firstName}
                                  className="w-10 h-10 rounded-xl object-cover"
                                />
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {patient.firstName} {patient.lastName || ""}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="badge badge-soft badge-warning">Nurse, {patient.createdBy?.username || patient.createdBy || "Unknown"}</div>
                            </td>
                            <td className="px-5 py-4">
                              <span className="text-sm text-gray-600">
                                {patient.disease || "General checkup"}
                              </span>
                            </td>
                            <td className="px-5 py-4 w-1/20">
                              {patient.Status === "hospitalized" ? (
                                <Badge color="failure">{patient.Status}</Badge>
                              ) : (
                                <Badge color="success">
                                  {patient.Status || "Active"}
                                </Badge>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div
                className="sticky top-0 left-0 bg-white rounded-2xl cozy-shadow border border-gray-100 overflow-hidden"
                ref={nurseRef}
              >
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">
                      Nursing Staff
                    </h3>
                    <button
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                      onClick={(e) => fetchNurses(e)}
                    >
                      View all
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                  {loadingNurses ? (
                    <div className="flex flex-col items-center py-8 text-gray-400">
                      <Loader2 className="w-5 h-5 animate-spin mb-2" />
                      <p className="text-sm">Loading...</p>
                    </div>
                  ) : nurses.length === 0 ? (
                    <div className="flex flex-col items-center py-8 text-gray-400">
                      <Users className="w-5 h-5 mb-2" />
                      <p className="text-sm">No nurses found</p>
                    </div>
                  ) : (
                    nurses.map((nurse, index) => (
                      <div
                        key={nurse._id || index}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cozy-transition"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face"
                          alt={nurse.username}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 text-sm truncate">
                            {nurse.username}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {nurse.email}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(nurse.hireDate).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

        
<div className="mt-6 bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
 
  <div className="p-5 flex items-center justify-between">
    <h2 className="text-lg font-semibold text-gray-800">
      Recent Requests
    </h2>

    <button
      onClick={fetchRequests}
      className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
    >
      <RefreshCw className="w-4 h-4" />
      Refresh
    </button>
  </div>

 
  <div className="hidden md:grid grid-cols-6 gap-4 px-6 py-3 text-xs font-semibold text-gray-500 border-b bg-gray-50">
    <span>Image</span>
    <span className="col-span-2">Message</span>
    <span>Status</span>
    <span className="text-right">Actions</span>
  </div>

 
  <div>
    {loadingRequests ? (
      <div className="flex flex-col items-center py-8 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin mb-2" />
        Loading requests...
      </div>
    ) : requests.length === 0 ? (
      <div className="flex flex-col items-center py-8 text-gray-400">
        <Inbox className="w-5 h-5 mb-2" />
        No requests found
      </div>
    ) : (
      requests.map((request) => (
        <div
          key={request._id}
          className="grid md:grid-cols-6 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition"
        >
          {/* Avatar */}
          <div className="flex items-center gap-3">
            <img
              src="/images/default-avatar.png"
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>


          {/* Message */}
          <div className="col-span-2">
            <p className="text-sm font-medium text-gray-800 truncate">
              {request.reason || request.itemName}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(request.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Status */}
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium w-fit ${
              request.Status === "approved"
                ? "bg-emerald-100 text-emerald-700"
                : request.Status === "rejected"
                ? "bg-rose-100 text-rose-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {request.Status}
          </span>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Trash2
              className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700"
              onClick={(e) => handleDeleteRequest(request._id, e)}
            />
            <MoreVertical className="w-4 h-4 text-gray-500 cursor-pointer" />
          </div>
        </div>
      ))
    )}
  </div>
</div>

          </div>
        </main>
      </div>

      {/* Add Nurse Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-rgba(0,0,0,0.2) backdrop-blur-xl bg-opacity-10 flex items-center justify-center z-10 p-4 w-full">
          <div className="bg-white rounded-2xl cozy-shadow-lg max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">
                Create Account
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-xl hover:bg-gray-100 cozy-transition"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleAccount} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Enter username"
                  value={nurseUsername}
                  onChange={(e) => setNurseUsername(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="example@clinic.com"
                  value={em}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white text-sm"
                  required
                />
              </div>
                 <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Hire Date
                </label>
                <input
                  type="date"
                  placeholder="Enter hire date"
                  value={hireDate}
                  onChange={(e) => setHireDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Role
                </label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white text-sm"
                  required
                >
                  <option value="">Select role</option>
                  <option value="nurse">Nurse</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={adding}
                className="w-full py-3 text-black font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 cozy-transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {adding ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <button className="btn btn-soft btn-success">
                    Create Account
                    <Plus size={16} className="ml-2" />
                  </button>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {(showNotifications || showProfileMenu) && (
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
        toastClassName="!bg-white !text-gray-800 !rounded-xl !shadow-lg"
      />
    </div>
  );
}
