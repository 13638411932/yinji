/**
 * 每个音标对应的 B 站讲解视频（英语兔《全网最适合中国人的免费音标课》）。
 *
 * 只存分集页码，播放地址由 `phonemeVideoUrl` 拼出来——这样视频链接不会散落在各处，
 * 将来换一套课程只改这一个文件和下面两个常量。
 *
 * 这套课是 47 个分集：
 *  - 有的分集讲一对（如「iː 和 i」「p b」），所以两个音标会指向同一集
 *  - 这套课的音标顺序与本站的分组不同，映射按标题逐个核对过
 */
export const PHONEME_VIDEO_BVID = "BV1iV411z7Nj";
export const PHONEME_VIDEO_SOURCE = "英语兔 · 全网最适合中国人的免费音标课";

/** 音标 id → 分集页码（从 1 开始）。 */
export const PHONEME_VIDEO_PAGES: Readonly<Record<string, number>> = {
  // 单元音
  "iː": 7,
  "ɪ": 8,
  e: 11,
  "æ": 16,
  "ə": 13,
  "ɜː": 12,
  "ʌ": 14,
  "ɑː": 17,
  "ɒ": 18,
  "ɔː": 15,
  "ʊ": 10,
  "uː": 9,
  // 双元音
  "eɪ": 19,
  "aɪ": 21,
  "ɔɪ": 20,
  "əʊ": 23,
  "aʊ": 22,
  "ɪə": 26,
  "eə": 25,
  "ʊə": 24,
  // 辅音
  p: 28,
  b: 28,
  t: 29,
  d: 29,
  k: 30,
  g: 30,
  f: 32,
  v: 32,
  "θ": 34,
  "ð": 34,
  s: 33,
  z: 33,
  "ʃ": 35,
  "ʒ": 35,
  h: 37,
  "tʃ": 36,
  "dʒ": 36,
  ts: 42,
  dz: 42,
  tr: 43,
  dr: 43,
  m: 31,
  n: 31,
  "ŋ": 31,
  l: 41,
  r: 39,
  w: 38,
  j: 40,
};

/** 该音标对应的视频播放地址；没有映射时返回 undefined。 */
export function phonemeVideoUrl(id: string): string | undefined {
  const page = PHONEME_VIDEO_PAGES[id];
  if (page === undefined) return undefined;
  return `https://www.bilibili.com/video/${PHONEME_VIDEO_BVID}/?p=${String(page)}`;
}
