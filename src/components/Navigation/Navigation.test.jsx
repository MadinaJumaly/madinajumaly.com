import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navigation from './Navigation';

const SECTION_LABELS = [
  'About me',
  'Education',
  'Experience',
  'Portfolio',
  'Contacts',
];

// Navigation reads the hash off the router, so it needs one in the tree.
const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Navigation />
    </MemoryRouter>
  );

describe('Navigation', () => {
  it('takes no props and renders its own hardcoded sections', () => {
    renderAt('/inner');
    const links = screen.getAllByRole('link');
    expect(links.map((a) => a.textContent)).toEqual(SECTION_LABELS);
  });

  it('points each item at its section anchor', () => {
    renderAt('/inner');
    expect(screen.getByRole('link', { name: 'Portfolio' })).toHaveAttribute('href', '#portfolio');
    expect(screen.getByRole('link', { name: 'Contacts' })).toHaveAttribute('href', '#contacts');
  });

  it('falls back to the first section when there is no hash', () => {
    const { container } = renderAt('/inner');
    const active = container.querySelectorAll('a.active');
    expect(active).toHaveLength(1);
    expect(active[0]).toHaveTextContent('About me');
  });

  it('moves the active state to whichever section the hash names', () => {
    const { container } = renderAt('/inner#experience');
    const active = container.querySelectorAll('a.active');
    expect(active).toHaveLength(1);
    expect(active[0]).toHaveTextContent('Experience');
    expect(container.querySelector('a[href="#about"]')).not.toHaveClass('active');
  });

  it('exposes the active item to assistive tech, not just visually', () => {
    renderAt('/inner#contacts');
    // A colour change alone leaves screen reader users with no current-item cue.
    expect(screen.getByRole('link', { name: 'Contacts' })).toHaveAttribute(
      'aria-current',
      'location'
    );
    expect(screen.getByRole('link', { name: 'Experience' })).not.toHaveAttribute('aria-current');
  });

  it('marks nothing active for a hash that matches no section', () => {
    const { container } = renderAt('/inner#nope');
    expect(container.querySelectorAll('a.active')).toHaveLength(0);
  });
});
