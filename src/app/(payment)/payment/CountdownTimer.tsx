import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  createTime: string; // Time when the countdown started
  expiryTime: string; // Time when the countdown expires
  onExpire: () => void;
}

export default function CountdownTimer({
  createTime,
  expiryTime,
  onExpire,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0); // To track elapsed time from createTime
  const [totalTime, setTotalTime] = useState<number>(0); // Total countdown time

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(expiryTime).getTime() - new Date().getTime();
      return Math.max(0, Math.floor(difference / 1000));
    };

    const totalDuration =
      (new Date(expiryTime).getTime() - new Date(createTime).getTime()) / 1000;
    setTotalTime(totalDuration); // Set the total duration based on createTime and expiryTime
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      const newElapsedTime = Math.floor(
        (new Date().getTime() - new Date(createTime).getTime()) / 1000
      ); // Calculate elapsed time
      setElapsedTime(newElapsedTime);
      setTimeLeft(newTimeLeft);
      if (newTimeLeft === 0) {
        clearInterval(timer);
        onExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [createTime, expiryTime, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Calculate the progress based on elapsed time and total time
  const progress = totalTime > 0 ? (elapsedTime / totalTime) * 100 : 0;

  return (
    <div className="mt-6">
      <div className="space-y-2">
        <h1 className="text-xl font-bold font-mono text-muted-foreground">
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </h1>
        <div className="h-1 w-full bg-accent rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-md text-muted-foreground text-center">
          {timeLeft > 0 ? (
            <>
              You've <strong>{minutes.toString().padStart(2, "0")}</strong>{" "}
              minutes and <strong>{seconds.toString().padStart(2, "0")}</strong>{" "}
              seconds left to use this code.
            </>
          ) : (
            "This code has expired."
          )}
        </p>
      </div>
    </div>
  );
}
