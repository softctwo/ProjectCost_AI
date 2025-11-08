"""
FastAPI应用 - 项目成本智能评估系统
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from decimal import Decimal

from app.core.estimator import ProjectInfo, estimate_project, WorkloadEstimator
from app.core.similarity import (
    HistoricalProject,
    ProjectSimilarityMatcher,
    CaseBasedEstimator,
    find_and_estimate
)


# ============================================
# Pydantic Models
# ============================================

class ProjectInfoRequest(BaseModel):
    """项目信息请求模型"""
    name: str = Field(..., description="项目名称")
    project_type: str = Field(..., description="项目类型")
    client_type: str = Field(..., description="客户类型")
    data_sources_count: int = Field(..., ge=0, description="数据源数量")
    interface_tables_count: int = Field(..., ge=0, description="接口表数量")
    reports_count: int = Field(..., ge=0, description="报表数量")
    custom_requirements_count: int = Field(default=0, ge=0, description="个性化需求数量")
    data_volume_level: str = Field(default="medium", description="数据量级")
    regulation_type: Optional[str] = Field(default=None, description="监管类型")

    class Config:
        json_schema_extra = {
            "example": {
                "name": "某银行1104报送项目",
                "project_type": "regulatory_reporting",
                "client_type": "state_owned_bank",
                "data_sources_count": 8,
                "interface_tables_count": 120,
                "reports_count": 15,
                "custom_requirements_count": 3,
                "data_volume_level": "large",
                "regulation_type": "1104报送"
            }
        }


class ComplexityScoreResponse(BaseModel):
    """复杂度评分响应"""
    technical: float
    business: float
    data: float
    organizational: float
    risk: float
    total: float
    level: str


class EstimationResponse(BaseModel):
    """评估结果响应"""
    total_hours: float
    optimistic: float
    most_likely: float
    pessimistic: float
    expected: float
    std_deviation: float
    confidence_interval: tuple
    phase_breakdown: Dict[str, float]
    complexity_score: ComplexityScoreResponse
    confidence_level: str
    wbs_summary: Dict


class HistoricalProjectData(BaseModel):
    """历史项目数据"""
    id: int
    name: str
    project_type: str
    client_type: str
    data_sources_count: int
    interface_tables_count: int
    reports_count: int
    custom_requirements_count: int
    complexity_score: float
    actual_hours: float
    variance_percentage: float


class SimilaritySearchRequest(BaseModel):
    """相似项目搜索请求"""
    target_project: ProjectInfoRequest
    top_k: int = Field(default=5, ge=1, le=10)
    method: str = Field(default="hybrid", pattern="^(hybrid|cosine|euclidean)$")


# ============================================
# FastAPI App
# ============================================

app = FastAPI(
    title="项目成本智能评估系统 API",
    description="基于AI的项目工作量评估与成本管理系统",
    version="1.0.0"
)

# CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 模拟的历史项目数据 (实际应从数据库读取)
MOCK_HISTORICAL_PROJECTS = [
    HistoricalProject(
        id=1,
        name="工商银行1104报送项目",
        project_type="regulatory_reporting",
        client_type="state_owned_bank",
        data_sources_count=10,
        interface_tables_count=150,
        reports_count=18,
        custom_requirements_count=2,
        complexity_score=6.8,
        actual_hours=1850.0,
        variance_percentage=12.5
    ),
    HistoricalProject(
        id=2,
        name="建设银行EAST系统",
        project_type="regulatory_reporting",
        client_type="state_owned_bank",
        data_sources_count=8,
        interface_tables_count=120,
        reports_count=15,
        custom_requirements_count=3,
        complexity_score=6.2,
        actual_hours=1620.0,
        variance_percentage=8.3
    ),
    HistoricalProject(
        id=3,
        name="招商银行监管报送",
        project_type="regulatory_reporting",
        client_type="joint_stock",
        data_sources_count=6,
        interface_tables_count=80,
        reports_count=12,
        custom_requirements_count=1,
        complexity_score=5.5,
        actual_hours=1200.0,
        variance_percentage=15.2
    ),
    HistoricalProject(
        id=4,
        name="浦发银行数据报送",
        project_type="regulatory_reporting",
        client_type="joint_stock",
        data_sources_count=5,
        interface_tables_count=60,
        reports_count=10,
        custom_requirements_count=2,
        complexity_score=4.8,
        actual_hours=980.0,
        variance_percentage=10.5
    ),
    HistoricalProject(
        id=5,
        name="宁波银行报表系统",
        project_type="regulatory_reporting",
        client_type="city_bank",
        data_sources_count=4,
        interface_tables_count=50,
        reports_count=8,
        custom_requirements_count=1,
        complexity_score=4.2,
        actual_hours=780.0,
        variance_percentage=7.8
    ),
]


# ============================================
# API Endpoints
# ============================================

@app.get("/")
async def root():
    """根路径"""
    return {
        "message": "项目成本智能评估系统 API",
        "version": "1.0.0",
        "docs_url": "/docs"
    }


@app.get("/health")
async def health_check():
    """健康检查"""
    return {"status": "healthy"}


@app.post("/api/v1/estimate", response_model=EstimationResponse)
async def estimate_workload(project: ProjectInfoRequest):
    """
    评估项目工作量

    基于项目规模参数和复杂度,使用规则引擎进行工作量评估
    """
    try:
        # 转换为ProjectInfo对象
        project_info = ProjectInfo(
            name=project.name,
            project_type=project.project_type,
            client_type=project.client_type,
            data_sources_count=project.data_sources_count,
            interface_tables_count=project.interface_tables_count,
            reports_count=project.reports_count,
            custom_requirements_count=project.custom_requirements_count,
            data_volume_level=project.data_volume_level,
            regulation_type=project.regulation_type
        )

        # 执行评估
        result = estimate_project(project_info)

        # 构建WBS摘要
        wbs_summary = {
            "total_tasks": sum(len(phase["tasks"]) for phase in result.wbs_structure),
            "phases_count": len(result.wbs_structure),
            "phases": [phase["phase"] for phase in result.wbs_structure]
        }

        # 返回结果
        return EstimationResponse(
            total_hours=result.total_hours,
            optimistic=result.optimistic,
            most_likely=result.most_likely,
            pessimistic=result.pessimistic,
            expected=result.expected,
            std_deviation=result.std_deviation,
            confidence_interval=result.confidence_interval,
            phase_breakdown=result.phase_breakdown,
            complexity_score=ComplexityScoreResponse(
                technical=result.complexity_score.technical,
                business=result.complexity_score.business,
                data=result.complexity_score.data,
                organizational=result.complexity_score.organizational,
                risk=result.complexity_score.risk,
                total=result.complexity_score.total,
                level=result.complexity_score.level
            ),
            confidence_level=result.confidence_level,
            wbs_summary=wbs_summary
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"评估失败: {str(e)}")


@app.post("/api/v1/estimate/with-similar")
async def estimate_with_similar_projects(request: SimilaritySearchRequest):
    """
    基于相似项目进行评估

    先查找历史相似项目,然后综合规则引擎和案例推理进行评估
    """
    try:
        # 规则引擎评估
        project_info = ProjectInfo(
            name=request.target_project.name,
            project_type=request.target_project.project_type,
            client_type=request.target_project.client_type,
            data_sources_count=request.target_project.data_sources_count,
            interface_tables_count=request.target_project.interface_tables_count,
            reports_count=request.target_project.reports_count,
            custom_requirements_count=request.target_project.custom_requirements_count,
            data_volume_level=request.target_project.data_volume_level,
            regulation_type=request.target_project.regulation_type
        )

        rule_based_result = estimate_project(project_info)

        # 相似项目匹配
        target_dict = request.target_project.dict()
        target_dict["complexity_score"] = rule_based_result.complexity_score.total

        similarity_result = find_and_estimate(
            target_dict,
            MOCK_HISTORICAL_PROJECTS,
            top_k=request.top_k
        )

        # 融合评估结果
        rule_based_hours = rule_based_result.total_hours
        similarity_based_hours = similarity_result["estimation"]["estimate"]

        if similarity_based_hours:
            # 加权融合: 规则60%, 相似项目40%
            ensemble_estimate = rule_based_hours * 0.6 + similarity_based_hours * 0.4
        else:
            ensemble_estimate = rule_based_hours

        return {
            "rule_based_estimation": {
                "total_hours": rule_based_result.total_hours,
                "confidence_level": rule_based_result.confidence_level,
                "complexity_score": rule_based_result.complexity_score.total
            },
            "similarity_based_estimation": similarity_result["estimation"],
            "similar_projects": [
                {
                    "name": sim.project.name,
                    "similarity_score": sim.similarity_score,
                    "actual_hours": sim.project.actual_hours,
                    "variance": sim.project.variance_percentage
                }
                for sim in similarity_result["similar_projects"]
            ],
            "ensemble_estimation": {
                "total_hours": round(ensemble_estimate, 1),
                "method": "weighted_average",
                "weights": {"rule_based": 0.6, "similarity_based": 0.4}
            },
            "recommendation": f"建议采用融合评估结果: {round(ensemble_estimate, 1)} 人时"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"评估失败: {str(e)}")


@app.post("/api/v1/similarity/search")
async def search_similar_projects(request: SimilaritySearchRequest):
    """
    搜索相似的历史项目

    基于多维度相似度算法,查找最相似的历史项目
    """
    try:
        target_dict = request.target_project.dict()

        matcher = ProjectSimilarityMatcher(MOCK_HISTORICAL_PROJECTS)
        similar_projects = matcher.find_similar_projects(
            target_dict,
            top_k=request.top_k,
            method=request.method
        )

        return {
            "total_found": len(similar_projects),
            "method": request.method,
            "results": [
                {
                    "project": {
                        "id": sim.project.id,
                        "name": sim.project.name,
                        "project_type": sim.project.project_type,
                        "client_type": sim.project.client_type,
                        "scale": {
                            "data_sources": sim.project.data_sources_count,
                            "interface_tables": sim.project.interface_tables_count,
                            "reports": sim.project.reports_count
                        },
                        "actual_hours": sim.project.actual_hours,
                        "complexity_score": sim.project.complexity_score,
                        "variance_percentage": sim.project.variance_percentage
                    },
                    "similarity": {
                        "total_score": sim.similarity_score,
                        "categorical": sim.categorical_similarity,
                        "scale": sim.scale_similarity,
                        "complexity": sim.complexity_similarity
                    }
                }
                for sim in similar_projects
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"搜索失败: {str(e)}")


@app.get("/api/v1/historical-projects")
async def list_historical_projects():
    """
    获取历史项目列表 (用于演示)
    """
    return {
        "total": len(MOCK_HISTORICAL_PROJECTS),
        "projects": [
            {
                "id": proj.id,
                "name": proj.name,
                "project_type": proj.project_type,
                "client_type": proj.client_type,
                "actual_hours": proj.actual_hours,
                "complexity_score": proj.complexity_score
            }
            for proj in MOCK_HISTORICAL_PROJECTS
        ]
    }


@app.get("/api/v1/models/estimation")
async def list_estimation_models():
    """
    获取评估模型列表 (用于演示)
    """
    return {
        "models": [
            {
                "name": "规则引擎评估",
                "type": "rule_based",
                "status": "active",
                "description": "基于标准工时定额和复杂度调整的规则引擎"
            },
            {
                "name": "相似项目评估",
                "type": "case_based",
                "status": "active",
                "description": "基于历史相似项目的案例推理"
            },
            {
                "name": "融合评估",
                "type": "ensemble",
                "status": "active",
                "description": "综合多个模型的评估结果"
            }
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
