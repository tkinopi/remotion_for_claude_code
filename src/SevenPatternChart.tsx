import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface SevenPatternChartProps {
  durationInFrames: number;
}

const FONT =
  "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', sans-serif";

const patterns = [
  { problem: "変数名が連番", solution: "命名を直す" },
  { problem: "変数名が人名", solution: "命名を直す" },
  { problem: "ファイル名が人名", solution: "機能でまとめる" },
  { problem: "1ファイルに全部", solution: "責務で分ける" },
  { problem: "インデント崩壊", solution: "formatter当てる" },
  { problem: "コメントアウト地獄", solution: "消してGit" },
  { problem: "コードが人で分割", solution: "チーム所有に戻す" },
];

export const SevenPatternChart: React.FC<SevenPatternChartProps> = ({
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
        padding: "20px 24px",
        border: "2px solid rgba(255, 255, 255, 0.15)",
        width: 560,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 12px",
          marginBottom: 8,
          borderBottom: "2px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            fontFamily: FONT,
            color: "#FFD700",
            width: 30,
            textAlign: "center",
          }}
        >
          #
        </span>
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            fontFamily: FONT,
            color: "#FFD700",
            flex: 1,
            paddingLeft: 12,
          }}
        >
          ヤバいパターン
        </span>
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            fontFamily: FONT,
            color: "#FFD700",
            width: 180,
            textAlign: "center",
          }}
        >
          対処
        </span>
      </div>

      {/* Rows */}
      {patterns.map((row, i) => {
        const rowDelay = 6 + i * 8;
        const rowOpacity = interpolate(
          frame,
          [rowDelay, rowDelay + 5],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        const rowSlide = interpolate(
          frame,
          [rowDelay, rowDelay + 7],
          [-15, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: (t) => 1 - Math.pow(1 - t, 3),
          },
        );

        return (
          <div
            key={i}
            style={{
              opacity: rowOpacity,
              transform: `translateX(${rowSlide}px)`,
              display: "flex",
              alignItems: "center",
              padding: "7px 12px",
              backgroundColor:
                i % 2 === 0
                  ? "rgba(255, 255, 255, 0.03)"
                  : "rgba(255, 255, 255, 0.07)",
              borderRadius: 6,
            }}
          >
            <span
              style={{
                fontSize: 20,
                fontWeight: 800,
                fontFamily: FONT,
                color: "rgba(255,255,255,0.4)",
                width: 30,
                textAlign: "center",
              }}
            >
              {i + 1}
            </span>
            <span
              style={{
                fontSize: 21,
                fontWeight: 700,
                fontFamily: FONT,
                color: "#FF6B6B",
                flex: 1,
                paddingLeft: 12,
              }}
            >
              {row.problem}
            </span>
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                fontFamily: FONT,
                color: "rgba(255,255,255,0.4)",
                marginRight: 8,
              }}
            >
              →
            </span>
            <span
              style={{
                fontSize: 21,
                fontWeight: 800,
                fontFamily: FONT,
                color: "#4ADE80",
                width: 160,
                textAlign: "center",
              }}
            >
              {row.solution}
            </span>
          </div>
        );
      })}
    </div>
  );
};
