import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';

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
  min-width: 320px;
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid var(--color-card-border);
  box-sizing: border-box;
  @media (max-width: 500px) {
    padding: 1.2rem 0.5rem;
    min-width: unset;
    max-width: 98vw;
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

const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  margin-bottom: 1.2rem;
  border-radius: 0.8rem;
  border: 1.5px solid var(--color-card-border);
  background: rgba(255,255,255,0.08);
  color: var(--color-text);
  font-size: 1.1rem;
  outline: none;
  transition: border 0.2s;
  box-sizing: border-box;
  &:focus {
    border: 2px solid var(--color-primary);
    background: rgba(255,255,255,0.15);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  border-radius: 0.8rem;
  border: none;
  background: var(--color-bg-gradient);
  color: var(--color-accent);
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 0.5rem;
  box-shadow: 0 2px 16px 0 rgba(58,141,222,0.12);
  transition: background 0.2s, transform 0.2s;
  &:hover {
    background: var(--color-bg-gradient-white);
    color: var(--color-text-dark);
    transform: translateY(-2px) scale(1.01);
  }
`;

const ErrorMsg = styled.div`
  color: #f76f91;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(username, password);
      localStorage.setItem('token', data.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError('Invalid username or password');
    }
  };

  return (
    <Wrapper>
      <Card>
        <Title>Sign in to Risk Wrapped</Title>
        <form style={{ width: '100%' }} onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <ErrorMsg>{error}</ErrorMsg>}
          <Button type="submit">Login</Button>
        </form>
      </Card>
    </Wrapper>
  );
};

export default Login; 