import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faGraduationCap,
  faPen,
  faBriefcase,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import './Navigation.scss';

const SECTIONS = [
  { id: 'about', label: 'About me', icon: faUser },
  { id: 'education', label: 'Education', icon: faGraduationCap },
  { id: 'experience', label: 'Experience', icon: faPen },
  { id: 'portfolio', label: 'Portfolio', icon: faBriefcase },
  { id: 'contacts', label: 'Contacts', icon: faPaperPlane },
];

const Navigation = () => {
  const location = useLocation();
  const activeId = location.hash ? location.hash.replace('#', '') : SECTIONS[0].id;

  return (
    <nav>
      <ul className="navigation">
        {SECTIONS.map(({ id, label, icon }) => (
          <li key={id}>
            {/* "location" rather than "page": these are sections within one page, and
                the active state needs to reach assistive tech, not just be a colour. */}
            <a
              href={`#${id}`}
              className={id === activeId ? 'active' : undefined}
              aria-current={id === activeId ? 'location' : undefined}
            >
              <FontAwesomeIcon icon={icon} />
              <span>{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
