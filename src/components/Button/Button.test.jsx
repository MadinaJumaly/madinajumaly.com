import { render, screen, fireEvent } from '@testing-library/react';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Button from './Button';

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Go</Button>);
    fireEvent.click(screen.getByText('Go'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies the variant class', () => {
    render(<Button variant="green">Save</Button>);
    expect(screen.getByRole('button')).toHaveClass('Button--green');
  });

  it('renders only the icon and aria-label when iconOnly is true', () => {
    render(<Button icon={faBars} iconOnly ariaLabel="Toggle menu">Menu</Button>);
    const button = screen.getByRole('button', { name: 'Toggle menu' });
    expect(button).toHaveClass('Button--icon-only');
    expect(screen.queryByText('Menu')).not.toBeInTheDocument();
  });
});
