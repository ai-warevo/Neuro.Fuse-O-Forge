import React from 'react';
import { useStatsStore } from '../store/statsStore';

const StatsDashboard: React.FC = () => {
  const gpuLoad = useStatsStore(s => s.gpuLoad);
  const workersAvailable = useStatsStore(s => s.workersAvailable);

  return (
    <div className="bg-white shadow-md p-4 rounded">
      <h2 className="text-lg font-bold mb-2">Stats Dashboard</h2>
      <p><strong>GPU Load:</strong> {gpuLoad}%</p>
      <p><strong>Workers Available:</strong> {workersAvailable ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default StatsDashboard;