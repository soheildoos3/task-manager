from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.dependencies.database import get_db
from app.dependencies.auth import get_current_user
from app.dependencies.pagination import pagination_params
from app.services.task_service import TaskService
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse, PaginatedTaskResponse
from app.models.user import User
from app.models.task import TaskStatus, TaskPriority

router = APIRouter()


@router.get("/", response_model=PaginatedTaskResponse)
def get_tasks(
    status: Optional[TaskStatus] = Query(None),
    priority: Optional[TaskPriority] = Query(None),
    search: Optional[str] = Query(None),
    pagination: dict = Depends(pagination_params),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = TaskService(db)

    tasks = service.get_user_tasks(
        user_id=current_user.id,
        status=status,
        priority=priority,
        search=search,
        skip=pagination["skip"],
        limit=pagination["limit"],
    )

    total = service.count_user_tasks(
        user_id=current_user.id,
        status=status,
        priority=priority,
        search=search,
    )

    total_pages = (
        (total + pagination["limit"] - 1) // pagination["limit"] if total > 0 else 1
    )

    return PaginatedTaskResponse(
        data=tasks,
        total=total,
        page=pagination["page"],
        limit=pagination["limit"],
        totalPages=total_pages,
    )


@router.post("/", response_model=TaskResponse)
def create_task(
    task_data: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = TaskService(db)
    return service.create_task(current_user.id, task_data)


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = TaskService(db)
    task = service.get_task_by_id(task_id, current_user.id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    return task


@router.patch("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = TaskService(db)
    task = service.update_task(task_id, current_user.id, task_data)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    return task


@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = TaskService(db)
    result = service.delete_task(task_id, current_user.id)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    return {"message": "Task deleted successfully"}
