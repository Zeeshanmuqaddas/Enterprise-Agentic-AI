import React from 'react';
import { Agent } from '../data/agents';
import { Activity, ShieldCheck, Database, Zap, ArrowRight } from 'lucide-react';

interface DashboardProps {
  agents: Agent[];
  onAgentClick: (agentId: string) => void;
}

export function Dashboard({ agents, onAgentClick }: DashboardProps) {
  const stats = [
    { label: 'Active Processors', value: '1,248', icon: Activity, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Security Score', value: '99.8%', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Knowledge Nodes', value: '42.5M', icon: Database, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Latency', value: '12ms', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* System Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-100 tracking-tight">{stat.value}</h3>
            </div>
            <div className={`p-2 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Enterprise Agent Network</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => onAgentClick(`agent-${agent.id}`)}
              className="group bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all text-left flex flex-col h-full hover:shadow-lg hover:shadow-blue-900/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
                 <agent.icon className="w-32 h-32" />
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
                  <agent.icon className="w-5 h-5 text-blue-400" />
                </div>
                <span className={`text-xs px-2 py-1 rounded-md font-medium border ${
                  agent.status === 'Operational' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                  'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {agent.status}
                </span>
              </div>
              
              <h3 className="text-base font-semibold text-slate-100 mb-2">{agent.name}</h3>
              <p className="text-sm text-slate-500 mb-6 flex-1 line-clamp-2">
                {agent.description}
              </p>
              
              <div className="flex items-center text-xs font-medium text-slate-400 group-hover:text-blue-400 transition-colors mt-auto">
                View Configuration <ArrowRight className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
