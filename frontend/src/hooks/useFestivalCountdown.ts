import { useState, useEffect } from 'react';

export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isStarted: boolean;
  isFinished: boolean;
  label: string;
}

export const useFestivalCountdown = (targetDateStr?: string | Date): CountdownState => {
  const calculateState = (): CountdownState => {
    if (!targetDateStr) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isStarted: false, isFinished: false, label: '' };
    }

    const target = new Date(targetDateStr).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (isNaN(target)) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isStarted: false, isFinished: false, label: '' };
    }

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isStarted: true,
        isFinished: true,
        label: 'CELEBRATION TODAY / IN PROGRESS',
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    let label = '';
    if (days > 1) {
      label = `${days} DAYS TO GO`;
    } else if (days === 1) {
      label = 'TOMORROW';
    } else {
      label = 'TODAY';
    }

    return {
      days,
      hours,
      minutes,
      seconds,
      isStarted: false,
      isFinished: false,
      label,
    };
  };

  const [countdown, setCountdown] = useState<CountdownState>(calculateState);

  useEffect(() => {
    setCountdown(calculateState());
    const interval = setInterval(() => {
      setCountdown(calculateState());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDateStr]);

  return countdown;
};
