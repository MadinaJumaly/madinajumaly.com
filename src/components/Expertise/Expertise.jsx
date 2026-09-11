import './Expertise.scss';

const Expertise = ({ data }) => {
  return (
    <ul className="expertise">
      {data.map((item) => (
        <li key={`${item.date}-${item.info.company}`} className="expertise__item">
          {/* Company and date are metadata, not headings — the job title below is the
              entry's only heading, so the outline stays h2 > h3. */}
          <div className="expertise__meta">
            <span className="expertise__company">{item.info.company}</span>
            <span className="expertise__date">{item.date}</span>
          </div>

          <div className="expertise__content">
            <h3 className="expertise__job">{item.info.job}</h3>
            <p className="expertise__description">{item.info.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Expertise;
