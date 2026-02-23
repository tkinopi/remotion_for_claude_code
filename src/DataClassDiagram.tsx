import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface DataClassDiagramProps {
  durationInFrames: number;
}

const MONO = "'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace";
const FONT =
  "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', sans-serif";

export const DataClassDiagram: React.FC<DataClassDiagramProps> = ({
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
  const checkOpacity = interpolate(frame, [20, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const checkScale = interpolate(frame, [20, 28], [1.3, 1], {
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
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          fontFamily: FONT,
          color: "#FFD43B",
          marginBottom: 2,
        }}
      >
        Python DataClass
      </div>
      <div style={{ opacity: codeOpacity }}>
        <div
          style={{
            backgroundColor: "rgba(55, 118, 171, 0.15)",
            border: "1px solid rgba(55, 118, 171, 0.4)",
            borderRadius: 8,
            padding: "16px 18px",
            fontFamily: MONO,
            fontSize: 20,
            color: "rgba(255,255,255,0.9)",
            lineHeight: 1.6,
          }}
        >
          <span style={{ color: "#FF79C6" }}>@dataclass</span><br />
          <span style={{ color: "#8BE9FD" }}>class</span> <span style={{ color: "#50FA7B" }}>JobInput</span>:<br />
          {"  "}title: <span style={{ color: "#8BE9FD" }}>str</span><br />
          {"  "}location: <span style={{ color: "#8BE9FD" }}>str</span><br />
          {"  "}salary: <span style={{ color: "#8BE9FD" }}>int</span><br />
          {"  "}skills: <span style={{ color: "#8BE9FD" }}>list[str]</span>
        </div>
      </div>
      <div
        style={{
          opacity: checkOpacity,
          transform: `scale(${checkScale})`,
          display: "flex",
          alignItems: "center",
          gap: 10,
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: 30 }}>✅</span>
        <span
          style={{
            fontSize: 24,
            fontWeight: 700,
            fontFamily: FONT,
            color: "#4ADE80",
          }}
        >
          値を全部定義 → 型が固定される
        </span>
      </div>
    </div>
  );
};
