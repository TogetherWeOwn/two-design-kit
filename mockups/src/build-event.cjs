const fs = require("fs");
const { rk, I, header, footer, page, av, C } = require("./parts.cjs");

const css = `
.crumb{padding:var(--two-space-inset-card-lg) 0 0;font-size:var(--two-font-size-small);color:var(--two-color-text-tertiary)}
.crumb a{color:var(--two-color-text-secondary)}
.ed{display:grid;grid-template-columns:minmax(0,1fr) var(--two-layout-rail-seat);gap:0 var(--two-space-9);padding:36px 0 var(--two-space-10);align-items:start}
.ed h1{font:var(--two-font-weight-display) var(--two-font-size-h1)/1 var(--two-font-display);font-stretch:var(--two-font-width-display);letter-spacing:var(--two-tracking-display);text-wrap:balance;margin-top:var(--two-space-inset-compact)}
.ed h1 .serif{font-size:1.08em}
.when{display:flex;align-items:flex-end;gap:var(--two-space-6);margin-top:36px;padding-top:var(--two-space-inset-card-lg);border-top:1px solid var(--two-color-line-hairline)}
.when b{font:var(--two-font-weight-medium) var(--two-font-size-figure)/.85 var(--two-font-display);font-stretch:var(--two-font-width-display);letter-spacing:var(--two-tracking-figure);font-variant-numeric:tabular-nums}
.when p{font-size:var(--two-font-size-body-reading);color:var(--two-color-text-primary)}
.when p + p{margin-top:6px}
.when p.mono{font-size:13px;color:var(--two-color-text-tertiary)}
.headcol{grid-column:1}.bodycol{grid-column:1}.side{grid-column:2;grid-row:1/3;position:sticky;top:var(--two-layout-sticky-offset);display:grid;gap:var(--two-space-4)}
.rsvp{padding:var(--two-space-inset-card)}
.rsvp .state{display:flex;align-items:center;justify-content:space-between;gap:var(--two-space-3)}
.rsvp h2{font:var(--two-font-weight-semibold) var(--two-font-size-title)/1.2 var(--two-font-display)}
.seats{display:flex;flex-wrap:wrap;gap:6px;margin:var(--two-space-5) 0 var(--two-space-3)}
.seats .av{--bg:var(--two-color-bg-surface);border-width:0}
.rsvp .count{font-size:var(--two-font-size-ui);color:var(--two-color-text-secondary)}
.rsvp .count b{color:var(--two-color-text-primary);font-weight:600}
.rsvp .btns{display:grid;gap:var(--two-space-inset-tight);margin-top:var(--two-space-5)}
.rsvp .btns .pill{width:100%}
.rsvp .note{display:flex;gap:var(--two-space-inset-tight);align-items:flex-start;margin-top:var(--two-space-4);font-size:var(--two-font-size-small);color:var(--two-color-text-secondary)}
.rsvp .note .ico{color:var(--two-color-accent-default);margin-top:1px}
.linkbtn{font:var(--two-font-weight-medium) var(--two-font-size-small)/1 var(--two-font-display);color:var(--two-color-text-secondary);text-decoration:underline;text-underline-offset:3px;justify-self:center;padding:var(--two-space-2)}
.facts-box{padding:var(--two-space-2) var(--two-space-inset-card)}
.blk{margin-top:var(--two-space-9)}
.blk > h2{font:var(--two-font-weight-display) var(--two-font-size-h3)/1.1 var(--two-font-display);font-stretch:var(--two-font-width-display);letter-spacing:var(--two-tracking-h3);margin-bottom:var(--two-space-inset-card);display:flex;justify-content:space-between;align-items:baseline;gap:var(--two-space-4)}
.blk > h2 .mono{font-size:var(--two-font-size-label);letter-spacing:var(--two-tracking-label)}
.life{position:relative}
.life li{display:grid;grid-template-columns:118px 28px minmax(0,1fr);gap:var(--two-space-4);padding-bottom:var(--two-space-inset-card);position:relative}
.life li::before{content:"";position:absolute;left:131px;top:var(--two-space-5);bottom:-2px;width:2px;background:var(--two-color-line-hairline-strong)}
.life li:last-child::before{display:none}
.life li.done::before{background:var(--two-color-text-tertiary)}
.life time{font:var(--two-font-weight-regular) 13px/1.5 var(--two-font-data);color:var(--two-color-text-tertiary);text-align:right}
.life .mk{width:var(--two-size-lifeline-marker);height:var(--two-size-lifeline-marker);border-radius:50%;display:grid;place-items:center;background:var(--two-color-bg-canvas);box-shadow:inset 0 0 0 2px var(--two-color-line-hairline-strong);position:relative;z-index:1}
.life .done .mk{background:var(--two-color-bg-overlay);box-shadow:none;color:var(--two-color-text-secondary)}
.life .done .mk .ico{width:var(--two-size-icon-sm);height:var(--two-size-icon-sm)}
.life .next .mk{box-shadow:inset 0 0 0 2px var(--two-color-accent-default)}
.life .next .mk::after{content:"";width:10px;height:10px;border-radius:50%;background:var(--two-color-accent-default)}
.life .who-did{display:inline-flex;align-items:center;gap:6px;font:var(--two-font-weight-regular) var(--two-font-size-label)/1 var(--two-font-data);text-transform:uppercase;letter-spacing:var(--two-tracking-label);color:var(--two-color-text-tertiary);margin-bottom:var(--two-space-1)}
.life .who-did .bot{translate:0 0;width:12px;height:12px}
.life .who-did .bot.site{width:12px;height:12px}
.life h3{font:var(--two-font-weight-semibold) var(--two-font-size-body)/1.35 var(--two-font-display)}
.life p{font-size:var(--two-font-size-ui);color:var(--two-color-text-secondary)}
.life .done h3{color:var(--two-color-text-secondary)}
.life .next h3{color:var(--two-color-text-primary)}
.about p{font-size:var(--two-font-size-body-reading);color:var(--two-color-text-secondary);max-width:62ch}
.about p + p{margin-top:var(--two-space-inset-room)}
.people{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--two-space-1) var(--two-space-6)}
.person{display:flex;align-items:center;gap:var(--two-space-3);padding:var(--two-space-inset-tight) 0;border-top:1px solid var(--two-color-line-hairline)}
.person .av{border-width:0}
.person b{font:var(--two-font-weight-semibold) var(--two-font-size-ui)/1.2 var(--two-font-display);display:block}
.person span.s{font-size:13px;color:var(--two-color-text-tertiary)}
.person .tag{margin-left:auto}
.last{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--two-space-6);padding:var(--two-space-6) var(--two-space-inset-card-lg)}
.last .fact b{font-size:var(--two-font-size-h1)}
.last .fact p{font-size:19px}
.inst{display:flex;gap:var(--two-space-2);margin-bottom:var(--two-space-4);flex-wrap:wrap}
@media (max-width:820px){
  .ed{grid-template-columns:1fr;gap:var(--two-space-inset-card-lg);padding:var(--two-space-5) 0 var(--two-space-8)}
  .side{position:static;grid-column:1;grid-row:auto}
  .bodycol .blk:first-child{margin-top:var(--two-space-4)}
  .when{gap:var(--two-space-4);margin-top:var(--two-space-6);padding-top:var(--two-space-5);flex-wrap:wrap}
  .when p{font-size:var(--two-font-size-ui)}
  .blk{margin-top:44px}
  .life li{grid-template-columns:28px minmax(0,1fr);gap:var(--two-space-inset-room)}
  .life li::before{left:13px}
  .life time{grid-column:2;grid-row:1;text-align:left;font-size:var(--two-font-size-label)}
  .life .mk{grid-row:1/3;grid-column:1}
  .life li > div:last-child{grid-column:2}
  .people{grid-template-columns:1fr}
  .last{grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--two-space-3);padding:var(--two-space-inset-compact)}
  .last .fact b{font-size:var(--two-font-size-figure-compact)}
  .last .fact p{font-size:var(--two-font-size-ui)}
  .hide-mobile{display:none}
}`;

const going = [
  ["VX", "Vexa", "Host", 4],
  ["MO", "Mora", "You", 2],
  ["JD", "Jadis", "", 3],
  ["LU", "Lumen", "Guide", 4],
  ["AS", "Ashby", "", 2],
  ["KE", "Kestrel", "First time", 1],
  ["TI", "Tiko", "", 3],
  ["ZE", "Zephyr", "", 2],
];
const seats = Array.from({ length: 24 }, (_, i) =>
  i < 17
    ? av(
        [
          "VX",
          "MO",
          "JD",
          "LU",
          "AS",
          "KE",
          "TI",
          "ZE",
          "OK",
          "BR",
          "FA",
          "RY",
          "NO",
          "PE",
          "QU",
          "SA",
          "UL",
        ][i],
        C[i % C.length],
      )
    : '<span class="seat"></span>',
).join("");

const body = `${header("member", "events")}
<main id="main"><div class="wrap">
  <p class="crumb"><a href="#">Events</a> / Raid Night</p>
  <div class="ed">
    <div class="headcol">
      <div style="display:flex;gap:var(--two-space-2);flex-wrap:wrap"><span class="tag ok">Sign-ups open</span><span class="tag">Weekly · Fridays</span><span class="tag">Open to all ranks</span></div>
      <h1>Raid Night: <span class="serif">Deep Rock Galactic</span></h1>
      <div class="when">
        <b>21:00</b>
        <div><p>Friday 6 November, your time</p><p class="mono">Europe/London · 21:00 UTC · in 2 h 10 m · as of <time datetime="2026-11-06T18:50Z">18:50</time></p></div>
      </div>

    </div>
    <aside class="side" aria-label="Your seat and event facts">
      <div class="box rsvp">
        <div class="state"><h2>You're in. Seat 7.</h2><span class="tag ok">Saved</span></div>
        <div class="seats" role="img" aria-label="17 of 24 seats taken, 7 open">${seats}</div>
        <p class="count"><b>17 of 24 in</b> · 7 left · 3 on reserve</p>
        <div class="btns">
          <button class="pill quiet" aria-disabled="true">${I.pull}Pull me in · from 20:45</button>
          <a class="pill ghost" href="#">${I.cal}Add to calendar</a>
          <a class="linkbtn" href="#">I can't make it</a>
        </div>
        <p class="note">${I.bell}<span>The bot pings you at 20:30. If you drop out, the first reserve gets your seat and a ping.</span></p>
      </div>
      <div class="box facts-box hide-mobile-no">
        <dl class="kv">
          <dt>Host</dt><dd><a href="#">Vexa</a></dd>
          <dt>Room</dt><dd>Raid 1 voice</dd>
          <dt>Game</dt><dd>Deep Rock Galactic</dd>
          <dt>Repeats</dt><dd>Fridays, until 18 Dec</dd>
          <dt>Talk</dt><dd><a href="#">Discord thread</a></dd>
          <dt>Share</dt><dd><a href="#">Copy link</a></dd>
        </dl>
      </div>
    </aside>
    <div class="bodycol">
      <section class="blk" aria-labelledby="life-h">
        <h2 id="life-h">Lifeline <span class="mono">What the bot has done, and will do</span></h2>
        <ol class="life" role="list">
          <li class="done"><time>Mon 18:02</time><span class="mk">${I.check}</span><div><span class="who-did"><span class="bot" aria-hidden="true"></span>Bot</span><h3>Opened sign-ups and posted the event in #events</h3></div></li>
          <li class="done"><time>Tue 09:14</time><span class="mk">${I.check}</span><div><span class="who-did"><span class="bot site" aria-hidden="true"></span>You, on this site</span><h3>You said you're in. The bot saved seat 7</h3><p>Mark yourself Interested on the <a href="#">Discord event</a> too, and Discord will remind you.</p></div></li>
          <li class="next"><time>Fri 20:30</time><span class="mk"></span><div><span class="who-did"><span class="bot" aria-hidden="true"></span>Bot · next</span><h3>Pings everyone who's in, 30 minutes before</h3><p>As a Discord DM from the bot.</p></div></li>
          <li><time>Fri 20:45</time><span class="mk"></span><div><span class="who-did"><span class="bot" aria-hidden="true"></span>Bot</span><h3>Opens the Raid 1 room. "Pull me in" turns on here</h3></div></li>
          <li><time>Fri 21:00</time><span class="mk"></span><div><span class="who-did"><span class="bot" aria-hidden="true"></span>Bot</span><h3>Starts counting who's in the room</h3><p>Reserves move up if a seat is still empty at 21:10.</p></div></li>
          <li><time>When it ends</time><span class="mk"></span><div><span class="who-did"><span class="bot" aria-hidden="true"></span>Bot</span><h3>Freezes the Echo: who came and who stayed</h3><p>It lands on this page and on each player's profile.</p></div></li>
        </ol>
      </section>

      <section class="blk about" aria-labelledby="about-h">
        <h2 id="about-h">About this one</h2>
        <p>Four squads of four, hosted by Vexa. We play on Hazard 4, with a warm-up mission at 21:00 for anyone rusty. New to the game? Say so in the thread and a Guide will take you in their squad.</p>
        <p>Bring a mic if you can. Listening only is fine too.</p>
      </section>

      <section class="blk" aria-labelledby="who-h">
        <h2 id="who-h">Who's in <span class="mono">17 going · 3 reserve</span></h2>
        <ul class="people" role="list">${going
          .map(
            ([i, n, t, r], k) =>
              `<li class="person">${av(i, C[k % C.length]).replace('class="av"', 'class="av m"')}<div><b>${n}</b><span class="s rkl">${rk(r)}${["Prospect", "Member", "Soldier", "Veteran", "Legend"][r - 1]}</span></div>${t ? `<span class="tag${t === "You" ? " you" : t === "First time" ? " ok" : ""}">${t}</span>` : ""}</li>`,
          )
          .join("")}</ul>
        <p style="margin-top:var(--two-space-4)"><a class="pill ghost sm" href="#">See all 20</a></p>
      </section>

      <section class="blk" aria-labelledby="last-h">
        <h2 id="last-h">Last time <span class="mono">Echo · Fri 30 Oct</span></h2>
        <div class="inst chips" role="group" aria-label="Past dates"><a class="chip" aria-current="true" href="#">30 Oct</a><a class="chip" href="#">23 Oct</a><a class="chip" href="#">16 Oct</a><a class="chip" href="#">All dates</a></div>
        <div class="box last"><div class="fact"><b>18</b><p>of 21 came</p></div><div class="fact"><b>16</b><p>stayed to the end</p></div><div class="fact"><b>3</b><p>first-timers</p></div></div>
      </section>
    </div>

  </div>
</div></main>
<aside class="actionbar" aria-label="Your seat"><p><b style="color:var(--two-color-text-primary)">You're in · seat 7</b><br>Pull me in opens at 20:45</p><a class="pill ghost" href="#" style="flex:0 0 auto">${I.cal}<span class="sr">Add to calendar</span></a><button class="pill quiet" style="flex:0 0 auto" aria-disabled="true">${I.pull}Pull me in</button></aside>
${footer}`;

fs.writeFileSync(__dirname + "/event-detail.html", page("Raid Night", body, css, "has-bar"));
