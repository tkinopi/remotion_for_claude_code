# CTAバナースキル

動画内の「チャンネル登録」等の発話に合わせてCTAバナーをオーバーレイ表示するスキル。

## 前提

- Remotionプロジェクト構成済み
- テロップデータ（`src/telop-data.ts`）からCTA発話の位置を特定済み

## コンポーネント

### `src/CtaBanner.tsx`

```tsx
import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";

interface CtaBannerProps {
  durationInFrames: number;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  // メイン: フェードイン + スライドアップ (0-20フレーム)
  const mainOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const mainTranslateY = interpolate(frame, [0, 20], [40, 0], {
    extrapolateRight: "clamp",
  });

  // サブ: 15フレーム遅れでフェードイン + スライドアップ
  const subOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateRight: "clamp",
  });
  const subTranslateY = interpolate(frame, [15, 35], [30, 0], {
    extrapolateRight: "clamp",
  });

  // 終了時フェードアウト（最後15フレーム）
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 120,
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          opacity: mainOpacity,
          transform: `translateY(${mainTranslateY}px)`,
          backgroundColor: "#CC0000",
          color: "white",
          fontSize: 42,
          fontWeight: 900,
          fontFamily:
            "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif",
          padding: "18px 48px",
          borderRadius: 14,
          textAlign: "center",
          letterSpacing: 2,
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.4)",
        }}
      >
        チャンネル登録お願いします！
      </div>
      <div
        style={{
          opacity: subOpacity,
          transform: `translateY(${subTranslateY}px)`,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          fontSize: 32,
          fontWeight: 700,
          fontFamily:
            "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif",
          padding: "12px 36px",
          borderRadius: 10,
          textAlign: "center",
          letterSpacing: 1,
          marginTop: 18,
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.3)",
        }}
      >
        高評価・コメントもよろしく！
      </div>
    </AbsoluteFill>
  );
};
```

## デザイン仕様

- **メインCTA**: 赤背景 `#CC0000` + 白テキスト 42px + 角丸 14px + ドロップシャドウ
- **サブCTA**: 半透明黒背景 + 白テキスト 32px + 角丸 10px
- **位置**: 画面中央やや下（テロップと被らない位置）
- **アニメーション**: スライドアップ + フェードイン（メインとサブに15フレーム差）

## CTA発話箇所の特定方法

1. `src/telop-data.ts` を検索して「チャンネル登録」を含むテロップを特定
2. そのテロップの `startFrame` と `endFrame` を取得
3. `TelopVideo.tsx` の `CTA_SEGMENTS` に追加

## TelopVideo.tsx への組み込み方

発話している区間にだけSequenceで配置する:

```tsx
import { CtaBanner } from "./CtaBanner";

const CTA_SEGMENTS = [
  { from: 7264, duration: 55 },   // 中盤の「チャンネル登録しておいてください」
  { from: 18696, duration: 64 },  // 終盤の「チャンネル登録しておいてください」
];

// TelopVideo内:
{CTA_SEGMENTS.map((seg, i) => (
  <Sequence key={`cta-${i}`} from={seg.from} durationInFrames={seg.duration}>
    <CtaBanner durationInFrames={seg.duration} />
  </Sequence>
))}
```

## レイヤー順

テロップの下に配置して、テロップの視認性を維持する:

```
動画 → バッジ → 目次パネル → CTAバナー → テロップ
```

## カスタマイズ

- **テキスト**: メイン/サブのテキストを動画の内容に合わせて変更
- **色**: メインの `backgroundColor` を変更（緑 `#00AA00` でLINE誘導など）
- **表示タイミング**: `CTA_SEGMENTS` の `from` / `duration` を調整
- **アニメーション速度**: `interpolate` のフレーム範囲を調整
- **サブCTA不要な場合**: サブの div を削除
