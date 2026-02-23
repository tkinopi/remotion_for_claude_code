import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill, Img, staticFile } from "remotion";

interface FullscreenImageProps {
  src: string;
  durationInFrames: number;
  zoom?: "in" | "out";
}

export const FullscreenImage: React.FC<FullscreenImageProps> = ({
  src,
  durationInFrames,
  zoom = "in",
}) => {
  const frame = useCurrentFrame();

  const [scaleFrom, scaleTo] = zoom === "in" ? [1, 1.15] : [1.15, 1];
  const scale = interpolate(frame, [0, durationInFrames], [scaleFrom, scaleTo], {
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(
    frame,
    [0, 6, durationInFrames - 6, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ opacity }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
};
