# スキル: プロモーションバッジ表示 (PromoBadge)

## 概要
動画の終盤で告知・CTA系のビジュアルバッジを表示する。
LINE登録案内、プレゼント紹介（スキルシート・設定ファイル）、いいね・コメント促進など。

## 使用タイミング
話者がLINE登録・プレゼント・いいね/コメントなどの告知をしている箇所。

## 既存コンポーネント

### LineBadge (`src/LineBadge.tsx`)
- **用途**: LINE登録の案内
- **位置**: 左側 (`left: 40px, top: 50%`)
- **デザイン**: LINEアイコン(緑) + 「概要欄からLINE登録」 + 「無料の壁打ち相談」
- **アニメーション**: フェードイン + 左からスライド + フェードアウト

### SkillSheet (`src/SkillSheet.tsx`)
- **用途**: スキルシート配布の紹介
- **位置**: 左側 (`left: 40px, top: 50%`)
- **デザイン**: テーブル形式（言語/AI・ML/インフラ/DB/ツール）、青ヘッダー
- **アニメーション**: フェードイン + 左からスライド + 各行が順番に表示 + フェードアウト

### ClaudeConfig (`src/ClaudeConfig.tsx`)
- **用途**: Claude Code設定ファイル配布の紹介
- **位置**: 左側 (`left: 40px, top: 50%`)
- **デザイン**: ファイル名(CLAUDE.md) + コードブロック + 🎁「そのまま配布します」バッジ
- **アニメーション**: フェードイン + 左からスライド + コード順次表示 + フェードアウト

### LikeComment (`src/LikeComment.tsx`)
- **用途**: いいね・コメントの促進
- **位置**: 右側 (`right: 40px, top: 35%`)
- **デザイン**: 👍いいね(青) + 💬コメント(緑) + 「お願いします！」
- **アニメーション**: バウンスイン + 親指回転 + テキストフェードイン + フェードアウト

## TelopVideo.tsxへの追加方法

### 1. telop-data.tsから発話タイミングを特定
各バッジに対応するテロップの `startFrame` / `endFrame` を確認する。

### 2. importを追加
```tsx
import { LineBadge } from "./LineBadge";
import { SkillSheet } from "./SkillSheet";
import { ClaudeConfig } from "./ClaudeConfig";
import { LikeComment } from "./LikeComment";
```

### 3. Sequenceを追加
```tsx
{/* LINE登録バッジ — 箇条書きリストが始まる前に消す */}
<Sequence from={LINE発話開始フレーム} durationInFrames={箇条書き開始までの長さ}>
  <LineBadge durationInFrames={箇条書き開始までの長さ} />
</Sequence>

{/* スキルシート — スキルシートの話の間 */}
<Sequence from={スキルシート発話開始} durationInFrames={次の話題までの長さ}>
  <SkillSheet durationInFrames={次の話題までの長さ} />
</Sequence>

{/* Claude Code設定ファイル — 設定ファイルの話の間 */}
<Sequence from={設定ファイル発話開始} durationInFrames={次の話題までの長さ}>
  <ClaudeConfig durationInFrames={次の話題までの長さ} />
</Sequence>

{/* いいね・コメント — コメント欄の話の間 */}
<Sequence from={いいねコメント発話開始} durationInFrames={テロップ終了までの長さ}>
  <LikeComment durationInFrames={テロップ終了までの長さ} />
</Sequence>
```

### 4. 効果音を追加（各バッジの開始フレームに配置）
```tsx
<Sequence from={開始フレーム} durationInFrames={30}>
  <Audio src={staticFile("決定ボタンを押す1.mp3")} volume={0.8} />
</Sequence>
```

## 配置のルール

### 重複回避
- LineBadge・SkillSheet・ClaudeConfigは全て左側表示のため、同時に表示しない
- LineBadgeはその後のBulletListと被るので、BulletList開始フレームで終了させる
- SkillSheetとClaudeConfigは連続する話題なので、SkillSheet終了直後にClaudeConfig開始

### 表示時間の決め方
- 各バッジの `durationInFrames` は対応する発話区間に合わせる
- 次のバッジや箇条書きリストと重ならないように調整

### 効果音
- 各バッジにつき1つ `決定ボタンを押す1.mp3` (volume: 0.8)
- 他のSEと同一フレームにならないよう確認
