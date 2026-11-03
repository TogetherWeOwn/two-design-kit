const fs = require("fs");
const { rk, I, header, footer, page, C } = require("./parts.cjs");

const css = `
.ph{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:var(--two-space-7);align-items:end;padding:64px 0 48px}
.ph h1{font:var(--two-font-weight-display) var(--two-font-size-hero)/.95 var(--two-font-display);font-stretch:var(--two-font-width-display);letter-spacing:-.045em}
.ph .handle{margin-top:var(--two-space-3);display:flex;gap:var(--two-space-inset-room);flex-wrap:wrap;align-items:center}
.ph .badges{display:flex;gap:var(--two-space-2);flex-wrap:wrap;margin-top:var(--two-space-inset-compact)}
.ph .acts{display:flex;gap:var(--two-space-inset-tight)}
.rankline{display:flex;align-items:center;gap:var(--two-space-4);padding:var(--two-space-inset-card) 0;border-top:1px solid var(--two-color-line-hairline);border-bottom:1px solid var(--two-color-line-hairline)}
.rankline b{font:var(--two-font-weight-display) 26px/1 var(--two-font-display);font-stretch:var(--two-font-width-display);letter-spacing:-.02em}
.rankline p{color:var(--two-color-text-secondary);font-size:var(--two-font-size-ui)}
.rankline .ladder{margin-left:auto;display:flex;gap:6px;align-items:center}
.rankline .ladder span{font:var(--two-font-weight-regular) var(--two-font-size-label)/1 var(--two-font-data);text-transform:uppercase;letter-spacing:var(--two-tracking-label);color:var(--two-color-text-tertiary);padding:6px var(--two-space-2);border-radius:5px}
.rankline .ladder span.on{color:var(--two-color-text-primary);box-shadow:inset 0 0 0 1px var(--two-color-line-control)}
.pg{display:grid;grid-template-columns:minmax(0,1fr) var(--two-layout-rail-default);gap:var(--two-space-9);padding:48px 0 var(--two-space-11)}
.pg > .side{grid-column:2;grid-row:1}.pg > .maincol{grid-column:1;grid-row:1}
.trail-t{margin-top:var(--two-space-3)}.trail-t summary{font-size:var(--two-font-size-small);color:var(--two-color-text-secondary);cursor:pointer;text-decoration:underline;text-underline-offset:3px;padding:var(--two-space-2) 0}
.trail-t table{border-collapse:collapse;margin-top:var(--two-space-2);font-size:var(--two-font-size-small)}.trail-t td,.trail-t th{padding:var(--two-space-1) var(--two-space-3) var(--two-space-1) 0;text-align:left;color:var(--two-color-text-secondary)}
.blk + .blk{margin-top:var(--two-space-9)}
.blk > h2{font:var(--two-font-weight-display) var(--two-font-size-h3)/1.1 var(--two-font-display);font-stretch:var(--two-font-width-display);letter-spacing:var(--two-tracking-h3);margin-bottom:var(--two-space-5);display:flex;justify-content:space-between;align-items:baseline;gap:var(--two-space-4)}
.trail{display:grid;grid-template-columns:repeat(26,minmax(0,1fr));gap:var(--two-space-1);align-items:end;height:96px;padding:0 0 var(--two-space-inset-tight);border-bottom:1px solid var(--two-color-line-hairline-strong)}
.trail i{display:block;border-radius:3px 3px 1px 1px;background:var(--two-color-accent-default);height:calc(var(--n) * 22px)}
.trail i.z{height:4px;background:var(--two-color-bg-overlay)}
.trail i.h{background:var(--two-color-state-echo)}
.trail-ax{display:flex;justify-content:space-between;margin-top:var(--two-space-2)}
.only-m-flex{display:none}
.tlegend{display:flex;gap:var(--two-space-5);margin-top:var(--two-space-inset-room);font-size:13px;color:var(--two-color-text-secondary);flex-wrap:wrap}
.tlegend i{display:inline-block;width:10px;height:10px;border-radius:2px;background:var(--two-color-accent-default);margin-right:6px}
.rec li{display:grid;grid-template-columns:110px 20px minmax(0,1fr) auto;gap:var(--two-space-inset-room);align-items:baseline;padding:var(--two-space-inset-room) 0;border-top:1px solid var(--two-color-line-hairline)}
.rec li:first-child{border-top:0}
.rec time{font:var(--two-font-weight-regular) 13px/1.4 var(--two-font-data);color:var(--two-color-text-tertiary)}
.rec h3{font:var(--two-font-weight-semibold) var(--two-font-size-body)/1.35 var(--two-font-display)}
.rec p{font-size:var(--two-font-size-small);color:var(--two-color-text-secondary)}
.rec .bot{translate:0 1px}
.rec .ev{width:14px;height:14px;border-radius:50%;border:2px solid var(--two-color-text-tertiary);translate:0 2px}
.rec .ev.e{border-color:var(--two-color-state-echo);background:var(--two-color-state-echo)}
.tiles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--two-space-2)}
.tile{background:var(--two-color-bg-surface);border:1px solid var(--two-color-line-hairline);border-radius:var(--two-radius-m);padding:var(--two-space-4)}
.tile b{display:block;font:var(--two-font-weight-medium) var(--two-font-size-tile)/1 var(--two-font-display);font-stretch:var(--two-font-width-display);letter-spacing:var(--two-tracking-display);font-variant-numeric:tabular-nums}
.tile span{font-size:13px;color:var(--two-color-text-secondary);display:block;margin-top:var(--two-space-2);line-height:1.3}
.side{display:grid;gap:var(--two-space-4);align-content:start}
.side .box{padding:var(--two-space-inset-card)}
.side h2{font:var(--two-font-weight-semibold) var(--two-font-size-body-reading)/1.2 var(--two-font-display);margin-bottom:var(--two-space-inset-room)}
.together b{font:var(--two-font-weight-display) 44px/1 var(--two-font-display);font-stretch:var(--two-font-width-display);letter-spacing:var(--two-tracking-display)}
.together p{color:var(--two-color-text-secondary);font-size:var(--two-font-size-ui);margin-top:6px}
.together .chips{margin-top:var(--two-space-4)}
.nextev{display:grid;gap:var(--two-space-1)}
.nextev h3{font:var(--two-font-weight-semibold) var(--two-font-size-body)/1.3 var(--two-font-display)}
.nextev p{font-size:var(--two-font-size-small);color:var(--two-color-text-secondary)}
.private{display:flex;gap:var(--two-space-inset-tight);align-items:flex-start;font-size:var(--two-font-size-small);color:var(--two-color-text-secondary)}
.private .ico{margin-top:2px;color:var(--two-color-text-tertiary)}
@media (max-width:820px){
  .ph{grid-template-columns:auto minmax(0,1fr);gap:var(--two-space-inset-compact);padding:var(--two-space-7) 0 var(--two-space-inset-card-lg);align-items:center}
  .ph .av.xl{width:72px;height:72px;font-size:24px}
  .ph .meta{grid-column:1/-1}
  .ph .acts{grid-column:1/-1}
  .ph .acts .pill{flex:1}
  .ph .handle{margin-top:0}
  .rankline{flex-wrap:wrap;gap:var(--two-space-3)}
  .rankline .ladder{display:none}
  .only-d-flex{display:none}.only-m-flex{display:flex}
  .pg{grid-template-columns:1fr;gap:var(--two-space-8);padding:var(--two-space-7) 0 var(--two-space-9)}
  .pg > .side,.pg > .maincol{grid-column:1;grid-row:auto}
  .trail{grid-template-columns:repeat(13,minmax(0,1fr))}
  .trail i:nth-child(-n+13){display:none}
  .rec li{grid-template-columns:20px minmax(0,1fr);gap:var(--two-space-1) var(--two-space-3)}
  .rec time{grid-column:2;grid-row:1}
  .rec li > span:first-of-type{grid-row:1/3;grid-column:1}
  .rec li > div{grid-column:2}
  .rec li > .tag{grid-column:2;justify-self:start}
}`;

// 26 weeks: events attended that week (0..3); h = hosted
const weeks = [1, 0, 1, 2, 1, 1, 0, 0, 1, 2, 2, 1, 3, 1, 0, 1, 2, 1, 1, 2, 1, 2, "h2", 1, 2, "h1"];
const nOf = (w) => (typeof w === "string" ? +w.slice(1) : w);
const total = weeks.reduce((a, w) => a + nOf(w), 0),
  hosted = weeks.filter((w) => typeof w === "string").length,
  missed = weeks.filter((w) => w === 0).length;
const trailTable = `<details class="trail-t"><summary>Show as a table</summary><table><caption class="sr">Events per week, oldest first</caption><thead><tr><th scope="col">Week</th><th scope="col">Events</th><th scope="col">Hosted</th></tr></thead><tbody>${weeks.map((w, i) => `<tr><td>${i === 25 ? "This week" : (25 - i) + " weeks ago"}</td><td>${nOf(w)}</td><td>${typeof w === "string" ? "yes" : ""}</td></tr>`).join("")}</tbody></table></details>`;
const trail = weeks
  .map((w) =>
    w === 0
      ? '<i class="z"></i>'
      : String(w).startsWith("h")
        ? `<i class="h" style="--n:${w.slice(1)}"></i>`
        : `<i style="--n:${w}"></i>`,
  )
  .join("");

const body = `${header("member", "members")}
<main id="main"><div class="wrap">
  <section class="ph" aria-labelledby="name">
    <span class="av xl" style="--c:${C[6]}">LU</span>
    <div class="meta">
      <h1 id="name">Lumen</h1>
      <div class="handle"><span class="mono">@lumen.wav</span><span class="mono">Member since Mar 2024</span><span class="mono">Usually on 19:00–23:00 your time</span></div>
      <div class="badges"><span class="tag">Guide · Deep Rock</span><span class="tag">Event host</span><span class="tag">Mic on</span><span class="tag">EU</span></div>
    </div>
    <div class="acts"><a class="pill ghost" href="#">Message on Discord</a><a class="pill ghost" href="#" aria-label="Copy profile link">${I.share}</a></div>
  </section>

  <div class="rankline">
    ${rk(4, "l")}<div><b>Veteran</b><p>Two years of showing up · promoted by the bot on 1 Oct</p></div>
    <div class="ladder" aria-label="Rank ladder, Veteran is 4 of 5"><span>Prospect</span><span>Member</span><span>Soldier</span><span class="on">Veteran</span><span>Legend</span></div>
  </div>

  <div class="pg">
    <aside class="side" aria-label="Summary">
      <div class="tiles">
        <div class="tile"><b>61</b><span>events came to</span></div>
        <div class="tile"><b>12</b><span>events hosted</span></div>
        <div class="tile"><b>9</b><span>weeks, longest run</span></div>
      </div>
      <div class="box together"><h2>You and Lumen</h2><b>7</b><p>events together, most recently Raid Night on 30 Oct</p>
        <div class="chips"><span class="chip">Deep Rock Galactic</span><span class="chip">Helldivers 2</span></div></div>
      <div class="box"><h2>Going next</h2><div class="nextev"><span class="mono">Fri 21:00 · your time</span><h3>Raid Night: Deep Rock Galactic</h3><p>You're both in</p></div></div>
      <p class="private">${I.lock}<span>Lumen chose to show their usual hours and region. Attendance rates and missed events are never shown on profiles.</span></p>
    </aside>
    <div class="maincol">
      <section class="blk" aria-labelledby="trail-h">
        <h2 id="trail-h">Echo trail <span class="mono only-d">Last 26 weeks</span><span class="mono only-m">Last 13 weeks<span class="sr"> shown; the chart description and the table cover 26</span></span></h2>
        <div class="trail" role="img" aria-label="Events attended per week over the last 26 weeks: ${total} events, hosted in ${hosted} weeks, ${missed} weeks with none.">${trail}</div>
        <div class="trail-ax only-d-flex"><span class="mono">May</span><span class="mono">Jul</span><span class="mono">Sep</span><span class="mono">This week</span></div>
        <div class="trail-ax only-m-flex"><span class="mono">Aug</span><span class="mono">Sep</span><span class="mono">Oct</span><span class="mono">This week</span></div>
        <div class="tlegend"><span><i></i>Came to an event (bar height = how many)</span><span><i style="background:var(--two-color-state-echo)"></i>Hosted one</span></div>
        ${trailTable}
      </section>

      <section class="blk" aria-labelledby="rec-h">
        <h2 id="rec-h">Record <span class="mono">Newest first</span></h2>
        <ol class="rec" role="list">
          <li><time>Fri 30 Oct</time><span class="ev e" aria-hidden="true"></span><div><h3>Raid Night: Deep Rock Galactic</h3><p>Came and stayed to the end · one of 18</p></div><span class="tag ech">Echo</span></li>
          <li><time>Sun 25 Oct</time><span class="ev e" aria-hidden="true"></span><div><h3>Sunday Grand Prix</h3><p>2nd of 14 · hosted by Juno</p></div><span class="tag ech">Echo</span></li>
          <li><time>Sat 17 Oct</time><span class="ev e" aria-hidden="true" style="background:none"></span><div><h3>Hosted: Deep Rock for first-timers</h3><p>9 came, 6 of them Prospects</p></div><span class="tag">Host</span></li>
          <li><time>Thu 1 Oct</time><span class="bot" aria-hidden="true"></span><div><h3>The bot promoted Lumen to Veteran</h3><p>Two years in, 50 events</p></div><span class="tag">Rank</span></li>
          <li><time>Mon 3 Aug</time><span class="bot" aria-hidden="true"></span><div><h3>Became a Guide for Deep Rock Galactic</h3><p>Given by a moderator, logged by the bot</p></div><span class="tag">Guide</span></li>
          <li><time>Mar 2024</time><span class="bot" aria-hidden="true"></span><div><h3>Joined from this site and got the Prospect rank</h3></div><span class="tag">Joined</span></li>
        </ol>
        <p style="margin-top:var(--two-space-4)"><a class="pill ghost sm" href="#">Full record · 64 entries</a></p>
      </section>
    </div>

  </div>
</div></main>
${footer}`;

fs.writeFileSync(__dirname + "/profile.html", page("Lumen", body, css));
