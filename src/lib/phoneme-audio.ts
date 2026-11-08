/**
 * 单个音标的独立读音（文件在 public/audio/phoneme/）。
 *
 * 来源：Wikimedia Commons 的 IPA 录音（CC BY-SA），不是 TTS 合成——TTS 念不出孤立的音素。
 * 数组长度大于 1 的条目由两段真实录音拼接播放，用来演示双元音、塞擦音的滑动过程
 * （例如 /eɪ/ = /e/ + /ɪ/），因为 Commons 上没有这些双元音的独立录音。
 *
 * 由脚本生成，勿手改。
 */
export const PHONEME_CLIPS: Readonly<Record<string, readonly string[]>> = {
  "iː": ["long-i.ogg"],
  "ɪ": ["short-i.ogg"],
  "e": ["short-e.ogg"],
  "æ": ["short-a.ogg"],
  "ə": ["schwa.ogg"],
  "ɜː": ["long-er.ogg"],
  "ʌ": ["short-u.ogg"],
  "ɑː": ["long-a.ogg"],
  "ɒ": ["short-o.ogg"],
  "ɔː": ["long-o.ogg"],
  "ʊ": ["short-oo.ogg"],
  "uː": ["long-u.ogg"],
  "eɪ": ["short-e.ogg", "short-i.ogg"],
  "aɪ": ["a-open.ogg", "short-i.ogg"],
  "ɔɪ": ["long-o.ogg", "short-i.ogg"],
  "əʊ": ["schwa.ogg", "short-oo.ogg"],
  "aʊ": ["diph-a-u.wav"],
  "ɪə": ["short-i.ogg", "schwa.ogg"],
  "eə": ["diph-e-er.wav"],
  "ʊə": ["diph-oo-er.wav"],
  "p": ["p.ogg"],
  "b": ["b.ogg"],
  "t": ["t.ogg"],
  "d": ["d.ogg"],
  "k": ["k.ogg"],
  "g": ["g.ogg"],
  "f": ["f.ogg"],
  "v": ["v.ogg"],
  "θ": ["th.ogg"],
  "ð": ["dh.ogg"],
  "s": ["s.ogg"],
  "z": ["z.ogg"],
  "ʃ": ["sh.ogg"],
  "ʒ": ["zh.ogg"],
  "h": ["h.ogg"],
  "tʃ": ["ch.ogg"],
  "dʒ": ["j.ogg"],
  "ts": ["t.ogg", "s.ogg"],
  "dz": ["d.ogg", "z.ogg"],
  "tr": ["t.ogg", "r.ogg"],
  "dr": ["d.ogg", "r.ogg"],
  "m": ["m.ogg"],
  "n": ["n.ogg"],
  "ŋ": ["ng.ogg"],
  "l": ["l.ogg"],
  "r": ["r.ogg"],
  "w": ["w.ogg"],
  "j": ["y.ogg"],
};

/** 该音标是否有可播放的独立录音。 */
export function hasPhonemeClip(id: string): boolean {
  return PHONEME_CLIPS[id] !== undefined;
}
