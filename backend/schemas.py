from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class SubjectBase(BaseModel):
    name: str
    code: Optional[str] = None
    description: Optional[str] = None
    credits: Optional[int] = None

class Subject(SubjectBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class StudentGroupBase(BaseModel):
    name: str
    faculty: Optional[str] = None
    year_of_study: Optional[int] = None
    num_students: Optional[int] = None
    curator_id: Optional[int] = None

class StudentGroup(StudentGroupBase):
    id: int
    created_at: datetime
    updated_at: datetime
    curator: Optional["User"] = None

    class Config:
        from_attributes = True

class ClassroomBase(BaseModel):
    name: str
    status: str = "free"
    equipment: Optional[str] = None

class Classroom(ClassroomBase):
    id: int

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    name: str
    email: str
    role: str = "user"

class User(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ScheduleBase(BaseModel):
    classroom_id: int
    teacher_id: int
    group_id: int
    subject_id: int
    start_time: datetime
    end_time: datetime

class ScheduleCreate(BaseModel):
    classroom_id: int
    teacher_id: int
    group_id: int
    subject_id: int
    start_time: str
    end_time: str

class Schedule(ScheduleBase):
    id: int
    classroom: Optional[Classroom] = None
    teacher: Optional[User] = None
    group: Optional[StudentGroup] = None
    subject: Optional[Subject] = None

    class Config:
        from_attributes = True

class ExchangeRequestBase(BaseModel):
    classroom_id: int
    subject_id: Optional[int]
    studentgroup_id: Optional[int]
    teacher_id: Optional[int]
    start_time: datetime
    end_time: datetime
    status: str

class ExchangeRequestCreate(BaseModel):
    classroom_id: int
    subject_id: Optional[int]
    studentgroup_id: Optional[int]
    teacher_id: Optional[int]
    start_time: str
    end_time: str
    status: str

class ExchangeRequest(ExchangeRequestBase):
    id: int
    created_at: datetime
    classroom: Optional[Classroom] = None
    subject: Optional[Subject] = None
    studentgroup: Optional[StudentGroup] = None
    teacher: Optional[User] = None

    class Config:
        from_attributes = True

class RoomStatusLogBase(BaseModel):
    room_id: int
    status: str
    schedule_id: Optional[int] = None

class RoomStatusLog(RoomStatusLogBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True