import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface OwnershipDiagramProps {
  durationInFrames: number;
}

const FONT =
  "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', sans-serif";

const siloItems = [
  { name: "田中の領域", sub: "触るな!" },
  { name: "佐藤の領域", sub: "触るな!" },
  { name: "鈴木の領域", sub: "触るな!" },
];

export const OwnershipDiagram: React.FC<OwnershipDiagramProps> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  const containerOpacity = interpolate(frame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const containerSlide = interpolate(frame, [0, 8], [-40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Before blocks
  const beforeOpacity = interpolate(frame, [4, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Arrow
  const arrowOpacity = interpolate(frame, [22, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // After block
  const afterOpacity = interpolate(frame, [32, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const afterScale = interpolate(frame, [32, 40], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: "50%",
        transform: `translateY(-50%) translateX(${containerSlide}px)`,
        opacity: containerOpacity * fadeOut,
        display: "flex",
        alignItems: "center",
        gap: 24,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        borderRadius: 14,
        padding: "26px 30px",
        border: "2px solid rgba(255, 255, 255, 0.15)",
      }}
    >
      {/* Before: silos */}
      <div
        style={{
          opacity: beforeOpacity,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {siloItems.map((item, i) => {
          const itemOpacity = interpolate(
            frame,
            [6 + i * 5, 10 + i * 5],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          return (
            <div
              key={i}
              style={{
                opacity: itemOpacity,
                backgroundColor: "rgba(255, 68, 68, 0.2)",
                border: "2px solid rgba(255, 68, 68, 0.5)",
                borderRadius: 10,
                padding: "10px 20px",
                textAlign: "center",
                width: 220,
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  fontFamily: FONT,
                  color: "#FF6B6B",
                }}
              >
                {item.name}
              </div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  fontFamily: FONT,
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {item.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Arrow */}
      <div
        style={{
          opacity: arrowOpacity,
          fontSize: 40,
          fontWeight: 900,
          color: "#FFD700",
        }}
      >
        →
      </div>

      {/* After: team ownership */}
      <div
        style={{
          opacity: afterOpacity,
          transform: `scale(${afterScale})`,
          backgroundColor: "rgba(74, 222, 128, 0.15)",
          border: "2px solid rgba(74, 222, 128, 0.5)",
          borderRadius: 12,
          padding: "20px 24px",
          textAlign: "center",
          width: 260,
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 900,
            fontFamily: FONT,
            color: "#4ADE80",
            marginBottom: 12,
          }}
        >
          チーム所有
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {["全員が触れる", "レビュー = 改善", "テスト + ドキュメント"].map(
            (text, i) => {
              const lineOpacity = interpolate(
                frame,
                [38 + i * 4, 42 + i * 4],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              );
              return (
                <div
                  key={i}
                  style={{
                    opacity: lineOpacity,
                    fontSize: 19,
                    fontWeight: 700,
                    fontFamily: FONT,
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  {text}
                </div>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
};
