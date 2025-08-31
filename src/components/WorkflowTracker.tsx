import React from 'react';
import { CheckCircle, Circle, Loader2, Clock } from 'lucide-react';
import type { WorkflowStatus } from '../types';

interface WorkflowTrackerProps {
  workflow: WorkflowStatus;
  isAnalyzing: boolean;
}

const WorkflowTracker: React.FC<WorkflowTrackerProps> = ({ workflow, isAnalyzing }) => {
  const stepNames = [
    'Validating Date',
    'Calculating Age',
    'Determining Zodiac',
    'Computing Numerology',
    'Finding Day of Week',
    'Generating Fun Facts',
    'Completing Analysis'
  ];

  const getStepIcon = (stepIndex: number) => {
    if (stepIndex < workflow.current_step) {
      return <CheckCircle className="w-6 h-6 text-green-400" />;
    } else if (stepIndex === workflow.current_step && isAnalyzing) {
      return <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />;
    } else {
      return <Circle className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < workflow.current_step) {
      return 'completed';
    } else if (stepIndex === workflow.current_step && isAnalyzing) {
      return 'active';
    } else {
      return 'pending';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-6 h-6 text-indigo-300" />
        <h3 className="text-xl font-bold text-white">Workflow Progress</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          workflow.status === 'completed' 
            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
            : workflow.status === 'failed'
            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
        }`}>
          {workflow.status}
        </span>
      </div>

      <div className="space-y-4">
        {stepNames.map((stepName, index) => {
          const status = getStepStatus(index);
          return (
            <div 
              key={index} 
              className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${
                status === 'active' 
                  ? 'bg-indigo-500/20 border border-indigo-500/30' 
                  : status === 'completed'
                  ? 'bg-green-500/10 border border-green-500/20'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              {getStepIcon(index)}
              <span className={`font-medium ${
                status === 'completed' ? 'text-green-300' :
                status === 'active' ? 'text-indigo-200' : 'text-gray-400'
              }`}>
                {stepName}
              </span>
              {status === 'active' && (
                <div className="ml-auto">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
        <div className="flex justify-between items-center text-sm text-indigo-200">
          <span>Progress</span>
          <span>{Math.round((workflow.current_step / stepNames.length) * 100)}%</span>
        </div>
        <div className="mt-2 bg-white/10 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(workflow.current_step / stepNames.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowTracker;