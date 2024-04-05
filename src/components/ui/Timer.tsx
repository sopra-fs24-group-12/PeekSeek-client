import React from 'react';

interface TimerProps {
  initialTimeInSeconds: number;
  timeInSeconds: number; // remaining time
  title: string;
}

const Timer: React.FC<TimerProps> = ({ initialTimeInSeconds, timeInSeconds, title }) => {
  // The radius of the SVG circle
  const radius = 80;
  const viewBoxSize = 200;

  // Todo: create Stroke-DashArray animation
  // const circumference = 2 * Math.PI * radius;
  // const strokeDasharray = `${(timeInSeconds / initialTimeInSeconds) * circumference} ${circumference}`;

  return (
    <div className="flex flex-col items-center">
      <span className="text-lg font-semibold">
        {title}
      </span>
      <div className="relative">
        <svg width={viewBoxSize} height={viewBoxSize} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
          <circle
            cx={viewBoxSize / 2}
            cy={viewBoxSize / 2}
            r={radius}
            fill="none"
            stroke="black"
            strokeWidth="3"
          />
          {/* The red progress circle is commented out for now */}
          <circle
            cx={viewBoxSize / 2}
            cy={viewBoxSize / 2}
            r={radius - 2} // Slightly smaller radius for stroke visibility
            fill="none"
            stroke="red"
            strokeWidth="2"
            // strokeDasharray={strokeDasharray} // Uncomment when using dash array
            transform={`rotate(-90 ${viewBoxSize / 2} ${viewBoxSize / 2})`} // Center of the new SVG size
          />
        </svg>
        <span className="absolute text-red-600 font-bold text-2xl" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          {String(Math.floor(timeInSeconds / 60)).padStart(2, '0')}:{String(timeInSeconds % 60).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};

export default Timer;

// Note: Replace `initialSeconds` with the total duration of the timer in seconds when integrating WebSocket
