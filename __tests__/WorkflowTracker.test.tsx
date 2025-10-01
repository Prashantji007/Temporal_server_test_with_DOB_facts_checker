import { render, screen } from '@testing-library/react';
import WorkflowTracker from '../src/components/WorkflowTracker';

describe('WorkflowTracker', () => {
  const mockWorkflow = {
    id: 'test-workflow',
    type: 'analyze_dob',
    status: 'running',
    current_step: 1,
    steps: [
      'Validating Date',
      'Calculating Age',
      'Determining Zodiac', 
      'Computing Numerology',
      'Finding Day of Week',
      'Generating Fun Facts',
      'Completing Analysis'
    ],
    data: { dob: '2000-01-01' },
    results: {},
    started_at: new Date().toISOString()
  };

  it('displays workflow steps', () => {
    render(<WorkflowTracker workflow={mockWorkflow} isAnalyzing={true} />);
    expect(screen.getByText('Calculating Age')).toBeInTheDocument();
    expect(screen.getByText('Validating Date')).toBeInTheDocument();
  });

  it('shows loading state correctly', () => {
    render(<WorkflowTracker workflow={mockWorkflow} isAnalyzing={true} />);
    expect(screen.getByText('running')).toBeInTheDocument();
    expect(screen.getByText('Workflow Progress')).toBeInTheDocument();
  });

  it('shows completed state correctly', () => {
    const completedWorkflow = {
      ...mockWorkflow,
      status: 'completed',
      current_step: 6
    };
    render(<WorkflowTracker workflow={completedWorkflow} isAnalyzing={false} />);
    expect(screen.getByText('completed')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('shows failed state correctly', () => {
    const failedWorkflow = {
      ...mockWorkflow,
      status: 'failed',
      current_step: 2
    };
    render(<WorkflowTracker workflow={failedWorkflow} isAnalyzing={false} />);
    expect(screen.getByText('failed')).toBeInTheDocument();
  });
});