from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from backend.api.services.websocket_manager import websocket_manager

router = APIRouter()

@router.websocket("/ws/task/{task_id}")
async def websocket_endpoint(websocket: WebSocket, task_id: str):
    await websocket_manager.connect(task_id, websocket)
    try:
        while True:
            data = await websocket.receive_text() 
            print(f"Клиент прислал: {data}")
    except WebSocketDisconnect:
        await websocket_manager.disconnect(task_id, websocket)