import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Avatar from '@mui/material/Avatar';

const BlurAvatar = ({ src, placeholder, alt }) => (
  <Avatar sx={{ width: 40, height: 40 }}>
    <LazyLoadImage
      alt={alt}
      src={src}
      placeholderSrc={placeholder} // 👈 use sharp-generated placeholder here
      effect="blur"
      width={40}
      height={40}
      style={{ borderRadius: '50%' }}
    />
  </Avatar>
);

export default BlurAvatar;
