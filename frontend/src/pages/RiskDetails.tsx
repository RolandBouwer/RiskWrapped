import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRisk } from '../api';

type Risk = {
  id: number;
  title: string;
  description: string;
  status: string;
  risk_type: string;
};

const RiskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [risk, setRisk] = useState<Risk | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getRisk(Number(id)).then(data => {
        setRisk(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!risk) return <div>Risk not found.</div>;

  return (
    <div>
      <h2>{risk.title}</h2>
      <p><strong>Description:</strong> {risk.description}</p>
      <p><strong>Status:</strong> {risk.status}</p>
      <p><strong>Type:</strong> {risk.risk_type}</p>
    </div>
  );
};

export default RiskDetails; 