import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import skillsReducer from '../../features/skills/skillsSlice';
import SkillsSection from './SkillsSection';

const renderWithStore = (skills = []) => {
  const store = configureStore({
    reducer: { skills: skillsReducer },
    preloadedState: { skills: { items: skills, status: 'idle', error: null } },
  });
  return { store, ...render(<Provider store={store}><SkillsSection /></Provider>) };
};

const openForm = async (user) => {
  await user.click(screen.getByRole('button', { name: /open edit/i }));
};

const submitButton = () => screen.getByRole('button', { name: 'Add skill' });

describe('SkillsSection', () => {
  it('starts with no skills and the form closed', () => {
    const { container } = renderWithStore();
    expect(container.querySelectorAll('.skills__bar')).toHaveLength(0);
    expect(container.querySelector('.skills__form')).toBeNull();
  });

  it('renders one bar per skill, sized by its range', () => {
    const { container } = renderWithStore([
      { id: 1, name: 'HTML', range: 100 },
      { id: 2, name: 'PHP', range: 32 },
    ]);
    const bars = [...container.querySelectorAll('.skills__bar')];
    expect(bars).toHaveLength(2);
    expect(bars.map((b) => b.style.width)).toEqual(['100%', '32%']);
    expect(screen.getByText('HTML')).toBeInTheDocument();
  });

  it('opens the form on "Open edit" with submit disabled', async () => {
    const user = userEvent.setup();
    const { container } = renderWithStore();
    await openForm(user);
    expect(container.querySelector('.skills__form')).not.toBeNull();
    expect(submitButton()).toBeDisabled();
  });

  // The five validation cases the brief enumerates, with its exact copy.
  it.each([
    ['name is required', 'name', '', 'Skill name is a required field'],
    ['range is required', 'range', '', 'Skill range is a required field'],
    ['range must be numeric', 'range', 'abc', "Skill range must be a 'number' type"],
    ['range below minimum', 'range', '5', 'Skill range must be greater than or equal to 10'],
    ['range above maximum', 'range', '150', 'Skill range must be less than or equal to 100'],
  ])('rejects %s', async (_label, field, value, message) => {
    const user = userEvent.setup();
    renderWithStore();
    await openForm(user);

    const input = screen.getByLabelText(field === 'name' ? 'Skill name:' : 'Skill range:');
    // Touch the field so Formik surfaces the error, then leave it at the tested value.
    await user.type(input, 'seed');
    await user.clear(input);
    if (value) await user.type(input, value);
    await user.tab();

    expect(await screen.findByText(message)).toBeInTheDocument();
    expect(submitButton()).toBeDisabled();
  });

  it('enables submit once both fields are valid', async () => {
    const user = userEvent.setup();
    renderWithStore();
    await openForm(user);

    await user.type(screen.getByLabelText('Skill name:'), 'React');
    await user.type(screen.getByLabelText('Skill range:'), '80');

    await waitFor(() => expect(submitButton()).toBeEnabled());
  });

  it('surfaces a failed request instead of failing silently', () => {
    const store = configureStore({
      reducer: { skills: skillsReducer },
      preloadedState: { skills: { items: [], status: 'failed', error: 'Failed to add skill' } },
    });
    render(<Provider store={store}><SkillsSection /></Provider>);
    expect(screen.getByText('Failed to add skill')).toBeInTheDocument();
  });

  it('gives every bar its own named remove control', () => {
    renderWithStore([
      { id: 1, name: 'HTML', range: 100 },
      { id: 2, name: 'CSS', range: 74 },
    ]);
    // The bar's visible text is the skill name, so the button needs a distinct name.
    expect(screen.getByRole('button', { name: 'Remove HTML' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove CSS' })).toBeInTheDocument();
  });

  it('removes the skill that was clicked and keeps the rest', async () => {
    const user = userEvent.setup();
    const { container } = renderWithStore([
      { id: 1, name: 'HTML', range: 100 },
      { id: 2, name: 'CSS', range: 74 },
      { id: 3, name: 'PHP', range: 32 },
    ]);

    await user.click(screen.getByRole('button', { name: 'Remove CSS' }));

    // Assert on the survivors: a length check alone passes even if the wrong one went.
    const remaining = [...container.querySelectorAll('.skills__bar-label')].map((e) => e.textContent);
    expect(remaining).toEqual(['HTML', 'PHP']);
  });

  it('renders an empty list once the last skill is removed', async () => {
    const user = userEvent.setup();
    const { container } = renderWithStore([{ id: 1, name: 'HTML', range: 100 }]);
    await user.click(screen.getByRole('button', { name: 'Remove HTML' }));
    expect(container.querySelectorAll('.skills__bar')).toHaveLength(0);
  });

  it('shows the loading overlay while a request is in flight', () => {
    const store = configureStore({
      reducer: { skills: skillsReducer },
      preloadedState: { skills: { items: [], status: 'loading', error: null } },
    });
    const { container } = render(<Provider store={store}><SkillsSection /></Provider>);
    expect(container.querySelector('.skills__overlay')).not.toBeNull();
  });
});
