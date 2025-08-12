"use client";
import React, { useState, useEffect } from "react";

interface CountdownProps {
  expireDate: string; // Expiration date in ISO format
}

const CountdownExpireDate: React.FC<CountdownProps> = ({ expireDate }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const totalDuration = new Date(expireDate).getTime() - Date.now();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const expirationTime = new Date(expireDate).getTime();
      const timeDiff = expirationTime - now;

      if (timeDiff <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
        setProgress(100);
      } else {
        setTimeLeft(timeDiff);
        const percentage = ((totalDuration - timeDiff) / totalDuration) * 100;
        setProgress(percentage);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expireDate, totalDuration]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Countdown Timer */}
      <div className="flex items-center text-4xl font-bold">
        <span className="bg-blue-500 text-white px-4 py-2 rounded">
          {String(minutes).padStart(2, "0")}
        </span>
        <span className="mx-2 text-gray-800">:</span>
        <span className="bg-red-500 text-white px-4 py-2 rounded">
          {String(seconds).padStart(2, "0")}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-300 rounded-full h-4">
        <div
          className="bg-green-500 h-4 rounded-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default CountdownExpireDate;
