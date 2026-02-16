
import { Settings, TaskTemplate } from './types';

export const DEFAULT_SETTINGS: Settings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  alarmSound: 'digital',
  backgroundSound: 'none',
  volume: 0.5,
  dailyGoal: 8,
  strictMode: false,
  autoDeleteCompleted: false,
};

export const ALARM_SOUNDS = [
  { id: 'digital', name: 'Digital', url: 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg' },
  { id: 'bell', name: 'Bell', url: 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg' },
  { id: 'bird', name: 'Bird', url: 'https://actions.google.com/sounds/v1/foley/bird_chirp_short.ogg' },
];

export const BG_SOUNDS = [
  { id: 'none', name: 'None', url: '' },
  { id: 'rain', name: 'Rain', url: 'https://www.soundjay.com/nature/rain-01.mp3' },
  { id: 'waves', name: 'Waves', url: 'https://www.soundjay.com/nature/ocean-waves-1.mp3' },
  { id: 'forest', name: 'Forest', url: 'https://www.soundjay.com/nature/forest-wind-1.mp3' },
];

export const THEME_COLORS = {
  focus: 'bg-red-500',
  shortBreak: 'bg-teal-500',
  longBreak: 'bg-blue-600',
};

export const PREMADE_TEMPLATES: TaskTemplate[] = [
  {
    id: 'pre-deep-work',
    name: '🚀 Deep Work Morning',
    tasks: [
      { title: 'Crucial Task #1', estimatedPomodoros: 4, project: 'Focus' },
      { title: 'Email Triage', estimatedPomodoros: 1, project: 'Admin' },
      { title: 'Planning Tomorrow', estimatedPomodoros: 1, project: 'Admin' },
    ]
  },
  {
    id: 'pre-student',
    name: '📚 Study Sprint',
    tasks: [
      { title: 'Active Recall Session', estimatedPomodoros: 3, project: 'Learning' },
      { title: 'Practice Problems', estimatedPomodoros: 2, project: 'Learning' },
      { title: 'Summary Notes', estimatedPomodoros: 1, project: 'Review' },
    ]
  },
  {
    id: 'pre-health',
    name: '🏠 Healthy Home',
    tasks: [
      { title: 'Quick Tidy Up', estimatedPomodoros: 1, project: 'Home' },
      { title: 'Weekly Prep', estimatedPomodoros: 2, project: 'Home' },
      { title: 'Read 20 Pages', estimatedPomodoros: 1, project: 'Personal' },
    ]
  }
];
