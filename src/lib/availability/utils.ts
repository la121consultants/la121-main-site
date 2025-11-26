import { addMinutes, isBefore, isEqual, startOfDay } from "date-fns";
import { availabilityConfig, AvailabilityConfig, WorkingHours } from "./config";

export type Slot = {
  start: Date;
  end: Date;
  iso: string;
};

const getWorkingHours = (date: Date, config: AvailabilityConfig): WorkingHours | undefined => {
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  return config.workingHours[weekday];
};

const buildZonedDate = (date: Date, time: string, timeZone: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(startOfDay(date));
  const year = Number(parts.find((p) => p.type === "year")?.value ?? date.getUTCFullYear());
  const month = Number(parts.find((p) => p.type === "month")?.value ?? date.getUTCMonth() + 1);
  const day = Number(parts.find((p) => p.type === "day")?.value ?? date.getUTCDate());
  return new Date(Date.UTC(year, month - 1, day, hours, minutes));
};

export const generateSlots = (
  date: Date,
  duration: number,
  existing: { start_time: string; end_time: string }[],
  config: AvailabilityConfig = availabilityConfig
): Slot[] => {
  const hours = getWorkingHours(date, config);
  if (!hours) return [];

  const dayStart = buildZonedDate(date, hours.start, config.timeZone);
  const dayEnd = buildZonedDate(date, hours.end, config.timeZone);

  const blockedDate = config.blockedDates.includes(dayStart.toISOString().split("T")[0]);
  if (blockedDate) return [];

  const slots: Slot[] = [];
  let cursor = dayStart;

  while (!isBefore(dayEnd, addMinutes(cursor, duration))) {
    const slotEnd = addMinutes(cursor, duration);
    const overlap = existing.some((booking) => {
      const bookingStart = new Date(booking.start_time);
      const bookingEnd = new Date(booking.end_time);
      return (
        (isBefore(cursor, bookingEnd) || isEqual(cursor, bookingEnd)) &&
        (isBefore(bookingStart, slotEnd) || isEqual(bookingStart, slotEnd))
      );
    });

    const blockedTime = config.blockedTimes.includes(cursor.toISOString());

    if (!overlap && !blockedTime) {
      slots.push({ start: cursor, end: slotEnd, iso: cursor.toISOString() });
    }

    cursor = addMinutes(cursor, 30);
  }

  return slots;
};

export const formatSlot = (slot: Slot, timeZone: string) => {
  return `${slot.start.toLocaleTimeString("en-GB", { timeZone, hour: "2-digit", minute: "2-digit" })}`;
};

export const detectUserTimeZone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};
