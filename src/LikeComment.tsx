import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface LikeCommentProps {
  durationInFrames: number;
}

const FONT =
  "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', sans-serif";

export const LikeComment: React.FC<LikeCommentProps> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  const containerOpacity = interpolate(frame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const containerSlide = interpolate(frame, [0, 8], [40, 0], {
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

  // Like button
  const likeScale = interpolate(frame, [6, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => {
      if (t < 0.6) return (t / 0.6) * 1.2;
      return 1.2 - (t - 0.6) / 0.4 * 0.2;
    },
  });
  const likeBounce = interpolate(frame, [14, 20], [1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const thumbRotate = interpolate(frame, [10, 16, 20], [0, -15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Comment
  const commentScale = interpolate(frame, [18, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => {
      if (t < 0.6) return (t / 0.6) * 1.2;
      return 1.2 - (t - 0.6) / 0.4 * 0.2;
    },
  });

  // Text
  const textOpacity = interpolate(frame, [28, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        right: 40,
        top: "35%",
        transform: `translateX(${containerSlide}px)`,
        opacity: containerOpacity * fadeOut,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        borderRadius: 18,
        padding: "34px 44px",
        border: "2px solid rgba(255, 255, 255, 0.15)",
      }}
    >
      {/* Icons row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* Like */}
        <div
          style={{
            transform: `scale(${likeScale * likeBounce})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              transform: `rotate(${thumbRotate}deg)`,
              fontSize: 64,
              lineHeight: 1,
            }}
          >
            👍
          </div>
          <span
            style={{
              fontSize: 24,
              fontWeight: 800,
              fontFamily: FONT,
              color: "#4A9EFF",
            }}
          >
            いいね
          </span>
        </div>

        {/* Comment */}
        <div
          style={{
            transform: `scale(${commentScale})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div style={{ fontSize: 64, lineHeight: 1 }}>💬</div>
          <span
            style={{
              fontSize: 24,
              fontWeight: 800,
              fontFamily: FONT,
              color: "#4ADE80",
            }}
          >
            コメント
          </span>
        </div>
      </div>

      {/* Text */}
      <div
        style={{
          opacity: textOpacity,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontSize: 27,
            fontWeight: 700,
            fontFamily: FONT,
            color: "white",
          }}
        >
          お願いします！
        </span>
      </div>
    </div>
  );
};
