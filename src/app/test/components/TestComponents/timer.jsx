"use client";

import React, { useState, useEffect } from "react";

const Timer = ({ initialMinutes = 30, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60); // in seconds

  useEffect(() => {
    if (timeLeft === 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="text-white bg-gray-800 px-4 py-2 rounded text-lg font-mono">
      <span className="text-[#dbeafe]">{formatTime(timeLeft)}</span>
    </div>
  );
};

export default Timer;
