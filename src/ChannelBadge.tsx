import React from "react";
import { Img, staticFile } from "remotion";

export const ChannelBadge: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: 30,
        left: 30,
        display: "flex",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: 20,
        padding: "12px 24px 12px 14px",
        gap: 14,
      }}
    >
      <Img
        src={staticFile("youtube_logo.png")}
        style={{
          width: 64,
          height: 64,
          borderRadius: 10,
        }}
      />
      <span
        style={{
          color: "white",
          fontSize: 36,
          fontWeight: 700,
          fontFamily:
            "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif",
          letterSpacing: 1,
        }}
      >
        AI駆動エンジニアチャンネル
      </span>
    </div>
  );
};
