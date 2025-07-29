import React, { useState } from "react";
import api from "../../api";

const PostVlan = () => {
  const [vlanId, setVlanId] = useState("");
  const [name, setName] = useState("");
  const [ifname, setifName] = useState("");
  const [description, setDescription] = useState("");
  const [macLearning, setMacLearning] = useState("enabled");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  const payload = {
  "sonic-vlan:VLAN": {
    "VLAN_LIST": [
      {
        "name": name,
        "vlanid": parseInt(vlanId),
        "description": description,
        "mac_learning": macLearning
      }
    ]
  },
  "sonic-vlan:VLAN_MEMBER": {
    "VLAN_MEMBER_LIST": [
      {
        "name": name,
        "ifname": ifname,
        "tagging_mode": "tagged"
      }
    ]
  }
};

  try {
    const response = await api.post("/vlans/add_vlans", payload, {
  headers: {
    "Content-Type": "application/json"
  }
});

    setMessage("✅ VLAN created successfully!");
  } catch (error) {
    if (error.response) {
      console.error("Validation error:", error.response.data);
      setMessage("❌ Error: " + error.response.data.detail);
    } else {
      setMessage("❌ Unknown error occurred.");
      console.error(error);
    }
  }

  setLoading(false);
};





  return (
    <div className="w-full p-4 border rounded shadow">
      {/* <h2 className="text-xl font-bold mb-4 text-orange-600">Create VLAN</h2> */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="number"
          placeholder="VLAN ID"
          value={vlanId}
          onChange={(e) => setVlanId(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded bg-gray-100"
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded bg-gray-100"
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded bg-gray-100"
        />
        <select
          value={macLearning}
          onChange={(e) => setMacLearning(e.target.value)}
          className="w-full px-3 py-2 border rounded bg-gray-100"
        >
          <option value="enabled">MAC Learning: Enabled</option>
          <option value="disabled">MAC Learning: Disabled</option>
        </select>
        <input
          type="text"
          placeholder="ifName"
          value={ifname}
          onChange={(e) => setifName(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded bg-gray-100"
        />
        <button
          type="submit"
          className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create VLAN"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-sm text-center text-gray-700">{message}</p>
      )}
    </div>
  );
};

export default PostVlan;