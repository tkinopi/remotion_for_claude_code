# スキル: ステップフロー表示 (StepFlow)

## 概要
処理の流れや手順を横並びのステップとして、矢印で繋いで順番にアニメーション表示する。

## 使用タイミング
- 処理フローの説明（「データ取る→プロンプト作る→生成する→返す」など）
- 手順の可視化

## コンポーネント
`src/StepFlow.tsx`

### Props
```typescript
interface StepFlowProps {
  steps: string[];          // ステップのラベル配列
  durationInFrames: number; // 表示時間
}
```

### デザイン
- 位置: 左側 (`left: 40px, top: 50%`, 垂直中央)
- 背景: 半透明黒 `rgba(0,0,0,0.8)` + 角丸14px
- 各ステップ: 青ボックス(`#0a3dba`) + 白テキスト + 矢印(→)
- アニメーション: フェードイン(6f) + 上からスライド(20px) + スケール(0.85→1)

## TelopVideo.tsxへの追加方法

### 1. 定数を定義
```typescript
const STEPFLOW_START = 開始フレーム;
const STEPFLOW_END = 終了フレーム;
```

### 2. Sequenceを追加
```tsx
<Sequence from={STEPFLOW_START} durationInFrames={STEPFLOW_END - STEPFLOW_START}>
  <StepFlow
    steps={["ステップ1", "ステップ2", "ステップ3", "ステップ4"]}
    durationInFrames={STEPFLOW_END - STEPFLOW_START}
  />
</Sequence>
```

### 3. テロップフィルターに追加
```tsx
.filter((seg) =>
  (seg.startFrame < STEPFLOW_START || seg.startFrame >= STEPFLOW_END)
)
```

### 4. 効果音を追加（各ステップ出現タイミング）
```tsx
{[0, 17, 34, 51].map((offset, i) => (
  <Sequence key={`step-se-${i}`} from={STEPFLOW_START + offset} durationInFrames={30}>
    <Audio src={staticFile("決定ボタンを押す3.mp3")} volume={0.8} />
  </Sequence>
))}
```
オフセットは `stepInterval = Math.floor((durationInFrames - 10) / steps.length)` で計算。
