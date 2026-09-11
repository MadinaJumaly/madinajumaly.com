import reducer, { fetchSkills, addSkill, removeSkill } from './skillsSlice';

describe('skillsSlice', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual({
      items: [],
      status: 'idle',
      error: null,
    });
  });

  it('sets status to loading on pending', () => {
    const state = reducer(undefined, fetchSkills.pending());
    expect(state.status).toBe('loading');
  });

  it('stores items and sets status to succeeded on fulfilled', () => {
    const items = [{ name: 'Python', range: 90 }];
    const state = reducer(undefined, fetchSkills.fulfilled(items));
    expect(state.status).toBe('succeeded');
    expect(state.items).toEqual(items);
  });

  it('sets error and status to failed on rejected', () => {
    const state = reducer(undefined, fetchSkills.rejected(new Error('network down')));
    expect(state.status).toBe('failed');
    expect(state.error).toBe('network down');
  });

  it('appends the new skill when addSkill is fulfilled', () => {
    const initialState = { items: [{ name: 'Python', range: 90 }], status: 'idle', error: null };
    const newSkill = { id: 1, name: 'React', range: 60 };
    const state = reducer(initialState, addSkill.fulfilled(newSkill));
    expect(state.items).toEqual([{ name: 'Python', range: 90 }, newSkill]);
  });

  it('removes only the matching skill', () => {
    const start = {
      items: [
        { id: 1, name: 'HTML', range: 100 },
        { id: 2, name: 'CSS', range: 74 },
        { id: 3, name: 'PHP', range: 32 },
      ],
      status: 'idle',
      error: null,
    };
    const state = reducer(start, removeSkill(2));
    // Assert on survivors, not the count — a count check passes even if the wrong one goes.
    expect(state.items.map((s) => s.name)).toEqual(['HTML', 'PHP']);
  });

  it('falls back to the name when a skill has no id', () => {
    const start = { items: [{ name: 'HTML', range: 100 }], status: 'idle', error: null };
    expect(reducer(start, removeSkill('HTML')).items).toEqual([]);
  });

  it('leaves state untouched when the id is unknown', () => {
    const start = { items: [{ id: 1, name: 'HTML', range: 100 }], status: 'idle', error: null };
    expect(reducer(start, removeSkill(99)).items).toEqual(start.items);
  });
});
