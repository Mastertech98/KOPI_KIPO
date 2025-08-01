import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

import "../styles/RegisterPage.scss";

function RegisterPage() {
    const navigate = useNavigate();
const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
});

const [errors, setErrors] = useState({});

const handleChange = (e) => {
    setFormData((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
    }));
};

const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) {
    newErrors.email = "Email is required";
    } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email.trim())
    ) {
    newErrors.email = "Invalid email address";
    }
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
    newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
    newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validate();
  setErrors(validationErrors);
  if (Object.keys(validationErrors).length === 0) {
    const registerUser = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: "user",
    };

    try {
      const response = await fetch("http://localhost:3001/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerUser),
      });

      if (!response.ok) {
        // Jika API mengembalikan error, misalnya 400/500
        const errorData = await response.json();
        alert("Registration failed: " + (errorData.message || "Unknown error"));
        return;
      }

      const data = await response.json();
      console.log("Register success response:", data);
      alert("Registration successful!");

      setFormData({ username: "", email: "", password: "", confirmPassword: "" });
      setErrors({});
      navigate('/login');
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  }
};

return (
    <div className="register-container">
    <h2>Create an Account</h2>
    <form className="register-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className={errors.username ? "error" : ""}
            autoComplete="username"
        />
        {errors.username && <small className="error-text">{errors.username}</small>}
        </div>

        <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "error" : ""}
            autoComplete="email"
        />
        {errors.email && <small className="error-text">{errors.email}</small>}
        </div>

        <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "error" : ""}
            autoComplete="new-password"
        />
        {errors.password && <small className="error-text">{errors.password}</small>}
        </div>

        <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? "error" : ""}
            autoComplete="new-password"
        />
        {errors.confirmPassword && (
            <small className="error-text">{errors.confirmPassword}</small>
        )}
        </div>
        <p>Have an account?
          <a href="/login">Login</a>
        </p>
        <button type="submit" className="btn-submit">Register</button>
    </form>
    </div>
  );
}

export default RegisterPage;
