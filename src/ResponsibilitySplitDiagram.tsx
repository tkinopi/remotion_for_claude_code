import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface ResponsibilitySplitDiagramProps {
  durationInFrames: number;
}

const FONT =
  "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', sans-serif";

export const ResponsibilitySplitDiagram: React.FC<
  ResponsibilitySplitDiagramProps
> = ({ durationInFrames }) => {
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

  // Before block
  const beforeOpacity = interpolate(frame, [4, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const beforeScale = interpolate(frame, [4, 12], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Arrow
  const arrowOpacity = interpolate(frame, [18, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // After blocks (staggered)
  const after1Opacity = interpolate(frame, [28, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const after2Opacity = interpolate(frame, [34, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const after3Opacity = interpolate(frame, [40, 46], [0, 1], {
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
        alignItems: "center",
        gap: 24,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        borderRadius: 14,
        padding: "26px 30px",
        border: "2px solid rgba(255, 255, 255, 0.15)",
      }}
    >
      {/* Before: monolith */}
      <div
        style={{
          opacity: beforeOpacity,
          transform: `scale(${beforeScale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(255, 68, 68, 0.2)",
            border: "2px solid rgba(255, 68, 68, 0.5)",
            borderRadius: 12,
            padding: "24px 22px",
            width: 260,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              fontFamily: FONT,
              color: "#FF6B6B",
              marginBottom: 8,
            }}
          >
            app.py
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              fontFamily: FONT,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            3000行
          </div>
          <div
            style={{
              fontSize: 17,
              fontWeight: 600,
              fontFamily: FONT,
              color: "rgba(255,255,255,0.5)",
              marginTop: 6,
            }}
          >
            UI + ロジック + データ
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div
        style={{
          opacity: arrowOpacity,
          fontSize: 40,
          fontWeight: 900,
          color: "#FFD700",
        }}
      >
        →
      </div>

      {/* After: split into 3 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {/* view.py */}
        <div
          style={{
            opacity: after1Opacity,
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            border: "2px solid rgba(59, 130, 246, 0.5)",
            borderRadius: 10,
            padding: "12px 24px",
            textAlign: "center",
            width: 260,
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              fontFamily: FONT,
              color: "#60A5FA",
            }}
          >
            view.py
          </span>
          <span
            style={{
              fontSize: 18,
              fontWeight: 600,
              fontFamily: FONT,
              color: "rgba(255,255,255,0.6)",
              marginLeft: 10,
            }}
          >
            UI
          </span>
        </div>

        {/* service.py */}
        <div
          style={{
            opacity: after2Opacity,
            backgroundColor: "rgba(74, 222, 128, 0.2)",
            border: "2px solid rgba(74, 222, 128, 0.5)",
            borderRadius: 10,
            padding: "12px 24px",
            textAlign: "center",
            width: 260,
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              fontFamily: FONT,
              color: "#4ADE80",
            }}
          >
            service.py
          </span>
          <span
            style={{
              fontSize: 18,
              fontWeight: 600,
              fontFamily: FONT,
              color: "rgba(255,255,255,0.6)",
              marginLeft: 10,
            }}
          >
            ロジック
          </span>
        </div>

        {/* repository.py */}
        <div
          style={{
            opacity: after3Opacity,
            backgroundColor: "rgba(251, 191, 36, 0.2)",
            border: "2px solid rgba(251, 191, 36, 0.5)",
            borderRadius: 10,
            padding: "12px 24px",
            textAlign: "center",
            width: 260,
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              fontFamily: FONT,
              color: "#FBBF24",
            }}
          >
            repository.py
          </span>
          <span
            style={{
              fontSize: 18,
              fontWeight: 600,
              fontFamily: FONT,
              color: "rgba(255,255,255,0.6)",
              marginLeft: 10,
            }}
          >
            データ
          </span>
        </div>
      </div>
    </div>
  );
};
