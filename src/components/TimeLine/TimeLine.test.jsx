import { render, screen } from '@testing-library/react';
import TimeLine from './TimeLine';

const data = [
  { date: 2025, title: 'First', text: 'First entry' },
  { date: 2026, title: 'Second', text: 'Second entry' },
];

// The payload from the brief, verbatim — including its unsorted dates.
const SPEC = [
  {
    date: 2001,
    title: 'Title 0',
    text: 'Elit voluptate ad nostrud laboris. Elit incididunt mollit enim enim id id laboris dolore et et mollit.\r\n',
  },
  {
    date: 2000,
    title: 'Title 1',
    text: 'Et irure culpa ad proident labore excepteur elit dolore. Quis commodo elit culpa eiusmod dolor proident.\r\n',
  },
  {
    date: 2012,
    title: 'Title 2',
    text: 'Labore esse tempor nisi non mollit enim elit ullamco veniam elit duis nostrud. Enim pariatur ullamco.\r\n',
  },
];

describe('TimeLine', () => {
  it('pairs each date with its event as a description list', () => {
    const { container } = render(<TimeLine data={data} />);
    expect(container.querySelectorAll('dl')).toHaveLength(1);
    expect(container.querySelectorAll('.timeline__item')).toHaveLength(2);
    expect(container.querySelectorAll('dt')).toHaveLength(2);
    expect(container.querySelectorAll('dd')).toHaveLength(2);
  });

  it('renders the documented payload shape', () => {
    render(<TimeLine data={SPEC} />);
    SPEC.forEach(({ date, title, text }) => {
      expect(screen.getByText(String(date))).toBeInTheDocument();
      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByText(text.trim())).toBeInTheDocument();
    });
  });

  it('draws the rail once for the whole list, not per entry', () => {
    const { container } = render(<TimeLine data={SPEC} />);
    expect(container.querySelectorAll('.timeline__item')).toHaveLength(3);
    // The rail is a single ::before on the list; no per-entry line elements exist.
    expect(container.querySelectorAll('.timeline__line')).toHaveLength(0);
  });

  it('keeps the order it was given rather than sorting by date', () => {
    // The brief's own example is unsorted (2001, 2000, 2012). Ordering is the caller's
    // job, so the component must not quietly rearrange the list.
    const { container } = render(<TimeLine data={SPEC} />);
    const years = [...container.querySelectorAll('.timeline__date')].map((e) => e.textContent);
    expect(years).toEqual(['2001', '2000', '2012']);
  });

  it('renders an empty list', () => {
    const { container } = render(<TimeLine data={[]} />);
    expect(container.querySelectorAll('.timeline__item')).toHaveLength(0);
    expect(container.querySelectorAll('dt')).toHaveLength(0);
    // The scroll container still holds its 30vh so the loading overlay has somewhere to sit.
    expect(container.querySelector('.timeline')).toBeInTheDocument();
  });
});
