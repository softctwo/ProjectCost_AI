-- ============================================
-- 项目成本智能评估系统 - 数据库Schema
-- Database: PostgreSQL 14+
-- Version: 1.0
-- ============================================

-- 设置时区
SET timezone = 'Asia/Shanghai';

-- ============================================
-- 1. 用户与组织模块
-- ============================================

-- 1.1 用户表
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(255),
    phone VARCHAR(20),
    job_title VARCHAR(100),
    department VARCHAR(100),
    employee_id VARCHAR(50),
    skills JSONB,
    experience_years DECIMAL(4,1),
    hourly_rate DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'active',
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    created_by BIGINT REFERENCES users(id)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_department ON users(department);

-- 1.2 组织表
CREATE TABLE organizations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(50),
    parent_id BIGINT REFERENCES organizations(id),
    description TEXT,
    address TEXT,
    contact_info JSONB,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_org_parent ON organizations(parent_id);
CREATE INDEX idx_org_code ON organizations(code);

-- 1.3 团队表
CREATE TABLE teams (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    organization_id BIGINT REFERENCES organizations(id),
    team_lead_id BIGINT REFERENCES users(id),
    description TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1.4 团队成员表
CREATE TABLE team_members (
    id BIGSERIAL PRIMARY KEY,
    team_id BIGINT REFERENCES teams(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, user_id)
);

CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);

-- ============================================
-- 2. 项目管理模块
-- ============================================

-- 2.1 项目表
CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    project_type VARCHAR(50) NOT NULL,
    regulation_type VARCHAR(100),
    client_name VARCHAR(200) NOT NULL,
    client_type VARCHAR(50),
    data_sources_count INTEGER DEFAULT 0,
    interface_tables_count INTEGER DEFAULT 0,
    reports_count INTEGER DEFAULT 0,
    custom_requirements_count INTEGER DEFAULT 0,
    data_volume_level VARCHAR(20),
    status VARCHAR(50) DEFAULT 'planning',
    priority VARCHAR(20) DEFAULT 'medium',
    planned_start_date DATE,
    planned_end_date DATE,
    actual_start_date DATE,
    actual_end_date DATE,
    budget_amount DECIMAL(15,2),
    contract_amount DECIMAL(15,2),
    project_manager_id BIGINT REFERENCES users(id),
    organization_id BIGINT REFERENCES organizations(id),
    complexity_score DECIMAL(3,1),
    complexity_level VARCHAR(20),
    estimated_hours DECIMAL(10,1),
    actual_hours DECIMAL(10,1),
    variance_percentage DECIMAL(5,2),
    current_baseline_id BIGINT,
    sow_document_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT REFERENCES users(id),
    CONSTRAINT chk_dates CHECK (planned_end_date >= planned_start_date)
);

CREATE INDEX idx_projects_code ON projects(code);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_pm ON projects(project_manager_id);
CREATE INDEX idx_projects_client ON projects(client_name);
CREATE INDEX idx_projects_type ON projects(project_type);
CREATE INDEX idx_projects_composite ON projects(status, project_type, client_type);

-- 2.2 项目成员表
CREATE TABLE project_members (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id),
    role VARCHAR(50) NOT NULL,
    allocation_percentage DECIMAL(5,2) DEFAULT 100,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP,
    UNIQUE(project_id, user_id, role)
);

CREATE INDEX idx_project_members_project ON project_members(project_id);
CREATE INDEX idx_project_members_user ON project_members(user_id);

-- 2.3 项目文档表
CREATE TABLE project_documents (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    document_type VARCHAR(50),
    title VARCHAR(200) NOT NULL,
    file_name VARCHAR(255),
    file_url VARCHAR(500),
    file_size BIGINT,
    mime_type VARCHAR(100),
    parsed_content TEXT,
    extracted_metadata JSONB,
    version VARCHAR(20),
    status VARCHAR(20) DEFAULT 'draft',
    uploaded_by BIGINT REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_documents_project ON project_documents(project_id);
CREATE INDEX idx_documents_type ON project_documents(document_type);

-- ============================================
-- 3. WBS与任务模块
-- ============================================

-- 3.1 WBS任务表
CREATE TABLE wbs_tasks (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    parent_task_id BIGINT REFERENCES wbs_tasks(id) ON DELETE CASCADE,
    wbs_code VARCHAR(50) NOT NULL,
    task_name VARCHAR(200) NOT NULL,
    description TEXT,
    task_level INTEGER NOT NULL,
    task_type VARCHAR(50),
    task_category VARCHAR(50),
    estimated_hours DECIMAL(10,1),
    optimistic_hours DECIMAL(10,1),
    pessimistic_hours DECIMAL(10,1),
    actual_hours DECIMAL(10,1) DEFAULT 0,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'not_started',
    planned_start_date DATE,
    planned_end_date DATE,
    actual_start_date DATE,
    actual_end_date DATE,
    assignee_id BIGINT REFERENCES users(id),
    complexity VARCHAR(20),
    risk_level VARCHAR(20),
    is_milestone BOOLEAN DEFAULT false,
    sort_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT REFERENCES users(id),
    UNIQUE(project_id, wbs_code)
);

CREATE INDEX idx_wbs_project ON wbs_tasks(project_id);
CREATE INDEX idx_wbs_parent ON wbs_tasks(parent_task_id);
CREATE INDEX idx_wbs_assignee ON wbs_tasks(assignee_id);
CREATE INDEX idx_wbs_status ON wbs_tasks(status);
CREATE INDEX idx_wbs_code ON wbs_tasks(project_id, wbs_code);
CREATE INDEX idx_tasks_composite ON wbs_tasks(project_id, status, assignee_id);

-- 3.2 任务依赖表
CREATE TABLE task_dependencies (
    id BIGSERIAL PRIMARY KEY,
    predecessor_task_id BIGINT REFERENCES wbs_tasks(id) ON DELETE CASCADE,
    successor_task_id BIGINT REFERENCES wbs_tasks(id) ON DELETE CASCADE,
    dependency_type VARCHAR(20) DEFAULT 'FS',
    lag_days INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(predecessor_task_id, successor_task_id)
);

CREATE INDEX idx_dependencies_predecessor ON task_dependencies(predecessor_task_id);
CREATE INDEX idx_dependencies_successor ON task_dependencies(successor_task_id);

-- ============================================
-- 4. 工时与成本模块
-- ============================================

-- 4.1 工时记录表
CREATE TABLE timesheets (
    id BIGSERIAL PRIMARY KEY,
    task_id BIGINT REFERENCES wbs_tasks(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id),
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    work_date DATE NOT NULL,
    hours DECIMAL(5,2) NOT NULL,
    description TEXT,
    work_category VARCHAR(50),
    task_progress_percentage DECIMAL(5,2),
    issues_encountered TEXT,
    status VARCHAR(20) DEFAULT 'submitted',
    approved_by BIGINT REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_hours CHECK (hours >= 0 AND hours <= 24),
    CONSTRAINT chk_progress CHECK (task_progress_percentage >= 0 AND task_progress_percentage <= 100)
);

CREATE INDEX idx_timesheets_task ON timesheets(task_id);
CREATE INDEX idx_timesheets_user ON timesheets(user_id);
CREATE INDEX idx_timesheets_project ON timesheets(project_id);
CREATE INDEX idx_timesheets_date ON timesheets(work_date);
CREATE INDEX idx_timesheets_status ON timesheets(status);
CREATE INDEX idx_timesheets_composite ON timesheets(project_id, user_id, work_date);

-- 4.2 项目基线表
CREATE TABLE baselines (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    version VARCHAR(20) NOT NULL,
    baseline_name VARCHAR(200),
    description TEXT,
    baseline_data JSONB NOT NULL,
    total_planned_hours DECIMAL(10,1),
    total_budget DECIMAL(15,2),
    planned_start_date DATE,
    planned_end_date DATE,
    is_current BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'draft',
    approved_by BIGINT REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT REFERENCES users(id),
    UNIQUE(project_id, version)
);

CREATE INDEX idx_baselines_project ON baselines(project_id);
CREATE INDEX idx_baselines_current ON baselines(project_id, is_current);

-- ============================================
-- 5. 智能评估模块
-- ============================================

-- 5.1 评估模型参数表
CREATE TABLE estimation_models (
    id BIGSERIAL PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(20) NOT NULL,
    model_type VARCHAR(50),
    task_type VARCHAR(50),
    task_category VARCHAR(50),
    base_hours DECIMAL(10,2),
    base_hours_per_unit DECIMAL(10,2),
    unit_type VARCHAR(50),
    complexity_multipliers JSONB,
    adjustment_rules JSONB,
    r2_score DECIMAL(5,4),
    mae DECIMAL(10,2),
    mape DECIMAL(5,2),
    confidence_level DECIMAL(5,4),
    training_samples_count INTEGER,
    feature_importance JSONB,
    model_file_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'active',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_trained_at TIMESTAMP,
    UNIQUE(model_name, model_version)
);

CREATE INDEX idx_estimation_models_type ON estimation_models(task_type);
CREATE INDEX idx_estimation_models_status ON estimation_models(status);

-- 5.2 复杂度评估表
CREATE TABLE complexity_assessments (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    assessment_method VARCHAR(50),
    technical_complexity DECIMAL(3,1),
    business_complexity DECIMAL(3,1),
    data_complexity DECIMAL(3,1),
    organizational_complexity DECIMAL(3,1),
    risk_factors DECIMAL(3,1),
    total_score DECIMAL(3,1),
    complexity_level VARCHAR(20),
    assessment_details JSONB,
    recommended_multiplier DECIMAL(4,2),
    multiplier_range_min DECIMAL(4,2),
    multiplier_range_max DECIMAL(4,2),
    confidence_score DECIMAL(3,2),
    assessed_by BIGINT REFERENCES users(id),
    assessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version INTEGER DEFAULT 1
);

CREATE INDEX idx_complexity_project ON complexity_assessments(project_id);

-- 5.3 项目特征向量表
CREATE TABLE project_features (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    feature_vector JSONB NOT NULL,
    auto_extracted_features JSONB,
    manual_features JSONB,
    feature_version VARCHAR(20),
    extracted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, feature_version)
);

CREATE INDEX idx_features_project ON project_features(project_id);

-- 5.4 相似项目匹配表
CREATE TABLE similar_projects (
    id BIGSERIAL PRIMARY KEY,
    target_project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    similar_project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    similarity_score DECIMAL(5,4),
    categorical_similarity DECIMAL(5,4),
    scale_similarity DECIMAL(5,4),
    complexity_similarity DECIMAL(5,4),
    matching_method VARCHAR(50),
    matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(target_project_id, similar_project_id)
);

CREATE INDEX idx_similar_target ON similar_projects(target_project_id);
CREATE INDEX idx_similar_score ON similar_projects(similarity_score DESC);
CREATE INDEX idx_similar_composite ON similar_projects(target_project_id, similarity_score DESC);

-- 5.5 评估结果表
CREATE TABLE estimation_results (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    estimation_version VARCHAR(20),
    rule_based_estimate DECIMAL(10,1),
    similarity_based_estimate DECIMAL(10,1),
    ml_based_estimate DECIMAL(10,1),
    llm_based_estimate DECIMAL(10,1),
    ensemble_estimate DECIMAL(10,1),
    final_estimate DECIMAL(10,1),
    optimistic_estimate DECIMAL(10,1),
    most_likely_estimate DECIMAL(10,1),
    pessimistic_estimate DECIMAL(10,1),
    expected_estimate DECIMAL(10,1),
    std_deviation DECIMAL(10,2),
    confidence_interval_low DECIMAL(10,1),
    confidence_interval_high DECIMAL(10,1),
    disagreement_score DECIMAL(5,4),
    overall_confidence DECIMAL(3,2),
    confidence_level VARCHAR(20),
    estimation_breakdown JSONB,
    model_weights JSONB,
    estimated_by BIGINT REFERENCES users(id),
    estimated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    adjusted_by BIGINT REFERENCES users(id),
    adjusted_at TIMESTAMP,
    adjustment_reason TEXT
);

CREATE INDEX idx_estimation_project ON estimation_results(project_id);
CREATE INDEX idx_estimation_version ON estimation_results(project_id, estimation_version);

-- 5.6 ML模型性能跟踪表
CREATE TABLE ml_model_performance (
    id BIGSERIAL PRIMARY KEY,
    model_id BIGINT REFERENCES estimation_models(id),
    evaluation_date DATE,
    mae DECIMAL(10,2),
    rmse DECIMAL(10,2),
    mape DECIMAL(5,2),
    r2_score DECIMAL(5,4),
    sample_size INTEGER,
    trend VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ml_performance_model ON ml_model_performance(model_id);
CREATE INDEX idx_ml_performance_date ON ml_model_performance(evaluation_date);

-- ============================================
-- 6. 分析与报告模块
-- ============================================

-- 6.1 项目报告表
CREATE TABLE project_reports (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    report_type VARCHAR(50),
    report_name VARCHAR(200),
    report_period_start DATE,
    report_period_end DATE,
    report_data JSONB NOT NULL,
    key_metrics JSONB,
    report_file_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'draft',
    generated_by BIGINT REFERENCES users(id),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_by BIGINT REFERENCES users(id),
    approved_at TIMESTAMP
);

CREATE INDEX idx_reports_project ON project_reports(project_id);
CREATE INDEX idx_reports_type ON project_reports(report_type);

-- 6.2 偏差分析表
CREATE TABLE deviation_analysis (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    task_id BIGINT REFERENCES wbs_tasks(id),
    analysis_date DATE,
    planned_hours DECIMAL(10,1),
    actual_hours DECIMAL(10,1),
    variance_hours DECIMAL(10,1),
    variance_percentage DECIMAL(5,2),
    deviation_type VARCHAR(50),
    severity VARCHAR(20),
    root_causes JSONB,
    analysis_notes TEXT,
    corrective_actions TEXT,
    lessons_learned TEXT,
    analyzed_by BIGINT REFERENCES users(id),
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_deviation_project ON deviation_analysis(project_id);
CREATE INDEX idx_deviation_task ON deviation_analysis(task_id);
CREATE INDEX idx_deviation_date ON deviation_analysis(analysis_date);

-- 6.3 风险登记表
CREATE TABLE risk_registers (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    risk_title VARCHAR(200) NOT NULL,
    risk_description TEXT,
    risk_category VARCHAR(50),
    probability DECIMAL(3,2),
    impact VARCHAR(20),
    impact_hours DECIMAL(10,1),
    risk_level VARCHAR(20),
    risk_score DECIMAL(5,2),
    mitigation_strategy TEXT,
    contingency_plan TEXT,
    owner_id BIGINT REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'open',
    identified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    identified_by BIGINT REFERENCES users(id),
    closed_at TIMESTAMP
);

CREATE INDEX idx_risks_project ON risk_registers(project_id);
CREATE INDEX idx_risks_status ON risk_registers(status);
CREATE INDEX idx_risks_level ON risk_registers(risk_level);

-- 6.4 经验教训表
CREATE TABLE lessons_learned (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    category VARCHAR(50),
    type VARCHAR(20),
    title VARCHAR(200),
    description TEXT,
    context TEXT,
    impact_level VARCHAR(20),
    recommendations TEXT,
    tags JSONB,
    applied_to_model BOOLEAN DEFAULT false,
    recorded_by BIGINT REFERENCES users(id),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lessons_project ON lessons_learned(project_id);
CREATE INDEX idx_lessons_category ON lessons_learned(category);

-- ============================================
-- 7. 视图定义
-- ============================================

-- 7.1 项目统计视图
CREATE VIEW v_project_statistics AS
SELECT
    p.id,
    p.name,
    p.code,
    p.status,
    COUNT(DISTINCT t.id) as total_tasks,
    COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.id END) as completed_tasks,
    SUM(t.estimated_hours) as total_estimated_hours,
    SUM(t.actual_hours) as total_actual_hours,
    CASE
        WHEN SUM(t.estimated_hours) > 0
        THEN ((SUM(t.actual_hours) - SUM(t.estimated_hours)) / SUM(t.estimated_hours) * 100)
        ELSE 0
    END as variance_percentage,
    AVG(t.progress_percentage) as avg_progress,
    COUNT(DISTINCT pm.user_id) as team_size
FROM projects p
LEFT JOIN wbs_tasks t ON p.id = t.project_id
LEFT JOIN project_members pm ON p.id = pm.project_id
GROUP BY p.id, p.name, p.code, p.status;

-- 7.2 用户工作负荷视图
CREATE VIEW v_user_workload AS
SELECT
    u.id,
    u.full_name,
    u.department,
    COUNT(DISTINCT t.id) as assigned_tasks,
    COUNT(DISTINCT CASE WHEN t.status = 'in_progress' THEN t.id END) as active_tasks,
    SUM(t.estimated_hours - COALESCE(t.actual_hours, 0)) as remaining_hours,
    COALESCE(SUM(CASE
        WHEN ts.work_date >= date_trunc('week', CURRENT_DATE)
        THEN ts.hours
    END), 0) as this_week_hours
FROM users u
LEFT JOIN wbs_tasks t ON u.id = t.assignee_id AND t.status != 'completed'
LEFT JOIN timesheets ts ON u.id = ts.user_id
GROUP BY u.id, u.full_name, u.department;

-- ============================================
-- 8. 触发器函数
-- ============================================

-- 8.1 更新updated_at字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 应用到需要的表
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wbs_tasks_updated_at BEFORE UPDATE ON wbs_tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8.2 自动更新项目实际工时
CREATE OR REPLACE FUNCTION update_project_actual_hours()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE projects
    SET actual_hours = (
        SELECT COALESCE(SUM(actual_hours), 0)
        FROM wbs_tasks
        WHERE project_id = NEW.project_id
    )
    WHERE id = NEW.project_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_project_hours_on_task_change
AFTER INSERT OR UPDATE OR DELETE ON wbs_tasks
FOR EACH ROW EXECUTE FUNCTION update_project_actual_hours();

-- ============================================
-- 9. 初始化数据
-- ============================================

-- 9.1 创建默认管理员用户
INSERT INTO users (username, email, password_hash, full_name, is_admin, status)
VALUES ('admin', 'admin@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5jwK.X3fOhJxi', '系统管理员', true, 'active');

-- 9.2 创建默认组织
INSERT INTO organizations (name, code, type, status)
VALUES ('默认组织', 'ORG001', 'company', 'active');

-- 9.3 创建评估模型基础参数
INSERT INTO estimation_models (
    model_name, model_version, model_type, task_type,
    base_hours_per_unit, unit_type, status, is_default
) VALUES
('ETL开发-按数据源', 'v1.0', 'rule_based', 'etl_development', 40.0, 'data_source', 'active', true),
('接口表开发', 'v1.0', 'rule_based', 'interface_development', 6.0, 'table', 'active', true),
('报表开发', 'v1.0', 'rule_based', 'report_development', 12.0, 'report', 'active', true),
('项目管理', 'v1.0', 'rule_based', 'project_management', 0.1, 'percentage', 'active', true),
('需求分析', 'v1.0', 'rule_based', 'requirement_analysis', 0.15, 'percentage', 'active', true);

-- 9.4 创建复杂度调整系数
UPDATE estimation_models
SET complexity_multipliers = '{"simple": 0.8, "medium": 1.0, "complex": 1.4, "very_complex": 1.8}'::jsonb
WHERE task_type = 'etl_development';

-- ============================================
-- 10. 注释
-- ============================================

COMMENT ON TABLE projects IS '项目主表,存储项目基本信息和评估结果';
COMMENT ON TABLE wbs_tasks IS 'WBS任务分解结构表';
COMMENT ON TABLE timesheets IS '工时记录表,记录实际工作时间';
COMMENT ON TABLE estimation_models IS '评估模型参数表,存储各种评估规则和模型';
COMMENT ON TABLE similar_projects IS '相似项目匹配表,用于案例推理';
COMMENT ON TABLE complexity_assessments IS '项目复杂度评估表';

COMMENT ON COLUMN projects.complexity_score IS '综合复杂度分数,0-10';
COMMENT ON COLUMN projects.variance_percentage IS '工时偏差百分比';
COMMENT ON COLUMN wbs_tasks.wbs_code IS 'WBS编码,如1.1.1';
COMMENT ON COLUMN wbs_tasks.estimated_hours IS '评估工时(人时)';
COMMENT ON COLUMN timesheets.hours IS '工作时长,0-24小时';

-- ============================================
-- Schema创建完成
-- ============================================
