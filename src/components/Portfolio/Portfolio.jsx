import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Isotope from 'isotope-layout';
import imagesLoaded from 'imagesloaded';
import './Portfolio.scss';

const COLOR_CLASSES = [
  'portfolio__media--shamrock',
  'portfolio__media--oxford-blue',
  'portfolio__media--raven',
  'portfolio__media--midnight',
];

const ITEMS = [
  {
    id: 1,
    title: 'NCALayer Authentication Module',
    description:
      "Open-source implementation of EDS-based login for Django apps via Kazakhstan's NCA NCALayer service. Django, JavaScript, WebSocket, PKI.",
    category: 'code',
    sourceUrl: 'https://github.com/MadinaJumaly/ncalayer',
  },
  {
    id: 2,
    title: 'Collaborative Document Editor',
    description:
      'Thesis project: a collaborative online document editing, versioning, and publication tool.',
    category: 'ui',
    sourceUrl: 'https://github.com/MadinaJumaly/doclayer',
  },
].map((item, index) => ({ ...item, colorClass: COLOR_CLASSES[index % COLOR_CLASSES.length] }));

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'code', label: 'Code' },
  { id: 'ui', label: 'UI' },
];

const Portfolio = () => {
  const [filter, setFilter] = useState('all');
  const gridRef = useRef(null);
  const isoRef = useRef(null);

  // Isotope owns item positioning, so it is initialised once against the grid node and
  // never re-created when the filter changes.
  //
  // useLayoutEffect, not useEffect: Isotope's constructor positions every item
  // synchronously (position: absolute; left/top), but before that runs the items are
  // plain <li>s in normal flow, which stack instead of forming a row. useEffect fires
  // after the browser paints, so that stacked state would flash on screen for a frame;
  // useLayoutEffect fires before paint, so the very first frame is already laid out.
  useLayoutEffect(() => {
    const iso = new Isotope(gridRef.current, {
      itemSelector: '.portfolio__item',
      layoutMode: 'fitRows',
      transitionDuration: '0.4s',
      fitRows: { gutter: '.portfolio__gutter-sizer' },
    });
    isoRef.current = iso;

    // Placeholder tiles are pure CSS today, but this keeps the layout correct once real
    // screenshots replace them — images resolve after first layout otherwise.
    const imgLoad = imagesLoaded(gridRef.current);
    const relayout = () => iso.layout();
    imgLoad.on('progress', relayout);

    return () => {
      imgLoad.off('progress', relayout);
      iso.destroy();
      isoRef.current = null;
    };
  }, []);

  useEffect(() => {
    isoRef.current?.arrange({ filter: filter === 'all' ? '*' : `.is-${filter}` });
  }, [filter]);

  return (
    <div className="portfolio">
      <ul className="portfolio__filters">
        {FILTERS.map(({ id, label }) => (
          <li key={id} className="portfolio__filter">
            <button
              type="button"
              className={`portfolio__filter-button${filter === id ? ' is-active' : ''}`}
              aria-pressed={filter === id}
              onClick={() => setFilter(id)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>

      {/* Every item stays mounted — Isotope hides the filtered-out ones itself. */}
      <ul className="portfolio__grid" ref={gridRef}>
        <li className="portfolio__gutter-sizer" aria-hidden="true" />
        {ITEMS.map((item) => (
          <li key={item.id} className={`portfolio__item is-${item.category}`}>
            <article className="portfolio__card">
              <div className={`portfolio__media ${item.colorClass}`} aria-hidden="true" />
              <div className="portfolio__overlay">
                <h3 className="portfolio__title">{item.title}</h3>
                <p className="portfolio__description">
                  <span className="portfolio__description-text">{item.description}</span>
                </p>
                <a
                  className="portfolio__link"
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View resource
                </a>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Portfolio;
