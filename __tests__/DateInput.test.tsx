import { render, screen, fireEvent } from '@testing-library/react';
import DateInput from '../src/components/DateInput';

describe('DateInput', () => {
  it('renders and submits a date', () => {
    const onDateSubmit = jest.fn();
    render(<DateInput onDateSubmit={onDateSubmit} isLoading={false} />);
    const input = screen.getByPlaceholderText('Select your birth date');
    fireEvent.change(input, { target: { value: '2000-01-01' } });
    fireEvent.click(screen.getByText('Analyze Birth Date'));
    expect(onDateSubmit).toHaveBeenCalledWith('2000-01-01');
  });

  it('validates future dates', () => {
    const onDateSubmit = jest.fn();
    render(<DateInput onDateSubmit={onDateSubmit} isLoading={false} />);
    const input = screen.getByPlaceholderText('Select your birth date');
    
    // Set a date in the future
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const futureDateString = futureDate.toISOString().split('T')[0];
    
    fireEvent.change(input, { target: { value: futureDateString } });
    fireEvent.click(screen.getByText('Analyze Birth Date'));
    expect(screen.getByText(/Future dates are not allowed/)).toBeInTheDocument();
    expect(onDateSubmit).not.toHaveBeenCalled();
  });

  it('handles loading state', () => {
    const onDateSubmit = jest.fn();
    render(<DateInput onDateSubmit={onDateSubmit} isLoading={true} />);
    const button = screen.getByRole('button');
    const input = screen.getByPlaceholderText('Select your birth date');

    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Analyzing...');
    expect(input).toBeDisabled();
  });

  it('validates empty date', () => {
    const onDateSubmit = jest.fn();
    render(<DateInput onDateSubmit={onDateSubmit} isLoading={false} />);
    
    fireEvent.click(screen.getByText('Analyze Birth Date'));
    expect(screen.getByText(/Please select a date/)).toBeInTheDocument();
    expect(onDateSubmit).not.toHaveBeenCalled();
  });

  it('validates invalid date format', () => {
    const onDateSubmit = jest.fn();
    render(<DateInput onDateSubmit={onDateSubmit} isLoading={false} />);
    const input = screen.getByPlaceholderText('Select your birth date');
    
    fireEvent.change(input, { target: { value: 'invalid-date' } });
    fireEvent.click(screen.getByText('Analyze Birth Date'));
    expect(screen.getByText(/Please enter a valid date/)).toBeInTheDocument();
    expect(onDateSubmit).not.toHaveBeenCalled();
  });
});
