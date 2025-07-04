import React from 'react';
import styled, { keyframes } from 'styled-components';
import RiskCard from '../components/RiskCard';
import CostCenterChart from '../components/CostCenterChart';
import TrendChart from '../components/TrendChart';
import AIInsightCard from '../components/AIInsightCard';

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
  background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 60%, #fff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  text-align: center;
  margin-bottom: 0.2rem;
  letter-spacing: -2px;
  text-shadow: 0 4px 32px rgba(30, 64, 175, 0.18);
  animation: ${fadeSlide} 1s cubic-bezier(0.4,0,0.2,1);
`;

const SubTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  text-align: center;
  margin-bottom: 1.1rem;
  margin-top: 0.2rem;
  letter-spacing: -1px;
  animation: ${fadeSlide} 1.2s cubic-bezier(0.4,0,0.2,1);
`;

const Dashboard: React.FC = () => {
  return (
    <div style={{ padding: '2rem', minHeight: '100vh' }}>
      <MainTitle>Risk Wrapped</MainTitle>
      <SubTitle>Your 2024 Risk Management Story</SubTitle>
      <Grid>
        <RiskCard title="Third Party Risk" score={87} type="Vendor" trend="up" />
        <RiskCard title="Change Risk" score={72} type="System" trend="down" />
        <RiskCard title="Incident" score={65} type="Security" trend="flat" />
        <CostCenterChart />
        <TrendChart />
        <AIInsightCard />
      </Grid>
    </div>
  );
};

export default Dashboard; 