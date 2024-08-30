from bson import ObjectId
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import List, Optional

class User(BaseModel):
    id: str
    username: str
    email: EmailStr
    password: str

    class Config:
        orm_mode = True  # This is valid for Pydantic 1.x

class Project(BaseModel):
    id: str
    name: str
    category: str
    start_date: datetime
    end_date: datetime
    notification: str
    task_person: str
    budget: float
    priority: str
    description: Optional[str] = None
    created_by: str  # Track who created the project

    class Config:
        orm_mode = True  # This allows Pydantic to work with ORMs
        
        
class Invitation(BaseModel):
    id: Optional[str] = None
    token: str
    email: EmailStr
    created_by: str
    expires_at: datetime
    used: bool = False

    class Config:
        orm_mode = True  # This allows Pydantic to work with ORMs
        


class Employee(BaseModel):
    id: Optional[str] = None
    name: str
    role: str
    email: EmailStr
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        orm_mode = True
        
        

class Comment(BaseModel):
    id: Optional[str] = None
    content: str
    author: EmailStr
    date: datetime = Field(default_factory=datetime.utcnow)
    task_id: str
    replies: Optional[List['Comment']] = []

    class Config:
        orm_mode = True



class Task(BaseModel):
    id: Optional[str] = None
    title: str
    assignedTo: str
    dueDate: datetime  # Change the type to datetime
    status: str
    created_by: str
    created_time: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        orm_mode = True
        
class Attendance(BaseModel):
    id: str
    name: str
    date: str
    status: str
    reason: Optional[str] = None

    class Config:
        orm_mode = True  # This allows Pydantic to work with ORMs