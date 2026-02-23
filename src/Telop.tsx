import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

type TelopVariant = "default" | "mono" | "gold" | "red";

interface TelopProps {
  text: string;
  mono?: boolean;
  variant?: TelopVariant;
}

type TextSegment = { text: string; color?: string };

const COLOR_MAP: Record<string, string> = {
  yellow: "#FFD700",
  red: "#FF3333",
};

function parseMarkup(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  const regex = /\[(yellow|red):([^\]]+)\]/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index) });
    }
    segments.push({ text: match[2], color: COLOR_MAP[match[1]] });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex) });
  }

  return segments;
}

const VARIANT_STYLES: Record<TelopVariant, { color: string; stroke: string }> = {
  default: { color: "#0a3dba", stroke: "5px white" },
  mono: { color: "white", stroke: "5px rgba(0,0,0,0.7)" },
  gold: { color: "#FFD700", stroke: "5px rgba(0,0,0,0.8)" },
  red: { color: "#FF3333", stroke: "5px white" },
};

export const Telop: React.FC<TelopProps> = ({ text, mono, variant }) => {
  const v = variant ?? (mono ? "mono" : "default");
  const style = VARIANT_STYLES[v];
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 4], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 30,
        opacity,
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: 900,
          fontFamily:
            "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', sans-serif",
          color: style.color,
          textAlign: "center",
          lineHeight: 1.35,
          WebkitTextStroke: style.stroke,
          paintOrder: "stroke fill",
          maxWidth: "90%",
        }}
      >
        {text.split("\n").map((line, i) => (
          <React.Fragment key={i}>
            {i > 0 && <br />}
            {parseMarkup(line).map((seg, j) =>
              seg.color ? (
                <span key={j} style={{ color: seg.color }}>
                  {seg.text}
                </span>
              ) : (
                <React.Fragment key={j}>{seg.text}</React.Fragment>
              )
            )}
          </React.Fragment>
        ))}
      </div>
    </AbsoluteFill>
  );
};
