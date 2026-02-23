# テロップ作成スキル

動画のスクリプト（docx）からフルテロップを生成し、SRTファイル（CapCutインポート用）を出力するスキル。

## 入力

- **動画ファイル**: `public/` 配下のMP4ファイル
- **スクリプト**: `public/` 配下のdocxファイル（パラグラフごとに1テロップ分のテキストが書かれている）
- **テロップデザイン参考画像**（任意）: `public/` 配下のPNG

## 処理手順

### Step 1: 動画情報の取得

```bash
ffprobe -v quiet -print_format json -show_format -show_streams "動画.mp4"
```

- 解像度（width x height）
- FPS
- 総尺（duration）

### Step 2: Whisperで音声認識（セグメント＋単語レベルタイムスタンプ）

1. ffmpegで音声を抽出:
```bash
ffmpeg -y -i "動画.mp4" -vn -acodec pcm_s16le -ar 16000 -ac 1 /tmp/audio.wav
```

2. Python venvにWhisperをインストール（初回のみ）:
```bash
python3 -m venv /tmp/whisper-env
source /tmp/whisper-env/bin/activate
pip install openai-whisper
```

3. Whisperで**セグメントレベル**と**単語レベル**の両方のタイムスタンプを取得:
```python
import whisper, json
model = whisper.load_model('medium')
result = model.transcribe('/tmp/audio.wav', language='ja', word_timestamps=True)

# セグメントレベル（アンカー用）
segments = []
for seg in result['segments']:
    segments.append({'start': seg['start'], 'end': seg['end'], 'text': seg['text'].strip()})

# 単語レベル（精密タイミング用）
words = []
for seg in result['segments']:
    if 'words' in seg:
        for w in seg['words']:
            words.append({'word': w['word'].strip(), 'start': w['start'], 'end': w['end']})
```

4. `/tmp/whisper_segments.json` と `/tmp/whisper_words.json` に保存

### Step 3: docxからパラグラフ単位でテロップテキストを抽出

```python
import zipfile, xml.etree.ElementTree as ET

with zipfile.ZipFile('スクリプト.docx') as z:
    with z.open('word/document.xml') as f:
        tree = ET.parse(f)
        root = tree.getroot()
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        paragraphs = []
        for p in root.findall('.//w:p', ns):
            texts = [t.text for t in p.findall('.//w:t', ns) if t.text]
            if texts:
                paragraphs.append(''.join(texts))
```

**重要**: docxのパラグラフ区切りをそのままテロップの区切りとして使う。自分で分割ロジックを作らない。

- 空のパラグラフはスキップ
- `"` `"` `"` はストリップする
- `"` だけの行はスキップ
- テロップテキストのクリーニング（抽出後に必ず実施）:
  - `*`（アスタリスク）を全て除去（docx内のMarkdown太字記法 `**...**` の残り）
  - `\u201c`（左ダブルクォーテーション）、`\u201d`（右ダブルクォーテーション）を全て除去
  - 各行末の`、`と`。`を除去（テロップでは句読点で終わらせない）

### Step 4: タイミング割り当て（2段階ハイブリッド方式）

タイミングは必ず以下の2段階で行う。単純な文字比率マッピングは絶対に使わないこと。

#### Phase 1: アンカーベースの粗タイミング（Whisperセグメント単位）

Whisperの各セグメントテキストを元テキスト内で順番にfuzzy matchし、アンカーポイント（元テキストの文字位置 ↔ 時刻）を構築する。

```python
from difflib import SequenceMatcher

anchor_points = [(0, 0.0)]  # (orig_char_pos, time)
orig_search_pos = 0

for seg in whisper_segs:
    seg_clean = re.sub(r'[\s　]', '', seg['text'].strip())
    seg_len = len(seg_clean)
    if seg_len == 0: continue

    search_start = max(0, orig_search_pos - 20)
    search_end = min(len(orig_clean), orig_search_pos + max(seg_len * 3, 100))
    search_region = orig_clean[search_start:search_end]

    check_len = min(seg_len + 10, len(seg_clean))
    seg_prefix = seg_clean[:check_len]
    best_ratio, best_pos = 0, orig_search_pos
    for offset in range(min(len(search_region), max(seg_len*3, 100))):
        candidate = search_region[offset:offset + check_len]
        if not candidate: continue
        ratio = SequenceMatcher(None, seg_prefix, candidate).ratio()
        if ratio > best_ratio:
            best_ratio, best_pos = ratio, search_start + offset

    anchor_points.append((best_pos, seg['start']))
    anchor_points.append((best_pos + seg_len, seg['end']))
    orig_search_pos = best_pos + seg_len

anchor_points.append((len(orig_clean), whisper_segs[-1]['end']))
```

アンカーポイント間を線形補間して、任意の文字位置の粗タイミングを取得する関数 `get_coarse_time(pos)` を作る。

#### Phase 2: Whisper単語への精密マッチング

Phase 1で得た粗タイミングを「期待時刻」として、その前後±3秒の範囲でWhisper単語リストを探索し、テロップ冒頭テキストと最もマッチする単語の `start` 時刻をテロップの表示開始時刻にする。

```python
word_list = [(w['start'], w['end'], w['word'].strip()) for w in whisper_words if w['word'].strip()]

def find_word_at_time(target_time, telop_prefix, search_window=3.0):
    """target_time前後のWhisper単語からtelop_prefixに最もマッチするものを探す"""
    t_start = max(0, target_time - search_window)
    t_end = target_time + search_window

    # 時間範囲内の単語を収集
    candidates = [(i, ws, wt) for i, (ws, we, wt) in enumerate(word_list)
                  if t_start <= ws <= t_end]

    prefix_clean = re.sub(r'[\s　""\*「」（）、。！？]', '', telop_prefix)[:8]
    if not prefix_clean or not candidates:
        return target_time

    best_score, best_time = -1, target_time
    for idx, ws, wt in candidates:
        # この単語から数単語分の文字列を構築
        excerpt = ''
        for j in range(idx, min(idx + 10, len(word_list))):
            excerpt += word_list[j][2]
            if len(excerpt) >= len(prefix_clean): break
        excerpt_clean = re.sub(r'[\s　]', '', excerpt)[:len(prefix_clean)]
        if not excerpt_clean: continue

        score = SequenceMatcher(None, prefix_clean, excerpt_clean).ratio()
        time_penalty = abs(ws - target_time) / search_window * 0.15
        adjusted = score - time_penalty

        if adjusted > best_score:
            best_score, best_time = adjusted, ws

    return best_time
```

各テロップに対して:
```python
cum_pos = 0
for text in telop_texts:
    clen = len(re.sub(r'[\s　""\*]', '', text))
    coarse_time = get_coarse_time(cum_pos)          # Phase 1: 粗タイミング
    precise_time = find_word_at_time(coarse_time, text)  # Phase 2: 精密マッチング
    # precise_timeをstartFrameに使う
    cum_pos += clen
```

終了時刻は「次のテロップの開始時刻」を使う（最後のテロップは最後のWhisper単語の終了時刻）。

**なぜ2段階が必要か:**
- Phase 1のみ（アンカーベース）: セグメント間の補間でずれが出る。テロップの話し始めと表示タイミングが数百ミリ秒〜1秒ずれる。
- Phase 2のみ（単語マッチング）: 検索範囲が広すぎると誤マッチし、動画後半で完全にずれる。
- ハイブリッド: Phase 1で大まかな位置を特定 → Phase 2で発話開始の瞬間を精密に捕捉。

### Step 5: テロップ内の改行を挿入

1行あたりの最大文字数（`width * 0.9 / fontSize` で計算、1920px/72px なら約23文字）を超えるテロップに改行 `\n` を挿入する。

ルール:
- 「」の内側では改行しない（find_quote_rangesで引用範囲を検出し、その中の位置はスキップ）
- 改行位置の優先順位:
  1. `」` `）` の直後 / `「` `（` の直前
  2. `、` `。` `！` `？` の直後
  3. 助詞（は/が/を/に/で/と/も）の直後（次の文字が活用語尾でない場合）
  4. 接続助詞（て/で）の直後（次の文字が活用語尾でない場合）
- テキストの中央付近（30%〜70%の範囲）で均等に分割することを優先
- 活用語尾（る/い/た/ん/す/く/つ/う/っ）の前では絶対に改行しない
- 改行後の各行が3文字以上あることを確認

### Step 6: SRTファイルとして出力

```
1
00:00:00,000 --> 00:00:01,840
はいどうもこんにちはトールです

2
00:00:01,840 --> 00:00:03,400
ということで今回は
```

出力先: `out/{動画名}_テロップ.srt`
SRTはUTF-8で保存。改行 `\n` はSRT内でそのまま改行として記述。

### Step 7（任意）: Remotionコンポジションも生成

必要に応じて以下も生成する:
- `src/telop-data.ts` - TypeScript形式のテロップデータ（`\n`は`\\n`としてエスケープ）
- `src/Telop.tsx` - テロップコンポーネント（`\n`を`<br/>`に変換して描画）
- `src/TelopVideo.tsx` - 動画+テロップオーバーレイコンポジション（AbsoluteFillで動画層とテロップ層を分離）
- `src/Root.tsx` にコンポジションを登録

## テロップデザインの基本スタイル（normalデザイン）

```css
fontSize: 72px
fontWeight: 900
fontFamily: 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif
color: #0a3dba (濃い青)
WebkitTextStroke: 5px white (白縁取り)
paintOrder: stroke fill
textAlign: center
lineHeight: 1.35
```

## 過去の調整で学んだ注意事項

### テロップの区切り
- **必ずdocxのパラグラフ構造に従う**。自前の文分割ロジック（句読点で分割、文字数で分割等）は作らない
- docxの筆者が意図した区切りがそのままテロップの単位

### タイミングの精度
- 単純な文字比率マッピング（`pos / total_chars * total_time`）は**使用禁止**。Whisperと元テキストの文字数差（漢字↔カタカナ、句読点の有無等）によりドリフトが蓄積し、動画後半で数秒〜十数秒ずれる
- 必ず2段階ハイブリッド方式（Step 4参照）を使用する
- グローバルオフセット（全体を一律にN秒ずらす）は効果が薄い。部分的にずれが改善しても他の部分が悪化する

### 改行の品質
- CSSのtext-wrapに任せると意味の変なところで改行される。必ず明示的に`\n`を挿入する
- 動詞の活用形の途中で改行しない（「思って\nる」「知っても\nらう」はNG）
- 「」の途中で改行しない（「え、マジ？\n」はNG、「え、マジ？」\nはOK）

### Remotionコンポジションの構造
- TelopVideo.tsxでは動画層とテロップ層をそれぞれAbsoluteFillで包む（そうしないとテロップが動画の下に隠れる）
```tsx
<AbsoluteFill>
  <AbsoluteFill>
    <OffthreadVideo src={staticFile("動画.mp4")} />
  </AbsoluteFill>
  <AbsoluteFill>
    {/* テロップSequence群 */}
  </AbsoluteFill>
</AbsoluteFill>
```

### テロップの行数制限
- 各テロップは**最大2行まで**（`\n`は1つまで）
- 改行挿入時に2行を超えないように制御する
- 長いテキストでも無理に3行以上にせず、2行に収める

### テロップのタイミング重複防止
- 各テロップの`endFrame`は次のテロップの`startFrame`以下にする（`endFrame <= next_startFrame`）
- 2つのテロップが同時に画面に表示されることがあってはならない
- タイミング割り当て後に必ず重複チェックを行い、重複があれば前のテロップの`endFrame`を次の`startFrame`にクランプする
- SRTファイルも同様に、前のテロップの終了時刻が次の開始時刻を超えないようにする

### Whisperの特性
- Whisper mediumモデルを使用（精度と速度のバランス）
- `word_timestamps=True` で単語レベルのタイムスタンプを取得（セグメントレベルだけでは精度不足）
- セグメントレベルとワードレベルの両方を保存し、それぞれの用途で使い分ける
- 最小表示時間は12フレーム（0.48秒）を確保
