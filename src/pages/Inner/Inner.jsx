import Panel from '../../components/Panel/Panel';
import Box from '../../components/Box/Box';
import Info from '../../components/Info/Info';
import Expertise from '../../components/Expertise/Expertise';
import Portfolio from '../../components/Portfolio/Portfolio';
import Address from '../../components/Address/Address';
import EducationSection from './EducationSection';
import BackToTop from './BackToTop';
import './Inner.scss';

const EXPERIENCE = [
  {
    date: 'May 2026 – Jun 2026',
    info: {
      company: 'BI Education',
      job: 'Software Engineer Intern',
      description:
        'Built the React frontend and REST API for the trainer module of aitanym.kz, an adaptive learning platform.',
    },
  },
  {
    date: 'Mar 2025 – Apr 2025',
    info: {
      company: 'Engineering and Technical Center',
      job: 'Software Engineer Intern',
      description:
        'Designed and implemented a passwordless authentication system for a Django web application using Kazakhstani electronic digital signatures (EDS) via NCALayer, replacing traditional password login with PKI-based identity verification. Built the full integration stack: custom Django user model, CSRF-exempt REST API endpoint for signature-based login, and a JavaScript WebSocket client connecting to NCALayer.',
    },
  },
  {
    date: 'Mar 2024 – Apr 2024',
    info: {
      company: 'Engineering and Technical Center',
      job: 'Machine Learning Intern',
      description:
        'Built a Django web application for automated accounting document recognition, implementing user authentication, page routing, and database models. Developed an OCR pipeline using PaddleOCR, OpenCV, and TensorFlow to detect tables in PDF/image documents. Received a 90/100 evaluation and written commendation for initiative and quality of work.',
    },
  },
];

const ABOUT =
  "I'm a software engineer with hands-on experience across machine learning, computer vision, and full-stack web development. My work has ranged from training and evaluating deep learning models for image recognition to building secure, PKI-based authentication systems for government web applications. I care about writing clean, well-documented code and enjoy working through problems that span the full stack — from data pipelines to the interfaces people actually use.";

const CONTACTS = [
  { type: 'phone', value: '+7 776-165-4683' },
  { type: 'email', value: 'madinajumaly@gmail.com' },
  { type: 'linkedin', value: 'https://www.linkedin.com/in/madinajumaly' },
  { type: 'github', value: 'https://github.com/madinajumaly' },
];

const Inner = () => {
  return (
    <div className="Inner">
      <Panel />

      <main className="inner__content">
        <Box id="about" title="About me" content={<Info text={ABOUT} />} />

        <Box id="education" title="Education" content={<EducationSection />} />

        <Box id="experience" title="Experience" content={<Expertise data={EXPERIENCE} />} />

        <Box id="portfolio" title="Portfolio" content={<Portfolio />} />

        <Box id="contacts" title="Contacts" content={<Address items={CONTACTS} />} />
      </main>

      <BackToTop />
    </div>
  );
};

export default Inner;
