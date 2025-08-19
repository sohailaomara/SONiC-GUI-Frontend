import React, { useState } from "react";
import { AuthLayout } from "../components/auth/auth-layout";
import { Button } from "../components/auth/button";
import { Field, Label } from "../components/auth/fieldset";
import { Heading } from "../components/auth/heading";
import { Input } from "../components/auth/input";
import { Strong, Text, TextLink } from "../components/auth/text";
import Logo from "../assets/logo.png";

const Login_form = ({ handleLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    general: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
      general: "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(formData, setErrors);
  };

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit}
        method="POST"
        className="grid w-full max-w-sm grid-cols-1 gap-8"
      >
        <img src={Logo} alt="Logo" className="h-11" />
        <Heading>Sign in to your account</Heading>

        <Field>
          <Label>Username</Label>
          <Input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.username && (
            <span className="text-sm text-red-500">{errors.username}</span>
          )}
        </Field>

        <Field>
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && (
            <span className="text-sm text-red-500">{errors.password}</span>
          )}
        </Field>

        {errors.general && (
          <span className="text-sm text-red-500 -mt-4">{errors.general}</span>
        )}

        <Button
          type="submit"
          className="w-full bg-orange-500 text-white hover:bg-orange-600"
        >
          Login
        </Button>

        <Text>
          Don’t have an account?{" "}
          <TextLink asChild href="/register">
            <Strong>Register</Strong>
          </TextLink>
        </Text>
      </form>
    </AuthLayout>
  );
};

export default Login_form;

/*
          <CheckboxField>
            <Checkbox name="remember" />
            <Label>Remember me</Label>
          </CheckboxField>

<Text>
  <TextLink href="#">
     <Strong>Forgot password?</Strong>
  </TextLink>
</Text>*/
