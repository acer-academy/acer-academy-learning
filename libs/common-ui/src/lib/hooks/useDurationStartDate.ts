import { Duration } from '@acer-academy-learning/data-access';
import { useMemo, useState } from 'react';

const getExactDateDaysBefore = (data: {
  days: number;
  date: Date;
  toMidnight?: boolean;
}) => {
  const pastDate = new Date(
    data.date.getTime() - data.days * 24 * 60 * 60 * 1000,
  );
  if (data.toMidnight) {
    pastDate.setHours(0, 0, 0, 0);
  }

  return pastDate;
};

// Helper function to check for a leap year
export const isLeapYear = (year: number) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export const useDurationStartDate = () => {
  const [currentDuration, setCurrenDuration] = useState<Duration>(Duration.ALL);
  const startDate = useMemo(() => {
    // Get current date
    const currentDate = new Date();
    switch (currentDuration) {
      case Duration.PAST_FOURTEEN_DAYS: {
        return getExactDateDaysBefore({
          days: 14,
          date: currentDate,
          toMidnight: true,
        }).toISOString();
      }
      case Duration.PAST_THREE_MONTHS: {
        return getExactDateDaysBefore({
          days: 90,
          date: currentDate,
          toMidnight: true,
        }).toISOString();
      }
      case Duration.PAST_YEAR: {
        const oneYearAgo = new Date(currentDate);
        oneYearAgo.setFullYear(currentDate.getFullYear() - 1);
        // Check for leap year edge case. If currentDate is Feb 29 and the previous year is not a leap year, this will adjust to Feb 28.
        if (
          currentDate.getMonth() === 1 &&
          currentDate.getDate() === 29 &&
          !isLeapYear(oneYearAgo.getFullYear())
        ) {
          oneYearAgo.setDate(28);
        }
        oneYearAgo.setHours(0, 0, 0, 0);
        return oneYearAgo.toISOString();
      }
      default:
        break;
    }
  }, [currentDuration]);

  return {
    startDate,
    currentDuration,
    setCurrenDuration,
    Duration,
  };
};
