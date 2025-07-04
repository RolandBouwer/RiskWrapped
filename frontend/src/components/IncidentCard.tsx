import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: var(--color-card-bg);
  border: 2px solid var(--color-card-border);
  border-radius: var(--radius);
  box-shadow: var(--color-shadow);
  padding: 2rem;
  margin: 1rem;
  color: var(--color-text);
  min-width: 260px;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  overflow: hidden;
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

const Description = styled.div`
  font-size: 1rem;
  color: var(--color-text);
  margin-bottom: 0.5rem;
`;

const RootCause = styled.div`
  font-size: 0.95rem;
  color: var(--color-secondary);
  margin-bottom: 0.5rem;
`;

const Loss = styled.div`
  font-size: 1.1rem;
  color: #f76f91;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

export type IncidentCardProps = {
  name: string;
  description: string;
  root_cause: string;
  loss_amount?: number | null;
  is_financial: boolean;
};

const IncidentCard: React.FC<IncidentCardProps> = ({ name, description, root_cause, loss_amount, is_financial }) => (
  <Card>
    <Title>{name}</Title>
    <Description>{description}</Description>
    <RootCause>Root Cause: {root_cause}</RootCause>
    {is_financial && loss_amount != null && (
      <Loss>Loss: ${loss_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Loss>
    )}
    {!is_financial && <Loss>Non-Financial Incident</Loss>}
  </Card>
);

export default IncidentCard; 