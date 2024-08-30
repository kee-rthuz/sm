from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import List, Optional

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    confirm_password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    refresh_token: str

class TokenData(BaseModel):
    email: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str  # New schema for refresh token request
    
class ProjectCreate(BaseModel):
    name: str
    category: str
    start_date: datetime
    end_date: datetime
    notification: str
    task_person: str
    budget: float
    priority: str
    description: Optional[str] = None

class Project(ProjectCreate):
    id: str
    created_by: str  # Assuming you want to track who created the project
    

class InvitationCreate(BaseModel):
    email: EmailStr
    created_by: str
    expires_at: datetime
    used: bool = False


class EmployeeCreate(BaseModel):
    name: str
    role: str
    email: EmailStr
    created_at: datetime = Field(default_factory=datetime.utcnow)

class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    email: Optional[EmailStr] = None
    

class CommentCreate(BaseModel):
    content: str
    author: EmailStr
    date: datetime = Field(default_factory=datetime.utcnow)
    task_id: str
    replies: Optional[List['CommentCreate']] = []

class Comment(CommentCreate):
    id: str


class TaskCreate(BaseModel):
    title: str
    assignedTo: str
    dueDate: datetime  # Change the type to datetime
    status: str
    created_by: str

class Task(TaskCreate):
    id: str
    created_time: datetime = Field(default_factory=datetime.utcnow)  # Added created_time field
    
    
class AttendanceCreate(BaseModel):
    name: str
    date: str
    status: str
    reason: Optional[str] = None

class AttendanceUpdate(BaseModel):
    name: Optional[str] = None
    date: Optional[str] = None
    status: Optional[str] = None
    reason: Optional[str] = None