import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Portfolio from './Portfolio';

// jsdom has no layout engine, so Isotope cannot measure anything. Stub both libraries and
// assert the contract Portfolio has with them instead.
const arrange = vi.fn();
const layout = vi.fn();
const destroy = vi.fn();

vi.mock('isotope-layout', () => ({
  default: class {
    arrange = arrange;
    layout = layout;
    destroy = destroy;
  },
}));

vi.mock('imagesloaded', () => ({
  default: () => ({ on: vi.fn(), off: vi.fn() }),
}));

describe('Portfolio', () => {
  beforeEach(() => {
    arrange.mockClear();
    destroy.mockClear();
  });

  it('renders every item up front so Isotope keeps ownership of the DOM', () => {
    render(<Portfolio />);
    expect(screen.getByText('NCALayer Authentication Module')).toBeInTheDocument();
    expect(screen.getByText('Sira exhibition website')).toBeInTheDocument();
  });

  it('shows all items by default', () => {
    render(<Portfolio />);
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
    expect(arrange).toHaveBeenLastCalledWith({ filter: '*' });
  });

  it('arranges on the picked category and moves the pressed state', async () => {
    const user = userEvent.setup();
    render(<Portfolio />);

    await user.click(screen.getByRole('button', { name: 'Code' }));
    expect(arrange).toHaveBeenLastCalledWith({ filter: '.is-code' });
    expect(screen.getByRole('button', { name: 'Code' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false');

    await user.click(screen.getByRole('button', { name: 'UI' }));
    expect(arrange).toHaveBeenLastCalledWith({ filter: '.is-ui' });
  });

  it('tags each item with its category class for Isotope to select on', () => {
    const { container } = render(<Portfolio />);
    expect(container.querySelectorAll('.portfolio__item.is-code')).toHaveLength(1);
    expect(container.querySelectorAll('.portfolio__item.is-ui')).toHaveLength(1);
  });

  it('tears Isotope down on unmount', () => {
    const { unmount } = render(<Portfolio />);
    unmount();
    expect(destroy).toHaveBeenCalled();
  });
});
