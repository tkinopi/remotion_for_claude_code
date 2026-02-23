import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface ComparisonRow {
  label: string;
  result: string;
  status: "ok" | "ng";
}

interface ComparisonChartProps {
  rows: ComparisonRow[];
  durationInFrames: number;
}

const FONT =
  "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', sans-serif";

export const ComparisonChart: React.FC<ComparisonChartProps> = ({
  rows,
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

  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: "50%",
        transform: `translateY(-50%) translateX(${containerSlide}px)`,
        opacity: containerOpacity * fadeOut,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        borderRadius: 16,
        padding: "24px 32px",
        border: "2px solid rgba(255, 255, 255, 0.15)",
      }}
    >
      {rows.map((row, i) => {
        const rowDelay = i * 10;
        const rowOpacity = interpolate(
          frame,
          [rowDelay + 4, rowDelay + 10],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        const rowSlide = interpolate(
          frame,
          [rowDelay + 4, rowDelay + 12],
          [-20, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: (t) => 1 - Math.pow(1 - t, 3),
          },
        );

        return (
          <div
            key={i}
            style={{
              opacity: rowOpacity,
              transform: `translateX(${rowSlide}px)`,
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            <span
              style={{
                fontSize: 32,
                fontWeight: 700,
                fontFamily: FONT,
                color: "white",
                minWidth: 120,
              }}
            >
              {row.label}
            </span>
            <span
              style={{
                fontSize: 30,
                fontWeight: 700,
                fontFamily: FONT,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              →
            </span>
            <span
              style={{
                fontSize: 32,
                fontWeight: 800,
                fontFamily: FONT,
                color: row.status === "ok" ? "#4ADE80" : "#FF4444",
                minWidth: 100,
              }}
            >
              {row.result}
            </span>
            <span style={{ fontSize: 30 }}>
              {row.status === "ok" ? "✅" : "❌"}
            </span>
          </div>
        );
      })}
    </div>
  );
};
