# 自己紹介文スキル

動画冒頭の「はいどうもこんにちはトールです」の発話中に、自己紹介パネルを画面左から右にスライドインさせて表示するスキル。

## 前提

- Remotionプロジェクト構成済み
- `public/自己紹介文.png` に自己紹介の元テキストがある（画像はそのまま使わず中の文字だけ使う）
- テロップデータから「はいどうもこんにちはトールです」の区間（startFrame / endFrame）を特定済み

## 重要: 画像は使わない

`自己紹介文.png` はテキスト内容の参照元として使う。画像をそのまま `<Img>` で表示するのではなく、中の文字を読み取ってReactコンポーネントで描画する。デザインは動画のテロップスタイル（濃い青 + 白テキスト + 黄色アクセント）に合わせる。

## コンポーネント

### `src/SelfIntro.tsx`

```tsx
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
    easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
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
```

## デザイン仕様

- **背景**: テロップカラーと合わせた濃い青 `rgba(10, 61, 186, 0.85)` + 角丸 20px
- **名前**: 白テキスト 40px 太字(900) + 薄い黒ストローク
- **箇条書き**: 黄色(#FFD700)の●マーカー + 白テキスト 26px 太字(700)
- **フォント**: テロップと同じ `Hiragino Kaku Gothic ProN`
- **位置**: 画面左側 (left: 40px)、縦方向中央
- **幅**: 560px

## アニメーション

- **スライドイン**: 12フレームで画面外左から easeOutCubic で登場
- **フェードイン**: 8フレーム
- **フェードアウト**: 最後6フレーム

## 自己紹介の発話区間の特定方法

1. `src/telop-data.ts` で「はいどうもこんにちはトールです」を含むテロップを検索
2. そのテロップの `startFrame` と `endFrame` を取得

## TelopVideo.tsx への組み込み方

```tsx
import { SelfIntro } from "./SelfIntro";

// 「はいどうもこんにちはトールです」の区間 (例: 0〜46)
<Sequence from={0} durationInFrames={46}>
  <SelfIntro durationInFrames={46} />
</Sequence>
```

レイヤー順はバッジの後、目次パネルの前:

```
動画 → バッジ → 自己紹介パネル → 目次パネル → CTA → テロップ
```

## 自己紹介内容の更新

`ITEMS` 配列を変更する。内容が変わった場合は `public/自己紹介文.png` を確認して更新する。
