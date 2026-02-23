# スキル: 効果音システム (Sound Effects)

## 概要
動画内の各種イベントに対応する効果音を自動的に配置するシステム。

## 効果音ファイル一覧（public/内）

| ファイル名 | 用途 | 音の印象 |
|-----------|------|---------|
| 決定ボタンを押す1.mp3 | 画像表示・箇条書き項目 | 軽いクリック音 |
| 決定ボタンを押す3.mp3 | 強調・ダイアグラム・ステップ | やや重いクリック音 |
| 間抜け4.mp3 | ブラックアウト・失敗演出 | コミカルな失敗音 |
| 和太鼓でドドン.mp3 | タイトル・赤テロップ | 重厚な和太鼓 |

## 効果音の配置ルール

### 自動配置（配列ベース）

| トリガー | 効果音 | volume |
|---------|--------|--------|
| BLACKOUT_SEGMENTS開始 | 間抜け4 | 0.8 |
| RED_SEGMENTS開始 | 和太鼓でドドン | 0.8 |
| GOLD_SEGMENTS開始 | 決定ボタンを押す3 | 0.8 |
| IMAGE_FRAMES | 決定ボタンを押す1 | 0.8 |
| [yellow:]テロップ開始 | 決定ボタンを押す3 | 0.8 |
| [red:]テロップ開始 | 決定ボタンを押す3 | 0.8 |
| BulletList各項目出現 | 決定ボタンを押す1 | 0.8 |
| StepFlow各ステップ | 決定ボタンを押す3 | 0.8 |
| CTA_SEGMENTS開始 | 決定ボタンを押す3 | 0.8 |
| ダイアグラム表示 | 決定ボタンを押す3 | 0.8 |

### 個別配置

| フレーム | 効果音 | 用途 |
|---------|--------|------|
| 0 | 決定ボタンを押す1 | 自己紹介パネル |
| TITLE_START | 和太鼓でドドン | タイトル表示 |

## 重複回避ルール
同一フレームに複数の効果音が鳴らないようフィルタリング:

### [yellow:]テロップのフィルタ
```typescript
.filter((seg) =>
  seg.text.includes("[yellow:") &&
  !GOLD_SEGMENTS.some((g) => seg.startFrame >= g.start && seg.startFrame < g.end) &&
  !IMAGE_FRAMES.includes(seg.startFrame),
)
```

### [red:]テロップのフィルタ
```typescript
.filter((seg) =>
  seg.text.includes("[red:") &&
  !RED_SEGMENTS.some((r) => seg.startFrame >= r.start && seg.startFrame < r.end) &&
  !GOLD_SEGMENTS.some((g) => seg.startFrame >= g.start && seg.startFrame < g.end) &&
  !BLACKOUT_SEGMENTS.some((b) => seg.startFrame >= b.start && seg.startFrame < b.end) &&
  !IMAGE_FRAMES.includes(seg.startFrame),
)
```

## 実装パターン

### 配列mapパターン
```tsx
{配列.map((frame, i) => (
  <Sequence key={`se-${i}`} from={frame} durationInFrames={30}>
    <Audio src={staticFile("効果音.mp3")} volume={0.8} />
  </Sequence>
))}
```

### BulletList効果音パターン
```tsx
{[
  { base: 開始フレーム, appears: [0, 20, 45] },
].flatMap((list, li) =>
  list.appears.map((a, ai) => (
    <Sequence key={`bullet-se-${li}-${ai}`} from={list.base + a} durationInFrames={30}>
      <Audio src={staticFile("決定ボタンを押す1.mp3")} volume={0.8} />
    </Sequence>
  )),
)}
```

## 全効果音の共通設定
- `durationInFrames={30}` (1.2秒 @25fps)
- `volume={0.8}`
