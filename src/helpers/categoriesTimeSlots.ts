interface Slot {
  startTime: string; 
  endTime: string;
  isAvailable: boolean;
}

interface CategorizedSlots {
  morning: Slot[];
  afternoon: Slot[];
  evening: Slot[];
}

export const categorizeSlots = (slots: Slot[]): CategorizedSlots => {
  const morning: Slot[] = [];
  const afternoon: Slot[] = [];
  const evening: Slot[] = [];

  slots?.forEach((slot) => {
    const hour = parseInt(slot?.startTime.split(":")[0], 10);

    if (hour >= 5 && hour < 12) {
      morning.push(slot);
    } else if (hour >= 12 && hour < 17) {
      afternoon.push(slot);
    } else if (hour >= 17 && hour < 21) {
      evening.push(slot);
    }
  });

  return { morning, afternoon, evening };
};
