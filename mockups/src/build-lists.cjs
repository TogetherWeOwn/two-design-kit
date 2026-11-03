// Events list, ladder, members and join.
const fs = require("fs");
const { rk, RANKS, discord, I, header, footer, page, av, C } = require("./parts.cjs");

const listCss = `
.sticky-tools{position:sticky;top:68px;z-index:3;background:var(--two-color-bg-sticky);backdrop-filter:blur(14px);padding:14px 0;border-bottom:1px solid var(--two-color-line-hairline)}
.empty{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:16px;align-items:center;padding:20px;border-radius:var(--two-radius-m);box-shadow:inset 0 0 0 1px var(--two-color-line-hairline-strong);margin-top:12px}
.empty h4{font:600 16px/1.3 var(--two-font-display)}
.empty p{font-size:14px;color:var(--two-color-text-secondary)}
@media (max-width:820px){.sticky-tools{top:60px}.empty{grid-template-columns:1fr}}
`;

// ---------- events ----------
const evRow = (t, rel, glyph, title, tags, sub, n, act, cls = "", avs = 3) =>
  `<li class="row ${cls}"><time><b>${t}</b>${rel}</time><span class="glyph ${glyph}" aria-hidden="true"></span><div class="meta"><h3>${title} ${tags}</h3><p>${sub}</p></div><span class="who"><span class="avs" aria-hidden="true">${Array.from({ length: avs }, (_, i) => av("", C[(i * 5 + title.length) % C.length])).join("")}</span>${n}</span>${act}</li>`;

const events = page(
  "Events",
  `${header("member", "events")}
<main id="main">
  <div class="wrap page-h">
    <p class="mono"><span class="dot" aria-hidden="true"></span>1 live now · 9 this week</p>
    <h1>What's on. <span class="rest">Say you're in.</span></h1>
    <p class="lede">Times are in your time zone. Saying you're in tells the bot to save your seat and ping you before it starts.</p>
  </div>
  <div class="sticky-tools"><div class="wrap toolbar">
    <nav class="seg" aria-label="Which events"><a href="#" aria-current="page">Upcoming <b>9</b></a><a href="#">Mine <b>3</b></a><a href="#">Past <b>84</b></a></nav>
    <div class="chips" role="group" aria-label="Activity"><button class="chip" aria-pressed="true">All</button><button class="chip" aria-pressed="false">Co-op <b>4</b></button><button class="chip" aria-pressed="false">Racing <b>2</b></button><button class="chip" aria-pressed="false">Competitive <b>2</b></button><button class="chip" aria-pressed="false">Hangout <b>1</b></button></div>
    <div class="end only-d"><a class="pill ghost sm" href="#">${I.cal}Subscribe</a></div>
  </div></div>
  <div class="wrap">
    <p class="tzline">${I.cal}<span>Your time: <b style="color:var(--two-color-text-primary);font-weight:500">Europe/London (UTC+0)</b>. Every time also shows UTC on its event page. <a href="#">Change</a></span></p>
    <div class="group"><h2>Today · Fri 7 Nov</h2><ul>
      ${evRow("Live now", "since 18:30", "half", "Helldivers 2 drop-in", '<span class="tag live">Live</span>', "Squad 1 · open to all ranks · drop in any time", "4 playing", '<a class="pill sm act" href="#">Pull me in</a>', "is-live")}
      ${evRow("21:00", "in 2 h 10 m", "mine", "Raid Night: Deep Rock Galactic", '<span class="tag you">You\'re in</span>', 'Hosted by Vexa · <span class="cap" aria-hidden="true"><i></i><i></i><i></i><i class="o"></i></span> 7 seats left', "17 going", '<a class="pill ghost sm act" href="#">Details</a>')}
    </ul></div>
    <div class="group"><h2>Sat 8 Nov</h2><ul>
      ${evRow("19:30", "tomorrow", "", "Valorant 5-stack scrims", '<span class="tag">Soldier+</span>', "Ranked grind · 10 seats", "9 going", '<button class="pill ghost sm act">I\'m in</button>', "", 2)}
      ${evRow("22:00", "tomorrow", "", "Late lobby: Lethal Company", "", "Hangout · no sign-up needed", "5 going", '<button class="pill ghost sm act">I\'m in</button>', "", 2)}
    </ul></div>
    <div class="group"><h2>Sun 9 Nov</h2><ul>
      ${evRow("18:00", "in 2 days", "mine", "Sunday Grand Prix", '<span class="tag you">You\'re in</span><span class="tag">Open to all</span>', "Forza Horizon 5 · newcomers welcome", "14 going", '<a class="pill ghost sm act" href="#">Details</a>')}
    </ul></div>
    <div class="group"><h2>Next week</h2><ul>
      ${evRow("Wed 20:00", "12 Nov", "", "Town hall", '<span class="tag">Members</span>', "The Lounge · what we play in December", "31 going", '<button class="pill ghost sm act">I\'m in</button>')}
      ${evRow("Fri 21:00", "14 Nov", "", "Raid Night: Deep Rock Galactic", "", "Weekly · Hosted by Vexa", "6 going", '<button class="pill ghost sm act">I\'m in</button>', "", 2)}
    </ul>
    <div class="empty"><div><h4>Nothing yet on Monday or Tuesday.</h4><p>Those are usually quiet evenings. Fancy hosting? Suggest an event and a moderator picks it up.</p></div><a class="pill ghost sm" href="#">Suggest an event</a></div>
    </div>
    <div class="group" style="padding-bottom:88px"><h2>Just happened</h2><ul>
      ${evRow("Sun 2 Nov", "last week", "done", "Sunday Grand Prix", '<span class="tag ech">Echo</span>', "18 of 21 came · winner: Juno", "18 were there", '<a class="pill ghost sm act" href="#">Recap</a>', "past", 2)}
    </ul></div>
  </div>
</main>
${footer}`,
  listCss,
);

// ---------- ladder ----------
const ladderCss = `
.season{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:24px;align-items:end;margin-top:28px}
.season .bar{height:6px;border-radius:99px;background:var(--two-color-bg-overlay);overflow:hidden}
.season .bar i{display:block;height:100%;width:23%;background:var(--two-color-text-secondary);border-radius:99px}
.season .lbl{display:flex;justify-content:space-between;margin-bottom:10px}
.lg{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:48px;padding-top:32px;padding-bottom:88px}
.top3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-bottom:28px}
.top3 li{background:var(--two-color-bg-surface);border:1px solid var(--two-color-line-hairline);border-radius:var(--two-radius-l);padding:20px;display:grid;gap:14px}
.top3 .pos{font:500 64px/.85 var(--two-font-display);font-stretch:108%;letter-spacing:-.05em;color:var(--two-color-text-tertiary)}
.top3 li:first-child .pos{color:var(--two-color-accent-default)}
.top3 .who{display:flex;align-items:center;gap:12px}
.top3 .who b{font:600 17px/1.2 var(--two-font-display);display:block}
.top3 .who div > span{font-size:13px;color:var(--two-color-text-secondary)}
.top3 .n{font:400 13px/1 var(--two-font-data);color:var(--two-color-text-secondary);text-transform:uppercase;letter-spacing:.04em}
table{width:100%;border-collapse:collapse;table-layout:fixed}
th:nth-child(1){width:56px}th:nth-child(2){width:72px}th:nth-child(4){width:72px}th:nth-child(5){width:80px}th:nth-child(6){width:190px}
td{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
th{font:400 12px/1 var(--two-font-data);text-transform:uppercase;letter-spacing:.04em;color:var(--two-color-text-tertiary);text-align:left;padding:0 12px 12px;font-weight:400}
th.num,td.num{text-align:right}
td{padding:0 12px;height:60px;border-top:1px solid var(--two-color-line-hairline);font-size:15px;color:var(--two-color-text-secondary);font-variant-numeric:tabular-nums}
td.pos{font:500 18px/1 var(--two-font-display);color:var(--two-color-text-primary);width:56px}
td .mv{display:inline-flex;align-items:center;gap:2px;font:400 12px/1 var(--two-font-data)}
td .mv.u{color:var(--two-color-state-ok)} td .mv.d{color:var(--two-color-state-danger)}
td .nm{display:flex;align-items:center;gap:12px;color:var(--two-color-text-primary);font-weight:600}
td .nm .av{border-width:0}
td b{color:var(--two-color-text-primary);font-weight:600}
tr.mine-row td{background:var(--two-color-bg-raised)}
tr.mine-row td:first-child{box-shadow:inset 2px 0 0 var(--two-color-accent-default);border-radius:var(--two-radius-m) 0 0 var(--two-radius-m)}
tr.mine-row td:last-child{border-radius:0 var(--two-radius-m) var(--two-radius-m) 0}
tr.gap td{height:36px;text-align:center;color:var(--two-color-text-tertiary);font:400 12px/1 var(--two-font-data)}
.how li{display:grid;grid-template-columns:28px minmax(0,1fr);gap:12px;padding:12px 0;border-top:1px solid var(--two-color-line-hairline);font-size:15px;color:var(--two-color-text-secondary)}
.how li:first-child{border-top:0}
.how b{font:400 13px/1.6 var(--two-font-data);color:var(--two-color-accent-default)}
.dist li{display:grid;grid-template-columns:24px minmax(0,1fr) auto;gap:12px;align-items:center;padding:9px 0}
.dist .bar{height:6px;border-radius:99px;background:var(--two-color-bg-overlay)}
.dist .bar i{display:block;height:100%;border-radius:99px;background:var(--two-color-text-tertiary);width:var(--p)}
.dist span{font:400 13px/1 var(--two-font-data);color:var(--two-color-text-secondary)}
.lside{display:grid;gap:16px;align-content:start}
.lside .box{padding:22px}
.lside h2{font:600 17px/1.2 var(--two-font-display);margin-bottom:12px}
@media (max-width:820px){
  .season{grid-template-columns:1fr}
  .lg{grid-template-columns:1fr;gap:32px;padding-top:20px;padding-bottom:56px}
  .top3{grid-template-columns:1fr;gap:8px}
  .top3 li{grid-template-columns:auto minmax(0,1fr);align-items:center;padding:14px 16px}
  .top3 .pos{font-size:40px;grid-row:1/3}
  .hide-s{display:none}
  td{padding:0 8px;height:56px}
  table{table-layout:auto}th{width:auto!important}th:nth-child(1){width:40px!important}th:nth-child(3){width:100%!important}
  th{padding:0 8px 10px}
}`;
const lrow = (pos, mv, name, r, going, streak, last, me = false) =>
  `<tr${me ? ' class="mine-row"' : ""}><td class="pos">${pos}</td><td class="hide-s">${mv > 0 ? `<span class="mv u">${I.up}${mv}</span>` : mv < 0 ? `<span class="mv d">${I.down}${-mv}</span>` : '<span class="mv">–</span>'}</td><td><span class="nm">${av(name.slice(0, 2).toUpperCase(), C[(pos * 3) % C.length]).replace('class="av"', 'class="av m"')}<span>${name}<br><span class="rkl" style="font-weight:400;font-size:13px;color:var(--two-color-text-tertiary)">${rk(r)}${RANKS[r - 1]}</span></span></span></td><td class="num"><b>${going}</b></td><td class="num hide-s">${streak} wk</td><td class="hide-s">${last}</td></tr>`;
const ladder = page(
  "Ladder",
  `${header("member", "ladder")}
<main id="main">
  <div class="wrap page-h">
    <p class="mono">Season 4 · November · counted by the bot from Echoes</p>
    <h1>The ladder. <span class="rest">Showing up is the score.</span></h1>
    <div class="season"><div><div class="lbl"><span class="mono">Day 7 of 30</span><span class="mono">Resets 1 Dec · updated 6 min ago</span></div><div class="bar" role="img" aria-label="Season 23% done"><i></i></div></div></div>
  </div>
  <div class="sticky-tools"><div class="wrap toolbar">
    <nav class="seg" aria-label="Scope"><a href="#">Overall</a><a href="#" aria-current="page">Around you</a></nav>
    <div class="chips" role="group" aria-label="Game"><button class="chip" aria-pressed="true">Every game</button><button class="chip" aria-pressed="false">Deep Rock</button><button class="chip" aria-pressed="false">Forza</button><button class="chip" aria-pressed="false">Valorant</button></div>
  </div></div>
  <div class="wrap lg">
    <div>
      <ol class="top3" aria-label="Top three this season">
        <li><span class="pos">1</span><div class="who">${av("JU", C[2]).replace('class="av"', 'class="av l"')}<div><b>Juno</b><span class="rkl">${rk(4)}Veteran</span></div></div><span class="n">7 events · 4 wk run</span></li>
        <li><span class="pos">2</span><div class="who">${av("VX", C[0]).replace('class="av"', 'class="av l"')}<div><b>Vexa</b><span class="rkl">${rk(4)}Veteran</span></div></div><span class="n">6 events · 2 hosted</span></li>
        <li><span class="pos">3</span><div class="who">${av("LU", C[6]).replace('class="av"', 'class="av l"')}<div><b>Lumen</b><span class="rkl">${rk(4)}Veteran</span></div></div><span class="n">6 events · 1 hosted</span></li>
      </ol>
      <table><caption class="sr">Around you (5 above and below): going counts, season 4, every game</caption>
        <thead><tr><th>#</th><th class="hide-s">Move</th><th>Member</th><th class="num">Came</th><th class="num hide-s">Run</th><th class="hide-s">Last seen at</th></tr></thead>
        <tbody>
          <tr class="gap"><td colspan="6">Ranks 4–8</td></tr>
          ${lrow(9, 2, "Ashby", 2, 4, 3, "Raid Night, 31 Oct")}
          ${lrow(10, 0, "Tiko", 3, 4, 2, "Grand Prix, 2 Nov")}
          ${lrow(11, -1, "Zephyr", 2, 4, 1, "Town hall, 29 Oct")}
          ${lrow(12, 4, "Kestrel", 1, 3, 2, "Grand Prix, 2 Nov")}
          ${lrow(13, 0, "Okra", 3, 3, 1, "Raid Night, 31 Oct")}
          ${lrow(14, 3, "Mora (you)", 2, 3, 4, "Grand Prix, 2 Nov", true)}
          ${lrow(15, -2, "Brisk", 2, 3, 1, "Scrims, 1 Nov")}
          ${lrow(16, 0, "Faye", 1, 2, 2, "Grand Prix, 2 Nov")}
          ${lrow(17, 1, "Rye", 2, 2, 1, "Raid Night, 31 Oct")}
        </tbody></table>
      <p class="mono" style="margin-top:18px">212 members on the board · 9 chose not to be listed</p>
    </div>
    <aside class="lside" aria-label="How the ladder works">
      <div class="box"><h2>How it counts</h2><ol class="how"><li><b>01</b><span>Say you're in for an event, here or in Discord.</span></li><li><b>02</b><span>Turn up in the room. The bot counts who's there.</span></li><li><b>03</b><span>When it ends, the Echo adds one to everyone who came. Hosting counts double.</span></li></ol></div>
      <div class="box"><h2>Ranks, all time</h2><ul class="dist">
        ${[
          [5, 6, 2],
          [4, 31, 8],
          [3, 97, 24],
          [2, 268, 65],
          [1, 412, 100],
        ]
          .map(
            ([r, n, p]) =>
              `<li>${rk(r)}<div><span style="display:block;margin-bottom:6px;color:var(--two-color-text-primary);font:500 14px/1 var(--two-font-display)">${RANKS[r - 1]}</span><div class="bar"><i style="--p:${p}%"></i></div></div><span>${n}</span></li>`,
          )
          .join("")}
      </ul></div>
      <p class="mono" style="padding:0 4px">Don't want to be listed? <a href="#" style="color:var(--two-color-accent-default)">Profile settings</a></p>
    </aside>
  </div>
</main>
${footer}`,
  listCss + ladderCss,
);

// ---------- members ----------
const memCss = `
.newest{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px;margin:8px 0 48px}
.newest li{background:var(--two-color-bg-surface);border:1px solid var(--two-color-line-hairline);border-radius:var(--two-radius-l);padding:18px 14px;text-align:center;display:grid;justify-items:center;gap:8px}
.newest b{font:600 15px/1.2 var(--two-font-display)}
.newest .mono{font-size:12px}
.mgrid{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:48px;padding-bottom:88px}
.mlist li{display:grid;grid-template-columns:44px minmax(0,1.2fr) minmax(0,1fr) 150px auto;gap:16px;align-items:center;min-height:68px;padding:10px 12px;border-top:1px solid var(--two-color-line-hairline)}
.mlist li .av{border-width:0}
.mlist b{font:600 16px/1.2 var(--two-font-display);display:block}
.mlist .s{font-size:13px;color:var(--two-color-text-tertiary)}
.mlist .games{display:flex;gap:6px;flex-wrap:wrap}
.mlist .games span{font-size:13px;color:var(--two-color-text-secondary);padding:4px 8px;border-radius:6px;background:var(--two-color-bg-raised)}
.mlist .seen{font:400 13px/1.3 var(--two-font-data);color:var(--two-color-text-tertiary)}
.leads li{display:flex;align-items:center;gap:12px;padding:10px 0;border-top:1px solid var(--two-color-line-hairline)}
.leads li:first-child{border-top:0}
.leads .av{border-width:0}
.leads b{font:600 15px/1.2 var(--two-font-display);display:block}
.leads span{font-size:13px;color:var(--two-color-text-secondary)}
.msearch{flex:1;max-width:360px}
@media (max-width:820px){
  .newest{grid-template-columns:repeat(6,140px);overflow-x:auto;margin:8px calc(var(--gut) * -1) 36px;padding:0 var(--gut)}
  .mgrid{grid-template-columns:1fr;gap:32px;padding-bottom:56px}
  .mlist li{grid-template-columns:44px minmax(0,1fr) auto;gap:4px 12px}
  .mlist .games,.mlist .seen{grid-column:2/-1}
  .mlist li>:nth-child(5){grid-column:3;grid-row:1;align-self:start}
  .msearch{max-width:none;width:100%}
}`;
const M = [
  ["Juno", 4, ["Forza", "Deep Rock"], "Grand Prix · 5 d ago", "Moderator"],
  ["Kestrel", 1, ["Helldivers 2"], "In voice now", "New"],
  ["Lumen", 4, ["Deep Rock", "Helldivers 2"], "Raid Night · 7 d ago", "Guide"],
  ["Ashby", 2, ["Valorant", "Deep Rock"], "Raid Night · 7 d ago", ""],
  ["Vexa", 4, ["Deep Rock", "Lethal Co."], "In voice now", "Host"],
  ["Okra", 3, ["Valorant"], "Scrims · 6 d ago", ""],
  ["Brisk", 2, ["Valorant", "Forza"], "Scrims · 6 d ago", ""],
];
const members = page(
  "Members",
  `${header("member", "members")}
<main id="main">
  <div class="wrap page-h">
    <p class="mono">814 members · 212 came to something this month</p>
    <h1>Who's here. <span class="rest">Say hi to the new ones.</span></h1>
  </div>
  <div class="wrap">
    <h2 class="mono" style="margin-bottom:14px">Joined this week</h2>
    <ul class="newest">${["Kestrel", "Pell", "Quill", "Sable", "Ulla", "Nox"].map((n, i) => `<li>${av(n.slice(0, 2).toUpperCase(), C[(i * 2 + 1) % C.length]).replace('class="av"', 'class="av l"')}<b>${n}</b><span class="mono">${["Mon", "Tue", "Tue", "Wed", "Thu", "Today"][i]}</span><a class="pill ghost sm" href="#">Say hi</a></li>`).join("")}</ul>
  </div>
  <div class="sticky-tools"><div class="wrap toolbar">
    <label class="field msearch">${I.search}<span>Find by name or Discord handle</span></label>
    <nav class="seg" aria-label="Who"><a href="#" aria-current="page">Active <b>212</b></a><a href="#">Everyone <b>814</b></a><a href="#">Guides <b>18</b></a></nav>
    <div class="end only-d"><span class="mono">Sort</span><button class="pill ghost sm">Recently active ${I.down}</button></div>
  </div></div>
  <div class="wrap mgrid">
    <ul class="mlist" style="padding-top:12px">${M.map(([n, r, g, seen, t], i) => `<li>${av(n.slice(0, 2).toUpperCase(), C[(i * 5 + 2) % C.length]).replace('class="av"', 'class="av l"')}<div><b>${n}</b><span class="s rkl">${rk(r)}${RANKS[r - 1]}</span></div><div class="games">${g.map((x) => `<span>${x}</span>`).join("")}</div><span class="seen">${seen.startsWith("In voice") ? '<span class="dot ok" aria-hidden="true"></span> ' : ""}${seen}</span>${t ? `<span class="tag${t === "New" ? " ok" : ""}">${t}</span>` : "<span></span>"}</li>`).join("")}</ul>
    <aside style="display:grid;gap:16px;align-content:start;padding-top:12px">
      <div class="box" style="padding:22px"><h2 style="font:600 17px/1.2 var(--two-font-display);margin-bottom:12px">Who runs this</h2><ul class="leads">
        ${[
          ["Juno", "Founder · moderator"],
          ["Vexa", "Events lead"],
          ["Rook", "Moderator · EU nights"],
          ["Sol", "Moderator · US nights"],
        ]
          .map(
            ([n, r], i) =>
              `<li>${av(n.slice(0, 2).toUpperCase(), C[(i * 3 + 2) % C.length]).replace('class="av"', 'class="av m"')}<div><b>${n}</b><span>${r}</span></div></li>`,
          )
          .join("")}
      </ul><p style="font-size:14px;color:var(--two-color-text-secondary);margin-top:14px">Questions or a problem with someone? Message any of them, or use <a href="#" style="color:var(--two-color-accent-default)">#help</a>.</p></div>
      <p class="mono" style="padding:0 4px">Only signed-in members see names. Visitors see the counts.</p>
    </aside>
  </div>
</main>
${footer}`,
  listCss + memCss,
);

// ---------- join ----------
const joinCss = `
.jn{display:grid;grid-template-columns:minmax(0,1fr) 420px;gap:0 64px;padding-top:64px;padding-bottom:88px;align-items:start}
.idn{display:flex;align-items:center;gap:18px;margin-bottom:32px}
.idn img{width:64px;height:64px}
.idn .mono{display:block;margin-top:6px}
.jn h1{font:560 var(--two-font-size-hero)/.98 var(--two-font-display);font-stretch:108%;letter-spacing:-.04em;text-wrap:balance}
.jn h1 .serif{font-size:1.08em}
.jn .lede{font-size:19px;color:var(--two-color-text-secondary);max-width:46ch;margin-top:24px}
.steps{margin-top:40px;display:grid;gap:0}
.steps li{display:grid;grid-template-columns:56px minmax(0,1fr);gap:16px;padding:22px 0;border-top:1px solid var(--two-color-line-hairline)}
.steps b{font:400 13px/1.7 var(--two-font-data);color:var(--two-color-accent-default)}
.steps h3{font:600 18px/1.3 var(--two-font-display)}
.steps p{color:var(--two-color-text-secondary);font-size:15px;margin-top:4px}
.expect{margin-top:48px}
.expect h2{font:560 var(--two-font-size-h3)/1.1 var(--two-font-display);font-stretch:108%;letter-spacing:-.025em;margin-bottom:16px}
.expect ul{display:grid;gap:10px}
.expect li{display:flex;gap:12px;color:var(--two-color-text-secondary);font-size:16px}
.expect li .ico{color:var(--two-color-state-ok);margin-top:3px}
.jintro,.jdetails{grid-column:1}.card{grid-column:2;grid-row:1/3;position:sticky;top:92px;background:var(--two-color-bg-surface);border:1px solid var(--two-color-line-hairline-strong);border-radius:var(--two-radius-l);padding:28px}
.card h2{font:600 22px/1.2 var(--two-font-display)}
.card .pill{width:100%;margin-top:22px}
.card .fine{font-size:14px;color:var(--two-color-text-secondary);margin-top:16px}
.card .live{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:22px}
.card .live div{background:var(--two-color-bg-raised);border-radius:var(--two-radius-m);padding:14px}
.card .live b{display:block;font:500 28px/1 var(--two-font-display);font-stretch:108%;letter-spacing:-.03em}
.card .live span{font-size:13px;color:var(--two-color-text-secondary)}
.card hr{border:0;border-top:1px solid var(--two-color-line-hairline);margin:22px 0}
.card .reads{display:grid;gap:8px;font-size:14px;color:var(--two-color-text-secondary)}
.card .reads li{display:flex;gap:10px}
.card .reads .ico{width:16px;height:16px;margin-top:3px;color:var(--two-color-text-tertiary)}
@media (max-width:820px){
  .jn{grid-template-columns:1fr;gap:36px;padding-top:28px;padding-bottom:56px}
  .jn .lede{font-size:17px}
  .card{position:static;padding:22px;grid-column:1;grid-row:auto}
  .jn{gap:28px}
  .jdetails{order:2}
  .steps{margin-top:36px}
}`;
const join = page(
  "Join",
  `${header("guest", "")}
<main id="main"><div class="wrap jn">
  <div class="jintro">
    <div class="idn"><img src="brand/icon-two-brand.svg" alt=""><div><b style="font:600 18px/1 var(--two-font-display)">Together We Own</b><span class="mono">A Discord gaming community · since 2023 · English</span></div></div>
    <h1>Play with people <span class="serif">who show up.</span></h1>
    <p class="lede">We're 814 members across Europe and the Americas. We run events most nights, and a bot keeps track so nobody has to chase anyone.</p>
  </div>
  <div class="jdetails">
    <h2 class="sr">What happens when you join</h2>
    <ol class="steps">
      <li><b>01</b><div><h3>Discord asks you to say yes</h3><p>We ask for your name, your avatar and permission to add you to our server. Nothing else.</p></div></li>
      <li><b>02</b><div><h3>The bot lets you in and makes you a Prospect</h3><p>It takes a few seconds. You'll see our channels in Discord right away.</p></div></li>
      <li><b>03</b><div><h3>You land back here, signed in</h3><p>Pick an event marked "Open to all" and say you're in. After your first one, you're a Member.</p></div></li>
    </ol>
    <section class="expect" aria-labelledby="exp-h"><h2 id="exp-h">What we ask of you</h2><ul>
      <li>${I.check}<span>Be kind on voice. Newcomers get patience, not tests.</span></li>
      <li>${I.check}<span>If you said you're in, come, or drop out before it starts.</span></li>
      <li>${I.check}<span>You must be 16 or older. <a href="#" style="color:var(--two-color-accent-default)">Read the full rules</a></span></li>
    </ul></section>
  </div>
  <aside class="card" aria-labelledby="card-h">
    <h2 id="card-h">Join with one sign-in</h2>
    <div class="live"><div><b>14</b><span>in voice now</span></div><div><b>9</b><span>events this week</span></div><div><b>6</b><span>joined this week</span></div></div>
    <a class="pill lg" href="#">${discord}Join with Discord</a>
    <p class="fine">Already in our server? The same button signs you in.</p>
    <hr>
    <ul class="reads">
      <li>${I.lock}<span>We never post as you or read your messages.</span></li>
      <li>${I.lock}<span>Leave any time. Delete your data from your profile, in one step.</span></li>
    </ul>
  </aside>
</div></main>
${footer}`,
  joinCss,
);

for (const [n, h] of Object.entries({ events, ladder, members, join }))
  fs.writeFileSync(`${__dirname}/${n}.html`, h);
