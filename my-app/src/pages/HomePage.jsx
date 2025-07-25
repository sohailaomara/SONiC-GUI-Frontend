import { useEffect, useState } from 'react';
import { Cpu, MemoryStick, Settings, AppWindow } from 'lucide-react';

export default function HomePage() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-between">
      {/* Nav */}
      <header className="flex left justify-between mb-6">
        <h1 className="text-3xl font-bold text-cyan-500">SONiC</h1>
        <span className="text-sm text-gray-300">{time.toLocaleTimeString()}</span>
      </header>

      {/* Dashboard */}
      <main className="grid grid-cols-1 md:grid-cols-300 gap-6">

        {/* App Shortcuts */}
        <Card title="Applications" icon={<AppWindow className="text-cyan-500" />}>
          <div className="flex gap-5 flex-wrap">
            <button className="bg-gray-300 hover:bg-cyan-500 px-5 py-1 rounded">Terminal</button>
            <button className="bg-gray-300 hover:bg-cyan-500 px-3 py-1 rounded">Files</button>
          </div>
        </Card>
      </main>
    </div>
  );
}

function Card({ title, icon, children }) {
  return (
    <div className="bg-gray-850 rounded-2xl p-4 shadow-lg border border-gray-700">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}
