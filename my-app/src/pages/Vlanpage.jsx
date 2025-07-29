import Layout from '../components/Layout';
import PostVlan from '../components/vlans/post_vlans';
import PatchVlan from '../components/vlans/patch_vlans';
import GetVlans from '../components/vlans/get_vlans';
import PutVlan from "../components/vlans/put_vlans";
import DeleteVlans from '../components/vlans/delete_vlans';
import { AppWindow } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function VlanPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate('/home')}
          className="text-sm px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded"
        >
          ← Back to Home
        </button>
      </div>

      <Section title="Create VLAN" icon={<AppWindow className="text-orange-500" />}>
        <PostVlan />
      </Section>
      <Section title="Patch VLAN" icon={<AppWindow className="text-orange-500" />}>
        <PatchVlan />
      </Section>
      <Section title="VLAN Data" icon={<AppWindow className="text-orange-500" />}>
        <GetVlans />
      </Section>
      <Section title="PUT VLAN" icon={<AppWindow className="text-orange-500" />}>
        <PutVlan />
      </Section>
        <Section title="Delete VLAN" icon={<AppWindow className="text-orange-500" />}>
            <DeleteVlans />
      </Section>

    </Layout>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="mb-6">
      <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          {icon}
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}
