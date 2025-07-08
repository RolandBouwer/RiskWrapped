import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';
import RiskDetails from './pages/RiskDetails';
import NodeTree from './pages/NodeTree';
import './index.css';
import { FaUserCircle, FaChevronDown, FaSignOutAlt, FaLifeRing } from 'react-icons/fa';

const isAuthenticated = () => !!localStorage.getItem('token');

const PrivateRoute = ({ component }: { component: React.ReactElement }) => {
  return isAuthenticated() ? component : <Navigate to="/login" />;
};

const AvatarMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setOpen(false);
    navigate('/login');
  };

  return (
    <div ref={ref} style={{ position: 'relative', marginLeft: 'auto' }}>
      <button
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--color-accent)',
          fontSize: '1.7rem',
          padding: 0,
        }}
        onClick={() => setOpen((v) => !v)}
        aria-label="User menu"
      >
        {FaUserCircle({ style: { fontSize: '2.1rem' } })}
        {FaChevronDown({ style: { fontSize: '1.1rem' } })}
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '2.7rem',
            background: 'var(--color-card-bg)',
            border: '2px solid var(--color-card-border)',
            borderRadius: '1rem',
            boxShadow: 'var(--color-shadow)',
            minWidth: 160,
            zIndex: 100,
            padding: '0.5rem 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.2rem',
          }}
        >
          <Link
            to="/profile"
            style={{
              color: 'var(--color-accent)',
              textDecoration: 'none',
              padding: '0.7rem 1.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.7rem',
              fontWeight: 600,
              fontSize: '1.08rem',
            }}
            onClick={() => setOpen(false)}
          >
            {FaUserCircle({})} Profile
          </Link>
          <a
            href="mailto:support@riskwrapped.com"
            style={{
              color: 'var(--color-accent)',
              textDecoration: 'none',
              padding: '0.7rem 1.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.7rem',
              fontWeight: 600,
              fontSize: '1.08rem',
            }}
            onClick={() => setOpen(false)}
          >
            {FaLifeRing({})} Support
          </a>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-accent)',
              textAlign: 'left',
              width: '100%',
              padding: '0.7rem 1.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.7rem',
              fontWeight: 600,
              fontSize: '1.08rem',
              cursor: 'pointer',
            }}
            onClick={handleLogout}
          >
            {FaSignOutAlt({})} Logout
          </button>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div className="gradient-bg" style={{ minHeight: '100vh', fontFamily: 'Poppins, Inter, Arial, sans-serif' }}>
      <Router>
        <nav style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem 2rem', alignItems: 'center', background: 'rgba(16,23,42,0.7)', borderRadius: '0 0 2rem 2rem', boxShadow: '0 2px 16px 0 rgba(58,141,222,0.08)', marginBottom: '2rem', position: 'relative' }}>
          <span style={{ fontWeight: 900, fontSize: '1.5rem', background: 'var(--color-bg-gradient)', WebkitBackgroundClip: 'text', color: 'transparent', letterSpacing: '-1px' }}>Risk Wrapped</span>
          <Link to="/dashboard" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}>Dashboard</Link>
          <Link to="/nodetree" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}>Node Tree</Link>
          <div style={{ marginLeft: 'auto' }} />
          <AvatarMenu />
        </nav>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute component={<Dashboard />} />} />
          <Route path="/profile" element={<PrivateRoute component={<UserProfile />} />} />
          <Route path="/nodetree" element={<PrivateRoute component={<NodeTree />} />} />
          <Route path="/risks/:id" element={<PrivateRoute component={<RiskDetails />} />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
