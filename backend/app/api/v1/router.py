from fastapi import APIRouter
from .auth import router as auth_router
from .users import router as users_router
from .tasks import router as tasks_router

router = APIRouter(prefix="/api/v1")

router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
router.include_router(users_router, prefix="/users", tags=["Users"])
router.include_router(tasks_router, prefix="/tasks", tags=["Tasks"])
