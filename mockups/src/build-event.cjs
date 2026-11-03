const fs = require("fs");
const { rk, I, header, footer, page, av, C } = require("./parts.cjs");

const css = `
.crumb{padding:28px 0 0;font-size:14px;color:var(--two-color-text-tertiary)}
.crumb a{color:var(--two-color-text-secondary)}
.ed{display:grid;grid-template-columns:minmax(0,1fr) 380px;gap:0 56px;padding:36px 0 72px;align-items:start}
.ed h1{font:560 var(--two-font-size-h1)/1 var(--two-font-display);font-stretch:108%;letter-spacing:-.04em;text-wrap:balance;margin-top:18px}
.ed h1 .serif{font-size:1.08em}
.when{display:flex;align-items:flex-end;gap:24px;margin-top:36px;padding-top:28px;border-top:1px solid var(--two-color-line-hairline)}
.when b{font:500 var(--two-font-size-figure)/.85 var(--two-font-display);font-stretch:108%;letter-spacing:-.05em;font-variant-numeric:tabular-nums}
.when p{font-size:17px;color:var(--two-color-text-primary)}
.when p + p{margin-top:6px}
.when p.mono{font-size:13px;color:var(--two-color-text-tertiary)}
.headcol{grid-column:1}.bodycol{grid-column:1}.side{grid-column:2;grid-row:1/3;position:sticky;top:92px;display:grid;gap:16px}
.rsvp{padding:22px}
.rsvp .state{display:flex;align-items:center;justify-content:space-between;gap:12px}
.rsvp h2{font:600 20px/1.2 var(--two-font-display)}
.seats{display:flex;flex-wrap:wrap;gap:6px;margin:20px 0 12px}
.seats .av{--bg:var(--two-color-bg-surface);border-width:0}
.rsvp .count{font-size:15px;color:var(--two-color-text-secondary)}
.rsvp .count b{color:var(--two-color-text-primary);font-weight:600}
.rsvp .btns{display:grid;gap:10px;margin-top:20px}
.rsvp .btns .pill{width:100%}
.rsvp .note{display:flex;gap:10px;align-items:flex-start;margin-top:16px;font-size:14px;color:var(--two-color-text-secondary)}
.rsvp .note .ico{color:var(--two-color-accent-default);margin-top:1px}
.linkbtn{font:500 14px/1 var(--two-font-display);color:var(--two-color-text-secondary);text-decoration:underline;text-underline-offset:3px;justify-self:center;padding:8px}
.facts-box{padding:8px 22px}
.blk{margin-top:56px}
.blk > h2{font:560 var(--two-font-size-h3)/1.1 var(--two-font-display);font-stretch:108%;letter-spacing:-.025em;margin-bottom:22px;display:flex;justify-content:space-between;align-items:baseline;gap:16px}
.blk > h2 .mono{font-size:12px;letter-spacing:.04em}
.life{position:relative}
.life li{display:grid;grid-template-columns:118px 28px minmax(0,1fr);gap:16px;padding-bottom:22px;position:relative}
.life li::before{content:"";position:absolute;left:131px;top:20px;bottom:-2px;width:2px;background:var(--two-color-line-hairline-strong)}
.life li:last-child::before{display:none}
.life li.done::before{background:var(--two-color-text-tertiary)}
.life time{font:400 13px/1.5 var(--two-font-data);color:var(--two-color-text-tertiary);text-align:right}
.life .mk{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:var(--two-color-bg-canvas);box-shadow:inset 0 0 0 2px var(--two-color-line-hairline-strong);position:relative;z-index:1}
.life .done .mk{background:var(--two-color-bg-overlay);box-shadow:none;color:var(--two-color-text-secondary)}
.life .done .mk .ico{width:16px;height:16px}
.life .next .mk{box-shadow:inset 0 0 0 2px var(--two-color-accent-default)}
.life .next .mk::after{content:"";width:10px;height:10px;border-radius:50%;background:var(--two-color-accent-default)}
.life .who-did{display:inline-flex;align-items:center;gap:6px;font:400 12px/1 var(--two-font-data);text-transform:uppercase;letter-spacing:.04em;color:var(--two-color-text-tertiary);margin-bottom:4px}
.life .who-did .bot{translate:0 0;width:12px;height:12px}
.life .who-did .bot.site{width:12px;height:12px}
.life h3{font:600 16px/1.35 var(--two-font-display)}
.life p{font-size:15px;color:var(--two-color-text-secondary)}
.life .done h3{color:var(--two-color-text-secondary)}
.life .next h3{color:var(--two-color-text-primary)}
.about p{font-size:17px;color:var(--two-color-text-secondary);max-width:62ch}
.about p + p{margin-top:14px}
.people{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px 24px}
.person{display:flex;align-items:center;gap:12px;padding:10px 0;border-top:1px solid var(--two-color-line-hairline)}
.person .av{border-width:0}
.person b{font:600 15px/1.2 var(--two-font-display);display:block}
.person span.s{font-size:13px;color:var(--two-color-text-tertiary)}
.person .tag{margin-left:auto}
.last{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;padding:24px 28px}
.last .fact b{font-size:var(--two-font-size-h1)}
.last .fact p{font-size:19px}
.inst{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap}
@media (max-width:820px){
  .ed{grid-template-columns:1fr;gap:28px;padding:20px 0 40px}
  .side{position:static;grid-column:1;grid-row:auto}
  .bodycol .blk:first-child{margin-top:16px}
  .when{gap:16px;margin-top:24px;padding-top:20px;flex-wrap:wrap}
  .when p{font-size:15px}
  .blk{margin-top:44px}
  .life li{grid-template-columns:28px minmax(0,1fr);gap:14px}
  .life li::before{left:13px}
  .life time{grid-column:2;grid-row:1;text-align:left;font-size:12px}
  .life .mk{grid-row:1/3;grid-column:1}
  .life li > div:last-child{grid-column:2}
  .people{grid-template-columns:1fr}
  .last{grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;padding:18px}
  .last .fact b{font-size:var(--two-font-size-figure-compact)}
  .last .fact p{font-size:15px}
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
      <div style="display:flex;gap:8px;flex-wrap:wrap"><span class="tag ok">Sign-ups open</span><span class="tag">Weekly · Fridays</span><span class="tag">Open to all ranks</span></div>
      <h1>Raid Night: <span class="serif">Deep Rock Galactic</span></h1>
      <div class="when">
        <b>21:00</b>
        <div><p>Friday 7 November, your time</p><p class="mono">Europe/London · 21:00 UTC · in 2 h 10 m</p></div>
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
          <dt>Repeats</dt><dd>Fridays, until 19 Dec</dd>
          <dt>Talk</dt><dd><a href="#">Discord thread</a></dd>
          <dt>Share</dt><dd><a href="#">Copy link</a></dd>
        </dl>
      </div>
    </aside>
    <div class="bodycol">
      <section class="blk" aria-labelledby="life-h">
        <h2 id="life-h">Lifeline <span class="mono">What the bot has done, and will do</span></h2>
        <ol class="life">
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
        <ul class="people">${going
          .map(
            ([i, n, t, r], k) =>
              `<li class="person">${av(i, C[k % C.length]).replace('class="av"', 'class="av m"')}<div><b>${n}</b><span class="s rkl">${rk(r)}${["Prospect", "Member", "Soldier", "Veteran", "Legend"][r - 1]}</span></div>${t ? `<span class="tag${t === "You" ? " you" : t === "First time" ? " ok" : ""}">${t}</span>` : ""}</li>`,
          )
          .join("")}</ul>
        <p style="margin-top:16px"><a class="pill ghost sm" href="#">See all 20</a></p>
      </section>

      <section class="blk" aria-labelledby="last-h">
        <h2 id="last-h">Last time <span class="mono">Echo · Fri 31 Oct</span></h2>
        <div class="inst chips" role="group" aria-label="Past dates"><a class="chip" aria-current="true" href="#">31 Oct</a><a class="chip" href="#">24 Oct</a><a class="chip" href="#">17 Oct</a><a class="chip" href="#">All dates</a></div>
        <div class="box last"><div class="fact"><b>18</b><p>of 21 came</p></div><div class="fact"><b>16</b><p>stayed to the end</p></div><div class="fact"><b>3</b><p>first-timers</p></div></div>
      </section>
    </div>

  </div>
</div></main>
<aside class="actionbar" aria-label="Your seat"><p><b style="color:var(--two-color-text-primary)">You're in · seat 7</b><br>Pull me in opens at 20:45</p><a class="pill ghost" href="#" style="flex:0 0 auto">${I.cal}<span class="sr">Add to calendar</span></a><button class="pill quiet" style="flex:0 0 auto" aria-disabled="true">${I.pull}Pull me in</button></aside>
${footer}`;

fs.writeFileSync(__dirname + "/event-detail.html", page("Raid Night", body, css, "has-bar"));
