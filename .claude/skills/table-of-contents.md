# 目次パネルスキル

動画のセクション構成に基づく目次パネルを画面右側に表示し、現在のセクションをハイライトするスキル。

## 前提

- Remotionプロジェクト構成済み
- 動画のセクション構成（タイトルと開始フレーム）が特定済み

## 作成ファイル

### 1. `src/section-data.ts`

セクションの定義データ。動画の内容に合わせてタイトルと開始フレームを設定する。

```ts
export interface Section {
  title: string;
  startFrame: number;
}

export const sectionData: Section[] = [
  { title: "問題提起", startFrame: 222 },
  { title: "結論", startFrame: 7319 },
  // ... 動画の構成に合わせて定義
];
```

### 2. `src/TableOfContents.tsx`

```tsx
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { sectionData } from "./section-data";

const FADE_DURATION = 15;
const SECTION_DISPLAY_FRAMES = 75; // 3秒 @25fps

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
  // 冒頭表示（フレーム0〜400）
  const openingOpacity = interpolate(
    frame,
    [0, FADE_DURATION, 400 - FADE_DURATION, 400],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // セクション切り替わり表示
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

  if (opacity <= 0) return null;

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
          }}
        >
          {section.title}
        </div>
      ))}
    </div>
  );
};
```

## デザイン仕様

- **位置**: 右側 (right: 30px)、縦方向中央
- **背景**: 半透明黒 `rgba(0, 0, 0, 0.5)` + 角丸 16px
- **テキスト**: 白 28px 太字、現在セクションは黄色 `#FFD700`
- **表示タイミング**:
  - 冒頭: フレーム 0〜400（フェードイン/アウト各15フレーム）
  - セクション切り替わり: 各startFrameから75フレーム間

## TelopVideo.tsx への組み込み方

propsなしで配置するだけで動作する（内部でuseCurrentFrameを使用）:

```tsx
import { TableOfContents } from "./TableOfContents";

<AbsoluteFill>
  <OffthreadVideo ... />
  <ChannelBadge />
  <TableOfContents />   {/* ← バッジの後、テロップの前 */}
  {/* テロップSequence群 */}
</AbsoluteFill>
```

## セクション構成の特定方法

1. `src/telop-data.ts` を読んで動画全体の流れを把握
2. 話者が明確にトピックを切り替えているポイントを特定（「まず」「次に」「で、もう一個」「つまり」等の接続表現が目印）
3. 各セクションに短いタイトルをつけ、startFrameを記録

## カスタマイズ

- **表示時間**: `SECTION_DISPLAY_FRAMES` を変更（75 = 3秒 @25fps）
- **冒頭表示時間**: `400` を動画に合わせて調整
- **フェードの速さ**: `FADE_DURATION` を変更
- **フォントサイズ**: 項目数が多い場合は小さくする
- **位置**: 左側に出す場合は `right` を `left` に変更
