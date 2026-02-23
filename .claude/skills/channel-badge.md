# チャンネルバッジスキル

動画の左上にチャンネルロゴ+チャンネル名を常時表示する半透明バッジを追加するスキル。

## 前提

- Remotionプロジェクト構成済み
- チャンネルアイコン画像を `public/` に配置済み

## コンポーネント構成

### `src/ChannelBadge.tsx`

```tsx
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
```

## デザイン仕様

- **位置**: 左上 (top: 30px, left: 30px)
- **背景**: 半透明黒 `rgba(0, 0, 0, 0.5)` + 角丸 20px
- **ロゴ**: 64x64px、角丸 10px
- **テキスト**: 白、36px、太字 700
- **表示**: 動画全編を通じて常時表示

## TelopVideo.tsx への組み込み方

動画レイヤーとテロップレイヤーの間に配置する:

```tsx
<AbsoluteFill style={{ backgroundColor: "black" }}>
  <AbsoluteFill>
    <OffthreadVideo src={staticFile("動画.mp4")} />
  </AbsoluteFill>
  <ChannelBadge />           {/* ← 動画の上、テロップの下 */}
  <AbsoluteFill>
    {/* テロップSequence群 */}
  </AbsoluteFill>
</AbsoluteFill>
```

## カスタマイズポイント

- **チャンネル名**: span内のテキストを変更
- **アイコン画像**: `staticFile()` の引数を変更（画像は `public/` に配置）
- **サイズ調整**: ロゴのwidth/height、fontSize、padding を比例して変更
- **透明度**: backgroundColor の alpha 値を調整（0.3で薄め、0.7で濃いめ）
- **位置**: top/left を変更（右上なら `top: 30, right: 30, left: auto`）
