import React from "react";
import api from "../api";
import RegisterForm from "./Register_form";

const Auth = () => {
  const handleSignUp = async (userData, setErrors) => {
  try {
    const response = await api.post("/auth/signup", userData);
    console.log("User signed up successfully:", response.data);
    //todo: redirect to homepage (token storage, etc.)
  } catch (error) {
    if (error.response && Array.isArray(error.response.data.detail)) {
      const newErrors = { username: "", email: "", password: "" };

      error.response.data.detail.forEach((err) => {
        const field = err.loc?.[1]; 
        if (field && newErrors[field] !== undefined) {
          newErrors[field] = err.msg;
        }
      });

      setErrors(newErrors); 
    } else {
      alert("Signup failed or the user already exists. Please try again.");
    }
  }
};

  return (
    <div>
      <h2>Sign Up</h2>
      <RegisterForm handleSignUp={handleSignUp} />
    </div>
  );
};

export default Auth;
