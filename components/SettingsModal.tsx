
import React, { useState } from 'react';
import { Settings } from '../types';
import { X, Volume2, ShieldAlert, Target, Trash2, Clock, Music } from 'lucide-react';
import { ALARM_SOUNDS, BG_SOUNDS } from '../constants';

interface SettingsModalProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSave, onClose }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const inputClass = "w-full bg-white border border-gray-200 rounded-xl p-3 text-gray-800 font-bold outline-none focus:border-gray-800 focus:ring-4 focus:ring-gray-100 transition-all shadow-sm";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-6 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="p-8 flex flex-col gap-8 overflow-y-auto max-h-[70vh] scrollbar-hide">
          <section>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Clock className="w-3 h-3" /> Timer Durations
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-[9px] font-black text-gray-500 uppercase mb-1.5 ml-1 block">Focus</label>
                <input type="number" className={inputClass} value={localSettings.focusDuration} onChange={(e) => setLocalSettings({ ...localSettings, focusDuration: parseInt(e.target.value) || 1 })} />
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-500 uppercase mb-1.5 ml-1 block">Short</label>
                <input type="number" className={inputClass} value={localSettings.shortBreakDuration} onChange={(e) => setLocalSettings({ ...localSettings, shortBreakDuration: parseInt(e.target.value) || 1 })} />
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-500 uppercase mb-1.5 ml-1 block">Long</label>
                <input type="number" className={inputClass} value={localSettings.longBreakDuration} onChange={(e) => setLocalSettings({ ...localSettings, longBreakDuration: parseInt(e.target.value) || 1 })} />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Music className="w-3 h-3" /> Sounds & Ambience
            </h3>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-gray-500 uppercase ml-1">Alarm Tone</label>
                  <select className={inputClass} value={localSettings.alarmSound} onChange={(e) => setLocalSettings({ ...localSettings, alarmSound: e.target.value })}>
                    {ALARM_SOUNDS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-gray-500 uppercase ml-1">Background</label>
                  <select className={inputClass} value={localSettings.backgroundSound} onChange={(e) => setLocalSettings({ ...localSettings, backgroundSound: e.target.value })}>
                    {BG_SOUNDS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                <Volume2 className="w-5 h-5 text-gray-400" />
                <input type="range" min="0" max="1" step="0.1" className="flex-1 accent-gray-800 h-1.5 rounded-full appearance-none bg-gray-100" value={localSettings.volume} onChange={(e) => setLocalSettings({ ...localSettings, volume: parseFloat(e.target.value) })} />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Target className="w-3 h-3" /> Focus Goal
            </h3>
            <div className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-bold text-gray-700">Daily Pomo Goal</span>
              </div>
              <input 
                type="number" 
                className="w-16 bg-white border border-gray-200 rounded-xl p-2 text-center font-black text-gray-800 outline-none focus:border-gray-800"
                value={localSettings.dailyGoal}
                onChange={(e) => setLocalSettings({ ...localSettings, dailyGoal: parseInt(e.target.value) || 1 })}
              />
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShieldAlert className="w-3 h-3" /> deep focus
            </h3>
            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-between bg-white border border-gray-100 p-4 rounded-2xl cursor-pointer group shadow-sm hover:border-gray-300 transition-colors">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 text-gray-300 group-hover:text-red-500 transition-colors" />
                  <div>
                    <p className="text-sm font-bold text-gray-800">Strict Mode</p>
                    <p className="text-[10px] font-medium text-gray-400">Timer cannot be paused</p>
                  </div>
                </div>
                <input type="checkbox" className="w-5 h-5 accent-gray-800 rounded-md" checked={localSettings.strictMode} onChange={(e) => setLocalSettings({ ...localSettings, strictMode: e.target.checked })} />
              </label>

              <label className="flex items-center justify-between bg-white border border-gray-100 p-4 rounded-2xl cursor-pointer group shadow-sm hover:border-gray-300 transition-colors">
                <div className="flex items-center gap-3">
                  <Trash2 className="w-5 h-5 text-gray-300 group-hover:text-red-500 transition-colors" />
                  <div>
                    <p className="text-sm font-bold text-gray-800">Auto-Clean Tasks</p>
                    <p className="text-[10px] font-medium text-gray-400">Remove completed items on finish</p>
                  </div>
                </div>
                <input type="checkbox" className="w-5 h-5 accent-gray-800 rounded-md" checked={localSettings.autoDeleteCompleted} onChange={(e) => setLocalSettings({ ...localSettings, autoDeleteCompleted: e.target.checked })} />
              </label>
            </div>
          </section>
        </div>

        <div className="bg-gray-50/50 px-8 py-6 flex justify-end gap-3 border-t border-gray-100">
          <button onClick={onClose} className="px-6 py-3 text-gray-400 font-bold hover:text-gray-600 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-10 py-3 bg-gray-800 text-white rounded-2xl font-black shadow-lg hover:bg-black transition-all active:scale-95">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
