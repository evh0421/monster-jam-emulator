
import React, { useState } from 'react';

interface LocalMusicLoaderProps {
  onMusicLoaded: (url: string) => void;
}

/**
 * A component that allows the user to select a local audio file (.mp3)
 * to be used as custom background music for the game.
 */
export const LocalMusicLoader: React.FC<LocalMusicLoaderProps> = ({ onMusicLoaded }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  /**
   * Handles the file input change event. It validates the file type,
   * creates a temporary local URL for it, and passes that URL to the parent.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The file input event.
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'audio/mpeg') {
      // Create a blob URL, a temporary local URL for the selected file.
      const objectUrl = URL.createObjectURL(file);
      onMusicLoaded(objectUrl);
      setFileName(file.name);
    } else {
      setFileName(null);
      // Optional: alert the user if they select a non-mp3 file.
      alert('Please select a valid .mp3 file.');
    }
  };

  return (
    <div className="mt-6 text-center">
      <label
        htmlFor="music-upload"
        className="cursor-pointer bg-crt-grey text-text-light text-lg sm:text-xl font-bold py-2 px-4 hover:bg-accent focus:outline-none focus:ring-4 ring-primary/50 ring-offset-2 ring-offset-bg-dark transition-transform duration-200 hover:scale-105"
        aria-label="Upload custom exploration music in MP3 format"
      >
        LOAD CUSTOM EXPLORATION MUSIC (.MP3)
      </label>
      <input
        id="music-upload"
        type="file"
        accept="audio/mpeg"
        onChange={handleFileChange}
        className="hidden"
      />
      {fileName && <p className="text-sm mt-2 text-primary/80" aria-live="polite">Loaded: {fileName}</p>}
    </div>
  );
};
