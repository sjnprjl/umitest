import { useEffect, useState } from "react";
export function useCountdown(sec = 900) {
  const [time, setTime] = useState(sec); // 900 seconds = 15 minutes
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  return { time, setIsActive };
}
