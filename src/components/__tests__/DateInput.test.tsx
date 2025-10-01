import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateInput from '../src/components/DateInput';

describe('DateInput', () => {
  it('renders and submits a date', async () => {
    const user = userEvent.setup();
    const onDateSubmit = vi.fn();
    render(<DateInput onDateSubmit={onDateSubmit} isLoading={false} />);
    
    const input = screen.getByTestId('date-picker');
    const button = screen.getByRole('button', { name: /analyze birth date/i });
    
    await user.clear(input);
    await user.type(input, '2000-01-01');
    await user.click(button);
    
    expect(onDateSubmit).toHaveBeenCalledWith('2000-01-01');
  });

  it('validates future dates', async () => {
    const user = userEvent.setup();
    const onDateSubmit = vi.fn();
    render(<DateInput onDateSubmit={onDateSubmit} isLoading={false} />);
    
    const input = screen.getByTestId('date-picker');
    const button = screen.getByRole('button', { name: /analyze birth date/i });
    
    await user.clear(input);
    await user.type(input, '2026-01-01');
    await user.click(button);
    
    expect(screen.getByText(/Future dates are not allowed/)).toBeInTheDocument();
    expect(onDateSubmit).not.toHaveBeenCalled();
  });

  it('handles loading state', () => {
    render(<DateInput onDateSubmit={vi.fn()} isLoading={true} />);
    
    const button = screen.getByRole('button');
    const input = screen.getByTestId('date-picker');
    
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Analyzing...');
    expect(input).toBeDisabled();
  });
});