import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert } from "react-bootstrap";

function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const { name, email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
  
    if (!name || !email || !password) {
      return setError("All fields are required!");
    }
  
    try {
      const res = await fetch("http://localhost:4000/api/blogs/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.msg || "Register failed");
      }
  
      setSuccess("Register successful! Redirecting...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };
  
  
  return (
    <Container className="mt-5">
      <h2 className="text-center">Register</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit} className="p-4 shadow rounded bg-light">
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Sign Up
        </Button>
      </Form>
    </Container>
  );
}

export default Register;
