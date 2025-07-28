import React from "react";
import api from "../../api";

const post_vlans = () => {
    const postVlan = async () => {
        try {
            const response = await api.get("/network/vlans");
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
            <button onClick={postVlan}>Post Vlan Data</button>
        </div>
    );
};

export default get_vlans;