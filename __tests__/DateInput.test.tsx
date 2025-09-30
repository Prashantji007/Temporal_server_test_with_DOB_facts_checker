import { render, screen, fireEvent } from '@testing-library/react';
import DateInput from '../src/components/DateInput';

describe('DateInput', () => {
  it('renders and submits a date', () => {
    const onDateSubmit = jest.fn();
    render(<DateInput onDateSubmit={onDateSubmit} isLoading={false} />);
    const input = screen.getByPlaceholderText('Select your birth date');
    fireEvent.change(input, { target: { value: '2000-01-01' } });
    fireEvent.click(screen.getByText('Analyze Birth Date'));
    expect(onDateSubmit).toHaveBeenCalled();
  });
});
