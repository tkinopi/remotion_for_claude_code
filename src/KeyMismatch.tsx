import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface KeyMismatchProps {
  durationInFrames: number;
}

const MONO = "'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace";
const FONT =
  "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', sans-serif";

export const KeyMismatch: React.FC<KeyMismatchProps> = ({
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

  const day1Opacity = interpolate(frame, [4, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const day2Opacity = interpolate(frame, [18, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const questionOpacity = interpolate(frame, [28, 32], [0, 1], {
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
        width: 460,
      }}
    >
      <div style={{ opacity: day1Opacity }}>
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            fontFamily: FONT,
            color: "#4ADE80",
            marginBottom: 5,
          }}
        >
          ある日
        </div>
        <div
          style={{
            backgroundColor: "rgba(74, 222, 128, 0.1)",
            border: "1px solid rgba(74, 222, 128, 0.3)",
            borderRadius: 8,
            padding: "10px 18px",
            fontFamily: MONO,
            fontSize: 22,
            color: "rgba(255,255,255,0.9)",
          }}
        >
          {"{ "}<span style={{ color: "#4ADE80" }}>"title"</span>: <span style={{ color: "#FDE68A" }}>"エンジニア募集"</span>{" }"}
        </div>
      </div>

      <div
        style={{
          opacity: questionOpacity,
          textAlign: "center",
          fontSize: 34,
          fontWeight: 900,
          color: "#FFD700",
        }}
      >
        ≠
      </div>

      <div style={{ opacity: day2Opacity }}>
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            fontFamily: FONT,
            color: "#FF6B6B",
            marginBottom: 5,
          }}
        >
          別の日
        </div>
        <div
          style={{
            backgroundColor: "rgba(255, 68, 68, 0.1)",
            border: "1px solid rgba(255, 68, 68, 0.3)",
            borderRadius: 8,
            padding: "10px 18px",
            fontFamily: MONO,
            fontSize: 22,
            color: "rgba(255,255,255,0.9)",
          }}
        >
          {"{ "}<span style={{ color: "#FF6B6B" }}>"headline"</span>: <span style={{ color: "#FDE68A" }}>"エンジニア募集"</span>{" }"}
        </div>
      </div>
    </div>
  );
};
