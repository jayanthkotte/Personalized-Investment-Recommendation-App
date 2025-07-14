import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

const questions = [
  { q: "How would you describe your investment knowledge?", options: [
    { text: "None", score: 1 },
    { text: "Basic", score: 2 },
    { text: "Intermediate", score: 3 },
    { text: "Advanced", score: 4 }
  ]},
  { q: "What is your investment horizon?", options: [
    { text: "<1 year", score: 1 },
    { text: "1-3 years", score: 2 },
    { text: "3-5 years", score: 3 },
    { text: ">5 years", score: 4 }
  ]},
  { q: "How do you react to market volatility?", options: [
    { text: "Very anxious", score: 1 },
    { text: "Somewhat concerned", score: 2 },
    { text: "Neutral", score: 3 },
    { text: "Confident", score: 4 }
  ]},
  { q: "What is your primary investment goal?", options: [
    { text: "Preserve capital", score: 1 },
    { text: "Steady income", score: 2 },
    { text: "Growth", score: 3 },
    { text: "Aggressive growth", score: 4 }
  ]},
  { q: "How much of your income can you invest?", options: [
    { text: "<10%", score: 1 },
    { text: "10-20%", score: 2 },
    { text: "20-40%", score: 3 },
    { text: ">40%", score: 4 }
  ]},
  { q: "How would you react to a 20% loss?", options: [
    { text: "Sell everything", score: 1 },
    { text: "Sell some", score: 2 },
    { text: "Hold", score: 3 },
    { text: "Buy more", score: 4 }
  ]},
  { q: "What is your age group?", options: [
    { text: ">60", score: 1 },
    { text: "45-60", score: 2 },
    { text: "30-44", score: 3 },
    { text: "<30", score: 4 }
  ]}
];

const Container = styled.div`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const Card = styled.div`
  background: ${({ theme }) => theme.card};
  padding: 32px;
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
const Heading = styled.h2`
  color: #6EC1E4;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;
const Error = styled.div`
  color: #6EC1E4;
  margin-bottom: 10px;
`;
const QuestionText = styled.div`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
`;

function RiskProfile() {
  const [answers, setAnswers] = useState(Array(7).fill(null));
  const [goal, setGoal] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (qIdx, score) => {
    const newAns = [...answers];
    newAns[qIdx] = score;
    setAnswers(newAns);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (answers.some(a => a === null) || !goal) {
      setError("Please answer all questions and enter your investment goal.");
      return;
    }
    const total = answers.reduce((a, b) => a + b, 0);
    let risk_level = "Low";
    if (total >= 22) risk_level = "High";
    else if (total >= 15) risk_level = "Medium";
    try {
      await axios.post("/api/risk-profile", {
        risk_score: total,
        risk_level,
        investment_goal: goal
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to save risk profile");
    }
  };

  return (
    <>
      <NavBar />
      <Container>
        <Card>
          <Heading>Risk Profiling Questionnaire</Heading>
          {error && <Error>{error}</Error>}
          <form onSubmit={handleSubmit}>
            {questions.map((q, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <QuestionText>{i + 1}. {q.q}</QuestionText>
                {q.options.map((opt, j) => (
                  <label key={j} style={{ marginRight: 16, color: '#000' }}>
                    <input
                      type="radio"
                      name={`q${i}`}
                      value={opt.score}
                      checked={answers[i] === opt.score}
                      onChange={() => handleChange(i, opt.score)}
                    /> {opt.text}
                  </label>
                ))}
              </div>
            ))}
            <div style={{ marginBottom: 16 }}>
              <select
                value={goal}
                onChange={e => setGoal(e.target.value)}
                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', background: '#fff', color: '#000', width: 250 }}
                required
              >
                <option value="">Select Investment Goal</option>
                <option value="Retirement">Retirement</option>
                <option value="Education">Education</option>
                <option value="Emergency">Emergency</option>
                <option value="Family">Family</option>
                <option value="Wealth Creation">Wealth Creation</option>
              </select>
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </Card>
      </Container>
    </>
  );
}

export default RiskProfile; 