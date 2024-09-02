import logging
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import EmailStr
from typing import List
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from .models import Department  # Import the Department model
from .schemas import DepartmentCreate, DepartmentUpdate  # Import the schemas
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection
client = AsyncIOMotorClient(os.getenv("MONGODB_URI"))
db = client.crm_database  # Replace with your database name

router = APIRouter()

# Endpoint to add a department
@router.post("/", response_model=Department)
async def add_department(request: Request, department: DepartmentCreate):
    logging.debug("Received request to create a department.")

    # Get the current user from the request state
    user_identifier = request.state.user
    if not user_identifier:
        raise HTTPException(status_code=401, detail="User not authenticated")

    logging.debug(f"Current user: {user_identifier}")

    department_dict = department.dict()
    result = await db.departments.insert_one(department_dict)
    department_id = str(result.inserted_id)
    return Department(id=department_id, **department_dict)

# Endpoint to get all departments
@router.get("/", response_model=List[Department])
async def get_departments():
    departments = []
    async for dept in db.departments.find():
        dept["id"] = str(dept["_id"])  # Convert ObjectId to string
        departments.append(Department(**dept))
    return departments

# Endpoint to get a specific department by ID
@router.get("/{department_id}", response_model=Department)
async def get_department(department_id: str):
    logging.debug(f"Received request to get department with ID: {department_id}")
    dept = await db.departments.find_one({"_id": ObjectId(department_id)})
    if dept is None:
        logging.error(f"Department not found for ID: {department_id}")
        raise HTTPException(status_code=404, detail="Department not found.")
    dept["id"] = str(dept["_id"])  # Convert ObjectId to string
    return Department(**dept)

# Endpoint to update a department by ID
@router.put("/{department_id}", response_model=Department)
async def update_department(department_id: str, department: DepartmentUpdate):
    logging.debug(f"Received request to update department with ID: {department_id}")
    dept = await db.departments.find_one({"_id": ObjectId(department_id)})
    if dept is None:
        logging.error(f"Department not found for ID: {department_id}")
        raise HTTPException(status_code=404, detail="Department not found.")

    department_dict = department.dict(exclude_unset=True)
    await db.departments.update_one({"_id": ObjectId(department_id)}, {"$set": department_dict})
    dept["id"] = str(dept["_id"])  # Convert ObjectId to string
    return Department(**dept)

# Endpoint to delete a department by ID
@router.delete("/{department_id}", response_model=Department)
async def delete_department(department_id: str):
    logging.debug(f"Received request to delete department with ID: {department_id}")
    dept = await db.departments.find_one({"_id": ObjectId(department_id)})
    if dept is None:
        logging.error(f"Department not found for ID: {department_id}")
        raise HTTPException(status_code=404, detail="Department not found.")
    await db.departments.delete_one({"_id": ObjectId(department_id)})
    dept["id"] = str(dept["_id"])  # Convert ObjectId to string
    return Department(**dept)
