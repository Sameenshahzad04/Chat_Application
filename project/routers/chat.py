from fastapi import APIRouter, WebSocket, Query, Depends
from utils.websocket_manager import manager
from utils.security import verify_token
from database.connection import SessionLocal,get_db
from handlers.chat_handler import handle_chat_message, handle_user_join, handle_user_leave
import json
from typing import List
from models.chat_msg import ChatMessage
from sqlalchemy.orm import Session
from handlers.chat_handler import get_chat_history, search_users,get_username_by_id
from schemas.chat_schema import MessageOut

r = APIRouter()

@r.websocket("/ws")
async def chat_websocket(
    websocket: WebSocket,
    token: str = Query(..., description="JWT token for authentication")
):
    payload = verify_token(token)
    
    if not payload:
        await websocket.close(code=4001, reason="Invalid token")
        return
    
    user_id = payload.get("id")
    username = payload.get("username")
    
    await manager.connect(websocket, user_id)
    
    await manager.send_personal_message({
        "type": "connected",
        "user_id": user_id,
        "message": "Welcome to chat!"
    }, user_id)
    
    await handle_user_join(user_id, username)
    
    try:
        while True:
            data = await websocket.receive_text()
            
            # Parse JSON (expecting {receiver_id, content})
            message_data = json.loads(data)
            receiver_id = message_data.get("receiver_id")
            content = message_data.get("content")
            
            if not receiver_id or not content:
                continue
            
            # Create database session
            db = SessionLocal()
            
            # Handle message (save + send)
            await handle_chat_message(user_id, username, content, receiver_id, db)
            
            db.close()
            
    except Exception as e:
        # Handle disconnect
        db = SessionLocal()
        await handle_user_leave(user_id, username)
        db.close()
        manager.disconnect(user_id)

#seacrch user
@r.get("/users/search", response_model=List[dict])
def search_users_route(
    q: str = Query(..., min_length=1, description="Search query"),
    current_user_id: int = Query(...),
    db: Session = Depends(get_db)
):
  
    users = search_users(db, current_user_id, q)
    return [{"id": u.id, "username": u.username, "email": u.email} for u in users]

@r.get("/history/{other_user_id}", response_model=List[MessageOut])
def get_chat_history_route(
    other_user_id: int,
    current_user_id: int = Query(...),
    db: Session = Depends(get_db)
):
    
    messages = get_chat_history(db, current_user_id, other_user_id)
    
    result = []
    for msg in messages:


        result.append({
            "id": msg.id,
            "sender_name": get_username_by_id(db, msg.sender_id),
            "receiver_name": get_username_by_id(db, msg.receiver_id),
            "content": msg.content,
            "timestamp": msg.created_at.strftime("%Y-%m-%d %H:%M:%S")
        })
    
    return result

#Get list of currently online users
@r.get("/online-users")
def get_online_users(current_user_id: int = Query(...)):
   
    online = manager.get_active_users()
    # Remove self from list
    online = [uid for uid in online if uid != current_user_id]
    return {"online_users": online}