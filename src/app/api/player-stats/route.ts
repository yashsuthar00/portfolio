import { NextRequest, NextResponse } from "next/server";
import { getPlayerStats as mongoGetPlayerStats } from "@/services/MongoDBService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const playerName = searchParams.get("playerName");

    if (!playerName) {
      return NextResponse.json(
        { error: "Player name required" },
        { status: 400 }
      );
    }

    const stats = await mongoGetPlayerStats(playerName);
    return NextResponse.json({ stats });
  } catch {
    return NextResponse.json({ stats: null }, { status: 500 });
  }
}
