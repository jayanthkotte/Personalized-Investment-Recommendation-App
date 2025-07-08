import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import NavBar from "../components/NavBar";
import debounce from "lodash.debounce";

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
const Button = styled.button`
  background: ${({ theme }) => theme.accent};
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  margin-top: 10px;
  cursor: pointer;
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

function Investment() {
  const [type, setType] = useState("Stock");
  const [amount, setAmount] = useState("");
  const [expectedReturn, setExpectedReturn] = useState("");
  const [investments, setInvestments] = useState([]);
  const [msg, setMsg] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchError, setSearchError] = useState("");
  const searchRef = useRef();
  const [stockQuery, setStockQuery] = useState("");
  const [stockSuggestions, setStockSuggestions] = useState([]);
  const [showStockSuggestions, setShowStockSuggestions] = useState(false);
  const [mfQuery, setMfQuery] = useState("");
  const [mfSuggestions, setMfSuggestions] = useState([]);
  const [showMfSuggestions, setShowMfSuggestions] = useState(false);
  const [virtualBalance, setVirtualBalance] = useState(null);

  const fetchInvestments = async () => {
    const res = await axios.get("/api/investments", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    setInvestments(res.data);
  };

  const fetchOptions = async (t) => {
    const res = await axios.get(`/api/investment-options?type=${t}`);
    setOptions(res.data);
    setSelectedCompany("");
    setExpectedReturn("");
  };

  // Debounced stock search
  const fetchStockSuggestions = debounce(async (query) => {
    try {
      const res = await axios.get(`/api/stocks/search?query=${encodeURIComponent(query || '')}`);
      setStockSuggestions(res.data);
    } catch {
      setStockSuggestions([]);
    }
  }, 400);

  // Debounced mutual fund search
  const fetchMfSuggestions = debounce(async (query) => {
    try {
      const res = await axios.get(`/api/mutualfunds/search?query=${encodeURIComponent(query || '')}`);
      setMfSuggestions(res.data);
    } catch {
      setMfSuggestions([]);
    }
  }, 400);

  useEffect(() => {
    fetchInvestments();
    fetchOptions(type);
    // Fetch user profile for virtual balance
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get("/api/profile", { headers });
        setVirtualBalance(res.data.virtual_balance);
      } catch {
        setVirtualBalance(null);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    fetchOptions(type);
  }, [type]);

  useEffect(() => {
    if (type === "Stock") {
      fetchStockSuggestions(stockQuery);
    }
  }, [stockQuery, type]);

  useEffect(() => {
    if (type === "Mutual Fund") {
      fetchMfSuggestions(mfQuery);
    }
  }, [mfQuery, type]);

  const handleCompanyChange = (e) => {
    const val = e.target.value;
    setSelectedCompany(val);
    const opt = options.find(o => o.name === val);
    if (opt) setExpectedReturn(opt.expected_return !== undefined ? String(opt.expected_return) : "");
    else setExpectedReturn("");
  };

  // Show top stocks on focus if box is empty
  const handleStockInput = (e) => {
    setStockQuery(e.target.value);
    setShowStockSuggestions(true);
    setSelectedCompany("");
  };
  const handleStockFocus = () => {
    setShowStockSuggestions(true);
    if (!stockQuery) fetchStockSuggestions("");
  };
  const handleStockSelect = (stock) => {
    setSelectedCompany(stock.name);
    setStockQuery(stock.name);
    setShowStockSuggestions(false);
    if (stock.expected_return !== undefined && stock.expected_return !== null) {
      setExpectedReturn(String(stock.expected_return));
    }
  };

  const handleMfInput = (e) => {
    setMfQuery(e.target.value);
    setShowMfSuggestions(true);
    setSelectedCompany("");
  };
  const handleMfFocus = () => {
    setShowMfSuggestions(true);
    if (!mfQuery) fetchMfSuggestions("");
  };
  const handleMfSelect = (fund) => {
    setSelectedCompany(fund.name);
    setMfQuery(fund.name);
    setShowMfSuggestions(false);
    if (fund.expected_return !== undefined && fund.expected_return !== null) {
      setExpectedReturn(String(fund.expected_return));
    }
  };

  // Sort stock suggestions for best match
  const sortedStockSuggestions = stockSuggestions.slice().sort((a, b) => {
    const q = stockQuery.toLowerCase();
    const aMatch = (a.name || "").toLowerCase().includes(q) || (a.symbol || "").toLowerCase().includes(q);
    const bMatch = (b.name || "").toLowerCase().includes(q) || (b.symbol || "").toLowerCase().includes(q);
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0;
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    setMsg("");
    // Validate all fields
    if (!type || !selectedCompany || !amount || !expectedReturn) {
      setMsg("All fields are required.");
      return;
    }
    let cleanReturn = expectedReturn;
    if (typeof cleanReturn === "string") {
      cleanReturn = cleanReturn.replace("%", "").trim();
    }
    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0) {
      setMsg("Amount must be a positive number.");
      return;
    }
    if (virtualBalance !== null && amt > virtualBalance) {
      setMsg("Insufficient funds: amount exceeds your virtual balance.");
      return;
    }
    try {
      await axios.post("/api/investments", {
        type,
        company: selectedCompany,
        amount: amt,
        expected_return: Number(cleanReturn)
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setMsg("Investment added");
      setAmount("");
      setExpectedReturn("");
      setSelectedCompany("");
      fetchInvestments();
      // Update balance after investment
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get("/api/profile", { headers });
      setVirtualBalance(res.data.virtual_balance);
    } catch {
      setMsg("Failed to add investment");
    }
  };

  const handleSell = async (id) => {
    try {
      await axios.post(`/api/investments/${id}/sell`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setMsg("Investment sold");
      fetchInvestments();
    } catch {
      setMsg("Failed to sell investment");
    }
  };

  return (
    <>
      <NavBar />
      <Container>
        <Card>
          <h2>Virtual Investments</h2>
          <div style={{ marginBottom: 12 }}>Virtual Balance: ₹{virtualBalance !== null ? virtualBalance : '...'}</div>
          <form onSubmit={handleAdd} autoComplete="off">
            <select value={type} onChange={e => setType(e.target.value)} style={{ padding: 8, borderRadius: 4, border: '1px solid #fff', background: '#fff', color: '#000', marginRight: 16 }}>
              <option value="Stock">Stock</option>
              <option value="Mutual Fund">Mutual Fund</option>
            </select>
            {type === "Stock" ? (
              <div style={{ display: 'inline-block', position: 'relative', marginRight: 8 }}>
                <input
                  type="text"
                  placeholder="Search Stock"
                  value={stockQuery}
                  onChange={handleStockInput}
                  style={{ padding: 8, borderRadius: 4, border: '1px solid #fff', background: '#fff', color: '#000', minWidth: 180 }}
                  onFocus={handleStockFocus}
                  autoComplete="off"
                />
                {showStockSuggestions && sortedStockSuggestions.length > 0 && (
                  <div style={{ position: 'absolute', zIndex: 10, background: '#fff', color: '#000', border: '1px solid #ccc', borderRadius: 4, width: '100%' }}>
                    {sortedStockSuggestions.map((s, i) => (
                      <div key={s.symbol + i} style={{ padding: 8, cursor: 'pointer', borderBottom: '1px solid #eee' }} onClick={() => handleStockSelect(s)}>
                        <div><b>{s.name}</b> ({s.symbol}{s.exchange ? `, ${s.exchange}` : ''})</div>
                        <div style={{ fontSize: 12, color: '#555' }}>Expected Return: {s.expected_return !== undefined && s.expected_return !== null ? `${s.expected_return}%` : 'N/A'}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'inline-block', position: 'relative', marginRight: 8 }}>
                <input
                  type="text"
                  placeholder="Search Mutual Fund"
                  value={mfQuery}
                  onChange={handleMfInput}
                  style={{ padding: 8, borderRadius: 4, border: '1px solid #fff', background: '#fff', color: '#000', minWidth: 180 }}
                  onFocus={handleMfFocus}
                  autoComplete="off"
                />
                {showMfSuggestions && mfSuggestions.length > 0 && (
                  <div style={{ position: 'absolute', zIndex: 10, background: '#fff', color: '#000', border: '1px solid #ccc', borderRadius: 4, width: '100%' }}>
                    {mfSuggestions.map((f, i) => (
                      <div key={f.symbol + i} style={{ padding: 8, cursor: 'pointer', borderBottom: '1px solid #eee' }} onClick={() => handleMfSelect(f)}>
                        <div><b>{f.name}</b> ({f.symbol})</div>
                        <div style={{ fontSize: 12, color: '#555' }}>Expected Return: {f.expected_return !== undefined && f.expected_return !== null ? `${f.expected_return}%` : 'N/A'}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} style={{ marginRight: 8, padding: 8, borderRadius: 4, border: '1px solid #fff', background: '#fff', color: '#000', minWidth: 120 }} />
            <input type="text" placeholder="Expected Return %" value={expectedReturn} onChange={e => setExpectedReturn(e.target.value)} style={{ marginRight: 8, padding: 8, borderRadius: 4, border: '1px solid #fff', background: '#fff', color: '#000', minWidth: 120 }} />
            <Button type="submit">Add Investment</Button>
          </form>
          {msg && <div style={{ color: "#e53935", marginTop: 8 }}>{msg}</div>}
        </Card>
        <Card>
          <h3>Current Investments</h3>
          <Table>
            <thead>
              <tr>
                <Th>Type</Th>
                <Th>Company</Th>
                <Th>Amount</Th>
                <Th>Expected Return %</Th>
                <Th>Date Invested</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {investments.map(inv => (
                <tr key={inv._id}>
                  <Td>{inv.type}</Td>
                  <Td>{inv.company || "-"}</Td>
                  <Td>{inv.amount}</Td>
                  <Td>{inv.expected_return !== undefined ? inv.expected_return : "-"}</Td>
                  <Td>{formatDate(inv.date_invested)}</Td>
                  <Td><Button onClick={() => handleSell(inv._id)}>Sell</Button></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </Container>
    </>
  );
}

export default Investment; 