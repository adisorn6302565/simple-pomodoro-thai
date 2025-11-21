import React from 'react';
import { TimerSettings, SoundType } from '../types';
import { playNotificationSound } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TimerSettings;
  onUpdateSettings: (newSettings: TimerSettings) => void;
}

const SOUND_OPTIONS: { value: SoundType; label: string }[] = [
  { value: 'classic', label: 'Classic (คลาสสิก)' },
  { value: 'bell', label: 'Zen Bell (ระฆัง)' },
  { value: 'digital', label: 'Digital (ดิจิทัล)' },
  { value: 'bird', label: 'Bird (นก)' },
  { value: 'piano', label: 'Piano (เปียโน)' },
  { value: 'arcade', label: 'Arcade (เกมตู้)' },
  { value: 'future', label: 'Sci-Fi (อวกาศ)' },
  { value: 'breeze', label: 'Breeze (สายลม)' },
  { value: 'success', label: 'Success (สำเร็จ)' },
  { value: 'alert', label: 'Alert (แจ้งเตือน)' },
];

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdateSettings }) => {
  if (!isOpen) return null;

  const handlePreviewSound = () => {
    playNotificationSound(settings.soundType, settings.volume);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-opacity duration-300">
      <div className="bg-gray-800/90 border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl ring-1 ring-white/20">
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold text-white">ตั้งค่า ⚙️</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors text-xl">✕</button>
        </div>
        
        <div className="space-y-6">
          {/* Time Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2 font-medium">เวลาทำงาน (นาที)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.workDuration}
                onChange={(e) => onUpdateSettings({ ...settings, workDuration: Number(e.target.value) })}
                className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2 font-medium">เวลาพัก (นาที)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={settings.breakDuration}
                onChange={(e) => onUpdateSettings({ ...settings, breakDuration: Number(e.target.value) })}
                className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="h-px bg-white/10 my-4" />

          {/* Sound Settings */}
          <div className="space-y-4">
             <div className="flex items-center justify-between">
              <label className="text-lg font-medium text-white">เสียงเตือน 🔊</label>
              <button
                onClick={() => onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
                className={`w-12 h-7 rounded-full p-1 transition-all duration-300 ${settings.soundEnabled ? 'bg-green-500' : 'bg-gray-600'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {settings.soundEnabled && (
              <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/5">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">รูปแบบเสียง</label>
                  <div className="flex gap-2">
                    <select
                      value={settings.soundType}
                      onChange={(e) => onUpdateSettings({ ...settings, soundType: e.target.value as SoundType })}
                      className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                    >
                      {SOUND_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <button 
                      onClick={handlePreviewSound}
                      className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors"
                      title="ทดลองฟัง"
                    >
                      ▶
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">ระดับเสียง ({Math.round(settings.volume * 100)}%)</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1"
                    value={settings.volume}
                    onChange={(e) => onUpdateSettings({ ...settings, volume: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white py-3.5 rounded-xl font-bold shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          บันทึกการตั้งค่า
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;