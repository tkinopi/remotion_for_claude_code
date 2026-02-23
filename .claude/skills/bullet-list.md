# スキル: 箇条書きリスト表示 (BulletList)

## 概要
トーク内容の列挙部分を、左側に箇条書きパネルとして順番にアニメーション表示する。

## 使用タイミング
話者が複数の項目を列挙している箇所（「1つ目は〜、2つ目は〜」など）

## コンポーネント
`src/BulletList.tsx`

### Props
```typescript
interface BulletItem {
  text: string;       // 表示テキスト
  appearAt: number;   // 表示開始フレーム（Sequence内の相対フレーム）
}

interface BulletListProps {
  items: BulletItem[];
}
```

### デザイン
- 位置: 左側 (`left: 40px, top: 50%`, 垂直中央)
- 背景: 半透明ダークブルー `rgba(10, 61, 186, 0.7)` + 角丸14px
- 各項目: 金色の●マーカー(`#FFD700`) + 白テキスト36px太字
- アニメーション: フェードイン(5f) + 左からスライド(8f) + スケール(0.9→1)

## TelopVideo.tsxへの追加方法

### 1. Sequenceを追加
```tsx
<Sequence from={開始フレーム} durationInFrames={表示時間}>
  <BulletList
    items={[
      { text: "項目1", appearAt: 0 },
      { text: "項目2", appearAt: 20 },
      { text: "項目3", appearAt: 45 },
    ]}
  />
</Sequence>
```

### 2. 効果音を追加（各項目の出現タイミング）
```tsx
// BulletList効果音の配列に追加
{ base: 開始フレーム, appears: [0, 20, 45] },
```
効果音: `決定ボタンを押す1.mp3` (volume: 0.8)

### 3. テロップとの重複がある場合
箇条書き表示中にテロップを非表示にしたい場合:
```tsx
const BULLET_START = 開始フレーム;
const BULLET_END = 終了フレーム;

// telopDataのfilterに追加
.filter((seg) =>
  (seg.startFrame < BULLET_START || seg.startFrame >= BULLET_END)
)
```

## appearAtの決め方
- telop-data.tsの各テロップのstartFrameを確認
- 該当テロップの開始フレーム - BulletListのSequence開始フレーム = appearAt
- 話者が各項目を話し始めるタイミングに合わせる
