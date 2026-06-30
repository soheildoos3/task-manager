from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import get_password_hash, verify_password
from app.schemas.user import UserCreate, UserUpdate, UserChangePassword


class UserService:
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, user_data: UserCreate):
        existing = self.db.query(User).filter(User.email == user_data.email).first()
        if existing:
            return None

        hashed = get_password_hash(user_data.password)
        user = User(
            email=user_data.email, full_name=user_data.full_name, hashed_password=hashed
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def get_user_by_id(self, user_id: int):
        return self.db.query(User).filter(User.id == user_id).first()

    def get_user_by_email(self, email: str):
        return self.db.query(User).filter(User.email == email).first()

    def update_user(self, user_id: int, user_data: UserUpdate):
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return None

        if user_data.full_name is not None:
            user.full_name = user_data.full_name

        if user_data.email is not None:
            existing = self.db.query(User).filter(User.email == user_data.email).first()
            if existing and existing.id != user_id:
                return None
            user.email = user_data.email

        self.db.commit()
        self.db.refresh(user)
        return user

    def change_password(self, user_id: int, data: UserChangePassword):
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return None

        if not verify_password(data.old_password, user.hashed_password):
            return None

        user.hashed_password = get_password_hash(data.new_password)
        self.db.commit()
        self.db.refresh(user)
        return user

    def delete_user(self, user_id: int):
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return False
        self.db.delete(user)
        self.db.commit()
        return True
