# 金色テロップ強調スキル

特定のテロップ区間でテロップを金色に変え、話者にズームアップし、チャンネルバッジを非表示にする演出スキル。重要な発言やキーメッセージの強調に使う。

## 前提

- Remotionプロジェクト構成済み
- `src/Telop.tsx` に `variant` prop（`"default"` / `"mono"` / `"gold"`）が実装済み
- `src/TelopVideo.tsx` に `useCurrentFrame` / `interpolate` が導入済み

## Telop の variant システム

`src/Telop.tsx` に以下のスタイル定義がある:

```tsx
type TelopVariant = "default" | "mono" | "gold";

const VARIANT_STYLES: Record<TelopVariant, { color: string; stroke: string }> = {
  default: { color: "#0a3dba", stroke: "5px white" },
  mono: { color: "white", stroke: "5px rgba(0,0,0,0.7)" },
  gold: { color: "#FFD700", stroke: "5px rgba(0,0,0,0.8)" },
};
```

| variant | 用途 | 文字色 | 縁取り |
|---------|------|--------|--------|
| default | 通常 | 濃い青 `#0a3dba` | 白 |
| mono | ブラックアウト | 白 | 半透明黒 |
| gold | 金色強調 | 金色 `#FFD700` | 黒 |

使い方: `<Telop text="..." variant="gold" />`

## TelopVideo での制御

ブラックアウト（`BLACKOUT_SEGMENTS`）と同様に、`GOLD_SEGMENTS` 配列で管理する:

```tsx
const GOLD_SEGMENTS = [
  { start: 2388, end: 2492 },
];

// 金色強調の強度を計算
const gold = Math.max(
  ...GOLD_SEGMENTS.map((seg) =>
    interpolate(
      frame,
      [seg.start, seg.start + 3, seg.end - 3, seg.end],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    ),
  ),
);

// ブラックアウトと金色の両方でズーム+バッジ非表示を共有
const emphasis = Math.max(blackout, gold);
const videoScale = interpolate(emphasis, [0, 1], [1, 1.08]);

// 動画レイヤー: グレースケールはブラックアウト時のみ
<AbsoluteFill
  style={{
    filter: grayscale > 0 ? `grayscale(${grayscale}%)` : undefined,
    transform: emphasis > 0 ? `scale(${videoScale})` : undefined,
    transformOrigin: "center center",
  }}
>
  <OffthreadVideo ... />
</AbsoluteFill>

// バッジ: 強調中は非表示
{emphasis < 0.5 && <ChannelBadge />}

// テロップ: variant 判定
const isGold = GOLD_SEGMENTS.some(
  (seg) => segment.startFrame >= seg.start && segment.startFrame < seg.end,
);
const isMono = BLACKOUT_SEGMENTS.some(
  (seg) => segment.startFrame >= seg.start && segment.startFrame < seg.end,
);
const variant = isGold ? "gold" : isMono ? "mono" : "default";
<Telop text={segment.text} variant={variant} />
```

## ブラックアウトとの違い

| 要素 | ブラックアウト (mono) | 金色強調 (gold) |
|------|---------------------|----------------|
| 動画 | グレースケール + ズーム | カラーのまま + ズーム |
| テロップ | 白文字 + 黒縁取り | 金色文字 + 黒縁取り |
| バッジ | 非表示 | 非表示 |
| 用途 | ネガティブ・失敗談 | 重要メッセージ・結論 |

## 金色強調区間の特定方法

1. `src/telop-data.ts` で強調したいテロップを検索
2. そのテロップの `startFrame` と `endFrame` を取得
3. `GOLD_SEGMENTS` 配列にエントリを追加

## カスタマイズ

- **テロップ色**: `VARIANT_STYLES.gold.color` を変更
- **ズーム量**: `[1, 1.08]` の `1.08` を調整
- **遷移速度**: `seg.start + 3` の `3` を変更
- **新しい variant 追加**: `VARIANT_STYLES` にエントリを追加し、`TelopVariant` 型を拡張
