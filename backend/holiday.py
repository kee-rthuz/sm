import logging
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from datetime import datetime, date
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List
import os
from dotenv import load_dotenv
from .models import Holiday  # Import the Holiday model
from .schemas import HolidayCreate  # Import the HolidayCreate schema

# Load environment variables
load_dotenv()

# Set up logging configuration
logging.basicConfig(level=logging.INFO)

# MongoDB connection
client = AsyncIOMotorClient(os.getenv("MONGODB_URI"))
db = client.crm_database  # Replace with your actual database name

# Initialize router
router = APIRouter()

# Helper function to convert date to ISO 8601 string and back
def  date_to_iso_string(input_date: str) -> str:
    """Convert date string to ISO 8601 format string."""
    try:
        return datetime.strptime(input_date, "%Y-%m-%d").date().isoformat()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

def iso_string_to_display_date(input_iso: str) -> str:
    """Convert ISO 8601 format string to display date string in DD-MM-YYYY."""
    try:
        # Format date as DD-MM-YYYY
        return datetime.fromisoformat(input_iso).strftime("%d-%m-%Y")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

@router.post("/holidays", response_model=Holiday)
async def create_holiday(request: Request, holiday: HolidayCreate):
    logging.debug("Received request to create a holiday.")
    
    # Get the current user from the request state
    user_identifier = request.state.user
    if not user_identifier:
        raise HTTPException(status_code=401, detail="User not authenticated")

    logging.debug(f"Current user: {user_identifier}")

    # Create a new holiday object with date converted to ISO string
    new_holiday = Holiday(
        id=str(ObjectId()),
        name=holiday.name,
        date=date_to_iso_string(holiday.date),  # Convert date to ISO format string
    )

    # Insert holiday into MongoDB
    await db.holidays.insert_one(new_holiday.dict())
    logging.info(f"Holiday created successfully: {new_holiday}")
    
    # Modify the response to include date in DD-MM-YYYY format
    new_holiday.date = iso_string_to_display_date(new_holiday.date)
    
    return new_holiday

# Endpoint to get all holidays
@router.get("/holidays", response_model=List[Holiday])
async def get_holidays():
    holidays = []
    async for holiday in db.holidays.find():
        holiday["id"] = str(holiday["_id"])  # Convert ObjectId to string
        holiday["date"] = iso_string_to_display_date(holiday["date"])  # Convert ISO format string back to date
        holidays.append(Holiday(**holiday))  # Append Holiday object to the list

    logging.info(f"Retrieved {len(holidays)} holidays.")
    return holidays

# Endpoint to update a holiday by ID
@router.put("/holidays/{holiday_id}", response_model=Holiday)
async def update_holiday(holiday_id: str, holiday: HolidayCreate):
    logging.debug(f"Received request to update holiday with ID: {holiday_id}")

    # Validate ObjectId
    if not ObjectId.is_valid(holiday_id):
        logging.error(f"Invalid holiday ID: {holiday_id}")
        raise HTTPException(status_code=400, detail="Invalid holiday ID.")

    existing_holiday = await db.holidays.find_one({"_id": ObjectId(holiday_id)})
    if existing_holiday is None:
        logging.error(f"Holiday not found for ID: {holiday_id}")
        raise HTTPException(status_code=404, detail="Holiday not found.")

    holiday_dict = holiday.dict(exclude_unset=True)
    holiday_dict["date"] = date_to_iso_string(holiday.date)  # Convert date to ISO format string

    await db.holidays.update_one({"_id": ObjectId(holiday_id)}, {"$set": holiday_dict})

    existing_holiday.update(holiday_dict)
    existing_holiday["id"] = str(existing_holiday["_id"])  # Convert ObjectId to string
    existing_holiday["date"] = iso_string_to_display_date(existing_holiday["date"])  # Convert ISO format string back to date

    logging.info(f"Holiday updated successfully: {existing_holiday}")
    return Holiday(**existing_holiday)

# Endpoint to delete a holiday by ID
@router.delete("/holidays/{holiday_id}", response_model=Holiday)
async def delete_holiday(holiday_id: str):
    logging.debug(f"Received request to delete holiday with ID: {holiday_id}")

    # Validate ObjectId
    if not ObjectId.is_valid(holiday_id):
        logging.error(f"Invalid holiday ID: {holiday_id}")
        raise HTTPException(status_code=400, detail="Invalid holiday ID.")

    holiday = await db.holidays.find_one({"_id": ObjectId(holiday_id)})
    if holiday is None:
        logging.error(f"Holiday not found for ID: {holiday_id}")
        raise HTTPException(status_code=404, detail="Holiday not found.")

    await db.holidays.delete_one({"_id": ObjectId(holiday_id)})
    holiday["id"] = str(holiday["_id"])  # Convert ObjectId to string
    holiday["date"] = iso_string_to_display_date(holiday["date"])  # Convert ISO format string back to date

    logging.info(f"Holiday deleted successfully: {holiday}")
    return Holiday(**holiday)
