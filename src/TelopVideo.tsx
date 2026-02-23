import React from "react";
import {
  OffthreadVideo,
  Audio,
  Sequence,
  staticFile,
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { Telop } from "./Telop";
import { ChannelBadge } from "./ChannelBadge";
import { TableOfContents } from "./TableOfContents";
import { CtaBanner } from "./CtaBanner";
import { SelfIntro } from "./SelfIntro";
import { VideoTitle } from "./VideoTitle";
import { FullscreenImage } from "./FullscreenImage";
import { StepFlow } from "./StepFlow";
import { BulletList } from "./BulletList";
import { ComparisonChart } from "./ComparisonChart";
import { LangFlowDiagram } from "./LangFlowDiagram";
import { JsonMismatch } from "./JsonMismatch";
import { KeyMismatch } from "./KeyMismatch";
import { TypeMismatch } from "./TypeMismatch";
import { EmptyString } from "./EmptyString";
import { MissingField } from "./MissingField";
import { DataClassDiagram } from "./DataClassDiagram";
import { SchemaFlow } from "./SchemaFlow";
import { WinPatternFlow } from "./WinPatternFlow";
import { LineBadge } from "./LineBadge";
import { SkillSheet } from "./SkillSheet";
import { ClaudeConfig } from "./ClaudeConfig";
import { LikeComment } from "./LikeComment";
import { RepeatLines } from "./RepeatLines";
import { SlowBar } from "./SlowBar";
import { telopData } from "./telop-data";

const CTA_SEGMENTS = [
  { from: 7264, duration: 55 },
  { from: 18696, duration: 64 },
];

const TITLE_START = 85;
const TITLE_END = 179;

const STEPFLOW_START = 9714;
const STEPFLOW_END = 9794;

const LINE_BULLET_START = 18259;
const LINE_BULLET_END = 18334;

const BLACKOUT_SEGMENTS = [
  { start: 1532, end: 1588 },
  { start: 2116, end: 2183 },
  { start: 2829, end: 2878 },
  { start: 3570, end: 3637 },
  { start: 4200, end: 4299 },
  { start: 5848, end: 5900 },
  { start: 9632, end: 9677 },
  { start: 12330, end: 12376 },
  { start: 14760, end: 14826 },
  { start: 17450, end: 17506 },
];

const GOLD_SEGMENTS = [
  { start: 2388, end: 2492 },
  { start: 3202, end: 3276 },
  { start: 4408, end: 4466 },
  { start: 4536, end: 4608 },
  { start: 5458, end: 5544 },
  { start: 7746, end: 7806 },
  { start: 8508, end: 8590 },
  { start: 12512, end: 12612 },
  { start: 13093, end: 13182 },
  { start: 14922, end: 15001 },
  { start: 16738, end: 16777 },
  { start: 17597, end: 17637 },
  { start: 17164, end: 17206 },
  { start: 7376, end: 7464 },
];

const RED_SEGMENTS = [
  { start: 8274, end: 8320 },
  { start: 10508, end: 10538 },
  { start: 12786, end: 12836 },
];

const IMAGE_FRAMES = [
  572, 616, 794, 862, 942, 1078, 1158, 3776, 4102, 4988, 5154, 5718,
  6483, 6605, 6682, 6992, 7062, 7514, 7607, 8103, 8854, 8920, 9365,
  11252, 11339, 13006, 17692,
];

// BGM設定
const BGM_USABLE_FRAMES = 2654; // ~106.17秒 (末尾無音カット済み)
const BGM_VOLUME = 0.1;
const BGM_INITIAL_FADE = 75; // 3秒かけて入る
const BGM_CROSSFADE = 25; // ループ繋ぎ目の1秒フェード
const TOTAL_FRAMES = 19616;
const BGM_LOOPS = Math.ceil(TOTAL_FRAMES / BGM_USABLE_FRAMES);

export const TelopVideo: React.FC = () => {
  const frame = useCurrentFrame();

  const blackout = Math.max(
    ...BLACKOUT_SEGMENTS.map((seg) =>
      interpolate(
        frame,
        [seg.start, seg.start + 3, seg.end - 3, seg.end],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      ),
    ),
  );

  const gold = Math.max(
    ...GOLD_SEGMENTS.map((seg) =>
      interpolate(
        frame,
        [seg.start, seg.start + 3, seg.end - 3, seg.end],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      ),
    ),
  );

  const red = Math.max(
    ...RED_SEGMENTS.map((seg) =>
      interpolate(
        frame,
        [seg.start, seg.start + 3, seg.end - 3, seg.end],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      ),
    ),
  );

  const emphasis = Math.max(blackout, gold, red);
  const videoScale = interpolate(emphasis, [0, 1], [1, 1.08]);
  const grayscale = blackout * 100;

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <AbsoluteFill
        style={{
          filter: grayscale > 0 ? `grayscale(${grayscale}%)` : undefined,
          transform: emphasis > 0 ? `scale(${videoScale})` : undefined,
          transformOrigin: "center center",
        }}
      >
        <OffthreadVideo src={staticFile("2話目.mp4")} />
      </AbsoluteFill>
      {/* BGM */}
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
      {emphasis < 0.5 && <ChannelBadge />}
      <Sequence from={0} durationInFrames={46}>
        <SelfIntro durationInFrames={46} />
      </Sequence>
      <Sequence from={0} durationInFrames={30}>
        <Audio src={staticFile("決定ボタンを押す1.mp3")} volume={0.8} />
      </Sequence>
      <TableOfContents />
      {CTA_SEGMENTS.map((seg, i) => (
        <Sequence key={`cta-${i}`} from={seg.from} durationInFrames={seg.duration}>
          <CtaBanner durationInFrames={seg.duration} />
        </Sequence>
      ))}
      {CTA_SEGMENTS.map((seg, i) => (
        <Sequence key={`cta-se-${i}`} from={seg.from} durationInFrames={30}>
          <Audio src={staticFile("決定ボタンを押す3.mp3")} volume={0.8} />
        </Sequence>
      ))}
      <Sequence from={572} durationInFrames={44}>
        <FullscreenImage src="python.png" durationInFrames={44} />
      </Sequence>
      <Sequence from={616} durationInFrames={36}>
        <FullscreenImage src="Go.png" durationInFrames={36} zoom="out" />
      </Sequence>
      <Sequence from={794} durationInFrames={68}>
        <FullscreenImage src="man_who_questioning.png" durationInFrames={68} zoom="out" />
      </Sequence>
      <Sequence from={862} durationInFrames={80}>
        <FullscreenImage src="man_who_wondering.png" durationInFrames={80} zoom="in" />
      </Sequence>
      <Sequence from={942} durationInFrames={72}>
        <FullscreenImage src="man_who_dont_know_what_should_you_study.png" durationInFrames={72} zoom="out" />
      </Sequence>
      <Sequence from={1078} durationInFrames={80}>
        <FullscreenImage src="Language_shift.png" durationInFrames={80} zoom="in" />
      </Sequence>
      <Sequence from={1158} durationInFrames={66}>
        <FullscreenImage src="python_is_dead?.png" durationInFrames={66} zoom="out" />
      </Sequence>
      <Sequence from={3776} durationInFrames={34}>
        <FullscreenImage src="man_who_lost.png" durationInFrames={34} zoom="out" />
      </Sequence>
      <Sequence from={4988} durationInFrames={102}>
        <FullscreenImage src="python.png" durationInFrames={102} zoom="in" />
      </Sequence>
      <Sequence from={5154} durationInFrames={77}>
        <FullscreenImage src="Go.png" durationInFrames={77} zoom="out" />
      </Sequence>
      <Sequence from={5718} durationInFrames={63}>
        <FullscreenImage src="AI_develop.png" durationInFrames={63} zoom="in" />
      </Sequence>
      <Sequence from={6483} durationInFrames={53}>
        <FullscreenImage src="AI_developer.png" durationInFrames={53} zoom="in" />
      </Sequence>
      <Sequence from={6605} durationInFrames={77}>
        <FullscreenImage src="python.png" durationInFrames={77} zoom="out" />
      </Sequence>
      <Sequence from={6682} durationInFrames={81}>
        <FullscreenImage src="Go.png" durationInFrames={81} zoom="in" />
      </Sequence>
      <Sequence from={6992} durationInFrames={70}>
        <FullscreenImage src="path_ai_engineer.png" durationInFrames={70} zoom="in" />
      </Sequence>
      <Sequence from={7062} durationInFrames={98}>
        <FullscreenImage src="python_to_go.png" durationInFrames={98} zoom="out" />
      </Sequence>
      <Sequence from={7514} durationInFrames={79}>
        <FullscreenImage src="python.png" durationInFrames={79} zoom="in" />
      </Sequence>
      <Sequence from={7607} durationInFrames={72}>
        <FullscreenImage src="Go.png" durationInFrames={72} zoom="out" />
      </Sequence>
      <Sequence from={8103} durationInFrames={52}>
        <FullscreenImage src="Go.png" durationInFrames={52} zoom="out" />
      </Sequence>
      <Sequence from={8854} durationInFrames={66}>
        <FullscreenImage src="python.png" durationInFrames={66} zoom="out" />
      </Sequence>
      <Sequence from={8920} durationInFrames={65}>
        <FullscreenImage src="Go.png" durationInFrames={65} zoom="in" />
      </Sequence>
      <Sequence from={9365} durationInFrames={83}>
        <FullscreenImage src="kyujin_db.png" durationInFrames={83} zoom="in" />
      </Sequence>
      <Sequence from={10258} durationInFrames={57}>
        <FullscreenImage src="man_who_lost.png" durationInFrames={57} zoom="in" />
      </Sequence>
      <Sequence from={4102} durationInFrames={52}>
        <FullscreenImage src="never_arrived.png" durationInFrames={52} zoom="in" />
      </Sequence>
      <Sequence from={11252} durationInFrames={42}>
        <FullscreenImage src="python.png" durationInFrames={42} zoom="out" />
      </Sequence>
      <Sequence from={11339} durationInFrames={61}>
        <FullscreenImage src="AI_develop.png" durationInFrames={61} zoom="in" />
      </Sequence>
      <Sequence from={13006} durationInFrames={50}>
        <FullscreenImage src="python.png" durationInFrames={50} zoom="out" />
      </Sequence>
      <Sequence from={17692} durationInFrames={65}>
        <FullscreenImage src="python.png" durationInFrames={65} zoom="in" />
      </Sequence>
      <Sequence from={18156} durationInFrames={58}>
        <LineBadge durationInFrames={58} />
      </Sequence>
      <Sequence from={18478} durationInFrames={56}>
        <SkillSheet durationInFrames={56} />
      </Sequence>
      <Sequence from={18534} durationInFrames={102}>
        <ClaudeConfig durationInFrames={102} />
      </Sequence>
      <Sequence from={19417} durationInFrames={69}>
        <LikeComment durationInFrames={69} />
      </Sequence>
      <Sequence from={LINE_BULLET_START} durationInFrames={LINE_BULLET_END - LINE_BULLET_START}>
        <BulletList
          items={[
            { text: "次に作るべきもの（最短の1個）", appearAt: 0 },
            { text: "学ぶべき順番（Python→どれ？）", appearAt: 27 },
            { text: "今ハマってる原因（どこで詰んでるか）", appearAt: 45 },
          ]}
        />
      </Sequence>
      <Sequence from={13193} durationInFrames={103}>
        <LangFlowDiagram durationInFrames={103} />
      </Sequence>
      <Sequence from={13752} durationInFrames={234}>
        <BulletList
          items={[
            { text: "求人の職種", appearAt: 0 },
            { text: "勤務地・給与", appearAt: 20 },
            { text: "必須条件・歓迎条件", appearAt: 45 },
            { text: "会社の強み", appearAt: 70 },
            { text: "過去の反応データ", appearAt: 135 },
            { text: "似た求人の勝ちパターン", appearAt: 170 },
          ]}
        />
      </Sequence>
      <Sequence from={14330} durationInFrames={71}>
        <JsonMismatch durationInFrames={71} />
      </Sequence>
      <Sequence from={14401} durationInFrames={103}>
        <KeyMismatch durationInFrames={103} />
      </Sequence>
      <Sequence from={14504} durationInFrames={53}>
        <TypeMismatch durationInFrames={53} />
      </Sequence>
      <Sequence from={14557} durationInFrames={36}>
        <MissingField durationInFrames={36} />
      </Sequence>
      <Sequence from={14593} durationInFrames={23}>
        <EmptyString durationInFrames={23} />
      </Sequence>
      <Sequence from={15012} durationInFrames={137}>
        <DataClassDiagram durationInFrames={137} />
      </Sequence>
      <Sequence from={15149} durationInFrames={245}>
        <SchemaFlow durationInFrames={245} />
      </Sequence>
      <Sequence from={15458} durationInFrames={259}>
        <BulletList
          items={[
            { text: "バグの場所が特定できる", appearAt: 0 },
            { text: "モデル/データ/パースの切り分け", appearAt: 44 },
            { text: "期待する形が明確", appearAt: 136 },
            { text: "修正がめちゃくちゃラクに", appearAt: 186 },
          ]}
        />
      </Sequence>
      <Sequence from={16839} durationInFrames={125}>
        <WinPatternFlow durationInFrames={125} />
      </Sequence>
      <Sequence from={16146} durationInFrames={573}>
        <BulletList
          items={[
            { text: "①入口でGo → 検証が進まない", appearAt: 0 },
            { text: "②PoCだけ → ログ監視弱く半日溶ける", appearAt: 143 },
            { text: "③AI入出力の形が揺れる → 型で詰む", appearAt: 382 },
            { text: "→ PythonでもDataClassで固められる", appearAt: 479 },
          ]}
        />
      </Sequence>
      <Sequence from={14041} durationInFrames={169}>
        <BulletList
          items={[
            { text: "タイトル", appearAt: 0 },
            { text: "導入", appearAt: 18 },
            { text: "仕事内容", appearAt: 36 },
            { text: "魅力", appearAt: 54 },
            { text: "応募条件", appearAt: 72 },
            { text: "訴求ポイント", appearAt: 90 },
            { text: "注意事項", appearAt: 105 },
          ]}
        />
      </Sequence>
      <Sequence from={11536} durationInFrames={78}>
        <ComparisonChart
          rows={[
            { label: "求人A", result: "いい感じ", status: "ok" },
            { label: "求人B", result: "いい感じ", status: "ok" },
            { label: "求人C", result: "スカスカ", status: "ng" },
          ]}
          durationInFrames={78}
        />
      </Sequence>
      <Sequence from={11614} durationInFrames={55}>
        <RepeatLines durationInFrames={55} />
      </Sequence>
      <Sequence from={11669} durationInFrames={51}>
        <SlowBar durationInFrames={51} />
      </Sequence>
      <Sequence from={12630} durationInFrames={110}>
        <BulletList
          items={[
            { text: "同時アクセスが来る", appearAt: 0 },
            { text: "キューが溜まる", appearAt: 28 },
            { text: "リトライが走る", appearAt: 49 },
            { text: "タイムアウトが発生する", appearAt: 76 },
          ]}
        />
      </Sequence>
      <Sequence from={11900} durationInFrames={197}>
        <BulletList
          items={[
            { text: "ログが薄い", appearAt: 0 },
            { text: "どの求人データを入れたか", appearAt: 23 },
            { text: "どのプロンプト・モデル・パラメータか", appearAt: 97 },
            { text: "何秒かかって、どこで遅くなってるのか", appearAt: 138 },
          ]}
        />
      </Sequence>
      <Sequence from={12148} durationInFrames={114}>
        <BulletList
          items={[
            { text: "エラーなのか", appearAt: 0 },
            { text: "タイムアウトなのか", appearAt: 22 },
            { text: "外部APIの遅延なのか", appearAt: 46 },
            { text: "DBなのか", appearAt: 68 },
          ]}
        />
      </Sequence>
      {/* BulletList各項目の効果音 */}
      {[
        { base: 6113, appears: [0, 18, 36, 54, 72] },
        { base: 8190, appears: [0, 14, 30, 46, 60] },
        { base: 9984, appears: [0, 27, 62, 107, 132, 164] },
        { base: 10626, appears: [0, 42, 81] },
        { base: 11900, appears: [0, 23, 97, 138] },
        { base: 12148, appears: [0, 22, 46, 68] },
        { base: 12630, appears: [0, 28, 49, 76] },
        { base: 13752, appears: [0, 20, 45, 70, 135, 170] },
        { base: 14041, appears: [0, 18, 36, 54, 72, 90, 105] },
        { base: 15458, appears: [0, 44, 136, 186] },
        { base: 16146, appears: [0, 143, 382, 479] },
        { base: LINE_BULLET_START, appears: [0, 27, 45] },
      ].flatMap((list, li) =>
        list.appears.map((a, ai) => (
          <Sequence key={`bullet-se-${li}-${ai}`} from={list.base + a} durationInFrames={30}>
            <Audio src={staticFile("決定ボタンを押す1.mp3")} volume={0.8} />
          </Sequence>
        )),
      )}
      {/* StepFlow各ステップの効果音 */}
      {[0, 17, 34, 51].map((offset, i) => (
        <Sequence key={`step-se-${i}`} from={STEPFLOW_START + offset} durationInFrames={30}>
          <Audio src={staticFile("決定ボタンを押す3.mp3")} volume={0.8} />
        </Sequence>
      ))}
      {/* イメージ図の効果音 */}
      {[11536, 11614, 11669, 13193, 14330, 14401, 14504, 14557, 14593,
        15012, 15149, 16839, 18156, 18478, 18534, 19417].map((f, i) => (
        <Sequence key={`diagram-se-${i}`} from={f} durationInFrames={30}>
          <Audio src={staticFile("決定ボタンを押す3.mp3")} volume={0.8} />
        </Sequence>
      ))}
      {BLACKOUT_SEGMENTS.map((seg, i) => (
        <Sequence key={`blackout-se-${i}`} from={seg.start} durationInFrames={30}>
          <Audio src={staticFile("間抜け4.mp3")} volume={0.8} />
        </Sequence>
      ))}
      {RED_SEGMENTS.map((seg, i) => (
        <Sequence key={`red-seg-se-${i}`} from={seg.start} durationInFrames={30}>
          <Audio src={staticFile("和太鼓でドドン.mp3")} volume={0.8} />
        </Sequence>
      ))}
      {GOLD_SEGMENTS.map((seg, i) => (
        <Sequence key={`gold-se-${i}`} from={seg.start} durationInFrames={30}>
          <Audio src={staticFile("決定ボタンを押す3.mp3")} volume={0.8} />
        </Sequence>
      ))}
      <Sequence from={10258} durationInFrames={30}>
        <Audio src={staticFile("間抜け4.mp3")} volume={0.8} />
      </Sequence>
      {IMAGE_FRAMES.map((f, i) => (
        <Sequence key={`img-se-${i}`} from={f} durationInFrames={30}>
          <Audio src={staticFile("決定ボタンを押す1.mp3")} volume={0.8} />
        </Sequence>
      ))}
      {telopData
        .filter(
          (seg) =>
            seg.text.includes("[yellow:") &&
            !GOLD_SEGMENTS.some(
              (g) => seg.startFrame >= g.start && seg.startFrame < g.end,
            ) &&
            !IMAGE_FRAMES.includes(seg.startFrame),
        )
        .map((seg, i) => (
          <Sequence key={`yellow-se-${i}`} from={seg.startFrame} durationInFrames={30}>
            <Audio src={staticFile("決定ボタンを押す3.mp3")} volume={0.8} />
          </Sequence>
        ))}
      {telopData
        .filter(
          (seg) =>
            seg.text.includes("[red:") &&
            !RED_SEGMENTS.some(
              (r) => seg.startFrame >= r.start && seg.startFrame < r.end,
            ) &&
            !GOLD_SEGMENTS.some(
              (g) => seg.startFrame >= g.start && seg.startFrame < g.end,
            ) &&
            !BLACKOUT_SEGMENTS.some(
              (b) => seg.startFrame >= b.start && seg.startFrame < b.end,
            ) &&
            !IMAGE_FRAMES.includes(seg.startFrame),
        )
        .map((seg, i) => (
          <Sequence key={`red-se-${i}`} from={seg.startFrame} durationInFrames={30}>
            <Audio src={staticFile("決定ボタンを押す3.mp3")} volume={0.8} />
          </Sequence>
        ))}
      <Sequence from={8190} durationInFrames={84}>
        <BulletList
          items={[
            { text: "型", appearAt: 0 },
            { text: "エラーハンドリング", appearAt: 14 },
            { text: "構造", appearAt: 30 },
            { text: "並列", appearAt: 46 },
            { text: "ビルド周り", appearAt: 60 },
          ]}
        />
      </Sequence>
      <Sequence from={6113} durationInFrames={111}>
        <BulletList
          items={[
            { text: "モデルの入出力", appearAt: 0 },
            { text: "前処理", appearAt: 18 },
            { text: "推論", appearAt: 36 },
            { text: "API化", appearAt: 54 },
            { text: "ログ", appearAt: 72 },
          ]}
        />
      </Sequence>
      <Sequence from={9984} durationInFrames={198}>
        <BulletList
          items={[
            { text: "構造体どうする？", appearAt: 0 },
            { text: "インターフェースどう切る？", appearAt: 27 },
            { text: "使う値を全部定義する？", appearAt: 62 },
            { text: "返り値の型は？", appearAt: 107 },
            { text: "エラーはどこで握る？", appearAt: 132 },
            { text: "パッケージ構成どうする？", appearAt: 164 },
          ]}
        />
      </Sequence>
      <Sequence from={10626} durationInFrames={122}>
        <BulletList
          items={[
            { text: "どの求人データを使うのか", appearAt: 0 },
            { text: "どんなプロンプトが効くのか", appearAt: 42 },
            { text: "出力をどう評価するのか", appearAt: 81 },
          ]}
        />
      </Sequence>
      <Sequence from={STEPFLOW_START} durationInFrames={STEPFLOW_END - STEPFLOW_START}>
        <StepFlow
          steps={["データ取る", "プロンプト作る", "生成する", "返す"]}
          durationInFrames={STEPFLOW_END - STEPFLOW_START}
        />
      </Sequence>
      <Sequence from={TITLE_START} durationInFrames={TITLE_END - TITLE_START}>
        <VideoTitle durationInFrames={TITLE_END - TITLE_START} />
      </Sequence>
      <Sequence from={TITLE_START} durationInFrames={30}>
        <Audio src={staticFile("和太鼓でドドン.mp3")} volume={0.8} />
      </Sequence>
      <AbsoluteFill>
        {telopData
          .filter(
            (seg) =>
              (seg.startFrame < TITLE_START || seg.startFrame >= TITLE_END) &&
              (seg.startFrame < STEPFLOW_START || seg.startFrame >= STEPFLOW_END) &&
              (seg.startFrame < LINE_BULLET_START || seg.startFrame >= LINE_BULLET_END),
          )
          .map((segment, i) => {
            const isMono = BLACKOUT_SEGMENTS.some(
              (seg) =>
                segment.startFrame >= seg.start &&
                segment.startFrame < seg.end,
            );
            const isGold = GOLD_SEGMENTS.some(
              (seg) =>
                segment.startFrame >= seg.start &&
                segment.startFrame < seg.end,
            );
            const isRed = RED_SEGMENTS.some(
              (seg) =>
                segment.startFrame >= seg.start &&
                segment.startFrame < seg.end,
            );
            const variant = isRed ? "red" : isGold ? "gold" : isMono ? "mono" : "default";
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
