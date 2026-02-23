import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface SkillSheetProps {
  durationInFrames: number;
}

const FONT =
  "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', sans-serif";
const MONO = "'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace";

const ROWS = [
  { label: "言語", value: "Python / Go" },
  { label: "AI/ML", value: "LangChain / OpenAI API" },
  { label: "インフラ", value: "AWS / Docker" },
  { label: "DB", value: "PostgreSQL / Redis" },
  { label: "ツール", value: "Claude Code / Git" },
];

export const SkillSheet: React.FC<SkillSheetProps> = ({ durationInFrames }) => {
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
        gap: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        borderRadius: 14,
        padding: "0",
        border: "2px solid rgba(255, 255, 255, 0.15)",
        width: 480,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#0a3dba",
          padding: "16px 26px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontSize: 27,
            fontWeight: 800,
            fontFamily: FONT,
            color: "white",
          }}
        >
          スキルシート
        </span>
      </div>

      {/* Rows */}
      {ROWS.map((row, i) => {
        const rowDelay = i * 6;
        const rowOpacity = interpolate(
          frame,
          [rowDelay + 6, rowDelay + 12],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );

        return (
          <div
            key={i}
            style={{
              opacity: rowOpacity,
              display: "flex",
              borderBottom:
                i < ROWS.length - 1
                  ? "1px solid rgba(255,255,255,0.1)"
                  : undefined,
            }}
          >
            <div
              style={{
                width: 120,
                padding: "14px 18px",
                backgroundColor: "rgba(10, 61, 186, 0.25)",
                borderRight: "1px solid rgba(255,255,255,0.1)",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  fontFamily: FONT,
                  color: "#7DD3FC",
                }}
              >
                {row.label}
              </span>
            </div>
            <div
              style={{
                flex: 1,
                padding: "14px 18px",
              }}
            >
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  fontFamily: MONO,
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                {row.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
