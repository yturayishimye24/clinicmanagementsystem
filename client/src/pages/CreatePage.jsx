import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { ThreeDot } from "react-loading-indicators";
import {
  Users,
  Calendar,
  PlusCircle,
  FileText,
  TrendingUp,
  Activity,
  UserCircle,
  CalendarDays,
  Clock,
  Building2,
  ListChecks,
  BadgeCheck,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronDown,
  CheckCircle2,
  X,
  Pill,
  Ambulance,
  Trash2,
  Edit,
  Send,
  Package,
  Bell,
  LogOut,
  Search,
  Save,
  MoreVertical,
  Home,
  Inbox,
  Mail,
  UserCheck,
  Menu,
  Hospital,
  UserPlus,
  RefreshCw,
  Shield,
  ActivitySquare,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@heroui/react";
import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";

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

  // Dashboard state
  const [myRequests, setMyRequests] = useState([]);
  const [email, setEmail] = useState("");
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [statsData, setStatsData] = useState({
    totalPatients: 0,
    hospitalized: 0,
    pendingRequests: 0,
    approvedRequests: 0,
  });

  // Fetch initial data
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
      return;
    }

    fetchEmail();
    fetchPatients();
    fetchRequests();
  }, [navigate]);

  const handleHospitalize = async (patientId) => {
    if (!window.confirm("Hospitalize this patient?")) return;

    try {
      const token = localStorage.getItem("token");

      const res = await axios.patch(
        `http://localhost:4000/api/patients/${patientId}/hospitalize`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
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
        }
      );
      setEmail(response.data.email);
    } catch (error) {
      console.error("Error fetching email:", error);
    }
  };

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:4000/api/patients/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(response.data || []);
      setStatsData((prev) => ({
        ...prev,
        totalPatients: response.data?.length || 0,
        // hospitalized: response.data.filter((p) => p.isHospitalized).length || 0,
      }));
    } catch (error) {
      console.error("Error fetching patients:", error.message);
      toast.error("Failed to fetch patients. Please check your connection.");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:4000/api/requests/showRequests",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setMyRequests(response.data.requests || []);
        const pending =
          response.data.requests?.filter((r) => r.Status === "pending")
            .length || 0;
        const approved =
          response.data.requests?.filter((r) => r.Status === "approved")
            .length || 0;
        setStatsData((prev) => ({
          ...prev,
          pendingRequests: pending,
          approvedRequests: approved,
        }));
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
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
        prev.filter((patient) => patient._id !== patientId)
      );
      setStatsData((prev) => ({
        ...prev,
        totalPatients: prev.totalPatients - 1,
      }));
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
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPatients((prev) =>
          prev.map((patient) =>
            patient._id === editingPatientId ? response.data : patient
          )
        );
        toast.success("Patient updated successfully!");
      } else {
        const response = await axios.post(
          "http://localhost:4000/api/patients/create",
          patientData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPatients((prev) => [...prev, response.data]);
        setStatsData((prev) => ({
          ...prev,
          totalPatients: prev.totalPatients + 1,
        }));
        toast.success("Patient added successfully!");
      }

      setShowForm(false);
      resetForm();
    } catch (error) {
      setFormError(
        error.response?.data?.message ||
          "Failed to save patient. Please try again."
      );
      toast.error("Failed to save patient!");
    } finally {
      setLoading(false);
    }
  };

  // Request Operations
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        fetchRequests();
        toast.success("Request submitted successfully!");
        setShowRequestForm(false);
        resetRequestForm();
      }
    } catch (error) {
      console.error("Request submission error:", error);
      toast.error("Failed to submit request. Please try again.");
    }
  };

  // UI Helpers
  const handleLogout = () => {
    toast.info("Logging out...");
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      localStorage.removeItem("role");
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
    if (window.innerWidth < 1024) closeSidebar();
  };

  const filteredPatients = patients.filter((patient) =>
    `${patient.firstName || ""} ${patient.lastName || ""} ${
      patient.disease || ""
    }`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Stats data
  const stats = [
    {
      icon: Users,
      label: "Total Patients",
      value: statsData.totalPatients,
      change: "+12%",
      color: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Ambulance,
      label: "Hospitalized",
      value: statsData.hospitalized,
      change: "Active",
      color: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      icon: CheckCircle2,
      label: "Approved Requests",
      value: statsData.approvedRequests,
      change: "This week",
      color: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: AlertCircle,
      label: "Pending Requests",
      value: statsData.pendingRequests,
      change: "Awaiting",
      color: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-dropdown")) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Info Alert Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2">
          <HiInformationCircle className="w-5 h-5" />
          <span className="font-medium">Nurse Dashboard</span>
          <span>
            {statsData.pendingRequests > 0
              ? `You have ${statsData.pendingRequests} pending request(s)`
              : "All requests are up to date"}
          </span>
        </div>
        <button
          onClick={(e) =>
            (e.target.closest(".bg-gradient-to-r").style.display = "none")
          }
          className="p-1 hover:bg-white/20 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>

            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center">
              <Hospital className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Nurse Panel
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
                <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                {statsData.pendingRequests > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {statsData.pendingRequests}
                  </span>
                )}
              </button>
            </div>

            <div className="relative user-dropdown">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {localStorage.getItem("name")?.charAt(0) || "N"}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {localStorage.getItem("name") || "Nurse"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {email || "nurse@clinic.com"}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {localStorage.getItem("name") || "Nurse"}
                    </div>
                    <div className="text-sm text-gray-500">Nurse</div>
                  </div>
                  <div className="py-2">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <BarChart3 className="w-4 h-4 mr-3" />
                      Reports
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

      <div className="flex h-[calc(100vh-140px)]">
     
        <div
          className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity ${
            sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={closeSidebar}
        />

      
        <aside
          className={`fixed lg:static top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col z-50 transform transition-transform lg:transform-none ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold">
              {localStorage.getItem("name")?.charAt(0) || "N"}
            </div>
            <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">
              {localStorage.getItem("name") || "Nurse"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Nurse</p>
            <div className="mt-2">
              <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                Nurse
              </span>
            </div>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-1">
              {[
                { key: "Dashboard", icon: ActivitySquare, label: "Dashboard" },
                {
                  key: "Patients",
                  icon: Users,
                  label: "Patients",
                  count: patients.length,
                },
                {
                  key: "Requests",
                  icon: Package,
                  label: "Requests",
                  count: myRequests.length,
                },
                { key: "Schedule", icon: CalendarDays, label: "Schedule" },
                { key: "Medicines", icon: Pill, label: "Medicines" },
                { key: "Reports", icon: BarChart3, label: "Reports" },
                { key: "Settings", icon: Settings, label: "Settings" },
              ].map(({ key, icon: Icon, label, count }) => (
                <button
                  key={key}
                  onClick={() => setActiveItemAndClose(key)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors relative ${
                    activeItem === key
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="flex-1">{label}</span>
                  {count > 0 && (
                    <span className="px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full">
                      {count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowRequestForm(true)}
              className="w-full flex items-center justify-center px-4 py-3 mb-3 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send className="w-4 h-4 mr-2" />
              New Request
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </aside>

        
        <main className="flex-1 p-6 overflow-y-auto">
         
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Welcome,{" "}
              <span className="text-blue-600 dark:text-blue-400">
                {localStorage.getItem("name") || "Nurse"}
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage patient records, track medical history, and monitor
              treatment progress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} class="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm hover:shadow-md transition">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100">
                    {stat.icon} 
                  </div>

                  <div>
                    <p class="text-sm font-semibold text-gray-800">
                      {stat.label}
                    </p>
                    <p class="text-xs text-gray-500">{stat.value} {stat.label}</p>
                  </div>
                </div>

                <button class="p-2 rounded-lg hover:bg-gray-100 transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6 10a2 2 0 114 0 2 2 0 01-4 0zm4-6a2 2 0 100 4 2 2 0 000-4zm0 12a2 2 0 100 4 2 2 0 000-4z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <button
              onClick={() => setShowRequestForm(true)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Send className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    New Request
                  </h3>
                  <p className="text-sm text-gray-500">
                    Submit medicine or equipment request
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <PlusCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Add Patient
                  </h3>
                  <p className="text-sm text-gray-500">
                    Register new patient record
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={fetchPatients}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Refresh Data
                  </h3>
                  <p className="text-sm text-gray-500">
                    Update patient information
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => toast.info("Reports feature coming soon!")}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    View Reports
                  </h3>
                  <p className="text-sm text-gray-500">
                    Access patient statistics
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Patients Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Current Patients ({patients.length})
                </h2>
                <div className="flex items-center space-x-3">
                  <input
                    type="search"
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    onClick={fetchPatients}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Refresh"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Disease
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          <p className="mt-2 text-gray-500">
                            Loading patients...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredPatients.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <Users className="w-12 h-12 text-gray-400 mb-3" />
                          <p className="text-gray-500">No patients found</p>
                          <button
                            onClick={() => {
                              resetForm();
                              setShowForm(true);
                            }}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Add First Patient
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredPatients.map((patient) => (
                      <tr
                        key={patient._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                              {patient.firstName?.charAt(0)}
                              {patient.lastName?.charAt(0)}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {patient.firstName} {patient.lastName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {patient.date
                                  ? new Date(patient.date).toLocaleDateString()
                                  : "No DOB"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 dark:text-white">
                            {patient.gender || "Not specified"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 dark:text-white">
                            {patient.disease || "Not specified"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              patient.isHospitalized
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            }`}
                          >
                            {patient.isHospitalized ? "Hospitalized" : "Active"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(patient)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleHospitalize(patient._id)}
                              disabled={patient.isHospitalized}
                              className={`p-2 rounded-lg transition-colors ${
                                patient.isHospitalized
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "text-gray-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                              }`}
                              title={
                                patient.isHospitalized
                                  ? "Already Hospitalized"
                                  : "Hospitalize"
                              }
                            >
                              <Ambulance className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(patient._id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                              title="Delete"
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

          {/* Recent Requests */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Requests
                </h3>
                <button
                  onClick={() => setShowRequestForm(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Create New
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {myRequests.slice(0, 5).map((request) => (
                  <div
                    key={request._id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {request.itemName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {request.requestType} • Qty: {request.quantity} •
                          Urgency: {request.urgency}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {request.reason?.substring(0, 60)}...
                        </p>
                      </div>
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          request.Status === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : request.Status === "approved"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {request.Status}
                      </span>
                    </div>
                  </div>
                ))}
                {myRequests.length === 0 && (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No requests yet</p>
                    <button
                      onClick={() => setShowRequestForm(true)}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create First Request
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Patient Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {editingPatientId ? "Edit Patient" : "Add New Patient"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                {formError && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-sm">
                    {formError}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Gender *
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Marital Status *
                    </label>
                    <select
                      value={maritalStatus}
                      onChange={(e) => setMaritalStatus(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Status</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Disease/Condition *
                    </label>
                    <input
                      type="text"
                      value={disease}
                      onChange={(e) => setDisease(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {editingPatientId ? "Updating..." : "Adding..."}
                      </>
                    ) : editingPatientId ? (
                      <>
                        <Save className="w-4 h-4" />
                        Update Patient
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-4 h-4" />
                        Add Patient
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Request Form Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                New Request
              </h2>
              <button
                onClick={() => {
                  setShowRequestForm(false);
                  resetRequestForm();
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleRequestSubmit}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Request Type *
                      </label>
                      <select
                        value={requestType}
                        onChange={(e) => setRequestType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="Medicine Request">
                          Medicine Request
                        </option>
                        <option value="Equipment Request">
                          Equipment Request
                        </option>
                        <option value="Supply Request">Supply Request</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Urgency *
                      </label>
                      <select
                        value={urgency}
                        onChange={(e) => setUrgency(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Patient Count
                      </label>
                      <input
                        type="number"
                        value={patientCount}
                        onChange={(e) => setPatientCount(e.target.value)}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Reason *
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
}
