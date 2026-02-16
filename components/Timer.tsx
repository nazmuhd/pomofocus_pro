
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TimerMode, Settings } from '../types';
import { Play, Pause, SkipForward, RotateCcw, AlertCircle, PlusCircle, Lock } from 'lucide-react';
import { ALARM_SOUNDS, BG_SOUNDS } from '../constants';

interface TimerProps {
  mode: TimerMode;
  settings: Settings;
  onComplete: (duration: number, interruptions: number) => void;
  onModeChange: (mode: TimerMode) => void;
}

const Timer: React.FC<TimerProps> = ({ mode, settings, onComplete, onModeChange }) => {
  const getInitialTime = useCallback(() => {
    switch (mode) {
      case 'focus': return settings.focusDuration * 60;
      case 'shortBreak': return settings.shortBreakDuration * 60;
      case 'longBreak': return settings.longBreakDuration * 60;
      default: return 25 * 60;
    }
  }, [mode, settings]);

  const [timeLeft, setTimeLeft] = useState(getInitialTime());
  const [isActive, setIsActive] = useState(false);
  const [interruptions, setInterruptions] = useState(0);
  const timerRef = useRef<any>(null);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setTimeLeft(getInitialTime());
    setIsActive(false);
    setInterruptions(0);
  }, [mode, getInitialTime]);

  const toggleTimer = useCallback(() => {
    if (settings.strictMode && mode === 'focus' && isActive) return;
    setIsActive(prev => !prev);
  }, [settings.strictMode, mode, isActive]);

  const resetTimer = useCallback(() => {
    if (settings.strictMode && mode === 'focus') return;
    setIsActive(false);
    setTimeLeft(getInitialTime());
    setInterruptions(0);
  }, [settings.strictMode, mode, getInitialTime]);

  const playAlarm = useCallback(() => {
    const sound = ALARM_SOUNDS.find(s => s.id === settings.alarmSound);
    if (sound) {
      const audio = new Audio(sound.url);
      audio.volume = settings.volume;
      audio.play().catch(() => {
        // Simple Web Audio API beep fallback for offline/blocked audio
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.value = settings.volume;
        osc.frequency.value = 880;
        osc.start();
        osc.stop(ctx.currentTime + 1);
      });
    }
  }, [settings.alarmSound, settings.volume]);

  const handleFinish = useCallback(() => {
    playAlarm();
    onComplete(getInitialTime() / 60, interruptions);

    if (mode === 'focus') {
      onModeChange('shortBreak');
      if (settings.autoStartBreaks) setIsActive(true);
    } else {
      onModeChange('focus');
      if (settings.autoStartPomodoros) setIsActive(true);
    }
  }, [mode, settings, onComplete, onModeChange, getInitialTime, interruptions, playAlarm]);

  const skipTimer = useCallback(() => {
    if (settings.strictMode && mode === 'focus') return;
    setIsActive(false);
    handleFinish();
  }, [handleFinish, settings.strictMode, mode]);

  const extendBreak = () => {
    setTimeLeft(prev => prev + 120);
  };

  const trackInterruption = () => {
    if (!isActive) return;
    setInterruptions(prev => prev + 1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') { e.preventDefault(); toggleTimer(); }
      else if (e.code === 'KeyR') resetTimer();
      else if (e.code === 'KeyS') skipTimer();
      else if (e.code === 'KeyI' && mode === 'focus') trackInterruption();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTimer, resetTimer, skipTimer, mode]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      handleFinish();
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, timeLeft, handleFinish]);

  // Ambience Logic
  useEffect(() => {
    const bgSound = BG_SOUNDS.find(s => s.id === settings.backgroundSound);
    if (isActive && mode === 'focus' && bgSound && bgSound.url) {
      if (!bgAudioRef.current || bgAudioRef.current.src !== bgSound.url) {
        bgAudioRef.current = new Audio(bgSound.url);
        bgAudioRef.current.loop = true;
      }
      bgAudioRef.current.volume = settings.volume * 0.3;
      bgAudioRef.current.play().catch(() => {});
    } else {
      bgAudioRef.current?.pause();
    }
    return () => bgAudioRef.current?.pause();
  }, [isActive, mode, settings.backgroundSound, settings.volume]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const initialTime = getInitialTime();
  const progress = ((initialTime - timeLeft) / initialTime) * 100;
  const radius = 105;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  const isStrictModeLocked = settings.strictMode && mode === 'focus' && isActive;

  return (
    <div className="relative flex flex-col items-center gap-6 sm:gap-10">
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
        <svg className="absolute w-full h-full -rotate-90 filter drop-shadow-xl">
          <circle cx="50%" cy="50%" r={radius} fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
          <circle cx="50%" cy="50%" r={radius} fill="transparent" stroke="white" strokeWidth="12" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000 ease-linear" />
        </svg>

        <div className="text-center z-10 flex flex-col items-center justify-center">
          <span className="text-6xl sm:text-7xl font-black tracking-tighter tabular-nums drop-shadow-lg leading-none">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </span>
          {isStrictModeLocked && (
            <div className="absolute top-1/4 animate-bounce text-white/40">
              <Lock className="w-5 h-5" />
            </div>
          )}
          {interruptions > 0 && (
            <div className="absolute -bottom-4 bg-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg border border-white/20">
              <AlertCircle className="w-3 h-3" />
              {interruptions} Distractions
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <button onClick={resetTimer} disabled={isStrictModeLocked} className={`p-3 sm:p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all hover:scale-110 active:scale-90 disabled:opacity-30 disabled:hover:scale-100`} title="Reset (R)">
            <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button onClick={toggleTimer} disabled={isStrictModeLocked} className={`px-10 sm:px-14 py-4 sm:py-5 bg-white text-gray-900 rounded-[2rem] font-black text-lg sm:text-xl shadow-2xl transition-all ring-4 sm:ring-8 ring-white/10 ${isStrictModeLocked ? 'opacity-70 scale-95' : 'hover:scale-105 active:scale-95'}`}>
            {isActive ? 'PAUSE' : 'START'}
          </button>
          <button onClick={skipTimer} disabled={isStrictModeLocked} className={`p-3 sm:p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all hover:scale-110 active:scale-90 disabled:opacity-30 disabled:hover:scale-100`} title="Skip (S)">
            <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="flex gap-3">
          {mode === 'focus' && isActive && (
            <button onClick={trackInterruption} className="flex items-center gap-2 px-6 py-2 bg-black/20 hover:bg-black/40 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all active:scale-90">
              <AlertCircle className="w-4 h-4 text-red-400" /> Log Interruption
            </button>
          )}
          {(mode === 'shortBreak' || mode === 'longBreak') && (
            <button onClick={extendBreak} className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all active:scale-90">
              <PlusCircle className="w-4 h-4 text-teal-400" /> +2 Min Break
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timer;
