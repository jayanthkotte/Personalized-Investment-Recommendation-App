import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Container = styled.div`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const Input = styled.input`
  background: #fff;
  color: #000;
  border: 1px solid #ccc;
  padding: 10px;
  margin: 8px 0;
  border-radius: 4px;
`;
const Button = styled.button`
  background: ${({ theme }) => theme.accent};
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  margin-top: 10px;
  cursor: pointer;
`;
const Error = styled.div`
  color: ${({ theme }) => theme.accent};
  margin-bottom: 10px;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 300px;
`;

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // Username validation: must not start with a number and not be all numbers
    if (/^\d/.test(name)) {
      setError("Username must not start with a number.");
      return;
    }
    if (/^\d+$/.test(name)) {
      setError("Username cannot be all numbers.");
      return;
    }
    // Email validation: must not start with a number and not be all numbers
    if (/^\d/.test(email)) {
      setError("Invalid Email address. Please add a valid Email address");
      return;
    }
    if (/^\d+$/.test(email)) {
      setError("Invalid Email address. Please add a valid Email address");
      return;
    }
    // Email format validation
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Invalid Email address. Please add a valid Email address");
      return;
    }
    // Email should only contain letters, numbers, @ and .
    if (!/^[a-zA-Z0-9@.]+$/.test(email)) {
      setError("Invalid Email address. Please add a valid Email address");
      return;
    }
    // Before @, only letters and numbers allowed
    const emailParts = email.split('@');
    if (emailParts.length !== 2 || !/^[a-zA-Z0-9]+$/.test(emailParts[0])) {
      setError("Invalid Email address. Please add a valid Email address");
      return;
    }
    // Password match validation
    if (password !== rePassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await axios.post("/api/register", { name, email, password });
      navigate("/risk-profile");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <Container>
      <h2>Register</h2>
      {error && <Error>{error}</Error>}
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Re-enter Password"
          value={rePassword}
          onChange={e => setRePassword(e.target.value)}
          required
        />
        <Button type="submit">Register</Button>
      </Form>
      <p style={{ color: "#000", marginTop: 16 }}>
        Already have an account? <Link to="/login" style={{ color: "#1976d2" }}>Login here</Link>
      </p>
    </Container>
  );
}

export default Register; 