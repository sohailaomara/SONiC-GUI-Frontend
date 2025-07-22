import React from "react";
import api from "../../api";

const PostOp = () => {
    const getPostOp = async () => {
        try {
            const response = await api.get("/post_oper/po");
            console.log("Post-op data:", response.data);
        } catch (error) {
            if (error.response) {
                alert("Failed to fetch post-op data: " + error.response.data.detail);
            } else {
                console.error("Unknown error:", error);
            }
        }
    }

    return (
        <div>
            <button onClick={getPostOp}>Fetch Post-Op Data</button>
        </div>
    );
};

export default PostOp;