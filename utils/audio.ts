import { SoundType } from "../types";

// Helper to get AudioContext
const getAudioContext = () => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return null;
  return new AudioContext();
};

// Helper to create a simple tone
const playTone = (
  ctx: AudioContext,
  type: OscillatorType,
  freq: number,
  startTime: number,
  duration: number,
  vol: number
) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(vol, startTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
};

export const playNotificationSound = (soundType: SoundType = 'classic', volume: number = 0.5) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  switch (soundType) {
    case 'bell': // Deep chime
      playTone(ctx, 'sine', 523.25, now, 2, volume); // C5
      playTone(ctx, 'sine', 1046.5, now, 1.5, volume * 0.3); // Overtones
      break;

    case 'digital': // High pitch beep-beep
      playTone(ctx, 'square', 880, now, 0.1, volume * 0.6);
      playTone(ctx, 'square', 880, now + 0.15, 0.1, volume * 0.6);
      playTone(ctx, 'square', 880, now + 0.3, 0.2, volume * 0.6);
      break;

    case 'bird': // Frequency slide
      {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.linearRampToValueAtTime(1200, now + 0.1);
        osc.frequency.linearRampToValueAtTime(800, now + 0.2);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(volume, now + 0.1);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        
        osc.start(now);
        osc.stop(now + 0.3);
      }
      break;

    case 'piano': // Triangle wave with pluck envelope
      playTone(ctx, 'triangle', 440, now, 1.5, volume);
      playTone(ctx, 'triangle', 554.37, now + 0.1, 1.5, volume * 0.8);
      break;

    case 'arcade': // Fast arpeggio
      playTone(ctx, 'square', 440, now, 0.1, volume * 0.4);
      playTone(ctx, 'square', 554, now + 0.1, 0.1, volume * 0.4);
      playTone(ctx, 'square', 659, now + 0.2, 0.1, volume * 0.4);
      playTone(ctx, 'square', 880, now + 0.3, 0.3, volume * 0.4);
      break;

    case 'future': // Sci-fi slide down
      {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.6);
        gain.gain.setValueAtTime(volume * 0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      }
      break;

    case 'breeze': // Soft chord
      playTone(ctx, 'sine', 329.63, now, 3, volume * 0.6); // E4
      playTone(ctx, 'sine', 440, now + 0.1, 3, volume * 0.6); // A4
      playTone(ctx, 'sine', 554.37, now + 0.2, 3, volume * 0.6); // C#5
      break;
      
    case 'success': // Major fanfare
      playTone(ctx, 'triangle', 523.25, now, 0.2, volume); // C
      playTone(ctx, 'triangle', 659.25, now + 0.2, 0.2, volume); // E
      playTone(ctx, 'triangle', 783.99, now + 0.4, 0.6, volume); // G
      break;

    case 'alert': // Annoying alarm
      {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(volume, now);
        
        // Pulse
        for(let i=0; i<3; i++) {
           gain.gain.setValueAtTime(volume, now + i*0.2);
           gain.gain.setValueAtTime(0, now + i*0.2 + 0.1);
        }
        osc.start(now);
        osc.stop(now + 0.6);
      }
      break;

    case 'classic':
    default:
      // Standard sine beep
      playTone(ctx, 'sine', 880, now, 0.6, volume);
      break;
  }
};

export const playClickSound = (volume: number = 0.2) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(300, ctx.currentTime);
  
  gainNode.gain.setValueAtTime(volume * 0.5, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.1);
};