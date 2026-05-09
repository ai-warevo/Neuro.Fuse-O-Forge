from typing import Dict, List, Any
import asyncio
from fastapi.websockets import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, task_id: str, websocket: WebSocket):
        await websocket.accept()
        if task_id not in self.active_connections:
            self.active_connections[task_id] = []
        self.active_connections[task_id].append(websocket)

    async def disconnect(self, task_id: str, websocket: WebSocket):
        if task_id in self.active_connections:
            self.active_connections[task_id].remove(websocket)
            try:
                await websocket.close()
            except Exception:
                pass 
            if not self.active_connections[task_id]:
                del self.active_connections[task_id]

    async def disconnect_by_task(self, task_id: str):
        for connection in self.active_connections[task_id]:
          await self.disconnect(task_id, connection)

    async def broadcast(self, task_id: str, message: Any):
        if task_id in self.active_connections:
            for connection in self.active_connections[task_id]:
                await connection.send_json(message)

websocket_manager = ConnectionManager()