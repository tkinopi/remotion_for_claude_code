# テロップフェードインスキル

テロップの表示を瞬時切り替えからフェードインアニメーションに変更するスキル。

## 前提

- Remotionプロジェクト構成済み
- `src/Telop.tsx` が存在する

## 実装方法

`src/Telop.tsx` に `useCurrentFrame` と `interpolate` を追加し、Sequence内の相対フレームで不透明度を制御する。

### 変更箇所

1. import に `useCurrentFrame`, `interpolate` を追加
2. コンポーネント内で opacity を計算
3. AbsoluteFill の style に opacity を適用

```tsx
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

export const Telop: React.FC<TelopProps> = ({ text }) => {
  const frame = useCurrentFrame(); // Sequence内の相対フレーム
  const opacity = interpolate(frame, [0, 4], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        // ...既存スタイル
        opacity, // ← これを追加
      }}
    >
      {/* 既存の中身 */}
    </AbsoluteFill>
  );
};
```

## パラメータ

- **フェードイン時間**: 4フレーム（25fpsで0.16秒）
  - 控えめだが視認できる柔らかさ
  - 長くすると読み始めが遅れるので5フレーム以下を推奨
- `extrapolateRight: "clamp"` で4フレーム以降は opacity 1 を維持

## カスタマイズ

- フェードイン時間を変更: `[0, 4]` の `4` を調整（3〜6フレーム推奨）
- フェードアウトも追加する場合: `durationInFrames` を props で受け取り、末尾フレームで 0 に戻す

## 注意事項

- `useCurrentFrame()` は Sequence 内の相対フレームを返すため、各テロップの表示開始から自動的にフェードインする
- テロップの表示時間が極端に短い場合（5フレーム未満）、フェードインが完了しないことがある
