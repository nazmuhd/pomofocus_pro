
import React, { useState } from 'react';
import { Task } from '../types';
import { Plus, Trash2, CheckCircle, Clock, ChevronUp, ChevronDown, ListTodo, Tag, FileText, Check } from 'lucide-react';
import AddTaskModal from './AddTaskModal';

interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  activeTaskId: string | null;
  setActiveTaskId: (id: string | null) => void;
  finishTimeEstimate: string | null;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, setTasks, activeTaskId, setActiveTaskId, finishTimeEstimate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAddTask = (taskData: Omit<Task, 'id' | 'completedPomodoros' | 'isCompleted' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9),
      completedPomodoros: 0,
      isCompleted: false,
      createdAt: Date.now(),
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const toggleSubTask = (taskId: string, subTaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          subTasks: t.subTasks.map(st => st.id === subTaskId ? { ...st, isCompleted: !st.isCompleted } : st)
        };
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (activeTaskId === id) setActiveTaskId(null);
  };

  const moveTask = (index: number, direction: 'up' | 'down') => {
    const newTasks = [...tasks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newTasks.length) return;
    [newTasks[index], newTasks[targetIndex]] = [newTasks[targetIndex], newTasks[index]];
    setTasks(newTasks);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center border-b border-white/20 pb-3">
        <div className="flex items-center gap-2"><ListTodo className="w-5 h-5 opacity-60" /><h2 className="text-xl font-bold">Tasks</h2></div>
        <div className="text-xs font-bold opacity-50 uppercase tracking-widest">{tasks.filter(t => t.isCompleted).length}/{tasks.length} Done</div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 min-h-[150px] max-h-[500px] scrollbar-hide">
        {tasks.map((task, index) => (
          <div key={task.id} onClick={() => !task.isCompleted && setActiveTaskId(task.id)} className={`group bg-white rounded-3xl p-5 flex flex-col transition-all cursor-pointer border-l-8 ${activeTaskId === task.id && !task.isCompleted ? 'border-gray-800 scale-[1.02] shadow-xl' : 'border-transparent'} ${task.isCompleted ? 'opacity-40 grayscale' : 'hover:bg-white/95'} shadow-sm border border-gray-100/10`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1 overflow-hidden">
                <button onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }} className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${task.isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-gray-200 text-transparent hover:border-gray-400'}`}>
                  <CheckCircle className="w-4 h-4" />
                </button>
                <div className="flex flex-col overflow-hidden">
                  <span className={`font-black text-gray-800 truncate text-lg ${task.isCompleted ? 'line-through' : ''}`}>{task.title}</span>
                  {task.project && <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1 mt-1"><Tag className="w-2.5 h-2.5" /> {task.project}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <div className="flex flex-col opacity-0 group-hover:opacity-100">
                  <button onClick={(e) => { e.stopPropagation(); moveTask(index, 'up'); }} className="p-1 text-gray-400 hover:text-gray-800"><ChevronUp className="w-4 h-4" /></button>
                  <button onClick={(e) => { e.stopPropagation(); moveTask(index, 'down'); }} className="p-1 text-gray-400 hover:text-gray-800"><ChevronDown className="w-4 h-4" /></button>
                </div>
                <span className="text-sm font-black text-gray-300 tabular-nums px-2">{task.completedPomodoros}/{task.estimatedPomodoros}</span>
                <button onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 text-red-500 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>

            {(task.notes || task.subTasks.length > 0) && (
              <div className="mt-3 ml-10">
                <button onClick={(e) => { e.stopPropagation(); setExpandedId(expandedId === task.id ? null : task.id); }} className="text-[10px] font-bold text-gray-400 hover:text-gray-600 flex items-center gap-1">
                  <ListTodo className="w-3 h-3" /> {expandedId === task.id ? 'Hide Details' : 'Show Details'}
                </button>
                {expandedId === task.id && (
                  <div className="mt-3 flex flex-col gap-3 animate-in fade-in slide-in-from-top-1">
                    {task.subTasks.length > 0 && (
                      <div className="flex flex-col gap-2">
                        {task.subTasks.map(st => (
                          <div key={st.id} onClick={(e) => { e.stopPropagation(); toggleSubTask(task.id, st.id); }} className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-100/50">
                            <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${st.isCompleted ? 'bg-gray-800 border-gray-800 text-white' : 'border-gray-300 bg-white'}`}>
                              {st.isCompleted && <Check className="w-2.5 h-2.5" />}
                            </div>
                            <span className={`text-xs font-bold ${st.isCompleted ? 'text-gray-400 line-through' : 'text-gray-600'}`}>{st.title}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {task.notes && <p className="text-xs font-medium text-gray-500 bg-blue-50/50 p-3 rounded-xl border border-blue-100 italic">"{task.notes}"</p>}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        <button onClick={() => setIsModalOpen(true)} className="w-full py-6 border-2 border-dashed border-white/20 rounded-3xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all font-black text-xl"><Plus className="w-7 h-7" /> Add New Task</button>
      </div>

      {finishTimeEstimate && (
        <div className="bg-black/20 rounded-2xl p-5 flex justify-between items-center text-sm font-bold border border-white/5 shadow-inner">
          <div className="flex items-center gap-3 opacity-60"><Clock className="w-5 h-5" /><span className="uppercase tracking-widest text-[10px] font-black">Finish Time Estimate</span></div>
          <span className="text-xl font-black tracking-tight">{finishTimeEstimate}</span>
        </div>
      )}
      {isModalOpen && <AddTaskModal onSave={handleAddTask} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default TaskList;
