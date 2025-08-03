/**
 * Audio service for mechanical keyboard click sounds and other audio feedback
 */
export class AudioService {
  private audioContext: AudioContext | null = null;
  private isEnabled: boolean = true;
  private volumes = {
    keypress: 0.3,
    enter: 0.4,
    error: 0.5,
    success: 0.4,
  };

  constructor() {
    // Initialize AudioContext on user interaction
    if (typeof window !== "undefined") {
      document.addEventListener("click", this.initAudioContext.bind(this), {
        once: true,
      });
      document.addEventListener("keydown", this.initAudioContext.bind(this), {
        once: true,
      });
    }
  }

  private initAudioContext(): void {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
    }
  }

  private createBeepSound(
    frequency: number,
    duration: number,
    volume: number = 0.3
  ): void {
    if (!this.audioContext || !this.isEnabled) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(
        frequency,
        this.audioContext.currentTime
      );
      oscillator.type = "square"; // Mechanical keyboard sound

      // Envelope for more realistic sound
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        volume,
        this.audioContext.currentTime + 0.01
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        this.audioContext.currentTime + duration
      );

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch {
      // Audio playback failed, skip silently
    }
  }

  private createClickSound(): void {
    if (!this.audioContext || !this.isEnabled) return;

    try {
      // Create a more realistic mechanical keyboard click sound
      const bufferSize = this.audioContext.sampleRate * 0.1; // 100ms
      const buffer = this.audioContext.createBuffer(
        1,
        bufferSize,
        this.audioContext.sampleRate
      );
      const output = buffer.getChannelData(0);

      // Generate noise with envelope
      for (let i = 0; i < bufferSize; i++) {
        const envelope = Math.exp(-i / (bufferSize * 0.1)); // Fast decay
        output[i] = (Math.random() * 2 - 1) * envelope * this.volumes.keypress;
      }

      const bufferSource = this.audioContext.createBufferSource();
      const filter = this.audioContext.createBiquadFilter();

      bufferSource.buffer = buffer;
      filter.type = "highpass";
      filter.frequency.setValueAtTime(2000, this.audioContext.currentTime);

      bufferSource.connect(filter);
      filter.connect(this.audioContext.destination);

      bufferSource.start();
    } catch {
      // Fallback to simple beep
      this.createBeepSound(1000, 0.05, this.volumes.keypress);
    }
  }

  /**
   * Play keypress sound
   */
  playKeypress(): void {
    this.createClickSound();
  }

  /**
   * Play enter key sound (slightly different)
   */
  playEnter(): void {
    this.createBeepSound(800, 0.1, this.volumes.enter);
  }

  /**
   * Play error sound
   */
  playError(): void {
    this.createBeepSound(300, 0.2, this.volumes.error);
  }

  /**
   * Play success sound
   */
  playSuccess(): void {
    // Two-tone success sound
    this.createBeepSound(600, 0.1, this.volumes.success);
    setTimeout(() => {
      this.createBeepSound(800, 0.1, this.volumes.success);
    }, 100);
  }

  /**
   * Play game over sound
   */
  playGameOver(): void {
    // Descending tones
    [500, 400, 300, 200].forEach((freq, index) => {
      setTimeout(() => {
        this.createBeepSound(freq, 0.3, this.volumes.error);
      }, index * 150);
    });
  }

  /**
   * Play achievement sound
   */
  playAchievement(): void {
    // Ascending success melody
    [400, 500, 600, 800].forEach((freq, index) => {
      setTimeout(() => {
        this.createBeepSound(freq, 0.2, this.volumes.success);
      }, index * 100);
    });
  }

  /**
   * Toggle audio on/off
   */
  toggleAudio(): boolean {
    this.isEnabled = !this.isEnabled;
    return this.isEnabled;
  }

  /**
   * Check if audio is enabled
   */
  isAudioEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Set volume for specific sound type
   */
  setVolume(type: keyof typeof this.volumes, volume: number): void {
    this.volumes[type] = Math.max(0, Math.min(1, volume));
  }
}

// Singleton instance
export const audioService = new AudioService();
