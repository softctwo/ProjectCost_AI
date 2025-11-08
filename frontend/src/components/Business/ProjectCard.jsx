import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, MoreHorizontal, AlertTriangle, CheckCircle, Clock as ClockIcon } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Card, Badge } from '../UI';

/**
 * ProjectCard Component
 *
 * @param {Object} props
 * @param {Object} props.project - Project data
 * @param {Function} props.onClick - Click handler
 * @param {Function} props.onMenuClick - Menu click handler
 * @param {boolean} props.showProgress - Show progress bar
 */
const ProjectCard = ({ project, onClick, onMenuClick, showProgress = true }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'planning':
        return <ClockIcon className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'risk':
      case 'overdue':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'planning':
        return 'status-planning';
      case 'in_progress':
        return 'status-progress';
      case 'completed':
        return 'status-completed';
      case 'risk':
        return 'status-risk';
      case 'overdue':
        return 'status-overdue';
      default:
        return 'status-planning';
    }
  };

  const formatDuration = (days) => {
    if (days < 30) {
      return `${days}天`;
    } else {
      const months = Math.floor(days / 30);
      const remainingDays = days % 30;
      return remainingDays > 0 ? `${months}个月${remainingDays}天` : `${months}个月`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        variant="default"
        size="lg"
        hover={true}
        clickable={true}
        className="project-card relative"
        onClick={onClick}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getStatusColor(project.status)}>
                <span className="flex items-center gap-1">
                  {getStatusIcon(project.status)}
                  {project.status}
                </span>
              </Badge>
              {project.priority === 'high' && (
                <Badge color="error">高优先级</Badge>
              )}
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">
              {project.name}
            </h3>
            <p className="text-sm text-neutral-600">
              {project.client_name}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMenuClick?.(project);
            }}
            className="p-1 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <MoreHorizontal className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Progress */}
        {showProgress && project.progress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-neutral-600">进度</span>
              <span className="font-medium text-neutral-900">
                {Math.round(project.progress)}%
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-neutral-400" />
            <div>
              <p className="text-xs text-neutral-500">工期</p>
              <p className="text-sm font-medium text-neutral-900">
                {formatDuration(project.duration || 120)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-400" />
            <div>
              <p className="text-xs text-neutral-500">工时</p>
              <p className="text-sm font-medium text-neutral-900">
                {project.estimated_hours ? `${Math.round(project.estimated_hours)}h` : '待评估'}
              </p>
            </div>
          </div>
        </div>

        {/* Team Avatars */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="w-4 h-4 text-neutral-400 mr-2" />
            <div className="flex -space-x-2">
              {project.team?.slice(0, 3).map((member, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full bg-primary-100 border-2 border-white flex items-center justify-center"
                  title={member.name}
                >
                  <span className="text-xs font-medium text-primary-600">
                    {member.name.charAt(0)}
                  </span>
                </div>
              ))}
              {project.team?.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-neutral-100 border-2 border-white flex items-center justify-center">
                  <span className="text-xs font-medium text-neutral-600">
                    +{project.team.length - 3}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Handle quick action
              }}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              查看详情
            </button>
          </div>
        </div>

        {/* Risk Indicator */}
        {project.risk_level === 'high' && (
          <div className="absolute top-2 right-2">
            <AlertTriangle className="w-4 h-4 text-warning-500" />
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default ProjectCard;