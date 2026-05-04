import React from 'react';
import { useForgeStore } from '../store/forgeStore';

const ForgeTerminal: React.FC = () => {
  const logs = useForgeStore(s => s.logs);

  return (
    <div className="bg-black text-white p-4 rounded">
      <h2 className="text-lg font-bold mb-2">Forge Terminal</h2>
      <ul className="space-y-1">
        {logs.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
    </div>
  );
};

export default ForgeTerminal;