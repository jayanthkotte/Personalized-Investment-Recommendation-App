import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import NavBar from "../components/NavBar";

const Container = styled.div`
  background: ${({ theme }) => theme.background};
  color: black;
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
  color: ${({ theme }) => theme.textPrimary};
  border-radius: ${({ theme }) => theme.radiusMd};
  border-collapse: collapse;
`;
const Th = styled.th`
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
  padding: 12px;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
  background: ${({ theme }) => theme.backgroundTertiary};
`;
const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
  text-align: center;
  color: ${({ theme }) => theme.textPrimary};
`;
const StyledFileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  display: inline-block;
  background: ${({ theme }) => theme.gradientPrimary};
  color: #fff;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radiusMd};
  font-weight: 600;
  cursor: pointer;
  margin-right: ${({ theme }) => theme.spacing.md};
  transition: all 0.2s;
  &:hover {
    box-shadow: ${({ theme }) => theme.shadowMd};
    transform: translateY(-1px);
  }
`;

const Button = styled.button`
  background: ${({ theme }) => theme.gradientPrimary};
  color: #fff;
  border: none;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radiusMd};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  &:hover {
    box-shadow: ${({ theme }) => theme.shadowMd};
    transform: translateY(-1px);
  }
`;

function BankUpload() {
  const [file, setFile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [behavior, setBehavior] = useState(null);
  const [msg, setMsg] = useState("");

  const fetchTransactions = async () => {
    try {
      const txRes = await axios.get("/api/transactions", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setTransactions(txRes.data.transactions || txRes.data); // support both array and {transactions, behavior}
      setBehavior(txRes.data.behavior || null);
    } catch {
      setMsg("Failed to fetch transactions");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("/api/transactions/upload", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data"
        }
      });
      setMsg(res.data.msg);
      setBehavior(res.data.financial_behavior_label || res.data.financial_behavior_score || null);
      fetchTransactions();
    } catch (err) {
      setMsg("Upload failed");
    }
  };

  return (
    <>
      <NavBar />
      <Container>
        <Card>
          <h2>Bank Data Upload / Sync</h2>
          <FileLabel htmlFor="file-upload">Choose File</FileLabel>
          <StyledFileInput id="file-upload" type="file" accept=".csv" onChange={handleFile} />
          <Button onClick={handleUpload} disabled={!file}>Upload</Button>
          {msg && <div style={{ color: "#e53935", marginTop: 8 }}>{msg}</div>}
          {behavior && <div>User Financial Behavior: <b>{behavior}</b></div>}
        </Card>
        {transactions.length > 0 && (
          <Card>
            <h3>Transactions</h3>
            <Table>
              <thead>
                <tr>
                  <Th>Date</Th>
                  <Th>Amount</Th>
                  <Th>Description</Th>
                  <Th>Type</Th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx._id}>
                    <Td>{tx.date}</Td>
                    <Td>{tx.amount}</Td>
                    <Td>{tx.description}</Td>
                    <Td>{tx.type}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        )}
      </Container>
    </>
  );
}

export default BankUpload; 