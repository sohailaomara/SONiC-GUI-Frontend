import React from "react";

const logout_button = () => {
    const logout = async () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }

    return (
        <div>
            <button onClick={logout}>logout</button>
        </div>
    );
};

export default logout_button;