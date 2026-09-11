import { render, screen } from '@testing-library/react';
import Address from './Address';

const items = [
  { type: 'phone', value: '+7 776-165-4683' },
  { type: 'email', value: 'madinajumaly@gmail.com' },
  { type: 'linkedin', value: 'https://linkedin.com/madinajumaly' },
  { type: 'github', value: 'https://github.com/madinajumaly' },
];

describe('Address', () => {
  it('renders a tel link for the phone number', () => {
    render(<Address items={items} />);
    expect(screen.getByText('+7 776-165-4683')).toHaveAttribute('href', 'tel:+77761654683');
  });

  it('renders a mailto link for the email', () => {
    render(<Address items={items} />);
    expect(screen.getByText('madinajumaly@gmail.com')).toHaveAttribute(
      'href',
      'mailto:madinajumaly@gmail.com'
    );
  });

  it('renders a skype: call URI', () => {
    render(<Address items={[{ type: 'skype', value: 'madinajumaly' }]} />);
    expect(screen.getByText('madinajumaly')).toHaveAttribute('href', 'skype:madinajumaly?call');
  });

  it('shows the full URL, scheme included, for web profiles', () => {
    render(<Address items={items} />);
    expect(screen.getByText(items[2].value)).toHaveAttribute('href', items[2].value);
    expect(screen.getByText(items[3].value)).toHaveAttribute('href', items[3].value);
  });

  it('adds https:// to a bare host but leaves an absolute URL alone', () => {
    render(<Address items={[{ type: 'github', value: 'github.com/madinajumaly' }]} />);
    expect(screen.getByText('github.com/madinajumaly')).toHaveAttribute(
      'href',
      'https://github.com/madinajumaly'
    );
  });

  it('opens web profiles in a new tab but never scheme handoffs', () => {
    render(<Address items={[...items, { type: 'skype', value: 'madinajumaly' }]} />);

    [items[2].value, items[3].value].forEach((url) => {
      const link = screen.getByText(url);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    // tel:/mailto:/skype: hand off to a local agent — a new tab would be wrong.
    ['+7 776-165-4683', 'madinajumaly@gmail.com', 'madinajumaly'].forEach((text) => {
      expect(screen.getByText(text)).not.toHaveAttribute('target');
    });
  });

  it('labels the platform only where the value is not self-describing', () => {
    render(<Address items={items} />);
    const rows = document.querySelectorAll('.address__row');
    // phone and email carry no visible label; the two profiles do.
    expect(rows[0].querySelector('strong')).toBeNull();
    expect(rows[1].querySelector('strong')).toBeNull();
    expect(rows[2].querySelector('strong')).toHaveTextContent('LinkedIn');
    expect(rows[3].querySelector('strong')).toHaveTextContent('GitHub');
  });

  it('renders one list item per contact', () => {
    const { container } = render(<Address items={items} />);
    expect(container.querySelectorAll('.address__list > li')).toHaveLength(4);
  });

  it('names icon-only rows in the link text, since the icon is decorative', () => {
    render(<Address items={items} />);
    // Phone and email have no visible label, so the term rides inside the link name.
    // The \s* is deliberate: Chromium joins the two nodes with a space ("Phone +7 …"),
    // but jsdom's dom-accessibility-api concatenates them bare. Verified in Chromium.
    expect(screen.getByRole('link', { name: /^Phone\s*\+7 776-165-4683$/ })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /^Email\s*madinajumaly@gmail\.com$/ })
    ).toBeInTheDocument();
  });

  it('does not repeat the platform name on rows that already show one', () => {
    const { container } = render(<Address items={items} />);
    const rows = container.querySelectorAll('.address__row');
    // Hidden labels exist only where there is no visible <strong>.
    expect(rows[0].querySelector('.address__label')).not.toBeNull();
    expect(rows[2].querySelector('.address__label')).toBeNull();
    expect(screen.getAllByText('LinkedIn')).toHaveLength(1);
  });

  it('lets an item override the label and the href', () => {
    const { container } = render(
      <Address items={[{ type: 'linkedin', label: 'LinkedIn (work)', value: 'me', href: '/x' }]} />
    );
    expect(screen.getByText('me')).toHaveAttribute('href', '/x');
    expect(container.querySelector('.address__row strong')).toHaveTextContent('LinkedIn (work)');
  });

  it('renders an unknown type rather than dropping the contact', () => {
    render(<Address items={[{ type: 'mastodon', value: 'mas.to/@madina' }]} />);
    expect(screen.getByText('mas.to/@madina')).toHaveAttribute('href', 'https://mas.to/@madina');
  });

  it('renders nothing when given no items', () => {
    const { container } = render(<Address />);
    expect(container.querySelectorAll('.address__row')).toHaveLength(0);
  });
});
