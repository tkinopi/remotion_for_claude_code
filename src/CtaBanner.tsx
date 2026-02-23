import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";

interface CtaBannerProps {
  durationInFrames: number;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  // Main banner: fade in + slide up (frames 0-20)
  const mainOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const mainTranslateY = interpolate(frame, [0, 20], [40, 0], {
    extrapolateRight: "clamp",
  });

  // Sub banner: fade in + slide up with 15-frame delay (frames 15-35)
  const subOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateRight: "clamp",
  });
  const subTranslateY = interpolate(frame, [15, 35], [30, 0], {
    extrapolateRight: "clamp",
  });

  // Fade out at the end (last 15 frames)
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 120,
        opacity: fadeOut,
      }}
    >
      {/* Main CTA */}
      <div
        style={{
          opacity: mainOpacity,
          transform: `translateY(${mainTranslateY}px)`,
          backgroundColor: "#CC0000",
          color: "white",
          fontSize: 42,
          fontWeight: 900,
          fontFamily:
            "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif",
          padding: "18px 48px",
          borderRadius: 14,
          textAlign: "center",
          letterSpacing: 2,
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.4)",
        }}
      >
        {"チャンネル登録お願いします！"}
      </div>

      {/* Sub CTA */}
      <div
        style={{
          opacity: subOpacity,
          transform: `translateY(${subTranslateY}px)`,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          fontSize: 32,
          fontWeight: 700,
          fontFamily:
            "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif",
          padding: "12px 36px",
          borderRadius: 10,
          textAlign: "center",
          letterSpacing: 1,
          marginTop: 18,
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.3)",
        }}
      >
        {"高評価・コメントもよろしく！"}
      </div>
    </AbsoluteFill>
  );
};
