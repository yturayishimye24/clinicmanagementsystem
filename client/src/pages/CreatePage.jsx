import React, { useState, useEffect } from "react";
import { OrbitProgress } from "react-loading-indicators";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Activity,
  Calendar,
  Bell,
  LogOut,
  Plus,
  Search,
  X,
  CheckCircle,
  XCircle,
  Clock,
  Pill,
  Home,
  Trash2,
  Edit,
  Save,
  TrendingUp,
  Ambulance,
  Send,
  Package,
  Filter,
  Download,
  Menu,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function NurseDashboard() {
  const navigate = useNavigate();
  const [isHospitalized, setIsHospitalized] = useState([]);
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
  const [activeTab, setActiveTab] = useState("dashboard");
  const [formError, setFormError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Medicine request states
  const [requestType, setRequestType] = useState("Medicine Request");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [urgency, setUrgency] = useState("Medium");
  const [reason, setReason] = useState("");
  const [patientCount, setPatientCount] = useState(0);

  const [myRequests, setMyRequests] = useState([
    {
      id: 1,
      type: "Medicine Request",
      item: "Paracetamol 500mg",
      quantity: "50 units",
      urgency: "High",
      date: "2024-01-15",
      time: "10:30 AM",
      status: "pending",
      reason: "Running low on stock",
      patientCount: 5,
    },
    {
      id: 2,
      type: "Equipment Request",
      item: "Thermometer",
      quantity: "3 units",
      urgency: "Medium",
      date: "2024-01-14",
      time: "02:15 PM",
      status: "approved",
      reason: "Current ones malfunctioning",
      patientCount: 0,
      approvedDate: "2024-01-14",
    },
  ]);

  
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
  }, [navigate]);

  const handleHospitalize = (id) => {
    setIsHospitalized((prev) => {
      if (prev.includes(id)) {
        toast.info("Patient discharged from hospital");
        return prev.filter((patientId) => patientId !== id);
      }
      toast.success("Patient marked as hospitalized");
      return [...prev, id];
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    toast.success("Logged out successfully!");
    setTimeout(() => {
      navigate("/");
    }, 800);
  };

  const handleDelete = async (patientId) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) {
      return;
    }
    try {
      setLoading(true);
      await axios.delete(`http://localhost:4000/api/users/${patientId}`);
      setPatients((prev) =>
        prev.filter((patient) => patient._id !== patientId)
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
    setFirstName(patient.firstName);
    setLastName(patient.lastName);
    setGender(patient.gender);
    setDate(patient.date);
    setMaritalStatus(patient.maritalStatus);
    setDisease(patient.disease);
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

  const resetRequestForm = () => {
    setRequestType("Medicine Request");
    setItemName("");
    setQuantity("");
    setUrgency("Medium");
    setReason("");
    setPatientCount(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);

    try {
      if (editingPatientId) {
        const response = await axios.put(
          `http://localhost:4000/api/users/${editingPatientId}`,
          {
            firstName,
            lastName,
            date,
            disease,
            maritalStatus,
            gender,
          }
        );
        setPatients((prev) =>
          prev.map((patient) =>
            patient._id === editingPatientId ? response.data : patient
          )
        );
        toast.success("Patient updated successfully!");
      } else {
        const response = await axios.post(
          "http://localhost:4000/api/users/create",
          {
            firstName,
            lastName,
            date,
            disease,
            maritalStatus,
            gender,
          }
        );
        setPatients((prev) => [...prev, response.data]);
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

  const handleRequestSubmit = (e) => {
    e.preventDefault();

    if (!itemName || !quantity || !reason) {
      toast.error("Please fill all required fields!");
      return;
    }

    const newRequest = {
      id: myRequests.length + 1,
      type: requestType,
      item: itemName,
      quantity: quantity,
      urgency: urgency,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "pending",
      reason: reason,
      patientCount: patientCount,
    };

    setMyRequests([newRequest, ...myRequests]);
    toast.success("Request submitted successfully!");
    setShowRequestForm(false);
    resetRequestForm();
  };

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4000/api/users");
      setPatients(response.data);
    } catch (error) {
      toast.error("Failed to fetch patients. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((patient) =>
    `${patient.firstName} ${patient.lastName} ${patient.disease}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPatients = patients.length;
  const malePatients = patients.filter((p) => p.gender === "Male").length;
  const femalePatients = patients.filter((p) => p.gender === "Female").length;
  const pendingRequests = myRequests.filter(
    (r) => r.status === "pending"
  ).length;
  const approvedRequests = myRequests.filter(
    (r) => r.status === "approved"
  ).length;
  const hospitalizedCount = isHospitalized.length;

  const genderData = [
    { name: "Male", value: malePatients, color: "#000000" },
    { name: "Female", value: femalePatients, color: "#4b5563" },
    {
      name: "Other",
      value: patients.filter((p) => p.gender === "Other").length,
      color: "#9ca3af",
    },
  ];

  const stats = [
    {
      icon: Users,
      label: "Total Patients",
      value: totalPatients,
      change: "+12%",
      color: "bg-black",
    },
    {
      icon: Ambulance,
      label: "Hospitalized",
      value: hospitalizedCount,
      change: "Active",
      color: "bg-red-600",
    },
    {
      icon: CheckCircle,
      label: "Approved Requests",
      value: approvedRequests,
      change: "This week",
      color: "bg-green-600",
    },
    {
      icon: Clock,
      label: "Pending Requests",
      value: pendingRequests,
      change: "Awaiting",
      color: "bg-amber-600",
    },
  ];

  const diseaseData = patients
    .reduce((acc, patient) => {
      const disease = patient.disease || "Unknown";
      const existing = acc.find((d) => d.name === disease);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ name: disease, count: 1 });
      }
      return acc;
    }, [])
    .slice(0, 5);

  const weeklyData = [
    { day: "Mon", patients: 12 },
    { day: "Tue", patients: 19 },
    { day: "Wed", patients: 15 },
    { day: "Thu", patients: 25 },
    { day: "Fri", patients: 22 },
    { day: "Sat", patients: 18 },
    { day: "Sun", patients: 20 },
  ];

  if (loading && patients.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <OrbitProgress color="#000" size="medium" text="" textColor="" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                <Activity className="text-white" size={20} />
              </div>
              <div>
                <h2 className="font-bold text-lg">Clinic</h2>
                <p className="text-xs text-gray-500">Nurse Panel</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: "dashboard", label: "Dashboard", icon: Home },
            {
              id: "patients",
              label: "Patients",
              icon: Users,
              badge: totalPatients,
            },
            {
              id: "requests",
              label: "My Requests",
              icon: Package,
              badge: pendingRequests,
            },
            { id: "medicines", label: "Medicines", icon: Pill },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  activeTab === item.id
                    ? "bg-black text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left font-medium">
                      {item.label}
                    </span>
                    {item.badge > 0 && (
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          activeTab === item.id
                            ? "bg-white text-black"
                            : "bg-black text-white"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

    
      <main className="flex-1 overflow-y-auto">
       
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Welcome back,{" "}
                <span className="font-semibold text-black">
                  {localStorage.getItem("name") || "Nurse"}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2.5 hover:bg-gray-100 rounded-xl transition">
                <Bell size={20} />
                {pendingRequests > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {pendingRequests}
                  </span>
                )}
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold">
                  {(localStorage.getItem("name") || "N")
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm">
                    {localStorage.getItem("name") || "Nurse"}
                  </p>
                  <p className="text-xs text-white bg-teal-500 px-2 py-0.5 rounded-full inline-block font-medium">
                    {localStorage.getItem("role") || "nurse"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
            
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`${stat.color} p-3 rounded-xl shadow-lg`}
                        >
                          <Icon className="text-white" size={24} />
                        </div>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                          <TrendingUp size={12} className="inline mr-1" />
                          {stat.change}
                        </span>
                      </div>
                      <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                      <p className="text-sm text-gray-600 font-medium">
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <div className="w-1 h-6 bg-black rounded-full"></div>
                    Weekly Patient Overview
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="day" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="patients"
                        stroke="#000"
                        strokeWidth={3}
                        dot={{ fill: "#000", r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <div className="w-1 h-6 bg-black rounded-full"></div>
                    Gender Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={genderData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {genderData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Diseases */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <div className="w-1 h-6 bg-black rounded-full"></div>
                  Top 5 Diseases
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={diseaseData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#000" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === "patients" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Search patients by name or disease..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center gap-2">
                      <Filter size={18} />
                      <span className="font-medium">Filter</span>
                    </button>
                    <button
                      onClick={() => {
                        resetForm();
                        setShowForm(true);
                      }}
                      className="px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition flex items-center gap-2 font-medium"
                    >
                      <Plus size={18} />
                      Add Patient
                    </button>
                  </div>
                </div>

                {filteredPatients.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                            Name
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                            Gender
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                            Date of Birth
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                            Disease
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredPatients.map((patient) => (
                          <tr
                            key={patient._id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold text-sm">
                                  {patient.firstName.charAt(0)}
                                  {patient.lastName.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-semibold">
                                    {patient.firstName} {patient.lastName}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
                                {patient.gender}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {new Date(patient.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-black text-white rounded-full text-xs font-semibold">
                                {patient.disease}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2 justify-center">
                                <button
                                  onClick={() => handleEdit(patient)}
                                  className="px-4 py-2 bg-black text-white rounded-xl text-xs flex items-center gap-2 hover:bg-gray-800 transition font-semibold"
                                >
                                  <Edit size={14} />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(patient._id)}
                                  disabled={loading}
                                  className="px-4 py-2 bg-white text-red-600 border-2 border-red-300 rounded-xl text-xs flex items-center gap-2 hover:bg-red-600 hover:text-white hover:border-red-600 transition font-semibold"
                                >
                                  <Trash2 size={14} />
                                  Delete
                                </button>
                                <button
                                  onClick={() => handleHospitalize(patient._id)}
                                  className={`px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition font-semibold ${
                                    isHospitalized.includes(patient._id)
                                      ? "bg-amber-100 text-amber-700 border-2 border-amber-300"
                                      : "bg-red-100 text-red-700 border-2 border-red-300 hover:bg-red-600 hover:text-white"
                                  }`}
                                >
                                  <Ambulance size={14} />
                                  {isHospitalized.includes(patient._id)
                                    ? "Hospitalized"
                                    : "Hospitalize"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-16 text-center">
                    <Users size={64} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      No patients found
                    </p>
                    <p className="text-sm text-gray-600">
                      Try adjusting your search or add a new patient
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "requests" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold">My Requests</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Track your medicine and equipment requests
                    </p>
                  </div>
                  <button
                    onClick={() => setShowRequestForm(true)}
                    className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition flex items-center gap-2 font-semibold"
                  >
                    <Send size={18} />
                    New Request
                  </button>
                </div>

                <div className="space-y-4">
                  {myRequests.map((request) => (
                    <div
                      key={request.id}
                      className="border-2 border-gray-200 rounded-2xl p-6 hover:border-gray-300 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <h4 className="text-lg font-bold">
                              {request.item}
                            </h4>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                request.urgency === "High"
                                  ? "bg-red-100 text-red-700 border-2 border-red-200"
                                  : "bg-amber-100 text-amber-700 border-2 border-amber-200"
                              }`}
                            >
                              {request.urgency} Priority
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                request.status === "pending"
                                  ? "bg-gray-100 text-gray-700"
                                  : request.status === "approved"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {request.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 mb-1 text-xs font-medium">
                                Type
                              </p>
                              <p className="font-semibold">{request.type}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 mb-1 text-xs font-medium">
                                Quantity
                              </p>
                              <p className="font-semibold">
                                {request.quantity}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 mb-1 text-xs font-medium">
                                Date
                              </p>
                              <p className="font-semibold">{request.date}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 mb-1 text-xs font-medium">
                                Time
                              </p>
                              <p className="font-semibold">{request.time}</p>
                            </div>
                          </div>
                          {request.reason && (
                            <div className="bg-gray-50 p-3 rounded-xl mt-4">
                              <p className="text-xs font-medium text-gray-500 mb-1">
                                Reason:
                              </p>
                              <p className="text-sm text-gray-700">
                                {request.reason}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          {request.status === "approved" && (
                            <div className="text-right">
                              <div className="flex items-center gap-2 text-green-700 font-semibold mb-1">
                                <CheckCircle size={20} />
                                <span>Approved</span>
                              </div>
                              {request.approvedDate && (
                                <p className="text-xs text-gray-500">
                                  on {request.approvedDate}
                                </p>
                              )}
                            </div>
                          )}
                          {request.status === "rejected" && (
                            <div className="text-right">
                              <div className="flex items-center gap-2 text-red-700 font-semibold">
                                <XCircle size={20} />
                                <span>Rejected</span>
                              </div>
                            </div>
                          )}
                          {request.status === "pending" && (
                            <div className="flex items-center gap-2 text-amber-700 font-semibold">
                              <Clock size={20} />
                              <span>Pending</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "medicines" && (
            <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center shadow-sm">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Pill size={40} className="text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Medicine Inventory</h3>
                <p className="text-gray-600 mb-6">
                  View and manage available medicines and equipment in the
                  clinic.
                </p>
                <button className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition font-semibold">
                  View Inventory
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

     
      {showForm && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowForm(false);
            resetForm();
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-auto border border-gray-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingPatientId ? "Edit Patient Details" : "Add New Patient"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-200 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6">
                {formError && (
                  <div className="px-4 py-3 bg-red-50 text-red-700 rounded-xl mb-6 text-sm flex items-center gap-3 border border-red-200">
                    <XCircle size={20} />
                    <span>{formError}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-semibold">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none transition-all bg-white text-gray-900 focus:border-black"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-semibold">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none transition-all bg-white text-gray-900 focus:border-black"
                      placeholder="Enter last name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-semibold">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      required
                      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none transition-all bg-white text-gray-900 focus:border-black cursor-pointer"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-semibold">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none transition-all bg-white text-gray-900 focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-semibold">
                      Marital Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={maritalStatus}
                      onChange={(e) => setMaritalStatus(e.target.value)}
                      required
                      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none transition-all bg-white text-gray-900 focus:border-black cursor-pointer"
                    >
                      <option value="">Select Status</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-semibold">
                      Disease / Condition{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={disease}
                      onChange={(e) => setDisease(e.target.value)}
                      required
                      placeholder="Enter primary diagnosis"
                      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none transition-all bg-white text-gray-900 focus:border-black"
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  disabled={loading}
                  className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl transition-all hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-black rounded-xl transition-all hover:bg-gray-800 flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {editingPatientId ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>
                      {editingPatientId ? (
                        <Save size={16} />
                      ) : (
                        <Plus size={16} />
                      )}
                      {editingPatientId ? "Save Changes" : "Add Patient"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

     
      {showRequestForm && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowRequestForm(false);
            resetRequestForm();
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-900">New Request</h2>
              <button
                onClick={() => {
                  setShowRequestForm(false);
                  resetRequestForm();
                }}
                className="p-2 hover:bg-gray-200 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleRequestSubmit}>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-semibold">
                      Request Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={requestType}
                      onChange={(e) => setRequestType(e.target.value)}
                      required
                      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none transition-all bg-white text-gray-900 focus:border-black cursor-pointer"
                    >
                      <option value="Medicine Request">Medicine Request</option>
                      <option value="Equipment Request">
                        Equipment Request
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-semibold">
                      Urgency <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value)}
                      required
                      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none transition-all bg-white text-gray-900 focus:border-black cursor-pointer"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-semibold">
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required
                    placeholder="e.g., Paracetamol 500mg"
                    className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none transition-all bg-white text-gray-900 focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-semibold">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      required
                      placeholder="e.g., 50 units"
                      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none transition-all bg-white text-gray-900 focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-semibold">
                      Number of Patients (Optional)
                    </label>
                    <input
                      type="number"
                      value={patientCount}
                      onChange={(e) =>
                        setPatientCount(parseInt(e.target.value) || 0)
                      }
                      min="0"
                      placeholder="0"
                      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none transition-all bg-white text-gray-900 focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-semibold">
                    Reason for Request <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    rows="4"
                    placeholder="Explain why you need this item..."
                    className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none transition-all bg-white text-gray-900 focus:border-black resize-none"
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
                <button
                  type="button"
                  onClick={() => {
                    setShowRequestForm(false);
                    resetRequestForm();
                  }}
                  className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl transition-all hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-black rounded-xl transition-all hover:bg-gray-800 flex items-center gap-2"
                >
                  <Send size={16} />
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" theme="light" />
    </div>
  );
}

export default NurseDashboard;
