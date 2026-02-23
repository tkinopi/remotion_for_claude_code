import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface SchemaFlowProps {
  durationInFrames: number;
}

const FONT =
  "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', sans-serif";

const STEPS = [
  { text: "入力の型を定義", icon: "📥", delay: 0 },
  { text: "出力スキーマを定義", icon: "📤", delay: 16 },
  { text: "型に合わせてパース", icon: "⚙️", delay: 40 },
  { text: "足りなければ弾く", icon: "🚫", delay: 70 },
  { text: "ズレたらログに出す", icon: "📋", delay: 95 },
];

export const SchemaFlow: React.FC<SchemaFlowProps> = ({ durationInFrames }) => {
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
        gap: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        borderRadius: 14,
        padding: "26px 30px",
        border: "2px solid rgba(255, 255, 255, 0.15)",
        width: 460,
      }}
    >
      {STEPS.map((step, i) => {
        const opacity = interpolate(
          frame,
          [step.delay + 4, step.delay + 10],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        const slideX = interpolate(
          frame,
          [step.delay + 4, step.delay + 12],
          [-20, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: (t) => 1 - Math.pow(1 - t, 3),
          },
        );

        return (
          <React.Fragment key={i}>
            {i > 0 && (
              <div
                style={{
                  opacity,
                  display: "flex",
                  justifyContent: "center",
                  padding: "2px 0",
                }}
              >
                <span
                  style={{
                    fontSize: 24,
                    fontWeight: 900,
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  ▼
                </span>
              </div>
            )}
            <div
              style={{
                opacity,
                transform: `translateX(${slideX}px)`,
                display: "flex",
                alignItems: "center",
                gap: 15,
                backgroundColor:
                  i <= 1
                    ? "rgba(10, 61, 186, 0.5)"
                    : i === 2
                      ? "rgba(74, 222, 128, 0.15)"
                      : "rgba(255, 68, 68, 0.15)",
                borderRadius: 10,
                padding: "10px 20px",
                border: `1px solid ${
                  i <= 1
                    ? "rgba(10, 61, 186, 0.6)"
                    : i === 2
                      ? "rgba(74, 222, 128, 0.3)"
                      : "rgba(255, 68, 68, 0.3)"
                }`,
              }}
            >
              <span style={{ fontSize: 27, flexShrink: 0 }}>{step.icon}</span>
              <span
                style={{
                  fontSize: 27,
                  fontWeight: 700,
                  fontFamily: FONT,
                  color: "white",
                  whiteSpace: "nowrap",
                }}
              >
                {step.text}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
