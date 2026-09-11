import { render, screen } from '@testing-library/react';
import Info from './Info';

describe('Info', () => {
  it('renders the given text', () => {
    render(<Info text="I'm a software engineer." />);
    expect(screen.getByText("I'm a software engineer.")).toBeInTheDocument();
  });
});
