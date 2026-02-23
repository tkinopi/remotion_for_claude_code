import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface BulletItem {
  text: string;
  appearAt: number;
}

interface BulletListProps {
  items: BulletItem[];
}

const FONT =
  "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', sans-serif";

export const BulletList: React.FC<BulletListProps> = ({ items }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      {items.map((item, i) => {
        const opacity = interpolate(
          frame,
          [item.appearAt, item.appearAt + 5],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        const translateX = interpolate(
          frame,
          [item.appearAt, item.appearAt + 8],
          [-30, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: (t) => 1 - Math.pow(1 - t, 3),
          },
        );
        const scale = interpolate(
          frame,
          [item.appearAt, item.appearAt + 6],
          [0.9, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );

        if (opacity <= 0) return null;

        return (
          <div
            key={i}
            style={{
              opacity,
              transform: `translateX(${translateX}px) scale(${scale})`,
              backgroundColor: "rgba(10, 61, 186, 0.85)",
              borderRadius: 12,
              padding: "14px 30px",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <span
              style={{
                fontSize: 36,
                fontWeight: 700,
                fontFamily: FONT,
                color: "#FFD700",
                flexShrink: 0,
              }}
            >
              ●
            </span>
            <span
              style={{
                fontSize: 36,
                fontWeight: 700,
                fontFamily: FONT,
                color: "white",
                whiteSpace: "nowrap",
              }}
            >
              {item.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};
