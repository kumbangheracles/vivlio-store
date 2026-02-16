import { useState, useEffect } from "react";

const useCountDown = (expiryTime?: string) => {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!expiryTime) return;

    const expiry = new Date(expiryTime.replace(" ", "T")).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.floor((expiry - now) / 1000);

      if (diff <= 0) {
        clearInterval(interval);
        setSecondsLeft(0);
      } else {
        setSecondsLeft(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryTime]);

  return secondsLeft;
};

export default useCountDown;
