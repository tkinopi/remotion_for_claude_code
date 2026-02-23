import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface JsonMismatchProps {
  durationInFrames: number;
}

const MONO =
  "'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace";
const FONT =
  "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', sans-serif";

export const JsonMismatch: React.FC<JsonMismatchProps> = ({
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

  // Expected block
  const expectOpacity = interpolate(frame, [4, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Actual block
  const actualOpacity = interpolate(frame, [20, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // NG mark
  const ngOpacity = interpolate(frame, [30, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ngScale = interpolate(frame, [30, 36], [1.4, 1], {
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
        gap: 17,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        borderRadius: 14,
        padding: "26px 30px",
        border: "2px solid rgba(255, 255, 255, 0.15)",
        width: 480,
      }}
    >
      {/* Expected */}
      <div style={{ opacity: expectOpacity }}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            fontFamily: FONT,
            color: "#4ADE80",
            marginBottom: 8,
          }}
        >
          期待するJSON
        </div>
        <div
          style={{
            backgroundColor: "rgba(74, 222, 128, 0.1)",
            border: "1px solid rgba(74, 222, 128, 0.3)",
            borderRadius: 8,
            padding: "14px 18px",
            fontFamily: MONO,
            fontSize: 20,
            color: "rgba(255,255,255,0.9)",
            lineHeight: 1.5,
          }}
        >
          {"{"}<br />
          {"  "}<span style={{ color: "#7DD3FC" }}>"title"</span>: <span style={{ color: "#FDE68A" }}>"..."</span>,<br />
          {"  "}<span style={{ color: "#7DD3FC" }}>"body"</span>: <span style={{ color: "#FDE68A" }}>"..."</span>,<br />
          {"  "}<span style={{ color: "#7DD3FC" }}>"appeal"</span>: <span style={{ color: "#FDE68A" }}>"..."</span><br />
          {"}"}
        </div>
      </div>

      {/* Actual */}
      <div style={{ opacity: actualOpacity, position: "relative" }}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            fontFamily: FONT,
            color: "#FF6B6B",
            marginBottom: 8,
          }}
        >
          実際に返ってきたJSON
        </div>
        <div
          style={{
            backgroundColor: "rgba(255, 68, 68, 0.1)",
            border: "1px solid rgba(255, 68, 68, 0.3)",
            borderRadius: 8,
            padding: "14px 18px",
            fontFamily: MONO,
            fontSize: 20,
            color: "rgba(255,255,255,0.9)",
            lineHeight: 1.5,
          }}
        >
          {"{"}<br />
          {"  "}<span style={{ color: "#7DD3FC" }}>"title"</span>: <span style={{ color: "#FDE68A" }}>"..."</span>,<br />
          {"  "}<span style={{ color: "#FF6B6B" }}>"content"</span>: <span style={{ color: "#FDE68A" }}>"..."</span>,<br />
          {"  "}<span style={{ color: "#FF6B6B", textDecoration: "line-through" }}>"appeal"</span>: <span style={{ color: "#FDE68A", textDecoration: "line-through" }}> 欠落</span><br />
          {"}"}
        </div>
        {/* NG stamp */}
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 10,
            opacity: ngOpacity,
            transform: `scale(${ngScale}) rotate(-12deg)`,
            fontSize: 44,
            fontWeight: 900,
            fontFamily: FONT,
            color: "#FF4444",
            border: "3px solid #FF4444",
            borderRadius: 8,
            padding: "4px 16px",
            backgroundColor: "rgba(255, 68, 68, 0.15)",
          }}
        >
          ズレ
        </div>
      </div>
    </div>
  );
};
