import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('DOM Matchers', () => {
  it('should have jest-dom matchers', () => {
    render(<div>Hello World</div>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should render a button', () => {
    render(<button>Click me</button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('should check for class names', () => {
    render(<div className="test-class">Styled Content</div>);
    const element = screen.getByText('Styled Content');
    expect(element).toHaveClass('test-class');
  });
});

