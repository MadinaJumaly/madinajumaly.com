import { render, screen } from '@testing-library/react';
import Feedback from './Feedback';

const data = [
  {
    feedback: 'Great to work with.',
    reporter: {
      photoUrl: '/icon-192.png',
      name: 'Alex Turner, Engineering Lead',
      citeUrl: 'https://www.linkedin.com/in/alex',
    },
  },
  {
    feedback: 'A great eye for detail.',
    reporter: {
      photoUrl: '/icon-192.png',
      name: 'Priya Nair, Product Designer',
      citeUrl: 'https://example.com',
    },
  },
];

describe('Feedback', () => {
  it('renders the quote and the reporter', () => {
    render(<Feedback data={data} />);
    expect(screen.getByText('Great to work with.')).toBeInTheDocument();
    expect(screen.getByText(/Alex Turner, Engineering Lead/)).toBeInTheDocument();
  });

  it('renders one entry per item', () => {
    const { container } = render(<Feedback data={data} />);
    expect(container.querySelectorAll('.feedback')).toHaveLength(2);
  });

  it('links the cite and shows it as a bare domain', () => {
    render(<Feedback data={data} />);
    // www. is stripped; the full URL is not shown, per the design.
    const link = screen.getByText('linkedin.com');
    expect(link).toHaveAttribute('href', 'https://www.linkedin.com/in/alex');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByText('example.com')).toBeInTheDocument();
  });

  it('falls back to the raw value when the cite is not a URL', () => {
    render(
      <Feedback
        data={[{ feedback: 'x', reporter: { photoUrl: '/p.png', name: 'N', citeUrl: 'not a url' } }]}
      />
    );
    expect(screen.getByText('not a url')).toBeInTheDocument();
  });

  it('accepts the documented payload, including repeated reporters', () => {
    // Exactly the shape from the brief — note both reporters are "John Doe", which is
    // why items cannot be keyed on anything inside the data.
    const spec = [
      {
        feedback: ' Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
        reporter: {
          photoUrl: './user.jpg',
          name: 'John Doe',
          citeUrl: 'https://www.citeexample.com',
        },
      },
      {
        feedback: ' Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
        reporter: {
          photoUrl: './user.jpg',
          name: 'John Doe',
          citeUrl: 'https://www.citeexample.com',
        },
      },
    ];
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { container } = render(<Feedback data={spec} />);
    const errors = spy.mock.calls.map((c) => String(c[0])).join('\n');
    spy.mockRestore();

    expect(container.querySelectorAll('.feedback')).toHaveLength(2);
    expect(errors).not.toMatch(/same key|unique "key"/i);
    expect(container.querySelectorAll('img[src="./user.jpg"]')).toHaveLength(2);
    expect(screen.getAllByText('citeexample.com')).toHaveLength(2);
  });

  it('renders nothing but the list when data is empty', () => {
    const { container } = render(<Feedback data={[]} />);
    expect(container.querySelector('.feedback-list')).toBeInTheDocument();
    expect(container.querySelectorAll('.feedback')).toHaveLength(0);
  });

  it('pairs the quote with its attribution and keeps the avatar decorative', () => {
    const { container } = render(<Feedback data={data} />);
    expect(container.querySelector('figure > blockquote')).toBeInTheDocument();
    expect(container.querySelector('figure > figcaption')).toBeInTheDocument();
    // The reporter is named in the adjacent text, so the image adds nothing to announce.
    expect(container.querySelector('.feedback__avatar')).toHaveAttribute('alt', '');
  });
});
