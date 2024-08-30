from typing import List
from fastapi import APIRouter, HTTPException, Depends, Request
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from .auth import AuthJWT
import os
from dotenv import load_dotenv
import logging
from .models import Comment
from .schemas import CommentCreate, Comment

load_dotenv()

logging.basicConfig(level=logging.INFO)

router = APIRouter()

# MongoDB connection
client = AsyncIOMotorClient(os.getenv("MONGODB_URI"))
db = client.crm_database  # Replace with your database name

@router.post("/tasks/{task_id}/comments", response_model=Comment)
async def create_comment(task_id: str, comment: CommentCreate, request: Request):
    current_user = request.state.user
    if not current_user:
        raise HTTPException(status_code=401, detail="User not authenticated")

    logging.info(f"Received comment data: {comment}")

    new_comment = Comment(
        id=str(ObjectId()),
        content=comment.content,
        author=comment.author,
        date=comment.date,
        task_id=task_id,
        replies=comment.replies
    )

    await db.comments.insert_one(new_comment.dict())
    return new_comment

@router.get("/tasks/{task_id}/comments", response_model=List[Comment])
async def get_comments(task_id: str, request: Request):
    current_user = request.state.user
    if not current_user:
        raise HTTPException(status_code=401, detail="User not authenticated")
    comments = await db.comments.find({"task_id": task_id}).to_list(1000)
    return comments

@router.post("/comments/{id}/reply", response_model=Comment)
async def reply_to_comment(id: str, reply: CommentCreate, request: Request):
    current_user = request.state.user
    if not current_user:
        raise HTTPException(status_code=401, detail="User not authenticated")

    logging.info(f"Received reply data: {reply}")

    new_reply = Comment(
        id=str(ObjectId()),
        content=reply.content,
        author=reply.author,
        date=reply.date,
        task_id=reply.task_id,
        replies=reply.replies
    )

    comment = await db.comments.find_one({"id": id})
    if not comment:
        logging.error(f"Comment with ID {id} not found")
        raise HTTPException(status_code=404, detail="Comment not found")

    logging.info(f"Found comment: {comment}")

    comment['replies'].append(new_reply.dict())
    await db.comments.update_one({"id": id}, {"$set": {"replies": comment['replies']}})

    updated_comment = await db.comments.find_one({"id": id})
    return Comment(**updated_comment)

@router.delete("/comments/{id}")
async def delete_comment(id: str, request: Request):
    current_user = request.state.user
    if not current_user:
        raise HTTPException(status_code=401, detail="User not authenticated")

    logging.info(f"Deleting comment with ID: {id}")

    result = await db.comments.delete_one({"id": id})
    if result.deleted_count == 0:
        logging.error(f"Comment with ID {id} not found")
        raise HTTPException(status_code=404, detail="Comment not found")

    return {"detail": "Comment deleted successfully"}

@router.put("/comments/{id}", response_model=Comment)
async def update_comment(id: str, updated_comment: CommentCreate, request: Request):
    current_user = request.state.user
    if not current_user:
        raise HTTPException(status_code=401, detail="User not authenticated")

    logging.info(f"Updating comment with ID: {id}")

    comment = await db.comments.find_one({"id": id})
    if not comment:
        logging.error(f"Comment with ID {id} not found")
        raise HTTPException(status_code=404, detail="Comment not found")

    comment['content'] = updated_comment.content
    await db.comments.update_one({"id": id}, {"$set": {"content": updated_comment.content}})

    updated_comment = await db.comments.find_one({"id": id})
    return Comment(**updated_comment)
