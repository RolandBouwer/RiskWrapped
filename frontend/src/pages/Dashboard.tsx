import React from 'react';
import styled, { keyframes } from 'styled-components';
import RiskCard from '../components/RiskCard';
import CostCenterChart from '../components/CostCenterChart';
import TrendChart from '../components/TrendChart';
import AIInsightCard from '../components/AIInsightCard';
import IncidentCard from '../components/IncidentCard';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  animation: fadeInGrid 0.8s cubic-bezier(0.4,0,0.2,1);
  @keyframes fadeInGrid {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: none; }
  }
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }
`;

const fadeSlide = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: none;
  }
`;

const MainTitle = styled.h1`
  font-size: 3.2rem;
  font-weight: 900;
  background: linear-gradient(90deg, #fff 0%, #60a5fa 60%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  text-align: center;
  margin-bottom: 0.2rem;
  letter-spacing: -2px;
  text-shadow: 0 4px 32px rgba(30, 64, 175, 0.18), 0 1px 0 #fff;
  animation: ${fadeSlide} 1s cubic-bezier(0.4,0,0.2,1);
`;

const SubTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, #fff 0%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  text-align: center;
  margin-bottom: 1.1rem;
  margin-top: 0.2rem;
  letter-spacing: -1px;
  text-shadow: 0 2px 12px rgba(30, 64, 175, 0.18), 0 1px 0 #fff;
  animation: ${fadeSlide} 1.2s cubic-bezier(0.4,0,0.2,1);
`;

const Dashboard: React.FC = () => {
  // Sample data for demonstration
  const sampleIncidents = [
    {
      name: 'System Outage',
      description: 'System Outage occurred in Business Unit A, Consumer & Community Banking, Kenya.',
      root_cause: 'System Failure',
      loss_amount: 25000.0,
      is_financial: true,
    },
    {
      name: 'Compliance Violation',
      description: 'Compliance Violation occurred in Business Unit B, Corporate & Investment Bank, Nigeria.',
      root_cause: 'Regulatory Change',
      loss_amount: null,
      is_financial: false,
    },
  ];
  const sampleActions = [
    { description: 'Review vendor contracts', status: 'open' },
    { description: 'Update incident response plan', status: 'pending' },
  ];
  return (
    <div style={{ padding: '2rem', minHeight: '100vh' }}>
      <MainTitle>Risk Wrapped</MainTitle>
      <SubTitle>Your 2024 Risk Management Story</SubTitle>
      <Grid>
        {/* Top row: Incidents */}
        {sampleIncidents.map((incident, idx) => (
          <IncidentCard key={idx} {...incident} />
        ))}
        {/* Risks */}
        <RiskCard title="Third Party Risk" score={87} type="Vendor" trend="up" />
        <RiskCard title="Change Risk" score={72} type="System" trend="down" />
        <RiskCard title="Incident" score={65} type="Security" trend="flat" />
        {/* Actions (as cards) */}
        {sampleActions.map((action, idx) => (
          <div className="card" key={idx} style={{ minWidth: 260, maxWidth: 340 }}>
            <div style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: 8 }}>Action</div>
            <div style={{ fontSize: '1.1rem', color: 'var(--color-text)' }}>{action.description}</div>
            <div style={{ fontSize: '0.95rem', color: 'var(--color-secondary)', marginTop: 6 }}>Status: {action.status}</div>
          </div>
        ))}
        {/* Other charts/cards */}
        <CostCenterChart />
        <TrendChart />
        <AIInsightCard />
      </Grid>
    </div>
  );
};

export default Dashboard; 