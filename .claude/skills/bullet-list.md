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

### 1. telop-data.tsから発話タイミングを特定
各項目に対応するテロップのstartFrameを調べ、appearAtを計算する（詳細は後述の「appearAtの決め方」参照）。

### 2. Sequenceを追加
```tsx
// appearAtは発話タイミングから算出した値を使用（固定間隔は不可）
<Sequence from={開始フレーム} durationInFrames={表示時間}>
  <BulletList
    items={[
      { text: "項目1", appearAt: 0 },
      { text: "項目2", appearAt: 67 },
      { text: "項目3", appearAt: 127 },
    ]}
  />
</Sequence>
```

### 3. 効果音を追加（appearAtと同じ値を使用）
```tsx
// BulletList効果音の配列に追加（appearAtと必ず一致させる）
{ base: 開始フレーム, appears: [0, 67, 127] },
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

## appearAtの決め方（必須手順）

各項目のappearAtは **話者の発話タイミングに同期** させること。固定間隔（0, 15, 30...）での配置は禁止。

### 手順

1. `src/telop-data.ts` から、箇条書きの各項目に対応するテロップを特定する
2. 各テロップの `startFrame` を取得する
3. `appearAt = テロップのstartFrame - BulletListのSequence開始フレーム(from)` で計算する

### 例

telop-data.tsに以下がある場合:
```typescript
{ text: "・何がヤバいかを一言で言語化する", startFrame: 4776 },
{ text: "・最小の修正を入れる", startFrame: 4826 },
{ text: "・再発防止を仕組みにする", startFrame: 4880 },
```

Sequence `from=4776` なら:
```tsx
<Sequence from={4776} durationInFrames={192}>
  <BulletList
    items={[
      { text: "何がヤバいかを一言で言語化する", appearAt: 0 },       // 4776 - 4776 = 0
      { text: "最小の修正を入れる", appearAt: 50 },                  // 4826 - 4776 = 50
      { text: "再発防止を仕組みにする", appearAt: 104 },             // 4880 - 4776 = 104
    ]}
  />
</Sequence>
```

### 1つのテロップ内に複数項目が列挙されている場合

対応するテロップが1つしかない場合（例: 「変数名を直す、関数を分ける、整形を入れる」が1テロップ）は、そのテロップの表示時間をアイテム数で等分する:
```
appearAt = (テロップの表示フレーム数 / アイテム数) × アイテムのインデックス
```

### BULLET_SE_TIMINGSも同期する

効果音のタイミングもappearAtと一致させること:
```tsx
{ base: 4776, appears: [0, 50, 104] },  // appearAtと同じ値
```
