// src/components/ui/Avatar.jsx
import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import Image from 'react-bootstrap/Image';

const Avatar = ({ src, alt = 'Avatar', size = 40, className = '' }) => {
  return src ? (
    <Image
      src={src}
      roundedCircle
      alt={alt}
      width={size}
      height={size}
      className={className}
    />
  ) : (
    <FaUserCircle size={size} className={`text-secondary ${className}`} />
  );
};

export default Avatar;

