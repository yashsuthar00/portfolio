"use client";

import { io, Socket } from "socket.io-client";
import { LeaderboardEntry } from "@/lib/leaderboard";

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    // Only connect if we're in the browser and not already connected
    if (typeof window === "undefined" || this.isConnected) {
      return;
    }

    try {
      // For development, use localhost. In production, this would be your server URL
      const serverUrl =
        process.env.NODE_ENV === "development"
          ? "http://localhost:3001"
          : window.location.origin;

      this.socket = io(serverUrl, {
        transports: ["websocket", "polling"], // Fallback to polling if websocket fails
        timeout: 5000,
      });

      this.socket.on("connect", () => {
        // console.log('🔌 Connected to real-time score server');
        this.isConnected = true;
        this.reconnectAttempts = 0;
      });

      this.socket.on("disconnect", () => {
        // console.log('🔌 Disconnected from real-time score server');
        this.isConnected = false;
      });

      this.socket.on("connect_error", () => {
        // console.log('❌ Socket connection error:', error.message);
        this.isConnected = false;

        // Attempt reconnection with exponential backoff
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          const delay = Math.pow(2, this.reconnectAttempts) * 1000; // 2s, 4s, 8s, 16s, 32s
          setTimeout(() => {
            // console.log(`🔄 Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
            this.connect();
          }, delay);
        }
      });
    } catch {
      // console.warn('⚠️ Socket.io not available, falling back to polling');
      this.isConnected = false;
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Subscribe to real-time score updates
  onScoreUpdate(callback: (scores: LeaderboardEntry[]) => void) {
    if (this.socket) {
      this.socket.on("scores_updated", callback);
    }
  }

  // Subscribe to real-time recent scores
  onRecentScoresUpdate(callback: (recentScores: LeaderboardEntry[]) => void) {
    if (this.socket) {
      this.socket.on("recent_scores_updated", callback);
    }
  }

  // Emit new score to other clients
  emitNewScore(playerName: string, score: number) {
    if (this.socket && this.isConnected) {
      this.socket.emit("new_score", {
        playerName,
        score,
        timestamp: Date.now(),
      });
    }
  }

  // Join game room for competitive features
  joinGameRoom(roomId: string = "global") {
    if (this.socket && this.isConnected) {
      this.socket.emit("join_room", roomId);
    }
  }

  // Leave game room
  leaveGameRoom(roomId: string = "global") {
    if (this.socket && this.isConnected) {
      this.socket.emit("leave_room", roomId);
    }
  }

  // Remove event listeners
  off(event: string, callback?: (...args: unknown[]) => void) {
    if (this.socket) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.socket.off(event, callback as any);
    }
  }

  // Check if socket is connected
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  // Get fallback status for UI
  isFallbackMode(): boolean {
    return !this.isSocketConnected();
  }
}

// Export singleton instance
export const socketService = new SocketService();
