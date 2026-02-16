
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TimerMode, Task, Settings, FocusSession, TaskTemplate } from './types';
import { DEFAULT_SETTINGS, THEME_COLORS, PREMADE_TEMPLATES } from './constants';
import Timer from './components/Timer';
import TaskList from './components/TaskList';
import SettingsModal from './components/SettingsModal';
import ReportsModal from './components/ReportsModal';
import TemplatesModal from './components/TemplatesModal';
import { CheckCircle2, Settings as SettingsIcon, BarChart3, ClipboardList, Quote, Trophy, Flame, Zap } from 'lucide-react';

const MOTIVATIONAL_QUOTES = [
  "Focus on being productive instead of busy.",
  "The secret of getting ahead is getting started.",
  "Your mind is for having ideas, not holding them.",
  "The only way to do great work is to love what you do.",
  "Don't watch the clock; do what it does. Keep going.",
  "Concentrate all your thoughts upon the work at hand."
];

const App: React.FC = () => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('settings');
    const parsed = saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...parsed };
  });
  const [sessions, setSessions] = useState<FocusSession[]>(() => {
    const saved = localStorage.getItem('focus_sessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [templates, setTemplates] = useState<TaskTemplate[]>(() => {
    const saved = localStorage.getItem('templates');
    // If no templates saved, or only premade ones are there, use premade
    return saved ? JSON.parse(saved) : PREMADE_TEMPLATES;
  });

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(MOTIVATIONAL_QUOTES[0]);

  useEffect(() => {
    setCurrentQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
  }, []);

  useEffect(() => localStorage.setItem('tasks', JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem('settings', JSON.stringify(settings)), [settings]);
  useEffect(() => localStorage.setItem('focus_sessions', JSON.stringify(sessions)), [sessions]);
  useEffect(() => localStorage.setItem('templates', JSON.stringify(templates)), [templates]);

  const activeTask = tasks.find(t => t.id === activeTaskId) || tasks.find(t => !t.isCompleted);

  const dailyStats = useMemo(() => {
    const today = new Date().toDateString();
    const todaySessions = sessions.filter(s => new Date(s.timestamp).toDateString() === today);
    return {
      completed: todaySessions.length,
      goal: settings.dailyGoal
    };
  }, [sessions, settings.dailyGoal]);

  const streak = useMemo(() => {
    if (sessions.length === 0) return 0;
    const sorted = [...sessions].sort((a, b) => b.timestamp - a.timestamp);
    const uniqueDays = Array.from(new Set(sorted.map(s => new Date(s.timestamp).toDateString())));
    
    let currentStreak = 0;
    const today = new Date();
    
    for (let i = 0; i < uniqueDays.length; i++) {
      const day = new Date(uniqueDays[i]);
      const diff = Math.floor((today.getTime() - day.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diff === i || diff === i + 1) {
        currentStreak++;
      } else {
        break;
      }
    }
    return currentStreak;
  }, [sessions]);
  
  const finishTimeEstimate = useMemo(() => {
    const remainingTasks = tasks.filter(t => !t.isCompleted);
    const totalRemainingPomos = remainingTasks.reduce((acc, t) => acc + Math.max(0, t.estimatedPomodoros - t.completedPomodoros), 0);
    
    if (totalRemainingPomos === 0) return null;

    const workMinutes = totalRemainingPomos * settings.focusDuration;
    const breakCount = totalRemainingPomos - 1;
    const breakMinutes = breakCount * settings.shortBreakDuration;
    
    const now = new Date();
    const finishDate = new Date(now.getTime() + (workMinutes + breakMinutes) * 60000);
    
    return finishDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [tasks, settings]);

  const handleSessionComplete = useCallback((duration: number, interruptions: number) => {
    if (mode === 'focus') {
      const newSession: FocusSession = { timestamp: Date.now(), duration, interruptions };
      setSessions(prev => [...prev, newSession]);

      setTasks(prev => {
        let updated = prev.map(t => {
          if (t.id === activeTaskId) {
            const newCount = t.completedPomodoros + 1;
            const autoDone = newCount >= t.estimatedPomodoros;
            return { ...t, completedPomodoros: newCount, isCompleted: autoDone || t.isCompleted };
          }
          return t;
        });

        if (settings.autoDeleteCompleted) {
          updated = updated.filter(t => !t.isCompleted);
        }
        return updated;
      });
    }
  }, [mode, activeTaskId, settings.autoDeleteCompleted]);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${THEME_COLORS[mode]} flex flex-col pb-10`}>
      <header className="w-full bg-black/20 backdrop-blur-lg sticky top-0 z-40 border-b border-white/10 shadow-xl">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <Zap className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="font-black text-2xl tracking-tight hidden sm:inline">PomoFocus Pro</span>
            <span className="font-black text-xl tracking-tight sm:hidden">PomoFocus</span>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-4">
             <button onClick={() => setIsTemplatesOpen(true)} className="p-2 sm:px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all flex items-center gap-2 group">
              <ClipboardList className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold hidden md:inline">Templates</span>
            </button>
            <button onClick={() => setIsReportsOpen(true)} className="p-2 sm:px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all flex items-center gap-2 group">
              <BarChart3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold hidden md:inline">Insights</span>
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className="p-2 sm:px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all flex items-center gap-2 group">
              <SettingsIcon className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              <span className="text-sm font-bold hidden md:inline">Settings</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 flex flex-col gap-8">
        <div className="flex justify-between items-center bg-black/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/5 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl"><Trophy className="w-5 h-5 text-yellow-400" /></div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Daily Goal</p>
              <p className="text-lg font-black">{dailyStats.completed} / {dailyStats.goal}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 border-l border-white/10 pl-6">
            <div className="p-3 bg-white/10 rounded-xl"><Flame className="w-5 h-5 text-orange-400" /></div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Streak</p>
              <p className="text-lg font-black">{streak} days</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-10 flex flex-col items-center gap-8 shadow-2xl border border-white/10 shrink-0">
          <div className="flex bg-black/20 rounded-2xl p-1.5 w-full max-w-xs">
            {(['focus', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
              <button key={m} onClick={() => setMode(m)} className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold transition-all ${mode === m ? 'bg-white/20 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}>
                {m === 'focus' ? 'Focus' : m === 'shortBreak' ? 'Short' : 'Long'}
              </button>
            ))}
          </div>

          <Timer mode={mode} settings={settings} onComplete={handleSessionComplete} onModeChange={setMode} />

          {activeTask && mode === 'focus' ? (
            <div className="text-center animate-in fade-in slide-in-from-bottom-2">
              <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Focusing on</span>
              <p className="font-bold text-xl drop-shadow-sm">{activeTask.title}</p>
            </div>
          ) : (
            <div className="text-center opacity-70 flex items-center gap-2 text-sm italic">
              <Quote className="w-4 h-4" />
              <span>{currentQuote}</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-h-0 flex flex-col">
          <TaskList tasks={tasks} setTasks={setTasks} activeTaskId={activeTaskId} setActiveTaskId={setActiveTaskId} finishTimeEstimate={finishTimeEstimate} />
        </div>
      </main>

      {isSettingsOpen && <SettingsModal settings={settings} onSave={setSettings} onClose={() => setIsSettingsOpen(false)} />}
      {isReportsOpen && <ReportsModal sessions={sessions} onClose={() => setIsReportsOpen(false)} />}
      {isTemplatesOpen && <TemplatesModal templates={templates} setTemplates={setTemplates} setTasks={setTasks} currentTasks={tasks} onClose={() => setIsTemplatesOpen(false)} />}
    </div>
  );
};

export default App;
