import React from 'react';
import { Bell, Search, Settings } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur top-0 z-10 sticky flex items-center justify-between px-8">
      <h1 className="text-xl font-semibold text-slate-100 tracking-tight">{title}</h1>
      
      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search network..." 
            className="w-64 bg-slate-950 border border-slate-800 rounded-full pl-9 pr-4 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
          />
        </div>
        
        <div className="flex items-center gap-4 text-slate-400">
          <button className="hover:text-slate-100 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute 1 top-0 right-0 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-900"></span>
          </button>
          <button className="hover:text-slate-100 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 border border-slate-700"></div>
        </div>
      </div>
    </header>
  );
}
