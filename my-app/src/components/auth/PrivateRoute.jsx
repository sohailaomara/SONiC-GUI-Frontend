import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (token) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
