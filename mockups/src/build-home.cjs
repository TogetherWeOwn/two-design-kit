const fs = require("fs");
const { rk, discord, I, header, footer, page, av, C } = require("./parts.cjs");

const css = `
.hero{display:grid;grid-template-columns:minmax(0,1fr) var(--two-layout-hero-panel);gap:var(--two-space-9);padding-top:var(--two-space-10);padding-bottom:var(--two-space-11);align-items:end}
.hero .mono{display:flex;gap:var(--two-space-inset-tight);align-items:center;margin-bottom:var(--two-space-inset-card-lg)}
.sentence{font:var(--two-font-weight-display) var(--two-font-size-hero)/var(--two-line-height-display) var(--two-font-display);font-stretch:var(--two-font-width-display);letter-spacing:var(--two-tracking-display);text-wrap:balance}
.sentence .serif{font-size:1.1em;letter-spacing:-.02em}
.cta{display:flex;align-items:center;gap:var(--two-space-5);margin-top:var(--two-space-8);flex-wrap:wrap}
.cta p{color:var(--two-color-text-secondary);font-size:var(--two-font-size-ui);max-width:34ch;line-height:1.45}
.room{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:var(--two-space-inset-tight) var(--two-space-3);padding:var(--two-space-inset-room);border-radius:var(--two-radius-m)}
.room:nth-child(odd){background:var(--two-color-bg-raised)}
.room h3{font:var(--two-font-weight-semibold) var(--two-font-size-body)/1.2 var(--two-font-display)}
.room p{font-size:var(--two-font-size-small);color:var(--two-color-text-secondary)}
.room .av{--bg:var(--two-color-bg-surface)}
.room:nth-child(odd) .av{--bg:var(--two-color-bg-raised)}
.room .act{grid-column:1/-1;display:flex;justify-content:space-between;align-items:center}
.panel-f{padding:var(--two-space-3) var(--two-space-inset-room) var(--two-space-inset-tight);display:flex;justify-content:space-between;align-items:center;gap:var(--two-space-3)}
.panel-f a{font:var(--two-font-weight-medium) var(--two-font-size-small)/1 var(--two-font-display);color:var(--two-color-accent-default)}
.week{background:var(--two-color-bg-surface);border:1px solid var(--two-color-line-hairline);border-radius:var(--two-radius-l);padding:var(--two-space-inset-card) var(--two-space-6) var(--two-space-6);position:relative}
.axis,.day{display:grid;grid-template-columns:72px repeat(var(--h),1fr);align-items:center}
.axis span{font:var(--two-font-weight-regular) var(--two-font-size-label)/1 var(--two-font-data);color:var(--two-color-text-tertiary);padding-bottom:var(--two-space-inset-tight)}
.day{height:46px;position:relative}
.day + .day{border-top:1px solid var(--two-color-line-hairline)}
.day > b{font:var(--two-font-weight-regular) var(--two-font-size-label)/1 var(--two-font-data);text-transform:uppercase;letter-spacing:var(--two-tracking-label);color:var(--two-color-text-secondary);font-weight:400}
.day.today > b{color:var(--two-color-text-primary)}
.day .heat{grid-column:2/-1;grid-row:1;display:grid;grid-template-columns:repeat(var(--h),1fr);height:30px;gap:2px}
.heat i{border-radius:3px;background:rgba(255,156,54,calc(var(--v)*.42))}
.ev{grid-row:1;z-index:1;height:30px;border-radius:7px;display:flex;align-items:center;gap:6px;padding:0 var(--two-space-inset-tight);font:var(--two-font-weight-semibold) 13px/1 var(--two-font-display);white-space:nowrap;overflow:hidden;background:var(--two-color-bg-overlay);box-shadow:inset 0 0 0 1px var(--two-color-line-hairline-strong)}
.ev small{font:var(--two-font-weight-regular) var(--two-font-size-label)/1 var(--two-font-data);color:var(--two-color-text-secondary)}
.ev.mine{box-shadow:inset 0 0 0 1.5px var(--two-color-accent-default)}
.now{position:absolute;top:-6px;bottom:-6px;width:2px;background:var(--two-gradient-brand);border-radius:2px;z-index:2}
.now span{position:absolute;bottom:100%;left:50%;translate:-50% -4px;font:var(--two-font-weight-regular) var(--two-font-size-label)/1 var(--two-font-data);text-transform:uppercase;white-space:nowrap;color:var(--two-color-text-primary);background:var(--two-color-bg-canvas);border:1px solid var(--two-color-line-hairline-strong);padding:var(--two-space-1) 6px;border-radius:4px}
.legend{display:flex;gap:var(--two-space-6);margin-top:var(--two-space-inset-compact);flex-wrap:wrap;align-items:center}
.legend span{display:inline-flex;align-items:center;gap:var(--two-space-2);font-size:13px;color:var(--two-color-text-secondary)}
.legend .est{margin-left:auto}
.sw{width:22px;height:12px;border-radius:3px;background:linear-gradient(90deg,rgba(255,156,54,.06),var(--two-color-heat-max))}
.two{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:var(--two-space-6)}
.box h2 .rest{color:var(--two-color-text-tertiary)}
.ledger{margin-top:var(--two-space-inset-card)}
.stand{margin-top:var(--two-space-6);display:grid;gap:var(--two-space-inset-card)}
.stand .big{display:flex;align-items:center;gap:var(--two-space-inset-compact)}
.stand .big b{display:block;font:var(--two-font-weight-display) 34px/1 var(--two-font-display);font-stretch:var(--two-font-width-display);letter-spacing:-.03em}
.stand .big p{color:var(--two-color-text-secondary);font-size:var(--two-font-size-ui);margin-top:var(--two-space-1)}
.bar{height:8px;border-radius:99px;background:var(--two-color-bg-overlay);overflow:hidden}
.bar i{display:block;height:100%;width:var(--p);background:var(--two-color-accent-default);border-radius:99px}
.stand .kv dd{font-variant-numeric:tabular-nums}
.hl{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--two-space-6)}
.hl li{border-top:1px solid var(--two-color-line-hairline-strong);padding-top:var(--two-space-inset-compact)}
.hl h3{font:var(--two-font-weight-semibold) 19px/1.25 var(--two-font-display);margin:var(--two-space-inset-tight) 0 6px}
.hl p{color:var(--two-color-text-secondary);font-size:var(--two-font-size-ui)}
.trust{display:flex;gap:var(--two-space-inset-card-lg);flex-wrap:wrap;margin-top:36px;color:var(--two-color-text-secondary);font-size:var(--two-font-size-ui)}
.trust b{font:var(--two-font-weight-medium) var(--two-font-size-ui)/1 var(--two-font-data);color:var(--two-color-text-primary);margin-right:6px}
@media (max-width:820px){
  .hero{grid-template-columns:1fr;gap:var(--two-space-7);padding-top:36px;padding-bottom:48px}
  .hero .mono{margin-bottom:var(--two-space-inset-compact)}
  .cta{margin-top:var(--two-space-inset-card-lg);gap:var(--two-space-inset-room)}
  .cta .pill{width:100%;height:52px}
  .week{padding:var(--two-space-4) var(--two-space-3) var(--two-space-inset-compact);border-radius:14px}
  .axis,.day{grid-template-columns:44px repeat(var(--h),1fr)}
  .legend .est{margin-left:0}
  .two{grid-template-columns:1fr;gap:var(--two-space-4)}
  .hl{grid-template-columns:1fr;gap:var(--two-space-5)}
  .trust{gap:var(--two-space-inset-room) var(--two-space-6);margin-top:var(--two-space-inset-card-lg)}
}`;

const heat = (vals) =>
  `<div class="heat">${vals.map((v) => `<i style="--v:${v}"></i>`).join("")}</div>`;
const nowLine = (member) => `
<div class="week only-d" style="--h:10" aria-hidden="true">
  <div class="axis"><span></span><span>16:00</span><span>17</span><span>18</span><span>19</span><span>20</span><span>21</span><span>22</span><span>23</span><span>00</span><span>01</span></div>
  <div class="day"><b>Mon</b>${heat([0.1, 0.15, 0.25, 0.4, 0.55, 0.6, 0.5, 0.35, 0.15, 0.05])}</div>
  <div class="day"><b>Tue</b>${heat([0.1, 0.15, 0.2, 0.35, 0.5, 0.55, 0.5, 0.3, 0.15, 0.05])}</div>
  <div class="day"><b>Wed</b>${heat([0.1, 0.15, 0.25, 0.4, 0.6, 0.7, 0.55, 0.35, 0.15, 0.05])}<span class="ev" style="grid-column:6/8">Town hall <small>31</small></span></div>
  <div class="day"><b>Thu</b>${heat([0.1, 0.2, 0.25, 0.45, 0.6, 0.65, 0.55, 0.4, 0.2, 0.1])}</div>
  <div class="day today"><b>Fri</b>${heat([0.15, 0.2, 0.35, 0.55, 0.75, 0.95, 1, 0.85, 0.6, 0.3])}<span class="ev${member ? " mine" : ""}" style="grid-column:7/10">Raid Night <small>23${member ? " · you're in" : ""}</small></span><span class="now" style="left:calc(var(--two-space-10) + (100% - var(--two-space-10)) * .285)" aria-hidden="true"><span>Now 18:50</span></span></div>
  <div class="day"><b>Sat</b>${heat([0.3, 0.35, 0.45, 0.6, 0.8, 0.9, 0.95, 0.85, 0.65, 0.4])}<span class="ev" style="grid-column:5/8">Valorant scrims <small>9</small></span></div>
  <div class="day"><b>Sun</b>${heat([0.35, 0.4, 0.6, 0.65, 0.55, 0.45, 0.35, 0.2, 0.1, 0.05])}<span class="ev" style="grid-column:4/7">Sunday Grand Prix <small>14</small></span></div>
  <div class="legend"><span><i class="sw" aria-hidden="true"></i>Usually quiet → usually busy</span>${member ? '<span><i class="sw" style="background:none;box-shadow:inset 0 0 0 1.5px var(--two-color-accent-default)" aria-hidden="true"></i>You\'re going</span>' : ""}<span><i class="sw" style="width:2px;background:var(--two-gradient-brand)" aria-hidden="true"></i>Now, your time</span><span class="mono est">Shading: estimate, 8 weeks of voice</span></div>
</div>
<div class="sr only-d"><h3>This week as a list</h3><ul role="list"><li>Week from 16:00 to 02:00, your time.</li><li>Usually busiest Friday and Saturday, 20:00 to midnight.</li><li>Town hall, Wednesday 20:00.</li><li>Raid Night, Friday 21:00${member ? ", you're going" : ""}.</li><li>Valorant scrims, Saturday 19:30.</li><li>Sunday Grand Prix, Sunday 18:00.</li><li>Now: Friday 18:50.</li></ul></div>
<div class="week only-m" style="--h:8" aria-hidden="true">
  <div class="axis"><span></span><span>17</span><span></span><span>19</span><span></span><span>21</span><span></span><span>23</span><span></span></div>
  <div class="day today"><b>Fri</b>${heat([0.2, 0.35, 0.55, 0.75, 0.95, 1, 0.85, 0.6])}<span class="ev${member ? " mine" : ""}" style="grid-column:6/10">Raid Night</span><span class="now" style="left:calc(44px + (100% - 44px) * .23)" aria-hidden="true"></span></div>
  <div class="day"><b>Sat</b>${heat([0.35, 0.45, 0.6, 0.8, 0.9, 0.95, 0.85, 0.65])}<span class="ev" style="grid-column:4/7">Scrims</span></div>
  <div class="day"><b>Sun</b>${heat([0.4, 0.6, 0.65, 0.55, 0.45, 0.35, 0.2, 0.1])}<span class="ev" style="grid-column:3/6">Grand Prix</span></div>
  <div class="legend"><span><i class="sw" aria-hidden="true"></i>Quiet → busy</span>${member ? '<span><i class="sw" style="background:none;box-shadow:inset 0 0 0 1.5px var(--two-color-accent-default)" aria-hidden="true"></i>You\'re going</span>' : ""}<span class="mono est">Estimate</span></div>
</div>
<div class="sr only-m"><h3>This week as a list</h3><ul role="list"><li>Tonight and the weekend, 17:00 to 01:00.</li><li>Raid Night, tonight 21:00${member ? ", you're going" : ""}.</li><li>Valorant scrims, Saturday 19:30.</li><li>Sunday Grand Prix, Sunday 18:00.</li><li>Now: 18:50.</li></ul></div>`;

const rooms = (member) => {
  const R = [
    ["Squad 1", "Helldivers 2 · 1 h 12 m", ["VX", "KE", "MO"], 4, "2 seats"],
    ["The Lounge", "Just talking · 2 h 40 m", ["JD", "LU", "AS", "TI"], 6, "open"],
    ["Ranked grind", "Valorant · 25 m", ["ZE", "OK", "BR", "FA"], 4, "1 seat"],
  ];
  return R.map(
    ([n, d, ps, count, room], k) => `<li class="room"><div><h3>${n}</h3><p>${d}</p></div>
    <div class="avs" role="img" aria-label="${count} people">${ps
      .map((p, i) => (member ? av(p, C[(i + k * 3) % C.length]) : `<span class="av anon"></span>`))
      .join(
        "",
      )}${count > ps.length ? `<span class="av more" style="--c:var(--two-color-ground-4)">+${count - ps.length}</span>` : ""}</div>
    ${member ? `<div class="act"><span class="mono">${room}</span><button class="pill ghost sm">${I.pull}Pull me in</button></div>` : ""}</li>`,
  ).join("");
};

const rows = (member) => `
<div class="group"><h3>Now and tonight</h3><ul role="list">
  <li class="row is-live"><time><b>Live now</b>since 18:30</time><span class="glyph half" aria-hidden="true"></span><div class="meta"><h4>Helldivers 2 drop-in <span class="tag live">Live</span></h4><p>Squad 1 · open to all ranks</p></div><span class="who"><span class="avs" aria-hidden="true">${member ? av("VX", C[0]) + av("KE", C[1]) + av("MO", C[7]) : '<span class="av anon"></span><span class="av anon"></span><span class="av anon"></span>'}</span>4 playing</span><a class="pill sm act" href="#">${member ? "Pull me in" : "Watch"}</a></li>
  <li class="row"><time><b>Fri 21:00</b>in 2 h 10 m</time><span class="glyph${member ? " mine" : ""}" aria-hidden="true"></span><div class="meta"><h4>Raid Night: Deep Rock Galactic ${member ? '<span class="tag you">You\'re in</span>' : ""}</h4><p>Hosted by Vexa · 7 seats left</p></div><span class="who"><span class="avs" aria-hidden="true">${member ? av("JD", C[4]) + av("LU", C[5]) + av("AS", C[6]) : '<span class="av anon"></span><span class="av anon"></span><span class="av anon"></span>'}</span>17 going</span><a class="pill ghost sm act" href="#">Details</a></li>
</ul></div>
<div class="group"><h3>This weekend</h3><ul role="list">
  <li class="row"><time><b>Sat 19:30</b>tomorrow</time><span class="glyph" aria-hidden="true"></span><div class="meta"><h4>Valorant 5-stack scrims ${member ? "" : '<span class="tag">Members</span>'}</h4><p>Ranked grind · Soldier and up</p></div><span class="who"><span class="avs" aria-hidden="true">${member ? av("ZE", C[1]) + av("OK", C[5]) : '<span class="av anon"></span><span class="av anon"></span>'}</span>9 going</span><a class="pill ghost sm act" href="#">${member ? "I'm in" : "Details"}</a></li>
  <li class="row"><time><b>Sun 18:00</b>in 2 days</time><span class="glyph" aria-hidden="true"></span><div class="meta"><h4>Sunday Grand Prix <span class="tag">Open to all</span></h4><p>Forza Horizon 5 · newcomers welcome</p></div><span class="who"><span class="avs" aria-hidden="true">${member ? av("BR", C[0]) + av("FA", C[3]) : '<span class="av anon"></span><span class="av anon"></span>'}</span>14 going</span><a class="pill ghost sm act" href="#">${member ? "I'm in" : "Details"}</a></li>
</ul></div>`;

const ledger = (member) => `<ol class="ledger" role="list">
  <li><span class="bot" aria-hidden="true"></span><p>Gave ${member ? "<b>Kestrel</b>" : "a new member"} the Prospect rank after they joined from this site</p><span class="mono">4 m</span></li>
  <li><span class="bot site" aria-hidden="true"></span><p>${member ? "<b>Mora</b> said they're in" : "A member said they're in"} for <b>Raid Night</b>, from the site. The bot saved a seat</p><span class="mono">12 m</span></li>
  <li><span class="bot" aria-hidden="true"></span><p>Opened sign-ups for <b>Raid Night</b> and posted it in #events</p><span class="mono">1 h</span></li>
  <li><span class="bot" aria-hidden="true"></span><p>Promoted ${member ? "<b>Juno</b>" : "a member"} to Veteran: 50 events, 2 years</p><span class="mono">3 h</span></li>
  <li><span class="bot" aria-hidden="true"></span><p>Froze the Echo for <b>Sunday Grand Prix</b>: 18 were there</p><span class="mono">6 d</span></li>
</ol>`;

// ---------- member home ----------
const member = page(
  "Home",
  `${header("member", "")}
<main id="main">
  <section class="wrap hero" aria-labelledby="live-sentence">
    <div>
      <p class="mono"><span class="dot ok" aria-hidden="true"></span>Live from our Discord · updated 20 s ago</p>
      <h1 class="sentence enter" id="live-sentence">You're in for <span class="serif">Raid Night</span> at 21:00. <span class="rest">14 of us are already in voice.</span></h1>
      <div class="cta">
        <button class="pill lg">${I.pull}Pull me into Squad 1</button>
        <p>The bot moves you if you're in any of our voice rooms. If not, Discord opens Squad 1 for you.</p>
      </div>
    </div>
    <aside class="panel" aria-labelledby="voice-h">
      <div class="panel-h"><h2 id="voice-h">In voice now</h2><span class="mono">3 rooms · 14 people</span></div>
      <ul role="list">${rooms(true)}</ul>
    </aside>
  </section>

  <section class="sec" aria-labelledby="week-h"><div class="wrap">
    <div class="sec-h"><h2 id="week-h">Your week, <span class="rest">and when we play.</span></h2><p>Shading shows when members are usually on, learned by the bot from voice. Your events have an ember outline. The marker is now, in your time zone (Europe/London).</p></div>
    ${nowLine(true)}
  </div></section>

  <section class="sec" aria-labelledby="ev-h"><div class="wrap">
    <div class="sec-h"><h2 id="ev-h">What's on. <span class="rest">Say you're in.</span></h2><p>Saying you're in tells the bot: it saves your seat, pings you 30 minutes before and opens the room when the host starts.</p></div>
    ${rows(true)}
  </div></section>

  <section class="sec" aria-label="The bot's log and your standing"><div class="wrap two">
    <div class="box"><h2>The bot's log. <span class="rest">Out in the open.</span></h2>${ledger(true)}</div>
    <div class="box"><h2>Where you stand. <span class="rest">Season 4.</span></h2>
      <div class="stand">
        <div class="big">${rk(2, "l")}<div><b>Member</b><p>6 more events to Soldier</p></div></div>
        <div class="bar" role="img" aria-label="14 of 20 events toward Soldier"><i style="--p:70%"></i></div>
        <dl class="kv"><dt>This season</dt><dd>#14 of 212 · up 3</dd><dt>Came to</dt><dd>9 events, 4 weeks in a row</dd><dt>Next</dt><dd><a href="#">Raid Night, Fri 21:00</a></dd></dl>
      </div>
    </div>
  </div></section>

  <section class="sec" aria-labelledby="echo-h"><div class="wrap">
    <div class="sec-h"><h2 id="echo-h">Last Sunday, <span class="rest">you were one of <span class="serif">18.</span></span></h2><p>Every event leaves an Echo: who signed up, who came and who stayed. The bot freezes it when the event ends, and it lands on your profile.</p></div>
    <div class="facts"><div class="fact"><b>18</b><p>of 21 who signed up came</p></div><div class="fact"><b>15</b><p>stayed to the last race</p></div><div class="fact"><b>4</b><p>first-timers, all Prospects</p></div></div>
  </div></section>
</main>
${footer}`,
  css,
);

// ---------- guest home (logged-out landing) ----------
const guest = page(
  "Home",
  `${header("guest", "")}
<main id="main">
  <section class="wrap hero" aria-labelledby="live-sentence">
    <div>
      <p class="mono"><span class="dot ok" aria-hidden="true"></span>Live from our Discord · updated 20 s ago</p>
      <h1 class="sentence enter" id="live-sentence">14 of us are in voice right now. <span class="rest"><span class="serif">Raid Night</span> starts in 2 h 10 m, and 17 are going.</span></h1>
      <div class="cta">
        <a class="pill lg" href="#">${discord}Join with Discord</a>
        <p>One tap. The bot adds you to the server, gives you your first rank and brings you back here.</p>
      </div>
      <div class="trust"><span><b>814</b>members</span><span><b>212</b>came to an event this month</span><span><b>1998</b>founded</span></div>
    </div>
    <aside class="panel" aria-labelledby="voice-h">
      <div class="panel-h"><h2 id="voice-h">In voice now</h2><span class="mono">3 rooms · 14 people</span></div>
      <ul role="list">${rooms(false)}</ul>
      <div class="panel-f"><span class="mono">Names show once you join</span><a href="#">Why?</a></div>
    </aside>
  </section>

  <section class="sec" aria-labelledby="hl-h"><div class="wrap">
    <div class="sec-h"><h2 id="hl-h">What happens here. <span class="rest">Every week.</span></h2><p>One community, on Discord and on this site. The bot keeps the two in step: what you do on one shows up on the other.</p></div>
    <ul class="hl" role="list">
      <li><span class="mono">Fridays · 21:00 UTC</span><h3>Raid Night</h3><p>A different co-op game each month. Hosts save seats, so you're never the spare.</p></li>
      <li><span class="mono">Sundays · 18:00 UTC</span><h3>Sunday Grand Prix</h3><p>Open to everyone, newcomers included. Bring a controller, not a reputation.</p></li>
      <li><span class="mono">Monthly</span><h3>A ladder that resets</h3><p>Standing comes from showing up, and it resets each month, so new members can win it too.</p></li>
      <li><span class="mono">Always</span><h3>A bot that remembers</h3><p>It counts who came, gives ranks as you play and writes it all in a public log.</p></li>
    </ul>
  </div></section>

  <section class="sec" aria-labelledby="week-h"><div class="wrap">
    <div class="sec-h"><h2 id="week-h">This week, <span class="rest">when we play.</span></h2><p>The shading is when members are usually on. Events sit on the same line, so you can see when to show up.</p></div>
    ${nowLine(false)}
  </div></section>

  <section class="sec" aria-labelledby="ev-h"><div class="wrap">
    <div class="sec-h"><h2 id="ev-h">What's on. <span class="rest">Come along.</span></h2><p>Events marked "Open to all" welcome people who haven't joined yet. Everything else needs one Discord sign-in.</p></div>
    ${rows(false)}
  </div></section>

  <section class="sec" aria-labelledby="log-h"><div class="wrap two">
    <div class="box"><h2 id="log-h">The bot's log. <span class="rest">Out in the open.</span></h2>${ledger(false)}</div>
    <div class="box"><h2>Last Sunday. <span class="rest">The bot was counting.</span></h2>
      <div class="facts" style="grid-template-columns:1fr 1fr;margin-top:var(--two-space-6)"><div class="fact"><b>18</b><p>of 21 came</p></div><div class="fact"><b>4</b><p>were first-timers</p></div></div>
      <p style="color:var(--two-color-text-secondary);margin-top:var(--two-space-inset-card);font-size:var(--two-font-size-ui)">Every event leaves an Echo, frozen when it ends. Showing up is what counts here.</p>
    </div>
  </div></section>

  <section class="joinband" aria-labelledby="join-h"><div class="wrap">
    <div><h2 id="join-h">Pull up a <em>chair.</em></h2><p>Sign in with Discord once. You're in the server, you have a rank, and the site knows which events are yours.</p></div>
    <a class="pill lg" href="#">${discord}Join with Discord</a>
  </div></section>
</main>
${footer}`,
  css,
);

fs.writeFileSync(__dirname + "/home-member.html", member);
fs.writeFileSync(__dirname + "/home-guest.html", guest);
