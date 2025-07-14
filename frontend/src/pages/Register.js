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

const RegisterCard = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: ${({ theme }) => theme.radiusXl};
  padding: ${({ theme }) => theme.spacing.xxl};
  box-shadow: ${({ theme }) => theme.shadowXl};
  width: 100%;
  max-width: 450px;
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
  
  &.error {
    border-color: ${({ theme }) => theme.danger};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.danger}20;
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

const PasswordStrength = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  
  .strength-bar {
    height: 4px;
    background: ${({ theme }) => theme.backgroundTertiary};
    border-radius: 2px;
    margin-top: 4px;
    overflow: hidden;
    
    .strength-fill {
      height: 100%;
      transition: all 0.3s ease;
      border-radius: 2px;
      
      &.weak {
        background: ${({ theme }) => theme.danger};
        width: 33%;
      }
      
      &.medium {
        background: ${({ theme }) => theme.warning};
        width: 66%;
      }
      
      &.strong {
        background: ${({ theme }) => theme.success};
        width: 100%;
      }
    }
  }
`;

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    if (password.length < 6) return 'weak';
    if (password.length < 8) return 'medium';
    return 'strong';
  };

  const passwordStrength = validatePassword(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    // Username validation: must not start with a number and not be all numbers
    if (/^\d/.test(name)) {
      setError("Username must not start with a number.");
      setLoading(false);
      return;
    }
    if (/^\d+$/.test(name)) {
      setError("Username cannot be all numbers.");
      setLoading(false);
      return;
    }
    
    // Email validation: must not start with a number and not be all numbers
    if (/^\d/.test(email)) {
      setError("Invalid Email address. Please add a valid Email address");
      setLoading(false);
      return;
    }
    if (/^\d+$/.test(email)) {
      setError("Invalid Email address. Please add a valid Email address");
      setLoading(false);
      return;
    }
    
    // Email format validation
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Invalid Email address. Please add a valid Email address");
      setLoading(false);
      return;
    }
    
    // Email should only contain letters, numbers, @ and .
    if (!/^[a-zA-Z0-9@.]+$/.test(email)) {
      setError("Invalid Email address. Please add a valid Email address");
      setLoading(false);
      return;
    }
    
    // Before @, only letters and numbers allowed
    const emailParts = email.split('@');
    if (emailParts.length !== 2 || !/^[a-zA-Z0-9]+$/.test(emailParts[0])) {
      setError("Invalid Email address. Please add a valid Email address");
      setLoading(false);
      return;
    }
    
    // Password match validation
    if (password !== rePassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    
    try {
      await axios.post("/api/register", { name, email, password });
      navigate("/risk-profile");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <RegisterCard>
        <Logo>
          <div className="logo-icon">₹</div>
          <div className="logo-text">InvestSmart</div>
          <div className="logo-subtitle">Join thousands of smart investors</div>
        </Logo>
        
        {error && <Error>{error}</Error>}
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </InputGroup>
          
          <InputGroup>
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </InputGroup>
          
          <InputGroup>
            <Input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {password && (
              <PasswordStrength>
                Password strength: {passwordStrength}
                <div className="strength-bar">
                  <div className={`strength-fill ${passwordStrength}`}></div>
                </div>
              </PasswordStrength>
            )}
          </InputGroup>
          
          <InputGroup>
            <Input
              type="password"
              placeholder="Confirm your password"
              value={rePassword}
              onChange={e => setRePassword(e.target.value)}
              className={rePassword && password !== rePassword ? 'error' : ''}
              required
            />
          </InputGroup>
          
          <Button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </Form>
        
        <Divider>
          <span>or</span>
        </Divider>
        
        <LinkText>
          Already have an account? <Link to="/login">Sign In</Link>
        </LinkText>
      </RegisterCard>
    </Container>
  );
}

export default Register; 