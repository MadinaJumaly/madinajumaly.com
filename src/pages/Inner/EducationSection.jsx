import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import TimeLine from '../../components/TimeLine/TimeLine';
import { fetchEducations } from '../../features/education/educationSlice';
import './EducationSection.scss';

const EducationSection = () => {
  const dispatch = useDispatch();
  // `error` is intentionally not read — the failure branch shows a generic message
  // rather than surfacing a server error to the user.
  const { items, status } = useSelector((state) => state.education);

  useEffect(() => {
    dispatch(fetchEducations());
  }, [dispatch]);

  if (status === 'failed') {
    return (
      <div className="education-section education-section--error">
        <p>Something went wrong; please review your server connection!</p>
      </div>
    );
  }

  // The API returns `description`; TimeLine's documented prop is `text`.
  const timelineData = items.map(({ description, ...rest }) => ({ ...rest, text: description }));

  return (
    <div className="education-section">
      <TimeLine data={timelineData} />
      {status === 'loading' && (
        <div className="education-section__overlay">
          <FontAwesomeIcon icon={faSyncAlt} className="icon" spin />
        </div>
      )}
    </div>
  );
};

export default EducationSection;
