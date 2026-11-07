/* 幫我組句：離線規則式組句（非 AI）。依圖卡分類與標籤中繼資料，只補必要的文法字。 */
(function (root) {
  "use strict";
  var VERB_BY_CAT = { "食物": "吃", "水果": "吃", "蔬菜": "吃", "點心": "吃", "飲料": "喝", "地點": "去", "動物": "看", "玩具": "玩", "日用品": "用", "學校用品": "用" };
  var VERB_BY_LABEL = {
    "電器": { "電視": "看", "冷氣": "開", "電風扇": "開", "電燈": "開", "冰箱": "開", "_": "用" },
    "衣服": { "帽子": "戴", "手套": "戴", "圍巾": "戴", "_": "穿" },
    "學校用品": { "書": "看", "書包": "要" },
    "交通工具": { "腳踏車": "騎", "機車": "騎", "滑板車": "騎", "_": "坐" },
    "家具": { "椅子": "坐", "沙發": "坐", "床": "上", "檯燈": "開", "_": "要" }
  };
  var GIVEABLE = { "吃": 1, "喝": 1, "用": 1, "玩": 1, "要": 1, "穿": 1, "戴": 1 };
  var TOGETHER = { "去": 1, "玩": 1, "出去玩": 1, "唱歌": 1, "游泳": 1, "跑步": 1, "畫畫": 1, "看": 1, "踢": 1, "騎": 1, "坐": 1 };
  var NEEDS = {
    "上廁所": { v: "上", o: "廁所" }, "休息": { v: "休息" }, "吃藥": { v: "吃", o: "藥" }, "想喝水": { v: "喝", o: "水" },
    "想睡覺": { v: "睡覺" }, "換衣服": { v: "換", o: "衣服" },
    "幫忙": { s: ["請幫我", "我需要幫忙", "可以幫我嗎？"], n: ["我不需要幫忙"] },
    "抱抱": { s: ["抱抱我", "我要抱抱", "可以抱我嗎？"], n: ["不要抱"] },
    "我累了": { s: ["我累了", "我好累"], n: ["我不累"] },
    "我餓了": { s: ["我餓了", "我肚子餓了"], n: ["我不餓"] }
  };
  var ACTS = { "出去玩": { v: "出去玩" }, "唱歌": { v: "唱歌" }, "游泳": { v: "游泳" }, "玩": { v: "玩", bare: true }, "畫畫": { v: "畫畫" },
    "看書": { v: "看", o: "書" }, "看電視": { v: "看", o: "電視" }, "跑步": { v: "跑步" }, "踢球": { v: "踢", o: "球" }, "騎腳踏車": { v: "騎", o: "腳踏車" } };
  var BODY_STATES = { "肚子痛": { s: ["我肚子痛", "我的肚子好痛"], n: ["我肚子不痛"] }, "頭痛": { s: ["我頭痛", "我的頭好痛"], n: ["我頭不痛"] } };
  var WEATHER = {
    "下雨": { s: ["下雨了", "外面在下雨"] }, "下雪": { s: ["下雪了", "外面在下雪"] }, "太陽": { s: ["出太陽了", "今天有太陽"] },
    "彩虹": { s: ["有彩虹", "你看，有彩虹"] }, "很冷": { s: ["好冷", "我覺得很冷"], n: ["我不冷"] }, "很熱": { s: ["好熱", "我覺得很熱"], n: ["我不熱"] },
    "打雷": { s: ["打雷了", "外面在打雷"] }, "起霧": { s: ["起霧了", "外面起霧了"] }, "雲": { s: ["有很多雲", "天上有雲"] }, "風": { s: ["風好大", "外面在颳風"] }
  };
  var MOODS = { "開心": 1, "難過": 1, "生氣": 1, "害怕": 1, "無聊": 1, "興奮": 1 };
  var INTERJ = { "是": 1, "不是": 1, "好的": 1, "謝謝": 1, "對不起": 1, "再見": 1, "等等": 1 };

  function verbFor(c) {
    var m = VERB_BY_LABEL[c.category];
    if (m) return m[c.label] || m._ || VERB_BY_CAT[c.category];
    return VERB_BY_CAT[c.category];
  }
  function classify(c) {
    var L = c.label, C = c.category;
    if (C === "回應") {
      if (L === "不要") return { k: "neg" };
      if (L === "還要") return { k: "more" };
      if (L === "請") return { k: "please" };
      if (INTERJ[L]) return { k: "interj", t: L };
    }
    if (C === "人物") return { k: "person", t: L };
    if (C === "需求" && NEEDS[L]) return NEEDS[L].s ? { k: "state", s: NEEDS[L].s, n: NEEDS[L].n } : { k: "vo", v: NEEDS[L].v, o: NEEDS[L].o, src: L };
    if (C === "活動" && ACTS[L]) return { k: "vo", v: ACTS[L].v, o: ACTS[L].o, bare: ACTS[L].bare, src: L };
    if (C === "心情") {
      if (L === "喜歡" || L === "討厭") return { k: "like", t: L };
      if (MOODS[L]) return { k: "state", s: ["我覺得很" + L, "我很" + L], n: ["我不" + L] };
    }
    if (C === "身體") return BODY_STATES[L] ? { k: "state", s: BODY_STATES[L].s, n: BODY_STATES[L].n } : { k: "body", t: L };
    if (C === "天氣" && WEATHER[L]) return { k: "state", s: WEATHER[L].s, n: WEATHER[L].n };
    if (C === "顏色／形狀") return { k: "mod", t: L };
    var v = verbFor(c);
    if (v) return { k: "obj", v: v, o: L, cat: C };
    return { k: "unknown", t: L };
  }
  function end(s) { return /[。？！]$/.test(s) ? s : s + "。"; }
  function uniq(a) { var seen = {}, r = []; for (var i = 0; i < a.length; i++) if (!seen[a[i]]) { seen[a[i]] = 1; r.push(a[i]); } return r; }
  function joinAnd(a) { return a.length < 2 ? (a[0] || "") : a.slice(0, -1).join("、") + "和" + a[a.length - 1]; }
  function fail(msg, cards) { return { ok: false, message: msg, fallback: cards.map(function (c) { return c.label; }).join("") }; }

  function compose(cards) {
    cards = (cards || []).filter(Boolean);
    if (!cards.length) return { ok: false, message: "請先在上方句子列放入圖卡。", fallback: "" };
    // 去除連續重複
    var list = []; for (var i = 0; i < cards.length; i++) if (!list.length || list[list.length - 1].label !== cards[i].label) list.push(cards[i]);
    var toks = list.map(function (c, idx) { var t = classify(c); t.idx = idx; t.label = c.label; return t; });
    var unknown = toks.filter(function (t) { return t.k === "unknown"; });
    if (unknown.length) return fail("「" + unknown.map(function (t) { return t.t; }).join("、") + "」是自訂或無法判斷的圖卡，先照原本順序排好，你可以自己修改。", list);
    var neg = toks.some(function (t) { return t.k === "neg"; }), more = toks.some(function (t) { return t.k === "more"; }), please = toks.some(function (t) { return t.k === "please"; });
    var persons = toks.filter(function (t) { return t.k === "person"; }).map(function (t) { return t.t; });
    var interj = toks.filter(function (t) { return t.k === "interj"; });
    var states = toks.filter(function (t) { return t.k === "state"; });
    var likes = toks.filter(function (t) { return t.k === "like"; });
    var mods = toks.filter(function (t) { return t.k === "mod"; });
    var bodies = toks.filter(function (t) { return t.k === "body"; });
    var vos = toks.filter(function (t) { return t.k === "vo"; });
    var objs = toks.filter(function (t) { return t.k === "obj"; });
    var firstContent = toks.filter(function (t) { return t.k !== "interj"; })[0];
    var hasYes = interj.some(function (t) { return t.t === "是"; }), hasNo = interj.some(function (t) { return t.t === "不是"; });

    if (neg && more) return fail("同時有「不要」和「還要」，意思不確定。請拿掉其中一張。", list);
    if (hasYes && hasNo) return fail("同時有「是」和「不是」，意思不確定。", list);
    if ((hasYes || hasNo) && neg) return fail("「是／不是」和「不要」放在一起，意思不確定。", list);
    if (bodies.length) return fail("「" + bodies.map(function (t) { return t.t; }).join("、") + "」不確定要表達什麼（例如：痛、洗、受傷）。請直接播放或自己修改句子。", list);
    if (likes.length > 1) return fail("同時有「喜歡」和「討厭」，意思不確定。", list);
    if (likes.length && likes[0].t === "討厭" && neg) return fail("「不要」加「討厭」意思不確定。", list);
    if (more && (states.length || likes.length)) return fail("「還要」和這些圖卡放在一起，意思不確定。", list);

    // 顏色修飾：套到後面最近的物品，沒有就套到前面的
    var modText = {};
    mods.forEach(function (m) {
      var target = objs.filter(function (o) { return o.idx > m.idx; })[0] || objs.filter(function (o) { return o.idx < m.idx; }).slice(-1)[0];
      if (target) modText[target.idx] = (modText[target.idx] || "") + m.t + "的";
    });
    if (mods.length && !objs.length) {
      if (toks.length === mods.length) return { ok: true, alternatives: uniq([end(joinAnd(mods.map(function (m) { return m.t; })))]) };
      return fail("顏色／形狀要搭配一個物品圖卡才知道在說什麼。", list);
    }
    function objName(o) { return (modText[o.idx] || "") + o.o; }

    // 「是／不是」+ 純名詞：確認或更正
    if ((hasYes || hasNo) && objs.length && !vos.length && !states.length && !likes.length && !persons.length && !please && !more) {
      var nm = joinAnd(objs.map(objName));
      return { ok: true, alternatives: uniq(hasYes ? [end("是" + nm), end("對，是" + nm)] : [end("不是" + nm), end("這不是" + nm)]) };
    }

    // 「玩」單獨動詞：只接玩具
    var bare = vos.filter(function (v) { return v.bare; });
    if (bare.length) {
      var nonToy = objs.filter(function (o) { return o.v !== "玩"; });
      var toyObjs = objs.filter(function (o) { return o.v === "玩"; });
      if (nonToy.length && toyObjs.length === 0) return fail("「玩」和「" + nonToy.map(function (o) { return o.o; }).join("、") + "」放在一起意思不確定，請調整圖卡。", list);
    }

    // 以動詞分組 → 子句
    var groups = [], gmap = {};
    function addTo(v, o, idx, cat) {
      if (!gmap[v]) { gmap[v] = { v: v, os: [], idx: idx, cats: {} }; groups.push(gmap[v]); }
      if (o && gmap[v].os.indexOf(o) < 0) gmap[v].os.push(o);
      if (cat) gmap[v].cats[cat] = 1;
    }
    vos.forEach(function (t) { addTo(t.v, t.o, t.idx); });
    objs.forEach(function (o) { addTo(o.v, objName(o), o.idx, o.cat); });
    groups.sort(function (a, b) { return a.idx - b.idx; });

    if (neg && ((likes.length ? 1 : groups.length) + states.length) > 1) return fail("「不要」後面有好幾件事，不確定是不要哪一個。請一次只放一件事。", list);

    var clauses = [];
    if (likes.length) {
      var lk = likes[0].t, pre = (neg && lk === "喜歡") ? "我不喜歡" : "我" + lk;
      if (!groups.length) clauses.push(lk === "喜歡" ? (neg ? ["我不喜歡"] : ["我喜歡", "我很喜歡"]) : ["我討厭", "我不喜歡"]);
      else {
        var phr = groups.map(function (g) { return g.v + joinAnd(g.os); }), nouns = [];
        groups.forEach(function (g) { nouns = nouns.concat(g.os); });
        var allObj = groups.every(function (g) { return g.os.length; });
        var opts = [pre + joinAnd(phr)];
        if (allObj) opts.push(pre + joinAnd(nouns));
        if (lk === "討厭") opts.push("我不喜歡" + joinAnd(phr));
        clauses.push(opts);
      }
      groups = [];
    }
    groups.forEach(function (g) {
      var O = joinAnd(g.os), V = g.v, VO = (V === "要" ? "" : V) + O, opts;
      if (neg) opts = V === "要" ? ["我不要" + O, "我不想要" + O] : ["我不想" + V + O, "我不要" + V + O];
      else if (more) opts = V === "要" ? ["我還要" + O, "我還想要" + O] : ["我還想" + V + O, "我還要" + V + O];
      else {
        opts = V === "要" ? ["我想要" + O, "我要" + O, "可以給我" + O + "嗎？"] : ["我想" + V + O, "我想要" + V + O, "我可以" + V + O + "嗎？"];
        if (please) {
          opts = (GIVEABLE[V] && O) ? ["請給我" + O, "請讓我" + VO] : ["請讓我" + VO, "可以請你讓我" + VO + "嗎？"];
        }
        if (persons.length && TOGETHER[V]) opts.push("我想跟" + joinAnd(persons) + "一起" + VO);
      }
      clauses.push(opts);
    });
    states.forEach(function (s) {
      if (neg) { if (!s.n) return; clauses.push(s.n); } else clauses.push(s.s);
    });
    if (neg && states.length && !states.some(function (s) { return s.n; })) return fail("這張圖卡加上「不要」意思不確定。", list);
    if (please && !groups.length && !clauses.length) clauses.push(["請"]);

    var onlyPersons = !clauses.length && persons.length;
    if (onlyPersons) clauses.push(neg ? ["我不要找" + joinAnd(persons)] : ["我要找" + joinAnd(persons), "我想找" + joinAnd(persons)]);
    if (!clauses.length) {
      if (neg) clauses.push(["不要", "我不要"]);
      else if (more) clauses.push(["還要", "我還要"]);
    }
    if (!clauses.length && interj.length) return { ok: true, alternatives: [end(interj.map(function (t) { return t.t; }).join("，"))] };
    if (!clauses.length) return fail("目前的圖卡組合還不能組成句子，請直接播放或自己修改。", list);

    var pre2 = interj.filter(function (t) { return !firstContent || t.idx < firstContent.idx; }).map(function (t) { return t.t; });
    var post = interj.filter(function (t) { return firstContent && t.idx > firstContent.idx; }).map(function (t) { return t.t; });
    var voc = (persons.length && !onlyPersons) ? joinAnd(persons) + "，" : "";
    if (clauses.length > 1 || post.length) clauses = clauses.map(function (c) { var f = c.filter(function (x) { return !/？$/.test(x); }); return f.length ? f : c; });
    var n = Math.max.apply(null, clauses.map(function (c) { return c.length; }));
    var out = [];
    for (var a = 0; a < n; a++) {
      var parts = clauses.map(function (c) { return c[a % c.length]; });
      var s = parts.map(function (p, pi) {
        if (pi === 0) return p.replace(/[。？！]$/, "");
        return p.replace(/^我想/, "也想").replace(/^我不想/, "也不想").replace(/^我還想/, "也還想").replace(/[。？！]$/, "");
      });
      var q = /？$/.test(parts[parts.length - 1]) && parts.length === 1;
      var body = s.join("，");
      var usesTogether = /一起/.test(body);
      var sentence = (pre2.length ? pre2.join("，") + "，" : "") + (usesTogether ? "" : voc) + body + (post.length ? "，" + post.join("，") : "");
      out.push(q ? sentence.replace(/？?$/, "？") : end(sentence));
    }
    return { ok: true, alternatives: uniq(out) };
  }

  function Composer() { this.key = ""; this.order = []; this.pos = 0; }
  Composer.prototype.next = function (cards, rand) {
    rand = rand || Math.random;
    var key = (cards || []).map(function (c) { return c.category + ":" + c.label; }).join("|");
    var r = compose(cards);
    if (!r.ok) { this.key = ""; return r; }
    if (key !== this.key) {
      this.key = key; this.order = r.alternatives.slice(); this.pos = 0;
      for (var i = this.order.length - 1; i > 0; i--) { var j = Math.floor(rand() * (i + 1)); var t = this.order[i]; this.order[i] = this.order[j]; this.order[j] = t; }
    } else this.pos = (this.pos + 1) % this.order.length;
    return { ok: true, sentence: this.order[this.pos], count: this.order.length, alternatives: r.alternatives };
  };

  var api = { compose: compose, Composer: Composer, classify: classify };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.CardCompose = api;
})(this);
