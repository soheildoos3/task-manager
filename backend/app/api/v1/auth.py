from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from sqlalchemy.orm import Session
from app.dependencies.database import get_db
from app.dependencies.auth import (
    get_current_user,
    set_auth_cookies,
    clear_auth_cookies,
    create_auth_tokens,
    refresh_access_token,
)
from app.services.auth_service import AuthService
from app.schemas.user import UserLogin, UserResponse
from app.schemas.token import Token
from app.models.user import User

router = APIRouter()


@router.post("/login", response_model=Token)
def login(
    response: Response,
    login_data: UserLogin,
    db: Session = Depends(get_db),
):
    auth_service = AuthService(db)
    user = auth_service.authenticate_user(login_data.email, login_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    access_token, refresh_token = create_auth_tokens(user.email)
    set_auth_cookies(response, access_token, refresh_token)

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/refresh", response_model=Token)
def refresh(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    new_access_token = refresh_access_token(request, response, db)
    return {"access_token": new_access_token, "token_type": "bearer"}


@router.post("/logout")
def logout(response: Response):
    clear_auth_cookies(response)
    return {"message": "Successfully logged out"}
