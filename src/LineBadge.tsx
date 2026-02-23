import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface LineBadgeProps {
  durationInFrames: number;
}

const FONT =
  "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', sans-serif";

export const LineBadge: React.FC<LineBadgeProps> = ({ durationInFrames }) => {
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

  const iconScale = interpolate(frame, [6, 14], [0.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const textOpacity = interpolate(frame, [10, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arrowOpacity = interpolate(frame, [18, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subOpacity = interpolate(frame, [22, 28], [0, 1], {
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
        alignItems: "center",
        gap: 17,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        borderRadius: 14,
        padding: "34px 44px",
        border: "2px solid rgba(255, 255, 255, 0.15)",
      }}
    >
      {/* LINE icon */}
      <div
        style={{
          transform: `scale(${iconScale})`,
          backgroundColor: "#06C755",
          borderRadius: 20,
          width: 96,
          height: 96,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 4px 16px rgba(6, 199, 85, 0.4)",
        }}
      >
        <span
          style={{
            fontSize: 44,
            fontWeight: 900,
            color: "white",
            fontFamily: FONT,
          }}
        >
          LINE
        </span>
      </div>

      {/* Text */}
      <div
        style={{
          opacity: textOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 5,
        }}
      >
        <span
          style={{
            fontSize: 30,
            fontWeight: 800,
            fontFamily: FONT,
            color: "white",
          }}
        >
          概要欄からLINE登録
        </span>
      </div>

      {/* Arrow */}
      <div
        style={{
          opacity: arrowOpacity,
          fontSize: 30,
          fontWeight: 900,
          color: "#06C755",
        }}
      >
        ▼
      </div>

      {/* Sub text */}
      <div
        style={{
          opacity: subOpacity,
          backgroundColor: "rgba(6, 199, 85, 0.15)",
          border: "1px solid rgba(6, 199, 85, 0.4)",
          borderRadius: 10,
          padding: "14px 26px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontSize: 27,
            fontWeight: 700,
            fontFamily: FONT,
            color: "#06C755",
          }}
        >
          無料の壁打ち相談
        </span>
      </div>
    </div>
  );
};
