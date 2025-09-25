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
import PSU from "../components/health/PSU";
import ChatbotButton from "../components/ChatbotButton";

export default function HomePage() {
  return (
    <Layout>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-3">
          {/* Left side - Status widgets (2 columns) */}
          <div className="col-span-1 xl:col-span-2 space-y-3">
            <CompactSection
              title="Operational Status"
              icon={<Activity className="text-orange-500 w-4 h-4" />}
            >
              <OperationalStatus />
            </CompactSection>
            <CompactSection
              title="Admin Status"
              icon={<Settings className="text-orange-500 w-4 h-4" />}
            >
              <AdminStatus />
            </CompactSection>
            <CompactSection
              title="Interface Status"
              icon={<Eye className="text-orange-500 w-4 h-4" />}
            >
              <InterfaceStatus />
            </CompactSection>
            <CompactSection
              title="Interface Descriptions"
              icon={<Info className="text-orange-500 w-4 h-4" />}
            >
              <InterfaceDesc />
            </CompactSection>

            {/* Temperature component below the collapsible sections (takes 2 columns width) */}
            <Temperature />
          </div>

          {/* Right side - Health metrics (3 columns) */}
          <div className="col-span-2 xl:col-span-3 space-y-3">
            {/* Top row: Speed + Usage + PSU (3 columns) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <SpeedGauge />
              <Usage />
              <PSU />
            </div>

            {/* Fans component takes full width of the 3 columns */}
            <Fans />
          </div>
        </div>
      </div>
      <ChatbotButton />
    </Layout>
  );

  function CompactSection({ title, icon, children }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="mb-3 border border-gray-200 rounded-lg shadow-sm">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white text-left rounded-t-lg hover:bg-gray-50 transition"
        >
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          </div>
          {isOpen ? (
            <ChevronDown className="text-gray-600 w-4 h-4" />
          ) : (
            <ChevronRight className="text-gray-600 w-4 h-4" />
          )}
        </button>

        {isOpen && (
          <div className="px-4 pb-4 pt-2 bg-gray-50 rounded-b-lg transition-all duration-300">
            {children}
          </div>
        )}
      </div>
    );
  }
}
