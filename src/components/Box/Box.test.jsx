import { render, screen } from '@testing-library/react';
import Box from './Box';

describe('Box', () => {
  it('renders title and content', () => {
    render(<Box title="Add skill" content={<p>Form goes here</p>} />);
    expect(screen.getByText('Add skill')).toBeInTheDocument();
    expect(screen.getByText('Form goes here')).toBeInTheDocument();
  });

  it('renders the title with the given heading level', () => {
    render(<Box title="Custom heading" content={<span />} headingLevel="h3" />);
    expect(screen.getByRole('heading', { level: 3, name: 'Custom heading' })).toBeInTheDocument();
  });
});
