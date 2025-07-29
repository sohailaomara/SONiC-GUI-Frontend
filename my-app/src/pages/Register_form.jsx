import React, { useState } from 'react';
import { AuthLayout } from '../components/auth/auth-layout';
import { Button } from '../components/auth/button';
import { Checkbox, CheckboxField } from '../components/auth/checkbox';
import { Field, Label } from '../components/auth/fieldset';
import { Heading } from '../components/auth/heading';
import { Input } from '../components/auth/input';
import { Select } from '../components/auth/select';
import { Strong, Text, TextLink } from '../components/auth/text';
import Logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

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
    handleSignUp(formData,setErrors);
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
          />
        </Field>

        <Field>
          <Label>Username</Label>
          <Input
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
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
          />
          {errors.password && (
        <span className="text-s text-red-500 mt-1">{errors.password}</span>
        )}
        </Field>
        

        <Button type="submit" className="w-full bg-orange-500 text-white hover:bg-orange-600">
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
