import { useState, useCallback } from 'react';
import { projectAPI } from '../services/api';

/**
 * Custom hook for project estimation
 */
export const useProjectEstimation = () => {
  const [projectInfo, setProjectInfo] = useState({
    name: '',
    client_name: '',
    project_type: '',
    data_sources_count: 0,
    interface_tables_count: 0,
    reports_count: 0,
    custom_requirements_count: 0,
    data_volume_level: 'medium',
    duration: 16,
    sow_file: null,
    sow_filename: '',
  });

  const [complexityScore, setComplexityScore] = useState({
    technical: 5.0,
    business: 5.0,
    data: 5.0,
    organizational: 5.0,
    risk: 5.0,
  });

  const [estimationResult, setEstimationResult] = useState(null);
  const [similarProjects, setSimilarProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estimate project
  const estimateProject = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Prepare estimation data
      const estimationData = {
        ...projectInfo,
        data_sources_count: projectInfo.data_sources_count || 0,
        interface_tables_count: projectInfo.interface_tables_count || 0,
        reports_count: projectInfo.reports_count || 0,
        custom_requirements_count: projectInfo.custom_requirements_count || 0,
        data_volume_level: projectInfo.data_volume_level || 'medium',
      };

      // Call estimation API
      const response = await projectAPI.estimateProject(estimationData);
      const result = response.data;

      // Update estimation result
      setEstimationResult(result);

      // Get similar projects for comparison
      try {
        const similarResponse = await projectAPI.searchSimilarProjects({
          target_project: estimationData,
          top_k: 3,
          method: 'hybrid'
        });
        setSimilarProjects(similarResponse.data.results || []);
      } catch (similarError) {
        console.warn('Failed to fetch similar projects:', similarError);
        setSimilarProjects([]);
      }

      return result;
    } catch (err) {
      console.error('Estimation failed:', err);
      setError(err.response?.data?.detail || '评估失败，请重试');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [projectInfo]);

  // Reset estimation
  const resetEstimation = useCallback(() => {
    setEstimationResult(null);
    setSimilarProjects([]);
    setError(null);
  }, []);

  // Update project info
  const updateProjectInfo = useCallback((updates) => {
    setProjectInfo(prev => ({ ...prev, ...updates }));
  }, []);

  // Update complexity score
  const updateComplexity = useCallback((updates) => {
    setComplexityScore(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    projectInfo,
    setProjectInfo: updateProjectInfo,
    complexityScore,
    setComplexityScore: updateComplexity,
    estimationResult,
    similarProjects,
    isLoading,
    error,
    estimateProject,
    resetEstimation,
  };
};