import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Badge } from "flowbite-react";
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
    ArrowUpRight
} from "lucide-react";

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

      /* Custom Sidebar Item Hover */
      .sidebar-item:hover .icon-container {
        background-color: #ecfdf5;
        color: #059669;
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
    const [reports,setReports] = useState(false);
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

    // --- FETCHING DATA ---
    const fetchPatients = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`${backendUrl}/api/patients/displayPatients`, {
                headers: { Authorization: `Bearer ${token}` },
            });
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
            const response = await axios.get(`${backendUrl}/api/requests/showRequests`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const d = response.data;
            setMyRequests(Array.isArray(d) ? d : (Array.isArray(d.requests) ? d.requests : []));
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
        setTimeout(()=>navigate("/"),2000)
        toast.success("Logged out successfully");
    };

    const Report = async (e) => {
        e.preventDefault();
        setReporting(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${backendUrl}/api/report/create_report`,
                { title: reportTitle, body, conclusion },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Report generated!");

            ShowReportForm(false);
            setReportTitle(""); setBody(""); setConclusion("");
        } catch (error) {
            toast.error("Failed to generate report.");
        } finally {
            setReporting(false);
        }
    };
    const displayReports = async (e)=>{
        e.preventDefault();
        try{
           const response= await axios.get(`${backendurl}/api/report/display-report`);
           if(response.data.success){
            setReports(response.data.report)
           }
        }catch(error){
            console.log("Error displaying reports",error)
        }
    }
    const handleHospitalize = async (patientId) => {
        if (!window.confirm("Hospitalize this patient?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.patch(`${backendUrl}/api/patients/${patientId}/hospitalize`, {},
                { headers: { Authorization: `Bearer ${token}` } }
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
            await axios.delete(`${backendUrl}/api/requests/removeRequests/${requestId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
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
        setFirstName(""); setLastName(""); setGender(""); setDate("");
        setMaritalStatus(""); setDisease(""); setPatientImage(null);
        setEditingPatientId(null); setFormError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const patientData = { firstName, lastName, date: new Date(date), disease, maritalStatus, gender };

            if (editingPatientId) {
                const response = await axios.put(`${backendUrl}/api/patients/${editingPatientId}`, patientData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPatients(prev => prev.map(p => p._id === editingPatientId ? response.data : p));
                toast.success("Patient updated");
            } else {
                const formData = new FormData();
                formData.append("firstName", firstName);
                formData.append("lastName", lastName);
                formData.append("date", date);
                formData.append("disease", disease);
                formData.append("gender", gender);
                formData.append("maritalStatus", maritalStatus);
                if (patientImage) formData.append("Image", patientImage);

                const response = await axios.post(`${backendUrl}/api/patients/create`, formData, {
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
                });
                setPatients(prev => [...prev, response.data.patient]);
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
            const requestData = { Status: "pending", requestType, itemName, quantity, urgency, patientCount, reason };
            const response = await axios.post(`${backendUrl}/api/requests/createRequests`, requestData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                toast.success("Request submitted");
                setShowRequestForm(false);
                fetchRequests();
                // Reset request form
                setItemName(""); setQuantity(""); setReason("");
            }
        } catch (error) {
            toast.error("Failed to submit request");
        }
    };

    const filteredPatients = patients.filter((patient)=> {
        const userFullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
        return userFullName.includes(searchTerm.toLowerCase()) || patient.disease.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // --- SUB COMPONENTS ---

    const SidebarItem = ({ icon: Icon, label, active, count }) => (
        <div className={`sidebar-item flex flex-col items-center justify-center gap-1.5 p-3 cursor-pointer group w-full ${active ? 'text-emerald-600' : 'text-gray-400'}`}>
            <div className={`icon-container w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${active ? 'bg-emerald-50 text-emerald-600 shadow-sm' : 'bg-transparent group-hover:bg-gray-50 text-gray-400'}`}>
                <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold tracking-wide">{label}</span>
            {count > 0 && (
                <span className="absolute top-2 right-4 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
        </div>
    );

    const StatusBadge = ({ status }) => {
        const s = status?.toLowerCase() || "";
        if (s === "approved" || s === "active") return <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200"><Check className="w-4 h-4 text-emerald-600" /></div>;
        if (s === "hospitalized" || s === "rejected") return <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center border border-rose-200"><X className="w-4 h-4 text-rose-600" /></div>;
        return <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center border border-amber-200"><Clock className="w-4 h-4 text-amber-600" /></div>;
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans">
            <FontStyles />

           
            <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 h-[70px]">
                <div className="flex items-center justify-between h-full px-6">
                    {/* Left: Logo & Breadcrumb */}
                    <div className="flex items-center gap-8 pl-0 lg:pl-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                                <Play className="w-4 h-4 fill-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-800 tracking-tight">CLINIC</span>
                        </div>
                        <div className="hidden md:flex items-center text-sm text-gray-400 font-medium">
                            <span className="hover:text-emerald-600 cursor-pointer transition">Nurse Portal</span>
                            <span className="mx-2 text-gray-300">/</span>
                            <span className="text-gray-800">Dashboard</span>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-emerald-600 transition"><Search className="w-5 h-5"/></button>
                        <button className="hidden sm:block p-2 text-gray-400 hover:text-emerald-600 transition"><Grid className="w-5 h-5"/></button>

                        {/* Bell */}
                        <div className="relative">
                            <button className="p-2 text-gray-400 hover:text-emerald-600 transition"><Bell className="w-5 h-5"/></button>
                            {myRequests.filter(r => r.Status !== 'pending').length > 0 && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
                            )}
                        </div>

                        <button className="hidden sm:block p-2 text-gray-400 hover:text-emerald-600 transition"><Moon className="w-5 h-5"/></button>

                        {/* Profile */}
                        <div className="relative ml-2">
                            <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-3">
                                <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face" alt="Profile" className="w-9 h-9 rounded-full object-cover border border-gray-100 shadow-sm" />
                            </button>
                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl cozy-shadow border border-gray-100 overflow-hidden z-50 py-1">
                                    <div className="px-4 py-2 border-b border-gray-50">
                                        <p className="font-bold text-sm text-gray-800 truncate">{username || "Nurse"}</p>
                                        <p className="text-xs text-gray-400 truncate">{email}</p>
                                    </div>
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 flex items-center gap-2"><LogOut className="w-4 h-4"/> Sign Out</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- SIDEBAR (Based on Screenshot: Vertical Icon+Text) --- */}
            <aside className="fixed left-0 top-[70px] bottom-0 w-[100px] bg-white border-r border-gray-100 z-30 flex flex-col items-center py-6 gap-2 overflow-y-auto">
                <SidebarItem icon={Home} label="Dashboard" active={true} />
                <SidebarItem icon={Users} label="Patients" />
                <SidebarItem icon={Calendar} label="Schedule" />
                <SidebarItem icon={ClipboardList} label="Requests" count={myRequests.length} />
                <SidebarItem icon={BarChart3} label="Reports" />
                <SidebarItem icon={MessageSquare} label="Chat" />
                <div className="mt-auto">
                    <SidebarItem icon={Settings} label="Settings" />
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="ml-[100px] pt-[90px] px-6 lg:px-10 pb-10 max-w-[1600px] mx-auto">

                {/* Header & Actions */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Overview</h1>
                        <p className="text-gray-500 mt-1 font-medium">Welcome back, {username || "Nurse"} 👋</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setShowRequestForm(true)} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-emerald-200 hover:text-emerald-600 transition shadow-sm flex items-center gap-2">
                            <ClipboardList className="w-4 h-4" /> Request Item
                        </button>
                        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Add Patient
                        </button>
                        <button onClick={() => ShowReportForm(true)} className="p-2 bg-white border border-gray-200 text-gray-500 rounded-xl hover:text-emerald-600 hover:border-emerald-200 transition shadow-sm">
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
                            <span className="text-emerald-100/80 font-medium text-sm">Total Patients</span>
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"><ArrowUpRight className="w-4 h-4"/></div>
                        </div>
                        <h2 className="relative z-10 text-5xl font-bold text-white mt-4">{patients.length}</h2>
                        <div className="relative z-10 mt-4 flex items-center gap-2">
                            <span className="bg-emerald-500/20 text-emerald-100 text-xs px-2 py-1 rounded-lg border border-emerald-500/30">+2 New</span>
                        </div>
                    </div>

                    {/* Card 2: Hospitalized */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 cozy-shadow hover:translate-y-[-2px] transition duration-300">
                        <div className="flex justify-between items-start">
                            <span className="text-gray-500 font-medium text-sm">Hospitalized</span>
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-emerald-600"><ArrowUpRight className="w-4 h-4"/></div>
                        </div>
                        <h2 className="text-5xl font-bold text-gray-800 mt-4">{patients.filter(p => p.isHospitalized).length}</h2>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="bg-rose-50 text-rose-600 text-xs px-2 py-1 rounded-lg">Critical Care</span>
                        </div>
                    </div>

                    {/* Card 3: Requests */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 cozy-shadow hover:translate-y-[-2px] transition duration-300">
                        <div className="flex justify-between items-start">
                            <span className="text-gray-500 font-medium text-sm">Pending Requests</span>
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"><ArrowUpRight className="w-4 h-4"/></div>
                        </div>
                        <h2 className="text-5xl font-bold text-gray-800 mt-4">{myRequests.filter(r => r.Status === 'pending').length}</h2>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="bg-amber-50 text-amber-600 text-xs px-2 py-1 rounded-lg">Awaiting Approval</span>
                        </div>
                    </div>

                    {/* Card 4: Reports */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 cozy-shadow hover:translate-y-[-2px] transition duration-300">
                        <div className="flex justify-between items-start">
                            <span className="text-gray-500 font-medium text-sm">Reports Generated</span>
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"><ArrowUpRight className="w-4 h-4"/></div>
                        </div>
                        <h2 className="text-5xl font-bold text-gray-800 mt-4">{reports.length}</h2>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="bg-blue-50 text-blue-600 text-px-2 py-1 rounded-lg">This Month</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                    {/* --- PATIENTS TABLE --- */}
                    <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 cozy-shadow overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-800">Assigned Patients</h3>
                            <div className="relative">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 pr-4 py-2 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-emerald-500/20 w-48" />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="pl-6 py-4 text-xs font-semibold text-gray-400 uppercase">Patient</th>
                                    <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase">Condition</th>
                                    <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase">Status</th>
                                    <th className="pr-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                {loading ? <tr><td colSpan="4" className="text-center py-8"><Loader2 className="animate-spin mx-auto"/></td></tr> :
                                    filteredPatients.slice(0, 8).map(patient => (
                                        <tr key={patient._id} className="hover:bg-gray-50/50 transition group">
                                            <td className="pl-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={`${backendUrl}/uploads/${patient.image}`} alt="" className="w-10 h-10 rounded-xl object-cover bg-gray-100" />
                                                    <div>
                                                        <p className="font-bold text-sm text-gray-800">{patient.firstName} {patient.lastName}</p>
                                                        <p className="text-xs text-gray-400">{patient.gender}, {new Date().getFullYear() - new Date(patient.date).getFullYear()} yrs</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600 font-medium">{patient.disease}</td>
                                            <td className="px-4 py-4">
                             <span className={`text-xs font-bold px-2 py-1 rounded-full border ${patient.isHospitalized ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                {patient.isHospitalized ? 'Hospitalized' : 'Active'}
                             </span>
                                            </td>
                                            <td className="pr-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEdit(patient)} className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded-lg"><Edit className="w-4 h-4"/></button>
                                                    <button onClick={() => handleHospitalize(patient._id)} className="p-1.5 hover:bg-amber-50 text-amber-600 rounded-lg"><ActivitySquare className="w-4 h-4"/></button>
                                                    <button onClick={() => handleDelete(patient._id)} className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* --- REQUESTS LIST (Based on Requests.png style) --- */}
                    <div className="bg-white rounded-3xl border border-gray-100 cozy-shadow flex flex-col h-[600px]">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-800">My Requests</h3>
                            <button onClick={fetchRequests} className="text-gray-400 hover:text-emerald-600"><Loader2 className="w-4 h-4"/></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                            {myRequests.length === 0 ? <div className="text-center text-gray-400 py-10">No requests</div> :
                                myRequests.map(req => (
                                    <div key={req._id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition border border-transparent hover:border-gray-100 mb-1 group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                                                {req.itemName.substring(0,2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">{req.itemName}</p>
                                                <p className="text-xs text-gray-400">{req.requestType} • Qty: {req.quantity}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <StatusBadge status={req.Status} />
                                            <button onClick={(e) => handleDeleteRequest(req._id, e)} className="text-gray-300 hover:text-rose-500 transition opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4"/></button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <div className="p-4 border-t border-gray-50">
                            <button onClick={() => setShowRequestForm(true)} className="w-full py-3 rounded-xl border border-dashed border-gray-300 text-gray-500 font-bold hover:border-emerald-500 hover:text-emerald-600 transition flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4"/> New Request
                            </button>
                        </div>
                    </div>

                </div>
            </main>

            {/* --- REPORT FORM MODAL --- */}
            {reportForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop-blur bg-black/20">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 relative animate-in fade-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Generate Report</h2>
                            <button onClick={() => ShowReportForm(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5"/></button>
                        </div>
                        <form onSubmit={Report} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Title</label>
                                <input type="text" required value={reportTitle} onChange={e => setReportTitle(e.target.value)} className="w-full mt-1 p-3 rounded-xl  border-gray-200 focus:border-3 focus:border-emerald-400/20" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Observations</label>
                                <textarea required rows={4} value={body} onChange={e => setBody(e.target.value)} className="w-full mt-1 p-3  rounded-xl border-gray-200 focus:border-3 focus:border-emerald-400/20 resize-none"></textarea>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Conclusion</label>
                                <textarea required rows={2} value={conclusion} onChange={e => setConclusion(e.target.value)} className="w-full mt-1 p-3 border-gray-200 rounded-xl  focus:border-3 focus:border-emerald-400/20 resize-none"></textarea>
                            </div>
                            <div className="flex justify-end pt-4">
                                <button type="submit" className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition">{reporting ? <Loader2 className="animate-spin"/> : "Submit Report"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- ADD PATIENT FORM MODAL --- */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop-blur bg-black/20">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95">
                        <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">{editingPatientId ? "Edit Patient" : "Add Patient"}</h2>
                            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5"/></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">First Name</label>
                                <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-emerald-500/20"/>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Last Name</label>
                                <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-emerald-500/20"/>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Date of Birth</label>
                                <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-emerald-500/20"/>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Gender</label>
                                <select required value={gender} onChange={e => setGender(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-emerald-500/20">
                                    <option value="">Select...</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Condition / Disease</label>
                                <input type="text" required value={disease} onChange={e => setDisease(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-emerald-500/20"/>
                            </div>
                            <div className="md:col-span-2 border-t border-gray-100 pt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl">Cancel</button>
                                <button type="submit" disabled={loading} className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition flex items-center gap-2">
                                    {loading ? <Loader2 className="animate-spin"/> : <><Save className="w-4 h-4"/> Save Record</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- REQUEST FORM MODAL --- */}
            {showRequestForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop-blur bg-black/20">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 relative animate-in fade-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">New Request</h2>
                            <button onClick={() => setShowRequestForm(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5"/></button>
                        </div>
                        <form onSubmit={handleRequestSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Type</label>
                                <select value={requestType} onChange={e => setRequestType(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-emerald-500/20">
                                    <option>Medicine Request</option>
                                    <option>Equipment Request</option>
                                    <option>Supply Request</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Item Name</label>
                                <input type="text" required value={itemName} onChange={e => setItemName(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-emerald-500/20"/>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Quantity</label>
                                    <input type="number" required value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-emerald-500/20"/>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Urgency</label>
                                    <select value={urgency} onChange={e => setUrgency(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-emerald-500/20">
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Reason</label>
                                <textarea required rows={2} value={reason} onChange={e => setReason(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-emerald-500/20 resize-none"></textarea>
                            </div>
                            <div className="flex justify-end pt-4">
                                <button type="submit" className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition">Submit Request</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ToastContainer position="bottom-right" toastClassName="!bg-white !text-gray-800 !rounded-xl !shadow-lg" />
        </div>
    );
}