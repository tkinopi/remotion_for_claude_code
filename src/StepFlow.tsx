import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";

interface StepFlowProps {
  steps: string[];
  durationInFrames: number;
}

const FONT =
  "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', sans-serif";

export const StepFlow: React.FC<StepFlowProps> = ({
  steps,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const stepInterval = Math.floor((durationInFrames - 10) / steps.length);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        {steps.map((step, i) => {
          const stepStart = i * stepInterval;
          const opacity = interpolate(frame, [stepStart, stepStart + 6], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const translateY = interpolate(
            frame,
            [stepStart, stepStart + 8],
            [20, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: (t) => 1 - Math.pow(1 - t, 3),
            },
          );
          const scale = interpolate(
            frame,
            [stepStart, stepStart + 8],
            [0.85, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          );

          return (
            <React.Fragment key={i}>
              {i > 0 && (
                <span
                  style={{
                    fontSize: 36,
                    fontWeight: 900,
                    color: "white",
                    opacity,
                  }}
                >
                  →
                </span>
              )}
              <div
                style={{
                  opacity,
                  transform: `translateY(${translateY}px) scale(${scale})`,
                  backgroundColor: "#0a3dba",
                  borderRadius: 12,
                  padding: "14px 28px",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
                }}
              >
                <span
                  style={{
                    fontSize: 36,
                    fontWeight: 800,
                    fontFamily: FONT,
                    color: "white",
                    whiteSpace: "nowrap",
                  }}
                >
                  {step}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
