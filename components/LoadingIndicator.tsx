import React from 'react';

export const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <p className="text-3xl sm:text-4xl text-text-dark animate-pulse">GENERATING...</p>
      </div>
    </div>
  );
};
