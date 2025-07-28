import React, { useState } from "react";
import api from "../../api";

const PutVlans = () => {
  const [formData, setFormData] = useState({
    vlanid: "",
    name: "",
    description: "",
    mac_learning: "enable",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        "sonic-vlan:VLAN_LIST": [
          {
            vlanid: parseInt(formData.vlanid),
            name: formData.name,
            description: formData.description,
            mac_learning: formData.mac_learning,
          },
        ],
      };

      await api.put(`/vlans/${formData.vlanid}`, payload);
      setMessage("VLAN updated successfully.");
    } catch (error) {
      console.error("PUT VLAN error:", error);
      setMessage("Error updating VLAN.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow border">
      <h2 className="text-lg font-semibold mb-4 text-orange-600">Update VLAN</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="number"
          name="vlanid"
          placeholder="VLAN ID"
          value={formData.vlanid}
          onChange={handleChange}
          className="p-2 border rounded w-full"
          required
        />

        <input
          type="text"
          name="name"
          placeholder="VLAN Name"
          value={formData.name}
          onChange={handleChange}
          className="p-2 border rounded w-full"
          required
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        />

        <select
          name="mac_learning"
          value={formData.mac_learning}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        >
          <option value="enable">Enable</option>
          <option value="disable">Disable</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update VLAN"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-sm text-center text-gray-700">{message}</p>
      )}
    </div>
  );
};

export default PutVlans;
