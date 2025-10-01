import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateInput from '../src/components/DateInput';
import React from 'react';

// Set up user-event
const user = userEvent.setup();

// Mock the DatePicker component
jest.mock('react-datepicker', () => {
  const DatePicker = ({ selected, onChange, ...props }: any) => (
    <input
      data-testid="date-picker"
      type="text"
      value={selected ? selected.toISOString().split('T')[0] : ''}
      onChange={(e) => {
        const date = new Date(e.target.value);
        onChange(date);
      }}
      {...props}
    />
  );
  return DatePicker;
});

describe('DateInput', () => {
  it('renders and submits a date', async () => {
    const onDateSubmit = jest.fn();
    render(<DateInput onDateSubmit={onDateSubmit} isLoading={false} />);
    const input = screen.getByTestId('date-picker');
    
    await userEvent.clear(input);
    await userEvent.type(input, '2000-01-01');
    
    const button = screen.getByRole('button', { name: /analyze birth date/i });
    await userEvent.click(button);
    
    expect(onDateSubmit).toHaveBeenCalledWith('2000-01-01');
  });

  it('validates future dates', async () => {
    const onDateSubmit = jest.fn();
    render(<DateInput onDateSubmit={onDateSubmit} isLoading={false} />);
    const input = screen.getByTestId('date-picker');
    
    // Set a date in the future
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const futureDateString = futureDate.toISOString().split('T')[0];
    
    await userEvent.clear(input);
    await userEvent.type(input, futureDateString);
    
    const button = screen.getByRole('button', { name: /analyze birth date/i });
    await userEvent.click(button);
    
    expect(screen.getByText(/Future dates are not allowed/)).toBeInTheDocument();
    expect(onDateSubmit).not.toHaveBeenCalled();
  });

  it('handles loading state', () => {
    const onDateSubmit = jest.fn();
    render(<DateInput onDateSubmit={onDateSubmit} isLoading={true} />);
    const button = screen.getByRole('button');
    const input = screen.getByTestId('date-picker');

    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Analyzing...');
    expect(input).toBeDisabled();
  });

  it('validates empty date', async () => {
    const onDateSubmit = jest.fn();
    render(<DateInput onDateSubmit={onDateSubmit} isLoading={false} />);
    
    const button = screen.getByRole('button', { name: /analyze birth date/i });
    await userEvent.click(button);
    
    expect(screen.getByText(/Please select a date/)).toBeInTheDocument();
    expect(onDateSubmit).not.toHaveBeenCalled();
  });

  it('validates invalid date format', async () => {
    const onDateSubmit = jest.fn();
    render(<DateInput onDateSubmit={onDateSubmit} isLoading={false} />);
    const input = screen.getByTestId('date-picker');
    
    await userEvent.clear(input);
    await userEvent.type(input, 'invalid-date');
    
    const button = screen.getByRole('button', { name: /analyze birth date/i });
    await userEvent.click(button);
    
    expect(screen.getByText(/Please enter a valid date/)).toBeInTheDocument();
    expect(onDateSubmit).not.toHaveBeenCalled();
  });
});
