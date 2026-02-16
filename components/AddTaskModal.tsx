
import React, { useState } from 'react';
import { Task, SubTask } from '../types';
import { X, Plus, Minus, Tag, FileText, ListTodo } from 'lucide-react';

interface AddTaskModalProps {
  onSave: (task: Omit<Task, 'id' | 'completedPomodoros' | 'isCompleted' | 'createdAt'>) => void;
  onClose: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [project, setProject] = useState('');
  const [notes, setNotes] = useState('');
  const [estimatedPomos, setEstimatedPomos] = useState(1);
  const [subTaskInput, setSubTaskInput] = useState('');
  const [subTasks, setSubTasks] = useState<Omit<SubTask, 'id'>[]>([]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      project: project.trim() || undefined,
      notes: notes.trim() || undefined,
      estimatedPomodoros: estimatedPomos,
      subTasks: subTasks.map(st => ({ ...st, id: Math.random().toString(36).substr(2, 9) })),
    });
    onClose();
  };

  const addSubTask = () => {
    if (!subTaskInput.trim()) return;
    setSubTasks([...subTasks, { title: subTaskInput.trim(), isCompleted: false }]);
    setSubTaskInput('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-6 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Add New Task</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6 text-gray-400" /></button>
        </div>

        <div className="p-8 flex flex-col gap-6 overflow-y-auto max-h-[70vh] scrollbar-hide">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Task Title</label>
            <input 
              autoFocus 
              className="w-full text-xl font-bold text-gray-800 outline-none border-b-2 border-gray-100 focus:border-gray-800 transition-all pb-2 bg-white ring-0 focus:ring-0" 
              placeholder="What are you working on?" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Tag className="w-3 h-3" /> Project</label>
              <input 
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-700 outline-none focus:border-gray-800 transition-all shadow-sm focus:ring-2 focus:ring-gray-100" 
                placeholder="e.g. Work" 
                value={project} 
                onChange={(e) => setProject(e.target.value)} 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pomos</label>
              <div className="flex items-center gap-3 bg-white border border-gray-200 p-2 rounded-xl shadow-sm">
                <button onClick={() => setEstimatedPomos(p => Math.max(1, p - 1))} className="p-2 hover:bg-gray-50 rounded-lg transition-colors"><Minus className="w-4 h-4"/></button>
                <span className="font-black text-gray-800 flex-1 text-center">{estimatedPomos}</span>
                <button onClick={() => setEstimatedPomos(p => p + 1)} className="p-2 hover:bg-gray-50 rounded-lg transition-colors"><Plus className="w-4 h-4"/></button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><ListTodo className="w-3 h-3" /> Sub-tasks</label>
            <div className="flex gap-2">
              <input 
                className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-100 transition-all" 
                placeholder="Add steps..." 
                value={subTaskInput} 
                onChange={(e) => setSubTaskInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && addSubTask()} 
              />
              <button onClick={addSubTask} className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"><Plus className="w-5 h-5 text-gray-600" /></button>
            </div>
            {subTasks.length > 0 && (
              <div className="flex flex-col gap-2">
                {subTasks.map((st, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg group border border-gray-100">
                    <span className="text-xs font-bold text-gray-600">{st.title}</span>
                    <button onClick={() => setSubTasks(subTasks.filter((_, idx) => idx !== i))} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all"><X className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50/50 px-8 py-6 flex justify-end gap-3 border-t">
          <button onClick={onClose} className="px-6 py-3 text-gray-400 font-bold hover:text-gray-600 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-10 py-3 bg-gray-800 text-white rounded-2xl font-black shadow-lg hover:bg-black transition-all active:scale-95">Save Task</button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
