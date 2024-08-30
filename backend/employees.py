import logging
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import EmailStr
from typing import List
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from .models import Employee  # Import the Employee model
from .schemas import EmployeeCreate, EmployeeUpdate  # Import the schemas
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection
client = AsyncIOMotorClient(os.getenv("MONGODB_URI"))
db = client.crm_database  # Replace with your database name

router = APIRouter()

# Endpoint to add an employee
@router.post("/", response_model=Employee)
async def add_employee(request: Request, employee: EmployeeCreate):
    logging.debug("Received request to create an employee.")

    # Get the current user from the request state
    user_identifier = request.state.user
    if not user_identifier:
        raise HTTPException(status_code=401, detail="User not authenticated")

    logging.debug(f"Current user: {user_identifier}")
    user = await db.users.find_one({"email": employee.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    employee_dict = employee.dict()
    result = await db.employees.insert_one(employee_dict)
    employee_id = str(result.inserted_id)
    return Employee(id=employee_id, **employee_dict)

# Endpoint to get all employees
@router.get("/", response_model=List[Employee])
async def get_employees():
    employees = []
    async for emp in db.employees.find():
        emp["id"] = str(emp["_id"])  # Convert ObjectId to string
        employees.append(Employee(**emp))
    return employees

# Endpoint to get a specific employee by ID
@router.get("/{employee_id}", response_model=Employee)
async def get_employee(employee_id: str):
    logging.debug(f"Received request to get employee with ID: {employee_id}")
    emp = await db.employees.find_one({"_id": ObjectId(employee_id)})
    if emp is None:
        logging.error(f"Employee not found for ID: {employee_id}")
        raise HTTPException(status_code=404, detail="Employee not found.")
    emp["id"] = str(emp["_id"])  # Convert ObjectId to string
    return Employee(**emp)

# Endpoint to update an employee by ID
@router.put("/{employee_id}", response_model=Employee)
async def update_employee(employee_id: str, employee: EmployeeUpdate):
    logging.debug(f"Received request to update employee with ID: {employee_id}")
    emp = await db.employees.find_one({"_id": ObjectId(employee_id)})
    if emp is None:
        logging.error(f"Employee not found for ID: {employee_id}")
        raise HTTPException(status_code=404, detail="Employee not found.")
    employee_dict = employee.dict(exclude_unset=True)
    await db.employees.update_one({"_id": ObjectId(employee_id)}, {"$set": employee_dict})
    emp["id"] = str(emp["_id"])  # Convert ObjectId to string
    return Employee(**emp)

# Endpoint to delete an employee by ID
@router.delete("/{employee_id}", response_model=Employee)
async def delete_employee(employee_id: str):
    logging.debug(f"Received request to delete employee with ID: {employee_id}")
    emp = await db.employees.find_one({"_id": ObjectId(employee_id)})
    if emp is None:
        logging.error(f"Employee not found for ID: {employee_id}")
        raise HTTPException(status_code=404, detail="Employee not found.")
    await db.employees.delete_one({"_id": ObjectId(employee_id)})
    emp["id"] = str(emp["_id"])  # Convert ObjectId to string
    return Employee(**emp)
