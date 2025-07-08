import React from 'react';
import styled, { keyframes } from 'styled-components';
import CostCenterChart from '../components/CostCenterChart';
import TrendChart from '../components/TrendChart';
import AIInsightCard from '../components/AIInsightCard';
import { getCurrentUser, getIncidents, getRisks, getActions, getAIInsights } from '../api';
import { useEffect, useState } from 'react';

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
  const [incidents, setIncidents] = useState<any[]>([]);
  const [risks, setRisks] = useState<any[]>([]);
  const [actions, setActions] = useState<any[]>([]);
  const [aiInsights, setAIInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const userData = await getCurrentUser();
        // Fetch incidents, risks, actions filtered by user's node or user id
        const [incidentsData, risksData, actionsData, aiData] = await Promise.all([
          getIncidents({ node_id: userData.node_id }),
          getRisks(), // TODO: Add node_id filter when backend supports it
          getActions({ assigned_to: userData.id }),
          getAIInsights({ node_id: userData.node_id })
        ]);
        setIncidents(incidentsData);
        setRisks(risksData);
        setActions(actionsData);
        setAIInsights(aiData);
      } catch (err: any) {
        setError('Failed to load dashboard data.');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div style={{ color: '#f76f91', fontWeight: 600 }}>{error}</div>;

  return (
    <div style={{ padding: '2rem', minHeight: '100vh' }}>
      <MainTitle>Risk Wrapped</MainTitle>
      <SubTitle>Your 2024 Risk Management Story</SubTitle>
      <Grid>
        {/* Incidents count card */}
        <div className="card" style={{ minWidth: 260, maxWidth: 340 }}>
          <div style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: 8 }}>Incidents</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-accent)' }}>{incidents.length}</div>
        </div>
        {/* Risks count card */}
        <div className="card" style={{ minWidth: 260, maxWidth: 340 }}>
          <div style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: 8 }}>Risks</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-accent)' }}>{risks.length}</div>
        </div>
        {/* Actions count card */}
        <div className="card" style={{ minWidth: 260, maxWidth: 340 }}>
          <div style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: 8 }}>Actions</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-accent)' }}>{actions.length}</div>
        </div>
        {/* AI Insights card */}
        <div className="card" style={{ minWidth: 320, maxWidth: 420 }}>
          <div style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: 8 }}>AI Insights</div>
          <div style={{ fontSize: '1.1rem', color: 'var(--color-text)' }}>
            {Array.isArray(aiInsights) && aiInsights.length > 0
              ? aiInsights.map((insight: any, idx: number) => (
                  <div key={idx} style={{ marginBottom: 8 }}>{insight.insight || JSON.stringify(insight)}</div>
                ))
              : 'No insights available.'}
          </div>
        </div>
        {/* Other charts/cards */}
        <CostCenterChart />
        <TrendChart />
        <AIInsightCard />
      </Grid>
    </div>
  );
};

export default Dashboard; 