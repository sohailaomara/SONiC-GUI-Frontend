import { useState } from "react";
import { AuthLayout } from "../components/auth/auth-layout";
import { Button } from "../components/auth/button";
import { Field, Label } from "../components/auth/fieldset";
import { Heading } from "../components/auth/heading";
import { Input } from "../components/auth/input";
import { Strong, Text, TextLink } from "../components/auth/text";
import Logo from "../assets/logo.png";

const Register = ({ handleSignUp }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignUp(formData, setErrors);
  };

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit}
        method="POST"
        className="grid w-full max-w-sm grid-cols-1 gap-8"
      >
        <img src={Logo} alt="Logo" className="h-11" />
        <Heading>Create your account</Heading>

        <Field>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="block w-full rounded-lg border border-gray-300 bg-white
            px-3 py-2 text-gray-900 placeholder-gray-400
            focus:border-orange-500 focus:ring-2 focus:ring-orange-500
            shadow-sm"
          />
        </Field>

        <Field>
          <Label>Username</Label>
          <Input
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="block w-full rounded-lg border border-gray-300 bg-white
            px-3 py-2 text-gray-900 placeholder-gray-400
            focus:border-orange-500 focus:ring-2 focus:ring-orange-500
            shadow-sm"
          />
          {errors.username && (
            <span className="text-s text-red-500 mt-1">{errors.username}</span>
          )}
        </Field>

        <Field>
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
            className="block w-full rounded-lg border border-gray-300 bg-white
            px-3 py-2 text-gray-900 placeholder-gray-400
            focus:border-orange-500 focus:ring-2 focus:ring-orange-500
            shadow-sm"
          />
          {errors.password && (
            <span className="text-s text-red-500 mt-1">{errors.password}</span>
          )}
        </Field>

        <Button
          type="submit"
          className="w-full bg-orange-500 text-white hover:bg-orange-600"
        >
          Create account
        </Button>

        <Text>
          Already have an account?{" "}
          <TextLink asChild href="/login">
            <Strong>Sign in</Strong>
          </TextLink>
        </Text>
      </form>
    </AuthLayout>
  );
};

export default Register;
