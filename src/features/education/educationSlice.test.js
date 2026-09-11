import reducer, { fetchEducations } from './educationSlice';

describe('educationSlice', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual({
      items: [],
      status: 'idle',
      error: null,
    });
  });

  it('sets status to loading on pending', () => {
    const state = reducer(undefined, fetchEducations.pending());
    expect(state.status).toBe('loading');
  });

  it('stores items and sets status to succeeded on fulfilled', () => {
    const items = [{ date: 2025, title: 'Degree', text: 'Studied things.' }];
    const state = reducer(undefined, fetchEducations.fulfilled(items));
    expect(state.status).toBe('succeeded');
    expect(state.items).toEqual(items);
  });

  it('sets error and status to failed on rejected', () => {
    const state = reducer(undefined, fetchEducations.rejected(new Error('network down')));
    expect(state.status).toBe('failed');
    expect(state.error).toBe('network down');
  });
});
