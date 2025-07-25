import { useEffect, useState } from 'react';
import { AppWindow } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();

  const username = "Sohaila"; // Replace this with actual user logic if needed

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = () => {
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen bg-white text-black">
      {/* Top Bar */}
  <header className="sticky top-0 z-50 w-full bg-gray-100 shadow-md rounded-b-xl px-6 py-4 flex justify-between items-center transition-all duration-300 ease-in-out">
    <div>
      <h1 className="text-xl font-semibold">
        Hello, <span className="text-orange-500">{username}</span>
      </h1>
      <p className="text-sm text-gray-500">{time.toLocaleTimeString()}</p>
    </div>
    <button
      onClick={handleSignOut}
      className="text-sm px-4 py-2 bg-orange-600 hover:bg-orange-800 text-white rounded-lg shadow transition duration-300 ease-in-out"
    >
      Sign Out
    </button>
  </header>



      {/* Dashboard Content */}
      <main className="w-full px-8 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Applications" icon={<AppWindow className="text-orange-500" />}>
          <div className="flex gap-4 flex-wrap">
            <button className="bg-gray-200 hover:bg-orange-400 hover:text-white px-5 py-2 rounded shadow">
              Terminal
            </button>
            <button className="bg-gray-200 hover:bg-orange-400 hover:text-white px-5 py-2 rounded shadow">
              Files
            </button>
          </div>
        </Card>

        {/* Add more cards here if needed */}
      </main>
    </div>
  );
}

function Card({ title, icon, children }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 w-full">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}
