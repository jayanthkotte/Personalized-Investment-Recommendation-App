import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import NavBar from "../components/NavBar";

const Container = styled.div`
  background: ${({ theme }) => theme.backgroundSecondary};
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  h1 {
    color: ${({ theme }) => theme.textPrimary};
    font-size: 28px;
    font-weight: 700;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
  
  p {
    color: ${({ theme }) => theme.textSecondary};
    font-size: 16px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: ${({ theme }) => theme.radiusLg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadowMd};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadowLg};
  }
  
  .stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  .stat-title {
    color: ${({ theme }) => theme.textSecondary};
    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    border-radius: ${({ theme }) => theme.radiusMd};
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ theme, variant }) => {
      switch(variant) {
        case 'balance': return theme.gradientPrimary;
        case 'invested': return theme.gradientSecondary;
        case 'returns': return theme.success;
        case 'portfolio': return theme.info;
        default: return theme.gradientPrimary;
      }
    }};
    color: white;
    font-weight: bold;
  }
  
  .stat-value {
    font-size: 32px;
    font-weight: 700;
    color: ${({ theme }) => theme.textPrimary};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
  
  .stat-change {
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    
    &.positive {
      color: ${({ theme }) => theme.success};
    }
    
    &.negative {
      color: ${({ theme }) => theme.danger};
    }
    
    &.neutral {
      color: ${({ theme }) => theme.textSecondary};
    }
  }
`;

const PortfolioSection = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: ${({ theme }) => theme.radiusLg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadowMd};
  border: 1px solid ${({ theme }) => theme.cardBorder};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  h2 {
    color: ${({ theme }) => theme.textPrimary};
    font-size: 20px;
    font-weight: 600;
  }
  
  .portfolio-summary {
    display: flex;
    gap: ${({ theme }) => theme.spacing.lg};
    
    .summary-item {
      text-align: center;
      
      .label {
        color: ${({ theme }) => theme.textSecondary};
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: ${({ theme }) => theme.spacing.xs};
      }
      
      .value {
        color: ${({ theme }) => theme.textPrimary};
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.textPrimary};
`;
const Th = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.textSecondary};
  font-weight: 500;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
  background: ${({ theme }) => theme.backgroundTertiary};
`;
const Td = styled.td`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
  color: ${({ theme }) => theme.textPrimary};
`;

const LoadingCard = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: ${({ theme }) => theme.radiusLg};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
  box-shadow: ${({ theme }) => theme.shadowMd};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.textSecondary};
  
  .empty-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto ${({ theme }) => theme.spacing.lg};
    background: ${({ theme }) => theme.backgroundTertiary};
    border-radius: ${({ theme }) => theme.radiusLg};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }
`;

// Icons
const Icons = {
  balance: () => (
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
    </svg>
  ),
  invested: () => (
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
    </svg>
  ),
  returns: () => (
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/>
    </svg>
  ),
  portfolio: () => (
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/>
      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/>
    </svg>
  )
};

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function formatDate(date) {
  if (!date) return "-";
  try {
    const d = typeof date === 'string' ? new Date(date.replace(/Z?$/, 'Z')) : new Date(date);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString('en-IN');
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
      
      try {
        const [profileRes, invRes] = await Promise.all([
          axios.get("/api/profile", { headers }),
          axios.get("/api/investments", { headers })
        ]);
        setProfile(profileRes.data);
        setInvestments(invRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <NavBar />
        <Container>
          <Content>
            <LoadingCard>Loading your portfolio...</LoadingCard>
          </Content>
        </Container>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <NavBar />
        <Container>
          <Content>
            <LoadingCard>Error loading profile.</LoadingCard>
          </Content>
        </Container>
      </>
    );
  }

  const invested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const returns = investments.reduce((sum, inv) => sum + inv.amount * (inv.expected_return/100), 0);
  const totalValue = profile.virtual_balance + invested + returns;

  return (
    <>
      <NavBar />
      <Container>
        <Content>
          <Header>
            <h1>Welcome back, {profile.name}! 👋</h1>
            <p>Here's your investment portfolio overview</p>
          </Header>

          <StatsGrid>
            <StatCard variant="balance">
              <div className="stat-header">
                <span className="stat-title">Total Balance</span>
                <div className="stat-icon">
                  <Icons.balance />
                </div>
              </div>
              <div className="stat-value">{formatCurrency(totalValue)}</div>
              <div className="stat-change positive">
                <span>+{formatCurrency(returns)}</span>
                <span>•</span>
                <span>This month</span>
              </div>
            </StatCard>

            <StatCard variant="invested">
              <div className="stat-header">
                <span className="stat-title">Invested Amount</span>
                <div className="stat-icon">
                  <Icons.invested />
                </div>
              </div>
              <div className="stat-value">{formatCurrency(invested)}</div>
              <div className="stat-change neutral">
                <span>{investments.length} investments</span>
              </div>
            </StatCard>

            <StatCard variant="returns">
              <div className="stat-header">
                <span className="stat-title">Total Returns</span>
                <div className="stat-icon">
                  <Icons.returns />
                </div>
              </div>
              <div className="stat-value">{formatCurrency(returns)}</div>
              <div className="stat-change positive">
                <span>+{invested > 0 ? ((returns / invested) * 100).toFixed(1) : 0}%</span>
                <span>•</span>
                <span>ROI</span>
              </div>
            </StatCard>

            <StatCard variant="portfolio">
              <div className="stat-header">
                <span className="stat-title">Available Balance</span>
                <div className="stat-icon">
                  <Icons.portfolio />
                </div>
              </div>
              <div className="stat-value">{formatCurrency(profile.virtual_balance)}</div>
              <div className="stat-change neutral">
                <span>Ready to invest</span>
              </div>
            </StatCard>
          </StatsGrid>

          <PortfolioSection>
            <SectionHeader>
              <h2>Your Portfolio</h2>
              <div className="portfolio-summary">
                <div className="summary-item">
                  <div className="label">Total Investments</div>
                  <div className="value">{investments.length}</div>
                </div>
                <div className="summary-item">
                  <div className="label">Avg. Return</div>
                  <div className="value">
                    {investments.length > 0 
                      ? (investments.reduce((sum, inv) => sum + inv.expected_return, 0) / investments.length).toFixed(1)
                      : 0}%
                  </div>
                </div>
              </div>
            </SectionHeader>

            {investments.length === 0 ? (
              <EmptyState>
                <div className="empty-icon">📈</div>
                <h3>No investments yet</h3>
                <p>Start building your portfolio by making your first investment</p>
              </EmptyState>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <Th>Investment</Th>
                    <Th>Type</Th>
                    <Th>Amount</Th>
                    <Th>Expected Return</Th>
                    <Th>Date Invested</Th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map(inv => (
                    <tr key={inv._id}>
                      <Td>
                        <div className="investment-type">
                          <span className={`type-badge ${inv.type.toLowerCase().replace(' ', '-')}`}>
                            {inv.type}
                          </span>
                          <span>{inv.company || 'N/A'}</span>
                        </div>
                      </Td>
                      <Td>{inv.type}</Td>
                      <Td className="amount">{formatCurrency(inv.amount)}</Td>
                      <Td className={`return ${inv.expected_return >= 0 ? 'positive' : 'negative'}`}>
                        {inv.expected_return}%
                      </Td>
                      <Td>{formatDate(inv.date_invested)}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </PortfolioSection>
        </Content>
      </Container>
    </>
  );
}

export default Dashboard; 