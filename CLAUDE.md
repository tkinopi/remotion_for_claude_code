# Remotion動画テロップ＆装飾プロジェクト

## プロジェクト概要
YouTube動画にテロップ・演出・効果音・BGMを追加するRemotionプロジェクト。
docx原稿 + 動画ファイルから、フルテロップ付き動画を生成する。

## 技術スタック
- Remotion v4.0.425 + React 18 + TypeScript
- 25fps / 1920x1080
- 素材は `public/` に配置

## ディレクトリ構成
```
src/
├── Root.tsx              # Composition定義
├── index.ts              # registerRoot
├── TelopVideo.tsx        # メイン合成（全レイヤー統合）
├── telop-data.ts         # テロップデータ（startFrame, endFrame, text）
├── Telop.tsx             # テロップ描画（variant: default/mono/gold/red）
├── ChannelBadge.tsx      # チャンネルバッジ（左上常時表示）
├── TableOfContents.tsx   # 目次パネル（右側）
├── SelfIntro.tsx         # 自己紹介パネル
├── VideoTitle.tsx        # 動画タイトル帯
├── CtaBanner.tsx         # チャンネル登録CTA
├── BulletList.tsx        # 箇条書きリスト
├── FullscreenImage.tsx   # 全画面画像表示
├── StepFlow.tsx          # ステップフロー図
├── ComparisonChart.tsx   # 比較表
├── RepeatLines.tsx       # 繰り返し表示
├── SlowBar.tsx           # バーチャート
├── JsonMismatch.tsx      # JSON不一致図
├── KeyMismatch.tsx       # キー名不一致図
├── TypeMismatch.tsx      # 型不一致図
├── EmptyString.tsx       # 空文字図
├── MissingField.tsx      # 欠落フィールド図
├── DataClassDiagram.tsx  # DataClassコード図
├── SchemaFlow.tsx        # スキーマフロー図
├── LangFlowDiagram.tsx   # 言語遷移フロー図
├── WinPatternFlow.tsx    # 勝ちパターンフロー図
├── LineBadge.tsx         # LINE登録バッジ
├── SkillSheet.tsx        # スキルシート表
├── ClaudeConfig.tsx      # CLAUDE.md設定図
└── LikeComment.tsx       # いいね・コメントアニメーション

public/
├── 2話目.mp4             # 元動画
├── preview.mp3           # BGM
├── *.png                 # 画像素材
├── 決定ボタンを押す1.mp3  # SE: 軽いクリック
├── 決定ボタンを押す3.mp3  # SE: 重めのクリック
├── 間抜け4.mp3           # SE: コミカル失敗音
└── 和太鼓でドドン.mp3     # SE: 和太鼓

.claude/skills/           # 各編集手法のスキル定義
```

## TelopVideo.tsxのレイヤー構成（描画順）
```
1. OffthreadVideo（元動画 + grayscale/zoom効果）
2. BGM（ループ + クロスフェード）
3. ChannelBadge（emphasis時は非表示）
4. SelfIntro
5. TableOfContents
6. CtaBanner
7. FullscreenImage（27箇所）
8. ダイアグラムコンポーネント群
9. BulletList（12箇所）
10. StepFlow
11. VideoTitle
12. 効果音（SE）群
13. Telop（最前面）
```

## エフェクトシステム
TelopVideo.tsxの定数配列で制御:
- `BLACKOUT_SEGMENTS` — 白黒 + ズーム + monoテロップ
- `GOLD_SEGMENTS` — 金色テロップ + ズーム
- `RED_SEGMENTS` — 赤テロップ + ズーム
- `IMAGE_FRAMES` — 全画面画像の開始フレーム
- `CTA_SEGMENTS` — CTAバナー表示区間

## 効果音ルール
詳細は `.claude/skills/sound-effects.md` 参照。
- 各エフェクトの開始タイミングで対応するSEが自動配置
- 重複回避フィルタで同一フレームに複数SE禁止

---

# 動画編集ワークフロー（全手順）

## フェーズ1: テロップ生成
**担当: 単体Agent（create-telopスキル使用）**

1. `ffprobe` で動画情報取得（fps, duration, resolution）
2. Whisper medium + `word_timestamps=True` で音声認識
3. docxからパラグラフ単位でテロップテキスト抽出
4. 2段階ハイブリッドタイミング:
   - Phase 1: Whisperセグメント ↔ 元テキストのfuzzy matchでアンカー構築
   - Phase 2: Whisper単語リスト ±3秒で発話開始を精密特定
5. 改行挿入（「」内不可、活用語尾前不可）
6. `src/telop-data.ts` + `out/*.srt` 出力
7. `src/Telop.tsx`, `src/TelopVideo.tsx`, `src/Root.tsx` 生成

## フェーズ2: 基本装飾
**担当: 単体Agent（各スキル順次適用）**

以下の順番で適用（前の工程の出力に依存するため順序重要）:

| # | 作業 | スキル | 変更ファイル |
|---|------|--------|-------------|
| 1 | キーワードハイライト | keyword-highlight | telop-data.ts |
| 2 | チャンネルバッジ | channel-badge | ChannelBadge.tsx, TelopVideo.tsx |
| 3 | テロップフェードイン | telop-fade-in | Telop.tsx |
| 4 | 自己紹介パネル | self-intro | SelfIntro.tsx, TelopVideo.tsx |
| 5 | 動画タイトル | video-title | VideoTitle.tsx, TelopVideo.tsx |
| 6 | 目次パネル | table-of-contents | section-data.ts, TableOfContents.tsx, TelopVideo.tsx |

## フェーズ3: 強調演出
**担当: 単体Agent（各スキル順次適用）**

| # | 作業 | スキル | 変更ファイル |
|---|------|--------|-------------|
| 7 | ブラックアウト効果 | blackout-effect | Telop.tsx, TelopVideo.tsx |
| 8 | 金色テロップ | gold-emphasis | Telop.tsx, TelopVideo.tsx |
| 9 | 赤テロップ | red-emphasis | TelopVideo.tsx |
| 10 | CTAバナー | cta-banner | CtaBanner.tsx, TelopVideo.tsx |

## フェーズ4: ビジュアル補助
**担当: 単体Agent or 並列Agent（独立コンポーネントは並列可能）**

| # | 作業 | スキル | 変更ファイル |
|---|------|--------|-------------|
| 11 | 全画面画像 | fullscreen-image | FullscreenImage.tsx, TelopVideo.tsx |
| 12 | 箇条書きリスト | bullet-list | BulletList.tsx, TelopVideo.tsx |
| 13 | ステップフロー | step-flow | StepFlow.tsx, TelopVideo.tsx |
| 14 | ダイアグラム作成 | diagram-illustration | 各Diagram.tsx, TelopVideo.tsx |

**注意**: ダイアグラムは動画内容に応じて都度設計。既存コンポーネントのパターンを参考に新規作成する。

## フェーズ5: 音響
**担当: 単体Agent**

| # | 作業 | スキル | 変更ファイル |
|---|------|--------|-------------|
| 15 | 効果音配置 | sound-effects | TelopVideo.tsx |
| 16 | BGM配置 | bgm | TelopVideo.tsx |

## フェーズ6: 出力
```bash
npx remotion render src/index.ts telop-video out/output.mp4 --codec h264
```

---

# Agent構成ガイド

## 推奨Agent構成（最小）

### Agent 1: テロップ生成Agent
- **入力**: 動画ファイル(.mp4) + 原稿(.docx)
- **スキル**: create-telop
- **出力**: telop-data.ts, Telop.tsx, TelopVideo.tsx, Root.tsx, SRT

### Agent 2: 基本装飾Agent
- **入力**: Agent 1の出力
- **スキル**: keyword-highlight → channel-badge → telop-fade-in → self-intro → video-title → table-of-contents
- **出力**: 基本装飾済みのTelopVideo.tsx + 各コンポーネント

### Agent 3: 強調演出Agent
- **入力**: Agent 2の出力
- **スキル**: blackout-effect → gold-emphasis → red-emphasis → cta-banner
- **出力**: エフェクト付きTelopVideo.tsx

### Agent 4: ビジュアル補助Agent
- **入力**: Agent 3の出力
- **スキル**: fullscreen-image, bullet-list, step-flow, diagram-illustration
- **出力**: ダイアグラム・画像・箇条書き追加済みTelopVideo.tsx
- **備考**: ダイアグラムは動画内容をユーザーと相談しながら設計

### Agent 5: 音響Agent
- **入力**: Agent 4の出力
- **スキル**: sound-effects, bgm
- **出力**: 効果音・BGM配置済みTelopVideo.tsx（完成版）

## 並列化可能な作業
- フェーズ4のダイアグラムコンポーネント作成は互いに独立 → 複数Agentで並列作成可能
- ただしTelopVideo.tsxへの統合は1つのAgentが一括で行うこと（コンフリクト回避）

## 依存関係
```
Agent 1 (テロップ生成)
  ↓
Agent 2 (基本装飾)
  ↓
Agent 3 (強調演出)
  ↓
Agent 4 (ビジュアル補助)
  ↓
Agent 5 (音響)
  ↓
レンダリング出力
```

## コンパイル確認
各フェーズ完了後に必ず実行:
```bash
npx tsc --noEmit
```
