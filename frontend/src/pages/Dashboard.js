import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import NavBar from "../components/NavBar";

const Container = styled.div`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  min-height: 100vh;
  padding: 32px;
`;
const Card = styled.div`
  background: ${({ theme }) => theme.card};
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
`;
const Table = styled.table`
  width: 100%;
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  border-radius: 8px;
  border-collapse: collapse;
`;
const Th = styled.th`
  border-bottom: 1px solid #fff;
  padding: 12px;
  text-align: center;
`;
const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #fff;
  text-align: center;
`;

function formatDate(date) {
  if (!date) return "-";
  try {
    const d = typeof date === 'string' ? new Date(date.replace(/Z?$/, 'Z')) : new Date(date);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString();
  } catch {
    return "-";
  }
}

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const [profileRes, invRes] = await Promise.all([
        axios.get("/api/profile", { headers }),
        axios.get("/api/investments", { headers })
      ]);
      setProfile(profileRes.data);
      setInvestments(invRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <><NavBar /><Container>Loading...</Container></>;
  if (!profile) return <><NavBar /><Container>Error loading profile.</Container></>;

  const invested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const returns = investments.reduce((sum, inv) => sum + inv.amount * (inv.expected_return/100), 0);

  return (
    <>
      <NavBar />
      <Container>
        <Card>
          <h2>Dashboard</h2>
          <div>Welcome, {profile.name}</div>
          <div>Virtual Balance: ₹{profile.virtual_balance}</div>
          <div>Invested Amount: ₹{invested}</div>
          <div>Returns: ₹{returns}</div>
        </Card>
        <Card>
          <h3>Portfolio</h3>
          <Table>
            <thead>
              <tr>
                <Th>Type</Th>
                <Th>Amount</Th>
                <Th>Expected Return %</Th>
                <Th>Date Invested</Th>
              </tr>
            </thead>
            <tbody>
              {investments.map(inv => (
                <tr key={inv._id}>
                  <Td>{inv.type}</Td>
                  <Td>₹{inv.amount}</Td>
                  <Td>{inv.expected_return}</Td>
                  <Td>{formatDate(inv.date_invested)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </Container>
    </>
  );
}

export default Dashboard; 