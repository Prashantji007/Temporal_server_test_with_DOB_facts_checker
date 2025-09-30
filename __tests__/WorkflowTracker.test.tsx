import { render, screen } from '@testing-library/react';
import WorkflowTracker from '../src/components/WorkflowTracker';

describe('WorkflowTracker', () => {
  it('displays current workflow step', () => {
    const currentStep = 'Calculating age...';
    render(<WorkflowTracker currentStep={currentStep} />);
    expect(screen.getByText(currentStep)).toBeInTheDocument();
  });

  it('shows loading state correctly', () => {
    const currentStep = 'Calculating age...';
    render(<WorkflowTracker currentStep={currentStep} isLoading={true} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText(currentStep)).toBeInTheDocument();
  });

  it('handles completed state', () => {
    const currentStep = 'Analysis complete';
    render(<WorkflowTracker currentStep={currentStep} isLoading={false} />);
    expect(screen.getByText(currentStep)).toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('handles error state', () => {
    const errorStep = 'Error occurred during analysis';
    render(<WorkflowTracker currentStep={errorStep} isLoading={false} error={true} />);
    expect(screen.getByText(errorStep)).toBeInTheDocument();
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});