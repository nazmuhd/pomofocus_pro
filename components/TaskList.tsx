
import React, { useState } from 'react';
import { Task } from '../types';
import { Plus, Trash2, CheckCircle, Clock, ChevronUp, ChevronDown, ListTodo, Tag, Edit2, Check, ChevronRight } from 'lucide-react';
import TaskModal from './TaskModal';

interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  activeTaskId: string | null;
  setActiveTaskId: (id: string | null) => void;
  finishTimeEstimate: string | null;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, setTasks, activeTaskId, setActiveTaskId, finishTimeEstimate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'completedPomodoros' | 'isCompleted' | 'createdAt'>) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...taskData } : t));
      setEditingTask(null);
    } else {
      const newTask: Task = {
        ...taskData,
        id: Math.random().toString(36).substr(2, 9),
        completedPomodoros: 0,
        isCompleted: false,
        createdAt: Date.now(),
      };
      setTasks([...tasks, newTask]);
    }
    setIsModalOpen(false);
  };

  const handleEditClick = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    setEditingTask(task);
    setIsModalOpen(true);
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

  const handleTaskCardClick = (task: Task) => {
    if (!task.isCompleted) {
      setActiveTaskId(task.id);
    }
    setExpandedId(expandedId === task.id ? null : task.id);
  };

  return (
    <div className="flex flex-col gap-4 h-full min-h-0">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/20 pb-3 shrink-0">
        <div className="flex items-center gap-2">
          <ListTodo className="w-5 h-5 text-white/60" />
          <h2 className="text-xl font-bold text-white tracking-tight">Tasks</h2>
        </div>
        <div className="text-[10px] font-black text-white/40 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">
          {tasks.filter(t => t.isCompleted).length} / {tasks.length} Completed
        </div>
      </div>

      {/* Scrollable Task Area */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 scrollbar-hide min-h-0">
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center opacity-30 border-2 border-dashed border-white/10 rounded-3xl">
            <ListTodo className="w-12 h-12 mb-2" />
            <p className="text-sm font-bold">No tasks yet.<br/>Add one to stay focused!</p>
          </div>
        )}
        
        {tasks.map((task, index) => (
          <div 
            key={task.id} 
            onClick={() => handleTaskCardClick(task)} 
            className={`group relative bg-white/10 backdrop-blur-xl rounded-[2rem] p-5 flex flex-col transition-all cursor-pointer border shadow-lg ${
              activeTaskId === task.id && !task.isCompleted 
                ? 'border-white/50 bg-white/20 ring-1 ring-white/20 scale-[1.02]' 
                : 'border-white/5 hover:bg-white/15'
            } ${task.isCompleted ? 'opacity-40 grayscale' : ''}`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 overflow-hidden">
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }} 
                  className={`w-7 h-7 shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${
                    task.isCompleted 
                      ? 'bg-white border-white text-gray-900' 
                      : 'border-white/20 text-transparent hover:border-white/50'
                  }`}
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
                <div className="flex flex-col overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-white text-lg truncate ${task.isCompleted ? 'line-through' : ''}`}>
                      {task.title}
                    </span>
                    <ChevronRight className={`w-4 h-4 text-white/20 transition-transform duration-300 ${expandedId === task.id ? 'rotate-90 text-white/60' : ''}`} />
                  </div>
                  {task.project && (
                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                      <Tag className="w-3 h-3" /> {task.project}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); moveTask(index, 'up'); }} className="p-0.5 text-white/40 hover:text-white"><ChevronUp className="w-4 h-4" /></button>
                  <button onClick={(e) => { e.stopPropagation(); moveTask(index, 'down'); }} className="p-0.5 text-white/40 hover:text-white"><ChevronDown className="w-4 h-4" /></button>
                </div>
                
                <div className="bg-black/20 px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/5">
                  <span className="text-xs font-black text-white tabular-nums">{task.completedPomodoros}</span>
                  <span className="text-[10px] font-black text-white/30">/</span>
                  <span className="text-xs font-black text-white/60 tabular-nums">{task.estimatedPomodoros}</span>
                </div>
                
                <div className="flex gap-1">
                  <button 
                    onClick={(e) => handleEditClick(e, task)} 
                    className="p-2.5 hover:bg-white/10 text-white/40 hover:text-white rounded-xl transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }} 
                    className="p-2.5 hover:bg-red-500/20 text-white/20 hover:text-red-400 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Details Section */}
            {expandedId === task.id && (
              <div 
                className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                {task.notes && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Notes</span>
                    <p className="text-sm font-medium text-white/70 bg-white/5 p-3 rounded-2xl border border-white/5 italic">
                      "{task.notes}"
                    </p>
                  </div>
                )}
                
                {task.subTasks.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Checklist</span>
                    <div className="flex flex-col gap-1.5">
                      {task.subTasks.map(st => (
                        <div 
                          key={st.id} 
                          onClick={() => toggleSubTask(task.id, st.id)} 
                          className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group/sub"
                        >
                          <div className={`w-5 h-5 shrink-0 rounded-lg border flex items-center justify-center transition-all ${
                            st.isCompleted 
                              ? 'bg-white border-white text-gray-900 shadow-lg' 
                              : 'border-white/20 bg-transparent group-hover/sub:border-white/40'
                          }`}>
                            {st.isCompleted && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <span className={`text-sm font-bold ${st.isCompleted ? 'text-white/30 line-through' : 'text-white/80'}`}>
                            {st.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!task.notes && task.subTasks.length === 0 && (
                  <p className="text-center text-xs text-white/20 font-bold py-2">No additional details</p>
                )}
              </div>
            )}
          </div>
        ))}

        <button 
          onClick={() => { setEditingTask(null); setIsModalOpen(true); }} 
          className="w-full py-8 border-2 border-dashed border-white/10 rounded-[2rem] flex items-center justify-center gap-3 hover:bg-white/5 hover:border-white/30 transition-all font-black text-xl text-white/40 hover:text-white"
        >
          <Plus className="w-8 h-8" /> Add New Task
        </button>
      </div>

      {/* Footer / Estimate */}
      {finishTimeEstimate && tasks.length > 0 && (
        <div className="bg-black/30 backdrop-blur-xl rounded-[1.5rem] p-4 flex justify-between items-center text-sm font-bold border border-white/10 shadow-2xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-lg">
              <Clock className="w-4 h-4 text-white/60" />
            </div>
            <div>
              <p className="text-[8px] font-black text-white/30 uppercase tracking-widest leading-none mb-1">Estimated Completion</p>
              <p className="text-lg font-black tracking-tight text-white leading-none">{finishTimeEstimate}</p>
            </div>
          </div>
          <div className="text-right">
             <p className="text-[8px] font-black text-white/30 uppercase tracking-widest leading-none mb-1">Total Effort</p>
             <p className="text-sm font-black text-white/80 leading-none">
              {tasks.filter(t => !t.isCompleted).reduce((acc, t) => acc + t.estimatedPomodoros, 0)} Pomos
             </p>
          </div>
        </div>
      )}

      {isModalOpen && (
        <TaskModal 
          task={editingTask || undefined} 
          onSave={handleSaveTask} 
          onClose={() => { setIsModalOpen(false); setEditingTask(null); }} 
        />
      )}
    </div>
  );
};

export default TaskList;
