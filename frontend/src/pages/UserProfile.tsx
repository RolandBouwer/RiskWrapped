import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getCurrentUser } from '../api';

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-gradient);
`;

const Card = styled.div`
  background: var(--color-card-bg);
  border-radius: var(--radius);
  box-shadow: var(--color-shadow);
  padding: 2.5rem 2rem;
  min-width: 340px;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid var(--color-card-border);
  animation: fadeInProfile 0.8s cubic-bezier(0.4,0,0.2,1);
  @keyframes fadeInProfile {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: none; }
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  background: var(--color-bg-gradient);
  -webkit-background-clip: text;
  color: transparent;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Info = styled.div`
  width: 100%;
  margin-bottom: 1.2rem;
  background: rgba(255,255,255,0.08);
  border-radius: 0.8rem;
  padding: 1rem 1.2rem;
  color: var(--color-text);
  font-size: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const Label = styled.span`
  color: var(--color-secondary);
  font-size: 0.95rem;
  font-weight: 600;
`;

const Value = styled.span`
  color: var(--color-accent);
  font-size: 1.15rem;
  font-weight: 700;
`;

const ErrorMsg = styled.div`
  color: #f76f91;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setError('Failed to load user profile.'));
  }, []);

  return (
    <Wrapper>
      <Card>
        <Title>My Profile</Title>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        {user && (
          <>
            <Info>
              <Label>Username</Label>
              <Value>{user.username}</Value>
            </Info>
            <Info>
              <Label>Email</Label>
              <Value>{user.email}</Value>
            </Info>
            <Info>
              <Label>Role</Label>
              <Value>{user.role}</Value>
            </Info>
            {user.node && (
              <Info>
                <Label>Org Node</Label>
                <Value>{user.node.name}</Value>
              </Info>
            )}
          </>
        )}
      </Card>
    </Wrapper>
  );
};

export default UserProfile; 