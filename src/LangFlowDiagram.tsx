import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface LangFlowDiagramProps {
  durationInFrames: number;
}

const FONT =
  "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', sans-serif";

export const LangFlowDiagram: React.FC<LangFlowDiagramProps> = ({
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

  // Python box
  const pyOpacity = interpolate(frame, [4, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pyScale = interpolate(frame, [4, 12], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Arrow
  const arrowOpacity = interpolate(frame, [18, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arrowSlide = interpolate(frame, [18, 26], [-15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  // Go box
  const goOpacity = interpolate(frame, [30, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const goScale = interpolate(frame, [30, 38], [0.85, 1], {
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
        gap: 15,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        borderRadius: 14,
        padding: "30px 40px",
        border: "2px solid rgba(255, 255, 255, 0.15)",
      }}
    >
      {/* Python */}
      <div
        style={{
          opacity: pyOpacity,
          transform: `scale(${pyScale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            backgroundColor: "#3776AB",
            borderRadius: 12,
            padding: "16px 40px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          <span
            style={{
              fontSize: 34,
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
            fontSize: 24,
            fontWeight: 700,
            fontFamily: FONT,
            color: "rgba(255,255,255,0.8)",
          }}
        >
          当たりの流れを作る
        </span>
      </div>

      {/* Arrow */}
      <div
        style={{
          opacity: arrowOpacity,
          transform: `translateY(${arrowSlide}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 40,
            fontWeight: 900,
            color: "#FFD700",
          }}
        >
          ▼
        </span>
      </div>

      {/* Go */}
      <div
        style={{
          opacity: goOpacity,
          transform: `scale(${goScale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            backgroundColor: "#00ADD8",
            borderRadius: 12,
            padding: "16px 40px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          <span
            style={{
              fontSize: 34,
              fontWeight: 800,
              fontFamily: FONT,
              color: "white",
            }}
          >
            Go
          </span>
        </div>
        <span
          style={{
            fontSize: 24,
            fontWeight: 700,
            fontFamily: FONT,
            color: "rgba(255,255,255,0.8)",
          }}
        >
          本番運用に寄せる
        </span>
      </div>
    </div>
  );
};
