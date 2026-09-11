# Restoring the Skills section

`SkillsSection.jsx`, `skillsSlice.js`, `localStorageMiddleware.js`, and the
Mirage `/api/skills` routes are all intact and still tested — nothing to
restore there. Only the wiring that put the section on the Inner page was
removed, plus one thing worth knowing before you bring it back: the section
has no real default content for production visitors (see **Before restoring**
below).

---

## 1. `src/pages/Inner/Inner.jsx`

### a. Import — add after the `Address` import, before `EducationSection`

```js
import SkillsSection from './SkillsSection';
```

### b. Section — add between `experience` and `portfolio`

```jsx
<Box id="skills" title="Skills" content={<SkillsSection />} />
```

## 2. `src/components/Navigation/Navigation.jsx`

### a. Icon import — add to the `@fortawesome/free-solid-svg-icons` import, after `faPen`

```js
faGem,
```

### b. Nav item — add to `SECTIONS`, between `experience` and `portfolio`

```js
{ id: 'skills', label: 'Skills', icon: faGem },
```

## 3. Test fixtures to revert (or the suite goes red)

### `src/components/Navigation/Navigation.test.jsx`

- Add `'Skills'` back into `SECTION_LABELS`, between `'Experience'` and `'Portfolio'`.
- In `moves the active state to whichever section the hash names`, change the
  hash back to `/inner#skills` and the expected text back to `'Skills'`
  (it was temporarily repointed at `#experience`).
- In `exposes the active item to assistive tech, not just visually`, change
  the non-active assertion back to `name: 'Skills'` (temporarily `'Experience'`).

### `src/components/Panel/Panel.test.jsx`

- In `renders the avatar, name, navigation and go-back control`, change the
  link count back to 6:
  ```js
  expect(screen.getAllByRole('link')).toHaveLength(6);
  ```

---

## Before restoring: two things to decide, not just re-wire

**1. The edit form is dev-only, on purpose.** `SkillsSection.jsx` gates
"Open edit" and each bar's remove button behind `import.meta.env.DEV` — true
in local dev and under Vitest, `false` in the production build. This was a
deliberate call: a public CV shouldn't expose an add/remove form to every
visitor. Restoring the section brings this back as-is (read-only in
production); if that's no longer wanted, both gates are commented inline in
the file.

**2. Skills persist only via each visitor's own `localStorage` — there is no
seeded default list.** Unlike Experience/Contacts/About (hardcoded arrays in
`Inner.jsx`), Skills starts from an empty array and is never fetched from the
mock API in normal use (`fetchSkills` exists in `skillsSlice.js` but nothing
calls it). Combined with #1: **a first-time visitor in production sees a
blank Skills section**, with no way to populate it, since the edit form that
would let them is gone in that build. Confirmed by testing the production
build directly before this section was hidden.

Before re-adding the section, decide how it should get real content:
- Hardcode a real skills array, passed as a prop the way `EXPERIENCE` is —
  the simplest fix, matching every other section's pattern.
- Or re-enable `fetchSkills()` on mount so the Mirage `SKILLS` array in
  `src/services/server.js` seeds a real baseline for first-time visitors,
  while local edits still layer on top via `localStorage`.

Neither is done yet — this was an open question when the section got hidden
instead of resolved.
