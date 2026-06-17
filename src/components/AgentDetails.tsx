import React, { useState } from 'react';
import { Agent } from '../data/agents';
import { ShieldCheck, Activity, Terminal, History, CheckCircle2, Search, AlertTriangle, Clock } from 'lucide-react';

interface AgentDetailsProps {
  agent: Agent;
}

export function AgentDetails({ agent }: AgentDetailsProps) {
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'history'>('diagnostics');
  const [historySearch, setHistorySearch] = useState('');
  const [historyFilter, setHistoryFilter] = useState('All');
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);

  const mockHistory = [
    { 
      id: 1, 
      task: `Processed data batch for ${agent.id}`, 
      status: 'Completed', 
      time: '2 mins ago',
      details: {
        input: '{\n  "batchId": "B-49281",\n  "records": 250,\n  "priority": "high"\n}',
        output: '{\n  "status": "success",\n  "processed": 250,\n  "errors": 0,\n  "latencyMs": 142\n}'
      }
    },
    { 
      id: 2, 
      task: `Health check sync with Orchestrator`, 
      status: 'Completed', 
      time: '15 mins ago',
      details: {
        input: '{\n  "action": "ping",\n  "system": "orchestrator"\n}',
        output: '{\n  "status": "ok",\n  "uptime": "14d 2h",\n  "memory": "42%"\n}'
      }
    },
    { 
      id: 3, 
      task: `Failed to resolve knowledge node`, 
      status: 'Failed', 
      time: '45 mins ago',
      details: {
        input: '{\n  "query": "SELECT * FROM vectors WHERE type = \'compliance\'",\n  "timeout": 5000\n}',
        output: '{\n  "error": "ConnectionRefused",\n  "message": "Vector DB unreachable at 10.0.4.19"\n}'
      }
    },
    { 
      id: 4, 
      task: `Executed sub-routine ${agent.id}_alpha`, 
      status: 'Completed', 
      time: '1 hour ago',
      details: {
        input: '{\n  "routine": "alpha",\n  "flags": ["--optimize", "--cache"]\n}',
        output: '{\n  "status": "success",\n  "result": "Routine completed. Cache hit ratio 89%."\n}'
      }
    },
    { 
      id: 5, 
      task: `Updated local vector state`, 
      status: 'Completed', 
      time: '3 hours ago',
      details: {
        input: '{\n  "source": "S3-lake",\n  "sync": true\n}',
        output: '{\n  "status": "success",\n  "vectorsUpdated": 4092\n}'
      }
    },
    { 
      id: 6, 
      task: `Awaiting dependent task completion`, 
      status: 'Pending', 
      time: '4 hours ago',
      details: {
        input: '{\n  "dependsOn": ["task_99182", "task_99183"]\n}',
        output: '{\n  "status": "awaiting",\n  "message": "Holding execution until dependencies resolve."\n}'
      }
    },
  ];

  const filteredHistory = mockHistory.filter(entry => {
    const matchesSearch = entry.task.toLowerCase().includes(historySearch.toLowerCase());
    const matchesFilter = historyFilter === 'All' || entry.status === historyFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex items-start gap-6 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-5">
           <agent.icon className="w-64 h-64" />
        </div>
        <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700 shrink-0 relative z-10">
          <agent.icon className="w-8 h-8 text-blue-400" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight">{agent.name}</h2>
            <span className={`text-xs px-2.5 py-1 rounded-md font-medium border ${
                  agent.status === 'Operational' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                  'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              {agent.status}
            </span>
          </div>
          <p className="text-slate-400 max-w-2xl text-lg">{agent.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Responsibilities */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider mb-5 flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-500" /> Core Responsibilities
          </h3>
          <ul className="space-y-3">
            {agent.responsibilities.map((resp, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                <span className="text-slate-300 text-sm leading-relaxed">{resp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Capabilities */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider mb-5 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-500" /> System Capabilities
          </h3>
          <div className="flex flex-wrap gap-2">
            {agent.capabilities.map((cap, i) => (
              <span key={i} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-md text-sm border border-slate-700/50">
                {cap}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Section */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
        <div className="bg-slate-900 border-b border-slate-800 flex items-center gap-4 px-4 py-2">
          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-[9px] ${
              activeTab === 'diagnostics' ? 'text-blue-400 border-blue-400' : 'text-slate-500 border-transparent hover:text-slate-300'
            }`}
          >
            <Terminal className="w-4 h-4" />
            Diagnostic Stream
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-[9px] ${
              activeTab === 'history' ? 'text-blue-400 border-blue-400' : 'text-slate-500 border-transparent hover:text-slate-300'
            }`}
          >
            <History className="w-4 h-4" />
            Task History
          </button>
        </div>

        <div className="h-64 overflow-y-auto">
          {activeTab === 'diagnostics' ? (
            <div className="p-4 font-mono text-xs text-slate-400 space-y-2">
              <p><span className="text-emerald-400">[OK]</span> Init module {agent.id}_core... success.</p>
              <p><span className="text-emerald-400">[OK]</span> Connection established to Orchestrator API.</p>
              <p><span className="text-blue-400">[INFO]</span> Awaiting incoming task routing.</p>
              <p className="opacity-50 mt-4 animate-pulse">_</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-slate-800/50 flex flex-col sm:flex-row items-center gap-4 bg-slate-900 sticky top-0 z-10">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search history..."
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-md pl-9 pr-4 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 placeholder:text-slate-600"
                  />
                </div>
                <select
                  value={historyFilter}
                  onChange={(e) => setHistoryFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 appearance-none w-full sm:w-auto min-w-[120px]"
                >
                  <option value="All">All Status</option>
                  <option value="Completed">Completed</option>
                  <option value="Failed">Failed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div className="p-4 space-y-4">
                {filteredHistory.map((entry) => (
                  <div key={entry.id} className="border-b border-slate-800/50 pb-4 last:border-0 last:pb-0">
                    <div 
                      className="flex items-start justify-between cursor-pointer group"
                      onClick={() => setExpandedTaskId(expandedTaskId === entry.id ? null : entry.id)}
                    >
                      <div className="flex items-start gap-3">
                        {entry.status === 'Completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        ) : entry.status === 'Failed' ? (
                          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                        ) : (
                          <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-slate-200 group-hover:text-blue-400 transition-colors">{entry.task}</p>
                          <p className="text-xs text-slate-500 mt-1">{entry.status}</p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-500 whitespace-nowrap">{entry.time}</span>
                    </div>
                    
                    {expandedTaskId === entry.id && (
                      <div className="mt-4 pl-8 pr-2">
                        <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">
                            <div className="p-3">
                              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Input Parameters</h4>
                              <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap break-all overflow-x-auto bg-slate-900 border border-slate-800/50 p-2 rounded">
                                {entry.details.input}
                              </pre>
                            </div>
                            <div className="p-3">
                              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Output Logs</h4>
                              <pre className={`text-xs font-mono whitespace-pre-wrap break-all overflow-x-auto bg-slate-900 border border-slate-800/50 p-2 rounded ${entry.status === 'Failed' ? 'text-red-400' : 'text-slate-300'}`}>
                                {entry.details.output}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {filteredHistory.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    No history found matching the filters.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
