
import React, { useState } from 'react';
import { TaskTemplate, Task } from '../types';
import { X, Copy, Plus, Trash2, Layers, PackagePlus, Save, List, Sparkles } from 'lucide-react';
import { PREMADE_TEMPLATES } from '../constants';

interface TemplatesModalProps {
  templates: TaskTemplate[];
  setTemplates: React.Dispatch<React.SetStateAction<TaskTemplate[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  currentTasks: Task[];
  onClose: () => void;
}

const TemplatesModal: React.FC<TemplatesModalProps> = ({ templates, setTemplates, setTasks, currentTasks, onClose }) => {
  const [isCreatingFromCurrent, setIsCreatingFromCurrent] = useState(false);
  const [templateName, setTemplateName] = useState('');

  const saveCurrentAsTemplate = () => {
    if (!templateName.trim() || currentTasks.length === 0) return;
    
    const newTemplate: TaskTemplate = {
      id: Math.random().toString(36).substr(2, 9),
      name: templateName,
      tasks: currentTasks.map(t => ({
        title: t.title,
        estimatedPomodoros: t.estimatedPomodoros,
        project: t.project,
        notes: t.notes
      }))
    };
    
    setTemplates([...templates, newTemplate]);
    setTemplateName('');
    setIsCreatingFromCurrent(false);
  };

  const applyTemplate = (template: TaskTemplate) => {
    const newTasks: Task[] = template.tasks.map(t => ({
      ...t,
      id: Math.random().toString(36).substr(2, 9),
      completedPomodoros: 0,
      isCompleted: false,
      createdAt: Date.now(),
      subTasks: [],
    }));
    setTasks(prev => [...prev, ...newTasks]);
    onClose();
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  // Separate user templates from premade ones if user has saved any
  const userTemplates = templates.filter(t => !t.id.startsWith('pre-'));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-6 flex justify-between items-center border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Layers className="w-6 h-6 text-gray-800" />
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">Workflows</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="p-8 flex flex-col gap-6 overflow-y-auto max-h-[70vh] scrollbar-hide">
          
          {/* Section: Premade Templates */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quick Start Templates</h3>
            </div>
            <div className="grid gap-3">
              {PREMADE_TEMPLATES.map(template => (
                <div key={template.id} className="bg-orange-50/50 border border-orange-100 p-4 rounded-2xl flex flex-col gap-3 group hover:border-orange-200 hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-gray-800 text-base leading-none">{template.name}</h4>
                    </div>
                    <button 
                      onClick={() => applyTemplate(template)}
                      className="px-4 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-black hover:bg-orange-600 transition-all active:scale-95"
                    >
                      Load
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {template.tasks.map((t, i) => (
                      <div key={i} className="px-2 py-0.5 bg-white border border-orange-100 rounded-md text-[9px] font-bold text-orange-700">
                        {t.title}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Section: User Templates */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4 text-blue-500" />
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">My Saved Workflows</h3>
              </div>
            </div>

            {/* Action Header */}
            {!isCreatingFromCurrent ? (
              <button 
                onClick={() => setIsCreatingFromCurrent(true)}
                disabled={currentTasks.length === 0}
                className="w-full py-4 bg-gray-50 border-2 border-dashed border-gray-200 text-gray-500 rounded-2xl font-bold flex items-center justify-center gap-2 hover:border-gray-800 hover:text-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                <Plus className="w-5 h-5" />
                Save Current Task List
              </button>
            ) : (
              <div className="bg-gray-800 p-6 rounded-2xl flex flex-col gap-4 animate-in slide-in-from-top-4 mb-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Workflow Name</label>
                  <input 
                    autoFocus
                    className="bg-transparent text-xl font-black text-white outline-none placeholder:text-white/20 border-b border-white/10 focus:border-white transition-all pb-2 focus:ring-0"
                    placeholder="e.g. Daily Routine"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveCurrentAsTemplate()}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setIsCreatingFromCurrent(false)} className="text-white/40 font-bold px-4 py-2 hover:text-white">Cancel</button>
                  <button onClick={saveCurrentAsTemplate} className="bg-white text-gray-800 px-6 py-2 rounded-xl font-black shadow-lg active:scale-95 transition-all">Save Now</button>
                </div>
              </div>
            )}

            {userTemplates.length === 0 && !isCreatingFromCurrent && (
              <div className="text-center py-6 flex flex-col items-center">
                <p className="text-gray-300 text-xs font-bold">You haven't saved any custom workflows yet.</p>
              </div>
            )}

            <div className="grid gap-3">
              {userTemplates.map(template => (
                <div key={template.id} className="bg-white border border-gray-100 p-4 rounded-2xl flex flex-col gap-3 group hover:border-gray-300 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-gray-800 text-base leading-none">{template.name}</h4>
                      <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-tight">{template.tasks.length} items</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => applyTemplate(template)}
                        className="px-4 py-1.5 bg-gray-800 text-white rounded-lg text-xs font-black hover:bg-black transition-all active:scale-95"
                      >
                        Load
                      </button>
                      <button 
                        onClick={() => deleteTemplate(template.id)}
                        className="p-1.5 text-red-200 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TemplatesModal;
