import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Alert, Container } from "react-bootstrap";
import Api from "../Api";
import "../login/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await Api.post("/blogs/auth/login", { email, password });
      console.log("useris",res);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("UserID", res?.data?.user?.id);
      navigate("/bloglist");
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid email or password!");
    }
  };

  return (
    <div className="login-page-container">
      <Container className="login-box-container" >
        <div className="login-page-left">
          
        </div>

        <div className="login-page-right">
          <div className="login-page-box">
            <h2 className="text-center">LOGIN</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button type="submit" className="login-page-button w-100 mt-2">
                Log In
              </Button>

              <div className="text-center mt-3">
                Don't have an account?{" "}
                <Link to="/signup" className="login-page-signup-link">
                  Signup
                </Link>
              </div>
            </Form>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Login;
