import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface EmptyStringProps {
  durationInFrames: number;
}

const MONO = "'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace";
const FONT =
  "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', sans-serif";

export const EmptyString: React.FC<EmptyStringProps> = ({
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

  const codeOpacity = interpolate(frame, [4, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ngOpacity = interpolate(frame, [14, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ngScale = interpolate(frame, [14, 20], [1.4, 1], {
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
      <div style={{ opacity: codeOpacity }}>
        <div
          style={{
            backgroundColor: "rgba(255, 68, 68, 0.1)",
            border: "1px solid rgba(255, 68, 68, 0.3)",
            borderRadius: 8,
            padding: "14px 18px",
            fontFamily: MONO,
            fontSize: 22,
            color: "rgba(255,255,255,0.9)",
            lineHeight: 1.6,
          }}
        >
          {"{"}<br />
          {"  "}<span style={{ color: "#7DD3FC" }}>"title"</span>: <span style={{ color: "#FDE68A" }}>"エンジニア募集"</span>,<br />
          {"  "}<span style={{ color: "#7DD3FC" }}>"body"</span>: <span style={{ color: "#FF6B6B", fontWeight: 800 }}>""</span>  <span style={{ color: "#FF6B6B", fontSize: 17 }}>← 空文字!</span><br />
          {"}"}
        </div>
      </div>
      <div
        style={{
          opacity: ngOpacity,
          transform: `scale(${ngScale}) rotate(-12deg)`,
          position: "absolute",
          top: 10,
          right: 15,
          fontSize: 40,
          fontWeight: 900,
          fontFamily: FONT,
          color: "#FF4444",
          border: "3px solid #FF4444",
          borderRadius: 8,
          padding: "4px 16px",
          backgroundColor: "rgba(255, 68, 68, 0.15)",
        }}
      >
        空!
      </div>
    </div>
  );
};
