const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? false // In production, configure this to your domain
      : ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST"]
  }
});

// Store recent scores in memory (in production, use Redis or database)
let recentScores = [];
let leaderboard = [];

io.on('connection', (socket) => {
  console.log('🎮 Player connected:', socket.id);

  // Send current state to new player
  socket.emit('recent_scores_updated', recentScores);
  socket.emit('scores_updated', leaderboard);

  // Handle player joining game room
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`🏆 Player ${socket.id} joined room: ${roomId}`);
  });

  // Handle player leaving game room
  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
    console.log(`👋 Player ${socket.id} left room: ${roomId}`);
  });

  // Handle new score submission
  socket.on('new_score', (data) => {
    const { playerName, score, timestamp } = data;
    
    // Add to recent scores
    recentScores.unshift({
      playerName,
      score,
      timestamp,
      rank: 0 // Will be calculated on client
    });
    
    // Keep only last 10 recent scores
    recentScores = recentScores.slice(0, 10);
    
    // Update leaderboard logic (simplified)
    const existingIndex = leaderboard.findIndex(entry => entry.playerName === playerName);
    if (existingIndex >= 0) {
      if (score > leaderboard[existingIndex].score) {
        leaderboard[existingIndex].score = score;
      }
    } else {
      leaderboard.push({ playerName, score, rank: 0 });
    }
    
    // Sort leaderboard and assign ranks
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
    });
    
    // Keep only top 50
    leaderboard = leaderboard.slice(0, 50);
    
    console.log(`📊 New score: ${playerName} - ${score}`);
    
    // Broadcast updates to all players in snake-game room
    io.to('snake-game').emit('recent_scores_updated', recentScores.slice(0, 5));
    io.to('snake-game').emit('scores_updated', leaderboard.slice(0, 10));
  });

  socket.on('disconnect', () => {
    console.log('👋 Player disconnected:', socket.id);
  });
});

const PORT = process.env.SOCKET_PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 Socket.io server running on port ${PORT}`);
  console.log('🎮 Ready for real-time Snake Game scores!');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Socket server shutting down...');
  httpServer.close(() => {
    console.log('✅ Socket server closed');
    process.exit(0);
  });
});
