import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface SlowBarProps {
  durationInFrames: number;
}

const FONT =
  "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', sans-serif";

const BARS = [
  { label: "リクエスト1", ms: "120ms", ratio: 0.12, slow: false },
  { label: "リクエスト2", ms: "95ms", ratio: 0.095, slow: false },
  { label: "リクエスト3", ms: "980ms", ratio: 0.98, slow: true },
  { label: "リクエスト4", ms: "110ms", ratio: 0.11, slow: false },
];

export const SlowBar: React.FC<SlowBarProps> = ({ durationInFrames }) => {
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
        borderRadius: 14,
        padding: "22px 30px",
        border: "2px solid rgba(255, 255, 255, 0.15)",
        width: 510,
      }}
    >
      {BARS.map((bar, i) => {
        const rowDelay = i * 6;
        const rowOpacity = interpolate(
          frame,
          [rowDelay + 4, rowDelay + 8],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        const barWidth = interpolate(
          frame,
          [rowDelay + 6, rowDelay + 16],
          [0, bar.ratio * 100],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: (t) => 1 - Math.pow(1 - t, 3),
          },
        );

        return (
          <div key={i} style={{ opacity: rowOpacity }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 3,
              }}
            >
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  fontFamily: FONT,
                  color: "white",
                }}
              >
                {bar.label}
              </span>
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  fontFamily: FONT,
                  color: bar.slow ? "#FF4444" : "#4ADE80",
                }}
              >
                {bar.ms}
                {bar.slow && " ⚠️"}
              </span>
            </div>
            <div
              style={{
                height: 17,
                backgroundColor: "rgba(255,255,255,0.15)",
                borderRadius: 7,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${barWidth}%`,
                  backgroundColor: bar.slow ? "#FF4444" : "#4ADE80",
                  borderRadius: 7,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
