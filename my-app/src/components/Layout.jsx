import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const username = "User";
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = () => {
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen">
        {sidebarOpen && (
    <div
        onClick={() => setSidebarOpen(false)}
        className="fixed inset-0 bg-black bg-opacity-40 z-30 sm:hidden"
         />
        )}
      {/* Sidebar */}
    <div className={`transform bg-gray-100 border border-gray-300 text-white w-56 p-4 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed h-full z-40 rounded-r-xl shadow-xl`}>
      {/* Sidebar header/logo */}
    <div className="flex items-center justify-between mb-6">
          <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="mx-auto mb-2 block p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800"
  >
    {sidebarOpen ? <X className="w-6 h-6 text-grey-700" /> : <Menu className="w-5 h-5" />}
  </button>

    </div>
    <nav className="flex flex-col gap-2">
        <Link to="/home" onClick={() => setSidebarOpen(false)} className="text-orange-500 font-medium hover:text-orange-600">Home</Link>
        <Link to="/vlan" onClick={() => setSidebarOpen(false)} className="text-orange-500 font-medium hover:text-orange-600">VLAN</Link>
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
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Hello, <span className="text-orange-500">{username}</span>
              </h1>
              <p className="text-sm text-gray-500">{time.toLocaleTimeString()}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="text-sm px-4 py-2 bg-orange-600 hover:bg-orange-800 text-white rounded-lg shadow"
          >
            Sign Out
          </button>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
