import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface WinPatternFlowProps {
  durationInFrames: number;
}

const FONT =
  "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', sans-serif";

export const WinPatternFlow: React.FC<WinPatternFlowProps> = ({
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

  // Step 1: Python
  const step1Opacity = interpolate(frame, [4, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const step1Scale = interpolate(frame, [4, 12], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Arrow
  const arrow1Opacity = interpolate(frame, [14, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Step 2: 詰まった場所
  const step2Opacity = interpolate(frame, [22, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const step2Scale = interpolate(frame, [22, 30], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Arrow 2
  const arrow2Opacity = interpolate(frame, [32, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Step 3: Go/Rust/型
  const step3Opacity = interpolate(frame, [40, 46], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const step3Scale = interpolate(frame, [40, 48], [0.85, 1], {
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
        gap: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        borderRadius: 14,
        padding: "30px 34px",
        border: "2px solid rgba(255, 255, 255, 0.15)",
        width: 480,
      }}
    >
      {/* Step 1 */}
      <div
        style={{
          opacity: step1Opacity,
          transform: `scale(${step1Scale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          width: "100%",
        }}
      >
        <div
          style={{
            backgroundColor: "#3776AB",
            borderRadius: 12,
            padding: "12px 30px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            width: "100%",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: 30,
              fontWeight: 800,
              fontFamily: FONT,
              color: "#FFD43B",
            }}
          >
            Python
          </span>
        </div>
        <span
          style={{
            fontSize: 22,
            fontWeight: 700,
            fontFamily: FONT,
            color: "rgba(255,255,255,0.8)",
          }}
        >
          勝ちパターンの流れを作る
        </span>
      </div>

      {/* Arrow 1 */}
      <div
        style={{
          opacity: arrow1Opacity,
          padding: "4px 0",
          fontSize: 27,
          fontWeight: 900,
          color: "#FFD700",
        }}
      >
        ▼
      </div>

      {/* Step 2 */}
      <div
        style={{
          opacity: step2Opacity,
          transform: `scale(${step2Scale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          width: "100%",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(255, 68, 68, 0.3)",
            border: "2px solid rgba(255, 68, 68, 0.5)",
            borderRadius: 12,
            padding: "12px 30px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: 27,
              fontWeight: 800,
              fontFamily: FONT,
              color: "#FF6B6B",
            }}
          >
            詰まった場所を特定
          </span>
        </div>
      </div>

      {/* Arrow 2 */}
      <div
        style={{
          opacity: arrow2Opacity,
          padding: "4px 0",
          fontSize: 27,
          fontWeight: 900,
          color: "#FFD700",
        }}
      >
        ▼
      </div>

      {/* Step 3 */}
      <div
        style={{
          opacity: step3Opacity,
          transform: `scale(${step3Scale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            width: "100%",
          }}
        >
          <div
            style={{
              flex: 1,
              backgroundColor: "#00ADD8",
              borderRadius: 10,
              padding: "10px 0",
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            <span
              style={{
                fontSize: 24,
                fontWeight: 800,
                fontFamily: FONT,
                color: "white",
              }}
            >
              Go
            </span>
          </div>
          <div
            style={{
              flex: 1,
              backgroundColor: "#B7410E",
              borderRadius: 10,
              padding: "10px 0",
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            <span
              style={{
                fontSize: 24,
                fontWeight: 800,
                fontFamily: FONT,
                color: "white",
              }}
            >
              Rust
            </span>
          </div>
          <div
            style={{
              flex: 1,
              backgroundColor: "rgba(74, 222, 128, 0.3)",
              border: "1px solid rgba(74, 222, 128, 0.5)",
              borderRadius: 10,
              padding: "10px 0",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: 24,
                fontWeight: 800,
                fontFamily: FONT,
                color: "#4ADE80",
              }}
            >
              型
            </span>
          </div>
        </div>
        <span
          style={{
            fontSize: 22,
            fontWeight: 700,
            fontFamily: FONT,
            color: "rgba(255,255,255,0.8)",
          }}
        >
          詰まった場所だけ補強する
        </span>
      </div>
    </div>
  );
};
