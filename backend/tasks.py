from fastapi import APIRouter,Depends, Request, HTTPException
from typing import List
import logging
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
import os
from .schemas import TaskCreate, Task
from .models import Task as TaskModel
from datetime import datetime

router = APIRouter()

# MongoDB connection
client = AsyncIOMotorClient(os.getenv("MONGODB_URI"))
db = client.crm_database  # Replace with your database name
task_collection = db.tasks

async def get_database():
    client = AsyncIOMotorClient(os.getenv("MONGODB_URI"))
    return client.crm_database

@router.post("/", response_model=Task)
async def create_task(task: TaskCreate, request: Request):
    logging.debug("Received request to create a task")

    task_dict = task.dict()
    task_dict["created_time"] = task_dict["dueDate"]  # Assign dueDate to created_time
    result = await task_collection.insert_one(task_dict)
    task_dict["id"] = str(result.inserted_id)
    return TaskModel(**task_dict)

@router.get("/", response_model=List[Task])
async def read_tasks(request: Request):
    logging.debug("Received request to read tasks")

    tasks = await task_collection.find().to_list(1000)
    return [TaskModel(id=str(task["_id"]), **task) for task in tasks]

@router.get("/{task_id}", response_model=Task)
async def read_task(task_id: str, request: Request):
    logging.debug(f"Received request to read task with ID: {task_id}")

    task = await task_collection.find_one({"_id": ObjectId(task_id)})
    if task:
        task["id"] = str(task["_id"])
        return TaskModel(**task)
    raise HTTPException(status_code=404, detail="Task not found")

@router.put("/{task_id}", response_model=Task)
async def update_task(task_id: str, task: TaskCreate, request: Request):
    logging.debug(f"Received request to update task with ID: {task_id}")

    task_dict = task.dict()
    task_dict["created_time"] = task_dict["dueDate"]  # Assign dueDate to created_time
    result = await task_collection.update_one({"_id": ObjectId(task_id)}, {"$set": task_dict})
    if result.modified_count == 1:
        task_dict["id"] = task_id
        return TaskModel(**task_dict)
    raise HTTPException(status_code=404, detail="Task not found")

@router.delete("/{task_id}", response_model=Task)
async def delete_task(task_id: str, request: Request):
    logging.debug(f"Received request to delete task with ID: {task_id}")

    task = await task_collection.find_one_and_delete({"_id": ObjectId(task_id)})
    if task:
        task["id"] = str(task["_id"])
        return TaskModel(**task)
    raise HTTPException(status_code=404, detail="Task not found")



@router.get("/total", response_model=int)
async def get_total_tasks(db: AsyncIOMotorClient = Depends(get_database)):
    try:
        total_tasks = await db.tasks.count_documents({})
        return total_tasks
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")