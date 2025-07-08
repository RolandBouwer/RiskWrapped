import React, { useEffect, useState } from 'react';
// @ts-expect-error: No types for react-tree-graph
import Tree from 'react-tree-graph';
import 'react-tree-graph/dist/style.css';
import '../App.css';

interface NodeTreeData {
  name: string;
  id: number;
  children?: NodeTreeData[];
}

interface InsightData {
  scope: string;
  risk_insight?: string;
  incident_insight?: string;
  action_insight?: string;
  insight?: string;
}

const fetchNodeTree = async (): Promise<NodeTreeData> => {
  // TODO: Replace with real API call to /nodes/tree
  // Placeholder data
  return {
    name: 'Root',
    id: 1,
    children: [
      { name: 'Division A', id: 2, children: [
        { name: 'BU 1', id: 3 },
        { name: 'BU 2', id: 4 }
      ] },
      { name: 'Division B', id: 5, children: [
        { name: 'BU 3', id: 6 }
      ] }
    ]
  };
};

const fetchInsights = async (nodeId?: number): Promise<InsightData> => {
  const url = nodeId ? `/insights?node_id=${nodeId}` : '/insights';
  const res = await fetch(url);
  const data = await res.json();
  return data[0];
};

const NodeTree: React.FC = () => {
  const [treeData, setTreeData] = useState<NodeTreeData | null>(null);
  const [selectedNode, setSelectedNode] = useState<NodeTreeData | null>(null);
  const [insight, setInsight] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchNodeTree()
      .then(data => {
        setTreeData(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load node tree.');
        setLoading(false);
      });
  }, []);

  const handleNodeClick = (nodeId: number, node: NodeTreeData) => {
    setSelectedNode(node);
    setInsight(null);
    setLoading(true);
    fetchInsights(nodeId)
      .then(data => {
        setInsight(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load insights.');
        setLoading(false);
      });
  };

  return (
    <div className="node-tree-page">
      <h1>Node Tree</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ minWidth: 400 }}>
          {treeData && (
            <Tree
              data={treeData}
              height={400}
              width={400}
              animated
              svgProps={{ className: 'custom-tree' }}
              gProps={{
                onClick: (event: React.MouseEvent<SVGGElement>, node: NodeTreeData) => handleNodeClick(node.id, node),
                className: 'tree-node',
                style: { cursor: 'pointer' }
              }}
              nodeProps={{ r: 12 }}
            />
          )}
        </div>
        <div style={{ flex: 1 }}>
          {selectedNode && (
            <div>
              <h2>Insights for: {selectedNode.name}</h2>
              {insight ? (
                <div className="insight-card">
                  {insight.risk_insight && <p><strong>Risk Insight:</strong> {insight.risk_insight}</p>}
                  {insight.incident_insight && <p><strong>Incident Insight:</strong> {insight.incident_insight}</p>}
                  {insight.action_insight && <p><strong>Action Insight:</strong> {insight.action_insight}</p>}
                  {insight.insight && <p>{insight.insight}</p>}
                  <p><em>Scope: {insight.scope}</em></p>
                </div>
              ) : (
                <div>Loading insights...</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NodeTree; 