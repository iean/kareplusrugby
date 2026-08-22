/**
 * Day and shift labels, kept separate from AvailabilityGrid.js so server code
 * (the PDF builder, the emails) can use them without importing a client
 * component.
 */
export const DAY_LABELS = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

export const SHIFT_LABELS = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  night: "Night",
};
