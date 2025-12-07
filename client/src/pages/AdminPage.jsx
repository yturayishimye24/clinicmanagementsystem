import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { ThreeDot } from "react-loading-indicators";
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
} from "lucide-react";
import techImage from "../../images/techImage.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext.jsx";

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

const AdminPage = () => {
  const { logout } = useAuth();
  const [openSection, setOpenSection] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const [logging, setLogging] = useState(false);
  const toggle = (section) =>
    setOpenSection(openSection === section ? null : section);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleLogout = () => {
    setLogging(true);
    setShowToast(true);
    setTimeout(() => {
      logout();
      navigate("/home");
    }, 2000);
  };

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
              {menuItem("/admin/dashboard", LayoutDashboard, "Dashboard")}
            </Section>

            <Section
              title="Management"
              Icon={UserCircle}
              isOpen={openSection === "management"}
              onToggle={() => toggle("management")}
            >
              {menuItem("/admin/nurses", UserCircle, "Nurses")}
              {menuItem("/admin/scheduling", CalendarDays, "Scheduling")}
              {menuItem("/admin/attendance", Clock, "Attendance")}
              {menuItem("/admin/departments", Building2, "Departments")}
            </Section>

            <Section
              title="Operations"
              Icon={ListChecks}
              isOpen={openSection === "operations"}
              onToggle={() => toggle("operations")}
            >
              {menuItem("/admin/tasks", ListChecks, "Tasks")}
              {menuItem("/admin/compliance", BadgeCheck, "Compliance")}
              {menuItem("/admin/communication", MessageSquare, "Communication")}
            </Section>

            <Section
              title="System"
              Icon={Settings}
              isOpen={openSection === "system"}
              onToggle={() => toggle("system")}
            >
              {menuItem("/admin/reports", BarChart3, "Reports")}
              {menuItem("/admin/settings", Settings, "Settings")}
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
            <h1 className="text-xl font-semibold">Admin Panel</h1>
          </header>

          <main className="p-6 grid lg:grid-cols-[2fr_1fr] gap-6 mt-20 bg-gray-50 md:grid-cols-1 sm:grid-cols-1">
            <div>
              <h1 className="font-arial text-3xl font-bold mb-9 md:text-center sm:text-center">
                Welcome {localStorage.getItem("name")}
              </h1>
              <div className="flex items-center justify-center bg-white rounded-md max-w-[900px] shadow-md p-9 gap-6">
                <div>
                  <h1 className="font-bold font-arial">Configure the Theme</h1>
                  <p className="text-gray-500 font-sans">
                    Configuring theme colors and background options allows you
                    to personalize the theme.
                    <br /> You can also change the menu type,
                    <br /> and switch between fluid and boxed layout.
                  </p>
                  <button className="text-white bg-green-600 rounded-full btn btn-accent mt-4 px-6 py-2">
                    Configure
                  </button>
                </div>
                <div
                  style={{ backgroundImage: `url(${techImage})` }}
                  className="bg-cover bg-center w-full h-64 rounded-lg"
                ></div>
              </div>

              <div className="mt-6 grid grid-cols-4 gap-4">
                <div className="bg-white shadow-md rounded-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      +12%
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">248</h3>
                  <p className="text-sm text-gray-500">Total Nurses</p>
                </div>

                <div className="bg-white shadow-md rounded-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      +8%
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">186</h3>
                  <p className="text-sm text-gray-500">Active Today</p>
                </div>

                <div className="bg-white shadow-md rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className="text-sm font-semibold text-red-600">
                      -3%
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">42</h3>
                  <p className="text-sm text-gray-500">Scheduled Shifts</p>
                </div>

                <div className="bg-white shadow-md rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      +5%
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">1,240</h3>
                  <p className="text-sm text-gray-500">Hours This Week</p>
                </div>
              </div>
              <div className="bg-white rounded-md shadow-md mt-20 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-xl font-bold">Current Patients</h1>
                  <input
                    type="search"
                    placeholder="Search patients..."
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div className="max-h-96 overflow-auto border border-gray-200 overflow-y-scroll">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Image
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patient Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Disease
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src="https://via.placeholder.com/40"
                            alt="Patient"
                            className="w-10 h-10 rounded-full"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          John Doe
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Flu
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src="https://via.placeholder.com/40"
                            alt="Patient"
                            className="w-10 h-10 rounded-full"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Jane Smith
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Cold
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Recovering
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src="https://via.placeholder.com/40"
                            alt="Patient"
                            className="w-10 h-10 rounded-full"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Michael Brown
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Fever
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Critical
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src="https://via.placeholder.com/40"
                            alt="Patient"
                            className="w-10 h-10 rounded-full"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Michael Brown
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Fever
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Critical
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src="https://via.placeholder.com/40"
                            alt="Patient"
                            className="w-10 h-10 rounded-full"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Michael Brown
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Fever
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Critical
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src="https://via.placeholder.com/40"
                            alt="Patient"
                            className="w-10 h-10 rounded-full"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Michael Brown
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Fever
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Critical
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src="https://via.placeholder.com/40"
                            alt="Patient"
                            className="w-10 h-10 rounded-full"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Michael Brown
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Fever
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Critical
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-4">
                <div className="bg-white text-gray-700 shadow-lg h-auto p-2 rounded-3xl flex items-center gap-4 hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="h-20 w-12 bg-green-200 rounded-l-3xl flex items-center justify-center">
                    <PlusCircle className="w-6 h-6 text-green-700" />
                  </div>
                  <h3 className="ml-4 font-semibold text-lg">Add Nurse</h3>
                </div>

                <div className="bg-white text-gray-700 shadow-lg h-auto p-2 rounded-3xl flex items-center gap-4 hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="h-20 w-12 bg-blue-200 rounded-l-3xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-700" />
                  </div>
                  <h3 className="ml-4 font-semibold text-lg">Schedule Shift</h3>
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
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminPage;
