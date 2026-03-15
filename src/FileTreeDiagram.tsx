import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface FileTreeDiagramProps {
  durationInFrames: number;
}

const MONO = "'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace";
const FONT =
  "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', sans-serif";

const beforeFiles = [
  "komon_yamada.c",
  "komon_tanaka.c",
  "komon_sato.c",
  "komon_suzuki.c",
];

const afterFiles = ["common.c", "handler_by_type.c", "handler_by_role.c"];

export const FileTreeDiagram: React.FC<FileTreeDiagramProps> = ({
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

  const beforeOpacity = interpolate(frame, [4, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const arrowOpacity = interpolate(frame, [25, 31], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const afterOpacity = interpolate(frame, [35, 41], [0, 1], {
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
      {/* Before */}
      <div style={{ opacity: beforeOpacity, minWidth: 300 }}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            fontFamily: FONT,
            color: "#FF6B6B",
            marginBottom: 10,
          }}
        >
          NG: 人名でファイル増殖
        </div>
        <div
          style={{
            backgroundColor: "rgba(255, 68, 68, 0.1)",
            border: "2px solid rgba(255, 68, 68, 0.4)",
            borderRadius: 8,
            padding: "14px 18px",
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 20,
              color: "#FFD43B",
              marginBottom: 8,
            }}
          >
            src/
          </div>
          {beforeFiles.map((file, i) => {
            const lineOpacity = interpolate(
              frame,
              [6 + i * 4, 10 + i * 4],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            return (
              <div
                key={i}
                style={{
                  opacity: lineOpacity,
                  fontFamily: MONO,
                  fontSize: 19,
                  color: "rgba(255,255,255,0.9)",
                  paddingLeft: 20,
                  lineHeight: 1.7,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.3)" }}>
                  {i === beforeFiles.length - 1 ? "\u2514\u2500" : "\u251C\u2500"}
                </span>
                <span>{file}</span>
              </div>
            );
          })}
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

      {/* After */}
      <div style={{ opacity: afterOpacity, minWidth: 300 }}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            fontFamily: FONT,
            color: "#4ADE80",
            marginBottom: 10,
          }}
        >
          OK: 機能でまとめる
        </div>
        <div
          style={{
            backgroundColor: "rgba(74, 222, 128, 0.1)",
            border: "2px solid rgba(74, 222, 128, 0.4)",
            borderRadius: 8,
            padding: "14px 18px",
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 20,
              color: "#FFD43B",
              marginBottom: 8,
            }}
          >
            src/
          </div>
          {afterFiles.map((file, i) => {
            const lineOpacity = interpolate(
              frame,
              [37 + i * 4, 41 + i * 4],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            return (
              <div
                key={i}
                style={{
                  opacity: lineOpacity,
                  fontFamily: MONO,
                  fontSize: 19,
                  color: "rgba(255,255,255,0.9)",
                  paddingLeft: 20,
                  lineHeight: 1.7,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.3)" }}>
                  {i === afterFiles.length - 1 ? "\u2514\u2500" : "\u251C\u2500"}
                </span>
                <span>{file}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
