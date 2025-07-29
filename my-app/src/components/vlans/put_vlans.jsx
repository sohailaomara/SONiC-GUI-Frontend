import React, { useState, useEffect } from "react";
import api from "../../api";

const PutVlan = () => {
  const [vlans, setVlans] = useState([]);
  const [selectedVlanId, setSelectedVlanId] = useState(null);
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState("");
//   const [vlanMembers, setVlanMembers] = useState([
//   { port: "", tagging_mode: "tagged" }
// ]);


  useEffect(() => {
    fetchVlans();
  }, []);

  const fetchVlans = async () => {
  try {
    const response = await api.get("/vlans/");
    const vlanList = response.data["sonic-vlan:sonic-vlan"]?.VLAN?.VLAN_LIST || [];
    const memberList = response.data["sonic-vlan:sonic-vlan"]?.VLAN_MEMBER?.VLAN_MEMBER_LIST || [];

    // Group members by VLAN name (e.g., "Vlan1000")
    const vlanMemberMap = {};
    memberList.forEach(member => {
      const vlanName = member.name.split("|")[0];
      if (!vlanMemberMap[vlanName]) vlanMemberMap[vlanName] = [];
      vlanMemberMap[vlanName].push({
        port: member.ifname,
        tagging_mode: member.tagging_mode
      });
    });

    // Attach members to corresponding VLANs
    const combined = vlanList.map(vlan => ({
      ...vlan,
      members: vlanMemberMap[vlan.name] || []
    }));

    setVlans(combined);
  } catch (error) {
    console.error("Failed to fetch VLANs:", error);
  }
};


  const handleSelectChange = (e) => {
  const vlanId = parseInt(e.target.value);
  const vlan = vlans.find((v) => v.vlanid === vlanId);
  setSelectedVlanId(vlanId);
 const firstMember = (vlan.members || [])[0] || {};
setFormData({
  ...vlan,
  ifname: firstMember.port || "",
  tagging_mode: firstMember.tagging_mode || "tagged",
});


  // Set VLAN members from combined data
 // setVlanMembers(vlan.members || []);
  setStatus("");
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePut = async () => {
  if (!selectedVlanId) return;

  const vlanName = formData.name || `Vlan${formData.vlanid}`;

  const putPayload = {
    "sonic-vlan:sonic-vlan": {
      "VLAN": {
        "VLAN_LIST": [
          {
            "name": vlanName,
            "vlanid": formData.vlanid,
            "description": formData.description || "",
            "mac_learning": formData.mac_learning || "enabled"
          }
        ]
      },
      "VLAN_MEMBER": {
        "VLAN_MEMBER_LIST": [
          {
            "name": vlanName,
            "ifname": formData.ifname || "",
            "tagging_mode": formData.tagging_mode || "tagged"
          }
        ]
      }
    }
  };

  try {
    console.log("PUT payload:", JSON.stringify(putPayload, null, 2));
    await api.put(`/vlans/put_vlans`, putPayload);
    setStatus("VLAN updated successfully.");
    fetchVlans();
  } catch (error) {
    setStatus("PUT failed.");
    console.error("PUT error:", error.response?.data || error);
  }
};




 


//     const handleMemberChange = (index, field, value) => {
//   const updated = [...vlanMembers];
//   updated[index][field] = value;
//   setVlanMembers(updated);
// };

//     const addMember = () => {
//   setVlanMembers([...vlanMembers, { port: "", tagging_mode: "tagged" }]);
// };

//     const removeMember = (index) => {
//   const updated = vlanMembers.filter((_, i) => i !== index);
//   setVlanMembers(updated);
// };


  return (
    <div className="w-1/3 mx-auto p-4">
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium">Select VLAN</label>
        <select
          value={selectedVlanId || ""}
          onChange={handleSelectChange}
          className="w-full border rounded p-2 bg-gray-100"
        >
          <option value="" disabled>Select a VLAN</option>
          {vlans.map((vlan) => (
            <option key={vlan.vlanid} value={vlan.vlanid}>
              {vlan.name} (ID: {vlan.vlanid})
            </option>
          ))}
        </select>
      </div>

      {selectedVlanId && (
        <>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label className="block text-sm">VLAN ID</label>
              <input
                type="number"
                name="vlanid"
                value={formData.vlanid}
                disabled
                className="w-full border p-2 rounded bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                className="w-full border p-2 rounded bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                className="w-full border p-2 rounded bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm">MAC Learning</label>
              <select
                name="mac_learning"
                value={formData.mac_learning || "enabled"}
                onChange={handleInputChange}
                className="w-full border p-2 rounded bg-gray-100"
              >
                <option value="enabled">enabled</option>
                <option value="disabled">disabled</option>
              </select>
            </div>
          </div>

          <div>
  <label className="block text-sm text-orange-500">ifName</label>
  <input
    type="text"
    name="ifname"
    value={formData.ifname || ""}
    onChange={handleInputChange}
    className="w-full border p-2 rounded bg-gray-100"
  />
</div>

<div>
  <label className="block text-sm text-orange-500">Tagging Mode</label>
  <select
    name="tagging_mode"
    value={formData.tagging_mode || ""}
    onChange={handleInputChange}
    className="w-full border p-2 rounded bg-gray-100 text-gray-900"
  >
    <option value="tagged">Tagged</option>
    <option value="untagged">Untagged</option>
  </select>
</div>

           



          <div className="flex gap-2">
            <button
              onClick={handlePut}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              PUT VLAN
            </button>
            <button
              onClick={() => {
                setSelectedVlanId(null);
                setFormData({});
              }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>

          {status && (
            <p className="mt-3 text-sm text-gray-600 italic">{status}</p>
          )}
        </>
      )}
    </div>
  );
};

export default PutVlan;
