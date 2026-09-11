const SKILLS_STORAGE_KEY = 'cv-app:skills';

export const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type.startsWith('skills/')) {
    const { skills } = store.getState();
    localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(skills.items));
  }
  return result;
};

export function loadPersistedSkills() {
  try {
    const raw = localStorage.getItem(SKILLS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}
