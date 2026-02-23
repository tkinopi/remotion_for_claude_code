# ブラックアウトエフェクトスキル

特定のテロップ区間で映像をグレースケール化し、テロップを白黒に、チャンネルバッジを非表示にして、話者にズームアップする演出スキル。ネガティブな発言や強調したい箇所で使う。

## 前提

- Remotionプロジェクト構成済み
- `src/TelopVideo.tsx` に `useCurrentFrame` / `interpolate` が導入済み
- `src/Telop.tsx` に `mono` prop が追加済み

## 実装要素

### 1. Telop に `mono` prop を追加

`src/Telop.tsx` の変更:

```tsx
interface TelopProps {
  text: string;
  mono?: boolean;  // ← 追加
}

export const Telop: React.FC<TelopProps> = ({ text, mono }) => {
  // ...
  return (
    <AbsoluteFill ...>
      <div
        style={{
          // ...
          color: mono ? "white" : "#0a3dba",
          WebkitTextStroke: mono ? "5px rgba(0,0,0,0.7)" : "5px white",
          // ...
        }}
      >
        {/* ... */}
      </div>
    </AbsoluteFill>
  );
};
```

mono=true の場合: 白文字 + 半透明黒縁取り（参考画像に合わせたスタイル）

### 2. TelopVideo でブラックアウト制御

`src/TelopVideo.tsx` の変更:

```tsx
import { useCurrentFrame, interpolate } from "remotion";

// ブラックアウト区間の定義
const BLACKOUT_START = 1532;
const BLACKOUT_END = 1588;

export const TelopVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // ブラックアウト強度（0=通常, 1=完全ブラックアウト）
  // 3フレームで滑らかに切り替え
  const blackout = interpolate(
    frame,
    [BLACKOUT_START, BLACKOUT_START + 3, BLACKOUT_END - 3, BLACKOUT_END],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const videoScale = interpolate(blackout, [0, 1], [1, 1.08]);
  const grayscale = blackout * 100;

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* 動画レイヤー: グレースケール + ズームアップ */}
      <AbsoluteFill
        style={{
          filter: `grayscale(${grayscale}%)`,
          transform: `scale(${videoScale})`,
          transformOrigin: "center center",
        }}
      >
        <OffthreadVideo src={staticFile("動画.mp4")} />
      </AbsoluteFill>

      {/* バッジ: ブラックアウト中は非表示 */}
      {blackout < 0.5 && <ChannelBadge />}

      {/* テロップ: ブラックアウト区間は mono=true */}
      <AbsoluteFill>
        {telopData.map((segment, i) => {
          const isMono =
            segment.startFrame >= BLACKOUT_START &&
            segment.startFrame < BLACKOUT_END;
          return (
            <Sequence
              key={i}
              from={segment.startFrame}
              durationInFrames={segment.endFrame - segment.startFrame}
            >
              <Telop text={segment.text} mono={isMono} />
            </Sequence>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
```

## ブラックアウト区間の特定方法

1. `src/telop-data.ts` で強調したいテロップを検索
2. そのテロップの `startFrame` と `endFrame` を取得
3. `BLACKOUT_START` / `BLACKOUT_END` に設定

## 演出の内訳

| 要素 | 通常時 | ブラックアウト時 |
|------|--------|----------------|
| 動画 | カラー、等倍 | グレースケール、1.08倍ズーム |
| チャンネルバッジ | 表示 | 非表示 |
| テロップ文字色 | 濃い青 `#0a3dba` | 白 `white` |
| テロップ縁取り | 白 `5px white` | 半透明黒 `5px rgba(0,0,0,0.7)` |
| 切り替え速度 | - | 3フレーム（0.12秒）で遷移 |

## 複数箇所で使う場合

ブラックアウト区間を配列化する:

```tsx
const BLACKOUT_SEGMENTS = [
  { start: 1532, end: 1588 },
  { start: 3000, end: 3050 },
];

// blackout 値を合成
const blackout = Math.max(
  ...BLACKOUT_SEGMENTS.map((seg) =>
    interpolate(
      frame,
      [seg.start, seg.start + 3, seg.end - 3, seg.end],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    )
  )
);

// isMono 判定
const isMono = BLACKOUT_SEGMENTS.some(
  (seg) => segment.startFrame >= seg.start && segment.startFrame < seg.end
);
```

## カスタマイズ

- **ズーム量**: `[1, 1.08]` の `1.08` を調整（1.05で控えめ、1.12で強め）
- **遷移速度**: `BLACKOUT_START + 3` の `3` を変更（大きいほどゆっくり）
- **暗さ**: グレースケールに加えて `brightness()` を追加可能（例: `filter: grayscale(100%) brightness(0.85)`）
- **テロップ色**: mono時の色を変更（赤文字にするなど）
