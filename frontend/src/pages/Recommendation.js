import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";

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
const Button = styled.button`
  background: ${({ theme }) => theme.gradientPrimary};
  color: #fff;
  border: none;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radiusMd};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: ${({ theme }) => theme.spacing.md};
  &:hover {
    box-shadow: ${({ theme }) => theme.shadowMd};
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
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
const StyledInput = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.cardBorder};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.textPrimary};
  min-width: 80px;
  margin-right: 16px;
  font-size: 15px;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}30;
  }
`;

function Recommendation() {
  const [recs, setRecs] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [rtcRecs, setRtcRecs] = useState(null);
  const [rtcMsg, setRtcMsg] = useState("");
  const [rtcLoading, setRtcLoading] = useState(false);
  const [tenure, setTenure] = useState("");
  const [capital, setCapital] = useState("");
  const [profile, setProfile] = useState(null);
  const [behavior, setBehavior] = useState(null);
  const [prereqMsg, setPrereqMsg] = useState("");
  const [prereq, setPrereq] = useState({ risk: false, behavior: false });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrereqs = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const profileRes = await axios.get("/api/profile", { headers });
        setProfile(profileRes.data);
        let riskOk = profileRes.data.risk_profile_completed && profileRes.data.risk_level && profileRes.data.investment_goal;
        let behaviorOk = false;
        try {
          const txRes = await axios.get("/api/transactions", { headers });
          setBehavior(txRes.data.behavior);
          behaviorOk = txRes.data.behavior && txRes.data.behavior.toLowerCase() !== 'unknown';
        } catch {
          behaviorOk = false;
        }
        setPrereq({ risk: riskOk, behavior: behaviorOk });
        if (!riskOk && !behaviorOk) setPrereqMsg("Please complete your risk profile and upload your bank statement before getting recommendations.");
        else if (!riskOk) setPrereqMsg("Please complete your risk profile before getting recommendations.");
        else if (!behaviorOk) setPrereqMsg("Please upload your bank statement before getting recommendations.");
        else setPrereqMsg("");
      } catch {
        setPrereqMsg("Failed to load user profile. Please log in again.");
      }
    };
    fetchPrereqs();
  }, []);

  const handleGetRecommendations = async () => {
    setMsg("");
    setRecs(null);
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setMsg("You are not logged in. Please log in again.");
      setLoading(false);
      setTimeout(() => navigate("/login"), 1500);
      return;
    }
    try {
      const res = await axios.post("/api/recommend", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecs(res.data.suggestions);
    } catch (e) {
      if (e.response && (e.response.status === 401 || (e.response.data && (e.response.data.msg || e.response.data.error) && String(e.response.data.msg || e.response.data.error).toLowerCase().includes("segment")))) {
        setMsg("Session expired or invalid. Please log in again.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMsg(e.response?.data?.error || e.response?.data?.msg || "Failed to get recommendations");
      }
    }
    setLoading(false);
  };

  const handleGetRtcRecommendations = async () => {
    setRtcMsg("");
    setRtcRecs(null);
    const t = parseInt(tenure);
    const c = parseInt(capital);
    if (isNaN(t) || t < 1 || t > 10) {
      setRtcMsg("Tenure must be between 1 and 10");
      return;
    }
    if (isNaN(c) || c < 1000 || c > 100000) {
      setRtcMsg("Capital must be between 1000 and 100000");
      return;
    }
    setRtcLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setRtcMsg("You are not logged in. Please log in again.");
      setTimeout(() => navigate("/login"), 1500);
      setRtcLoading(false);
      return;
    }
    try {
      const res = await axios.post("/api/recommend-rtc", { tenure: t, capital: c }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRtcRecs(res.data.suggestions);
    } catch (e) {
      if (e.response && (e.response.status === 401 || (e.response.data && (e.response.data.msg || e.response.data.error) && String(e.response.data.msg || e.response.data.error).toLowerCase().includes("segment")))) {
        setRtcMsg("Session expired or invalid. Please log in again.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setRtcMsg(e.response?.data?.error || e.response?.data?.msg || "Failed to get recommendations");
      }
    }
    setRtcLoading(false);
  };

  return (
    <>
      <NavBar />
      <Container>
        {prereqMsg && (
          <Card style={{ background: '#fff3cd', color: '#856404', border: '1px solid #ffeeba' }}>
            <b>{prereqMsg}</b>
            <div style={{ marginTop: 8 }}>
              {!prereq.risk && <Button onClick={() => navigate('/risk-profile')}>Go to Risk Profile</Button>}
              {!prereq.behavior && <Button onClick={() => navigate('/bank-upload')}>Go to Bank Upload</Button>}
            </div>
          </Card>
        )}
        <Card>
          <h2>Recommendation using Financial Behavior, Risk Profile, and Goal</h2>
          <Button onClick={handleGetRecommendations} disabled={loading || !prereq.risk || !prereq.behavior}>
            {loading ? "Loading..." : "Get Recommendations"}
          </Button>
          {msg && <div style={{ color: "#e53935", marginTop: 8 }}>{msg}</div>}
          {recs && recs.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <Table>
                <thead>
                  <tr>
                    <Th>Name</Th>
                    <Th>Type</Th>
                    <Th>Risk</Th>
                    <Th>Expected Return</Th>
                  </tr>
                </thead>
                <tbody>
                  {recs.map((r, i) => (
                    <tr key={i}>
                      <Td>{r.name}</Td>
                      <Td>{r.type}</Td>
                      <Td>{r.risk}</Td>
                      <Td>{r.expected_return}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card>
        <Card>
          <h2>Recommendation using Risk, Tenure, and Capital</h2>
          <div style={{ marginBottom: 12 }}>
            <label>Tenure (1-10): </label>
            <StyledInput type="number" min="1" max="10" value={tenure} onChange={e => setTenure(e.target.value)} />
            <label>Capital (1000-100000): </label>
            <StyledInput type="number" min="1000" max="100000" value={capital} onChange={e => setCapital(e.target.value)} />
          </div>
          <Button onClick={handleGetRtcRecommendations} disabled={rtcLoading || !prereq.risk || !prereq.behavior}>
            {rtcLoading ? "Loading..." : "Get Recommendations"}
          </Button>
          {rtcMsg && <div style={{ color: "#e53935", marginTop: 8 }}>{rtcMsg}</div>}
          {rtcRecs && rtcRecs.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <Table>
                <thead>
                  <tr>
                    <Th>Name</Th>
                    <Th>Type</Th>
                    <Th>Risk</Th>
                    <Th>Expected Return</Th>
                  </tr>
                </thead>
                <tbody>
                  {rtcRecs.map((r, i) => (
                    <tr key={i}>
                      <Td>{r.name}</Td>
                      <Td>{r.type}</Td>
                      <Td>{r.risk}</Td>
                      <Td>{r.expected_return}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card>
      </Container>
    </>
  );
}

export default Recommendation; 