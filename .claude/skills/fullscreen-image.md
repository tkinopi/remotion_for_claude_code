# スキル: フルスクリーン画像表示 (FullscreenImage)

## 概要
トーク内容に関連する画像を全画面でズームイン/アウトしながら表示する。

## 使用タイミング
- 話題に関連するイメージ画像を見せたいとき
- 技術ロゴ（python.png, Go.pngなど）を強調表示するとき
- 人物イラストで感情を表現するとき

## コンポーネント
`src/FullscreenImage.tsx`

### Props
```typescript
interface FullscreenImageProps {
  src: string;              // public/内の画像ファイル名
  durationInFrames: number; // 表示時間（フレーム数）
  zoom?: "in" | "out";      // ズーム方向（デフォルト: "in"）
}
```

### デザイン
- 全画面表示 (`objectFit: "cover"`)
- フェードイン: 6フレーム (0→1)
- フェードアウト: 6フレーム (1→0)
- ズーム: 1.0 ↔ 1.15 のスケール変化

## TelopVideo.tsxへの追加方法

### 1. 画像をpublic/に配置

### 2. Sequenceを追加
```tsx
<Sequence from={開始フレーム} durationInFrames={表示時間}>
  <FullscreenImage src="画像名.png" durationInFrames={表示時間} zoom="out" />
</Sequence>
```

### 3. IMAGE_FRAMESに開始フレームを追加
```typescript
const IMAGE_FRAMES = [
  ..., 開始フレーム,  // 追加
];
```
これにより自動的に `決定ボタンを押す1.mp3` の効果音が付く。

### 4. 特殊な効果音にしたい場合
IMAGE_FRAMESから除外し、個別にAudio Sequenceを追加:
```tsx
<Sequence from={開始フレーム} durationInFrames={30}>
  <Audio src={staticFile("間抜け4.mp3")} volume={0.8} />
</Sequence>
```

## zoom方向の使い分け
- `"in"`: 通常→拡大（注目・強調）
- `"out"`: 拡大→通常（全体像を見せる・落ち着き）
