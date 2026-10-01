import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    render(<Card variant="elevated">Elevated</Card>);
    expect(screen.getByText('Elevated')).toHaveClass('shadow-level-2');
  });

  it('applies padding classes', () => {
    render(<Card padding="lg">Padded</Card>);
    expect(screen.getByText('Padded')).toHaveClass('p-6');
  });

  it('applies hoverable class', () => {
    render(<Card hoverable>Hoverable</Card>);
    expect(screen.getByText('Hoverable')).toHaveClass('cursor-pointer');
  });
});