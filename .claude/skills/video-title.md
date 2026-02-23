# 動画タイトルスキル

動画冒頭でタイトルを言っている区間に、テーマ帯デザインのタイトルカードを画面下部に表示するスキル。下から上へスライドインするアニメーション付き。

## 前提

- Remotionプロジェクト構成済み
- `public/タイトル参考デザイン.png` がデザインの参考元（画像は使わず、デザインを再現する）
- テロップデータからタイトル発話の区間を特定済み

## デザイン仕様（参考画像の再現）

- **全幅の半透明黒帯** `rgba(0, 0, 0, 0.75)` を画面下部に配置
- **左に「今回のテーマ」バッジ**: テーマカラー背景（青 `#0a3dba`） + 白テキスト + 角丸
- **上段サブタイトル**: 「AI駆動エンジニアが語る」（26px、やや透過した白）
- **下段メインタイトル**: 動画タイトル（44px、太字、白）
- テロップと同じ位置（画面下部）に表示するため、タイトル表示中はテロップを非表示にする

## コンポーネント

### `src/VideoTitle.tsx`

```tsx
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
    easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
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
        {/* テーマバッジ */}
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
            {/* ← 動画ごとにここを変更 */}
            「Python終了」って言ってる人。正直、9割ズレてます
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

## アニメーション

- **スライドイン**: 15フレームで80px下から easeOutCubic で上昇
- **フェードイン**: 10フレーム
- **フェードアウト**: 最後8フレーム

## タイトル発話区間の特定方法

1. `src/telop-data.ts` で動画タイトルに相当するテロップを検索
2. そのテロップの `startFrame` と `endFrame` を取得
3. 通常は冒頭の「ということで今回は」の直後にタイトルが話される

## TelopVideo.tsx への組み込み方

タイトル区間のテロップを非表示にし、代わりにVideoTitleを表示する:

```tsx
import { VideoTitle } from "./VideoTitle";

const TITLE_START = 85;
const TITLE_END = 179;

// タイトルのSequence
<Sequence from={TITLE_START} durationInFrames={TITLE_END - TITLE_START}>
  <VideoTitle durationInFrames={TITLE_END - TITLE_START} />
</Sequence>

// テロップからタイトル区間を除外
<AbsoluteFill>
  {telopData
    .filter((seg) => seg.startFrame < TITLE_START || seg.startFrame >= TITLE_END)
    .map((segment, i) => (
      <Sequence
        key={i}
        from={segment.startFrame}
        durationInFrames={segment.endFrame - segment.startFrame}
      >
        <Telop text={segment.text} />
      </Sequence>
    ))}
</AbsoluteFill>
```

レイヤー順: タイトルはテロップと同じ画面下部を使うため、テロップレイヤーの直前に配置:

```
動画 → バッジ → 自己紹介 → 目次パネル → CTA → タイトル → テロップ
```

## 動画ごとに変更する箇所

1. **メインタイトル文**: VideoTitle.tsx 内のテキスト
2. **サブタイトル**: 必要に応じて「AI駆動エンジニアが語る」を変更
3. **TITLE_START / TITLE_END**: テロップデータから特定した発話区間
4. **テーマバッジの色**: 必要に応じて `backgroundColor` を変更（デフォルトは青 `#0a3dba`）
