export type PhonemeKind = "monophthong" | "diphthong" | "consonant";

export type VowelHeight =
  | "close"
  | "near-close"
  | "close-mid"
  | "mid"
  | "open-mid"
  | "open";

export type VowelBackness = "front" | "central" | "back";

export type Place =
  | "bilabial"
  | "labiodental"
  | "dental"
  | "alveolar"
  | "post-alveolar"
  | "palatal"
  | "velar"
  | "glottal"
  | "labial-velar";

export type Manner =
  | "plosive"
  | "fricative"
  | "affricate"
  | "nasal"
  | "lateral"
  | "approximant";

export type ExampleWord = {
  word: string;
  ipa: string;
  zh: string;
};

export type Phoneme = {
  id: string;
  ipa: string;
  kind: PhonemeKind;
  nameZh: string;
  groupZh: string;
  writing: {
    strokes: string;
    hint: string;
    similarTo: string;
  };
  memory: {
    mouth: string;
    mnemonic: string;
    chineseLike: string;
    pitfall: string;
  };
  vowel?: {
    height: VowelHeight;
    backness: VowelBackness;
    rounded: boolean;
    length: "short" | "long" | "glide";
  };
  consonant?: {
    place: Place;
    manner: Manner;
    voiced: boolean;
  };
  examples: ExampleWord[];
  contrast?: { with: string; tip: string };
};

export const PHONEMES: Phoneme[] = [
  {
    id: "iː",
    ipa: "iː",
    kind: "monophthong",
    nameZh: "长元音 i",
    groupZh: "前元音",
    writing: {
      strokes: "先写小写 i（竖笔加点），右侧再写长音符号 ː（上下两个小三角，不是英文冒号）。",
      hint: "长音符号是三角，不是两点上下对齐的冒号。",
      similarTo: "拉丁字母 i + 长音标记",
    },
    memory: {
      mouth: "舌面前部抬到最高、贴近硬腭，嘴角向两侧拉开，呈扁平微笑，气流拉长。",
      mnemonic: "把普通话「衣」拉长一拍。符号旁边的两点提醒你：这个音必须够长。",
      chineseLike: "近似「衣」，更扁、更长。",
      pitfall: "读得太短就会变成 /ɪ/。sheep 不是 ship。",
    },
    vowel: { height: "close", backness: "front", rounded: false, length: "long" },
    examples: [
      { word: "see", ipa: "siː", zh: "看见" },
      { word: "me", ipa: "miː", zh: "我" },
      { word: "eat", ipa: "iːt", zh: "吃" },
    ],
    contrast: { with: "ɪ", tip: "sheep /ʃiːp/ 绵羊 · ship /ʃɪp/ 船。前者拉长、嘴更扁。" },
  },
  {
    id: "ɪ",
    ipa: "ɪ",
    kind: "monophthong",
    nameZh: "短元音 i",
    groupZh: "前元音",
    writing: {
      strokes: "像小一号的大写 I：上下各一条短横，中间一竖，没有点。",
      hint: "不要加点，也不要写成普通 i。",
      similarTo: "缩小的大写 I",
    },
    memory: {
      mouth: "舌位比 /iː/ 略低、略后，肌肉放松，音短促。",
      mnemonic: "像轻轻说一声「一」马上收掉，别拉长。小写看起来「矮一截」，音也短一截。",
      chineseLike: "比「衣」松、短，接近没咬准的「一」。",
      pitfall: "中国学生常读成 /iː/。ship、sit、big 都要短。",
    },
    vowel: { height: "near-close", backness: "front", rounded: false, length: "short" },
    examples: [
      { word: "sit", ipa: "sɪt", zh: "坐" },
      { word: "big", ipa: "bɪɡ", zh: "大" },
      { word: "ship", ipa: "ʃɪp", zh: "船" },
    ],
    contrast: { with: "iː", tip: "短而松，不要微笑拉长。" },
  },
  {
    id: "e",
    ipa: "e",
    kind: "monophthong",
    nameZh: "短元音 e",
    groupZh: "前元音",
    writing: {
      strokes: "普通小写 e：逆时针画圆，中横收笔。DJ 用 /e/ 而不是 /ɛ/。",
      hint: "一笔写成闭合的 e。",
      similarTo: "拉丁字母 e",
    },
    memory: {
      mouth: "舌前中高，唇自然展开，开口比 /ɪ/ 稍大，音短。",
      mnemonic: "像礼貌地「诶？」一声。bed、red、pen 都是这个开口。",
      chineseLike: "近似「诶」，不要滑向「爱」。",
      pitfall: "不要读成汉语拼音 ei，也别张太大变成 /æ/。",
    },
    vowel: { height: "close-mid", backness: "front", rounded: false, length: "short" },
    examples: [
      { word: "bed", ipa: "bed", zh: "床" },
      { word: "red", ipa: "red", zh: "红" },
      { word: "pen", ipa: "pen", zh: "笔" },
    ],
    contrast: { with: "æ", tip: "bed /bed/ 床 · bad /bæd/ 坏。后者嘴张得更大。" },
  },
  {
    id: "æ",
    ipa: "æ",
    kind: "monophthong",
    nameZh: "短元音 æ",
    groupZh: "前元音",
    writing: {
      strokes: "a 与 e 连写：先写 a 的圆腹，再向右连出 e 的环。",
      hint: "是合体字，不是 a 旁边再写一个 e。",
      similarTo: "a + e 连体",
    },
    memory: {
      mouth: "舌前低，下颌明显下降，唇扁，像被吓到但还在微笑。",
      mnemonic: "医生说「啊」时再把嘴角拉开。cat 的嘴要张够。",
      chineseLike: "介于「啊」和「爱」之间，更扁更开。",
      pitfall: "开口不够会被听成 /e/。map 不是 mep。",
    },
    vowel: { height: "open", backness: "front", rounded: false, length: "short" },
    examples: [
      { word: "cat", ipa: "kæt", zh: "猫" },
      { word: "map", ipa: "mæp", zh: "地图" },
      { word: "apple", ipa: "ˈæpl", zh: "苹果" },
    ],
    contrast: { with: "e", tip: "张嘴看牙齿，比 e 更开。" },
  },
  {
    id: "ə",
    ipa: "ə",
    kind: "monophthong",
    nameZh: "中元音 ə（弱读）",
    groupZh: "中元音",
    writing: {
      strokes: "倒写的 e：开口朝左，中横仍在。先画左开口的半圆再加横。",
      hint: "像被翻转的 e，叫 schwa。",
      similarTo: "倒置的 e",
    },
    memory: {
      mouth: "舌位居中放松，唇自然，几乎不费力。英语里最懒的元音。",
      mnemonic: "所有弱读都往这里靠。about 的 a、teacher 的 er，都是轻轻「呃」一下。",
      chineseLike: "轻声的「呃」，比「的」还含糊。",
      pitfall: "不要读成清晰的 /ɜː/ 或汉语「额」。它又短又弱。",
    },
    vowel: { height: "mid", backness: "central", rounded: false, length: "short" },
    examples: [
      { word: "about", ipa: "əˈbaʊt", zh: "关于" },
      { word: "teacher", ipa: "ˈtiːtʃə", zh: "老师" },
      { word: "banana", ipa: "bəˈnɑːnə", zh: "香蕉" },
    ],
    contrast: { with: "ɜː", tip: "ə 又短又弱；ɜː 出现在重读音节且拉长。" },
  },
  {
    id: "ɜː",
    ipa: "ɜː",
    kind: "monophthong",
    nameZh: "长元音 ɜː",
    groupZh: "中元音",
    writing: {
      strokes: "像反写的 3 或开口向左的 ε，右侧加长音 ː。",
      hint: "不要写成普通数字 3。",
      similarTo: "反 3 + 长音",
    },
    memory: {
      mouth: "舌中部抬起，唇自然展开，声音从喉咙中部拉长，不卷舌。",
      mnemonic: "英式 bird、her、work：像拉长的「额」，舌头别卷。",
      chineseLike: "拉长的「俄」，舌面平，不卷。",
      pitfall: "美式会带 r 色彩；DJ 英式不卷舌。",
    },
    vowel: { height: "open-mid", backness: "central", rounded: false, length: "long" },
    examples: [
      { word: "bird", ipa: "bɜːd", zh: "鸟" },
      { word: "her", ipa: "hɜː", zh: "她" },
      { word: "work", ipa: "wɜːk", zh: "工作" },
    ],
    contrast: { with: "ə", tip: "重读、拉长才是 ɜː。" },
  },
  {
    id: "ʌ",
    ipa: "ʌ",
    kind: "monophthong",
    nameZh: "短元音 ʌ",
    groupZh: "中元音",
    writing: {
      strokes: "倒过来的 V：两斜笔在顶点相交，开口朝上。",
      hint: "像帽子，不要写成 n。",
      similarTo: "倒置的 v",
    },
    memory: {
      mouth: "舌中后偏低，唇自然张开，音短而干脆。",
      mnemonic: "像轻轻「啊」一下就停。cup、but、love。倒 V 像被扣住的短音。",
      chineseLike: "短促的「阿」，比 /ɑː/ 靠前、更短。",
      pitfall: "别读成汉语 an，也别拉长成 /ɑː/。",
    },
    vowel: { height: "open-mid", backness: "central", rounded: false, length: "short" },
    examples: [
      { word: "cup", ipa: "kʌp", zh: "杯子" },
      { word: "but", ipa: "bʌt", zh: "但是" },
      { word: "love", ipa: "lʌv", zh: "爱" },
    ],
    contrast: { with: "ɑː", tip: "cut /kʌt/ 切 · cart /kɑːt/ 马车。长短、开口都不同。" },
  },
  {
    id: "ɑː",
    ipa: "ɑː",
    kind: "monophthong",
    nameZh: "长元音 ɑː",
    groupZh: "后元音",
    writing: {
      strokes: "手写体 a 的圆腹加右竖，右侧加 ː。脚本体、开口偏右。",
      hint: "与印刷体 a 不同，更像手写 α。",
      similarTo: "手写 a + 长音",
    },
    memory: {
      mouth: "舌身后缩、压低，口张大，不圆唇，声音从口腔后部拉长。",
      mnemonic: "像打哈欠的「啊——」。car、father、ask（英式）。",
      chineseLike: "比普通话「啊」更靠后、更长。",
      pitfall: "不要圆唇滑向 /ɔː/。",
    },
    vowel: { height: "open", backness: "back", rounded: false, length: "long" },
    examples: [
      { word: "car", ipa: "kɑː", zh: "汽车" },
      { word: "father", ipa: "ˈfɑːðə", zh: "父亲" },
      { word: "park", ipa: "pɑːk", zh: "公园" },
    ],
    contrast: { with: "ʌ", tip: "拉长、口更开、舌更后。" },
  },
  {
    id: "ɒ",
    ipa: "ɒ",
    kind: "monophthong",
    nameZh: "短元音 ɒ",
    groupZh: "后元音",
    writing: {
      strokes: "倒写的 a / 像打开的 α 再翻转：圆腹在右，左边开口带钩。",
      hint: "是翻转的脚本 a，DJ 英式特有。",
      similarTo: "倒置的 ɑ",
    },
    memory: {
      mouth: "舌后低，唇略圆、口开，音短。hot、dog、box。",
      mnemonic: "英式「喔」又短又开。美式常读成 /ɑː/，DJ 要圆一点、短一点。",
      chineseLike: "短的「喔」，口比 /ɔː/ 更开。",
      pitfall: "不要拉长成 /ɔː/。cot 不是 caught。",
    },
    vowel: { height: "open", backness: "back", rounded: true, length: "short" },
    examples: [
      { word: "hot", ipa: "hɒt", zh: "热" },
      { word: "dog", ipa: "dɒɡ", zh: "狗" },
      { word: "box", ipa: "bɒks", zh: "盒子" },
    ],
    contrast: { with: "ɔː", tip: "hot /hɒt/ · hall /hɔːl/。短开 vs 长合。" },
  },
  {
    id: "ɔː",
    ipa: "ɔː",
    kind: "monophthong",
    nameZh: "长元音 ɔː",
    groupZh: "后元音",
    writing: {
      strokes: "开口向左的 c 形（开 o），右侧加 ː。",
      hint: "不要写成完整的 o。",
      similarTo: "开口的 o + 长音",
    },
    memory: {
      mouth: "舌后半低，双唇明显收圆前突，声音拉长。door、more、law。",
      mnemonic: "像拉长的「哦——」，嘴唇做小圆。符号本身就是半个圆。",
      chineseLike: "拉长的「哦」，圆唇。",
      pitfall: "圆唇不够会像 /ɑː/。",
    },
    vowel: { height: "open-mid", backness: "back", rounded: true, length: "long" },
    examples: [
      { word: "door", ipa: "dɔː", zh: "门" },
      { word: "more", ipa: "mɔː", zh: "更多" },
      { word: "law", ipa: "lɔː", zh: "法律" },
    ],
    contrast: { with: "ɒ", tip: "更合、更圆、更长。" },
  },
  {
    id: "ʊ",
    ipa: "ʊ",
    kind: "monophthong",
    nameZh: "短元音 ʊ",
    groupZh: "后元音",
    writing: {
      strokes: "像开口的小马蹄 / 希腊 Ω 的上半：两边下垂，中间拱起。",
      hint: "不要写成 u 或 n。",
      similarTo: "小马蹄形",
    },
    memory: {
      mouth: "舌后略高，唇略圆，音短而松。book、good、put。",
      mnemonic: "像很快说「乌」但嘴没那么圆、音没那么长。",
      chineseLike: "短而松的「乌」。",
      pitfall: "拉长就变成 /uː/。full 不是 fool。",
    },
    vowel: { height: "near-close", backness: "back", rounded: true, length: "short" },
    examples: [
      { word: "book", ipa: "bʊk", zh: "书" },
      { word: "good", ipa: "ɡʊd", zh: "好" },
      { word: "put", ipa: "pʊt", zh: "放" },
    ],
    contrast: { with: "uː", tip: "short、松、略开。" },
  },
  {
    id: "uː",
    ipa: "uː",
    kind: "monophthong",
    nameZh: "长元音 u",
    groupZh: "后元音",
    writing: {
      strokes: "小写 u，右侧加长音 ː。",
      hint: "u 要封底，再写长音。",
      similarTo: "u + 长音",
    },
    memory: {
      mouth: "舌后部抬到最高，双唇收成小圆并前突，气流拉长。",
      mnemonic: "拉长的「乌」。too、blue、food。圆唇是关键。",
      chineseLike: "拉长的「乌」，更圆。",
      pitfall: "嘴唇太松会变成 /ʊ/。",
    },
    vowel: { height: "close", backness: "back", rounded: true, length: "long" },
    examples: [
      { word: "too", ipa: "tuː", zh: "也" },
      { word: "blue", ipa: "bluː", zh: "蓝" },
      { word: "food", ipa: "fuːd", zh: "食物" },
    ],
    contrast: { with: "ʊ", tip: "fool /fuːl/ · full /fʊl/。" },
  },
  {
    id: "eɪ",
    ipa: "eɪ",
    kind: "diphthong",
    nameZh: "双元音 eɪ",
    groupZh: "合口双元音",
    writing: {
      strokes: "先写 e，紧挨着写 ɪ（小大写 I），两个符号同高。",
      hint: "是两个音标连写，不是字母 A。",
      similarTo: "e + ɪ",
    },
    memory: {
      mouth: "从 /e/ 滑向 /ɪ/：开口由中到小，舌位升高。",
      mnemonic: "像汉语「诶」滑向「衣」。day、make、name。要有滑动，不要读成单音。",
      chineseLike: "近似拼音 ei，但起点更像 /e/。",
      pitfall: "只发第一个音，没有滑到 ɪ。",
    },
    vowel: { height: "close-mid", backness: "front", rounded: false, length: "glide" },
    examples: [
      { word: "day", ipa: "deɪ", zh: "白天" },
      { word: "make", ipa: "meɪk", zh: "做" },
      { word: "name", ipa: "neɪm", zh: "名字" },
    ],
  },
  {
    id: "aɪ",
    ipa: "aɪ",
    kind: "diphthong",
    nameZh: "双元音 aɪ",
    groupZh: "合口双元音",
    writing: {
      strokes: "手写 a（或印刷 a）后接 ɪ。",
      hint: "起点是开前元音，不是 æ。",
      similarTo: "a + ɪ",
    },
    memory: {
      mouth: "口先大开，再迅速收向 /ɪ/。my、time、like。",
      mnemonic: "像「啊」冲向「衣」。汉语「爱」接近，但英语开口更大。",
      chineseLike: "近似「爱」。",
      pitfall: "开口不够，或没有滑动。",
    },
    vowel: { height: "open", backness: "front", rounded: false, length: "glide" },
    examples: [
      { word: "my", ipa: "maɪ", zh: "我的" },
      { word: "time", ipa: "taɪm", zh: "时间" },
      { word: "like", ipa: "laɪk", zh: "喜欢" },
    ],
  },
  {
    id: "ɔɪ",
    ipa: "ɔɪ",
    kind: "diphthong",
    nameZh: "双元音 ɔɪ",
    groupZh: "合口双元音",
    writing: {
      strokes: "开 o（ɔ）后接 ɪ，右侧不加长音。",
      hint: "ɔ 本身不再加 ː。",
      similarTo: "ɔ + ɪ",
    },
    memory: {
      mouth: "先圆唇发 /ɔ/，再展唇滑向 /ɪ/。boy、toy、voice。",
      mnemonic: "「哦」滑向「衣」。圆唇开始、扁唇结束。",
      chineseLike: "近似「喔衣」连读。",
      pitfall: "忘记先圆唇。",
    },
    vowel: { height: "open-mid", backness: "back", rounded: true, length: "glide" },
    examples: [
      { word: "boy", ipa: "bɔɪ", zh: "男孩" },
      { word: "toy", ipa: "tɔɪ", zh: "玩具" },
      { word: "voice", ipa: "vɔɪs", zh: "声音" },
    ],
  },
  {
    id: "əʊ",
    ipa: "əʊ",
    kind: "diphthong",
    nameZh: "双元音 əʊ",
    groupZh: "合口双元音",
    writing: {
      strokes: "倒 e（ə）后接 ʊ。DJ 写作 /əʊ/，不是美式 /oʊ/。",
      hint: "这是英式 DJ 的标志写法。",
      similarTo: "ə + ʊ",
    },
    memory: {
      mouth: "从放松的 /ə/ 滑向圆唇 /ʊ/。go、home、no。",
      mnemonic: "先「呃」再收成小圆唇「乌」。不要读成汉语 ou 那么靠后。",
      chineseLike: "近似「欧」，起点更央。",
      pitfall: "读成单元音 o，没有滑到 ʊ。",
    },
    vowel: { height: "mid", backness: "central", rounded: false, length: "glide" },
    examples: [
      { word: "go", ipa: "ɡəʊ", zh: "去" },
      { word: "home", ipa: "həʊm", zh: "家" },
      { word: "no", ipa: "nəʊ", zh: "不" },
    ],
  },
  {
    id: "aʊ",
    ipa: "aʊ",
    kind: "diphthong",
    nameZh: "双元音 aʊ",
    groupZh: "合口双元音",
    writing: {
      strokes: "a 后接 ʊ。",
      hint: "终点是短 u，不是长 uː。",
      similarTo: "a + ʊ",
    },
    memory: {
      mouth: "口大开，再收圆滑向 /ʊ/。now、house、out。",
      mnemonic: "「啊」滑向「乌」，像汉语「奥」。",
      chineseLike: "近似「奥」。",
      pitfall: "开口不够，或滑向 /uː/ 过圆过长。",
    },
    vowel: { height: "open", backness: "front", rounded: false, length: "glide" },
    examples: [
      { word: "now", ipa: "naʊ", zh: "现在" },
      { word: "house", ipa: "haʊs", zh: "房子" },
      { word: "out", ipa: "aʊt", zh: "出去" },
    ],
  },
  {
    id: "ɪə",
    ipa: "ɪə",
    kind: "diphthong",
    nameZh: "双元音 ɪə",
    groupZh: "集中双元音",
    writing: {
      strokes: "ɪ 后接 ə。",
      hint: "英式 here 的典型写法。",
      similarTo: "ɪ + ə",
    },
    memory: {
      mouth: "从 /ɪ/ 滑向中部放松的 /ə/。here、ear、near。",
      mnemonic: "「衣」落到「呃」。英式不卷舌。",
      chineseLike: "「衣呃」连读，不卷舌。",
      pitfall: "加卷舌变成美式 r。DJ 课程里保持不卷舌。",
    },
    vowel: { height: "near-close", backness: "front", rounded: false, length: "glide" },
    examples: [
      { word: "here", ipa: "hɪə", zh: "这里" },
      { word: "ear", ipa: "ɪə", zh: "耳朵" },
      { word: "near", ipa: "nɪə", zh: "靠近" },
    ],
  },
  {
    id: "eə",
    ipa: "eə",
    kind: "diphthong",
    nameZh: "双元音 eə",
    groupZh: "集中双元音",
    writing: {
      strokes: "e 后接 ə。",
      hint: "hair、care 的英式核。",
      similarTo: "e + ə",
    },
    memory: {
      mouth: "从 /e/ 滑向 /ə/。hair、care、air。",
      mnemonic: "「诶」落到「呃」。",
      chineseLike: "「诶呃」，不卷舌。",
      pitfall: "读成 /eɪ/ 或加上 r。",
    },
    vowel: { height: "close-mid", backness: "front", rounded: false, length: "glide" },
    examples: [
      { word: "hair", ipa: "heə", zh: "头发" },
      { word: "care", ipa: "keə", zh: "关心" },
      { word: "air", ipa: "eə", zh: "空气" },
    ],
  },
  {
    id: "ʊə",
    ipa: "ʊə",
    kind: "diphthong",
    nameZh: "双元音 ʊə",
    groupZh: "集中双元音",
    writing: {
      strokes: "ʊ 后接 ə。",
      hint: "tour、poor 的传统 DJ 写法，现代口音里常并入 /ɔː/。",
      similarTo: "ʊ + ə",
    },
    memory: {
      mouth: "从略圆的 /ʊ/ 滑向 /ə/。tour、poor、sure（传统）。",
      mnemonic: "「乌」落到「呃」。当代英音很多人读 /ɔː/，课程仍记 DJ 原形。",
      chineseLike: "「乌呃」。",
      pitfall: "与 /ɔː/ 混淆。先掌握传统写法。",
    },
    vowel: { height: "near-close", backness: "back", rounded: true, length: "glide" },
    examples: [
      { word: "tour", ipa: "tʊə", zh: "旅游" },
      { word: "poor", ipa: "pʊə", zh: "贫穷" },
      { word: "sure", ipa: "ʃʊə", zh: "确定" },
    ],
  },
  {
    id: "p",
    ipa: "p",
    kind: "consonant",
    nameZh: "清辅音 p",
    groupZh: "双唇爆破",
    writing: {
      strokes: "普通小写 p：上竖下圆。",
      hint: "与印刷体 p 相同。",
      similarTo: "字母 p",
    },
    memory: {
      mouth: "双唇紧闭蓄气，突然张开送气，声带不振动。",
      mnemonic: "像吹灭蜡烛前的那一声「扑」。pen、map、apple。",
      chineseLike: "拼音 p，送气。",
      pitfall: "词尾不要加元音，map 不是 mapu。",
    },
    consonant: { place: "bilabial", manner: "plosive", voiced: false },
    examples: [
      { word: "pen", ipa: "pen", zh: "笔" },
      { word: "map", ipa: "mæp", zh: "地图" },
      { word: "apple", ipa: "ˈæpl", zh: "苹果" },
    ],
    contrast: { with: "b", tip: "p 清音送气，b 浊音。pin · bin。" },
  },
  {
    id: "b",
    ipa: "b",
    kind: "consonant",
    nameZh: "浊辅音 b",
    groupZh: "双唇爆破",
    writing: {
      strokes: "普通小写 b。",
      hint: "竖在左，圆在右下。",
      similarTo: "字母 b",
    },
    memory: {
      mouth: "双唇紧闭，声带振动后张开。送气弱。",
      mnemonic: "喉咙「嗯」一下再张开。bag、big、cab。",
      chineseLike: "拼音 b，但不送气且要带声。",
      pitfall: "词尾容易发成 p。cab 要有声。",
    },
    consonant: { place: "bilabial", manner: "plosive", voiced: true },
    examples: [
      { word: "bag", ipa: "bæɡ", zh: "包" },
      { word: "big", ipa: "bɪɡ", zh: "大" },
      { word: "cab", ipa: "kæb", zh: "出租车" },
    ],
    contrast: { with: "p", tip: "摸喉结，b 会振动。" },
  },
  {
    id: "t",
    ipa: "t",
    kind: "consonant",
    nameZh: "清辅音 t",
    groupZh: "齿龈爆破",
    writing: {
      strokes: "普通小写 t。",
      hint: "一竖一横。",
      similarTo: "字母 t",
    },
    memory: {
      mouth: "舌尖抵上齿龈，蓄气后送气离开。",
      mnemonic: "拼音 t。tea、cat、time。",
      chineseLike: "拼音 t。",
      pitfall: "词尾不要吞掉，也不要加元音。",
    },
    consonant: { place: "alveolar", manner: "plosive", voiced: false },
    examples: [
      { word: "tea", ipa: "tiː", zh: "茶" },
      { word: "cat", ipa: "kæt", zh: "猫" },
      { word: "time", ipa: "taɪm", zh: "时间" },
    ],
    contrast: { with: "d", tip: "t 清，d 浊。" },
  },
  {
    id: "d",
    ipa: "d",
    kind: "consonant",
    nameZh: "浊辅音 d",
    groupZh: "齿龈爆破",
    writing: {
      strokes: "普通小写 d。",
      hint: "圆在左，竖在右。",
      similarTo: "字母 d",
    },
    memory: {
      mouth: "舌尖抵齿龈，声带振动后离开。",
      mnemonic: "dog、day、red。喉结要动。",
      chineseLike: "拼音 d，加上声带振动。",
      pitfall: "词尾清化成 t。",
    },
    consonant: { place: "alveolar", manner: "plosive", voiced: true },
    examples: [
      { word: "dog", ipa: "dɒɡ", zh: "狗" },
      { word: "day", ipa: "deɪ", zh: "白天" },
      { word: "red", ipa: "red", zh: "红" },
    ],
    contrast: { with: "t", tip: "摸喉结确认浊音。" },
  },
  {
    id: "k",
    ipa: "k",
    kind: "consonant",
    nameZh: "清辅音 k",
    groupZh: "软腭爆破",
    writing: {
      strokes: "普通小写 k。",
      hint: "竖 + 两斜笔。",
      similarTo: "字母 k",
    },
    memory: {
      mouth: "舌后抵软腭，送气爆破。",
      mnemonic: "拼音 k。cat、key、book。",
      chineseLike: "拼音 k。",
      pitfall: "c、k、ck、ch 都可能是 /k/。",
    },
    consonant: { place: "velar", manner: "plosive", voiced: false },
    examples: [
      { word: "cat", ipa: "kæt", zh: "猫" },
      { word: "key", ipa: "kiː", zh: "钥匙" },
      { word: "book", ipa: "bʊk", zh: "书" },
    ],
    contrast: { with: "g", tip: "k 清送气，g 浊。" },
  },
  {
    id: "g",
    ipa: "g",
    kind: "consonant",
    nameZh: "浊辅音 g",
    groupZh: "软腭爆破",
    writing: {
      strokes: "音标常用开尾 g 或印刷 g，与字母 g 相同。",
      hint: "不要写成 ɡ 以外的手写体也没关系，保持一笔圆腹。",
      similarTo: "字母 g",
    },
    memory: {
      mouth: "舌后抵软腭，声带振动后离开。",
      mnemonic: "go、bag、girl。喉咙要响。",
      chineseLike: "拼音 g，加上浊音。",
      pitfall: "词尾不要发成 k。",
    },
    consonant: { place: "velar", manner: "plosive", voiced: true },
    examples: [
      { word: "go", ipa: "ɡəʊ", zh: "去" },
      { word: "bag", ipa: "bæɡ", zh: "包" },
      { word: "girl", ipa: "ɡɜːl", zh: "女孩" },
    ],
    contrast: { with: "k", tip: "浊 vs 清。" },
  },
  {
    id: "f",
    ipa: "f",
    kind: "consonant",
    nameZh: "清辅音 f",
    groupZh: "唇齿摩擦",
    writing: {
      strokes: "普通小写 f。",
      hint: "上钩 + 横。",
      similarTo: "字母 f",
    },
    memory: {
      mouth: "上齿轻咬下唇，气流挤出，声带不振动。",
      mnemonic: "像把气从牙缝吹出。five、life、coffee。",
      chineseLike: "拼音 f。",
      pitfall: "不要读成 p 或 h。",
    },
    consonant: { place: "labiodental", manner: "fricative", voiced: false },
    examples: [
      { word: "five", ipa: "faɪv", zh: "五" },
      { word: "life", ipa: "laɪf", zh: "生活" },
      { word: "coffee", ipa: "ˈkɒfi", zh: "咖啡" },
    ],
    contrast: { with: "v", tip: "f 清，v 浊。fan · van。" },
  },
  {
    id: "v",
    ipa: "v",
    kind: "consonant",
    nameZh: "浊辅音 v",
    groupZh: "唇齿摩擦",
    writing: {
      strokes: "普通小写 v。",
      hint: "两斜笔相交。",
      similarTo: "字母 v",
    },
    memory: {
      mouth: "上齿咬下唇，声带振动，气流挤出。",
      mnemonic: "very、love、voice。咬唇且喉结动。",
      chineseLike: "汉语没有，最接近「吴」的唇齿版。",
      pitfall: "中国学生常读成 /w/。very 不是 wery。",
    },
    consonant: { place: "labiodental", manner: "fricative", voiced: true },
    examples: [
      { word: "very", ipa: "ˈveri", zh: "非常" },
      { word: "love", ipa: "lʌv", zh: "爱" },
      { word: "voice", ipa: "vɔɪs", zh: "声音" },
    ],
    contrast: { with: "w", tip: "v 咬唇，w 圆唇不咬。" },
  },
  {
    id: "θ",
    ipa: "θ",
    kind: "consonant",
    nameZh: "清辅音 θ",
    groupZh: "齿间摩擦",
    writing: {
      strokes: "希腊字母 theta：先画 o，中间加一横。",
      hint: "横要穿过圆心。",
      similarTo: "希腊 θ",
    },
    memory: {
      mouth: "舌尖轻抵上齿边缘，气流从缝中挤出，不振动。",
      mnemonic: "think、thank、three。把舌尖「给别人看一下」。",
      chineseLike: "汉语没有。别用 s 代替。",
      pitfall: "读成 /s/ 是最常见错误。think 不是 sink。",
    },
    consonant: { place: "dental", manner: "fricative", voiced: false },
    examples: [
      { word: "think", ipa: "θɪŋk", zh: "想" },
      { word: "thank", ipa: "θæŋk", zh: "感谢" },
      { word: "three", ipa: "θriː", zh: "三" },
    ],
    contrast: { with: "s", tip: "舌尖在齿间，不是齿龈。" },
  },
  {
    id: "ð",
    ipa: "ð",
    kind: "consonant",
    nameZh: "浊辅音 ð",
    groupZh: "齿间摩擦",
    writing: {
      strokes: "eth：像带横的 d，或圆腹加一斜杠穿过。",
      hint: "不要写成 d。",
      similarTo: "带横的 d",
    },
    memory: {
      mouth: "舌尖抵上齿，声带振动。this、that、the、mother。",
      mnemonic: "功能词里的 th 多半是它。喉结要动。",
      chineseLike: "汉语没有。",
      pitfall: "读成 /z/ 或 /d/。this 不是 zis 也不是 dis。",
    },
    consonant: { place: "dental", manner: "fricative", voiced: true },
    examples: [
      { word: "this", ipa: "ðɪs", zh: "这" },
      { word: "that", ipa: "ðæt", zh: "那" },
      { word: "mother", ipa: "ˈmʌðə", zh: "母亲" },
    ],
    contrast: { with: "θ", tip: "the 浊，think 清。都要伸舌。" },
  },
  {
    id: "s",
    ipa: "s",
    kind: "consonant",
    nameZh: "清辅音 s",
    groupZh: "齿龈摩擦",
    writing: {
      strokes: "普通小写 s。",
      hint: "两弯。",
      similarTo: "字母 s",
    },
    memory: {
      mouth: "舌尖靠近齿龈，气流挤出，像嘶声。",
      mnemonic: "see、bus、yes。拼音 s。",
      chineseLike: "拼音 s。",
      pitfall: "词尾不要加元音。",
    },
    consonant: { place: "alveolar", manner: "fricative", voiced: false },
    examples: [
      { word: "see", ipa: "siː", zh: "看见" },
      { word: "bus", ipa: "bʌs", zh: "公交" },
      { word: "yes", ipa: "jes", zh: "是" },
    ],
    contrast: { with: "z", tip: "s 清，z 浊。" },
  },
  {
    id: "z",
    ipa: "z",
    kind: "consonant",
    nameZh: "浊辅音 z",
    groupZh: "齿龈摩擦",
    writing: {
      strokes: "普通小写 z。",
      hint: "Z 字形。",
      similarTo: "字母 z",
    },
    memory: {
      mouth: "同 /s/ 的口型，声带振动。zoo、is、please。",
      mnemonic: "像蜜蜂的「zzz」。",
      chineseLike: "接近拼音 z 但要延长摩擦并带声。",
      pitfall: "词尾 -s 在浊音后读 /z/：dogs、is。",
    },
    consonant: { place: "alveolar", manner: "fricative", voiced: true },
    examples: [
      { word: "zoo", ipa: "zuː", zh: "动物园" },
      { word: "is", ipa: "ɪz", zh: "是" },
      { word: "please", ipa: "pliːz", zh: "请" },
    ],
    contrast: { with: "s", tip: "摸喉结。" },
  },
  {
    id: "ʃ",
    ipa: "ʃ",
    kind: "consonant",
    nameZh: "清辅音 ʃ",
    groupZh: "后齿龈摩擦",
    writing: {
      strokes: "像拉长的 s 或积分号：上钩下尾，一笔写成。",
      hint: "不要写成普通 s。",
      similarTo: "长 s / 积分号",
    },
    memory: {
      mouth: "舌身抬向硬腭，唇略圆，气流挤出。she、fish、shop。",
      mnemonic: "让人安静的「嘘」。",
      chineseLike: "近似「希」的擦音，唇更圆。",
      pitfall: "读成拼音 x 或 s。",
    },
    consonant: { place: "post-alveolar", manner: "fricative", voiced: false },
    examples: [
      { word: "she", ipa: "ʃiː", zh: "她" },
      { word: "fish", ipa: "fɪʃ", zh: "鱼" },
      { word: "shop", ipa: "ʃɒp", zh: "商店" },
    ],
    contrast: { with: "s", tip: "ʃ 舌更靠后、唇略圆。" },
  },
  {
    id: "ʒ",
    ipa: "ʒ",
    kind: "consonant",
    nameZh: "浊辅音 ʒ",
    groupZh: "后齿龈摩擦",
    writing: {
      strokes: "像长尾的 3：上圆、中折、下尾左勾。",
      hint: "不是数字 3，尾巴要拖下去。",
      similarTo: "长尾 3",
    },
    memory: {
      mouth: "同 /ʃ/，声带振动。usually、television、beige。",
      mnemonic: "英语里较少见，多在词中。vision 的 si。",
      chineseLike: "近似「日」的浊擦，但更靠后。",
      pitfall: "读成 /dʒ/ 或 /r/。",
    },
    consonant: { place: "post-alveolar", manner: "fricative", voiced: true },
    examples: [
      { word: "usually", ipa: "ˈjuːʒuəli", zh: "通常" },
      { word: "television", ipa: "ˈtelɪvɪʒn", zh: "电视" },
      { word: "beige", ipa: "beɪʒ", zh: "米色" },
    ],
    contrast: { with: "ʃ", tip: "浊 vs 清，口型相同。" },
  },
  {
    id: "h",
    ipa: "h",
    kind: "consonant",
    nameZh: "清辅音 h",
    groupZh: "声门摩擦",
    writing: {
      strokes: "普通小写 h。",
      hint: "竖 + 拱。",
      similarTo: "字母 h",
    },
    memory: {
      mouth: "声门微开，呵气而出，口腔无阻碍。he、hot、hello。",
      mnemonic: "呵气。不要读成汉语「喝」的舌根摩擦那么重。",
      chineseLike: "轻的「呵」。",
      pitfall: "漏读（hour 例外，h 不发音）或读得太重。",
    },
    consonant: { place: "glottal", manner: "fricative", voiced: false },
    examples: [
      { word: "he", ipa: "hiː", zh: "他" },
      { word: "hot", ipa: "hɒt", zh: "热" },
      { word: "hello", ipa: "həˈləʊ", zh: "你好" },
    ],
  },
  {
    id: "tʃ",
    ipa: "tʃ",
    kind: "consonant",
    nameZh: "清破擦音 tʃ",
    groupZh: "破擦音",
    writing: {
      strokes: "t 与 ʃ 连写，可加连字符感，保持同一高度。",
      hint: "一个音，不是 t 再加 sh。",
      similarTo: "t + ʃ",
    },
    memory: {
      mouth: "舌尖抵齿龈后部，爆破后立刻接 ʃ 的摩擦。chair、teach、watch。",
      mnemonic: "拼音 ch 的感觉，但舌更靠后。",
      chineseLike: "近似拼音 ch。",
      pitfall: "拆成 t + s。",
    },
    consonant: { place: "post-alveolar", manner: "affricate", voiced: false },
    examples: [
      { word: "chair", ipa: "tʃeə", zh: "椅子" },
      { word: "teach", ipa: "tiːtʃ", zh: "教" },
      { word: "watch", ipa: "wɒtʃ", zh: "手表" },
    ],
    contrast: { with: "dʒ", tip: "清 vs 浊。cheap · jeep。" },
  },
  {
    id: "dʒ",
    ipa: "dʒ",
    kind: "consonant",
    nameZh: "浊破擦音 dʒ",
    groupZh: "破擦音",
    writing: {
      strokes: "d 与 ʒ 连写。",
      hint: "一个音。job、age、juice。",
      similarTo: "d + ʒ",
    },
    memory: {
      mouth: "同 /tʃ/，声带振动。",
      mnemonic: "拼音 j 加上浊音。jeep、orange、just。",
      chineseLike: "近似拼音 j，要带声。",
      pitfall: "读成 /z/ 或 /j/。",
    },
    consonant: { place: "post-alveolar", manner: "affricate", voiced: true },
    examples: [
      { word: "job", ipa: "dʒɒb", zh: "工作" },
      { word: "age", ipa: "eɪdʒ", zh: "年龄" },
      { word: "just", ipa: "dʒʌst", zh: "刚刚" },
    ],
    contrast: { with: "tʃ", tip: "摸喉结。" },
  },
  {
    id: "ts",
    ipa: "ts",
    kind: "consonant",
    nameZh: "清破擦音 ts",
    groupZh: "DJ 破擦音",
    writing: {
      strokes: "t 与 s 连写。",
      hint: "中学 DJ 表把它单列，实际是 /t/+/s/ 的结合。",
      similarTo: "t + s",
    },
    memory: {
      mouth: "舌尖抵齿龈爆破后立即摩擦。cats、its、students。",
      mnemonic: "多出现在复数或第三人称 -ts。",
      chineseLike: "拼音 c。",
      pitfall: "中间插入元音。",
    },
    consonant: { place: "alveolar", manner: "affricate", voiced: false },
    examples: [
      { word: "cats", ipa: "kæts", zh: "猫（复数）" },
      { word: "its", ipa: "ɪts", zh: "它的" },
      { word: "students", ipa: "ˈstjuːdnts", zh: "学生" },
    ],
    contrast: { with: "dz", tip: "清 vs 浊。" },
  },
  {
    id: "dz",
    ipa: "dz",
    kind: "consonant",
    nameZh: "浊破擦音 dz",
    groupZh: "DJ 破擦音",
    writing: {
      strokes: "d 与 z 连写。",
      hint: "DJ 表单列。",
      similarTo: "d + z",
    },
    memory: {
      mouth: "同 /ts/，声带振动。beds、hands、reads。",
      mnemonic: "浊音后的复数 -s 常读这个。",
      chineseLike: "拼音 z。",
      pitfall: "读成清音 ts。",
    },
    consonant: { place: "alveolar", manner: "affricate", voiced: true },
    examples: [
      { word: "beds", ipa: "bedz", zh: "床（复数）" },
      { word: "hands", ipa: "hændz", zh: "手（复数）" },
      { word: "reads", ipa: "riːdz", zh: "读（三单）" },
    ],
    contrast: { with: "ts", tip: "浊 vs 清。" },
  },
  {
    id: "tr",
    ipa: "tr",
    kind: "consonant",
    nameZh: "清破擦音 tr",
    groupZh: "DJ 破擦音",
    writing: {
      strokes: "t 与 r 连写。",
      hint: "DJ 中学表单列，实际是辅音丛。",
      similarTo: "t + r",
    },
    memory: {
      mouth: "舌尖抵齿龈后立刻过渡到 /r/ 的接近音。tree、train、true。",
      mnemonic: "tre- 不要拆成特-瑞。",
      chineseLike: "近似「戳」的一声带出 r。",
      pitfall: "中间加元音：teree。",
    },
    consonant: { place: "post-alveolar", manner: "affricate", voiced: false },
    examples: [
      { word: "tree", ipa: "triː", zh: "树" },
      { word: "train", ipa: "treɪn", zh: "火车" },
      { word: "true", ipa: "truː", zh: "真的" },
    ],
    contrast: { with: "dr", tip: "清 vs 浊。" },
  },
  {
    id: "dr",
    ipa: "dr",
    kind: "consonant",
    nameZh: "浊破擦音 dr",
    groupZh: "DJ 破擦音",
    writing: {
      strokes: "d 与 r 连写。",
      hint: "DJ 表单列。",
      similarTo: "d + r",
    },
    memory: {
      mouth: "同 /tr/，声带振动。dream、drive、dress。",
      mnemonic: "浊的 tre。",
      chineseLike: "近似「卓」。",
      pitfall: "拆成 de-rui。",
    },
    consonant: { place: "post-alveolar", manner: "affricate", voiced: true },
    examples: [
      { word: "dream", ipa: "driːm", zh: "梦" },
      { word: "drive", ipa: "draɪv", zh: "驾驶" },
      { word: "dress", ipa: "dres", zh: "裙子" },
    ],
    contrast: { with: "tr", tip: "浊 vs 清。" },
  },
  {
    id: "m",
    ipa: "m",
    kind: "consonant",
    nameZh: "鼻音 m",
    groupZh: "鼻音",
    writing: {
      strokes: "普通小写 m。",
      hint: "两拱。",
      similarTo: "字母 m",
    },
    memory: {
      mouth: "双唇闭合，气流走鼻腔，声带振动。me、home、swim。",
      mnemonic: "拼音 m。闭嘴出声。",
      chineseLike: "拼音 m。",
      pitfall: "词尾要闭唇，不要改成 n。",
    },
    consonant: { place: "bilabial", manner: "nasal", voiced: true },
    examples: [
      { word: "me", ipa: "miː", zh: "我" },
      { word: "home", ipa: "həʊm", zh: "家" },
      { word: "swim", ipa: "swɪm", zh: "游泳" },
    ],
  },
  {
    id: "n",
    ipa: "n",
    kind: "consonant",
    nameZh: "鼻音 n",
    groupZh: "鼻音",
    writing: {
      strokes: "普通小写 n。",
      hint: "一拱。",
      similarTo: "字母 n",
    },
    memory: {
      mouth: "舌尖抵齿龈，气流走鼻腔。no、sun、night。",
      mnemonic: "拼音 n。",
      chineseLike: "拼音 n。",
      pitfall: "词尾不要读成 ng，也别吞掉。",
    },
    consonant: { place: "alveolar", manner: "nasal", voiced: true },
    examples: [
      { word: "no", ipa: "nəʊ", zh: "不" },
      { word: "sun", ipa: "sʌn", zh: "太阳" },
      { word: "night", ipa: "naɪt", zh: "夜晚" },
    ],
    contrast: { with: "ŋ", tip: "n 舌尖，ŋ 舌根。sin · sing。" },
  },
  {
    id: "ŋ",
    ipa: "ŋ",
    kind: "consonant",
    nameZh: "鼻音 ŋ",
    groupZh: "鼻音",
    writing: {
      strokes: "n 的右腿拉长左勾，像带尾巴的 n。",
      hint: "叫 eng，不要写成 ng 两个字母。",
      similarTo: "带尾的 n",
    },
    memory: {
      mouth: "舌后抵软腭，气流走鼻腔。sing、long、think。",
      mnemonic: "拼音 ng。英语里它不出现在词首。",
      chineseLike: "拼音后鼻音 ng。",
      pitfall: "后面多加 /g/：sing 不是 sing-g。",
    },
    consonant: { place: "velar", manner: "nasal", voiced: true },
    examples: [
      { word: "sing", ipa: "sɪŋ", zh: "唱" },
      { word: "long", ipa: "lɒŋ", zh: "长" },
      { word: "think", ipa: "θɪŋk", zh: "想" },
    ],
    contrast: { with: "n", tip: "舌根贴软腭，不是舌尖。" },
  },
  {
    id: "l",
    ipa: "l",
    kind: "consonant",
    nameZh: "边音 l",
    groupZh: "近音",
    writing: {
      strokes: "普通小写 l。",
      hint: "一竖。",
      similarTo: "字母 l",
    },
    memory: {
      mouth: "舌尖抵齿龈，气流从舌两侧流出。词首清晰（light l），词尾软腭化（dark l）。",
      mnemonic: "like 的 l 像拼音 l；full、people 的词尾 l 舌后要抬。",
      chineseLike: "拼音 l，词尾更暗。",
      pitfall: "词尾读成 /əʊ/ 或省略。people 不是 peopo。",
    },
    consonant: { place: "alveolar", manner: "lateral", voiced: true },
    examples: [
      { word: "like", ipa: "laɪk", zh: "喜欢" },
      { word: "light", ipa: "laɪt", zh: "光" },
      { word: "full", ipa: "fʊl", zh: "满" },
    ],
    contrast: { with: "r", tip: "l 舌尖抵住，r 舌尖接近但不贴死。" },
  },
  {
    id: "r",
    ipa: "r",
    kind: "consonant",
    nameZh: "近音 r",
    groupZh: "近音",
    writing: {
      strokes: "普通小写 r。DJ 英式词尾 r 通常不发音。",
      hint: "只在元音前发这个音。",
      similarTo: "字母 r",
    },
    memory: {
      mouth: "舌尖上卷接近齿龈后部，不贴死，唇略圆。red、right、very。",
      mnemonic: "英式：car 里的 r 不读。只在 red、right 这种元音前读。",
      chineseLike: "不是汉语的卷舌「日」，气流更通。",
      pitfall: "用拼音 r 代替，或在词尾硬加卷舌。",
    },
    consonant: { place: "post-alveolar", manner: "approximant", voiced: true },
    examples: [
      { word: "red", ipa: "red", zh: "红" },
      { word: "right", ipa: "raɪt", zh: "对" },
      { word: "very", ipa: "ˈveri", zh: "非常" },
    ],
    contrast: { with: "l", tip: "r 不接触齿龈。" },
  },
  {
    id: "w",
    ipa: "w",
    kind: "consonant",
    nameZh: "近音 w",
    groupZh: "近音",
    writing: {
      strokes: "普通小写 w。",
      hint: "双 v。",
      similarTo: "字母 w",
    },
    memory: {
      mouth: "双唇收圆前突，舌后抬，随即滑向后面的元音。we、win、what。",
      mnemonic: "先做 /uː/ 的口型再马上离开。",
      chineseLike: "拼音 w / 「乌」起势。",
      pitfall: "读成 /v/。wine 不是 vine。",
    },
    consonant: { place: "labial-velar", manner: "approximant", voiced: true },
    examples: [
      { word: "we", ipa: "wiː", zh: "我们" },
      { word: "win", ipa: "wɪn", zh: "赢" },
      { word: "what", ipa: "wɒt", zh: "什么" },
    ],
    contrast: { with: "v", tip: "w 圆唇不咬唇。" },
  },
  {
    id: "j",
    ipa: "j",
    kind: "consonant",
    nameZh: "近音 j",
    groupZh: "近音",
    writing: {
      strokes: "普通小写 j（有点有尾）。",
      hint: "音标 /j/ 对应字母 y，不是英语字母 j 的音。",
      similarTo: "字母 j，读音却是 y",
    },
    memory: {
      mouth: "舌前抬向硬腭，滑向后面的元音。yes、you、year。",
      mnemonic: "拼音 y。yes 不是 jes。",
      chineseLike: "拼音 y / 「衣」起势。",
      pitfall: "把字母 j 的单词（job）错认成这个音。job 是 /dʒ/。",
    },
    consonant: { place: "palatal", manner: "approximant", voiced: true },
    examples: [
      { word: "yes", ipa: "jes", zh: "是" },
      { word: "you", ipa: "juː", zh: "你" },
      { word: "year", ipa: "jɪə", zh: "年" },
    ],
    contrast: { with: "dʒ", tip: "yes /jes/ · job /dʒɒb/。字母长得像 j，音却是 y。" },
  },
];

export const PHONEME_MAP = new Map(PHONEMES.map((p) => [p.id, p]));

export function getPhoneme(id: string): Phoneme | undefined {
  return PHONEME_MAP.get(id);
}

export function kindLabel(kind: PhonemeKind): string {
  if (kind === "monophthong") return "单元音";
  if (kind === "diphthong") return "双元音";
  return "辅音";
}

export function phonemesOfKind(kind: PhonemeKind): Phoneme[] {
  return PHONEMES.filter((p) => p.kind === kind);
}

export function groupedPhonemes(): { group: string; items: Phoneme[] }[] {
  const groups: { group: string; items: Phoneme[] }[] = [];
  for (const p of PHONEMES) {
    const last = groups[groups.length - 1];
    if (last && last.group === p.groupZh) last.items.push(p);
    else groups.push({ group: p.groupZh, items: [p] });
  }
  return groups;
}
