import { CreateTakeSchema } from '@acer-academy-learning/data-access';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FieldPath,
  FieldValues,
  Path,
  PathValue,
  useFormContext,
} from 'react-hook-form';
import { useAttemptQuizContext } from '../context/AttemptQuizContext';
export const MS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const MS_IN_HOUR = MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MS_IN_SECOND;
const MS_IN_MINUTE = SECONDS_IN_MINUTE * MS_IN_SECOND;

export type HMSMTimeFormat = {
  hours: number;
  minutes: number;
  seconds: number;
  ms?: number;
};

/**
 *
 * @param timeParam - Time in milliseconds
 * @returns
 */
export const formatTime = (timeParam: number): HMSMTimeFormat => {
  let time = timeParam;
  const parts = {
    hours: 0,
    minutes: 0,
    seconds: 0,
    ms: 0,
  };
  if (time > MS_IN_HOUR) {
    parts.hours = Math.floor(time / MS_IN_HOUR);
    time %= MS_IN_HOUR;
  }

  if (time > MS_IN_MINUTE) {
    parts.minutes = Math.floor(time / MS_IN_MINUTE);
    time %= MS_IN_MINUTE;
  }

  if (time > MS_IN_SECOND) {
    parts.seconds = Math.floor(time / MS_IN_SECOND);
    time %= MS_IN_SECOND;
  }

  parts.ms = time;

  return parts;
};

export type QuizTimerProps<T extends FieldValues> = {
  totalDurationInMiliseconds?: number;
  name?: FieldPath<T>;
};

export const QuizTimer = <T extends FieldValues>({
  totalDurationInMiliseconds,
  name,
}: QuizTimerProps<T>) => {
  const { isTimeUp } = useAttemptQuizContext();
  const { setValue, getValues } = useFormContext<T>();
  // useRef to prevent unnecessary re-render
  const lastTickTiming = useRef<number | null>(null);
  const timerIdRef = useRef<NodeJS.Timer | null>(null);
  const [currentDuration, setCurrentDuration] = useState(0);

  const formattedTimeToShow: HMSMTimeFormat = useMemo(() => {
    if (!totalDurationInMiliseconds) {
      return formatTime(currentDuration);
    }
    return formatTime(totalDurationInMiliseconds - currentDuration);
  }, [totalDurationInMiliseconds, currentDuration]);

  useEffect(() => {
    if (isTimeUp && timerIdRef.current) {
      clearInterval(timerIdRef.current);
    }
  }, [isTimeUp]);

  useEffect(() => {
    lastTickTiming.current = Date.now();
    timerIdRef.current = setInterval(() => {
      const now = Date.now();
      const prev = lastTickTiming.current ?? now;
      const timePassed = now - prev;
      setCurrentDuration((curr) => curr + timePassed);
      if (name) {
        const currentStored = getValues(name) as number;
        const updatedTimeInMS = currentStored + timePassed;
        if (
          !totalDurationInMiliseconds ||
          updatedTimeInMS <= totalDurationInMiliseconds
        ) {
          setValue(name, updatedTimeInMS as PathValue<T, Path<T>>);
        } else {
          setValue(name, totalDurationInMiliseconds as PathValue<T, Path<T>>);
        }
      }
      lastTickTiming.current = now;
    }, 1);

    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
      }
    };
  }, []);

  return (
    <div className="space-x-1">
      {formattedTimeToShow.hours > 0 && (
        <span>{formattedTimeToShow.hours} Hours,</span>
      )}
      {formattedTimeToShow.minutes > 0 && (
        <span>{formattedTimeToShow.minutes} Minutes,</span>
      )}
      {formattedTimeToShow.seconds >= 0 && (
        <span>{formattedTimeToShow.seconds} Seconds</span>
      )}
    </div>
  );
};
