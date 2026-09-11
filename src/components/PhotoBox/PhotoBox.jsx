import './PhotoBox.scss';

const PhotoBox = ({ name, title, description, avatar }) => {
  return (
    <figure className="photo-box">
      <div className="crop-photo">
        <img src={avatar} alt="Madina Jumaly" />
      </div>
      <figcaption>
        <strong>{name}</strong>
        <article>
          <header className="title">{title}</header>
          <div className="description">{description}</div>
        </article>
      </figcaption>
    </figure>
  );
};

export default PhotoBox;
