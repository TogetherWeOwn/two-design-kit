// Shared fragments for the Ember Hours mockups. Fixture names and numbers are invented.
const ARCS = [
  "M22 4a18 18 0 0 1 12.7 5.3",
  "M37.4 13.5a18 18 0 0 1 0 17",
  "M34.7 34.7A18 18 0 0 1 22 40",
  "M17.5 39.4a18 18 0 0 1-12.9-12",
  "M4.4 21.8A18 18 0 0 1 17.5 4.6",
];
const RANKS = ["Prospect", "Member", "Soldier", "Veteran", "Legend"];
const ARC_COL = ["#FF9C36", "#FF9C36", "#FF0E52", "#FF0E52", "#9D6AFF"];
// Rank glyph: the logo's clipped arcs, one more segment lit per rank.
const rk = (n, cls = "") =>
  `<svg class="rk ${cls}" viewBox="0 0 44 44" aria-hidden="true"><g fill="none" stroke-width="4.5">${ARCS.map(
    (d, i) => `<path d="${d}" stroke="${i < n ? ARC_COL[i] : "#3E322C"}"/>`,
  ).join("")}</g></svg>`;
const rankLabel = (n) => `<span class="rkl">${rk(n)}<span>${RANKS[n - 1]}</span></span>`;

const discord = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19.6 5.3A17 17 0 0 0 15.4 4l-.5 1.1a15.7 15.7 0 0 0-5.8 0L8.6 4a17 17 0 0 0-4.2 1.3C1.7 9.3 1 13.2 1.3 17a17 17 0 0 0 5.2 2.6l1.1-1.8a11 11 0 0 1-1.7-.8l.4-.3a12.2 12.2 0 0 0 11.4 0l.4.3-1.7.8 1.1 1.8a17 17 0 0 0 5.2-2.6c.4-4.4-.7-8.3-3.1-11.7ZM8.7 14.7c-1 0-1.9-1-1.9-2.1s.8-2.1 1.9-2.1 1.9 1 1.9 2.1-.8 2.1-1.9 2.1Zm6.6 0c-1 0-1.9-1-1.9-2.1s.8-2.1 1.9-2.1 1.9 1 1.9 2.1-.8 2.1-1.9 2.1Z"/></svg>`;

const I = {
  // our own 24px stroke set
  pull: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h11"/><path d="m11 7 5 5-5 5"/><path d="M20 4v16"/></svg>',
  cal: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/></svg>',
  share:
    '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11"/><path d="m7.5 8.5 4.5-4.5 4.5 4.5"/><path d="M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/></svg>',
  thread:
    '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v10H10l-5 4z"/></svg>',
  voice:
    '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2"/></svg>',
  search:
    '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.4-4.4"/></svg>',
  check:
    '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  bell: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5h4"/></svg>',
  menu: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  up: '<svg class="ico s" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg>',
  down: '<svg class="ico s" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
  edit: '<svg class="ico s" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>',
  lock: '<svg class="ico s" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/></svg>',
};

const NAV = [
  ["events", "Events"],
  ["ladder", "Ladder"],
  ["members", "Members"],
  ["about", "About"],
];
const header = (who, cur) => `<a class="skip pill sm" href="#main">Skip to content</a>
<header class="top"><div class="wrap">
  <a href="#" aria-label="Together We Own, home"><img class="lockup" src="brand/lockup-horizontal.svg" alt=""></a>
  <nav class="main" aria-label="Main"><ul>${NAV.map(
    ([k, l]) => `<li><a href="#"${k === cur ? ' aria-current="page"' : ""}>${l}</a></li>`,
  ).join("")}</ul></nav>
  <div class="h-right">
    <span class="status mono"><span class="dot ok" aria-hidden="true"></span>132 online</span>
    ${
      who === "guest"
        ? `<a class="pill ghost sm hide-m" href="#">Sign in</a><a class="pill sm" href="#">Join</a>`
        : `<a class="pill ghost sm hide-m" href="#" aria-label="Notifications">${I.bell}</a><a class="me" href="#"><span class="av m" style="--c:var(--two-color-avatar-7)">MO</span><span class="hide-m">Mora</span></a>`
    }
    <button class="pill ghost sm menu" aria-expanded="false" aria-controls="menu-sheet" aria-label="Menu">${I.menu}</button>
  </div>
</div></header>
<nav class="sheet" id="menu-sheet" aria-label="Menu" hidden>${NAV.map(([k, l]) => `<a href="#"${k === cur ? ' aria-current="page"' : ""}>${l}</a>`).join("")}${who === "guest" ? '<a href="#">Sign in</a>' : '<a href="#">Your profile</a><a href="#">Sign out</a>'}</nav>
<script>
(() => {
  const btn = document.querySelector(".pill.menu");
  const sheet = document.getElementById("menu-sheet");
  const main = document.getElementById("main");
  const links = () => [...sheet.querySelectorAll("a")];
  const set = (open) => {
    btn.setAttribute("aria-expanded", String(open));
    sheet.hidden = !open;
    if (main) main.inert = open;
    if (open) links()[0].focus();
    else btn.focus();
  };
  btn.addEventListener("click", () => set(sheet.hidden));
  document.addEventListener("keydown", (e) => {
    if (sheet.hidden) return;
    if (e.key === "Escape") set(false);
    if (e.key === "Tab") {
      const items = [btn, ...links()];
      const i = items.indexOf(document.activeElement);
      const next = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : (i + 1) % items.length;
      e.preventDefault();
      items[next].focus();
    }
  });
})();
</script>`;

const footer = `<footer class="foot"><div class="wrap"><span>Together We Own · a Discord gaming community since 2023</span><nav aria-label="Footer"><a href="#">Rules</a><a href="#">FAQ</a><a href="#">Privacy</a><a href="#">Status</a></nav></div></footer>`;

const page = (title, body, extraCss = "", bodyClass = "") => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark"><title>${title} · Together We Own</title>
<link rel="stylesheet" href="fonts.css"><link rel="stylesheet" href="ember.css">
<style>.rkl{display:inline-flex;align-items:center;gap:var(--two-space-2)}${extraCss}</style></head>
<body class="${bodyClass}">${body}</body></html>`;

const av = (i, c) => `<span class="av" style="--c:${c}">${i}</span>`;
const C = [
  "var(--two-color-avatar-0)",
  "var(--two-color-avatar-1)",
  "var(--two-color-avatar-2)",
  "var(--two-color-avatar-3)",
  "var(--two-color-avatar-4)",
  "var(--two-color-avatar-5)",
  "var(--two-color-avatar-6)",
  "var(--two-color-avatar-7)",
  "var(--two-color-avatar-8)",
  "var(--two-color-avatar-9)",
  "var(--two-color-avatar-10)",
  "var(--two-color-avatar-11)",
];

module.exports = { rk, rankLabel, RANKS, discord, I, header, footer, page, av, C };
