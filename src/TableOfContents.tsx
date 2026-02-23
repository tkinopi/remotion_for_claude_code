import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { sectionData } from "./section-data";

const FADE_DURATION = 15;
const SECTION_DISPLAY_FRAMES = 75;

function getCurrentSectionIndex(frame: number): number {
  let index = -1;
  for (let i = 0; i < sectionData.length; i++) {
    if (frame >= sectionData[i].startFrame) {
      index = i;
    }
  }
  return index;
}

function computeOpacity(frame: number): number {
  // Opening display: frames 0 to ~400 with fade out
  const openingOpacity = interpolate(
    frame,
    [0, FADE_DURATION, 400 - FADE_DURATION, 400],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Section transition display: show for SECTION_DISPLAY_FRAMES at each section start
  let transitionOpacity = 0;
  for (const section of sectionData) {
    const start = section.startFrame;
    const end = start + SECTION_DISPLAY_FRAMES;
    const sectionOp = interpolate(
      frame,
      [start, start + FADE_DURATION, end - FADE_DURATION, end],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    transitionOpacity = Math.max(transitionOpacity, sectionOp);
  }

  return Math.max(openingOpacity, transitionOpacity);
}

export const TableOfContents: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = computeOpacity(frame);
  const currentIndex = getCurrentSectionIndex(frame);

  if (opacity <= 0) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        right: 30,
        top: "50%",
        transform: "translateY(-50%)",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: 16,
        padding: "24px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        opacity,
      }}
    >
      {sectionData.map((section, i) => (
        <div
          key={i}
          style={{
            fontSize: 28,
            fontWeight: 700,
            fontFamily:
              "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif",
            color: i === currentIndex ? "#FFD700" : "white",
            whiteSpace: "nowrap",
            transition: "color 0.2s",
          }}
        >
          {section.title}
        </div>
      ))}
    </div>
  );
};
