import { useEffect, useState } from "react";

export function useTimer(tts = 2000, maxIter = 3) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((count) => ++count % maxIter);
    }, tts);

    return () => clearInterval(interval);
  }, [maxIter, tts]);
  return { count };
}
