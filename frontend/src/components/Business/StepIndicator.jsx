import React from 'react';
import { Check } from 'lucide-react';

/**
 * StepIndicator Component
 *
 * @param {Object} props
 * @param {Array} props.steps - Step array with title and status
 * @param {number} props.currentStep - Current step index
 * @param {Function} props.onStepClick - Step click handler
 */
const StepIndicator = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="step-indicator">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <div
            key={index}
            className={`step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
            onClick={() => onStepClick?.(index)}
          >
            <div className="step-number">
              {isCompleted ? (
                <Check className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </div>
            <p className="step-title">{step.title}</p>
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;