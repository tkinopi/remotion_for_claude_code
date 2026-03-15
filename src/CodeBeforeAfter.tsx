import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface CodeBeforeAfterProps {
  beforeLabel: string;
  afterLabel: string;
  beforeLines: string[];
  afterLines: string[];
  durationInFrames: number;
}

const MONO = "'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace";
const FONT =
  "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', sans-serif";

export const CodeBeforeAfter: React.FC<CodeBeforeAfterProps> = ({
  beforeLabel,
  afterLabel,
  beforeLines,
  afterLines,
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

  // Before block
  const beforeOpacity = interpolate(frame, [4, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // After block
  const afterOpacity = interpolate(frame, [20, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const maxLines = Math.max(beforeLines.length, afterLines.length);
  const lineDelay = 3;

  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: "50%",
        transform: `translateY(-50%) translateX(${containerSlide}px)`,
        opacity: containerOpacity * fadeOut,
        display: "flex",
        gap: 20,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        borderRadius: 14,
        padding: "26px 30px",
        border: "2px solid rgba(255, 255, 255, 0.15)",
      }}
    >
      {/* Before (NG) */}
      <div style={{ opacity: beforeOpacity, flex: 1, minWidth: 340 }}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            fontFamily: FONT,
            color: "#FF6B6B",
            marginBottom: 10,
          }}
        >
          {beforeLabel}
        </div>
        <div
          style={{
            backgroundColor: "rgba(255, 68, 68, 0.1)",
            border: "2px solid rgba(255, 68, 68, 0.4)",
            borderRadius: 8,
            padding: "14px 18px",
            fontFamily: MONO,
            fontSize: 20,
            color: "rgba(255,255,255,0.9)",
            lineHeight: 1.6,
            minHeight: maxLines * 32 + 28,
          }}
        >
          {beforeLines.map((line, i) => {
            const lineOpacity = interpolate(
              frame,
              [6 + i * lineDelay, 10 + i * lineDelay],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            return (
              <div key={i} style={{ opacity: lineOpacity, whiteSpace: "pre" }}>
                {line}
              </div>
            );
          })}
        </div>
      </div>

      {/* After (OK) */}
      <div style={{ opacity: afterOpacity, flex: 1, minWidth: 340 }}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            fontFamily: FONT,
            color: "#4ADE80",
            marginBottom: 10,
          }}
        >
          {afterLabel}
        </div>
        <div
          style={{
            backgroundColor: "rgba(74, 222, 128, 0.1)",
            border: "2px solid rgba(74, 222, 128, 0.4)",
            borderRadius: 8,
            padding: "14px 18px",
            fontFamily: MONO,
            fontSize: 20,
            color: "rgba(255,255,255,0.9)",
            lineHeight: 1.6,
            minHeight: maxLines * 32 + 28,
          }}
        >
          {afterLines.map((line, i) => {
            const lineOpacity = interpolate(
              frame,
              [22 + i * lineDelay, 26 + i * lineDelay],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            return (
              <div key={i} style={{ opacity: lineOpacity, whiteSpace: "pre" }}>
                {line}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
