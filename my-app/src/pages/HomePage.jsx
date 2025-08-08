import Layout from "../components/Layout";
import { AppWindow } from "lucide-react";
import PortOp from "../components/port_operation/get_port_op";
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

export default function HomePage() {
  return (
    <Layout>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          {/* Sections take up 2 columns out of 4 */}
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

          {/* Speed Gauge spans the other 2 columns */}
          <div className="col-span-1 xl:col-span-2">
            <SpeedGauge />
          </div>
        </div>
      </div>
    </Layout>
  );
  function Section({ title, icon, children }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSection = () => {
      setIsOpen(!isOpen);
    };
    return (
      <div className="mb-4 border border-gray-200 rounded-xl shadow-md">
        <button
          onClick={toggleSection}
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
