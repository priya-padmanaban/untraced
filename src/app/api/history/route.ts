import { NextRequest, NextResponse } from "next/server";
import { allow } from "@/server/rate-limit";
import { personalHistory } from "@/server/store";

export async function POST(req: NextRequest) {
  const headers = { "Cache-Control": "private, no-store" };
  try {
    const body: unknown = await req.json();
    const playerId = typeof body === "object" && body !== null && "playerId" in body
      ? (body as { playerId?: unknown }).playerId
      : undefined;
    if (typeof playerId !== "string") {
      return NextResponse.json({ error: "Invalid player" }, { status: 400, headers });
    }
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
    if (!allow(`history:${ip}:${playerId}`, 12)) {
      return NextResponse.json({ error: "Try again shortly" }, { status: 429, headers });
    }
    return NextResponse.json({ entries: await personalHistory(playerId) }, { headers });
  } catch (error) {
    const invalid = error instanceof Error && error.message === "INVALID_PLAYER";
    return NextResponse.json(
      { error: invalid ? "Invalid player" : "History unavailable" },
      { status: invalid ? 400 : 503, headers },
    );
  }
}
