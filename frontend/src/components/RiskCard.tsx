import React from 'react';
import styled from 'styled-components';
import { FaArrowUp, FaArrowDown, FaEquals } from 'react-icons/fa';

const Card = styled.div`
  background: var(--color-card-bg);
  border: 2px solid var(--color-card-border);
  border-radius: var(--radius);
  box-shadow: var(--color-shadow);
  padding: 2rem;
  margin: 1rem;
  transition: box-shadow var(--transition), transform var(--transition);
  color: var(--color-text);
  position: relative;
  overflow: hidden;
  min-width: 260px;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  animation: fadeInCard 0.7s cubic-bezier(0.4,0,0.2,1);
  @keyframes fadeInCard {
    from { opacity: 0; transform: translateY(30px) scale(0.98); }
    to { opacity: 1; transform: none; }
  }
`;

const Title = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
`;

const Metric = styled.div`
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--color-accent);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.div`
  font-size: 1rem;
  color: var(--color-secondary);
  margin-bottom: 1rem;
`;

const Trend = styled.div<{ trend: 'up' | 'down' | 'flat' }>`
  color: ${({ trend }) =>
    trend === 'up' ? '#3a8dde' : trend === 'down' ? '#f76f91' : '#fff'};
  font-size: 1.5rem;
  margin-left: 0.5rem;
  display: inline-flex;
  align-items: center;
`;

export type RiskCardProps = {
  title: string;
  score: number;
  type: string;
  trend: 'up' | 'down' | 'flat';
};

const RiskCard: React.FC<RiskCardProps> = ({ title, score, type, trend }) => {
  let TrendIcon = null;
  if (trend === 'up') TrendIcon = FaArrowUp({});
  else if (trend === 'down') TrendIcon = FaArrowDown({});
  else if (trend === 'flat') TrendIcon = FaEquals({});

  return (
    <Card className="card">
      <div className="white-accent" />
      <Title>{title}</Title>
      <Metric>{score}</Metric>
      <Subtitle>{type}</Subtitle>
      <Trend trend={trend}>{TrendIcon}</Trend>
    </Card>
  );
};

export default RiskCard; 