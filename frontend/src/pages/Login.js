import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Container = styled.div`
  background: ${({ theme }) => theme.background};
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ theme }) => theme.gradientPrimary};
    opacity: 0.05;
    z-index: 0;
  }
`;

const LoginCard = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: ${({ theme }) => theme.radiusXl};
  padding: ${({ theme }) => theme.spacing.xxl};
  box-shadow: ${({ theme }) => theme.shadowXl};
  width: 100%;
  max-width: 400px;
  position: relative;
  z-index: 1;
  border: 1px solid ${({ theme }) => theme.cardBorder};
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  .logo-icon {
    width: 60px;
    height: 60px;
    background: ${({ theme }) => theme.gradientPrimary};
    border-radius: ${({ theme }) => theme.radiusLg};
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto ${({ theme }) => theme.spacing.md};
    color: white;
    font-weight: bold;
    font-size: 24px;
  }
  
  .logo-text {
    font-size: 28px;
    font-weight: 700;
    color: ${({ theme }) => theme.textPrimary};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
  
  .logo-subtitle {
    color: ${({ theme }) => theme.textSecondary};
    font-size: 14px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.cardBorder};
  border-radius: ${({ theme }) => theme.radiusMd};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 16px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}20;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.textTertiary};
  }
`;

const Button = styled.button`
  background: ${({ theme }) => theme.gradientPrimary};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radiusMd};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: ${({ theme }) => theme.spacing.md};
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadowLg};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const Error = styled.div`
  background: ${({ theme }) => theme.dangerLight};
  color: ${({ theme }) => theme.danger};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radiusMd};
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme.danger}30;
`;

const LinkText = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
  
  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: ${({ theme }) => theme.spacing.lg} 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.cardBorder};
  }
  
  span {
    padding: 0 ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.textTertiary};
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const res = await axios.post("/api/login", { email, password });
      localStorage.setItem("token", res.data.token);
      
      if (res.data.risk_profile_completed) {
        navigate("/dashboard");
      } else {
        navigate("/risk-profile");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LoginCard>
        <Logo>
          <div className="logo-icon">₹</div>
          <div className="logo-text">InvestSmart</div>
          <div className="logo-subtitle">Your Personal Investment Advisor</div>
        </Logo>
        
        {error && <Error>{error}</Error>}
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </InputGroup>
          
          <InputGroup>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </InputGroup>
          
          <Button type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </Form>
        
        <Divider>
          <span>or</span>
        </Divider>
        
        <LinkText>
          Don't have an account? <Link to="/register">Create Account</Link>
        </LinkText>
      </LoginCard>
    </Container>
  );
}

export default Login; 