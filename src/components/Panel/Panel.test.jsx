import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Panel from './Panel';

// Panel navigates and embeds Navigation, so both need a router in the tree.
const renderPanel = () =>
  render(
    <MemoryRouter initialEntries={['/inner']}>
      <Panel />
    </MemoryRouter>
  );

const panelEl = () => document.querySelector('.panel');
const toggle = () => screen.getByRole('button', { name: 'Toggle menu' });

describe('Panel', () => {
  it('renders the avatar, name, navigation and go-back control', () => {
    renderPanel();
    expect(screen.getByAltText('User avatar')).toBeInTheDocument();
    expect(screen.getByText('Madina Jumaly')).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(5);
    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
  });

  it('starts expanded', () => {
    renderPanel();
    expect(panelEl()).not.toHaveClass('panel--collapsed');
    expect(toggle()).toHaveAttribute('aria-expanded', 'true');
  });

  it('toggles the collapsed view and reports its state', async () => {
    const user = userEvent.setup();
    renderPanel();

    await user.click(toggle());
    expect(panelEl()).toHaveClass('panel--collapsed');
    expect(toggle()).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggle());
    expect(panelEl()).not.toHaveClass('panel--collapsed');
    expect(toggle()).toHaveAttribute('aria-expanded', 'true');
  });

  it('keeps the toggle outside the header, so it survives the hidden view', () => {
    // Below the breakpoint the header/nav/footer are display:none and this tab is the
    // only thing left on screen — nesting it in the header would hide it too.
    const { container } = renderPanel();
    expect(container.querySelector('.panel__header .panel__toggle')).toBeNull();
    expect(container.querySelector('.panel > .panel__toggle')).not.toBeNull();
  });
});
