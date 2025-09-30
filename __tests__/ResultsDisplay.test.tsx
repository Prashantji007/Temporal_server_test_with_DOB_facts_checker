import { render, screen } from '@testing-library/react';
import ResultsDisplay from '../src/components/ResultsDisplay';

describe('ResultsDisplay', () => {
  const mockResults = {
    age: {
      years: 25,
      days: 9125,
      hours: 219000,
      minutes: 13140000
    },
    zodiac: {
      western: 'Capricorn',
      chinese: 'Dragon'
    },
    day_info: {
      day_of_week: 'Saturday',
      day_number: 6
    },
    numerology: {
      life_path: 7
    },
    fun_facts: {
      days_to_next_birthday: 100,
      estimated_heartbeats: 1000000000,
      lunar_cycles_lived: 300,
      seasons_experienced: 100
    }
  };

  it('displays age information correctly', () => {
    render(<ResultsDisplay results={mockResults} />);
    expect(screen.getByText(/25 years/)).toBeInTheDocument();
    expect(screen.getByText(/9,125 days/)).toBeInTheDocument();
    expect(screen.getByText(/219,000 hours/)).toBeInTheDocument();
  });

  it('displays zodiac information correctly', () => {
    render(<ResultsDisplay results={mockResults} />);
    expect(screen.getByText(/Capricorn/)).toBeInTheDocument();
    expect(screen.getByText(/Dragon/)).toBeInTheDocument();
  });

  it('displays day information correctly', () => {
    render(<ResultsDisplay results={mockResults} />);
    expect(screen.getByText(/Saturday/)).toBeInTheDocument();
  });

  it('displays numerology information correctly', () => {
    render(<ResultsDisplay results={mockResults} />);
    expect(screen.getByText(/Life Path Number: 7/)).toBeInTheDocument();
  });

  it('displays fun facts correctly', () => {
    render(<ResultsDisplay results={mockResults} />);
    expect(screen.getByText(/100 days until your next birthday/)).toBeInTheDocument();
    expect(screen.getByText(/1,000,000,000 heartbeats/)).toBeInTheDocument();
    expect(screen.getByText(/300 lunar cycles/)).toBeInTheDocument();
  });

  it('handles null results gracefully', () => {
    render(<ResultsDisplay results={null} />);
    expect(screen.getByText(/No results available/)).toBeInTheDocument();
  });

  it('handles partial results gracefully', () => {
    const partialResults = {
      age: {
        years: 25
      }
    };
    render(<ResultsDisplay results={partialResults} />);
    expect(screen.getByText(/25 years/)).toBeInTheDocument();
  });
});