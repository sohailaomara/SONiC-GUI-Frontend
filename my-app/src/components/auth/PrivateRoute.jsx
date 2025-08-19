import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        // token expired
        localStorage.removeItem("token");
        return <Navigate to="/login" />;
      }
      return children;
    } catch (e) {
      localStorage.removeItem("token");
      return <Navigate to="/login" />;
    }
  }
  return <Navigate to="/login" />;
};


export default PrivateRoute;
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
