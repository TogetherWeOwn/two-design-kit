// Code-owned slot formatting for social cards (docs/social.md §4).
// Dates, times, zones, links and counts are never written by a person or a model:
// the card data carries raw values and these functions print them.

const DAY_MS = 86_400_000;

function parts(date, zone, options) {
  const out = {};
  for (const p of new Intl.DateTimeFormat("en-GB", { timeZone: zone, ...options }).formatToParts(
    date,
  )) {
    out[p.type] = p.value;
  }
  return out;
}

/** "Fri 6 Nov" in the given IANA zone. */
export function shortDate(date, zone) {
  const p = parts(date, zone, { weekday: "short", day: "numeric", month: "short" });
  return `${p.weekday} ${p.day} ${p.month}`;
}

/** "Friday 6 November" in the given IANA zone (alt text). */
export function longDate(date, zone) {
  const p = parts(date, zone, { weekday: "long", day: "numeric", month: "long" });
  return `${p.weekday} ${p.day} ${p.month}`;
}

/** "21:00 GMT": 24-hour clock with the zone's short name. UTC prints as "UTC". */
export function clock(date, zone) {
  const p = parts(date, zone, {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZoneName: "short",
  });
  const name = zone === "UTC" || zone === "Etc/UTC" ? "UTC" : p.timeZoneName;
  return `${p.hour}:${p.minute} ${name}`;
}

/** The when slot: event zone first, UTC anchor second (voice.md §2, Times). */
export function formatWhen({ start, zone }) {
  const date = new Date(start);
  const utc = zone === "UTC" || zone === "Etc/UTC";
  return {
    date: shortDate(date, zone),
    time: clock(date, zone),
    anchor: utc ? null : clock(date, "UTC"),
    long: `${longDate(date, zone)}, ${clock(date, zone)}${utc ? "" : ` (${clock(date, "UTC")})`}`,
  };
}

/** The recap week label: "Week of 26 Oct". */
export function formatWeek({ start, zone }) {
  const date = new Date(`${start}T12:00:00Z`);
  const p = parts(date, zone, { day: "numeric", month: "short" });
  return `Week of ${p.day} ${p.month}`;
}

/** A highlight's date: "Fri 30 Oct". Dates are calendar days, read at noon UTC. */
export function formatDay(day, zone) {
  return shortDate(new Date(`${day}T12:00:00Z`), zone);
}

/** Printed link: host and path, no scheme, no query, no trailing slash. */
export function formatLink(url) {
  const u = new URL(url);
  const path = u.pathname.replace(/\/+$/, "");
  return `${u.host}${path}`;
}

/** "52 going". Digits always, with a noun. */
export function formatCount({ value, noun }) {
  return `${value} ${noun}`;
}

/** The days in a recap week, for range checks. */
export function weekContains(weekStart, day) {
  const start = Date.parse(`${weekStart}T00:00:00Z`);
  const d = Date.parse(`${day}T00:00:00Z`);
  return d >= start && d < start + 7 * DAY_MS;
}
