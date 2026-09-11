import { render, screen } from '@testing-library/react';
import PhotoBox from './PhotoBox';

describe('PhotoBox', () => {
  it('renders name, title, and description', () => {
    render(
      <PhotoBox name="Madina Jumaly" title="Software Engineer" description="Bio text" avatar="/madina.jpg" />
    );
    expect(screen.getByText('Madina Jumaly')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Bio text')).toBeInTheDocument();
  });
});
