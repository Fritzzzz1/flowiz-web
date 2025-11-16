import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card Component', () => {
  it('renders children content', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies hover styles when hoverable prop is true', () => {
    const { container } = render(<Card hoverable>Hover me</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('hover:shadow-md');
    expect(card).toHaveClass('cursor-pointer');
  });

  it('renders with elevated variant', () => {
    const { container } = render(<Card variant="elevated">Elevated</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('shadow-md');
  });

  it('combines custom className with default classes', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('custom-class');
    expect(card).toHaveClass('bg-white');
  });
});
