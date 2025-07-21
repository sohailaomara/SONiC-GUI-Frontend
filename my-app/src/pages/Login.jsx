import React from "react";
import api from "../api";
import LoginForm from "./Login_form";

const Login = () => {
  const handleLogin = async (credentials, setErrors) => {
    try {
      const response = await api.post("/auth/login", credentials);
        console.log("User logged in successfully:", response.data);
        //todo: redirect to homepage (token storage, etc.)
    } catch (error) {
      if (error.response && Array.isArray(error.response.data.detail)) {
        const newErrors = { username: "", password: "", general: "" };

        error.response.data.detail.forEach((err) => {
          const field = err.loc?.[1];
          if (field && newErrors[field] !== undefined) {
            newErrors[field] = err.msg;
          }
        });

        setErrors(newErrors);
      } else if (error.response && typeof error.response.data.detail === "string") {
        setErrors({ username: "", password: "", general: error.response.data.detail });
      } else {
        setErrors({ username: "", password: "", general: "Login failed. Try again." });
      }
    }
  };

  return <LoginForm handleLogin={handleLogin} />;
};

export default Login;
