import React, { useState } from 'react';
import './Avatar.css';

const Avatar = ({ src, name, className = '', style = {} }) => {
  const [imgError, setImgError] = useState(false);
  const initial = name ? name.trim().charAt(0).toUpperCase() : '?';

  if (!src || imgError) {
    return (
      <div className={`avatar-initial-fallback ${className}`} style={style}>
        {initial}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className={className}
      style={style}
      onError={() => setImgError(true)}
    />
  );
};

export default Avatar;
