import React, { useState, useEffect } from "react";
import api from "../../api";

const PatchVlan = () => {
  const [vlans, setVlans] = useState([]);
  const [selectedVlanId, setSelectedVlanId] = useState(null);
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchVlans();
  }, []);

const fetchVlans = async () => {
  try {
    const response = await api.get("/vlans/");
    const vlanList =
      response.data["sonic-vlan:sonic-vlan"]?.VLAN?.VLAN_LIST || [];
    const vlanMemberList =
      response.data["sonic-vlan:sonic-vlan"]?.VLAN_MEMBER?.VLAN_MEMBER_LIST || [];

    
    const memberMap = {};
    vlanMemberList.forEach((member) => {
      
      memberMap[member.name] = {
        ifname: member.ifname,
        tagging_mode: member.tagging_mode,
      };
    });

   
    const combinedList = vlanList.map((vlan) => ({
      ...vlan,
      ...memberMap[vlan.name], 
    }));

    setVlans(combinedList);
  } catch (error) {
    console.error("Failed to fetch VLANs:", error);
  }
};


  const handleSelectChange = (e) => {
    const vlanId = parseInt(e.target.value);
    const vlan = vlans.find((v) => v.vlanid === vlanId);
    setSelectedVlanId(vlanId);
    setOriginalData(vlan);
    setFormData({ ...vlan });
    setStatus("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handlePatch = async () => {
  if (!selectedVlanId) return;

  setStatus("Patching...");

  const changedFields = {};
  for (const key in formData) {
    if (formData[key] !== originalData[key]) {
      changedFields[key] = formData[key];
    }
  }

  if (Object.keys(changedFields).length === 0) {
    setStatus("No changes to patch.");
    return;
  }

  const vlan = {
    name: formData.name,
    vlanid: parseInt(formData.vlanid),
    description: formData.description || "",
    mac_learning: formData.mac_learning,
  };

  const patchPayload = {
    "sonic-vlan:sonic-vlan": {
      VLAN: {
        VLAN_LIST: [vlan],
      },
      VLAN_MEMBER: {
        VLAN_MEMBER_LIST: [],
      },
    },
  };

  if ("ifname" in changedFields || "tagging_mode" in changedFields) {
    patchPayload["sonic-vlan:sonic-vlan"].VLAN_MEMBER.VLAN_MEMBER_LIST.push({
      name: formData.name,
      ifname: formData.ifname,
      tagging_mode: formData.tagging_mode?.toLowerCase?.() || "tagged",
    });
  }

  try {
    await api.patch("/vlans/patch_vlans", patchPayload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    setStatus(" VLAN patched successfully.");
    fetchVlans();
  } catch (error) {
    console.error("Patch error:", error.response?.data || error);
    setStatus(" Error: " + (error.response?.data?.detail || "Unknown error"));
  }
};





  return (
    <div className="w-1/3 mx-auto p-4 text-gray-900">
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-orange-500">Select VLAN</label>
        <select
          value={selectedVlanId || ""}
          onChange={handleSelectChange}
          className="w-full border rounded p-2 bg-gray-100 text-gray-900"
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
              <label className="block mb-1 text-sm font-medium text-orange-500">VLAN ID</label>
              <input
                type="number"
                name="vlanid"
                value={formData.vlanid}
                disabled
                className="w-full border p-2 rounded bg-gray-100 text-gray-900"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-orange-500">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                className="w-full border p-2 rounded bg-gray-100 text-gray-900"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-orange-500">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                className="w-full border p-2 rounded bg-gray-100 text-gray-900"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-orange-500">MAC Learning</label>
              <select
                name="mac_learning"
                value={formData.mac_learning || "enabled"}
                onChange={handleInputChange}
                className="w-full border p-2 rounded bg-gray-100 text-gray-900"
              >
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-orange-500">ifName</label>
              <input
                type="text"
                name="ifname"
                value={formData.ifname || ""}
                onChange={handleInputChange}
                className="w-full border p-2 rounded bg-gray-100 text-gray-900"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-orange-500">Tagging Mode</label>
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

          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePatch}
              className="bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-500"
            >
              Patch VLAN
            </button>
            <button
              onClick={() => {
                setSelectedVlanId(null);
                setFormData({});
                setOriginalData({});
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

export default PatchVlan;
