import { NextRequest, NextResponse } from "next/server";
import {
  addScore as mongoAddScore,
  getTopScores as mongoGetTopScores,
} from "@/services/MongoDBService";

export async function POST(request: NextRequest) {
  try {
    const { playerName, score } = await request.json();

    if (!playerName || typeof score !== "number") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const success = await mongoAddScore(playerName, score);
    return NextResponse.json({ success });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const scores = await mongoGetTopScores("snake", limit);
    return NextResponse.json({ scores });
  } catch {
    return NextResponse.json({ scores: [] }, { status: 500 });
  }
}
