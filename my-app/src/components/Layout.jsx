import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Terminal } from "lucide-react";
import CLI from "./CLI";
import { fetchCurrentUser } from "./auth/getuser"; // your axios call

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [username, setUsername] = useState("User"); // initially placeholder
  const navigate = useNavigate();
  const [cliOpen, setCliOpen] = useState(false);

  // fetch username when component mounts
  useEffect(() => {
    const loadUser = async () => {
      const data = await fetchCurrentUser();
      if (data?.username) {
        setUsername(data.username);
      }
      // else {
      //   // if no valid user, force logout
      //   navigate("/login");
      // }
    };
    loadUser();
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token"); // remove token when signing out
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-30 sm:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`transform bg-gray-100 border border-gray-300 text-white w-56 p-4 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed h-full z-40 rounded-r-xl shadow-xl`}
      >
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mx-auto mb-2 block p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 self-start"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6 text-grey-700" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
        <nav className="flex flex-col gap-2">
          <Link
            to="/home"
            onClick={() => setSidebarOpen(false)}
            className="text-orange-500 font-medium hover:text-orange-600"
          >
            Home
          </Link>
          <Link
            to="/vlan"
            onClick={() => setSidebarOpen(false)}
            className="text-orange-500 font-medium hover:text-orange-600"
          >
            VLAN
          </Link>
          <Link
            to="/portops"
            onClick={() => setSidebarOpen(false)}
            className="text-orange-500 font-medium hover:text-orange-600"
          >
            PortOps
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-gray-100 shadow-md rounded-b-xl px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="block text-grey-700 z-50"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Hello, <span className="text-orange-500">{username}</span>
              </h1>
              <p className="text-sm text-gray-500">
                {time.toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setCliOpen(true)}
              className="text-sm px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg shadow"
            >
              <Terminal className="w-4 h-4" />
            </button>
            <button
              onClick={handleSignOut}
              className="text-sm px-4 py-2 bg-orange-600 hover:bg-orange-800 text-white rounded-lg shadow"
            >
              Sign Out
            </button>
          </div>
        </header>

        <main className="p-8">{children}</main>
      </div>

      {cliOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl w-[95%] md:w-[900px] max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center bg-gray-800 text-white px-4 py-2">
              <h2 className="text-lg font-semibold">CLI Terminal</h2>
              <button
                onClick={() => setCliOpen(false)}
                className="text-red-400"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-auto flex-1 bg-black">
              <CLI />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
