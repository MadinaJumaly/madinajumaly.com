import { configureStore } from '@reduxjs/toolkit';
import educationReducer from '../features/education/educationSlice';
import skillsReducer from '../features/skills/skillsSlice';
import { localStorageMiddleware, loadPersistedSkills } from './localStorageMiddleware';

const persistedSkills = loadPersistedSkills();

export const store = configureStore({
  reducer: {
    education: educationReducer,
    skills: skillsReducer,
  },
  preloadedState: persistedSkills
    ? { skills: { items: persistedSkills, status: 'idle', error: null } }
    : undefined,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),
});
