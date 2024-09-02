# leave_router.py
import logging
from fastapi import APIRouter, HTTPException, Request
from typing import List
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from .models import LeaveRequest  # Import the LeaveRequest model
from .schemas import LeaveRequestCreate  # Import the schemas
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection
client = AsyncIOMotorClient(os.getenv("MONGODB_URI"))
db = client.crm_database  # Replace with your database name

router = APIRouter()

# Endpoint to add a leave request
@router.post("/", response_model=LeaveRequest)
async def add_leave_request(request: Request, leave_request: LeaveRequestCreate):
    logging.debug("Received request to create a leave request.")

    # Get the current user from the request state
    user_identifier = request.state.user
    if not user_identifier:
        raise HTTPException(status_code=401, detail="User not authenticated")

    # Check if there are any pending leave requests
    pending_leave_request = await db.leave_requests.find_one({"employee_id": leave_request.employee_id, "status": "processing"})
    if pending_leave_request:
        raise HTTPException(status_code=400, detail="You have a pending leave request.")

    leave_request_dict = leave_request.dict()
    result = await db.leave_requests.insert_one(leave_request_dict)
    leave_request_id = str(result.inserted_id)
    return LeaveRequest(id=leave_request_id, **leave_request_dict)

# Endpoint to get all leave requests
@router.get("/", response_model=List[LeaveRequest])
async def get_leave_requests():
    leave_requests = []
    async for leave in db.leave_requests.find():
        leave["id"] = str(leave["_id"])  # Convert ObjectId to string
        leave_requests.append(LeaveRequest(**leave))
    return leave_requests

# Endpoint to get a specific leave request by ID
@router.get("/{leave_id}", response_model=LeaveRequest)
async def get_leave_request(leave_id: str):
    logging.debug(f"Received request to get leave request with ID: {leave_id}")
    leave = await db.leave_requests.find_one({"_id": ObjectId(leave_id)})
    if leave is None:
        logging.error(f"Leave request not found for ID: {leave_id}")
        raise HTTPException(status_code=404, detail="Leave request not found.")
    leave["id"] = str(leave["_id"])  # Convert ObjectId to string
    return LeaveRequest(**leave)

# Endpoint to delete a leave request by ID
@router.delete("/{leave_id}", response_model=LeaveRequest)
async def delete_leave_request(leave_id: str):
    logging.debug(f"Received request to delete leave request with ID: {leave_id}")
    leave = await db.leave_requests.find_one({"_id": ObjectId(leave_id)})
    if leave is None:
        logging.error(f"Leave request not found for ID: {leave_id}")
        raise HTTPException(status_code=404, detail="Leave request not found.")
    await db.leave_requests.delete_one({"_id": ObjectId(leave_id)})
    leave["id"] = str(leave["_id"])  # Convert ObjectId to string
    return LeaveRequest(**leave)
