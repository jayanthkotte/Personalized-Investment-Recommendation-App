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
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding: 12px;
  text-align: center;
`;
const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  text-align: center;
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
          <input type="file" accept=".csv" onChange={handleFile} />
          <Button onClick={handleUpload}>Upload</Button>
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