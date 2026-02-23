import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const MyComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const opacity = interpolate(frame, [0, fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  const scale = interpolate(
    frame,
    [0, fps * 0.5, durationInFrames],
    [0.8, 1, 1.2],
    {
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0b1215",
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 80,
            fontWeight: "bold",
            color: "#ffffff",
            fontFamily: "sans-serif",
          }}
        >
          Hello, Remotion!
        </h1>
        <p
          style={{
            fontSize: 30,
            color: "#8899aa",
            fontFamily: "sans-serif",
          }}
        >
          Built with Claude Code
        </p>
      </div>
    </AbsoluteFill>
  );
};
