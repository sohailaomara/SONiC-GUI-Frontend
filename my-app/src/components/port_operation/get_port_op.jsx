import React from "react";
import api from "../../api";

const PortOp = () => {
    const getPortOp = async () => {
        try {
            const response = await api.get("/port_oper/po");
            console.log("Port-op data:", response.data);
        } catch (error) {
            if (error.response) {
                alert("Failed to fetch port-op data: " + error.response.data.detail);
            } else {
                console.error("Unknown error:", error);
            }
        }
    }

    return (
        <div>
            <button onClick={getPortOp}>Fetch Port-Op Data</button>
        </div>
    );
};

export default PortOp;