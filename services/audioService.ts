
import { mainPlaylist } from '../audio/clips';

class AudioManager {
  private audioElement: HTMLAudioElement | null = null;
  private isInitialized = false;
  private playlist: string[] = [];
  private playlistIndex = 0;

  /**
   * Shuffles the main playlist using the Fisher-Yates algorithm
   * to ensure a random playback order each session.
   */
  private shufflePlaylist(): void {
    let currentIndex = this.playlist.length;
    let randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [this.playlist[currentIndex], this.playlist[randomIndex]] = [
        this.playlist[randomIndex], this.playlist[currentIndex]
      ];
    }
  }

  /**
   * Handles the end of an audio track by advancing to the next
   * song in the shuffled playlist.
   */
  private handleTrackEnded(): void {
    // Move to the next track, looping back to the start if necessary.
    this.playlistIndex = (this.playlistIndex + 1) % this.playlist.length;
    this.play(true); // Force play the next track
  }

  /**
   * Initializes the AudioManager. This creates the audio element, shuffles
   * the playlist, and must be called from a user gesture handler (like a click)
   * to comply with browser autoplay policies.
   */
  public initialize(): void {
    if (this.isInitialized) return;
    
    // Copy the main playlist and shuffle it for this session
    this.playlist = [...mainPlaylist];
    this.shufflePlaylist();
    
    this.audioElement = new Audio();
    this.audioElement.volume = 0.5; // Set a default volume
    this.isInitialized = true;

    // When a track finishes, call the handler to play the next one.
    this.audioElement.addEventListener('ended', this.handleTrackEnded.bind(this));

    // Add a detailed error handler for issues with remote files.
    this.audioElement.onerror = () => {
      if (this.audioElement?.src) {
        console.error(
          `Error playing audio track.\n` +
          `The audio file from URL '${this.audioElement.src}' could not be loaded.\n\n` +
          `TROUBLESHOOTING:\n` +
          `1. Check your internet connection.\n` +
          `2. Make sure the URL is correct and publicly accessible.`
        );
        this.stop();
      }
    };
  }

  /**
   * Plays the current audio track from the shuffled playlist.
   * @param {boolean} [forceNext=false] - Internal flag to force playback.
   */
  public play(forceNext = false): void {
    if (!this.isInitialized || !this.audioElement) {
      console.warn("Audio Manager not initialized. Cannot play audio.");
      return;
    }

    // Don't restart the music if it's already playing unless forced.
    if (!this.audioElement.paused && !forceNext) {
      return;
    }
    
    // Music should not loop individually; the 'ended' event handles the playlist.
    this.audioElement.loop = false; 

    const newSrc = this.playlist[this.playlistIndex];
    
    if (!newSrc) {
        console.error(`Playlist track at index ${this.playlistIndex} is invalid.`);
        this.stop();
        return;
    }

    if (this.audioElement.src !== newSrc) {
        this.audioElement.src = newSrc;
    }
    
    const playPromise = this.audioElement.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        if (error.name === 'NotAllowedError') {
          console.warn(`Playback was prevented. User may need to interact with the page first.`);
        } else {
          console.error(`An unexpected error occurred when trying to play audio:`, error);
        }
      });
    }
  }

  /**
   * Stops the currently playing audio and resets its position.
   */
  public stop(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      if(this.audioElement.src) { 
        this.audioElement.currentTime = 0;
      }
    }
  }
}

// Export a single, shared instance of the AudioManager to be used across the app.
export const audioManager = new AudioManager();
