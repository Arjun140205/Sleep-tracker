import { differenceInMinutes, parse, format, addDays } from "date-fns";

/**
 * Calculates duration between sleep and wake times.
 * Handles overnight sleep (e.g. sleep 11pm, wake 7am).
 * @param {string} sleepTime - HH:mm format
 * @param {string} wakeTime - HH:mm format
 * @returns {string} - formatted "Xh Ym" string
 */
export const calculateDuration = (sleepTime, wakeTime) => {
  try {
    const sleep = parse(sleepTime, "HH:mm", new Date());
    const wake = parse(wakeTime, "HH:mm", new Date());

    if (isNaN(sleep.getTime()) || isNaN(wake.getTime())) return "";

    let minutes = differenceInMinutes(wake, sleep);

    // If negative, it means wake time is next day
    if (minutes < 0) minutes += 1440;

    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  } catch (err) {
    return "";
  }
};

/**
 * Calculates raw minutes duration.
 * @param {string} sleepTime - HH:mm
 * @param {string} wakeTime - HH:mm
 * @returns {number} minutes
 */
export const calculateDurationMinutes = (sleepTime, wakeTime) => {
  try {
    const sleep = parse(sleepTime, "HH:mm", new Date());
    const wake = parse(wakeTime, "HH:mm", new Date());
    let minutes = differenceInMinutes(wake, sleep);
    if (minutes < 0) minutes += 1440;
    return minutes;
  } catch (err) {
    return 0;
  }
};

/**
 * Formats a date object to HH:mm string
 */
export const formatTimeStr = (date) => {
  return format(date, "HH:mm");
};
