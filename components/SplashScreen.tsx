
import React from 'react';

// Re-using the ASCII art for brand consistency.
const monsterJamAscii = `
     /$$      /$$                                 /$$                                  /$$$$$                        
    | $$$    /$$$                                | $$                                 |__  $$                        
    | $$$$  /$$$$  /$$$$$$  /$$$$$$$   /$$$$$$$ /$$$$$$    /$$$$$$   /$$$$$$             | $$  /$$$$$$  /$$$$$$/$$$$ 
    | $$ $$/$$ $$ /$$__  $$| $$__  $$ /$$_____/|_  $$_/   /$$__  $$ /$$__  $$            | $$ |____  $$| $$_  $$_  $$
| $$  $$$| $$| $$  \ $$| $$  \ $$|  $$$$$$   | $$    | $$$$$$$$| $$  \__/       /$$  | $$  /$$$$$$$| $$ \ $$ \ $$
   | $$\  $ | $$| $$  | $$| $$  | $$ \____  $$  | $$ /$$| $$_____/| $$            | $$  | $$ /$$__  $$| $$ | $$ | $$
    | $$ \/  | $$|  $$$$$$/| $$  | $$ /$$$$$$$/  |  $$$$/|  $$$$$$$| $$            |  $$$$$$/|  $$$$$$$| $$ | $$ | $$
   |__/     |__/ \______/ |__/  |__/|_______/    \___/   \_______/|__/             \______/  \_______/|__/ |__/ |__/
`;

/**
 * The SplashScreen component.
 * This is the very first screen shown to the user, prompting them to click to
 * enable audio and proceed to the main menu. This is necessary to comply with
 * browser autoplay policies.
 * @param {object} props - Component props.
 * @param {() => void} props.onClick - Callback function to execute when the screen is clicked.
 */
export const SplashScreen: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <div
      className="relative flex flex-col h-screen items-center justify-center font-vt323 text-text-light p-2 text-center cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label="Click to start the game and enable audio"
    >
      <div className="relative z-10 flex flex-col items-center justify-center">
        <pre className="text-primary text-[4px] sm:text-[6px] md:text-[8px] leading-tight mb-2">
          {monsterJamAscii}
        </pre>
        <p className="text-xl sm:text-2xl mt-8 animate-pulse text-shadow-dark">
          CLICK ANYWHERE TO START
        </p>
      </div>
    </div>
  );
};
