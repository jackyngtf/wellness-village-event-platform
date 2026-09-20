// Public reference policy: bound elapsed time, not the count of occupied HKT dates.
export const THE_GROUND_MAX_EVENT_DURATION_DAYS = 366;

const maxEventDurationMs =
  THE_GROUND_MAX_EVENT_DURATION_DAYS * 24 * 60 * 60 * 1_000;

export function isSupportedTheGroundEventDuration(
  startsAt: number,
  endsAt: number,
): boolean {
  const duration = endsAt - startsAt;
  return (
    Number.isFinite(startsAt) &&
    Number.isFinite(endsAt) &&
    duration > 0 &&
    duration <= maxEventDurationMs
  );
}
