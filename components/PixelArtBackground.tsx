import React from 'react';

export const PixelArtBackground: React.FC = () => {
  // The background container has a pseudo-element for the animated gradient.
  // The inner div creates a noise/grain overlay for a retro CRT feel.
  return (
    <div className="pixel-art-background">
      <div className="noise-overlay" />
    </div>
  );
};
