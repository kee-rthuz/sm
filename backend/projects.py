from fastapi import APIRouter, Depends, HTTPException, Request, Query
from bson import ObjectId
from .auth import AuthJWT
from .schemas import ProjectCreate, Project
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import traceback
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# MongoDB connection
client = AsyncIOMotorClient(os.getenv("MONGODB_URI"))
db = client.crm_database  # Replace with your database name

@router.post("/", response_model=Project)
async def create_project(request: Request, project: ProjectCreate):
    logging.debug("Received request to create a project.")

    # Get the current user from the request state
    user_identifier = request.state.user
    if not user_identifier:
        raise HTTPException(status_code=401, detail="User not authenticated")

    logging.debug(f"Current user: {user_identifier}")

    new_project = Project(
        id=str(ObjectId()),
        name=project.name,
        category=project.category,
        start_date=project.start_date,
        end_date=project.end_date,
        notification=project.notification,
        task_person=project.task_person,
        budget=project.budget,
        priority=project.priority,
        description=project.description,
        created_by=user_identifier
    )

    await db.projects.insert_one(new_project.dict())
    logging.info(f"Project created successfully by {user_identifier}")
    return new_project

@router.get("/", response_model=list[Project])
async def get_projects(request: Request):
    try:
        # Fetch all projects
        projects = await db.projects.find().to_list(length=None)

        # Convert ObjectId to string for the response
        for project in projects:
            project["id"] = str(project["_id"])  # Convert ObjectId to string
            del project["_id"]  # Remove the original ObjectId field

        logging.info("Projects fetched successfully")
        return projects
    except Exception as e:
        logging.error("Error fetching projects: %s", str(e))
        raise HTTPException(status_code=400, detail=str(e))



@router.get("/filtered/", response_model=list[Project])
async def get_filtered_projects(request: Request, status: str = Query(..., description="Filter projects by status")):
    try:
        # Create a filter based on the status parameter
        filter_query = {}
        if status.lower() != 'all':
            filter_query['status'] = status

        # Fetch projects based on the filter
        projects = await db.projects.find(filter_query).to_list(length=None)

        # Convert ObjectId to string for the response
        for project in projects:
            project["id"] = str(project["_id"])  # Convert ObjectId to string
            del project["_id"]  # Remove the original ObjectId field

        logging.info(f"Filtered projects fetched successfully. Filter: {filter_query}")
        return projects
    except Exception as e:
        logging.error("Error fetching filtered projects: %s", str(e))
        raise HTTPException(status_code=400, detail=str(e))
@router.put("/{project_id}/", response_model=Project)
async def update_project(project_id: str, project: ProjectCreate):
    try:
        logging.debug(f"Received request to update project {project_id} with data: {project.dict()}")

        # Update the project in the database
        updated_project = await db.projects.find_one_and_update(
            {"_id": ObjectId(project_id)},
            {"$set": project.dict(exclude_unset=True)},
            return_document=True
        )

        if not updated_project:
            raise HTTPException(status_code=404, detail="Project not found")

        updated_project["id"] = str(updated_project["_id"])
        del updated_project["_id"]

        logging.info(f"Project {project_id} updated successfully")
        return updated_project
    except Exception as e:
        logging.error("Error updating project: %s", str(e))
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{project_id}/", response_model=dict)
async def delete_project(project_id: str):
    try:
        # Delete the project from the database
        result = await db.projects.delete_one({"_id": ObjectId(project_id)})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")

        logging.info(f"Project {project_id} deleted successfully")
        return {"detail": "Project deleted successfully"}
    except Exception as e:
        logging.error("Error deleting project: %s", str(e))
        raise HTTPException(status_code=400, detail=str(e))
