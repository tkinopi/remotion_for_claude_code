import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface SelfIntroProps {
  durationInFrames: number;
}

const ITEMS = [
  "現役エンジニア",
  "国立大学薬学部卒",
  "薬剤師免許取得後、未経験からエンジニアに転職",
  "約1年でWEBアプリケーション開発を\n0→1で行えるようになる",
  "現在2社の案件に開発メンバーとして参画中",
];

export const SelfIntro: React.FC<SelfIntroProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  const translateX = interpolate(frame, [0, 12], [-100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  const opacity = interpolate(
    frame,
    [0, 8, durationInFrames - 6, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const font =
    "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', sans-serif";

  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: "50%",
        transform: `translateY(-50%) translateX(${translateX}%)`,
        opacity,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(10, 61, 186, 0.85)",
          borderRadius: 20,
          padding: "28px 36px",
          width: 560,
        }}
      >
        <div
          style={{
            fontSize: 40,
            fontWeight: 900,
            fontFamily: font,
            color: "white",
            WebkitTextStroke: "1.5px rgba(0,0,0,0.3)",
            paintOrder: "stroke fill",
            marginBottom: 20,
          }}
        >
          トール
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {ITEMS.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <span
                style={{
                  fontSize: 26,
                  fontFamily: font,
                  color: "#FFD700",
                  fontWeight: 700,
                  lineHeight: 1.4,
                  flexShrink: 0,
                }}
              >
                ●
              </span>
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  fontFamily: font,
                  color: "white",
                  lineHeight: 1.4,
                  whiteSpace: "pre-wrap",
                }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
