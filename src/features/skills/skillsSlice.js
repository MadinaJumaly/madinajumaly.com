import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchSkills = createAsyncThunk('skills/fetchSkills', async () => {
  const response = await fetch('/api/skills');
  if (!response.ok) throw new Error('Failed to fetch skills');
  return response.json();
});

export const addSkill = createAsyncThunk('skills/addSkill', async (skill) => {
  const response = await fetch('/api/skills', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(skill),
  });
  if (!response.ok) throw new Error('Failed to add skill');
  return response.json();
});

const skillsSlice = createSlice({
  name: 'skills',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    // Synchronous: skills are client-owned here, so there is no server state to delete
    // from. localStorageMiddleware persists this like any other `skills/` action.
    removeSkill(state, action) {
      state.items = state.items.filter((skill) => (skill.id ?? skill.name) !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkills.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addSkill.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addSkill.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(addSkill.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { removeSkill } = skillsSlice.actions;

export default skillsSlice.reducer;
