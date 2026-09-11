import { render, screen } from '@testing-library/react';
import Expertise from './Expertise';

const data = [
  {
    date: 'Mar 2025 – Apr 2025',
    info: { company: 'Acme Corp', job: 'Software Engineer', description: 'Built things.' },
  },
  {
    date: 'Mar 2024 – Apr 2024',
    info: { company: 'Globex', job: 'Machine Learning Intern', description: 'Trained models.' },
  },
];

describe('Expertise', () => {
  it('renders an entry for each item', () => {
    render(<Expertise data={data} />);
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Built things.')).toBeInTheDocument();
  });

  it('renders one list item per entry', () => {
    const { container } = render(<Expertise data={data} />);
    expect(container.querySelectorAll('.expertise__item')).toHaveLength(2);
  });

  it('makes the job title the only heading in an entry', () => {
    render(<Expertise data={data} />);
    // h4-before-h3 was a document-outline violation; the company is metadata now.
    const headings = screen.getAllByRole('heading');
    expect(headings.map((h) => h.textContent)).toEqual([
      'Software Engineer',
      'Machine Learning Intern',
    ]);
    headings.forEach((h) => expect(h.tagName).toBe('H3'));
    expect(screen.getByText('Acme Corp').tagName).toBe('SPAN');
  });
});
