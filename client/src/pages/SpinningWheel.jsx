import React, { useState } from "react";

const SpinningWheel = () => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const segments = [
    { color: "#FF6B6B", text: "100" },
    { color: "#4ECDC4", text: "200" },
    { color: "#45B7D1", text: "300" },
    { color: "#96CEB4", text: "400" },
    { color: "#FFEEAD", text: "500" },
    { color: "#D4A5A5", text: "600" },
    { color: "#9B59B6", text: "700" },
    { color: "#3498DB", text: "800" },
  ];

  const spinWheel = () => {
    if (!isSpinning) {
      setIsSpinning(true);
      const newRotation = rotation + 1440 + Math.random() * 360; // Spin 4 times + random
      setRotation(newRotation);
      setTimeout(() => setIsSpinning(false), 3000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div
        className="relative w-[300px] h-[300px] transition-transform duration-[3000ms] ease-out"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {segments.map((segment, index) => {
          const rotation = (index * 360) / segments.length;
          return (
            <div
              key={index}
              className="absolute w-full h-full origin-center"
              style={{
                transform: `rotate(${rotation}deg)`,
                clipPath: "polygon(50% 50%, 100% 0, 100% 33%)",
              }}
            >
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: "white" }}
              >
                  <span className="absolute z-50 border-2 border-black text-3xl translate-y-100 text-black font-bold transform rotate-deg] translate-x-100">
                    {segment.text}
                  </span>
              </div>
            </div>
          );
        })}
        <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-md z-10" />
      </div>
      <button
        onClick={spinWheel}
        disabled={isSpinning}
        className="mt-16 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
      >
        {isSpinning ? "Spinning..." : "Spin"}
      </button>
    </div>
  );
};

export default SpinningWheel;
