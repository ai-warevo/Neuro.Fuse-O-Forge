import React from 'react';
import { useForgeStore } from '../store/forgeStore';

const ControlPanel: React.FC = () => {
  const taskId = useForgeStore(s => s.taskId);
  const setTaskId = useForgeStore(s => s.actions.setTaskId);

  return (
    <div className="bg-white shadow-md p-4 rounded">
      <h2 className="text-lg font-bold mb-2">Control Panel</h2>
      <input
        type="text"
        value={taskId}
        onChange={(e) => setTaskId(e.target.value)}
        placeholder="Enter Task ID"
        className="border border-gray-300 p-2 rounded"
      />
    </div>
  );
};

export default ControlPanel;