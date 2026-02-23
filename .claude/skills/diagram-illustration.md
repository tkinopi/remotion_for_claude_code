# スキル: ダイアグラム/イラスト作成 (Diagram/Illustration)

## 概要
トーク内容を視覚的に補強するカスタムダイアグラムコンポーネントを作成し、画面の空きスペースに表示する。

## 使用タイミング
- 比較・対比を見せたいとき
- データ構造やコードを可視化したいとき
- フロー図・プロセスを表現したいとき
- CTA（LINE登録、いいね・コメント等）を視覚化したいとき

## ダイアグラムの種類と実装パターン

### パターン1: 比較表 (ComparisonChart型)
行ごとにラベル→結果→ステータス(OK/NG)を表示。
- 例: `ComparisonChart.tsx` — 求人A/B/Cの比較

### パターン2: コードブロック + スタンプ (JsonMismatch型)
コードやJSON表示 + NG/警告スタンプを重ねる。
- 例: `JsonMismatch.tsx`, `KeyMismatch.tsx`, `TypeMismatch.tsx`, `EmptyString.tsx`, `MissingField.tsx`
- 例: `DataClassDiagram.tsx` — Pythonコード + ✅バッジ

### パターン3: フロー図 (SchemaFlow型)
縦方向に矢印(▼)で繋いだステップ表示。
- 例: `SchemaFlow.tsx` — 5ステップのスキーマ検証フロー
- 例: `LangFlowDiagram.tsx` — Python→Go遷移
- 例: `WinPatternFlow.tsx` — 3ステップの勝ちパターン

### パターン4: バーチャート (SlowBar型)
横棒グラフでメトリクスを可視化。異常値をハイライト。
- 例: `SlowBar.tsx` — レスポンス時間の比較

### パターン5: カード/バッジ (LineBadge型)
アイコン + テキスト + サブ情報をカード形式で表示。
- 例: `LineBadge.tsx`, `SkillSheet.tsx`, `ClaudeConfig.tsx`, `LikeComment.tsx`

### パターン6: 繰り返し表示 (RepeatLines型)
同じテキストを並べて冗長さを可視化。
- 例: `RepeatLines.tsx`

## 共通アニメーションパターン

### コンテナ
```typescript
// フェードイン
const containerOpacity = interpolate(frame, [0, 6], [0, 1], {
  extrapolateLeft: "clamp", extrapolateRight: "clamp",
});
// スライドイン（左から）
const containerSlide = interpolate(frame, [0, 8], [-40, 0], {
  extrapolateLeft: "clamp", extrapolateRight: "clamp",
  easing: (t) => 1 - Math.pow(1 - t, 3),
});
// フェードアウト
const fadeOut = interpolate(frame,
  [durationInFrames - 8, durationInFrames], [1, 0],
  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
);
```

### 子要素の順次表示
```typescript
const elementOpacity = interpolate(frame, [delay + 4, delay + 10], [0, 1], {
  extrapolateLeft: "clamp", extrapolateRight: "clamp",
});
```

### NGスタンプ（回転 + スケール）
```typescript
const stampOpacity = interpolate(frame, [30, 34], [0, 1], {...});
const stampScale = interpolate(frame, [30, 36], [1.4, 1], {...});
// transform: `scale(${stampScale}) rotate(-12deg)`
```

## 共通スタイル
- 位置: `left: 40px, top: "50%"` (左寄せ・垂直中央) ※右配置の場合は `right: 40px`
- 背景: `rgba(0, 0, 0, 0.8)` + 角丸14px
- ボーダー: `2px solid rgba(255, 255, 255, 0.15)`
- フォント: 日本語 `'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif`
- フォント: コード `'SF Mono', 'Menlo', 'Monaco', monospace`
- サイズ: 幅480-570px程度

## TelopVideo.tsxへの追加方法

### 1. コンポーネントファイルを作成
```tsx
// src/NewDiagram.tsx
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface NewDiagramProps {
  durationInFrames: number;
}

export const NewDiagram: React.FC<NewDiagramProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  // ... 共通アニメーションパターンを使用
};
```

### 2. TelopVideo.tsxにimport & Sequence追加
```tsx
import { NewDiagram } from "./NewDiagram";

<Sequence from={開始フレーム} durationInFrames={表示時間}>
  <NewDiagram durationInFrames={表示時間} />
</Sequence>
```

### 3. 効果音配列にフレームを追加
```typescript
// イメージ図の効果音配列に追加
{[..., 開始フレーム].map((f, i) => (
  <Sequence key={`diagram-se-${i}`} from={f} durationInFrames={30}>
    <Audio src={staticFile("決定ボタンを押す3.mp3")} volume={0.8} />
  </Sequence>
))}
```
