import React from 'react';
import { TimerMode } from '../types';

interface TimerDisplayProps {
  secondsLeft: number;
  totalSeconds: number;
  mode: TimerMode;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ secondsLeft, totalSeconds, mode }) => {
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const themeColor = mode === TimerMode.WORK ? '#FF4E4E' : '#4EFF8A';
  const textColorClass = mode === TimerMode.WORK ? 'text-pomodoro-red' : 'text-pomodoro-green';
  
  // Circular Progress Calculation
  const radius = 120;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (secondsLeft / totalSeconds) * circumference;

  return (
    <div className="relative flex justify-center items-center mb-8 w-[300px] h-[300px] md:w-[360px] md:h-[360px]">
       
       {/* Background Glow */}
       <div className={`absolute inset-0 blur-3xl opacity-20 rounded-full transition-colors duration-1000 ${mode === TimerMode.WORK ? 'bg-red-600' : 'bg-green-600'}`}></div>

      {/* Circular Progress */}
      <svg
        height="100%"
        width="100%"
        className="absolute rotate-[-90deg] drop-shadow-xl z-0"
      >
        <circle
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx="50%"
          cy="50%"
        />
        <circle
          stroke={themeColor}
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
          strokeLinecap="round"
          fill="transparent"
          r={normalizedRadius}
          cx="50%"
          cy="50%"
        />
      </svg>
      
      <div className="relative z-10 text-center flex flex-col items-center justify-center">
        <h1 className={`text-[5rem] md:text-[6.5rem] font-bold tracking-tighter leading-none drop-shadow-2xl ${textColorClass} transition-colors duration-500 select-none tabular-nums`}>
          {formatTime(secondsLeft)}
        </h1>
        <div className={`mt-2 px-4 py-1 rounded-full text-sm font-medium tracking-wider uppercase bg-white/10 backdrop-blur-md border border-white/10 text-white/90`}>
          {mode === TimerMode.WORK ? 'Focus Mode' : 'Break Time'}
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;