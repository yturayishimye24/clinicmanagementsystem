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
} from "recharts";
import { toast, ToastContainer } from "react-toastify";

function CreatePage() {
  const navigate = useNavigate();
  const [isHosipitalized, setIsHospitalized] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [patient, setPatient] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [gender, setGender] = useState("");
  const [lastName, setLastName] = useState("");
  const [date, setDate] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [disease, setDisease] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [formError, setFormError] = useState("");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "medicine_request",
      nurse: "Sarah Johnson",
      patient: "John Doe",
      medicine: "Amoxicillin 500mg",
      quantity: "30 tablets",
      status: "pending",
      time: "5 mins ago",
    },
    {
      id: 2,
      type: "medicine_request",
      nurse: "Emily Davis",
      patient: "Jane Smith",
      medicine: "Ibuprofen 200mg",
      quantity: "20 tablets",
      status: "pending",
      time: "15 mins ago",
    },
  ]);
  
  const handleHospitalize = (id) => {
    setIsHospitalized((prev) => {
      if (prev.includes(id)) {
        return prev.filter((patientId) => patientId !== id);
      }
      return [...prev, id];
    });
  };
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
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
      toast.success("Deleted Successfully!");
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast.error("Failed to delete patient, Try later!");
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
    setSaving(false);
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
    } finally {
      setLoading(false);
    }
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
  
  const Option = () => {
    if (isVisible == false) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  
  const totalPatients = patients.length;
  const malePatients = patients.filter((p) => p.gender === "Male").length;
  const femalePatients = patients.filter((p) => p.gender === "Female").length;
  const pendingRequests = notifications.filter(
    (n) => n.status === "pending"
  ).length;

  const genderData = [
    { name: "Male", value: malePatients, color: "#1f2937" },
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
    },
    {
      icon: Calendar,
      label: "Female Patients",
      value: femalePatients,
    },
    {
      icon: CheckCircle,
      label: "Approved Requests",
      value: notifications.length - pendingRequests,
    },
    {
      icon: Clock,
      label: "Pending Requests",
      value: pendingRequests,
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

  if (loading && patients.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <OrbitProgress color="#000" size="medium" text="" textColor="" />
      </div>
    );
  }

  return (
    <div className="font-sans bg-gray-50 min-h-screen flex flex-col">
      <div className="w-20 bg-white flex flex-col items-center py-6 fixed h-screen z-50 border-r border-gray-200">
        <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mb-10 cursor-pointer transition-all duration-300">
          <Activity color="white" size={24} />
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 ${
              activeTab === "dashboard"
                ? "bg-black"
                : "bg-white hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <Home
              color={activeTab === "dashboard" ? "white" : "#000"}
              size={22}
            />
          </button>
          <button
            onClick={() => setActiveTab("patients")}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 ${
              activeTab === "patients"
                ? "bg-black"
                : "bg-white hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <Users
              color={activeTab === "patients" ? "white" : "#000"}
              size={22}
            />
          </button>
          <button
            onClick={() => setActiveTab("medicines")}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 ${
              activeTab === "medicines"
                ? "bg-black"
                : "bg-white hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <Pill
              color={activeTab === "medicines" ? "white" : "#000"}
              size={22}
            />
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="w-14 h-14 bg-white border border-red-200 rounded-2xl flex items-center justify-center cursor-pointer transition-all hover:bg-red-50"
        >
          <LogOut color="#ef4444" size={22} />
        </button>
      </div>

      <div className="ml-20 flex-1">
        <div className="bg-white text-gray-900 border-b border-gray-200 flex items-center justify-center w-full py-5 px-6">
          <div className="flex items-center gap-3">
            <Activity size={24} className="text-black" />
            <p className="text-base font-medium">
              Welcome to your Nurse Dashboard - Manage patients, track records,
              and request medicines efficiently
            </p>
          </div>
        </div>

        <header className="bg-white border-b border-gray-200 px-8 py-1 flex items-center justify-between sticky top-0 z-40">
          <div>
            <h1 className="text-2xl font-arial text-gray-900">
              CMS
            </h1>
            <p className="mt-1 text-sm text-gray-600 flex">
              Welcome back,{" "}
              <span className="font-semibold text-black">
                {localStorage.getItem("name") || "Guest"}
              </span>
              <span className="bg-teal-500 ml-2 flex items-center justify-center text-white font-arial rounded-full px-6">{localStorage.getItem("role")}</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer relative transition-all duration-300 ${
                  pendingRequests > 0
                    ? "bg-gray-300 border-2 border-gray-600"
                    : "bg-white border border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Bell
                  color={pendingRequests > 0 ? "#ef4444" : "#000"}
                  size={20}
                />
                {pendingRequests > 0 && (
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
                    {pendingRequests}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute top-14 right-0 w-96 max-h-96 bg-white rounded-2xl border border-gray-200 overflow-auto z-50">
                  <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Medicine Requests
                    </h3>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="bg-white rounded-xl cursor-pointer p-2 hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      <X size={18} color="#000" />
                    </button>
                  </div>
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                            notif.status === "pending"
                              ? "bg-amber-50 border-amber-200"
                              : notif.status === "approved"
                              ? "bg-green-50 border-green-200"
                              : "bg-red-50 border-red-200"
                          }`}
                        >
                          {notif.status === "pending" ? (
                            <Clock color="#f59e0b" size={18} />
                          ) : notif.status === "approved" ? (
                            <CheckCircle color="#10b981" size={18} />
                          ) : (
                            <XCircle color="#ef4444" size={18} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {notif.nurse} requests {notif.medicine}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Patient: {notif.patient} • Qty: {notif.quantity}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notif.time}
                          </p>
                          {notif.status === "pending" && (
                            <div className="flex gap-2 mt-3">
                              <button className="flex-1 px-3 py-2 bg-green-600 text-white border-none rounded-xl text-xs cursor-pointer font-medium hover:bg-green-700 transition-all">
                                Approve
                              </button>
                              <button className="flex-1 px-3 py-2 bg-red-600 text-white border-none rounded-xl text-xs cursor-pointer font-medium hover:bg-red-700 transition-all">
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div
              className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-white text-lg font-bold cursor-pointer transition-all hover:bg-gray-800"
              onClick={Option}
            >
              {(localStorage.getItem("name") || "G").slice(0,1).toUpperCase()}
            </div>
            <div>
              <button
                className="bg-black text-sm text-white font-arial px-2 py-1 rounded-md
         border-2 border-transparent
         hover:border-gray-400 hover:bg-white hover:text-black
         transition-all md:text-xl"
              >
                Make Report
              </button>
            </div>
            {isVisible && (
              <div className="w-50 rounded-md top-25 h-20 text-black flex flex-col items-center justify-center absolute bg-gray-300 border border-gray-400">
                <button className="border-l-2 rounded-md border-l-green-400 w-full">
                  Logout
                </button>
                <p>Profile</p>
              </div>
            )}
          </div>
        </header>

        <div className="p-8">
          {activeTab === "dashboard" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white flex gap-3 rounded-2xl p-2 border border-gray-200 hover:border-gray-300 transition-all duration-300"
                    >
                      
                      <div className="w-14 overflow-hidden h-[100%] bg-black flex items-center justify-center mb-4">
                        <Icon className="text-white" size={28} />
                      </div>
                      <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                        <TrendingUp size={14} />
                        <span>Active</span>
                      </div>
                      </div>
                    </div>

                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
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
                <div className="bg-white p-6 rounded-2xl border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
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
            </>
          )}

          {activeTab === "patients" && (
            <>
              <div className="bg-white rounded-2xl px-6 py-4 mb-6 flex flex-col md:flex-row gap-4 md:justify-between md:items-center border border-gray-200">
                <div className="relative flex-1 max-w-2xl">
                  <Search
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                    size={20}
                    color="#9ca3af"
                  />
                  <input
                    type="text"
                    placeholder="Search patients by name or disease..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 text-sm border-2 border-gray-200 rounded-2xl outline-none text-gray-900 placeholder-gray-400 focus:border-gray-900 transition-colors"
                  />
                </div>
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                  className="bg-black text-white px-6 py-3 text-sm font-semibold rounded-2xl cursor-pointer flex items-center justify-center gap-2 hover:bg-gray-800 transition-all"
                >
                  <Plus size={18} />
                  Add New Patient
                </button>
              </div>

              {filteredPatients.length > 0 ? (
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b-2 border-gray-200">
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            First Name
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Last Name
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Gender
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Date of Birth
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Disease
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
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
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              {patient.firstName}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              {patient.lastName}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                                {patient.gender}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              {new Date(patient.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-900 text-white">
                                {patient.disease}
                              </span>
                            </td>
                            <td className="px-6 py-4 flex gap-2 justify-center">
                              <button
                                onClick={() => handleDelete(patient._id)}
                                disabled={loading}
                                className="px-4 py-2 bg-white text-red-600 border-2 border-red-300 rounded-xl text-xs cursor-pointer flex items-center gap-2 transition-all hover:bg-red-600 hover:text-white hover:border-red-600 font-semibold"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                              <button
                                onClick={() => handleEdit(patient)}
                                className="px-4 py-2 bg-black text-white border-none rounded-xl text-xs cursor-pointer flex items-center gap-2 transition-all hover:bg-gray-800 font-semibold"
                              >
                                <Edit size={14} />
                                Update
                              </button>
                              <button
                                className="px-4 py-2 bg-red-200 hover:text-white font-arial text-black border-none rounded-xl text-xs cursor-pointer flex items-center gap-2 transition-all hover:bg-red-800 font-semibold"
                                onClick={()=>handleHospitalize(patient._id)}
                              >
                                <Ambulance size={14} />
                                {isHosipitalized.includes(patient._id) ? (
                                  <div className="inline-block px-3 py-1 rounded-full bg-amber-200 text-amber-900 text-sm font-semibold">
                                    Hospitalized
                                  </div>
                                ) : (
                                  <p>Hosipitalize</p>
                                )}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-white py-16 px-6 text-center rounded-2xl border-2 border-dashed border-gray-300">
                  <Users size={64} color="#9ca3af" className="mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    No patients found
                  </p>
                  <p className="text-sm text-gray-600">
                    Try adjusting your search or add a new patient
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 bg-black/60  backdrop-blur-sm flex items-center justify-center z-50 p-5"
          onClick={() => {
            setShowForm(false);
            resetForm();
          }}
        >
          <div
            className="bg-white rounded-md max-w-3xl w-full max-h-[90vh] overflow-auto border border-gray-300"
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
                className="bg-white border border-gray-200 cursor-pointer p-2 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <X size={24} color="#000" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6">
                {formError && (
                  <div className="px-4 py-3 bg-red-50 text-red-700 rounded-2xl mb-6 text-sm flex items-center gap-3 border border-red-200">
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
                      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-2xl outline-none transition-all bg-white text-gray-900 focus:border-gray-900"
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
                      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-2xl outline-none transition-all bg-white text-gray-900 focus:border-gray-900"
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
                      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-2xl outline-none transition-all bg-white text-gray-900 focus:border-gray-900 cursor-pointer"
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
                      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-2xl outline-none transition-all bg-white text-gray-900 focus:border-gray-900"
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
                      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-2xl outline-none transition-all bg-white text-gray-900 focus:border-gray-900 cursor-pointer"
                    >
                      <option value="">Select Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>
                </div>
                <div className="mt-5">
                  <label className="block text-sm text-gray-700 mb-2 font-semibold">
                    Disease / Condition <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={disease}
                    onChange={(e) => setDisease(e.target.value)}
                    required
                    placeholder="Enter primary diagnosis or condition"
                    className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-2xl outline-none transition-all bg-white text-gray-900 focus:border-gray-900"
                  />
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
                  className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-2xl cursor-pointer transition-all hover:bg-gray-50 hover:border-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-black border-none rounded-2xl cursor-pointer transition-all hover:bg-gray-800 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
      <ToastContainer position="bottom-right" theme="light" />
    </div>
  );
}

export default CreatePage;