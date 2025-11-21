import React from 'react';
import { TimerMode } from '../types';

interface ControlsProps {
  isActive: boolean;
  mode: TimerMode;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onToggleMode: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  isActive,
  mode,
  onStart,
  onPause,
  onReset,
  onToggleMode
}) => {
  const buttonBaseClass = "px-8 py-3 rounded-full font-semibold text-lg shadow-lg transform transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";
  const primaryColor = mode === TimerMode.WORK 
    ? 'bg-white text-red-600 hover:bg-gray-100 focus:ring-red-500' 
    : 'bg-white text-green-600 hover:bg-gray-100 focus:ring-green-500';
  
  const secondaryColor = "bg-white/10 text-white hover:bg-white/20 focus:ring-white/50 backdrop-blur-sm border border-white/10";

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="flex flex-row gap-4">
        {!isActive ? (
          <button
            onClick={onStart}
            className={`${buttonBaseClass} ${primaryColor} w-32`}
            aria-label="Start Timer"
          >
            เริ่ม ▶️
          </button>
        ) : (
          <button
            onClick={onPause}
            className={`${buttonBaseClass} ${primaryColor} w-32`}
            aria-label="Pause Timer"
          >
            หยุด ⏸️
          </button>
        )}
        
        <button
          onClick={onReset}
          className={`${buttonBaseClass} ${secondaryColor}`}
          aria-label="Reset Timer"
        >
          รีเซ็ต 🔄
        </button>
      </div>

      <button
        onClick={onToggleMode}
        className="text-sm text-white/50 hover:text-white transition-colors underline decoration-dotted underline-offset-4"
      >
        {mode === TimerMode.WORK ? 'ข้ามไปพักทันที' : 'ข้ามไปทำงานทันที'}
      </button>
    </div>
  );
};

export default Controls;