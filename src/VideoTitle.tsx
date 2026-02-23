import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";

interface VideoTitleProps {
  durationInFrames: number;
}

const FONT =
  "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', sans-serif";

export const VideoTitle: React.FC<VideoTitleProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  const translateY = interpolate(frame, [0, 15], [80, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  const opacity = interpolate(
    frame,
    [0, 10, durationInFrames - 8, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 20,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {/* 帯背景 */}
      <div
        style={{
          width: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          padding: "18px 40px",
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        {/* 今回のテーマ バッジ */}
        <div
          style={{
            backgroundColor: "#0a3dba",
            color: "white",
            fontSize: 28,
            fontWeight: 800,
            fontFamily: FONT,
            padding: "8px 20px",
            borderRadius: 6,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          今回のテーマ
        </div>

        {/* タイトルテキスト */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              fontFamily: FONT,
              color: "rgba(255, 255, 255, 0.85)",
            }}
          >
            AI駆動エンジニアが語る
          </div>
          <div
            style={{
              fontSize: 44,
              fontWeight: 900,
              fontFamily: FONT,
              color: "white",
              letterSpacing: 1,
            }}
          >
            「Python終了」って言ってる人。正直、9割ズレてます
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
