import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = [
  '#3a8dde', '#6f7bf7', '#a1c4fd', '#b2e0fe', '#e0e7ff', '#fff'
];

const data = [
  { name: 'Consumer', value: 400 },
  { name: 'Corporate', value: 300 },
  { name: 'Commercial', value: 200 },
  { name: 'Asset Mgmt', value: 100 },
];

const CostCenterChart: React.FC = () => (
  <div className="card" style={{ minWidth: 320, minHeight: 320 }}>
    <h3 className="card-title">Cost Center Breakdown</h3>
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          fill="#8884d8"
          paddingAngle={4}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default CostCenterChart; 