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
  const [maritalStatus, setMaritalStatus] = useState("");
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
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:4000/api/patients/", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
        date,
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
        const response = await axios.post(
          "http://localhost:4000/api/patients/create",
          patientData,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setPatients((prev) => [...prev, response.data]);
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
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
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

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 cozy-transition"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  {myRequests.length > 0 && (
                    <span className="absolute top-1 -right-1 w-5 h-5 bg-red-100 text-red-500 text-xs font-medium rounded-full flex items-center justify-center">
                      {myRequests.length}
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
                      {myRequests.length === 0 ? (
                        <div className="px-4 py-8 text-center text-gray-500">
                          No new notifications
                        </div>
                      ) : (
                        myRequests.slice(0, 5).map((request, index) => (
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

            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-8">
              <div className="p-1">
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:border-blue-500 hover:bg-white hover:text-blue-700 transition-all duration-200 shadow-xs hover:shadow"
                >
                  <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center">
                    <Plus className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <span>Add New Patient</span>
                </button>
              </div>

              <div className="p-1">
                <button
                  onClick={() => setShowRequestForm(true)}
                  className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:border-emerald-500 hover:bg-white hover:text-emerald-700 transition-all duration-200 shadow-xs hover:shadow"
                >
                  <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center">
                    <Send className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span>Submit New Request</span>
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
                    <tbody classNae="hover:bg-gray-300">
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
                                <div className="w-10 h-1 rounded-xl flex items-center justify-center text-white font-bold">
                                  {patient.firstName?.charAt(0)}
                                  {patient.lastName?.charAt(0)}
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

              {/* Recent Requests Sidebar */}
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
                    <div className="flex flex-col items-center py-8 text-gray-400">
                      <ClipboardList className="w-5 h-5 mb-2" />
                      <p className="text-sm">No requests found</p>
                    </div>
                  ) : (
                    myRequests.slice(0, 5).map((request) => (
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
                            {request.Status || "Pending"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">
                          {request.requestType}
                        </p>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Qty: {request.quantity}</span>
                          <span>Urg: {request.urgency}</span>
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

      {showForm && (
        <div className="fixed inset-0 bg-black/5 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl cozy-shadow-lg max-w-2xl w-full overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingPatientId ? "Edit Patient" : "Add New Patient"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="p-2 rounded-xl hover:bg-gray-100 cozy-transition"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5">
              {formError && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">
                  {formError}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    First Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Gender *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-sm"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Marital Status *
                  </label>
                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-sm"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Disease/Condition *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter disease or condition"
                    value={disease}
                    onChange={(e) => setDisease(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-sm"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl cozy-transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2.5 bg-black text-white font-medium rounded-xl hover:bg-gray-800 cozy-transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
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

      {/* Request Form Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black/5 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl cozy-shadow-lg max-w-2xl w-full overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">
                New Request
              </h2>
              <button
                onClick={() => {
                  setShowRequestForm(false);
                  resetRequestForm();
                }}
                className="p-2 rounded-xl hover:bg-gray-100 cozy-transition"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleRequestSubmit} className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Request Type *
                  </label>
                  <select
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-sm"
                  >
                    <option value="Medicine Request">Medicine Request</option>
                    <option value="Equipment Request">Equipment Request</option>
                    <option value="Supply Request">Supply Request</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Urgency *
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter item name"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    placeholder="Enter quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-sm"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Patient Count
                  </label>
                  <input
                    type="number"
                    placeholder="Number of patients"
                    value={patientCount}
                    onChange={(e) => setPatientCount(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-sm"
                    min="0"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Reason *
                  </label>
                  <textarea
                    placeholder="Enter reason for request"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2.5 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-sm"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowRequestForm(false);
                    resetRequestForm();
                  }}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl cozy-transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-600 cozy-transition flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit Request
                </button>
              </div>
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