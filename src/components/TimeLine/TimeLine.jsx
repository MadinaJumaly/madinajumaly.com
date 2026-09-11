import './TimeLine.scss';

const TimeLine = ({ data }) => {
  return (
    <div className="timeline">
      {/* A date paired with its event is a description list. The <div> wrappers are the
          spec's way of grouping a dt/dd pair, and give each row its own flex context. */}
      <dl className="timeline__list">
        {data.map((item, index) => (
          // Keyed by index: nothing in an entry is guaranteed unique — two entries can
          // share a year and a title — and the list is static, never reordered.
          <div key={index} className="timeline__item">
            <dt className="timeline__date">{item.date}</dt>
            <dd className="timeline__card">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default TimeLine;
