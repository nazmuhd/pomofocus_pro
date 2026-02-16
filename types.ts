
export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export interface SubTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  project?: string;
  notes?: string;
  subTasks: SubTask[];
  estimatedPomodoros: number;
  completedPomodoros: number;
  isCompleted: boolean;
  createdAt: number;
}

export interface TaskTemplate {
  id: string;
  name: string;
  tasks: Omit<Task, 'id' | 'completedPomodoros' | 'isCompleted' | 'createdAt' | 'subTasks'>[];
}

export interface Settings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  alarmSound: string;
  backgroundSound: string;
  volume: number;
  dailyGoal: number;
  strictMode: boolean;
  autoDeleteCompleted: boolean;
}

export interface FocusSession {
  timestamp: number;
  duration: number; // minutes
  interruptions: number;
}

export interface ReportData {
  date: string;
  minutes: number;
}
