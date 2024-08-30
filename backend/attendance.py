from fastapi import Body
from fastapi import APIRouter, HTTPException, Request
from typing import List
from bson import ObjectId
from .models import Attendance  # Import the Attendance model
from .schemas import AttendanceCreate, AttendanceUpdate  # Import the schemas
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import logging

load_dotenv()

# MongoDB connection
client = AsyncIOMotorClient(os.getenv("MONGODB_URI"))
db = client.crm_database  # Replace with your database name

router = APIRouter()

# Endpoint to add an attendance record
@router.post("/", response_model=Attendance)
async def add_attendance(request: Request, attendance: AttendanceCreate):
    logging.debug("Received request to create an attendance record.")

    # Get the current user from the request state
    user_identifier = request.state.user
    if not user_identifier:
        raise HTTPException(status_code=401, detail="User not authenticated")

    logging.debug(f"Current user: {user_identifier}")

    # Check if the attendance record already exists for the given date and employee
    existing_record = await db.attendance.find_one({"name": attendance.name, "date": attendance.date})
    if existing_record:
        logging.debug(f"Attendance record already exists for employee {attendance.name} on {attendance.date}")
        return Attendance(id=str(existing_record["_id"]), **existing_record)

    attendance_dict = attendance.dict()
    result = await db.attendance.insert_one(attendance_dict)
    attendance_id = str(result.inserted_id)
    logging.debug(f"Attendance record created with ID: {attendance_id}")
    return Attendance(id=attendance_id, **attendance_dict)

@router.get("/", response_model=List[Attendance])
async def get_attendance(request: Request):
    logging.debug("Received request to get all attendance records.")
    attendance_records = []
    async for record in db.attendance.find():
        record["id"] = str(record["_id"])  # Convert ObjectId to string
        attendance_records.append(Attendance(**record))
    logging.debug(f"Returning {len(attendance_records)} attendance records.")
    return attendance_records

# Endpoint to get a specific attendance record by ID
@router.get("/{attendance_id}", response_model=Attendance)
async def get_attendance_record(attendance_id: str):
    record = await db.attendance.find_one({"_id": ObjectId(attendance_id)})
    if record is None:
        raise HTTPException(status_code=404, detail="Attendance record not found.")
    record["id"] = str(record["_id"])  # Convert ObjectId to string
    return Attendance(**record)

# Endpoint to update an attendance record by ID
@router.put("/{id}", response_model=Attendance)
async def update_attendance_record(id: str, attendance: AttendanceUpdate):
    logging.debug(f"Received update request for ID: {id} with data: {attendance}")
    
    # Retrieve the record to be updated
    record = await db.attendance.find_one({"_id": ObjectId(id)})
    if record is None:
        raise HTTPException(status_code=404, detail="Attendance record not found.")
    
    # Log the current record for debugging
    logging.debug(f"Current record before update: {record}")

    # Update the record
    attendance_dict = attendance.dict(exclude_unset=True)
    await db.attendance.update_one({"_id": ObjectId(id)}, {"$set": attendance_dict})
    
    # Retrieve the updated record
    updated_record = await db.attendance.find_one({"_id": ObjectId(id)})
    updated_record["id"] = str(updated_record["_id"])  # Convert ObjectId to string
    return Attendance(**updated_record)

# Endpoint to delete an attendance record by ID

@router.delete("/", response_model=Attendance)
async def delete_attendance_record(request: Request, date: str = Body(...), name: str = Body(...)):
    logging.debug(f"Received request to delete attendance record for date: {date} and employee: {name}")

    user_identifier = request.state.user
    if not user_identifier:
        raise HTTPException(status_code=401, detail="User not authenticated")

    record = await db.attendance.find_one({"date": date, "name": name})
    if record is None:
        logging.error(f"Attendance record not found for date: {date} and employee: {name}")
        raise HTTPException(status_code=404, detail="Attendance record not found.")

    await db.attendance.delete_one({"date": date, "name": name})
    record["id"] = str(record["_id"])  # Convert ObjectId to string
    logging.debug(f"Attendance record deleted for date: {date} and employee: {name}")
    return Attendance(**record)
