import { render, screen } from '@testing-library/react';
import { StatCard } from './StatCard';

describe('StatCard Component', () => {
  it('renders label and value', () => {
    render(<StatCard label="Total Jobs" value={42} />);
    expect(screen.getByText('Total Jobs')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<StatCard label="Jobs" value={10} icon="📊" />);
    expect(screen.getByText('📊')).toBeInTheDocument();
  });

  it('displays trend indicator when trend prop is provided', () => {
    render(
      <StatCard
        label="Metrics"
        value={100}
        trend={{ value: 15, direction: 'up' }}
      />
    );
    expect(screen.getByText(/15%/)).toBeInTheDocument();
    expect(screen.getByText(/↑/)).toBeInTheDocument();
  });

  it('displays down trend with correct styling', () => {
    const { container } = render(
      <StatCard
        label="Errors"
        value={5}
        trend={{ value: 10, direction: 'down' }}
      />
    );
    expect(screen.getByText(/↓/)).toBeInTheDocument();
    expect(container.querySelector('.text-red-600')).toBeInTheDocument();
  });

  it('applies custom color to value', () => {
    const { container } = render(
      <StatCard label="Custom" value={99} color="text-blue-600" />
    );
    expect(container.querySelector('.text-blue-600')).toBeInTheDocument();
  });
});
