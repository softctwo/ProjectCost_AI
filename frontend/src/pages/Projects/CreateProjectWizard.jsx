import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Upload, FileText, AlertCircle, CheckCircle, Clock, Users, Target, BarChart3, Download, Settings } from 'lucide-react';
import { Button, Card, Input, Badge } from '../../components/UI';
import StepIndicator from '../../components/Business/StepIndicator';
import { useProjectEstimation } from '../../hooks/useProjectEstimation';

/**
 * CreateProjectWizard Component
 * 4-step wizard for creating a new project with AI estimation
 */
const CreateProjectWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showComplexityHelp, setShowComplexityHelp] = useState(false);

  const {
    projectInfo,
    setProjectInfo,
    complexityScore,
    setComplexityScore,
    estimationResult,
    similarProjects,
    isLoading,
    estimateProject,
    resetEstimation
  } = useProjectEstimation();

  // Steps configuration
  const steps = [
    { title: '基础信息', icon: FileText },
    { title: '项目范围', icon: Target },
    { title: '复杂度评估', icon: Settings },
    { title: '评估结果', icon: BarChart3 }
  ];

  // Handlers
  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, steps.length]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleStepClick = useCallback((stepIndex) => {
    if (stepIndex <= currentStep || (stepIndex === currentStep + 1 && canProceedToNext())) {
      setCurrentStep(stepIndex);
    }
  }, [currentStep]);

  const handleFileUpload = useCallback(async (files) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate file upload
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress(i);
      }

      // Simulate SOW parsing
      const file = files[0];
      if (file.type === 'application/pdf' || file.type.includes('word') || file.type.includes('excel')) {
        setProjectInfo(prev => ({
          ...prev,
          sow_file: file,
          sow_filename: file.name
        }));
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [setProjectInfo]);

  const handleEstimate = useCallback(async () => {
    const result = await estimateProject();
    if (result) {
      handleNext();
    }
  }, [estimateProject, handleNext]);

  const canProceedToNext = useCallback(() => {
    switch (currentStep) {
      case 0:
        return projectInfo.name && projectInfo.client_name && projectInfo.project_type;
      case 1:
        return projectInfo.data_sources_count > 0;
      case 2:
        return true; // Complexity always has default values
      case 3:
        return false; // Last step
      default:
        return false;
    }
  }, [currentStep, projectInfo]);

  const handleCreateProject = useCallback(async () => {
    // Create project logic here
    navigate(`/projects/new`);
  }, [navigate]);

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <Step1BasicInfo projectInfo={projectInfo} setProjectInfo={setProjectInfo} />;
      case 1:
        return <Step2ProjectScope projectInfo={projectInfo} setProjectInfo={setProjectInfo} />;
      case 2:
        return (
          <Step3ComplexityAssessment
            complexityScore={complexityScore}
            setComplexityScore={setComplexityScore}
            showHelp={showComplexityHelp}
            setShowHelp={setShowComplexityHelp}
          />
        );
      case 3:
        return (
          <Step4EstimationResult
            estimationResult={estimationResult}
            similarProjects={similarProjects}
            projectInfo={projectInfo}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container-desktop py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-h3 font-bold text-neutral-900">
                创建新项目
              </h1>
              <p className="text-body-base text-neutral-600 mt-1">
                通过AI智能评估，快速生成项目计划
              </p>
            </div>
            <Button
              variant="text"
              icon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate('/projects')}
            >
              返回项目列表
            </Button>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container-desktop py-8">
          <StepIndicator
            steps={steps}
            currentStep={currentStep}
            onStepClick={handleStepClick}
          />
        </div>
      </div>

      {/* Content */}
      <div className="container-desktop py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <div className="bg-white border-t border-neutral-200">
        <div className="container-desktop py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="secondary"
              icon={<ArrowLeft className="w-4 h-4" />}
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              上一步
            </Button>

            <div className="flex items-center gap-3">
              {currentStep < steps.length - 1 && (
                <>
                  <Button variant="text">
                    保存草稿
                  </Button>
                  <Button
                    variant="primary"
                    icon={<ArrowRight className="w-4 h-4" />}
                    onClick={currentStep === 2 ? handleEstimate : handleNext}
                    disabled={!canProceedToNext() || isLoading}
                    loading={isLoading}
                  >
                    {currentStep === 2 ? '开始评估' : '下一步'}
                  </Button>
                </>
              )}

              {currentStep === steps.length - 1 && (
                <>
                  <Button
                    variant="secondary"
                    icon={<Download className="w-4 h-4" />}
                  >
                    导出报告
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleCreateProject}
                  >
                    生成项目计划
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step Components
const Step1BasicInfo = ({ projectInfo, setProjectInfo }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload
      console.log('File dropped:', e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      // Handle file upload
      console.log('File selected:', e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-primary-50 border border-primary-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-primary-600" />
          <h2 className="text-h4 font-bold text-primary-900">
            SOW文档上传
          </h2>
        </div>

        <div
          className={`upload-area ${dragActive ? 'active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input').click()}
        >
          <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
          <p className="text-neutral-600 mb-1">
            拖拽文件到此处，或点击选择
          </p>
          <p className="text-sm text-neutral-500">
            支持格式: PDF, Word, Excel
          </p>
          <p className="text-sm text-neutral-500">
            最大: 10MB
          </p>
          <input
            id="file-input"
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {projectInfo.sow_filename && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-800">
                已上传: {projectInfo.sow_filename}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <Input
            label="项目名称"
            placeholder="输入项目名称"
            value={projectInfo.name || ''}
            onChange={(e) => setProjectInfo(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Input
            label="客户名称"
            placeholder="输入客户名称"
            value={projectInfo.client_name || ''}
            onChange={(e) => setProjectInfo(prev => ({ ...prev, client_name: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="form-label">监管类型</label>
          <select
            className="input"
            value={projectInfo.project_type || ''}
            onChange={(e) => setProjectInfo(prev => ({ ...prev, project_type: e.target.value }))}
            required
          >
            <option value="">请选择</option>
            <option value="1104报送">1104报送</option>
            <option value="EAST系统">EAST系统</option>
            <option value="其他监管报送">其他监管报送</option>
          </select>
        </div>
        <div>
          <Input
            label="计划周期(周)"
            type="number"
            placeholder="16周 ≈ 4个月"
            value={projectInfo.duration || 16}
            onChange={(e) => setProjectInfo(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
            required
          />
        </div>
      </div>
    </div>
  );
};

const Step2ProjectScope = ({ projectInfo, setProjectInfo }) => {
  const addDataSource = () => {
    setProjectInfo(prev => ({
      ...prev,
      data_sources: [...(prev.data_sources || []), { name: '', type: 'database' }]
    }));
  };

  const removeDataSource = (index) => {
    setProjectInfo(prev => ({
      ...prev,
      data_sources: prev.data_sources.filter((_, i) => i !== index)
    }));
  };

  const updateDataSource = (index, field, value) => {
    setProjectInfo(prev => ({
      ...prev,
      data_sources: prev.data_sources.map((ds, i) =>
        i === index ? { ...ds, [field]: value } : ds
      )
    }));
  };

  const addInterfaceTable = () => {
    setProjectInfo(prev => ({
      ...prev,
      interface_tables: [...(prev.interface_tables || []), { name: '', complexity: 'medium', volume: 'medium' }]
    }));
  };

  const removeInterfaceTable = (index) => {
    setProjectInfo(prev => ({
      ...prev,
      interface_tables: prev.interface_tables.filter((_, i) => i !== index)
    }));
  };

  const updateInterfaceTable = (index, field, value) => {
    setProjectInfo(prev => ({
      ...prev,
      interface_tables: prev.interface_tables.map((table, i) =>
        i === index ? { ...table, [field]: value } : table
      )
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-h5 font-bold text-neutral-900 mb-4">
          数据源系统
          <span className="text-sm font-normal text-neutral-500 ml-2">
            ({projectInfo.data_sources?.length || 0}个系统)
          </span>
        </h3>

        <div className="flex flex-wrap gap-2 mb-4">
          {(projectInfo.data_sources || []).map((source, index) => (
            <div key={index} className="chip">
              <span>{source.name || '未命名系统'}</span>
              <button
                onClick={() => removeDataSource(index)}
                className="chip-remove"
              >
                ×
              </button>
            </div>
          ))}
          <Button
            variant="secondary"
            size="sm"
            onClick={addDataSource}
          >
            + 添加数据源
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="数据源数量"
            type="number"
            value={projectInfo.data_sources_count || 0}
            onChange={(e) => setProjectInfo(prev => ({ ...prev, data_sources_count: parseInt(e.target.value) }))}
          />
          <Input
            label="接口表数量"
            type="number"
            value={projectInfo.interface_tables_count || 0}
            onChange={(e) => setProjectInfo(prev => ({ ...prev, interface_tables_count: parseInt(e.target.value) }))}
          />
          <Input
            label="报表数量"
            type="number"
            value={projectInfo.reports_count || 0}
            onChange={(e) => setProjectInfo(prev => ({ ...prev, reports_count: parseInt(e.target.value) }))}
          />
        </div>
      </div>

      <div>
        <h3 className="text-h5 font-bold text-neutral-900 mb-4">
          接口表配置
        </h3>

        <div className="border border-neutral-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  表名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  复杂度
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  数据量
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {(projectInfo.interface_tables || []).map((table, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Input
                      size="sm"
                      value={table.name}
                      onChange={(e) => updateInterfaceTable(index, 'name', e.target.value)}
                      placeholder="表名"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      className="input input-sm"
                      value={table.complexity}
                      onChange={(e) => updateInterfaceTable(index, 'complexity', e.target.value)}
                    >
                      <option value="simple">简单</option>
                      <option value="medium">中等</option>
                      <option value="complex">复杂</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      className="input input-sm"
                      value={table.volume}
                      onChange={(e) => updateInterfaceTable(index, 'volume', e.target.value)}
                    >
                      <option value="small">小</option>
                      <option value="medium">中</option>
                      <option value="large">大</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button className="text-primary-600 hover:text-primary-800">
                        编辑
                      </button>
                      <button
                        onClick={() => removeInterfaceTable(index)}
                        className="text-error-600 hover:text-error-800"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={addInterfaceTable}
          className="mt-4"
        >
          + 添加接口表
        </Button>
      </div>

      <div>
        <h3 className="text-h5 font-bold text-neutral-900 mb-4">
          个性化需求
        </h3>
        <Input
          placeholder="描述个性化需求，如数据校验规则、特殊报表格式等"
          value={projectInfo.custom_requirements || ''}
          onChange={(e) => setProjectInfo(prev => ({ ...prev, custom_requirements: e.target.value }))}
        />
      </div>
    </div>
  );
};

const Step3ComplexityAssessment = ({ complexityScore, setComplexityScore, showHelp, setShowHelp }) => {
  const updateComplexityScore = (dimension, value) => {
    setComplexityScore(prev => ({
      ...prev,
      [dimension]: value
    }));
  };

  const calculateTotal = () => {
    const weights = {
      technical: 0.30,
      business: 0.25,
      data: 0.20,
      organizational: 0.15,
      risk: 0.10
    };

    const total = Object.keys(weights).reduce((sum, key) => {
      return sum + (complexityScore[key] * weights[key]);
    }, 0);

    return Math.round(total * 10) / 10;
  };

  const getComplexityLevel = (score) => {
    if (score < 3) return 'simple';
    if (score < 5) return 'medium';
    if (score < 7) return 'complex';
    return 'very_complex';
  };

  const getMultiplier = (level) => {
    switch (level) {
      case 'simple': return 0.8;
      case 'medium': return 1.0;
      case 'complex': return 1.4;
      case 'very_complex': return 1.8;
      default: return 1.0;
    }
  };

  const totalScore = calculateTotal();
  const complexityLevel = getComplexityLevel(totalScore);
  const multiplier = getMultiplier(complexityLevel);

  return (
    <div className="space-y-6">
      <div className="bg-warning-50 border border-warning-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-warning-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-warning-900">
              复杂度评估说明
            </h4>
            <p className="text-sm text-warning-800 mt-1">
              复杂度评估基于5个维度，将影响最终的工作量估算结果。
            </p>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="text-sm text-warning-700 hover:text-warning-900 mt-2"
            >
              {showHelp ? '收起详情' : '查看详情'}
            </button>
          </div>
        </div>
      </div>

      {showHelp && (
        <div className="bg-neutral-50 rounded-xl p-6">
          <h4 className="font-semibold text-neutral-900 mb-4">
            复杂度评估维度
          </h4>
          <div className="space-y-4 text-sm">
            <div>
              <strong>技术复杂度 (30%)</strong>
              <p className="text-neutral-600 mt-1">
                技术栈成熟度、系统集成复杂度、数据处理复杂度等
              </p>
            </div>
            <div>
              <strong>业务复杂度 (25%)</strong>
              <p className="text-neutral-600 mt-1">
                业务逻辑复杂度、监管要求复杂度、业务规则数量等
              </p>
            </div>
            <div>
              <strong>数据复杂度 (20%)</strong>
              <p className="text-neutral-600 mt-1">
                数据质量、数据一致性、历史数据迁移等
              </p>
            </div>
            <div>
              <strong>组织复杂度 (15%)</strong>
              <p className="text-neutral-600 mt-1">
                客户成熟度、沟通协调难度、干系人数量等
              </p>
            </div>
            <div>
              <strong>风险因素 (10%)</strong>
              <p className="text-neutral-600 mt-1">
                时间压力、团队稳定性、项目风险等
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {[
          { key: 'technical', label: '技术复杂度', weight: 30 },
          { key: 'business', label: '业务复杂度', weight: 25 },
          { key: 'data', label: '数据复杂度', weight: 20 },
          { key: 'organizational', label: '组织复杂度', weight: 15 },
          { key: 'risk', label: '风险因素', weight: 10 }
        ].map(({ key, label, weight }) => (
          <Card key={key} variant="default" size="md">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1">
                <h4 className="font-semibold text-neutral-900">
                  {label}
                </h4>
                <p className="text-sm text-neutral-500">
                  权重: {weight}%
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {key === 'technical' && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">数据质量</span>
                    <div className="flex items-center gap-2">
                      {['完整度>95%', '完整度80-95%', '完整度<80%'].map((option, index) => (
                        <label key={index} className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="data_quality"
                            value={3 - index}
                            checked={complexityScore.technical === 3 - index}
                            onChange={(e) => updateComplexityScore('technical', parseFloat(e.target.value))}
                          />
                          <span className="text-sm">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">业务逻辑</span>
                    <div className="flex items-center gap-2">
                      {['简单映射', '包含计算', '复杂规则', '高级算法'].map((option, index) => (
                        <label key={index} className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="business_logic"
                            value={index}
                            checked={complexityScore.technical === index}
                            onChange={(e) => updateComplexityScore('technical', parseFloat(e.target.value))}
                          />
                          <span className="text-sm">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {key === 'business' && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">监管要求复杂度</span>
                  <div className="flex items-center gap-2">
                    {['标准', '较严格', '非常严格'].map((option, index) => (
                      <label key={index} className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="regulatory_complexity"
                          value={index + 1}
                          checked={complexityScore.business === index + 1}
                          onChange={(e) => updateComplexityScore('business', parseFloat(e.target.value))}
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {key === 'data' && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">源数据质量</span>
                  <div className="flex items-center gap-2">
                    {['良好', '一般', '较差'].map((option, index) => (
                      <label key={index} className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="data_quality"
                          value={index + 1}
                          checked={complexityScore.data === index + 1}
                          onChange={(e) => updateComplexityScore('data', parseFloat(e.target.value))}
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {key === 'organizational' && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">客户成熟度</span>
                  <div className="flex items-center gap-2">
                    {['经验丰富', '有一定经验', '首次实施'].map((option, index) => (
                      <label key={index} className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="client_maturity"
                          value={index + 1}
                          checked={complexityScore.organizational === index + 1}
                          onChange={(e) => updateComplexityScore('organizational', parseFloat(e.target.value))}
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {key === 'risk' && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">时间压力</span>
                  <div className="flex items-center gap-2">
                    {['宽松', '正常', '紧张'].map((option, index) => (
                      <label key={index} className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="time_pressure"
                          value={index + 1}
                          checked={complexityScore.risk === index + 1}
                          onChange={(e) => updateComplexityScore('risk', parseFloat(e.target.value))}
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-xl p-6">
        <div className="text-center">
          <h4 className="text-h5 font-bold text-primary-900 mb-2">
            综合复杂度系数
          </h4>
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {multiplier}x
          </div>
          <div className="flex items-center justify-center gap-4 text-sm text-neutral-600">
            <span>综合分数: {totalScore}/10</span>
            <span>•</span>
            <span>复杂度等级: {complexityLevel}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Step4EstimationResult = ({ estimationResult, similarProjects, projectInfo }) => {
  if (!estimationResult) {
    return (
      <div className="text-center py-12">
        <div className="loading loading-lg mb-4"></div>
        <p className="text-neutral-600">正在生成评估结果...</p>
      </div>
    );
  }

  const formatHours = (hours) => {
    return Math.round(hours).toLocaleString();
  };

  const formatDays = (hours) => {
    return Math.round(hours / 8);
  };

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <div className="hero-card">
        <h3 className="hero-title">
          🎯 项目工时评估
        </h3>
        <p className="hero-subtitle">
          基于 {similarProjects?.length || 0} 个相似历史项目
        </p>
        <div className="mt-6 space-y-2">
          <div className="text-5xl font-bold">
            {formatDays(estimationResult.most_likely)} 人天
          </div>
          <div className="text-xl opacity-90">
            ≈ {formatHours(estimationResult.most_likely)} 人时
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-center gap-2 text-sm">
            <span>置信区间: {formatDays(estimationResult.confidence_interval[0])} - {formatDays(estimationResult.confidence_interval[1])} 人天</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm">
            <span>置信度: ⭐⭐⭐ {estimationResult.confidence_level}</span>
          </div>
        </div>
      </div>

      {/* Phase Breakdown */}
      <Card variant="default" size="lg">
        <h4 className="text-h5 font-bold text-neutral-900 mb-4">
          评估明细
        </h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  阶段
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  工时
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  占比
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  工期
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  进度
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {Object.entries(estimationResult.phase_breakdown).map(([phase, hours], index) => (
                <tr key={phase}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                    {phase}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {formatHours(hours)}h
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {Math.round((hours / estimationResult.total_hours) * 100)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {Math.round(hours / 160)}周
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${Math.round((hours / estimationResult.total_hours) * 100)}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Similar Projects */}
      {similarProjects && similarProjects.length > 0 && (
        <Card variant="default" size="lg">
          <h4 className="text-h5 font-bold text-neutral-900 mb-4">
            与相似项目对比
          </h4>
          <div className="space-y-4">
            {similarProjects.slice(0, 3).map((project, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-neutral-900">
                    {project.name}
                  </h5>
                  <p className="text-sm text-neutral-600">
                    {project.client_type} • {project.project_type}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-medium text-neutral-900">
                    {formatHours(project.actual_hours)}h
                  </div>
                  <div className="text-sm text-neutral-600">
                    相似度: {Math.round(project.similarity_score * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Risk Assessment */}
      <Card variant="default" size="lg">
        <h4 className="text-h5 font-bold text-neutral-900 mb-4">
          关键假设与风险
        </h4>
        <div className="space-y-4">
          <div>
            <h5 className="font-medium text-neutral-900 mb-2">
              关键假设
            </h5>
            <ul className="space-y-1 text-sm text-neutral-600">
              <li>• 数据质量良好,不需要大量清洗</li>
              <li>• 客户能够及时配合需求访谈</li>
              <li>• 技术团队能胜任开发任务</li>
            </ul>
          </div>
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-warning-600 mt-0.5" />
              <div>
                <h5 className="font-semibold text-warning-900">
                  风险提示
                </h5>
                <p className="text-sm text-warning-800 mt-1">
                  评估结果基于历史数据，实际执行可能因项目特殊性而有所偏差。建议预留15-25%的风险缓冲。
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CreateProjectWizard;