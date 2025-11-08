# 项目成本智能评估系统 - 数据库设计文档

## 1. 数据库架构概览

### 1.1 技术选型
- **数据库**: PostgreSQL 14+
- **备选**: MySQL 8.0+ / SQLite (开发环境)
- **ORM**: SQLAlchemy
- **迁移工具**: Alembic

### 1.2 核心模块

```
┌─────────────────────────────────────────────────┐
│                  用户与组织                       │
│  users, organizations, teams, roles             │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│                  项目管理                         │
│  projects, project_members, project_documents   │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│                  WBS与任务                       │
│  wbs_tasks, task_dependencies                   │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│                  工时与成本                       │
│  timesheets, cost_records, baselines            │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│                  智能评估                         │
│  estimation_models, complexity_assessments,     │
│  similar_projects, ml_predictions               │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│                  分析与报告                       │
│  project_reports, deviation_analysis, insights  │
└─────────────────────────────────────────────────┘
```

---

## 2. 详细表结构设计

### 2.1 用户与组织模块

#### 2.1.1 users - 用户表
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(255),
    phone VARCHAR(20),

    -- 职位信息
    job_title VARCHAR(100),
    department VARCHAR(100),
    employee_id VARCHAR(50),

    -- 技能与经验
    skills JSONB, -- ["Java", "Python", "项目管理"]
    experience_years DECIMAL(4,1),
    hourly_rate DECIMAL(10,2), -- 每小时成本

    -- 状态
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, locked
    is_admin BOOLEAN DEFAULT false,

    -- 审计字段
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    created_by BIGINT REFERENCES users(id)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
```

#### 2.1.2 organizations - 组织表
```sql
CREATE TABLE organizations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(50), -- company, department, business_unit
    parent_id BIGINT REFERENCES organizations(id),

    -- 组织信息
    description TEXT,
    address TEXT,
    contact_info JSONB,

    -- 状态
    status VARCHAR(20) DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_org_parent ON organizations(parent_id);
CREATE INDEX idx_org_code ON organizations(code);
```

#### 2.1.3 teams - 团队表
```sql
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
```

#### 2.1.4 team_members - 团队成员表
```sql
CREATE TABLE team_members (
    id BIGSERIAL PRIMARY KEY,
    team_id BIGINT REFERENCES teams(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50), -- member, lead, backup
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(team_id, user_id)
);

CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);
```

---

### 2.2 项目管理模块

#### 2.2.1 projects - 项目表
```sql
CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,

    -- 基本信息
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,

    -- 项目分类
    project_type VARCHAR(50) NOT NULL, -- regulatory_reporting, system_integration, etc.
    regulation_type VARCHAR(100), -- 1104报送, EAST, etc.
    client_name VARCHAR(200) NOT NULL,
    client_type VARCHAR(50), -- state_owned_bank, joint_stock, city_bank

    -- 项目规模参数
    data_sources_count INTEGER DEFAULT 0,
    interface_tables_count INTEGER DEFAULT 0,
    reports_count INTEGER DEFAULT 0,
    custom_requirements_count INTEGER DEFAULT 0,
    data_volume_level VARCHAR(20), -- small, medium, large, very_large

    -- 项目状态
    status VARCHAR(50) DEFAULT 'planning', -- planning, approved, in_progress, completed, cancelled
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent

    -- 时间规划
    planned_start_date DATE,
    planned_end_date DATE,
    actual_start_date DATE,
    actual_end_date DATE,

    -- 预算与成本
    budget_amount DECIMAL(15,2),
    contract_amount DECIMAL(15,2),

    -- 团队
    project_manager_id BIGINT REFERENCES users(id),
    organization_id BIGINT REFERENCES organizations(id),

    -- 评估信息
    complexity_score DECIMAL(3,1), -- 0-10
    complexity_level VARCHAR(20), -- simple, medium, complex, very_complex
    estimated_hours DECIMAL(10,1),
    actual_hours DECIMAL(10,1),
    variance_percentage DECIMAL(5,2),

    -- 当前基线
    current_baseline_id BIGINT,

    -- 文档
    sow_document_url VARCHAR(500),

    -- 审计
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
```

#### 2.2.2 project_members - 项目成员表
```sql
CREATE TABLE project_members (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id),

    role VARCHAR(50) NOT NULL, -- pm, architect, developer, tester, ba
    allocation_percentage DECIMAL(5,2) DEFAULT 100, -- 0-100

    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP,

    UNIQUE(project_id, user_id, role)
);

CREATE INDEX idx_project_members_project ON project_members(project_id);
CREATE INDEX idx_project_members_user ON project_members(user_id);
```

#### 2.2.3 project_documents - 项目文档表
```sql
CREATE TABLE project_documents (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,

    document_type VARCHAR(50), -- sow, requirement, design, test_plan, report
    title VARCHAR(200) NOT NULL,
    file_name VARCHAR(255),
    file_url VARCHAR(500),
    file_size BIGINT, -- bytes
    mime_type VARCHAR(100),

    -- 解析后的内容
    parsed_content TEXT,
    extracted_metadata JSONB,

    version VARCHAR(20),
    status VARCHAR(20) DEFAULT 'draft', -- draft, approved, archived

    uploaded_by BIGINT REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_documents_project ON project_documents(project_id);
CREATE INDEX idx_documents_type ON project_documents(document_type);
```

---

### 2.3 WBS与任务模块

#### 2.3.1 wbs_tasks - WBS任务表
```sql
CREATE TABLE wbs_tasks (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    parent_task_id BIGINT REFERENCES wbs_tasks(id) ON DELETE CASCADE,

    -- 任务编号与名称
    wbs_code VARCHAR(50) NOT NULL, -- 1.1.1
    task_name VARCHAR(200) NOT NULL,
    description TEXT,

    -- 任务分类
    task_level INTEGER NOT NULL, -- 1, 2, 3, 4
    task_type VARCHAR(50), -- pm, requirement, development, testing, delivery
    task_category VARCHAR(50), -- etl_dev, report_dev, testing, etc.

    -- 工时评估
    estimated_hours DECIMAL(10,1),
    optimistic_hours DECIMAL(10,1),
    pessimistic_hours DECIMAL(10,1),
    actual_hours DECIMAL(10,1) DEFAULT 0,

    -- 进度
    progress_percentage DECIMAL(5,2) DEFAULT 0, -- 0-100
    status VARCHAR(50) DEFAULT 'not_started', -- not_started, in_progress, completed, cancelled

    -- 时间规划
    planned_start_date DATE,
    planned_end_date DATE,
    actual_start_date DATE,
    actual_end_date DATE,

    -- 资源分配
    assignee_id BIGINT REFERENCES users(id),

    -- 复杂度
    complexity VARCHAR(20), -- simple, medium, complex
    risk_level VARCHAR(20), -- low, medium, high

    -- 是否里程碑
    is_milestone BOOLEAN DEFAULT false,

    -- 排序
    sort_order INTEGER,

    -- 审计
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
```

#### 2.3.2 task_dependencies - 任务依赖表
```sql
CREATE TABLE task_dependencies (
    id BIGSERIAL PRIMARY KEY,
    predecessor_task_id BIGINT REFERENCES wbs_tasks(id) ON DELETE CASCADE,
    successor_task_id BIGINT REFERENCES wbs_tasks(id) ON DELETE CASCADE,

    dependency_type VARCHAR(20) DEFAULT 'FS', -- FS(finish-start), SS, FF, SF
    lag_days INTEGER DEFAULT 0, -- 滞后天数

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(predecessor_task_id, successor_task_id)
);

CREATE INDEX idx_dependencies_predecessor ON task_dependencies(predecessor_task_id);
CREATE INDEX idx_dependencies_successor ON task_dependencies(successor_task_id);
```

---

### 2.4 工时与成本模块

#### 2.4.1 timesheets - 工时记录表
```sql
CREATE TABLE timesheets (
    id BIGSERIAL PRIMARY KEY,

    task_id BIGINT REFERENCES wbs_tasks(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id),
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,

    -- 工时信息
    work_date DATE NOT NULL,
    hours DECIMAL(5,2) NOT NULL, -- 0-24

    -- 工作描述
    description TEXT,
    work_category VARCHAR(50), -- development, testing, meeting, review

    -- 进度更新
    task_progress_percentage DECIMAL(5,2), -- 完成后的进度

    -- 问题记录
    issues_encountered TEXT,

    -- 状态
    status VARCHAR(20) DEFAULT 'submitted', -- draft, submitted, approved, rejected

    -- 审批
    approved_by BIGINT REFERENCES users(id),
    approved_at TIMESTAMP,

    -- 审计
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
```

#### 2.4.2 baselines - 项目基线表
```sql
CREATE TABLE baselines (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,

    -- 基线信息
    version VARCHAR(20) NOT NULL,
    baseline_name VARCHAR(200),
    description TEXT,

    -- 快照数据
    baseline_data JSONB NOT NULL, -- 完整的WBS和评估数据快照

    -- 汇总指标
    total_planned_hours DECIMAL(10,1),
    total_budget DECIMAL(15,2),
    planned_start_date DATE,
    planned_end_date DATE,

    -- 状态
    is_current BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'draft', -- draft, approved, superseded

    -- 审批
    approved_by BIGINT REFERENCES users(id),
    approved_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT REFERENCES users(id),

    UNIQUE(project_id, version)
);

CREATE INDEX idx_baselines_project ON baselines(project_id);
CREATE INDEX idx_baselines_current ON baselines(project_id, is_current);
```

---

### 2.5 智能评估模块

#### 2.5.1 estimation_models - 评估模型参数表
```sql
CREATE TABLE estimation_models (
    id BIGSERIAL PRIMARY KEY,

    -- 模型信息
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(20) NOT NULL,
    model_type VARCHAR(50), -- rule_based, regression, random_forest, neural_network

    -- 任务类型
    task_type VARCHAR(50), -- pm, requirement, etl_dev, testing, etc.
    task_category VARCHAR(50),

    -- 基础参数
    base_hours DECIMAL(10,2),
    base_hours_per_unit DECIMAL(10,2), -- 如每个数据源40小时
    unit_type VARCHAR(50), -- data_source, table, report, requirement

    -- 调整系数
    complexity_multipliers JSONB, -- {"simple": 0.8, "medium": 1.0, "complex": 1.4}
    adjustment_rules JSONB, -- 各种调整规则

    -- 模型性能
    r2_score DECIMAL(5,4),
    mae DECIMAL(10,2), -- Mean Absolute Error
    mape DECIMAL(5,2), -- Mean Absolute Percentage Error
    confidence_level DECIMAL(5,4),

    -- 训练信息
    training_samples_count INTEGER,
    feature_importance JSONB,

    -- 模型文件
    model_file_url VARCHAR(500), -- 序列化的模型文件

    -- 状态
    status VARCHAR(20) DEFAULT 'active', -- active, deprecated, testing
    is_default BOOLEAN DEFAULT false,

    -- 审计
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_trained_at TIMESTAMP,

    UNIQUE(model_name, model_version)
);

CREATE INDEX idx_estimation_models_type ON estimation_models(task_type);
CREATE INDEX idx_estimation_models_status ON estimation_models(status);
```

#### 2.5.2 complexity_assessments - 复杂度评估表
```sql
CREATE TABLE complexity_assessments (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,

    -- 评估方法
    assessment_method VARCHAR(50), -- interactive, automatic, hybrid

    -- 各维度分数
    technical_complexity DECIMAL(3,1), -- 0-10
    business_complexity DECIMAL(3,1),
    data_complexity DECIMAL(3,1),
    organizational_complexity DECIMAL(3,1),
    risk_factors DECIMAL(3,1),

    -- 综合分数
    total_score DECIMAL(3,1),
    complexity_level VARCHAR(20), -- simple, medium, complex, very_complex

    -- 详细评估数据
    assessment_details JSONB, -- 问卷答案、具体评分细节

    -- 推荐的调整系数
    recommended_multiplier DECIMAL(4,2),
    multiplier_range_min DECIMAL(4,2),
    multiplier_range_max DECIMAL(4,2),

    -- 置信度
    confidence_score DECIMAL(3,2), -- 0-1

    -- 评估人
    assessed_by BIGINT REFERENCES users(id),
    assessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- 版本
    version INTEGER DEFAULT 1
);

CREATE INDEX idx_complexity_project ON complexity_assessments(project_id);
```

#### 2.5.3 project_features - 项目特征向量表
```sql
CREATE TABLE project_features (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,

    -- 基础特征
    feature_vector JSONB NOT NULL, -- 标准化的特征向量

    -- 自动提取的特征
    auto_extracted_features JSONB,

    -- 人工标注的特征
    manual_features JSONB,

    -- 特征版本
    feature_version VARCHAR(20),

    extracted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(project_id, feature_version)
);

CREATE INDEX idx_features_project ON project_features(project_id);
```

#### 2.5.4 similar_projects - 相似项目匹配表
```sql
CREATE TABLE similar_projects (
    id BIGSERIAL PRIMARY KEY,

    target_project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    similar_project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,

    -- 相似度分数
    similarity_score DECIMAL(5,4), -- 0-1

    -- 分项相似度
    categorical_similarity DECIMAL(5,4),
    scale_similarity DECIMAL(5,4),
    complexity_similarity DECIMAL(5,4),

    -- 匹配方法
    matching_method VARCHAR(50), -- cosine, euclidean, hybrid

    -- 匹配时间
    matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(target_project_id, similar_project_id)
);

CREATE INDEX idx_similar_target ON similar_projects(target_project_id);
CREATE INDEX idx_similar_score ON similar_projects(similarity_score DESC);
```

#### 2.5.5 estimation_results - 评估结果表
```sql
CREATE TABLE estimation_results (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,

    -- 评估版本
    estimation_version VARCHAR(20),

    -- 各模型的预测
    rule_based_estimate DECIMAL(10,1),
    similarity_based_estimate DECIMAL(10,1),
    ml_based_estimate DECIMAL(10,1),
    llm_based_estimate DECIMAL(10,1),

    -- 融合结果
    ensemble_estimate DECIMAL(10,1),
    final_estimate DECIMAL(10,1), -- 经人工调整后

    -- 三点估算
    optimistic_estimate DECIMAL(10,1),
    most_likely_estimate DECIMAL(10,1),
    pessimistic_estimate DECIMAL(10,1),
    expected_estimate DECIMAL(10,1), -- PERT加权

    -- 不确定性
    std_deviation DECIMAL(10,2),
    confidence_interval_low DECIMAL(10,1),
    confidence_interval_high DECIMAL(10,1),

    -- 模型分歧度
    disagreement_score DECIMAL(5,4),

    -- 置信度
    overall_confidence DECIMAL(3,2),
    confidence_level VARCHAR(20), -- high, medium, low

    -- 详细数据
    estimation_breakdown JSONB, -- 各阶段、各任务的评估明细
    model_weights JSONB, -- 各模型的权重

    -- 评估人
    estimated_by BIGINT REFERENCES users(id),
    estimated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- 人工调整
    adjusted_by BIGINT REFERENCES users(id),
    adjusted_at TIMESTAMP,
    adjustment_reason TEXT
);

CREATE INDEX idx_estimation_project ON estimation_results(project_id);
CREATE INDEX idx_estimation_version ON estimation_results(project_id, estimation_version);
```

#### 2.5.6 ml_model_performance - ML模型性能跟踪表
```sql
CREATE TABLE ml_model_performance (
    id BIGSERIAL PRIMARY KEY,
    model_id BIGINT REFERENCES estimation_models(id),

    -- 评估时间段
    evaluation_date DATE,

    -- 性能指标
    mae DECIMAL(10,2),
    rmse DECIMAL(10,2),
    mape DECIMAL(5,2),
    r2_score DECIMAL(5,4),

    -- 评估样本
    sample_size INTEGER,

    -- 性能趋势
    trend VARCHAR(20), -- improving, stable, degrading

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ml_performance_model ON ml_model_performance(model_id);
CREATE INDEX idx_ml_performance_date ON ml_model_performance(evaluation_date);
```

---

### 2.6 分析与报告模块

#### 2.6.1 project_reports - 项目报告表
```sql
CREATE TABLE project_reports (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,

    -- 报告类型
    report_type VARCHAR(50), -- estimation, progress, closure, deviation_analysis
    report_name VARCHAR(200),

    -- 报告时间
    report_period_start DATE,
    report_period_end DATE,

    -- 报告数据
    report_data JSONB NOT NULL,

    -- 关键指标
    key_metrics JSONB,

    -- 报告文件
    report_file_url VARCHAR(500),

    -- 状态
    status VARCHAR(20) DEFAULT 'draft',

    -- 生成信息
    generated_by BIGINT REFERENCES users(id),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- 审批
    approved_by BIGINT REFERENCES users(id),
    approved_at TIMESTAMP
);

CREATE INDEX idx_reports_project ON project_reports(project_id);
CREATE INDEX idx_reports_type ON project_reports(report_type);
```

#### 2.6.2 deviation_analysis - 偏差分析表
```sql
CREATE TABLE deviation_analysis (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    task_id BIGINT REFERENCES wbs_tasks(id),

    -- 分析时间
    analysis_date DATE,

    -- 偏差数据
    planned_hours DECIMAL(10,1),
    actual_hours DECIMAL(10,1),
    variance_hours DECIMAL(10,1),
    variance_percentage DECIMAL(5,2),

    -- 偏差分类
    deviation_type VARCHAR(50), -- overrun, underrun
    severity VARCHAR(20), -- low, medium, high, critical

    -- 根本原因
    root_causes JSONB, -- [{"cause": "需求变更", "impact": 0.3}]

    -- 分析结果
    analysis_notes TEXT,
    corrective_actions TEXT,
    lessons_learned TEXT,

    -- 分析人
    analyzed_by BIGINT REFERENCES users(id),
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_deviation_project ON deviation_analysis(project_id);
CREATE INDEX idx_deviation_task ON deviation_analysis(task_id);
CREATE INDEX idx_deviation_date ON deviation_analysis(analysis_date);
```

#### 2.6.3 risk_registers - 风险登记表
```sql
CREATE TABLE risk_registers (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,

    -- 风险信息
    risk_title VARCHAR(200) NOT NULL,
    risk_description TEXT,
    risk_category VARCHAR(50), -- technical, business, resource, schedule

    -- 风险评估
    probability DECIMAL(3,2), -- 0-1
    impact VARCHAR(20), -- low, medium, high, critical
    impact_hours DECIMAL(10,1), -- 预计影响的小时数

    -- 风险等级
    risk_level VARCHAR(20), -- low, medium, high, critical
    risk_score DECIMAL(5,2), -- probability * impact

    -- 应对策略
    mitigation_strategy TEXT,
    contingency_plan TEXT,

    -- 责任人
    owner_id BIGINT REFERENCES users(id),

    -- 状态
    status VARCHAR(20) DEFAULT 'open', -- open, monitoring, closed, occurred

    -- 审计
    identified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    identified_by BIGINT REFERENCES users(id),
    closed_at TIMESTAMP
);

CREATE INDEX idx_risks_project ON risk_registers(project_id);
CREATE INDEX idx_risks_status ON risk_registers(status);
CREATE INDEX idx_risks_level ON risk_registers(risk_level);
```

#### 2.6.4 lessons_learned - 经验教训表
```sql
CREATE TABLE lessons_learned (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,

    -- 分类
    category VARCHAR(50), -- estimation, execution, communication, technical
    type VARCHAR(20), -- positive, negative

    -- 内容
    title VARCHAR(200),
    description TEXT,
    context TEXT, -- 当时的情况

    -- 影响
    impact_level VARCHAR(20), -- low, medium, high

    -- 建议
    recommendations TEXT,

    -- 标签
    tags JSONB, -- ["需求变更", "数据质量"]

    -- 是否应用到评估模型
    applied_to_model BOOLEAN DEFAULT false,

    -- 记录人
    recorded_by BIGINT REFERENCES users(id),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lessons_project ON lessons_learned(project_id);
CREATE INDEX idx_lessons_category ON lessons_learned(category);
```

---

## 3. 数据库关系图

### 3.1 主要实体关系

```
users ──┬─── projects (project_manager_id)
        ├─── project_members
        ├─── wbs_tasks (assignee_id)
        ├─── timesheets
        └─── teams (team_lead_id)

projects ──┬─── wbs_tasks
           ├─── project_members
           ├─── project_documents
           ├─── baselines
           ├─── complexity_assessments
           ├─── estimation_results
           ├─── timesheets
           ├─── project_reports
           ├─── similar_projects
           └─── risk_registers

wbs_tasks ──┬─── wbs_tasks (self-reference: parent_task_id)
            ├─── task_dependencies
            ├─── timesheets
            └─── deviation_analysis

estimation_models ──── ml_model_performance
```

### 3.2 关键约束

1. **级联删除**:
   - 项目删除 → 级联删除所有相关数据 (wbs_tasks, timesheets, etc.)
   - 任务删除 → 级联删除工时记录和子任务

2. **唯一性约束**:
   - 项目代码全局唯一
   - WBS编码在项目内唯一
   - 用户邮箱唯一

3. **检查约束**:
   - 工时: 0-24小时
   - 进度: 0-100%
   - 日期: 结束 >= 开始

---

## 4. 索引策略

### 4.1 高频查询索引

```sql
-- 项目查询
CREATE INDEX idx_projects_composite ON projects(status, project_type, client_type);

-- 任务查询
CREATE INDEX idx_tasks_composite ON wbs_tasks(project_id, status, assignee_id);

-- 工时查询
CREATE INDEX idx_timesheets_composite ON timesheets(project_id, user_id, work_date);

-- 相似项目查询
CREATE INDEX idx_similar_composite ON similar_projects(target_project_id, similarity_score DESC);
```

### 4.2 全文搜索索引 (PostgreSQL)

```sql
-- 项目全文搜索
CREATE INDEX idx_projects_fulltext ON projects USING gin(to_tsvector('english', name || ' ' || description));

-- 任务全文搜索
CREATE INDEX idx_tasks_fulltext ON wbs_tasks USING gin(to_tsvector('english', task_name || ' ' || COALESCE(description, '')));
```

---

## 5. 视图定义

### 5.1 项目统计视图

```sql
CREATE VIEW v_project_statistics AS
SELECT
    p.id,
    p.name,
    p.code,
    p.status,

    -- 任务统计
    COUNT(DISTINCT t.id) as total_tasks,
    COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.id END) as completed_tasks,

    -- 工时统计
    SUM(t.estimated_hours) as total_estimated_hours,
    SUM(t.actual_hours) as total_actual_hours,

    -- 偏差
    CASE
        WHEN SUM(t.estimated_hours) > 0
        THEN ((SUM(t.actual_hours) - SUM(t.estimated_hours)) / SUM(t.estimated_hours) * 100)
        ELSE 0
    END as variance_percentage,

    -- 进度
    AVG(t.progress_percentage) as avg_progress,

    -- 人员
    COUNT(DISTINCT pm.user_id) as team_size

FROM projects p
LEFT JOIN wbs_tasks t ON p.id = t.project_id
LEFT JOIN project_members pm ON p.id = pm.project_id
GROUP BY p.id;
```

### 5.2 用户工作负荷视图

```sql
CREATE VIEW v_user_workload AS
SELECT
    u.id,
    u.full_name,

    -- 分配的任务数
    COUNT(DISTINCT t.id) as assigned_tasks,
    COUNT(DISTINCT CASE WHEN t.status = 'in_progress' THEN t.id END) as active_tasks,

    -- 剩余工时
    SUM(t.estimated_hours - COALESCE(t.actual_hours, 0)) as remaining_hours,

    -- 本周工时
    COALESCE(SUM(CASE
        WHEN ts.work_date >= date_trunc('week', CURRENT_DATE)
        THEN ts.hours
    END), 0) as this_week_hours

FROM users u
LEFT JOIN wbs_tasks t ON u.id = t.assignee_id AND t.status != 'completed'
LEFT JOIN timesheets ts ON u.id = ts.user_id
GROUP BY u.id;
```

---

## 6. 数据迁移考虑

### 6.1 从现有PMP系统迁移

```sql
-- 迁移映射表
CREATE TABLE migration_mappings (
    id BIGSERIAL PRIMARY KEY,
    source_system VARCHAR(50),
    source_entity VARCHAR(50),
    source_id VARCHAR(100),
    target_entity VARCHAR(50),
    target_id BIGINT,
    migrated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6.2 数据验证

```sql
-- 数据完整性检查
CREATE TABLE data_quality_checks (
    id BIGSERIAL PRIMARY KEY,
    check_type VARCHAR(50),
    check_query TEXT,
    expected_result TEXT,
    actual_result TEXT,
    status VARCHAR(20),
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 7. 性能优化建议

### 7.1 分区策略

```sql
-- 工时记录按月分区
CREATE TABLE timesheets_partitioned (
    LIKE timesheets INCLUDING ALL
) PARTITION BY RANGE (work_date);

CREATE TABLE timesheets_2025_01 PARTITION OF timesheets_partitioned
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

### 7.2 缓存策略

- 项目统计信息: Redis缓存, TTL=5分钟
- 评估模型参数: 应用内存缓存
- 相似项目匹配: 预计算并缓存

---

## 8. 安全考虑

### 8.1 行级安全 (RLS)

```sql
-- 启用行级安全
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 策略: 用户只能看到自己参与的项目
CREATE POLICY project_access_policy ON projects
    FOR SELECT
    USING (
        project_manager_id = current_setting('app.current_user_id')::BIGINT
        OR
        id IN (
            SELECT project_id FROM project_members
            WHERE user_id = current_setting('app.current_user_id')::BIGINT
        )
    );
```

### 8.2 敏感数据加密

- 密码: bcrypt加密
- 成本数据: 考虑列级加密
- 审计日志: 不可修改

---

## 9. 备份与恢复

### 9.1 备份策略

- 全量备份: 每日凌晨
- 增量备份: 每小时
- WAL归档: 实时
- 保留周期: 30天

### 9.2 灾难恢复

- RPO (恢复点目标): 1小时
- RTO (恢复时间目标): 4小时
- 异地备份: 是

---

## 10. 总结

### 10.1 表统计

| 模块 | 表数量 | 说明 |
|------|--------|------|
| 用户与组织 | 4 | users, organizations, teams, team_members |
| 项目管理 | 3 | projects, project_members, project_documents |
| WBS与任务 | 2 | wbs_tasks, task_dependencies |
| 工时与成本 | 2 | timesheets, baselines |
| 智能评估 | 6 | estimation_models, complexity_assessments, etc. |
| 分析与报告 | 4 | project_reports, deviation_analysis, etc. |
| **总计** | **21** | 核心业务表 |

### 10.2 下一步

- [ ] 执行SQL脚本创建数据库
- [ ] 初始化测试数据
- [ ] 开发ORM模型
- [ ] API接口开发
