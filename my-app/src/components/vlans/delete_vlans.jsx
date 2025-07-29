import React, { useEffect, useState } from 'react';
import api from '../../api';

export default function DeleteVlans() {
  const [vlans, setVlans] = useState([]);
  const [loading, setLoading] = useState(false);

const fetchVlans = async () => {
  setLoading(true);
  try {
    const response = await api.get(`/vlans/delete/{vlan_name}`);
    const vlanList = response.data['sonic-vlan:sonic-vlan']?.VLAN?.VLAN_LIST || [];
    setVlans(vlanList);
  } catch (error) {
    console.error('Error fetching VLANs:', error);
  }
  setLoading(false);
};

const handleDelete = async (vlanName) => {
  if (!vlanName) {
    alert("VLAN name is undefined");
    return;
  }

  if (!window.confirm(`Are you sure you want to delete VLAN ${vlanName}?`)) return;

  try {
    await api.delete(`/vlans/delete/${vlanName}`);  // ✅ correct HTTP method
    setVlans((prev) => prev.filter((vlan) => vlan.name !== vlanName));
  } catch (error) {
    alert(`Failed to delete VLAN ${vlanName}: ` + (error.response?.data?.detail || 'Unknown error'));
  }
};






  useEffect(() => {
    fetchVlans();
  }, []);

  return (
    <div className="overflow-y-auto max-h-[320px] border border-gray-200 rounded shadow ">
      {loading ? (
        <p className="text-sm text-gray-500">Loading VLANs...</p>
      ) : vlans.length === 0 ? (
        <p className="text-sm text-gray-500">No VLANs found.</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-orange-200 text-orange-800 sticky top-0">
            <tr>
              <th className="px-4 py-2">VLAN ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {vlans.map((vlan) => (
              <tr key={vlan.vlanid} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{vlan.vlanid}</td>
                <td className="px-4 py-2">{vlan.name || '—'}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(vlan.name)}
                    className="bg-orange-400 hover:bg-orange-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
