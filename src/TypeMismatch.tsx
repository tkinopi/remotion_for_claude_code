import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface TypeMismatchProps {
  durationInFrames: number;
}

const MONO = "'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace";
const FONT =
  "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', sans-serif";

export const TypeMismatch: React.FC<TypeMismatchProps> = ({
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

  const expectOpacity = interpolate(frame, [4, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const actualOpacity = interpolate(frame, [16, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ngOpacity = interpolate(frame, [26, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ngScale = interpolate(frame, [26, 32], [1.4, 1], {
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
        width: 510,
      }}
    >
      <div style={{ opacity: expectOpacity }}>
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            fontFamily: FONT,
            color: "#4ADE80",
            marginBottom: 5,
          }}
        >
          期待: 配列
        </div>
        <div
          style={{
            backgroundColor: "rgba(74, 222, 128, 0.1)",
            border: "1px solid rgba(74, 222, 128, 0.3)",
            borderRadius: 8,
            padding: "10px 18px",
            fontFamily: MONO,
            fontSize: 21,
            color: "rgba(255,255,255,0.9)",
            lineHeight: 1.4,
          }}
        >
          <span style={{ color: "#7DD3FC" }}>"skills"</span>: [<span style={{ color: "#FDE68A" }}>"Go"</span>, <span style={{ color: "#FDE68A" }}>"Python"</span>]
        </div>
      </div>

      <div style={{ opacity: actualOpacity, position: "relative" }}>
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            fontFamily: FONT,
            color: "#FF6B6B",
            marginBottom: 5,
          }}
        >
          実際: 文字列
        </div>
        <div
          style={{
            backgroundColor: "rgba(255, 68, 68, 0.1)",
            border: "1px solid rgba(255, 68, 68, 0.3)",
            borderRadius: 8,
            padding: "10px 18px",
            fontFamily: MONO,
            fontSize: 21,
            color: "rgba(255,255,255,0.9)",
            lineHeight: 1.4,
          }}
        >
          <span style={{ color: "#7DD3FC" }}>"skills"</span>: <span style={{ color: "#FF6B6B" }}>"Go, Python"</span>
        </div>
        <div
          style={{
            position: "absolute",
            top: -5,
            right: 10,
            opacity: ngOpacity,
            transform: `scale(${ngScale}) rotate(-12deg)`,
            fontSize: 34,
            fontWeight: 900,
            fontFamily: FONT,
            color: "#FF4444",
            border: "3px solid #FF4444",
            borderRadius: 8,
            padding: "4px 14px",
            backgroundColor: "rgba(255, 68, 68, 0.15)",
          }}
        >
          型違い
        </div>
      </div>
    </div>
  );
};
