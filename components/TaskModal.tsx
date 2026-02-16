
import React, { useState, useEffect } from 'react';
import { Task, SubTask } from '../types';
import { X, Plus, Minus, Tag, ListTodo } from 'lucide-react';

interface TaskModalProps {
  task?: Task;
  onSave: (task: Omit<Task, 'id' | 'completedPomodoros' | 'isCompleted' | 'createdAt'>) => void;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onSave, onClose }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [project, setProject] = useState(task?.project || '');
  const [notes, setNotes] = useState(task?.notes || '');
  const [estimatedPomos, setEstimatedPomos] = useState(task?.estimatedPomodoros || 1);
  const [subTaskInput, setSubTaskInput] = useState('');
  const [subTasks, setSubTasks] = useState<SubTask[]>(task?.subTasks || []);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setProject(task.project || '');
      setNotes(task.notes || '');
      setEstimatedPomos(task.estimatedPomodoros);
      setSubTasks(task.subTasks);
    }
  }, [task]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      project: project.trim() || undefined,
      notes: notes.trim() || undefined,
      estimatedPomodoros: estimatedPomos,
      subTasks: subTasks.map(st => ({ ...st, id: st.id || Math.random().toString(36).substr(2, 9) })),
    });
    onClose();
  };

  const addSubTask = () => {
    if (!subTaskInput.trim()) return;
    const newSubTask: SubTask = {
      id: Math.random().toString(36).substr(2, 9),
      title: subTaskInput.trim(),
      isCompleted: false
    };
    setSubTasks([...subTasks, newSubTask]);
    setSubTaskInput('');
  };

  const removeSubTask = (id: string) => {
    setSubTasks(subTasks.filter(st => st.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[60] p-4">
      <div className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] w-full max-w-md overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="px-8 py-6 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 flex flex-col gap-6 overflow-y-auto max-h-[70vh] scrollbar-hide">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Task Title</label>
            <input 
              autoFocus 
              className="w-full text-xl font-bold text-gray-800 outline-none border-b-2 border-gray-100 focus:border-gray-800 transition-all pb-2 bg-transparent ring-0 focus:ring-0" 
              placeholder="What are you working on?" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <Tag className="w-3 h-3" /> Project
              </label>
              <input 
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-sm font-bold text-gray-700 outline-none focus:bg-white focus:border-gray-800 transition-all shadow-inner" 
                placeholder="e.g. Work" 
                value={project} 
                onChange={(e) => setProject(e.target.value)} 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Est. Pomodoros</label>
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-2 rounded-2xl shadow-inner">
                <button onClick={() => setEstimatedPomos(p => Math.max(1, p - 1))} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm"><Minus className="w-4 h-4 text-gray-600"/></button>
                <span className="font-black text-gray-800 flex-1 text-center text-lg">{estimatedPomos}</span>
                <button onClick={() => setEstimatedPomos(p => p + 1)} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm"><Plus className="w-4 h-4 text-gray-600"/></button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">Notes (Optional)</label>
            <textarea 
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-medium text-gray-700 outline-none focus:bg-white focus:border-gray-800 transition-all shadow-inner resize-none min-h-[80px]" 
              placeholder="Add details or context..." 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <ListTodo className="w-3 h-3" /> Checklist
            </label>
            <div className="flex gap-2">
              <input 
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:bg-white focus:border-gray-800 transition-all shadow-inner" 
                placeholder="Add steps..." 
                value={subTaskInput} 
                onChange={(e) => setSubTaskInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && addSubTask()} 
              />
              <button onClick={addSubTask} className="p-3 bg-gray-800 rounded-xl hover:bg-black transition-colors shadow-lg">
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>
            {subTasks.length > 0 && (
              <div className="flex flex-col gap-2 mt-1">
                {subTasks.map((st) => (
                  <div key={st.id} className="flex items-center justify-between bg-white px-4 py-3 rounded-xl group border border-gray-100 shadow-sm">
                    <span className="text-xs font-bold text-gray-600">{st.title}</span>
                    <button onClick={() => removeSubTask(st.id)} className="opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500 transition-all">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-6 flex justify-end gap-3 border-t">
          <button onClick={onClose} className="px-6 py-3 text-gray-400 font-bold hover:text-gray-600 transition-colors">Cancel</button>
          <button 
            onClick={handleSave} 
            disabled={!title.trim()}
            className="px-10 py-3 bg-gray-800 text-white rounded-2xl font-black shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50"
          >
            {task ? 'Update Task' : 'Add Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
