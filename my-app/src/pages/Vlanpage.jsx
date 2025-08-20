import Layout from "../components/Layout";
import PostVlan from "../components/vlans/post_vlans";
import PatchVlan from "../components/vlans/patch_vlans";
import GetVlans from "../components/vlans/get_vlans";
import PutVlan from "../components/vlans/put_vlans";
import DeleteVlans from "../components/vlans/delete_vlans";
import { useState } from "react";
import { AppWindow, Repeat2, Trash, CornerRightDown, Text } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function VlanPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate("/home")}
          className="text-sm px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded"
        >
          ← Back to Home
        </button>
      </div>

      <Section
        title="Create VLAN"
        icon={<CornerRightDown className="text-orange-500" />}
      >
        <PostVlan />
      </Section>
      {/* <Section
        title="Patch VLAN"
        icon={<Repeat2 className="text-orange-500" />}
      >
        <PatchVlan />
      </Section> */}
      <Section title="VLAN Data" icon={<Text className="text-orange-500" />}>
        <GetVlans />
      </Section>
      <Section title="Put VLAN" icon={<Repeat2 className="text-orange-500" />}>
        <PutVlan />
      </Section>
      <Section title="Delete VLAN" icon={<Trash className="text-orange-500" />}>
        <DeleteVlans />
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
