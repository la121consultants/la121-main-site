export type WorkingHours = {
  start: string;
  end: string;
};

export type AvailabilityConfig = {
  timeZone: string;
  slotDurations: number[];
  workingHours: Record<string, WorkingHours>;
  blockedDates: string[];
  blockedTimes: string[];
};

export const availabilityConfig: AvailabilityConfig = {
  timeZone: "Europe/London",
  slotDurations: [10, 20, 30],
  workingHours: {
    monday: { start: "09:00", end: "18:00" },
    tuesday: { start: "09:00", end: "18:00" },
    wednesday: { start: "09:00", end: "18:00" },
    thursday: { start: "09:00", end: "18:00" },
    friday: { start: "09:00", end: "18:00" },
  },
  blockedDates: [],
  blockedTimes: [],
};
