import React from 'react';

interface GameDisplayProps {
  content: string;
}

export const GameDisplay: React.FC<GameDisplayProps> = ({ content }) => {
  return (
    <div className="w-full h-full overflow-y-auto pr-2 no-scrollbar">
      <pre className="text-text-dark text-sm sm:text-base whitespace-pre-wrap break-words leading-loose tracking-wide">
        {content}
      </pre>
    </div>
  );
};
