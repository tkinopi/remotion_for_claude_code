import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface ClaudeConfigProps {
  durationInFrames: number;
}

const MONO = "'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace";
const FONT =
  "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', sans-serif";

export const ClaudeConfig: React.FC<ClaudeConfigProps> = ({
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

  const fileOpacity = interpolate(frame, [4, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const codeOpacity = interpolate(frame, [12, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badgeOpacity = interpolate(frame, [22, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badgeScale = interpolate(frame, [22, 30], [1.3, 1], {
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
        flexDirection: "column",
        gap: 15,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        borderRadius: 14,
        padding: "26px 30px",
        border: "2px solid rgba(255, 255, 255, 0.15)",
        width: 480,
      }}
    >
      {/* File name */}
      <div
        style={{
          opacity: fileOpacity,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 27 }}>📄</span>
        <span
          style={{
            fontSize: 24,
            fontWeight: 700,
            fontFamily: MONO,
            color: "#D4A574",
          }}
        >
          CLAUDE.md
        </span>
      </div>

      {/* Code block */}
      <div
        style={{
          opacity: codeOpacity,
          backgroundColor: "rgba(30, 30, 30, 0.9)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 8,
          padding: "16px 18px",
          fontFamily: MONO,
          fontSize: 19,
          color: "rgba(255,255,255,0.85)",
          lineHeight: 1.7,
        }}
      >
        <span style={{ color: "#608B4E" }}># プロジェクト設定</span><br />
        <span style={{ color: "#7DD3FC" }}>model</span>: claude-opus<br />
        <span style={{ color: "#7DD3FC" }}>lang</span>: ja<br />
        <span style={{ color: "#608B4E" }}># スキル定義</span><br />
        <span style={{ color: "#7DD3FC" }}>skills</span>:<br />
        {"  "}- code-review<br />
        {"  "}- refactor<br />
        {"  "}- test-gen
      </div>

      {/* Badge */}
      <div
        style={{
          opacity: badgeOpacity,
          transform: `scale(${badgeScale})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          backgroundColor: "rgba(74, 222, 128, 0.15)",
          border: "1px solid rgba(74, 222, 128, 0.4)",
          borderRadius: 10,
          padding: "10px 20px",
        }}
      >
        <span style={{ fontSize: 24 }}>🎁</span>
        <span
          style={{
            fontSize: 24,
            fontWeight: 700,
            fontFamily: FONT,
            color: "#4ADE80",
          }}
        >
          そのまま配布します
        </span>
      </div>
    </div>
  );
};
