# Restoring the Feedbacks / Reviews section

The `Feedback` component (`Feedback.jsx`, `Feedback.scss`, `Feedback.test.jsx`)
is intact and still tested — nothing to restore there. Only the wiring that put
it on the Inner page was removed. Re-add the four pieces below.

---

## 1. `src/pages/Inner/Inner.jsx`

### a. Import — add after the `Address` import

```js
import Feedback from '../../components/Feedback/Feedback';
```

### b. Data — add between the `EXPERIENCE` array and the `ABOUT` string

```js
const FEEDBACKS = [
  {
    feedback:
      'Madina is a reliable developer who consistently delivers clean, well-tested code and communicates clearly with the whole team.',
    reporter: {
      photoUrl: '/icon-192.png',
      name: 'Alex Turner, Engineering Lead',
      citeUrl: 'https://linkedin.com',
    },
  },
  {
    feedback:
      "Working with Madina was a pleasure — she has a great eye for detail and always considers the end user's experience.",
    reporter: {
      photoUrl: '/icon-192.png',
      name: 'Priya Nair, Product Designer',
      citeUrl: 'https://linkedin.com',
    },
  },
];
```

> These two entries were placeholder copy. Replace with real reviews.

### c. Section — add as the last child of `<main className="inner__content">`, after the `contacts` Box

```jsx
<Box id="feedbacks" title="Feedbacks" content={<Feedback data={FEEDBACKS} />} />
```

---

## 2. `src/components/Navigation/Navigation.jsx`

### a. Icon import — add to the `@fortawesome/free-solid-svg-icons` import, after `faPaperPlane`

```js
faCommentDots,
```

### b. Nav item — add to the end of the `SECTIONS` array, after the `contacts` entry

```js
{ id: 'feedbacks', label: 'Feedbacks', icon: faCommentDots },
```

---

## 3. Test fixtures to revert (or the suite goes red)

### `src/components/Navigation/Navigation.test.jsx`

- Add `'Feedbacks',` back to the end of the `SECTION_LABELS` array.
- In the `points each item at its section anchor` test, change the second
  assertion back to:

  ```js
  expect(screen.getByRole('link', { name: 'Feedbacks' })).toHaveAttribute('href', '#feedbacks');
  ```

  (it was temporarily pointed at `Contacts` / `#contacts`)

### `src/components/Panel/Panel.test.jsx`

- In `renders the avatar, name, navigation and go-back control`, change the link
  count back to 7:

  ```js
  expect(screen.getAllByRole('link')).toHaveLength(7);
  ```

---

## `<Feedback>` data shape (reference)

```js
{
  feedback: 'the quote text',
  reporter: {
    photoUrl: '/avatar.png',        // decorative image, rendered with alt=""
    name: 'Full Name, Role',
    citeUrl: 'https://example.com', // displayed as the bare host, e.g. "example.com"
  },
}
```
