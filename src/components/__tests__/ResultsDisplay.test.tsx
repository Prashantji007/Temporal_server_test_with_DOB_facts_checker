import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ResultsDisplay from '../ResultsDisplay';

describe('ResultsDisplay', () => {
  it('displays loading state', () => {
    render(<ResultsDisplay isLoading={true} results={null} error={null} />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('displays error message', () => {
    const error = 'Test error message';
    render(<ResultsDisplay isLoading={false} results={null} error={error} />);
    expect(screen.getByText(error)).toBeInTheDocument();
  });

  it('displays results when available', () => {
    const results = {
      dayFact: 'Test day fact',
      yearFact: 'Test year fact',
      monthFact: 'Test month fact'
    };
    
    render(<ResultsDisplay isLoading={false} results={results} error={null} />);
    
    expect(screen.getByText(/Day Fact:/i)).toBeInTheDocument();
    expect(screen.getByText(results.dayFact)).toBeInTheDocument();
    expect(screen.getByText(/Year Fact:/i)).toBeInTheDocument();
    expect(screen.getByText(results.yearFact)).toBeInTheDocument();
    expect(screen.getByText(/Month Fact:/i)).toBeInTheDocument();
    expect(screen.getByText(results.monthFact)).toBeInTheDocument();
  });

  it('handles empty state', () => {
    render(<ResultsDisplay isLoading={false} results={null} error={null} />);
    expect(screen.getByText(/Select a date to see interesting facts/i)).toBeInTheDocument();
  });
});