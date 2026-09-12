import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { faBars, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button/Button';
import Navigation from '../Navigation/Navigation';
import './Panel.scss';

// Placeholder until a dedicated avatar photo asset is added.
const avatar = '/madina.jpg';

const Panel = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <aside className={`panel${collapsed ? ' panel--collapsed' : ''}`}>
      {/* A direct child of the panel, not of the header: at the smallest size the header
          is hidden entirely and this tab is the only thing left on screen. */}
      <Button
        variant="dark"
        icon={faBars}
        iconOnly
        ariaLabel="Toggle menu"
        ariaExpanded={!collapsed}
        className="panel__toggle"
        onClick={() => setCollapsed((value) => !value)}
      />

      {/* Everything that could ever need clipping (if its content outgrew the panel's
          height) lives in here, not on .panel itself — .panel__toggle sits outside this
          wrapper specifically so its deliberate overhang past the panel's own edge is
          never at risk of being clipped by it. */}
      <div className="panel__body">
        <header className="panel__header">
          <img className="panel__avatar" src={avatar} alt="User avatar" />
          <strong className="panel__name">Madina Jumaly</strong>
        </header>

        <Navigation />

        <footer className="panel__footer">
          <Button variant="dark" icon={faChevronLeft} onClick={() => navigate('/')}>
            Go back
          </Button>
        </footer>
      </div>
    </aside>
  );
};

export default Panel;
