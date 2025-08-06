import { NextRequest } from "next/server";

// Store active connections and recent scores in memory
// In production, you'd use Redis or a database with pub/sub
const clients = new Set<ReadableStreamDefaultController>();
let recentScores: Array<{
  playerName: string;
  score: number;
  timestamp: number;
  rank: number;
}> = [];

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      // Add client to active connections
      clients.add(controller);

      // Send initial data
      const data = `data: ${JSON.stringify({
        type: "recent_scores_updated",
        data: recentScores.slice(0, 5),
      })}\n\n`;

      controller.enqueue(new TextEncoder().encode(data));

      // Cleanup when client disconnects
      return () => {
        clients.delete(controller);
      };
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { playerName, score } = await request.json();

    // Add to recent scores
    recentScores.unshift({
      playerName,
      score,
      timestamp: Date.now(),
      rank: 0, // Will be calculated on client
    });

    // Keep only last 10 recent scores
    recentScores = recentScores.slice(0, 10);

    // Broadcast to all connected clients
    const data = `data: ${JSON.stringify({
      type: "recent_scores_updated",
      data: recentScores.slice(0, 5),
    })}\n\n`;

    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);

    // Send to all connected clients
    clients.forEach(controller => {
      try {
        controller.enqueue(encodedData);
      } catch {
        // Client disconnected, remove from set
        clients.delete(controller);
      }
    });

    return Response.json({ success: true });
  } catch {
    // console.error("Error processing score update:", error);
    return Response.json({ error: "Failed to process score" }, { status: 500 });
  }
}
