import React from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

const Bar = styled.div`
  width: 100%;
  background: #fff;
  padding: 16px 0;
  display: flex;
  justify-content: center;
  gap: 32px;
  border-bottom: 1px solid #ccc;
`;
const NavButton = styled(Link)`
  color: #fff;
  background: ${({ theme }) => theme.accent};
  padding: 8px 20px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: background 0.2s, color 0.2s, border 0.2s;
  border: 2px solid ${({ theme }) => theme.accent};
  &:hover {
    background: #fff;
    color: ${({ theme }) => theme.accent};
    border: 2px solid ${({ theme }) => theme.accent};
  }
`;

function NavBar() {
  const navigate = useNavigate();
  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <Bar>
      <NavButton to="/dashboard">Dashboard</NavButton>
      <NavButton to="/bank-upload">Bank Upload</NavButton>
      <NavButton to="/investment">Investment</NavButton>
      <NavButton to="/recommendation">Recommendation</NavButton>
      <NavButton to="/tips">Tips</NavButton>
      <NavButton to="/profile">Profile</NavButton>
      <button onClick={handleSignOut} style={{
        color: '#fff',
        background: '#e53935',
        padding: '8px 20px',
        borderRadius: 4,
        border: '2px solid #e53935',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginLeft: 16
      }}>Sign Out</button>
    </Bar>
  );
}

export default NavBar; 