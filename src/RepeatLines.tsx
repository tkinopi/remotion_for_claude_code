import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface RepeatLinesProps {
  durationInFrames: number;
}

const FONT =
  "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', sans-serif";

const LINES = [
  "この求人は、あなたの経験を活かせる…",
  "この求人は、あなたの経験を活かせる…",
  "この求人は、あなたの経験を活かせる…",
  "この求人は、あなたの経験を活かせる…",
];

export const RepeatLines: React.FC<RepeatLinesProps> = ({
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
        gap: 8,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        borderRadius: 14,
        padding: "22px 30px",
        border: "2px solid rgba(255, 255, 255, 0.15)",
      }}
    >
      {LINES.map((line, i) => {
        const rowDelay = i * 6;
        const rowOpacity = interpolate(
          frame,
          [rowDelay + 4, rowDelay + 8],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );

        return (
          <div
            key={i}
            style={{
              opacity: rowOpacity,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                fontSize: 27,
                fontWeight: 700,
                fontFamily: FONT,
                color: i === 0 ? "rgba(255,255,255,0.9)" : "#FF6B6B",
              }}
            >
              {line}
            </span>
            {i > 0 && (
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  fontFamily: FONT,
                  color: "#FF4444",
                }}
              >
                ← 同じ
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
