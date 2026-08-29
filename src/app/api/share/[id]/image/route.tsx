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

  return new ImageResponse(
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
        }}
      >
        {positions.slice(1).map((position, index) => {
          const previous = positions[index];
          const dx = position.x - previous.x;
          const dy = position.y - previous.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

          return (
            <div
              key={`line-${position.dot}`}
              style={{
                position: "absolute",
                left: previous.x,
                top: previous.y,
                width: length,
                height: 6,
                background: routeColor,
                transformOrigin: "0 50%",
                transform: `rotate(${angle}deg)`,
                borderRadius: 9,
              }}
            />
          );
        })}
        {positions.map((position) => (
          <div
            key={position.dot}
            style={{
              position: "absolute",
              left: position.x - 24,
              top: position.y - 24,
              width: 48,
              height: 48,
              borderRadius: 48,
              background: "#d8ff45",
              color: "#0d0d0b",
              border: "8px solid #0d0d0b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 17,
              fontWeight: 900,
            }}
          >
            {position.index + 1}
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 62,
          top: 136,
          width: 280,
          fontSize: 68,
          fontWeight: 900,
          lineHeight: 0.91,
          letterSpacing: -4,
        }}
      >
        ONE LINE.
        <br />
        NINE DOTS.
      </div>
      <div
        style={{
          position: "absolute",
          left: 62,
          top: 333,
          width: 260,
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
}
