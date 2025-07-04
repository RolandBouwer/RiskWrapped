import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { name: 'Jan', risk: 40 },
  { name: 'Feb', risk: 60 },
  { name: 'Mar', risk: 55 },
  { name: 'Apr', risk: 70 },
  { name: 'May', risk: 65 },
  { name: 'Jun', risk: 80 },
];

const TrendChart: React.FC = () => (
  <div className="card" style={{ minWidth: 320, minHeight: 320 }}>
    <h3 className="card-title">Risk Trend</h3>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3a8dde" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#6f7bf7" stopOpacity={0.2}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="name" stroke="#fff" />
        <YAxis stroke="#fff" />
        <CartesianGrid strokeDasharray="3 3" stroke="#2a3657" />
        <Tooltip />
        <Line type="monotone" dataKey="risk" stroke="url(#colorRisk)" strokeWidth={3} dot={{ r: 5, fill: '#fff' }} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default TrendChart; 