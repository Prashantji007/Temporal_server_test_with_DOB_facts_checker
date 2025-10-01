/// <reference types="@testing-library/jest-dom" />
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateInput from '../src/components/DateInput';
import React from 'react';
import '@testing-library/jest-dom';

// Mock the current date to be fixed
jest.useFakeTimers();
jest.setSystemTime(new Date('2025-10-01'));

// Mock the current date
const mockDate = new Date('2025-10-01');
const RealDate = Date;
(global as any).Date = class extends RealDate {
  constructor(date?: string | number | Date) {
    if (date) {
      super(date);
      return;
    }
    super(mockDate);
  }
};

// Set up user-event
const user = userEvent.setup();

// Mock the DatePicker component
jest.mock('react-datepicker', () => ({
  __esModule: true,
  default: function DatePicker({ selected, onChange, maxDate, ...props }: any) {
    const handleDateChange = (e: { target: { value: string } }) => {
      try {
        const [year, month, day] = e.target.value.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        if (date.toString() === 'Invalid Date') return;
        if (maxDate && date > maxDate) return;
        onChange(date);
      } catch (err) {
        // Invalid date format
      }
    };

    return (
      <input
        data-testid="date-picker"
        type="date"
        value={selected ? selected.toISOString().split('T')[0] : ''}
        onChange={handleDateChange}
        {...props}
      />
    );
  }
}));

describe('DateInput', () => {
  it('renders and submits a date', async () => {
    const onDateSubmit = jest.fn();
    render(<DateInput onDateSubmit={onDateSubmit} isLoading={false} />);
    const input = screen.getByTestId('date-picker');
    
    // Simulate date selection
    const testDate = new Date('2000-01-01');
    await userEvent.clear(input);
    const inputEvent = new Event('change');
    Object.defineProperty(inputEvent, 'target', { value: { value: '2000-01-01' } });
    await userEvent.type(input, '2000-01-01');
    input.dispatchEvent(inputEvent);
    
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
