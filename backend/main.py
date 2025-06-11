from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import List
from database import SessionLocal, engine, Base
from models import Classroom as ClassroomModel, Schedule as ScheduleModel, ExchangeRequest as ExchangeRequestModel, RoomStatusLog as RoomStatusLogModel, User as UserModel, StudentGroup as StudentGroupModel, Subject as SubjectModel
from schemas import Classroom as ClassroomSchema, Schedule as ScheduleSchema, ExchangeRequest as ExchangeRequestSchema, ExchangeRequestCreate, RoomStatusLog as RoomStatusLogSchema, StudentGroup as StudentGroupSchema, Subject as SubjectSchema, User as UserSchema, ScheduleCreate
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ExchangeRequestUpdate(BaseModel):
    status: str

# Статичні маршрути перед динамічними
@app.get("/classrooms/validate")
def validate_classroom(name: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    print(f"Validating classroom: {name}")
    try:
        classroom = db.query(ClassroomModel).filter(ClassroomModel.name == name.strip()).first()
        print(f"Classroom validation result: exists={bool(classroom)}, id={classroom.id if classroom else None}")
        return {"exists": bool(classroom), "id": classroom.id if classroom else None}
    except Exception as e:
        print(f"Error validating classroom: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Помилка валідації аудиторії: {str(e)}")

@app.get("/users/validate")
def validate_user(name: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    print(f"Validating user: {name}")
    try:
        user = db.query(UserModel).filter(UserModel.name == name.strip()).first()
        print(f"User validation result: exists={bool(user)}, id={user.id if user else None}")
        return {"exists": bool(user), "id": user.id if user else None}
    except Exception as e:
        print(f"Error validating user: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Помилка валідації викладача: {str(e)}")

@app.get("/schedules/validate")
def validate_group(name: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    print(f"Validating group: {name}")
    try:
        group = db.query(StudentGroupModel).filter(StudentGroupModel.name == name.strip()).first()
        print(f"Group validation result: exists={bool(group)}, id={group.id if group else None}")
        return {"exists": bool(group), "id": group.id if group else None}
    except Exception as e:
        print(f"Error validating group: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Помилка валідації групи: {str(e)}")

# Динамічні маршрути після статичних
@app.get("/classrooms", response_model=List[ClassroomSchema])
def read_classrooms(db: Session = Depends(get_db)):
    print("Fetching classrooms...")
    classrooms = db.query(ClassroomModel).all()
    print(f"Found {len(classrooms)} classrooms")
    return classrooms

@app.get("/classrooms/{classroom_id}", response_model=ClassroomSchema)
def read_classroom(classroom_id: int, db: Session = Depends(get_db)):
    print(f"Fetching classroom {classroom_id}")
    classroom = db.query(ClassroomModel).filter(ClassroomModel.id == classroom_id).first()
    if not classroom:
        print(f"Classroom {classroom_id} not found")
        raise HTTPException(status_code=404, detail="Аудиторію не знайдено")
    print(f"Found classroom: {classroom.name}")
    return classroom

@app.get("/subjects/{subject_id}", response_model=SubjectSchema)
def read_subject(subject_id: int, db: Session = Depends(get_db)):
    print(f"Fetching subject {subject_id}")
    subject = db.query(SubjectModel).filter(SubjectModel.id == subject_id).first()
    if not subject:
        print(f"Subject {subject_id} not found")
        raise HTTPException(status_code=404, detail="Предмет не знайдено")
    print(f"Found subject: {subject.name}")
    return subject

@app.get("/studentgroups/{group_id}", response_model=StudentGroupSchema)
def read_student_group(group_id: int, db: Session = Depends(get_db)):
    print(f"Fetching student group {group_id}")
    group = db.query(StudentGroupModel).filter(StudentGroupModel.id == group_id).first()
    if not group:
        print(f"Student group {group_id} not found")
        raise HTTPException(status_code=404, detail="Групу не знайдено")
    print(f"Found student group: {group.name}")
    return group

@app.get("/users/{user_id}", response_model=UserSchema)
def read_user(user_id: int, db: Session = Depends(get_db)):
    print(f"Fetching user {user_id}")
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        print(f"User {user_id} not found")
        raise HTTPException(status_code=404, detail="Користувача не знайдено")
    print(f"Found user: {user.name}")
    return user

@app.get("/classrooms/{classroom_id}/schedule", response_model=List[ScheduleSchema])
def read_schedule(classroom_id: int, db: Session = Depends(get_db)):
    print(f"Fetching schedules for classroom {classroom_id}")
    schedules = (
        db.query(ScheduleModel)
        .filter(ScheduleModel.classroom_id == classroom_id)
        .options(
            joinedload(ScheduleModel.classroom),
            joinedload(ScheduleModel.teacher),
            joinedload(ScheduleModel.group),
            joinedload(ScheduleModel.subject)
        )
        .all()
    )
    print(f"Found {len(schedules)} schedules")
    return schedules

@app.get("/schedules/by_group/{group_id}", response_model=List[ScheduleSchema])
def read_schedule_by_group(group_id: int, db: Session = Depends(get_db)):
    print(f"Fetching schedules for group {group_id}")
    group = db.query(StudentGroupModel).filter(StudentGroupModel.id == group_id).first()
    if not group:
        print(f"Group ID {group_id} not found")
        raise HTTPException(status_code=404, detail="Групу не знайдено")
    schedules = (
        db.query(ScheduleModel)
        .filter(ScheduleModel.group_id == group_id)
        .options(
            joinedload(ScheduleModel.classroom),
            joinedload(ScheduleModel.teacher),
            joinedload(ScheduleModel.group),
            joinedload(ScheduleModel.subject)
        )
        .all()
    )
    print(f"Found {len(schedules)} schedules for group {group_id}")
    return schedules

@app.get("/schedules/by_teacher/{teacher_id}", response_model=List[ScheduleSchema])
def read_schedule_by_teacher(teacher_id: int, db: Session = Depends(get_db)):
    print(f"Fetching schedules for teacher {teacher_id}")
    teacher = db.query(UserModel).filter(UserModel.id == teacher_id).first()
    if not teacher:
        print(f"Teacher ID {teacher_id} not found")
        raise HTTPException(status_code=404, detail="Викладача не знайдено")
    schedules = (
        db.query(ScheduleModel)
        .filter(ScheduleModel.teacher_id == teacher_id)
        .options(
            joinedload(ScheduleModel.classroom),
            joinedload(ScheduleModel.teacher),
            joinedload(ScheduleModel.group),
            joinedload(ScheduleModel.subject)
        )
        .all()
    )
    print(f"Found {len(schedules)} schedules for teacher {teacher_id}")
    return schedules

@app.post("/exchange_requests", response_model=ExchangeRequestSchema)
def create_exchange_request(request: ExchangeRequestCreate, db: Session = Depends(get_db)):
    print(f"Creating exchange request for classroom {request.classroom_id}")
    classroom = db.query(ClassroomModel).filter(ClassroomModel.id == request.classroom_id).first()
    if not classroom:
        print(f"Classroom {request.classroom_id} not found")
        raise HTTPException(status_code=404, detail="Аудиторію не знайдено")
    
    # Validate optional IDs
    if request.subject_id:
        subject = db.query(SubjectModel).filter(SubjectModel.id == request.subject_id).first()
        if not subject:
            print(f"Subject {request.subject_id} not found")
            raise HTTPException(status_code=404, detail="Предмет не знайдено")
    if request.studentgroup_id:
        group = db.query(StudentGroupModel).filter(StudentGroupModel.id == request.studentgroup_id).first()
        if not group:
            print(f"Student group {request.studentgroup_id} not found")
            raise HTTPException(status_code=404, detail="Групу не знайдено")
    if request.teacher_id:
        teacher = db.query(UserModel).filter(UserModel.id == request.teacher_id).first()
        if not teacher:
            print(f"Teacher {request.teacher_id} not found")
            raise HTTPException(status_code=404, detail="Викладача не знайдено")

    db_request = ExchangeRequestModel(
        classroom_id=request.classroom_id,
        subject_id=request.subject_id,
        studentgroup_id=request.studentgroup_id,
        teacher_id=request.teacher_id,
        start_time=datetime.strptime(request.start_time, '%Y-%m-%d %H:%M:%S'),
        end_time=datetime.strptime(request.end_time, '%Y-%m-%d %H:%M:%S'),
        status=request.status,
        created_at=datetime.utcnow()
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    print(f"Created exchange request ID {db_request.id}")
    return db_request

@app.get("/exchange_requests", response_model=List[ExchangeRequestSchema])
def read_exchange_requests(db: Session = Depends(get_db)):
    print("Fetching exchange requests...")
    try:
        requests = (
            db.query(ExchangeRequestModel)
            .options(
                joinedload(ExchangeRequestModel.classroom),
                joinedload(ExchangeRequestModel.subject),
                joinedload(ExchangeRequestModel.studentgroup),
                joinedload(ExchangeRequestModel.teacher)
            )
            .all()
        )
        print(f"Found {len(requests)} exchange requests")
        return requests
    except Exception as e:
        print(f"Error fetching exchange requests: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Помилка завантаження заявок: {str(e)}")

@app.patch("/exchange_requests/{request_id}", response_model=ExchangeRequestSchema)
def update_exchange_request(request_id: int, update_data: ExchangeRequestUpdate, db: Session = Depends(get_db)):
    print(f"Updating exchange request {request_id}")
    db_request = db.query(ExchangeRequestModel).filter(ExchangeRequestModel.id == request_id).first()
    if not db_request:
        print(f"Exchange request {request_id} not found")
        raise HTTPException(status_code=404, detail="Заявку не знайдено")
    if update_data.status not in ["pending", "approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Некоректний статус")
    db_request.status = update_data.status
    db.commit()
    db.refresh(db_request)
    print(f"Updated exchange request {request_id} to status {update_data.status}")
    return db_request

@app.post("/schedules", response_model=ScheduleSchema)
def create_schedule(schedule: ScheduleCreate, db: Session = Depends(get_db)):
    print(f"Creating schedule for classroom {schedule.classroom_id}")
    classroom = db.query(ClassroomModel).filter(ClassroomModel.id == schedule.classroom_id).first()
    if not classroom:
        print(f"Classroom {schedule.classroom_id} not found")
        raise HTTPException(status_code=404, detail="Аудиторію не знайдено")
    
    # Validate IDs
    subject = db.query(SubjectModel).filter(SubjectModel.id == schedule.subject_id).first()
    if not subject:
        print(f"Subject {schedule.subject_id} not found")
        raise HTTPException(status_code=404, detail="Предмет не знайдено")
    group = db.query(StudentGroupModel).filter(StudentGroupModel.id == schedule.group_id).first()
    if not group:
        print(f"Group {schedule.group_id} not found")
        raise HTTPException(status_code=404, detail="Групу не знайдено")
    teacher = db.query(UserModel).filter(UserModel.id == schedule.teacher_id).first()
    if not teacher:
        print(f"Teacher {schedule.teacher_id} not found")
        raise HTTPException(status_code=404, detail="Викладача не знайдено")

    db_schedule = ScheduleModel(
        classroom_id=schedule.classroom_id,
        subject_id=schedule.subject_id,
        group_id=schedule.group_id,
        teacher_id=schedule.teacher_id,
        start_time=datetime.strptime(schedule.start_time, '%Y-%m-%d %H:%M:%S'),
        end_time=datetime.strptime(schedule.end_time, '%Y-%m-%d %H:%M:%S')
    )
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    print(f"Created schedule ID {db_schedule.id}")
    return db_schedule

@app.get("/room_status_log", response_model=List[RoomStatusLogSchema])
def read_room_status_log(db: Session = Depends(get_db)):
    print("Fetching room status logs...")
    logs = db.query(RoomStatusLogModel).all()
    print(f"Found {len(logs)} room status logs")
    return logs

@app.get("/studentgroups", response_model=List[StudentGroupSchema])
def read_student_groups(db: Session = Depends(get_db)):
    print("Fetching student groups...")
    groups = db.query(StudentGroupModel).all()
    print(f"Found {len(groups)} student groups")
    return groups

@app.get("/subjects", response_model=List[SubjectSchema])
def read_subjects(db: Session = Depends(get_db)):
    print("Fetching subjects...")
    subjects = db.query(SubjectModel).all()
    print(f"Found {len(subjects)} subjects")
    return subjects

@app.get("/users", response_model=List[UserSchema])
def read_users(db: Session = Depends(get_db)):
    print("Fetching users...")
    users = db.query(UserModel).filter(UserModel.role == "teacher").all()
    print(f"Found {len(users)} users")
    return users