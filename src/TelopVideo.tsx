import React from "react";
import {
  Audio,
  OffthreadVideo,
  Sequence,
  staticFile,
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { Telop } from "./Telop";
import { telopData } from "./telop-data";
import { ChannelBadge } from "./ChannelBadge";
import { SelfIntro } from "./SelfIntro";
import { VideoTitle } from "./VideoTitle";
import { TableOfContents } from "./TableOfContents";
import { CtaBanner } from "./CtaBanner";
import { FullscreenImage } from "./FullscreenImage";
import { BulletList } from "./BulletList";
import { StepFlow } from "./StepFlow";
import { CodeBeforeAfter } from "./CodeBeforeAfter";
import { FileTreeDiagram } from "./FileTreeDiagram";
import { ResponsibilitySplitDiagram } from "./ResponsibilitySplitDiagram";
import { OwnershipDiagram } from "./OwnershipDiagram";
import { SevenPatternChart } from "./SevenPatternChart";
import { LineBadge } from "./LineBadge";
import { SkillSheet } from "./SkillSheet";
import { ClaudeConfig } from "./ClaudeConfig";
import { LikeComment } from "./LikeComment";

const SELF_INTRO_START = 0;
const SELF_INTRO_END = 68;

const TITLE_START = 96;
const TITLE_END = 253;

// --- ブラックアウト区間（グレースケール + ズーム + monoテロップ） ---
const BLACKOUT_SEGMENTS = [
  { start: 1262, end: 1336 },
  { start: 1962, end: 2035 },
  { start: 3760, end: 3867 },
  { start: 4206, end: 4242 },
  { start: 6744, end: 6816 },
  { start: 8715, end: 8744 },
];

// --- 金色テロップ区間（ズーム + goldテロップ） ---
const GOLD_SEGMENTS = [
  { start: 3509, end: 3590 },
  { start: 6864, end: 6944 },
  { start: 8150, end: 8187 },
  { start: 15932, end: 15980 },
  { start: 16558, end: 16607 },
];

// --- 赤テロップ区間（ズーム + redテロップ + 和太鼓SE） ---
const RED_SEGMENTS = [
  { start: 10094, end: 10158 },
  { start: 11169, end: 11202 },
  { start: 12531, end: 12580 },
  { start: 14796, end: 14842 },
];

// --- ツッコミ区間（ブラックアウト + ビシッとツッコミ2 SE） ---
const TSUKKOMI_SEGMENTS = [
  { start: 9835, end: 9908 },   // いやお前、アルファベットのテストかよ
  { start: 10694, end: 10742 }, // 知らん。誰だよ。
  { start: 11485, end: 11568 }, // いや誰だよ。人増えたらファイル増えるの？
  { start: 13100, end: 13131 }, // 読むだけで目が死ぬ
];

// --- CTAバナー表示区間 ---
const CTA_SEGMENTS = [
  { from: 6572, duration: 6688 - 6572 },
  { from: 17510, duration: 17570 - 17510 },
];

// --- 全画面画像の開始フレーム ---
const IMAGE_FRAMES = [2256, 3278];

// --- BulletList効果音タイミング ---
const BULLET_SE_TIMINGS = [
  { base: 2388, appears: [0, 101, 191, 252] },
  { base: 4776, appears: [0, 50, 104] },
  { base: 811, appears: [0, 67, 127] },
  { base: 7392, appears: [0, 76, 123] },
  { base: 7840, appears: [0, 42, 80, 102] },
  { base: 5541, appears: [0, 37, 77] },
  { base: 5779, appears: [0, 30, 60, 90, 120] },
  { base: 17059, appears: [0, 51, 91] },
  { base: 15404, appears: [0, 20, 40, 60, 80, 100, 120] },
];

// --- StepFlow開始フレーム ---
const STEP_FLOW_FRAMES = [6864, 15693];

// --- ダイアグラム開始フレーム ---
const DIAGRAM_FRAMES = [8271, 10643, 11390, 12613, 13131, 13840, 14646, 9458];

// --- BGM設定 ---
const TOTAL_FRAMES = 18407;
const BGM_USABLE_FRAMES = 2654; // ~106.17秒 @25fps（末尾無音除外）
const BGM_VOLUME = 0.1;
const BGM_INITIAL_FADE = 75; // 3秒フェードイン
const BGM_CROSSFADE = 25; // 1秒クロスフェード
const BGM_LOOPS = Math.ceil(TOTAL_FRAMES / BGM_USABLE_FRAMES); // 7ループ

// --- BulletList全SEフレーム（重複除外用） ---
const BULLET_ALL_FRAMES = BULLET_SE_TIMINGS.flatMap((list) =>
  list.appears.map((a) => list.base + a),
);

// --- [yellow:]テロップSE対象フレーム（重複除外済み） ---
const YELLOW_SE_FRAMES = [
  154, 580, 1614, 2104, 4672, 4826, 5072, 5234, 5541, 6020, 6087,
  7190, 9177, 9768, 10365, 10488, 10592, 11348, 12230, 12860, 12954,
  13041, 13338, 13445, 13496, 13784, 14584, 15083, 15250, 15404,
  15736, 17150, 17952, 18002,
].filter(
  (f) =>
    !GOLD_SEGMENTS.some((g) => f >= g.start && f < g.end) &&
    !IMAGE_FRAMES.includes(f) &&
    !BLACKOUT_SEGMENTS.some((b) => f >= b.start && f < b.end) &&
    !RED_SEGMENTS.some((r) => f >= r.start && f < r.end) &&
    !TSUKKOMI_SEGMENTS.some((t) => f >= t.start && f < t.end) &&
    !BULLET_ALL_FRAMES.includes(f),
);

// --- [red:]テロップSE対象フレーム（重複除外済み） ---
const RED_TEXT_SE_FRAMES = [
  1262, 4206, 11742, 14916, 15335,
].filter(
  (f) =>
    !RED_SEGMENTS.some((r) => f >= r.start && f < r.end) &&
    !GOLD_SEGMENTS.some((g) => f >= g.start && f < g.end) &&
    !BLACKOUT_SEGMENTS.some((b) => f >= b.start && f < b.end) &&
    !TSUKKOMI_SEGMENTS.some((t) => f >= t.start && f < t.end) &&
    !IMAGE_FRAMES.includes(f),
);

export const TelopVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // ブラックアウト強度（0=通常, 1=完全ブラックアウト）— ツッコミ区間も含む
  const blackout = Math.max(
    0,
    ...[...BLACKOUT_SEGMENTS, ...TSUKKOMI_SEGMENTS].map((seg) =>
      interpolate(
        frame,
        [seg.start, seg.start + 3, seg.end - 3, seg.end],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      ),
    ),
  );

  // 金色強調の強度
  const gold = Math.max(
    0,
    ...GOLD_SEGMENTS.map((seg) =>
      interpolate(
        frame,
        [seg.start, seg.start + 3, seg.end - 3, seg.end],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      ),
    ),
  );

  // 赤テロップ強調の強度
  const red = Math.max(
    0,
    ...RED_SEGMENTS.map((seg) =>
      interpolate(
        frame,
        [seg.start, seg.start + 3, seg.end - 3, seg.end],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      ),
    ),
  );

  // 強調の合成値（ズーム・バッジ非表示の共通制御）
  const emphasis = Math.max(blackout, gold, red);
  const videoScale = interpolate(emphasis, [0, 1], [1, 1.08]);
  const grayscale = blackout * 100;

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* 1. 元動画（グレースケール + ズームアップ） */}
      <AbsoluteFill
        style={{
          filter: grayscale > 0 ? `grayscale(${grayscale}%)` : undefined,
          transform: emphasis > 0 ? `scale(${videoScale})` : undefined,
          transformOrigin: "center center",
        }}
      >
        <OffthreadVideo src={staticFile("3話目.mp4")} />
      </AbsoluteFill>

      {/* 2. BGM（ループ + クロスフェード） */}
      {Array.from({ length: BGM_LOOPS }, (_, i) => {
        const loopStart = i * BGM_USABLE_FRAMES;
        const remaining = TOTAL_FRAMES - loopStart;
        const dur = Math.min(BGM_USABLE_FRAMES, remaining);
        const isFirst = i === 0;

        return (
          <Sequence key={`bgm-${i}`} from={loopStart} durationInFrames={dur}>
            <Audio
              src={staticFile("preview.mp3")}
              volume={(f) => {
                const fadeInLen = isFirst ? BGM_INITIAL_FADE : BGM_CROSSFADE;
                const fadeIn = interpolate(f, [0, fadeInLen], [0, BGM_VOLUME], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                const fadeOut = interpolate(
                  f,
                  [dur - BGM_CROSSFADE, dur],
                  [BGM_VOLUME, 0],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                );
                return Math.min(fadeIn, fadeOut);
              }}
            />
          </Sequence>
        );
      })}

      {/* 3. チャンネルバッジ（強調中は非表示） */}
      {emphasis < 0.5 && <ChannelBadge />}

      {/* 3. 自己紹介パネル */}
      <Sequence
        from={SELF_INTRO_START}
        durationInFrames={SELF_INTRO_END - SELF_INTRO_START}
      >
        <SelfIntro durationInFrames={SELF_INTRO_END - SELF_INTRO_START} />
      </Sequence>

      {/* 4. 目次パネル */}
      <TableOfContents />

      {/* 5. 動画タイトル */}
      <Sequence
        from={TITLE_START}
        durationInFrames={TITLE_END - TITLE_START}
      >
        <VideoTitle durationInFrames={TITLE_END - TITLE_START} />
      </Sequence>

      {/* 6. CTAバナー */}
      {CTA_SEGMENTS.map((seg, i) => (
        <Sequence
          key={`cta-${i}`}
          from={seg.from}
          durationInFrames={seg.duration}
        >
          <CtaBanner durationInFrames={seg.duration} />
        </Sequence>
      ))}

      {/* ====== 7. 全画面画像 (FullscreenImage) ====== */}

      {/* A-1: 引き継ぎコード開いた瞬間 */}
      <Sequence from={2256} durationInFrames={132}>
        <FullscreenImage src="man_who_wondering.png" durationInFrames={132} zoom="in" />
      </Sequence>

      {/* A-2: 沼って前に進まない */}
      <Sequence from={3278} durationInFrames={130}>
        <FullscreenImage src="man_who_lost.png" durationInFrames={130} zoom="out" />
      </Sequence>

      {/* ====== 8. ダイアグラムコンポーネント群 ====== */}

      {/* D-1: コード命名 Before/After */}
      <Sequence from={8271} durationInFrames={253}>
        <CodeBeforeAfter
          beforeLabel="NG: 変数名が連番"
          afterLabel="OK: 意味のある名前"
          beforeLines={[
            "A = get_data()",
            "B = calc(A)",
            "if C:",
            "    do_something(A, B)",
          ]}
          afterLines={[
            "userId = get_data()",
            "totalPrice = calc(userId)",
            "if isPaid:",
            "    do_something(userId, totalPrice)",
          ]}
          durationInFrames={253}
        />
      </Sequence>

      {/* D-2: 人名変数 Before/After */}
      <Sequence from={10643} durationInFrames={445}>
        <CodeBeforeAfter
          beforeLabel="NG: 人名で命名"
          afterLabel="OK: 状態を表す名前"
          beforeLines={[
            "tanakaFlag = true",
            "yamada = getData()",
          ]}
          afterLines={[
            "isApproved = true",
            "hasPermission = getData()",
            "isEnabled = check()",
          ]}
          durationInFrames={445}
        />
      </Sequence>

      {/* D-3: ファイル増殖図 */}
      <Sequence from={11390} durationInFrames={352}>
        <FileTreeDiagram durationInFrames={352} />
      </Sequence>

      {/* D-4: 責務分離図 */}
      <Sequence from={12613} durationInFrames={222}>
        <ResponsibilitySplitDiagram durationInFrames={222} />
      </Sequence>

      {/* D-5: インデント Before/After */}
      <Sequence from={13131} durationInFrames={365}>
        <CodeBeforeAfter
          beforeLabel="NG: インデント崩壊"
          afterLabel="OK: formatter適用後"
          beforeLines={[
            "if(x){",
            "y=1",
            "    z=2",
            " if(a){",
            "b=3}}",
          ]}
          afterLines={[
            "if (x) {",
            "    y = 1",
            "    z = 2",
            "    if (a) {",
            "        b = 3",
            "    }",
            "}",
          ]}
          durationInFrames={365}
        />
      </Sequence>

      {/* D-6: コメントアウト墓場 */}
      <Sequence from={13840} durationInFrames={272}>
        <CodeBeforeAfter
          beforeLabel="NG: コメントアウト地獄"
          afterLabel="OK: 消してGitに任せる"
          beforeLines={[
            "// old_func()",
            "// temp = calc(x)",
            "// if flag:",
            "//   do_old()",
            "result = process(data)",
            "// another_old()",
            "save(result)",
          ]}
          afterLines={[
            "result = process(data)",
            "save(result)",
            "",
            "// Git に履歴あり \u2713",
          ]}
          durationInFrames={272}
        />
      </Sequence>

      {/* D-7: 属人化→チーム所有 */}
      <Sequence from={14646} durationInFrames={196}>
        <OwnershipDiagram durationInFrames={196} />
      </Sequence>

      {/* D-8: 7パターン一覧表 */}
      <Sequence from={9458} durationInFrames={181}>
        <SevenPatternChart durationInFrames={181} />
      </Sequence>

      {/* ====== 9. 箇条書きリスト (BulletList) ====== */}

      {/* B-9: ヤバいコードの症状4つ */}
      <Sequence from={2388} durationInFrames={336}>
        <BulletList
          items={[
            { text: "変数名がAとかBとか田中とかで意味不明", appearAt: 0 },
            { text: "処理が1ファイルに全部詰め込まれてて数千行", appearAt: 101 },
            { text: "インデントも崩れてて、目が滑る", appearAt: 191 },
            { text: "コメントアウトだらけで、どれが生きてるのか分からない", appearAt: 252 },
          ]}
        />
      </Sequence>

      {/* B-1: 対処3ステップ */}
      <Sequence from={4776} durationInFrames={192}>
        <BulletList
          items={[
            { text: "何がヤバいかを一言で言語化する", appearAt: 0 },
            { text: "最小の修正（命名・分割・整形・削除）を入れる", appearAt: 50 },
            { text: "再発防止を仕組みにする", appearAt: 104 },
          ]}
        />
      </Sequence>

      {/* B-2: よくある質問3つ */}
      <Sequence from={811} durationInFrames={185}>
        <BulletList
          items={[
            { text: "レビューで何を指摘すればいいか分かりません", appearAt: 0 },
            { text: "引き継いだコードが読めなくて詰んでます", appearAt: 67 },
            { text: "どこまで直していいのか判断できません", appearAt: 127 },
          ]}
        />
      </Sequence>

      {/* B-3: 読めない理由3要素 */}
      <Sequence from={7392} durationInFrames={198}>
        <BulletList
          items={[
            { text: "変数名がABC連番", appearAt: 0 },
            { text: "処理が1ファイルに数千行", appearAt: 76 },
            { text: "コメントアウトが画面の8割", appearAt: 123 },
          ]}
        />
      </Sequence>

      {/* B-4: 最小修正の具体手順 */}
      <Sequence from={7840} durationInFrames={182}>
        <BulletList
          items={[
            { text: "まず変数名を直す", appearAt: 0 },
            { text: "処理を関数に分ける", appearAt: 42 },
            { text: "整形を当てる", appearAt: 80 },
            { text: "不要なコメントアウトを消す", appearAt: 102 },
          ]}
        />
      </Sequence>

      {/* B-5: 分類できるようになった例 */}
      <Sequence from={5541} durationInFrames={167}>
        <BulletList
          items={[
            { text: "「これは命名が死んでる」", appearAt: 0 },
            { text: "「これは責務が混ざってる」", appearAt: 37 },
            { text: "「これは履歴管理の失敗」", appearAt: 77 },
          ]}
        />
      </Sequence>

      {/* B-6: 具体的な修正手段リスト */}
      <Sequence from={5779} durationInFrames={148}>
        <BulletList
          items={[
            { text: "変数名を直す", appearAt: 0 },
            { text: "関数を分ける", appearAt: 30 },
            { text: "ファイルを分ける", appearAt: 60 },
            { text: "整形を入れる", appearAt: 90 },
            { text: "消してGitに任せる", appearAt: 120 },
          ]}
        />
      </Sequence>

      {/* LINE登録バッジ（B-7箇条書き開始前に消える） */}
      <Sequence from={16960} durationInFrames={99}>
        <LineBadge durationInFrames={99} />
      </Sequence>

      {/* B-7: LINE壁打ちの3つの整理項目 */}
      <Sequence from={17059} durationInFrames={159}>
        <BulletList
          items={[
            { text: "まず直すべき最小の修正（命名／分割／整形／削除）", appearAt: 0 },
            { text: "どこまで触っていいかの線引き（安全な範囲）", appearAt: 51 },
            { text: "再発防止の仕組み化（formatter／lint／PRルール）", appearAt: 91 },
          ]}
        />
      </Sequence>

      {/* スキルシート */}
      <Sequence from={17314} durationInFrames={47}>
        <SkillSheet durationInFrames={47} />
      </Sequence>

      {/* Claude Code設定ファイル */}
      <Sequence from={17361} durationInFrames={89}>
        <ClaudeConfig durationInFrames={89} />
      </Sequence>

      {/* いいね・コメントアニメーション */}
      <Sequence from={18304} durationInFrames={68}>
        <LikeComment durationInFrames={68} />
      </Sequence>

      {/* B-8: ヤバいコード7選まとめ一覧 */}
      <Sequence from={15404} durationInFrames={140}>
        <BulletList
          items={[
            { text: "変数名が連番", appearAt: 0 },
            { text: "変数名が人名", appearAt: 20 },
            { text: "ファイル名が人名で増殖", appearAt: 40 },
            { text: "全部1ファイルに詰め込み", appearAt: 60 },
            { text: "インデント崩壊", appearAt: 80 },
            { text: "コメントアウトだらけ", appearAt: 100 },
            { text: "コードが人で分割", appearAt: 120 },
          ]}
        />
      </Sequence>

      {/* ====== 10. ステップフロー (StepFlow) ====== */}

      {/* C-1: メインフロー（結論パート） */}
      <Sequence from={6864} durationInFrames={117}>
        <StepFlow
          steps={["ヤバさの型で分類", "最小の修正を入れる", "仕組み化"]}
          durationInFrames={117}
        />
      </Sequence>

      {/* C-3: まとめフロー */}
      <Sequence from={15693} durationInFrames={166}>
        <StepFlow
          steps={["型で分類", "命名・分割・整形・削除", "読めるようになる"]}
          durationInFrames={166}
        />
      </Sequence>

      {/* ====== 12. 効果音（SE）群 ====== */}

      {/* SE: 自己紹介パネル */}
      <Sequence from={0} durationInFrames={30}>
        <Audio src={staticFile("決定ボタンを押す1.mp3")} volume={0.8} />
      </Sequence>

      {/* SE: タイトル表示 */}
      <Sequence from={TITLE_START} durationInFrames={30}>
        <Audio src={staticFile("和太鼓でドドン.mp3")} volume={0.8} />
      </Sequence>

      {/* SE: ブラックアウト（間抜け4） */}
      {BLACKOUT_SEGMENTS.map((seg, i) => (
        <Sequence key={`se-blackout-${i}`} from={seg.start} durationInFrames={30}>
          <Audio src={staticFile("間抜け4.mp3")} volume={0.8} />
        </Sequence>
      ))}

      {/* SE: ツッコミ（ビシッとツッコミ2） */}
      {TSUKKOMI_SEGMENTS.map((seg, i) => (
        <Sequence key={`se-tsukkomi-${i}`} from={seg.start} durationInFrames={30}>
          <Audio src={staticFile("ビシッとツッコミ2 .mp3")} volume={0.8} />
        </Sequence>
      ))}

      {/* SE: 金色テロップ（決定ボタンを押す3） */}
      {GOLD_SEGMENTS.map((seg, i) => (
        <Sequence key={`se-gold-${i}`} from={seg.start} durationInFrames={30}>
          <Audio src={staticFile("決定ボタンを押す3.mp3")} volume={0.8} />
        </Sequence>
      ))}

      {/* SE: 赤テロップ（和太鼓でドドン） */}
      {RED_SEGMENTS.map((seg, i) => (
        <Sequence key={`se-red-${i}`} from={seg.start} durationInFrames={30}>
          <Audio src={staticFile("和太鼓でドドン.mp3")} volume={0.8} />
        </Sequence>
      ))}

      {/* SE: 全画面画像（決定ボタンを押す1） */}
      {IMAGE_FRAMES.map((f, i) => (
        <Sequence key={`se-img-${i}`} from={f} durationInFrames={30}>
          <Audio src={staticFile("決定ボタンを押す1.mp3")} volume={0.8} />
        </Sequence>
      ))}

      {/* SE: LINE登録バッジ（決定ボタンを押す1） */}
      <Sequence from={16960} durationInFrames={30}>
        <Audio src={staticFile("決定ボタンを押す1.mp3")} volume={0.8} />
      </Sequence>

      {/* SE: スキルシート（決定ボタンを押す1） */}
      <Sequence from={17314} durationInFrames={30}>
        <Audio src={staticFile("決定ボタンを押す1.mp3")} volume={0.8} />
      </Sequence>

      {/* SE: Claude Code設定ファイル（決定ボタンを押す1） */}
      <Sequence from={17361} durationInFrames={30}>
        <Audio src={staticFile("決定ボタンを押す1.mp3")} volume={0.8} />
      </Sequence>

      {/* SE: いいね・コメント（決定ボタンを押す1） */}
      <Sequence from={18304} durationInFrames={30}>
        <Audio src={staticFile("決定ボタンを押す1.mp3")} volume={0.8} />
      </Sequence>

      {/* SE: CTAバナー（決定ボタンを押す3） */}
      {CTA_SEGMENTS.map((seg, i) => (
        <Sequence key={`se-cta-${i}`} from={seg.from} durationInFrames={30}>
          <Audio src={staticFile("決定ボタンを押す3.mp3")} volume={0.8} />
        </Sequence>
      ))}

      {/* SE: BulletList各項目出現（決定ボタンを押す1） */}
      {BULLET_SE_TIMINGS.flatMap((list, li) =>
        list.appears.map((a, ai) => (
          <Sequence key={`se-bullet-${li}-${ai}`} from={list.base + a} durationInFrames={30}>
            <Audio src={staticFile("決定ボタンを押す1.mp3")} volume={0.8} />
          </Sequence>
        )),
      )}

      {/* SE: StepFlow各ステップ（決定ボタンを押す3） — GOLD区間と重複するフレームは除外 */}
      {STEP_FLOW_FRAMES.filter(
        (f) => !GOLD_SEGMENTS.some((g) => f >= g.start && f < g.end),
      ).map((f, i) => (
        <Sequence key={`se-step-${i}`} from={f} durationInFrames={30}>
          <Audio src={staticFile("決定ボタンを押す3.mp3")} volume={0.8} />
        </Sequence>
      ))}

      {/* SE: ダイアグラム表示（決定ボタンを押す3） */}
      {DIAGRAM_FRAMES.map((f, i) => (
        <Sequence key={`se-diagram-${i}`} from={f} durationInFrames={30}>
          <Audio src={staticFile("決定ボタンを押す3.mp3")} volume={0.8} />
        </Sequence>
      ))}

      {/* SE: [yellow:]テロップ（決定ボタンを押す3）— 重複除外済み */}
      {YELLOW_SE_FRAMES.map((f, i) => (
        <Sequence key={`se-yellow-${i}`} from={f} durationInFrames={30}>
          <Audio src={staticFile("決定ボタンを押す3.mp3")} volume={0.8} />
        </Sequence>
      ))}

      {/* SE: [red:]テロップ（決定ボタンを押す3）— 重複除外済み */}
      {RED_TEXT_SE_FRAMES.map((f, i) => (
        <Sequence key={`se-redtext-${i}`} from={f} durationInFrames={30}>
          <Audio src={staticFile("決定ボタンを押す3.mp3")} volume={0.8} />
        </Sequence>
      ))}

      {/* ====== 13. テロップ（タイトル区間を除外 + variant判定）— 最前面 ====== */}
      <AbsoluteFill>
        {telopData
          .filter(
            (seg) =>
              seg.startFrame < TITLE_START || seg.startFrame >= TITLE_END,
          )
          .map((segment, i) => {
            const isRed = RED_SEGMENTS.some(
              (seg) =>
                segment.startFrame < seg.end &&
                segment.endFrame > seg.start,
            );
            const isGold = GOLD_SEGMENTS.some(
              (seg) =>
                segment.startFrame < seg.end &&
                segment.endFrame > seg.start,
            );
            const isMono = [...BLACKOUT_SEGMENTS, ...TSUKKOMI_SEGMENTS].some(
              (seg) =>
                segment.startFrame < seg.end &&
                segment.endFrame > seg.start,
            );
            const variant = isRed
              ? "red" as const
              : isGold
                ? "gold" as const
                : isMono
                  ? "mono" as const
                  : "default" as const;

            return (
              <Sequence
                key={i}
                from={segment.startFrame}
                durationInFrames={segment.endFrame - segment.startFrame}
              >
                <Telop text={segment.text} variant={variant} />
              </Sequence>
            );
          })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
