# スキル: BGMループ配置 (Background Music)

## 概要
BGM音声ファイルを動画全体にループ配置する。ループ繋ぎ目ではフェードアウト→フェードインでスムーズに接続する。

## 使用タイミング
- 動画全体のBGMとして

## 手順

### 1. 音声ファイルの分析
```bash
# 尺を確認
ffprobe -v quiet -show_entries format=duration -of csv=p=0 public/BGMファイル.mp3

# 末尾の無音を検出（カットするため）
ffmpeg -i public/BGMファイル.mp3 -af silencedetect=noise=-40dB:d=0.5 -f null - 2>&1 | grep silence
```

### 2. 定数を定義（TelopVideo.tsx）
```typescript
const BGM_USABLE_FRAMES = 有効フレーム数;  // 末尾無音除外
const BGM_VOLUME = 0.1;                     // トーク音声を邪魔しない音量
const BGM_INITIAL_FADE = 75;                // 最初のフェードイン（3秒）
const BGM_CROSSFADE = 25;                   // ループ繋ぎ目フェード（1秒）
const TOTAL_FRAMES = 動画の総フレーム数;
const BGM_LOOPS = Math.ceil(TOTAL_FRAMES / BGM_USABLE_FRAMES);
```

### 3. ループSequenceを配置
```tsx
{Array.from({ length: BGM_LOOPS }, (_, i) => {
  const loopStart = i * BGM_USABLE_FRAMES;
  const remaining = TOTAL_FRAMES - loopStart;
  const dur = Math.min(BGM_USABLE_FRAMES, remaining);
  const isFirst = i === 0;

  return (
    <Sequence key={`bgm-${i}`} from={loopStart} durationInFrames={dur}>
      <Audio
        src={staticFile("BGMファイル.mp3")}
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
```

## 配置場所
動画レイヤーの直後、他のコンポーネントの前:
```
OffthreadVideo → BGM → ChannelBadge → ... → Telop
```

## パラメータ調整ガイド
- `BGM_VOLUME`: 0.05〜0.15が目安。トーク主体なら0.08-0.1
- `BGM_INITIAL_FADE`: 50-100フレーム（2-4秒）。低い音から自然に入る
- `BGM_CROSSFADE`: 20-30フレーム（0.8-1.2秒）。短すぎるとブツ切り感
