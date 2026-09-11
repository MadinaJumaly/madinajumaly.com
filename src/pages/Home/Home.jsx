import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import background from '../../assets/images/background.jpg';
import './Home.scss';

// Placeholder until a dedicated avatar photo asset is added.
const avatar = '/madina.jpg';

const Home = () => {
  const navigate = useNavigate();

  return (
    <main className="home" style={{ backgroundImage: `url(${background})` }}>
      <div className="home__overlay" />
      <div className="home__content">
        <div className="home__avatar-wrapper">
          <img className="home__avatar" src={avatar} alt="User photo" />
        </div>
        <h1 className="home__name">Madina Jumaly</h1>
        <p className="home__subtitle">Software Engineer</p>
        <p className="home__description">
          I build stuff for my brothers and sisters — mostly websites,
          plus some data on the side. JS by day, Python by night.
        </p>
        <Button variant="dark" className="home__cta" onClick={() => navigate('/inner')}>
          Know more
        </Button>
      </div>
    </main>
  );
};

export default Home;
