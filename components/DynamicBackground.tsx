
import React from 'react';

// This is the animated cityscape GIF the user requested.
const BACKGROUND_URL = 'https://forums.rpgmakerweb.com/data/attachments/90/90682-271a42b91433b94db629d7a72f61233b.jpg';

const backgroundStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  zIndex: -1,
  backgroundImage: `url('${BACKGROUND_URL}')`,
};

export const DynamicBackground: React.FC = () => {
  return (
    <div
      style={backgroundStyle}
      aria-hidden="true"
    />
  );
};