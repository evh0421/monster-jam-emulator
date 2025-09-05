import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_PROMPT, INITIAL_USER_PROMPT } from '../constants';

// Ensure the API key is available in the environment variables.
// This is a critical step for the application to communicate with the Gemini API.
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

// Initialize the Google GenAI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// This variable will hold the chat session.
let chat: Chat | null = null;

/**
 * A helper function to handle potential API errors gracefully.
 * This centralizes error logging and provides a more user-friendly error message.
 * @param error - The error object caught from a try-catch block.
 * @param context - A string describing where the error occurred (e.g., "initializing game").
 * @returns never - This function always throws an error and never returns a value.
 */
const handleApiError = (error: unknown, context: string): never => {
    console.error(`Error ${context} with Gemini API:`, error);
    if (error instanceof Error) {
        // Re-throw with a more user-friendly message.
        throw new Error(`The AI is having trouble with your request. Please try again. (Context: ${context})`);
    }
    // For cases where the caught object is not a standard Error.
    throw new Error(`Failed to ${context}. An unknown error occurred with the AI model.`);
};


/**
 * Initializes a new game session.
 * This function sets up the initial chat session with the system prompt
 * and gets the first response from the AI.
 * @returns A promise that resolves with the initial game content from the AI (the title screen).
 */
export const initializeGame = async (): Promise<string> => {
    try {
        // Create a new chat session with the system prompt and model configuration.
        // FIX: `systemInstruction` must be a property of the `config` object.
        chat = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            temperature: 1,
            topP: 1,
            systemInstruction: SYSTEM_PROMPT,
          },
        });

        // Send the initial user prompt to start the game.
        const response: GenerateContentResponse = await chat.sendMessage({ message: INITIAL_USER_PROMPT });
        
        return response.text;
    } catch (error) {
        return handleApiError(error, "initializing game");
    }
};

/**
 * Sends the player's input to the AI and gets the next game update.
 * @param userInput - The string input from the player's text box.
 * @returns A promise that resolves with the AI's next response as a string.
 */
export const getGameUpdate = async (userInput: string): Promise<string> => {
    // Return early if input is empty to avoid unnecessary API calls.
    if (!userInput.trim()) {
        return "";
    }
    
    // Ensure the chat has been initialized.
    if (!chat) {
        throw new Error("Game has not been initialized. Please start the game first.");
    }
    
    try {
        // Send the new user message to the ongoing chat session.
        const response: GenerateContentResponse = await chat.sendMessage({ message: userInput });

        return response.text;
    } catch (error) {
        return handleApiError(error, "getting game update");
    }
};