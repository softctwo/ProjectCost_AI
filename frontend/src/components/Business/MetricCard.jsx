import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '../UI';

/**
 * MetricCard Component
 *
 * @param {Object} props
 * @param {string} props.title - Metric title
 * @param {string|number} props.value - Metric value
 * @param {string} props.unit - Unit (e.g., '%', 'h', 'days')
 * @param {'primary'|'success'|'warning'|'error'|'neutral'} props.color - Metric color
 * @param {'up'|'down'|'neutral'} props.trend - Trend direction
 * @param {number} props.trendValue - Trend value
 * @param {string} props.icon - Icon component
 * @param {string} props.description - Additional description
 */
const MetricCard = ({
  title,
  value,
  unit = '',
  color = 'primary',
  trend,
  trendValue,
  icon: Icon,
  description,
}) => {
  const getIconColor = (color) => {
    switch (color) {
      case 'primary':
        return 'text-primary-600 bg-primary-100';
      case 'success':
        return 'text-success-600 bg-success-100';
      case 'warning':
        return 'text-warning-600 bg-warning-100';
      case 'error':
        return 'text-error-600 bg-error-100';
      default:
        return 'text-neutral-600 bg-neutral-100';
    }
  };

  const getValueColor = (color) => {
    switch (color) {
      case 'primary':
        return 'text-primary-900';
      case 'success':
        return 'text-success-900';
      case 'warning':
        return 'text-warning-900';
      case 'error':
        return 'text-error-900';
      default:
        return 'text-neutral-900';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-success-600';
      case 'down':
        return 'text-error-600';
      default:
        return 'text-neutral-500';
    }
  };

  const formatValue = (val) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card variant="default" size="md" className="metric-card">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          {Icon && (
            <div className={`p-3 rounded-lg ${getIconColor(color)}`}>
              <Icon className="w-5 h-5" />
            </div>
          )}
          {trend !== undefined && (
            <div className={`flex items-center gap-1 ${getTrendColor(trend)}`}>
              {getTrendIcon(trend)}
              {trendValue !== undefined && (
                <span className="text-sm font-medium">
                  {Math.abs(trendValue)}%
                </span>
              )}
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-1">
          <span className={`text-2xl font-bold ${getValueColor(color)}`}>
            {formatValue(value)}
          </span>
          {unit && (
            <span className="text-sm text-neutral-600 ml-1">{unit}</span>
          )}
        </div>

        {/* Title */}
        <p className="text-sm text-neutral-600 font-medium mb-2">
          {title}
        </p>

        {/* Description */}
        {description && (
          <p className="text-xs text-neutral-500 leading-relaxed">
            {description}
          </p>
        )}
      </Card>
    </motion.div>
  );
};

export default MetricCard;