import { createServer, Response } from 'miragejs';

// The API contract is { id, date, title, description }; TimeLine's own prop shape is
// { date, title, text }, so EducationSection adapts between the two.
//
// `date` is the year shown in the timeline's left column. The design sizes that column
// for a four-digit year, so keep it to one — a range like "2021-2025" will not fit.
// Order here is the order on the page: newest first.
const COURSES = [
  {
    date: 2026,
    title: 'Front-End Development with AI Tools',
    description:
      'EPAM. React, state management and testing, finishing with a capstone CV project built against a mocked API.',
  },
  {
    date: 2025,
    title: 'Bachelor of Science in Information and Communication Technologies',
    description:
      'Astana IT University. Coursework across algorithms, databases and distributed systems, with a diploma project on collaborative document editing.',
  },
];

const SKILLS = [
  { name: 'JavaScript/TypeScript', range: 85 },
  { name: 'Python', range: 80 },
  { name: 'Django/DRF', range: 75 },
  { name: 'SQL', range: 70 },
  { name: 'Git', range: 65 },
];

export function makeServer({ environment = 'development' } = {}) {
  return createServer({
    environment,

    routes() {
      this.namespace = 'api';
      this.timing = 3000;

      this.get('/educations', () => {
        const educations = COURSES.map((course, index) => ({ id: index + 1, ...course }));
        console.log('[Mirage] GET /api/educations ->', educations.length, 'entries');
        return educations;
      });

      this.get('/skills', () => {
        console.log('[Mirage] GET /api/skills');
        return SKILLS;
      });

      this.post('/skills', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        if (!attrs.name || !attrs.range) {
          return new Response(422, {}, { error: 'name and range are required' });
        }
        const created = { id: Date.now(), name: attrs.name, range: Number(attrs.range) };
        console.log('[Mirage] POST /api/skills', created);
        return created;
      }, { timing: 0 });
    },
  });
}
