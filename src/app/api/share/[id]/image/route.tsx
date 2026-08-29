import { ImageResponse } from "next/og";
import { getSharedResult } from "@/server/shares";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/share/[id]/image">,
) {
  const { id } = await params;
  const result = await getSharedResult(id);

  if (!result) {
    return new Response("Not found", { status: 404 });
  }

  const positions = result.route.map((dot, index) => ({
    dot,
    index,
    x: 160 + ((dot - 1) % 3) * 185,
    y: 112 + Math.floor((dot - 1) / 3) * 185,
  }));
  const achievement = result.wasFirstDiscovery
    ? `FIRST FIND  ·  #${result.discoveryOrdinal.toLocaleString()}`
    : `SEEN ${result.routeSubmissionCount.toLocaleString()} ${
        result.routeSubmissionCount === 1 ? "TIME" : "TIMES"
      }`;
  const routeColor = result.wasFirstDiscovery ? "#d8ff45" : "#ff6047";

  const image = new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#0d0d0b",
        color: "#f4f0e6",
        fontFamily: "Arial",
        padding: "54px 62px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 62,
          top: 45,
          fontSize: 23,
          fontWeight: 900,
          letterSpacing: 7,
        }}
      >
        UNTRACED
      </div>
      <div
        style={{
          position: "absolute",
          left: 62,
          bottom: 52,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            color: "#d8ff45",
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: 3,
          }}
        >
          YOUR ROUTE
        </div>
        <div style={{ fontSize: 42, fontWeight: 900, marginTop: 9 }}>
          {achievement}
        </div>
        {result.personalStreak > 1 && (
          <div style={{ color: "#aaa99f", fontSize: 20, marginTop: 9 }}>
            {result.personalStreak}-find streak
          </div>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          right: 69,
          top: 44,
          width: 590,
          height: 590,
          border: "1px solid #35372f",
          background: "#11120f",
          display: "flex",
          overflow: "hidden",
        }}
      >
        <svg
          width="590"
          height="590"
          viewBox="0 0 590 590"
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          {positions.slice(1).map((position, index) => {
            const previous = positions[index];

            return (
              <line
                key={`line-${position.dot}`}
                x1={previous.x}
                y1={previous.y}
                x2={position.x}
                y2={position.y}
                stroke={routeColor}
                strokeWidth="6"
                strokeLinecap="round"
              />
            );
          })}
          {positions.map((position) => (
            <circle
              key={`node-${position.dot}`}
              cx={position.x}
              cy={position.y}
              r="24"
              fill="#d8ff45"
              stroke="#0d0d0b"
              strokeWidth="8"
            />
          ))}
        </svg>
      </div>
      <div
        style={{
          position: "absolute",
          left: 62,
          top: 136,
          width: 360,
          fontSize: 60,
          fontWeight: 900,
          lineHeight: 0.91,
          letterSpacing: -2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div>ONE LINE.</div>
        <div>NINE DOTS.</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 62,
          top: 333,
          width: 250,
          height: 8,
          background: routeColor,
        }}
      />
    </div>,
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
  );
  return new Response(await image.arrayBuffer(), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
