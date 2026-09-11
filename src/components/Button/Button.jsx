import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Button.scss';

const Button = ({
  children,
  icon,
  variant = 'dark',
  iconOnly = false,
  onClick,
  type = 'button',
  className = '',
  ariaLabel,
  ariaExpanded,
  disabled = false,
}) => {
  const classes = [
    'Button',
    `Button--${variant}`,
    iconOnly ? 'Button--icon-only' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={iconOnly ? ariaLabel : undefined}
      aria-expanded={ariaExpanded}
    >
      {icon && <FontAwesomeIcon icon={icon} className="Button__icon" />}
      {!iconOnly && children && <span className="Button__label">{children}</span>}
    </button>
  );
};

export default Button;
