import Layout from "../components/Layout";
import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Activity,
  Settings,
  Info,
  Eye,
} from "lucide-react";

import OperationalStatus from "../components/status_widgets/OperationalStatus";
import AdminStatus from "../components/status_widgets/AdminStatus";
import InterfaceDesc from "../components/status_widgets/InterfaceDesc";
import InterfaceStatus from "../components/status_widgets/InterfaceStatus";
import SpeedGauge from "../components/health/SpeedGauge";
import Usage from "../components/health/Usage";
import Temperature from "../components/health/Temperature";
import Fans from "../components/health/Fans";

export default function HomePage() {
  return (
    <Layout>
      <div className="p-6 space-y-4">
        {/* Use 5-column grid for better proportions */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          {/* Left side (status widgets, smaller width now) */}
          <div className="col-span-1 xl:col-span-2 space-y-4">
            <Section
              title="Operational Status"
              icon={<Activity className="text-orange-500" />}
            >
              <OperationalStatus />
            </Section>
            <Section
              title="Admin Status"
              icon={<Settings className="text-orange-500" />}
            >
              <AdminStatus />
            </Section>
            <Section
              title="Interface Status"
              icon={<Eye className="text-orange-500" />}
            >
              <InterfaceStatus />
            </Section>
            <Section
              title="Interface Descriptions"
              icon={<Info className="text-orange-500" />}
            >
              <InterfaceDesc />
            </Section>
          </div>

          <div className="col-span-2 xl:col-span-3 grid grid-cols-1 gap-4 self-start">
            {/* Top row: Speed + Temperature side by side */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 self-start">
              <SpeedGauge />
              <Usage />
            </div>

            {/* Bottom row: Fans full width */}
            {/* <Fans /> */}
          </div>
        </div>
      </div>
    </Layout>
  );

  function Section({ title, icon, children }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="mb-4 border border-gray-200 rounded-xl shadow-md">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-5 py-4 bg-white text-left rounded-t-xl hover:bg-gray-50 transition"
        >
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-md font-semibold text-gray-900">{title}</h2>
          </div>
          {isOpen ? (
            <ChevronDown className="text-gray-600" />
          ) : (
            <ChevronRight className="text-gray-600" />
          )}
        </button>

        {isOpen && (
          <div className="px-5 pb-5 pt-2 bg-gray-50 rounded-b-xl transition-all duration-300">
            {children}
          </div>
        )}
      </div>
    );
  }
}
