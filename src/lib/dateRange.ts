const MONTHS_PT = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const WEEKDAYS_PT = [
  "domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado",
];

/**
 * Parse "YYYY-MM-DD" as a local date (avoids UTC shift that would push it
 * a day back when the user is in BRT).
 */
function parseLocalDate(input: string | null | undefined): Date | null {
  if (!input) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(input);
  if (!m) {
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
  }
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

/** "27 de Abril" */
export function formatDayMonth(input: string | null | undefined): string | null {
  const d = parseLocalDate(input);
  if (!d) return null;
  return `${d.getDate()} de ${MONTHS_PT[d.getMonth()]}`;
}

/**
 * "27 de Abril a 3 de Maio". If both dates fall in the same month,
 * collapses the first month: "27 a 30 de Abril".
 */
export function formatDateRange(
  start: string | null | undefined,
  end: string | null | undefined,
  fallback = "27 de Abril a 3 de Maio",
): string {
  const s = parseLocalDate(start);
  const e = parseLocalDate(end);
  if (!s || !e) return fallback;
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.getDate()} a ${e.getDate()} de ${MONTHS_PT[s.getMonth()]}`;
  }
  return `${s.getDate()} de ${MONTHS_PT[s.getMonth()]} a ${e.getDate()} de ${MONTHS_PT[e.getMonth()]}`;
}

/**
 * Returns the date range split for two-line layouts ONLY when the range
 * crosses months (e.g. ["27 de Abril a", "3 de Maio"]). When start and end
 * are in the same month, returns a single-line string ("4 a 10 de Maio")
 * as the first element and an empty string as the second — callers should
 * skip the line break when line2 is empty.
 */
export function formatDateRangeTwoLines(
  start: string | null | undefined,
  end: string | null | undefined,
  fallback: [string, string] = ["27 de Abril a", "3 de Maio"],
): [string, string] {
  const s = parseLocalDate(start);
  const e = parseLocalDate(end);
  if (!s || !e) return fallback;
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return [`${s.getDate()} a ${e.getDate()} de ${MONTHS_PT[s.getMonth()]}`, ""];
  }
  return [
    `${s.getDate()} de ${MONTHS_PT[s.getMonth()]} a`,
    `${e.getDate()} de ${MONTHS_PT[e.getMonth()]}`,
  ];
}

/** "Começa na próxima segunda — 27 de Abril" */
export function formatStartLine(
  start: string | null | undefined,
  fallback = "Começa na próxima segunda — 27 de Abril",
): string {
  const d = parseLocalDate(start);
  if (!d) return fallback;
  const weekday = WEEKDAYS_PT[d.getDay()];
  return `Começa ${weekday} — ${d.getDate()} de ${MONTHS_PT[d.getMonth()]}`;
}