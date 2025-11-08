"""
SQLAlchemy ORM Models
项目成本智能评估系统 - 数据模型
"""

from datetime import datetime, date
from decimal import Decimal
from typing import Optional, List
from sqlalchemy import (
    Column, Integer, BigInteger, String, Text, Boolean, Date, DateTime,
    Numeric, ForeignKey, CheckConstraint, UniqueConstraint, Index, JSON
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

Base = declarative_base()


class User(Base):
    __tablename__ = 'users'

    id = Column(BigInteger, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    avatar_url = Column(String(255))
    phone = Column(String(20))
    job_title = Column(String(100))
    department = Column(String(100))
    employee_id = Column(String(50))
    skills = Column(JSON)
    experience_years = Column(Numeric(4, 1))
    hourly_rate = Column(Numeric(10, 2))
    status = Column(String(20), default='active')
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    last_login_at = Column(DateTime)

    # Relationships
    managed_projects = relationship("Project", foreign_keys="Project.project_manager_id", back_populates="project_manager")
    assigned_tasks = relationship("WBSTask", back_populates="assignee")
    timesheets = relationship("Timesheet", back_populates="user")


class Project(Base):
    __tablename__ = 'projects'

    id = Column(BigInteger, primary_key=True)
    name = Column(String(200), nullable=False)
    code = Column(String(50), unique=True, nullable=False)
    description = Column(Text)
    project_type = Column(String(50), nullable=False)
    regulation_type = Column(String(100))
    client_name = Column(String(200), nullable=False)
    client_type = Column(String(50))

    # 规模参数
    data_sources_count = Column(Integer, default=0)
    interface_tables_count = Column(Integer, default=0)
    reports_count = Column(Integer, default=0)
    custom_requirements_count = Column(Integer, default=0)
    data_volume_level = Column(String(20))

    # 状态和优先级
    status = Column(String(50), default='planning')
    priority = Column(String(20), default='medium')

    # 时间
    planned_start_date = Column(Date)
    planned_end_date = Column(Date)
    actual_start_date = Column(Date)
    actual_end_date = Column(Date)

    # 成本
    budget_amount = Column(Numeric(15, 2))
    contract_amount = Column(Numeric(15, 2))

    # 团队
    project_manager_id = Column(BigInteger, ForeignKey('users.id'))
    organization_id = Column(BigInteger, ForeignKey('organizations.id'))

    # 评估
    complexity_score = Column(Numeric(3, 1))
    complexity_level = Column(String(20))
    estimated_hours = Column(Numeric(10, 1))
    actual_hours = Column(Numeric(10, 1))
    variance_percentage = Column(Numeric(5, 2))

    # 审计
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    __table_args__ = (
        CheckConstraint('planned_end_date >= planned_start_date', name='chk_dates'),
    )

    # Relationships
    project_manager = relationship("User", foreign_keys=[project_manager_id], back_populates="managed_projects")
    tasks = relationship("WBSTask", back_populates="project", cascade="all, delete-orphan")
    complexity_assessment = relationship("ComplexityAssessment", back_populates="project", uselist=False)
    estimation_result = relationship("EstimationResult", back_populates="project", uselist=False)
    timesheets = relationship("Timesheet", back_populates="project")


class Organization(Base):
    __tablename__ = 'organizations'

    id = Column(BigInteger, primary_key=True)
    name = Column(String(200), nullable=False)
    code = Column(String(50), unique=True, nullable=False)
    type = Column(String(50))
    parent_id = Column(BigInteger, ForeignKey('organizations.id'))
    description = Column(Text)
    status = Column(String(20), default='active')
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now())


class WBSTask(Base):
    __tablename__ = 'wbs_tasks'

    id = Column(BigInteger, primary_key=True)
    project_id = Column(BigInteger, ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    parent_task_id = Column(BigInteger, ForeignKey('wbs_tasks.id', ondelete='CASCADE'))
    wbs_code = Column(String(50), nullable=False)
    task_name = Column(String(200), nullable=False)
    description = Column(Text)
    task_level = Column(Integer, nullable=False)
    task_type = Column(String(50))
    task_category = Column(String(50))

    # 工时
    estimated_hours = Column(Numeric(10, 1))
    optimistic_hours = Column(Numeric(10, 1))
    pessimistic_hours = Column(Numeric(10, 1))
    actual_hours = Column(Numeric(10, 1), default=0)

    # 进度
    progress_percentage = Column(Numeric(5, 2), default=0)
    status = Column(String(50), default='not_started')

    # 时间
    planned_start_date = Column(Date)
    planned_end_date = Column(Date)
    actual_start_date = Column(Date)
    actual_end_date = Column(Date)

    # 资源
    assignee_id = Column(BigInteger, ForeignKey('users.id'))

    # 其他
    complexity = Column(String(20))
    risk_level = Column(String(20))
    is_milestone = Column(Boolean, default=False)
    sort_order = Column(Integer)

    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now())

    __table_args__ = (
        UniqueConstraint('project_id', 'wbs_code', name='uq_project_wbs_code'),
    )

    # Relationships
    project = relationship("Project", back_populates="tasks")
    assignee = relationship("User", back_populates="assigned_tasks")
    parent_task = relationship("WBSTask", remote_side=[id], backref="subtasks")
    timesheets = relationship("Timesheet", back_populates="task")


class Timesheet(Base):
    __tablename__ = 'timesheets'

    id = Column(BigInteger, primary_key=True)
    task_id = Column(BigInteger, ForeignKey('wbs_tasks.id', ondelete='CASCADE'))
    user_id = Column(BigInteger, ForeignKey('users.id'))
    project_id = Column(BigInteger, ForeignKey('projects.id', ondelete='CASCADE'))
    work_date = Column(Date, nullable=False)
    hours = Column(Numeric(5, 2), nullable=False)
    description = Column(Text)
    work_category = Column(String(50))
    task_progress_percentage = Column(Numeric(5, 2))
    issues_encountered = Column(Text)
    status = Column(String(20), default='submitted')
    created_at = Column(DateTime, default=func.now())

    __table_args__ = (
        CheckConstraint('hours >= 0 AND hours <= 24', name='chk_hours'),
    )

    # Relationships
    task = relationship("WBSTask", back_populates="timesheets")
    user = relationship("User", back_populates="timesheets")
    project = relationship("Project", back_populates="timesheets")


class EstimationModel(Base):
    __tablename__ = 'estimation_models'

    id = Column(BigInteger, primary_key=True)
    model_name = Column(String(100), nullable=False)
    model_version = Column(String(20), nullable=False)
    model_type = Column(String(50))
    task_type = Column(String(50))
    task_category = Column(String(50))
    base_hours = Column(Numeric(10, 2))
    base_hours_per_unit = Column(Numeric(10, 2))
    unit_type = Column(String(50))
    complexity_multipliers = Column(JSON)
    adjustment_rules = Column(JSON)
    r2_score = Column(Numeric(5, 4))
    mae = Column(Numeric(10, 2))
    confidence_level = Column(Numeric(5, 4))
    status = Column(String(20), default='active')
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now())

    __table_args__ = (
        UniqueConstraint('model_name', 'model_version', name='uq_model_name_version'),
    )


class ComplexityAssessment(Base):
    __tablename__ = 'complexity_assessments'

    id = Column(BigInteger, primary_key=True)
    project_id = Column(BigInteger, ForeignKey('projects.id', ondelete='CASCADE'))
    assessment_method = Column(String(50))
    technical_complexity = Column(Numeric(3, 1))
    business_complexity = Column(Numeric(3, 1))
    data_complexity = Column(Numeric(3, 1))
    organizational_complexity = Column(Numeric(3, 1))
    risk_factors = Column(Numeric(3, 1))
    total_score = Column(Numeric(3, 1))
    complexity_level = Column(String(20))
    assessment_details = Column(JSON)
    recommended_multiplier = Column(Numeric(4, 2))
    confidence_score = Column(Numeric(3, 2))
    assessed_at = Column(DateTime, default=func.now())
    version = Column(Integer, default=1)

    # Relationships
    project = relationship("Project", back_populates="complexity_assessment")


class EstimationResult(Base):
    __tablename__ = 'estimation_results'

    id = Column(BigInteger, primary_key=True)
    project_id = Column(BigInteger, ForeignKey('projects.id', ondelete='CASCADE'))
    estimation_version = Column(String(20))
    rule_based_estimate = Column(Numeric(10, 1))
    similarity_based_estimate = Column(Numeric(10, 1))
    ml_based_estimate = Column(Numeric(10, 1))
    llm_based_estimate = Column(Numeric(10, 1))
    ensemble_estimate = Column(Numeric(10, 1))
    final_estimate = Column(Numeric(10, 1))
    optimistic_estimate = Column(Numeric(10, 1))
    most_likely_estimate = Column(Numeric(10, 1))
    pessimistic_estimate = Column(Numeric(10, 1))
    expected_estimate = Column(Numeric(10, 1))
    std_deviation = Column(Numeric(10, 2))
    confidence_interval_low = Column(Numeric(10, 1))
    confidence_interval_high = Column(Numeric(10, 1))
    disagreement_score = Column(Numeric(5, 4))
    overall_confidence = Column(Numeric(3, 2))
    confidence_level = Column(String(20))
    estimation_breakdown = Column(JSON)
    model_weights = Column(JSON)
    estimated_at = Column(DateTime, default=func.now())
    adjustment_reason = Column(Text)

    # Relationships
    project = relationship("Project", back_populates="estimation_result")


class SimilarProject(Base):
    __tablename__ = 'similar_projects'

    id = Column(BigInteger, primary_key=True)
    target_project_id = Column(BigInteger, ForeignKey('projects.id', ondelete='CASCADE'))
    similar_project_id = Column(BigInteger, ForeignKey('projects.id', ondelete='CASCADE'))
    similarity_score = Column(Numeric(5, 4))
    categorical_similarity = Column(Numeric(5, 4))
    scale_similarity = Column(Numeric(5, 4))
    complexity_similarity = Column(Numeric(5, 4))
    matching_method = Column(String(50))
    matched_at = Column(DateTime, default=func.now())

    __table_args__ = (
        UniqueConstraint('target_project_id', 'similar_project_id', name='uq_similar_projects'),
    )


class RiskRegister(Base):
    __tablename__ = 'risk_registers'

    id = Column(BigInteger, primary_key=True)
    project_id = Column(BigInteger, ForeignKey('projects.id', ondelete='CASCADE'))
    risk_title = Column(String(200), nullable=False)
    risk_description = Column(Text)
    risk_category = Column(String(50))
    probability = Column(Numeric(3, 2))
    impact = Column(String(20))
    impact_hours = Column(Numeric(10, 1))
    risk_level = Column(String(20))
    risk_score = Column(Numeric(5, 2))
    mitigation_strategy = Column(Text)
    contingency_plan = Column(Text)
    owner_id = Column(BigInteger, ForeignKey('users.id'))
    status = Column(String(20), default='open')
    identified_at = Column(DateTime, default=func.now())
