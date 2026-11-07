/* 創意故事模式：離線規則式「想像故事」產生器（非 AI，不代表孩子的需求）。 */
(function (root) {
  "use strict";
  function rng(seed) { var a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function pick(r, a) { return a[Math.floor(r() * a.length)]; }
  function shuffle(r, a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  var MW = { "魚": "條", "大象": "頭", "馬": "匹", "牛": "頭", "蝴蝶": "隻" };
  var TOY_CHARS = { "娃娃": 1, "泰迪熊": 1, "機器人玩具": 1 };
  var APPL = { "電視": ["打開電視看卡通", "和大家一起看電視"], "冷氣": ["打開冷氣，房間一下子變涼了", "吹著涼涼的冷氣"], "電風扇": ["對著電風扇「啊——」地說話", "吹著電風扇"],
    "電燈": ["啪一聲打開電燈", "打開電燈，房間亮起來了"], "冰箱": ["打開冰箱找點心", "在冰箱裡發現了驚喜"], "微波爐": ["用微波爐把晚餐熱一熱", "聽微波爐「叮」一聲"], "電鍋": ["幫忙用電鍋煮飯", "等電鍋把飯煮熟"],
    "烤麵包機": ["用烤麵包機烤出香香的麵包", "看麵包從烤麵包機跳出來"], "洗衣機": ["把衣服丟進洗衣機", "看洗衣機轉呀轉"], "吸塵器": ["推著吸塵器打掃", "用吸塵器把地板吸乾淨"],
    "掃地機器人": ["看掃地機器人轉來轉去", "跟著掃地機器人在家裡繞圈圈"], "吹風機": ["用吹風機把頭髮吹乾", "被吹風機吹得頭髮亂飛"], "手機": ["用手機拍了一張照片", "用手機和家人視訊"],
    "平板": ["用平板畫了一幅畫", "在平板上看圖畫書"], "電腦": ["用電腦查了很多有趣的資料", "在電腦上玩小遊戲"] };
  var SCHOOL = { "書": ["打開一本書", "讀了一本好看的書"], "書包": ["背起書包", "把東西收進書包"], "剪刀": ["用剪刀剪出一顆星星", "小心地用剪刀剪紙"], "膠水": ["用膠水把紙黏起來", "用膠水做了一張卡片"],
    "尺": ["用尺量一量有多長", "用尺畫了一條直直的線"], "筆記本": ["在筆記本上寫下今天的事", "在筆記本上畫畫"], "橡皮擦": ["用橡皮擦擦掉畫錯的地方"], "削鉛筆機": ["用削鉛筆機把鉛筆削尖"],
    "蠟筆": ["用蠟筆畫了一道彩虹", "拿出蠟筆塗顏色"], "彩色筆": ["用彩色筆畫了一張圖", "拿出彩色筆畫畫"], "鉛筆": ["用鉛筆寫字", "拿起鉛筆畫了一張圖"], "原子筆": ["用原子筆寫了一張小卡片"] };
  var DAILY = { "牙刷": ["拿起牙刷刷牙"], "牙膏": ["擠了一點牙膏"], "肥皂": ["用肥皂把手洗得香香的"], "洗髮精": ["用洗髮精洗頭，泡泡好多"], "毛巾": ["用毛巾擦乾身體"], "面紙": ["拿面紙擦擦鼻子"],
    "梳子": ["用梳子梳頭髮"], "鏡子": ["對著鏡子做鬼臉"], "杯子": ["拿杯子裝了一杯水"], "碗": ["端著一個碗"], "盤子": ["把點心放在盤子上"], "筷子": ["拿起筷子"], "湯匙": ["拿起湯匙"], "垃圾桶": ["把垃圾丟進垃圾桶"] };
  var FURN = { "床": ["跳上床", "躺在床上"], "椅子": ["坐在椅子上"], "沙發": ["窩在沙發上"], "桌子": ["把東西擺在桌子上"], "書桌": ["坐在書桌前"], "枕頭": ["抱著枕頭"], "被子": ["蓋上暖暖的被子"],
    "地毯": ["在地毯上打滾"], "窗簾": ["拉開窗簾"], "衣櫃": ["打開衣櫃"], "書架": ["從書架上拿了一本書"], "檯燈": ["打開檯燈"] };
  var ACT = { "出去玩": ["出去玩"], "唱歌": ["唱了一首歌", "開心地唱歌"], "游泳": ["跳進水裡游泳"], "玩": ["玩了一個遊戲"], "畫畫": ["畫了一幅畫"], "看書": ["看了一本書"], "看電視": ["看電視"],
    "跑步": ["跑了一大圈"], "踢球": ["踢球", "把球踢得好遠"], "騎腳踏車": ["騎著腳踏車兜風"] };
  var NEED = { "上廁所": ["先去上廁所"], "休息": ["休息了一下"], "吃藥": ["乖乖把藥吃了"], "幫忙": ["請大家來幫忙"], "想喝水": ["喝了一大杯水"], "想睡覺": ["打了一個大哈欠，想睡覺了"],
    "我累了": ["覺得有點累"], "我餓了": ["肚子咕嚕咕嚕叫"], "抱抱": ["給大家一個大大的抱抱"], "換衣服": ["換上乾淨的衣服"] };
  var BODY = { "頭": ["點點頭"], "手": ["揮揮手"], "腳": ["踢踢腳"], "眼睛": ["眨眨眼睛"], "嘴巴": ["張大嘴巴"], "肚子痛": ["肚子有點痛，休息一下就好多了"], "頭痛": ["頭有點痛，喝了水休息後好多了"] };
  var WEATHER = { "下雨": ["下雨的早上", "滴滴答答下著雨的時候"], "下雪": ["下雪的那天", "白白的雪花飄下來的時候"], "太陽": ["太陽暖暖的早上", "陽光很好的一天"], "彩虹": ["天上出現彩虹的時候", "雨停後，天上掛著彩虹"],
    "很冷": ["很冷很冷的冬天", "冷得發抖的早上"], "很熱": ["熱呼呼的夏天", "很熱的中午"], "打雷": ["轟隆隆打雷的晚上", "外面打雷的時候"], "起霧": ["起霧的早上", "霧濛濛的時候"], "雲": ["白雲飄飄的下午"], "風": ["風呼呼吹的一天"] };
  var REPLY = { "是": "「是！」", "不是": "「不是喔！」", "不要": "「不要！」", "還要": "「還要！」", "請": "「請！」", "好的": "「好的！」", "謝謝": "「謝謝！」", "對不起": "「對不起。」", "再見": "「再見！」", "等等": "「等等我！」" };
  var THEMES = {
    "生活": { open: ["有一天", "星期六早上", "放學後", "今天下午"], link: ["接著", "然後", "後來"], end: ["真是開心的一天！", "這一天過得好充實。", "大家都笑得好開心。"], twist: ["大家一起"] },
    "冒險": { open: ["很久很久以前", "某個神秘的早上", "有一天"], link: ["突然", "沒想到", "就在這時候"], end: ["這真是一場奇妙的冒險！", "冒險結束了，大家約好下次再出發。", "原來最棒的寶藏就是好朋友。"], twist: ["勇敢地"] },
    "溫馨": { open: ["一個暖暖的早上", "晚飯後", "有一天"], link: ["慢慢地", "接著", "後來"], end: ["大家抱在一起，覺得好溫暖。", "那是一個好溫柔的一天。", "心裡暖暖的，好幸福。"], twist: ["和大家一起"] }
  };
  var DEFAULT_HERO = ["小熊", "小兔子", "小企鵝", "小貓咪"];

  function measure(label) { return "一" + (MW[label] || "隻") + label; }

  function story(cards, theme, seed) {
    cards = (cards || []).filter(Boolean);
    if (!cards.length) return { ok: false, message: "請先點幾張圖卡。" };
    var T = THEMES[theme] || THEMES["生活"], r = rng(seed || 1);
    var heroes = [], places = [], rides = [], weather = [], events = [], moods = [], replies = [], mods = [], used = {};
    cards.forEach(function (c, i) {
      var L = c.label, C = c.category;
      if (used[C + L]) return; used[C + L] = 1;
      if (C === "人物" || C === "動物" || TOY_CHARS[L]) heroes.push({ L: L, C: C });
      else if (C === "地點") places.push(L);
      else if (C === "交通工具") rides.push(L);
      else if (C === "天氣") weather.push(L);
      else if (C === "心情") moods.push(L);
      else if (C === "回應") replies.push(L);
      else if (C === "顏色／形狀" && /色$/.test(L)) mods.push(L);
      else events.push(c);
    });
    // 主角：第一個人物／動物／玩偶；否則用故事角色
    var hero = heroes.length ? heroes[0] : null;
    var heroName = hero ? (hero.C === "動物" ? "小" + hero.L.slice(-1) === "小" ? hero.L : hero.L : hero.L) : pick(r, DEFAULT_HERO);
    if (hero && hero.C === "動物") heroName = hero.L.length === 1 ? "小" + hero.L : hero.L;
    var friends = heroes.slice(1).map(function (h) { return h.C === "動物" ? measure(h.L) : h.L; });
    var modQueue = mods.slice();
    function mod() { return modQueue.length ? modQueue.shift() + "的" : ""; }
    function evPhrase(c) {
      var L = c.label, C = c.category, m;
      if (C === "食物" || C === "水果" || C === "蔬菜" || C === "點心") { m = mod(); return pick(r, ["吃了" + m + L, "咬了一大口" + m + L, "把" + m + L + "分給大家吃", "發現桌上有" + m + L]); }
      if (C === "飲料") return pick(r, ["喝了一杯" + L, "咕嚕咕嚕喝光了" + L]);
      if (C === "玩具") { m = mod(); return pick(r, ["拿出" + m + L + "來玩", "和" + m + L + "玩了好久"]); }
      if (C === "衣服") { m = mod(); return (/帽子|手套|圍巾/.test(L) ? "戴上" : "穿上") + m + L; }
      if (C === "電器" && APPL[L]) return pick(r, APPL[L]);
      if (C === "學校用品" && SCHOOL[L]) return pick(r, SCHOOL[L]);
      if (C === "日用品" && DAILY[L]) return pick(r, DAILY[L]);
      if (C === "家具" && FURN[L]) return pick(r, FURN[L]);
      if (C === "活動" && ACT[L]) return pick(r, ACT[L]);
      if (C === "需求" && NEED[L]) return pick(r, NEED[L]);
      if (C === "身體" && BODY[L]) return pick(r, BODY[L]);
      if (C === "顏色／形狀") return pick(r, ["畫了一個" + L, "找到一個" + L + "形狀的東西", "用手比出一個" + L]);
      if (C === "地點") return "去了" + L;
      return "看到了「" + L + "」";
    }
    var parts = [];
    var open = weather.length ? pick(r, WEATHER[weather[0]] || ["那天"]) : pick(r, T.open);
    var extraWeather = weather.slice(1).map(function (w) { return (WEATHER[w] || [w])[0].replace(/的(早上|時候|一天|那天|下午|晚上|中午|冬天|夏天)$/, ""); });
    var withF = friends.length ? "和" + friends.join("、") : "";
    var s1 = open + "，" + heroName + withF;
    if (rides.length || places.length) {
      var ride = rides.length ? (/腳踏車|機車|滑板車/.test(rides[0]) ? "騎著" : "坐著") + rides[0] : "";
      var dest = places.length ? "去" + places[0] : "出發去兜風";
      s1 += pick(r, [ride + dest, (ride ? ride + "，" : "") + T.twist[0] + (places.length ? "前往" + places[0] : "出發了")]);
      rides.slice(1).forEach(function (x) { s1 += "，又換搭" + x; });
      places.slice(1).forEach(function (x) { s1 += "，又去了" + x; });
    } else s1 += pick(r, ["待在家裡", "在家裡東看看西看看", "準備做點特別的事"]);
    if (extraWeather.length) s1 += "，外面還" + extraWeather.join("又");
    parts.push(s1 + "。");
    var evs = shuffle(r, events).map(evPhrase);
    if (modQueue.length) evs.push("看到一個" + modQueue.join("、") + "的東西");
    if (evs.length) {
      var link = pick(r, T.link), s2 = link + "，" + heroName + evs[0];
      for (var i = 1; i < evs.length; i++) s2 += (i === evs.length - 1 && evs.length > 2 ? "，最後" : pick(r, ["，還", "，又", "，然後"])) + evs[i];
      parts.push(s2 + "。");
    }
    var end = [];
    if (replies.length) end.push(heroName + "大聲說：" + replies.map(function (x) { return REPLY[x] || "「" + x + "」"; }).join(""));
    if (moods.length) {
      var like = moods.filter(function (m) { return m === "喜歡" || m === "討厭"; })[0], feel = moods.filter(function (m) { return m !== "喜歡" && m !== "討厭"; });
      if (feel.length) end.push(heroName + "覺得好" + feel.join("又"));
      if (like) end.push(heroName + (like === "喜歡" ? "說這是最喜歡的一天" : "說有一件事好討厭，不過還是撐過去了"));
    }
    var tail = end.length ? end.join("，") + "。" : pick(r, T.end);
    if (end.length && r() < 0.5) tail += pick(r, T.end);
    parts.push(tail);
    return { ok: true, text: parts.join("").replace(/」。/g, "」") };
  }

  function StoryComposer() { this.key = ""; this.seen = []; this.seed = Math.floor(Math.random() * 1e9); }
  StoryComposer.prototype.next = function (cards, theme) {
    var key = theme + "|" + (cards || []).map(function (c) { return c.category + ":" + c.label; }).join("|");
    if (key !== this.key) { this.key = key; this.seen = []; }
    var best = null;
    for (var t = 0; t < 40; t++) {
      var res = story(cards, theme, ++this.seed);
      if (!res.ok) return res;
      if (this.seen.indexOf(res.text) < 0) { best = res; break; }
    }
    if (!best) { this.seen = []; best = story(cards, theme, ++this.seed); }
    this.seen.push(best.text);
    return best;
  };
  var api = { story: story, StoryComposer: StoryComposer, THEMES: Object.keys(THEMES) };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.CardStory = api;
})(this);
