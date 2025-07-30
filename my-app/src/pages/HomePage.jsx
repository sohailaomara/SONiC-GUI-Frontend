import Layout from '../components/Layout';
import { AppWindow } from 'lucide-react';
import PortOp from '../components/port_operation/get_port_op';
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function HomePage() {
  return (
    <Layout>
      <Section title="Port Operation" icon={<AppWindow className="text-orange-500" />}>
        <PortOp />
      </Section>
    </Layout>
  );
}

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
        {isOpen ? <ChevronDown className="text-gray-600" /> : <ChevronRight className="text-gray-600" />}
      </button>

      {isOpen && (
        <div className="px-5 pb-5 pt-2 bg-gray-50 rounded-b-xl transition-all duration-300">
          {children}
        </div>
      )}
    </div>
  );
}