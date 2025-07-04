import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: linear-gradient(120deg, #1e3a8a 80%, #3b82f6 100%);
  border-radius: var(--radius);
  box-shadow: var(--color-shadow);
  padding: 2rem;
  margin: 1rem;
  color: var(--color-text-dark);
  min-width: 260px;
  max-width: 420px;
  position: relative;
  overflow: hidden;
  animation: fadeInCard 0.7s cubic-bezier(0.4,0,0.2,1);
  @keyframes fadeInCard {
    from { opacity: 0; transform: translateY(30px) scale(0.98); }
    to { opacity: 1; transform: none; }
  }
`;

const Title = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  background: linear-gradient(90deg, #fff 0%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  margin-bottom: 0.5rem;
`;

const Insight = styled.div`
  font-size: 1.1rem;
  color: var(--color-text-dark);
  margin-top: 1rem;
  font-style: italic;
`;

const AIInsightCard: React.FC = () => (
  <Card>
    <Title>AI-Powered Insight</Title>
    <Insight>
      "Your top risk this quarter is related to third-party vendors. Consider reviewing contracts and increasing monitoring for high-value suppliers."
    </Insight>
  </Card>
);

export default AIInsightCard; 