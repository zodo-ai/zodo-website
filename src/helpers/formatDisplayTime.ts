export const formatDisplayTime = (time: string | null | undefined): string => {
  // 1. Handle null, undefined, or empty string input
  if (!time) {
    return "";
  }

  // 2. Split and convert to numbers. Ensure input is string before split.
  //    'time' is guaranteed to be a string here due to the 'if (!time)' check.
  const [h, m] = time.split(":").map(Number);

  // 3. Validate parsed numbers (optional but good practice for robustness)
  if (isNaN(h) || isNaN(m)) {
    console.warn(`Invalid time format received: ${time}. Returning empty string.`);
    return ""; // Or throw an error, depending on desired behavior for invalid input
  }

  // 4. Determine AM/PM period
  const period = h >= 12 ? "pm" : "am";

  // 5. Convert 24-hour to 12-hour format
  const hour = h % 12 === 0 ? 12 : h % 12;

  // 6. Format minutes to always have two digits (e.g., 5 -> "05")
  const formattedMinutes = m.toString().padStart(2, "0");

  // 7. Return the formatted time string
  return `${hour}:${formattedMinutes}${period}`;
};