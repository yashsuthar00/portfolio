"use client";

import { LeaderboardEntry } from "@/lib/leaderboard";

class RealtimeService {
  private eventSource: EventSource | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private callbacks: {
    onRecentScoresUpdate?: (scores: LeaderboardEntry[]) => void;
    onLeaderboardUpdate?: (leaderboard: LeaderboardEntry[]) => void;
  } = {};

  connect() {
    // Only connect if we're in the browser and not already connected
    if (typeof window === "undefined" || this.isConnected) {
      return;
    }

    try {
      // Use the same origin for production deployment (no separate server needed)
      this.eventSource = new EventSource("/api/realtime-scores");

      this.eventSource.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
      };

      this.eventSource.onmessage = event => {
        try {
          const data = JSON.parse(event.data);

          if (
            data.type === "recent_scores_updated" &&
            this.callbacks.onRecentScoresUpdate
          ) {
            this.callbacks.onRecentScoresUpdate(data.data);
          }

          if (
            data.type === "leaderboard_updated" &&
            this.callbacks.onLeaderboardUpdate
          ) {
            this.callbacks.onLeaderboardUpdate(data.data);
          }
        } catch {
          // Ignore parsing errors
        }
      };

      this.eventSource.onerror = () => {
        this.isConnected = false;
        this.eventSource?.close();

        // Attempt reconnection with simple delay
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          setTimeout(() => {
            this.connect();
          }, 2000 * this.reconnectAttempts); // 2s, 4s, 6s
        }
      };
    } catch {
      this.isConnected = false;
    }
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.isConnected = false;
    }
  }

  // Subscribe to real-time recent scores
  onRecentScoresUpdate(callback: (recentScores: LeaderboardEntry[]) => void) {
    this.callbacks.onRecentScoresUpdate = callback;
  }

  // Subscribe to real-time leaderboard
  onLeaderboardUpdate(callback: (leaderboard: LeaderboardEntry[]) => void) {
    this.callbacks.onLeaderboardUpdate = callback;
  }

  // Emit new score to other clients
  async emitNewScore(playerName: string, score: number) {
    if (!this.isConnected) return;

    try {
      await fetch("/api/realtime-scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playerName, score }),
      });
    } catch {
      // Silently handle errors
    }
  }

  // Check if service is connected
  isServiceConnected(): boolean {
    return this.isConnected;
  }

  // Get fallback status for UI
  isFallbackMode(): boolean {
    return !this.isServiceConnected();
  }

  // Remove event listeners (simplified)
  off() {
    this.callbacks = {};
  }

  // Dummy methods for compatibility (not needed with SSE)
  joinGameRoom() {}
  leaveGameRoom() {}
}

// Export singleton instance
export const realtimeService = new RealtimeService();
