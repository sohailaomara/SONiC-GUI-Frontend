import React from "react";
import api from "../api";

const Vlan = () => {
    const getVlan = async () => {
        try {
            const response = await api.get("/vlan/get");
            console.log("vlan data:", response.data);
        } catch (error) {
            if (error.response) {
                alert("Failed to fetch vlan data: " + error.response.data.detail);
            } else {
                console.error("Unknown error:", error);
            }
        }
    }

    return (
        <div>
            <button onClick={getVlan}>Fetch Vlan Data</button>
        </div>
    );
};

export default Vlan;