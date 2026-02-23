# スキル: 赤テロップ強調 (Red Emphasis)

## 概要
重要な警告・注意喚起のテロップを赤色 + ズームアップで強調表示する。

## 使用タイミング
- 強い否定・警告（「〜は詰みます」「〜はNGです」など）
- blackout(白黒)ほど強くないが目立たせたい箇所

## 仕組み
gold-emphasis / blackout-effectと同じ`emphasis`システムを共有。

### RED_SEGMENTS配列
```typescript
const RED_SEGMENTS = [
  { start: 開始フレーム, end: 終了フレーム },
];
```

### 視覚効果
- テロップ色: `#FF3333`（赤）+ 白縁取り5px
- 動画ズーム: 1.0 → 1.08x
- バッジ: 非表示（emphasis >= 0.5の間）
- 遷移: 3フレームで滑らかにイン/アウト

### 効果音
- `和太鼓でドドン.mp3` (volume: 0.8) — セグメント開始時

## TelopVideo.tsxへの追加方法

### 1. RED_SEGMENTSにセグメントを追加
```typescript
const RED_SEGMENTS = [
  ...,
  { start: 開始フレーム, end: 終了フレーム },
];
```

### 2. テロップのvariant判定（自動）
既存のvariant判定ロジックで自動的に`variant="red"`が適用される:
```typescript
const isRed = RED_SEGMENTS.some(
  (seg) => segment.startFrame >= seg.start && segment.startFrame < seg.end,
);
const variant = isRed ? "red" : isGold ? "gold" : isMono ? "mono" : "default";
```

### 3. 効果音（自動）
RED_SEGMENTSのmapで自動的に和太鼓の効果音が付く。

## 優先順位
variant判定: `red > gold > mono(blackout) > default`
同一フレームに複数のセグメントが重なった場合、redが最優先。

## Telop.tsxのvariantスタイル
```typescript
red: {
  color: "#FF3333",
  WebkitTextStroke: "5px white",
}
```
