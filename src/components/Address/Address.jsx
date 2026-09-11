import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faLink } from '@fortawesome/free-solid-svg-icons';
import {
  faLinkedin,
  faGithub,
  faTwitter,
  faFacebookF,
  faSkype,
} from '@fortawesome/free-brands-svg-icons';
import './Address.scss';

const webHref = (value) => (/^https?:\/\//.test(value) ? value : `https://${value}`);

// Each contact kind resolves to its registered URI scheme, so the OS hands the value to
// the right agent. See https://www.iana.org/assignments/uri-schemes
// `showLabel` marks the kinds whose value is not self-describing and therefore render as
// a bold platform name over the value, per the design.
const CONTACT_TYPES = {
  // RFC 3966 global-number form: everything but digits and the leading + is separator.
  phone: { icon: faPhone, term: 'Phone', href: (v) => `tel:${v.replace(/[^\d+]/g, '')}` },
  // RFC 6068
  email: { icon: faEnvelope, term: 'Email', href: (v) => `mailto:${v}` },
  skype: { icon: faSkype, term: 'Skype', href: (v) => `skype:${v}?call`, showLabel: true },
  linkedin: { icon: faLinkedin, term: 'LinkedIn', href: webHref, showLabel: true },
  github: { icon: faGithub, term: 'GitHub', href: webHref, showLabel: true },
  twitter: { icon: faTwitter, term: 'Twitter', href: webHref, showLabel: true },
  facebook: { icon: faFacebookF, term: 'Facebook', href: webHref, showLabel: true },
};

// An unrecognised type still renders rather than silently dropping the contact.
const FALLBACK = { icon: faLink, href: webHref, showLabel: true };

const Address = ({ items = [] }) => (
  <address className="address">
    <ul className="address__list">
      {items.map((item) => {
        const config = CONTACT_TYPES[item.type] ?? FALLBACK;
        const term = item.label ?? config.term ?? item.type;
        const href = item.href ?? config.href(item.value);
        // tel:/mailto:/skype: hand off to a local agent — only web links open a tab.
        const isWeb = href.startsWith('http');

        return (
          <li
            key={`${item.type}-${item.value}`}
            className={`address__row${config.showLabel ? ' address__row--social' : ''}`}
          >
            <span className="address__icon">
              <FontAwesomeIcon icon={config.icon} />
            </span>
            <div className="address__value">
              {config.showLabel && <strong>{term}</strong>}
              <a href={href} {...(isWeb && { target: '_blank', rel: 'noopener noreferrer' })}>
                {/* Rows without a visible label still need one in the link's accessible
                    name, or the icon is the only thing saying what the value is. */}
                {!config.showLabel && <span className="address__label">{term}</span>}
                {item.value}
              </a>
            </div>
          </li>
        );
      })}
    </ul>
  </address>
);

export default Address;
