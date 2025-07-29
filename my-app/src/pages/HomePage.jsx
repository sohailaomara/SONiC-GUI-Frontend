import Layout from '../components/Layout';
import { AppWindow } from 'lucide-react';
import GetVlans from '../components/vlans/get_vlans';
import PostVlan from '../components/vlans/post_vlans';
import PatchVlan from '../components/vlans/patch_vlans';
import PortOp from '../components/port_operation/get_port_op';

export default function HomePage() {
  return (
    <Layout>
      {/* <Section title="VLAN Data" icon={<AppWindow className="text-orange-500" />}>
        <GetVlans />
      </Section>
      <Section title="Create VLAN" icon={<AppWindow className="text-orange-500" />}>
        <PostVlan />
      </Section>
      <Section title="Patch VLAN" icon={<AppWindow className="text-orange-500" />}>
        <PatchVlan />
      </Section> */}
      <Section title="Port Operation" icon={<AppWindow className="text-orange-500" />}>
        <PortOp />
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
