from sqlalchemy import String, ForeignKey, DateTime, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from typing import Optional, List

from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    first_name: Mapped[str] = mapped_column(String(100))
    last_name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    meals: Mapped[List["MealLog"]] = relationship(back_populates="user", cascade="all, delete-orphan")


class MealLog(Base):
    __tablename__ = "meal_logs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    dish_name: Mapped[str] = mapped_column(String(255))
    matched_name: Mapped[str] = mapped_column(String(255))
    fdc_id: Mapped[int]
    servings: Mapped[int]
    calories_per_serving: Mapped[float] = mapped_column(Float)
    total_calories: Mapped[float] = mapped_column(Float)
    protein_g: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    fat_g: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    carbs_g: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    ingredients_text: Mapped[Optional[str]] = mapped_column(String(2000), nullable=True)

    user: Mapped[User] = relationship(back_populates="meals")

