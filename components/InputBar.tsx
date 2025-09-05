import React, { useState } from 'react';

interface InputBarProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export const InputBar: React.FC<InputBarProps> = ({ onSend, disabled }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !disabled) {
      onSend(inputValue);
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-4 items-stretch">
      <div className="relative flex-grow">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={disabled}
          placeholder={disabled ? 'GENERATING...' : 'TYPE ACTION...'}
          className="input-bar-input w-full bg-crt-grey text-text-light placeholder-placeholder border-2 border-secondary/50 p-3 pr-4 text-sm sm:text-lg focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={disabled}
        className="send-button bg-crt-grey text-text-light font-bold py-3 px-4 text-sm sm:text-lg hover:bg-primary focus:outline-none focus:ring-4 ring-primary/50 ring-offset-4 ring-offset-bg-dark disabled:opacity-50 disabled:cursor-not-allowed"
      >
        SEND
      </button>
    </form>
  );
};
