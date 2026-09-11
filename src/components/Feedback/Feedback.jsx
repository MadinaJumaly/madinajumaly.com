import './Feedback.scss';

// The design shows a bare domain ("somesite.com") rather than the full URL.
const citeLabel = (url) => {
  try {
    return new URL(url).host.replace(/^www\./, '');
  } catch {
    return url;
  }
};

const Feedback = ({ data }) => {
  return (
    <ul className="feedback-list">
      {/* Keyed by index deliberately: nothing in an item is guaranteed unique — two
          entries can share a reporter — and the list is static, never reordered. */}
      {data.map((item, index) => (
        <li key={index} className="feedback">
          <figure className="feedback__figure">
            <blockquote className="feedback__quote">
              <p>{item.feedback}</p>
            </blockquote>
            <figcaption className="feedback__attribution">
              {/* Decorative — the reporter is named in the text alongside it. */}
              <img className="feedback__avatar" src={item.reporter.photoUrl} alt="" />
              <span className="feedback__reporter">
                {item.reporter.name},{' '}
                <a
                  className="feedback__cite"
                  href={item.reporter.citeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {citeLabel(item.reporter.citeUrl)}
                </a>
              </span>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
};

export default Feedback;
