import { useEffect } from 'react';
import { useForgeStore, useStatsStore } from '@/store';

export const useWebSocket = (taskId: string) => {
  const setTaskStatus = useForgeStore((state) => state.actions.setTaskStatus);
  const setTaskResult = useForgeStore((state) => state.actions.setTaskResult);
  const addLog = useForgeStore((state) => state.actions.addLog);
  const setGpuLoad = useStatsStore((state) => state.actions.setGpuLoad);
  const setWorkersAvailable = useStatsStore((state) => state.actions.setWorkersAvailable);

  useEffect(() => {
    if (!taskId) return;

    const host = process.env.NEXT_PUBLIC_API_URL?.replace('http://', '').replace('https://', '')
    const socket = new WebSocket(`ws://${host}/ws/task/${taskId}`);

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      console.info(event);
      const data = JSON.parse(event.data);
      setTaskResult(data)

      if (data.type === 'taskStatus') {
        setTaskStatus(data.status);
      } else if (data.type === 'log') {
        addLog(data.message);
      } else if (data.type === 'gpuLoad') {
        setGpuLoad(data.load);
      } else if (data.type === 'workersAvailable') {
        setWorkersAvailable(data.available);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      socket.close();
    };
  }, [taskId, setTaskStatus, addLog, setGpuLoad, setWorkersAvailable]);
};
