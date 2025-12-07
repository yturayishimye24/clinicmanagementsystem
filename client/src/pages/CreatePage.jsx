import React, { useState, useEffect } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { ThreeDot } from "react-loading-indicators";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  PlusCircle,
  FileText,
  TrendingUp,
  Activity,
  LayoutDashboard,
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
  ChevronRight,
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
} from "lucide-react";
import techImage from "../../images/techImage.png";
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

const menuItem = (href, Icon, label) => (
  <a
    href={href}
    className="flex items-center gap-3 h-12 px-4 rounded-full bg-gray-300 hover:bg-gray-400 transition-all"
  >
    <Icon className="w-5 h-5" />
    <span className="text-sm font-medium">{label}</span>
  </a>
);

const Section = ({ title, isOpen, onToggle, children, Icon }) => (
  <div>
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full text-left px-2 py-2 rounded-md hover:bg-gray-200 transition"
    >
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="w-4 h-4" />
        {title}
      </div>
      {isOpen ? (
        <ChevronDown className="w-4 h-4" />
      ) : (
        <ChevronRight className="w-4 h-4" />
      )}
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ${
        isOpen ? "max-h-96 mt-2" : "max-h-0"
      }`}
    >
      <nav className="space-y-2 pl-4">{children}</nav>
    </div>
  </div>
);

const Toast = ({ message, onClose }) => (
  <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
    <div className="flex items-center gap-3 bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[320px]">
      <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full flex-shrink-0">
        <CheckCircle2 className="w-5 h-5 text-green-600" />
      </div>
      <p className="text-sm font-medium text-gray-900 flex-1">{message}</p>
      <button
        onClick={onClose}
        className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  </div>
);

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
  const [openSection, setOpenSection] = useState(null);
  const [formError, setFormError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [logging, setLogging] = useState(false);

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

  const toggle = (section) =>
    setOpenSection(openSection === section ? null : section);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

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
    setLogging(true);
    setShowToast(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      localStorage.removeItem("role");
      navigate("/");
    }, 2000);
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
      color: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Ambulance,
      label: "Hospitalized",
      value: hospitalizedCount,
      change: "Active",
      color: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      icon: CheckCircle2,
      label: "Approved Requests",
      value: approvedRequests,
      change: "This week",
      color: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: Clock,
      label: "Pending Requests",
      value: pendingRequests,
      change: "Awaiting",
      color: "bg-amber-100",
      iconColor: "text-amber-600",
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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {showToast && (
          <Toast
            message="Logged out successfully!"
            onClose={() => setShowToast(false)}
          />
        )}
        <Sidebar className="fixed">
          <SidebarContent className="sidebar-scroll overflow-y-auto max-h-screen px-4 py-4 space-y-1">
            <Section
              title="Main"
              Icon={LayoutDashboard}
              isOpen={openSection === "main"}
              onToggle={() => toggle("main")}
            >
              {menuItem("/home/dashboard", LayoutDashboard, "Dashboard")}
            </Section>

            <Section
              title="Management"
              Icon={UserCircle}
              isOpen={openSection === "management"}
              onToggle={() => toggle("management")}
            >
              {menuItem("/home/patients", UserCircle, "Patients")}
              {menuItem("/home/scheduling", CalendarDays, "Scheduling")}
              {menuItem("/home/medicines", Pill, "Medicines")}
              {menuItem("/home/attendance", Clock, "Attendance")}
            </Section>

            <Section
              title="Operations"
              Icon={ListChecks}
              isOpen={openSection === "operations"}
              onToggle={() => toggle("operations")}
            >
              {menuItem("/home/requests", Package, "Requests")}
              {menuItem("/home/tasks", ListChecks, "Tasks")}
              {menuItem("/home/compliance", BadgeCheck, "Compliance")}
              {menuItem("/home/communication", MessageSquare, "Communication")}
            </Section>

            <Section
              title="System"
              Icon={Settings}
              isOpen={openSection === "system"}
              onToggle={() => toggle("system")}
            >
              {menuItem("/home/reports", BarChart3, "Reports")}
              {menuItem("/home/settings", Settings, "Settings")}
            </Section>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 h-12 px-4 rounded-full bg-red-500 hover:bg-red-600 text-white font-medium transition-all"
              >
                {logging ? (
                  <ThreeDot
                    color="#32cd32"
                    size={"10"}
                    text=""
                    textColor="white"
                  />
                ) : (
                  <h1>Logout</h1>
                )}
              </button>
            </div>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 fixed w-full bg-transparent z-999 backdrop-blur-md">
            <SidebarTrigger />
            <div className="flex items-center justify-between w-full">
              <h1 className="text-xl font-semibold">Nurse Panel</h1>
              <div className="flex items-center gap-4">
                <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
                  <Bell className="w-5 h-5 text-gray-600" />
                  {pendingRequests > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {pendingRequests}
                    </span>
                  )}
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {(localStorage.getItem("name") || "N")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {localStorage.getItem("name") || "Nurse"}
                    </p>
                    <p className="text-xs text-gray-500">Nurse</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="p-6 grid lg:grid-cols-[2fr_1fr] gap-6 mt-20 bg-gray-50 md:grid-cols-1 sm:grid-cols-1">
            <div>
              <h1 className="font-arial text-3xl font-bold mb-9 md:text-center sm:text-center">
                Welcome {localStorage.getItem("name") || "Nurse"}
              </h1>
              <div className="flex items-center justify-center bg-white rounded-md max-w-[900px] shadow-md p-9 gap-6">
                <div>
                  <h1 className="font-bold font-arial">Patient Management Hub</h1>
                  <p className="text-gray-500 font-sans">
                    Manage patient records, track medical history,
                    <br /> and monitor treatment progress in real-time.
                    <br /> Access critical information with just a few clicks.
                  </p>
                  <button 
                    onClick={() => {
                      resetForm();
                      setShowForm(true);
                    }}
                    className="text-white bg-green-600 rounded-full btn btn-accent mt-4 px-6 py-2"
                  >
                    Add New Patient
                  </button>
                </div>
                <div
                  style={{ backgroundImage: `url(${techImage})` }}
                  className="bg-cover bg-center w-full h-64 rounded-lg"
                ></div>
              </div>

              <div className="mt-6 grid grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="bg-white shadow-md rounded-md p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                        </div>
                        <span className="text-sm font-semibold text-green-600">
                          {stat.change}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Charts Section */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-white rounded-md shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Weekly Patient Overview</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="day" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="patients"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: "#3b82f6", r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-md shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Gender Distribution</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={genderData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
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

              <div className="bg-white rounded-md shadow-md mt-20 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-xl font-bold">Current Patients</h1>
                  <input
                    type="search"
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div className="max-h-96 overflow-auto border border-gray-200 overflow-y-scroll">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gender
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Disease
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPatients.map((patient) => (
                        <tr key={patient._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold">
                                {patient.firstName?.charAt(0)}{patient.lastName?.charAt(0)}
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {patient.firstName} {patient.lastName}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {patient.gender}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {patient.disease || "Not specified"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              isHospitalized.includes(patient._id)
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}>
                              {isHospitalized.includes(patient._id) ? "Hospitalized" : "Active"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(patient)}
                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1 text-xs"
                              >
                                <Edit className="w-3 h-3" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(patient._id)}
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1 text-xs"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </button>
                              <button
                                onClick={() => handleHospitalize(patient._id)}
                                className={`px-3 py-1 rounded flex items-center gap-1 text-xs ${
                                  isHospitalized.includes(patient._id)
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-green-100 text-green-700 hover:bg-green-200"
                                }`}
                              >
                                <Ambulance className="w-3 h-3" />
                                {isHospitalized.includes(patient._id)
                                  ? "Discharge"
                                  : "Hospitalize"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-4">
                <div 
                  onClick={() => setShowRequestForm(true)}
                  className="bg-white text-gray-700 shadow-lg h-auto p-2 rounded-3xl flex items-center gap-4 hover:shadow-xl transition-shadow cursor-pointer"
                >
                  <div className="h-20 w-12 bg-green-200 rounded-l-3xl flex items-center justify-center">
                    <Send className="w-6 h-6 text-green-700" />
                  </div>
                  <h3 className="ml-4 font-semibold text-lg">New Request</h3>
                </div>

                <div 
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                  className="bg-white text-gray-700 shadow-lg h-auto p-2 rounded-3xl flex items-center gap-4 hover:shadow-xl transition-shadow cursor-pointer"
                >
                  <div className="h-20 w-12 bg-blue-200 rounded-l-3xl flex items-center justify-center">
                    <PlusCircle className="w-6 h-6 text-blue-700" />
                  </div>
                  <h3 className="ml-4 font-semibold text-lg">Add Patient</h3>
                </div>

                <div className="bg-white text-gray-700 shadow-lg h-auto p-2 rounded-3xl flex items-center gap-4 hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="h-20 w-12 bg-purple-200 rounded-l-3xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-purple-700" />
                  </div>
                  <h3 className="ml-4 font-semibold text-lg">View Reports</h3>
                </div>

                <div className="bg-white text-gray-700 shadow-lg h-auto p-2 rounded-3xl flex items-center gap-4 hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="h-20 w-12 bg-orange-200 rounded-l-3xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-700" />
                  </div>
                  <h3 className="ml-4 font-semibold text-lg">
                    Performance Analytics
                  </h3>
                </div>
              </div>

              {/* Recent Requests */}
              <div className="bg-white rounded-md shadow-md p-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">Recent Requests</h3>
                <div className="space-y-3">
                  {myRequests.slice(0, 4).map((request) => (
                    <div key={request.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{request.item}</p>
                          <p className="text-xs text-gray-500">{request.type}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          request.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : request.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {request.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{request.reason.substring(0, 50)}...</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>

      {/* Patient Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {editingPatientId ? "Edit Patient" : "Add Patient"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              {formError && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
                  {formError}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Gender *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Marital Status *
                  </label>
                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Disease *
                  </label>
                  <input
                    type="text"
                    value={disease}
                    onChange={(e) => setDisease(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400"
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
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {editingPatientId ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>
                      {editingPatientId ? (
                        <Save className="w-4 h-4" />
                      ) : (
                        <PlusCircle className="w-4 h-4" />
                      )}
                      {editingPatientId ? "Update" : "Add Patient"}
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">New Request</h2>
              <button
                onClick={() => {
                  setShowRequestForm(false);
                  resetRequestForm();
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRequestSubmit} className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Request Type *
                    </label>
                    <select
                      value={requestType}
                      onChange={(e) => setRequestType(e.target.value)}
                      className="w-full px-3 py-2 border rounded"
                    >
                      <option value="Medicine Request">Medicine Request</option>
                      <option value="Equipment Request">Equipment Request</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Urgency *
                    </label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value)}
                      className="w-full px-3 py-2 border rounded"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Quantity *
                    </label>
                    <input
                      type="text"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      required
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Patient Count
                    </label>
                    <input
                      type="number"
                      value={patientCount}
                      onChange={(e) => setPatientCount(e.target.value)}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Reason *
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    rows="3"
                    className="w-full px-3 py-2 border rounded"
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
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" theme="light" />
    </SidebarProvider>
  );
}

export default NurseDashboard;