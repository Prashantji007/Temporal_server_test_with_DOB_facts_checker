import React, { useState } from 'react';
import { Calendar, Clock, Star, Heart, Sparkles, Loader2 } from 'lucide-react';
import DateInput from './components/DateInput';
import ResultsDisplay from './components/ResultsDisplay';
import WorkflowTracker from './components/WorkflowTracker';
import { analyzeDOB, pollWorkflowStatus } from './services/api';
import type { WorkflowStatus, AnalysisResults } from './types';

function App() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus | null>(null);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDateSubmit = async (dob: string) => {
    setSelectedDate(dob);
    setIsAnalyzing(true);
    setResults(null);
    setWorkflowStatus(null);

    try {
      const response = await analyzeDOB(dob);
      const workflowId = response.workflow_id;
      
      // Poll for workflow completion
      const pollInterval = setInterval(async () => {
        try {
          const status = await pollWorkflowStatus(workflowId);
          setWorkflowStatus(status);
          
          if (status.status === 'completed') {
            setResults(status.results);
            setIsAnalyzing(false);
            clearInterval(pollInterval);
          } else if (status.status === 'failed') {
            console.error('Workflow failed:', status.error);
            setIsAnalyzing(false);
            clearInterval(pollInterval);
          }
        } catch (error) {
          console.error('Error polling workflow:', error);
          setIsAnalyzing(false);
          clearInterval(pollInterval);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error starting analysis:', error);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 text-indigo-300/20 text-6xl animate-pulse">
          <Star className="w-16 h-16" />
        </div>
        <div className="absolute top-40 right-20 text-purple-300/20 text-4xl animate-bounce">
          <Sparkles className="w-12 h-12" />
        </div>
        <div className="absolute bottom-20 left-1/4 text-pink-300/20 text-5xl animate-pulse">
          <Heart className="w-14 h-14" />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-indigo-300" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Birth Date Oracle
            </h1>
            <Clock className="w-8 h-8 text-purple-300" />
          </div>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
            Discover fascinating insights about your birth date through our advanced workflow analysis system
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <DateInput onDateSubmit={handleDateSubmit} isLoading={isAnalyzing} />
          
          {workflowStatus && (
            <WorkflowTracker 
              workflow={workflowStatus} 
              isAnalyzing={isAnalyzing}
            />
          )}
          
          {results && (
            <ResultsDisplay 
              results={results} 
              selectedDate={selectedDate}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;