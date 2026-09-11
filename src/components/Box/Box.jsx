import './Box.scss';

// The style guide's `.info-box` is the section wrapper: a heading plus its content, with
// the page's section rhythm baked in.
const Box = ({ id, title, content, headingLevel: Heading = 'h2', className = '' }) => {
  return (
    <section id={id} className={`info-box ${className}`.trim()}>
      <Heading>{title}</Heading>
      <div className="info-box__content">{content}</div>
    </section>
  );
};

export default Box;
