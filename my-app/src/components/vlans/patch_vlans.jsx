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
      setVlans(vlanList);
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

  
  const patchPayload = {
    "sonic-vlan:sonic-vlan": {
      VLAN: {
        VLAN_LIST: [
          {
            ...originalData,
            ...changedFields,
          },
        ],
      },
      VLAN_MEMBER: {
        VLAN_MEMBER_LIST: [],
      },
    },
  };

  try {
    await api.patch(`/vlans/patch_vlans`, patchPayload);
    setStatus("VLAN patched successfully.");
    fetchVlans();
  } catch (error) {
    setStatus("Patch failed.");
    console.error("Patch error:", error);
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
              <label className="block text-sm text-orange-500">VLAN ID</label>
              <input
                type="number"
                name="vlanid"
                value={formData.vlanid}
                disabled
                className="w-full border p-2 rounded bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm text-orange-500">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                className="w-full border p-2 rounded bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm text-orange-500">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                className="w-full border p-2 rounded bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm text-orange-500">MAC Learning</label>
              <select
                name="mac_learning"
                value={formData.mac_learning || "enabled"}
                onChange={handleInputChange}
                className="w-full border p-2 rounded bg-gray-100 text-gray-900"
              >
                <option value="enabled">enabled</option>
                <option value="disabled">disabled</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePatch}
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
            >
              PATCH VLAN
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
