
import React, { useState, useCallback, useEffect } from 'react';
import { GameDisplay } from './components/GameDisplay';
import { InputBar } from './components/InputBar';
import { LoadingIndicator } from './components/LoadingIndicator';
import { getGameUpdate, initializeGame } from './services/geminiService';
import { DynamicBackground } from './components/DynamicBackground';
import { audioManager } from './services/audioService';
import { SplashScreen } from './components/SplashScreen';

// A cooler, more readable ASCII art for the game title.
// FIX: Escaped backslashes and backticks in the template literal to fix syntax errors.
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

// Introductory text displayed on the start screen.
const titleScreenText = `
    WHEN HUMAN CREATIONS MIX WITH AI WHEREWITHAL, THEY CREATE A MONSTER JAM EMULATOR 
     
    (bugs will occur sometimes and it will not be the same every time)
           
The game will give you options but feel free to use the text box to type anything you want
           
`;


/**
 * The StartScreen component.
 * This is the first thing the user sees and prompts them to begin the game.
 * @param {object} props - Component props.
 * @param {() => void} props.onStart - Callback function to execute when the start button is clicked.
 */
const StartScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="relative flex flex-col h-screen items-center justify-center font-vt323 text-text-light p-2 text-center">
      <div className="relative z-10 flex flex-col items-center justify-center">
        <pre className="text-primary text-[4px] sm:text-[6px] md:text-[8px] leading-tight mb-2">
          {monsterJamAscii}
        </pre>
        <pre className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap mb-8 text-shadow-dark">
          {titleScreenText}
        </pre>
        <button
          onClick={onStart}
          className="bg-primary text-text-dark text-2xl sm:text-4xl font-bold py-4 px-8 hover:bg-accent focus:outline-none focus:ring-4 ring-primary/50 ring-offset-4 ring-offset-bg-dark transition-transform duration-200 hover:scale-110"
        >
          BEGIN JAM
        </button>
      </div>
    </div>
  );
};

/**
 * The main GameScreen component.
 * This component renders the game display and input bar once the game has started.
 * @param {object} props - Component props.
 * @param {string} props.content - The current game text to display.
 * @param {(input: string) => void} props.onSend - Callback to send user input.
 * @param {boolean} props.loading - Indicates if the app is waiting for the AI response.
 */
const GameScreen: React.FC<{ content: string; onSend: (input: string) => void; loading: boolean }> = ({ content, onSend, loading }) => (
    <div className="relative flex flex-col h-screen w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8 font-vt323">
        <div 
            className="flex-grow bg-surface/80 backdrop-blur-sm p-4 sm:p-6 border-4 border-crt-grey/50 overflow-hidden mb-4"
            style={{ 
              boxShadow: 'inset 0 0 15px rgba(0,0,0,0.7)',
              textShadow: '0 0 5px #c8c8c8',
            }}
        >
            {/* Show loading indicator if loading and there's no content yet, otherwise show the game display */}
            {loading && !content ? <LoadingIndicator /> : <GameDisplay content={content} />}
        </div>
        <InputBar onSend={onSend} disabled={loading} />
    </div>
);

/**
 * The main App component.
 * This is the root component that manages the overall application state and logic.
 */
const App: React.FC = () => {
    // State to hold the current text content of the game.
    const [gameContent, setGameContent] = useState<string>('');
    // State to indicate when the app is waiting for a response from the AI.
    const [loading, setLoading] = useState<boolean>(false);
    // State to store any errors that occur during API calls.
    const [error, setError] = useState<string | null>(null);
    // State to track whether the splash screen has been passed.
    const [splashPassed, setSplashPassed] = useState<boolean>(false);
    // State to track whether the game has started (i.e., user has left the start screen).
    const [gameStarted, setGameStarted] = useState<boolean>(false);

    /**
     * Parses the AI's response text to remove any legacy audio commands before displaying it.
     * @param {string} text - The full response text from the AI.
     */
    const parseAndUpdateState = useCallback((text: string) => {
        // This regex strips out any [PLAY_AUDIO:...] commands the AI might still
        // send, ensuring they don't appear in the game text.
        const audioCommandRegex = /\[PLAY_AUDIO: (jam|world|fight|boss)\.mp3\]\s*/;
        const cleanText = text.replace(audioCommandRegex, '');

        // Update the visible game content.
        setGameContent(cleanText);
    }, []);

    /**
     * Handles the initial start of the game.
     * Calls the AI service to get the first piece of game content.
     */
    const handleStartGame = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const initialContent = await initializeGame();
            parseAndUpdateState(initialContent);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [parseAndUpdateState]);

    /**
     * Sends the user's input to the AI service and updates the game with the response.
     * @param {string} userInput - The text entered by the user.
     */
    const handleSend = useCallback(async (userInput: string) => {
        setLoading(true);
        setError(null);
        try {
            const newContent = await getGameUpdate(userInput);
            if (newContent) {
                parseAndUpdateState(newContent);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [parseAndUpdateState]);

    /**
     * Handles the click on the initial splash screen.
     * This initializes the audio manager and starts playing the shuffled playlist,
     * which is required by browsers to be triggered by a direct user action.
     */
    const handleSplashClick = useCallback(() => {
        if (splashPassed) return; // Prevent multiple executions
        
        setSplashPassed(true);
        
        // Initialize the audio manager and start playing the shuffled playlist.
        // This must be done in response to a user gesture to comply with browser autoplay policies.
        audioManager.initialize();
        audioManager.play();
    }, [splashPassed]);

    /**
     * Callback for the "BEGIN JAM" button on the start screen.
     * This function now only sets the game as started and calls the API.
     */
    const onStartClick = useCallback(() => {
      setGameStarted(true);
      handleStartGame();
    }, [handleStartGame]);

    // If an error occurs, display an error message instead of the game.
    if (error) {
        return <div className="h-screen flex items-center justify-center bg-bg-dark text-accent font-vt323 text-2xl p-4 text-center">{`ERROR: ${error}`}</div>;
    }

    // Determines which component to render based on the current application state.
    const renderContent = () => {
        if (!splashPassed) {
            return <SplashScreen onClick={handleSplashClick} />;
        }
        if (!gameStarted) {
            return <StartScreen onStart={onStartClick} />;
        }
        return <GameScreen content={gameContent} onSend={handleSend} loading={loading} />;
    };

    // Main render method for the component.
    return (
        <main className="relative z-0">
            {/* The dynamic background is always rendered */}
            <DynamicBackground />
            
            {/* Conditionally render the correct screen */}
            {renderContent()}
        </main>
    );
};

export default App;
