import React, { useState, useEffect } from 'react';
import { Agent } from '../data/agents';
import { Network, Activity, Cpu, Bot, LogOut, Terminal, Bell, AlertTriangle, ShieldAlert, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LogoutModal } from './auth/LogoutModal';

interface Notification {
  id: number;
  agentId: string;
  message: string;
  type: 'info' | 'warning' | 'critical';
  time: string;
}

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  agents: Agent[];
}

export function Sidebar({ currentView, setCurrentView, agents }: SidebarProps) {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, agentId: 'human', message: 'Action required: High-risk transaction detected', type: 'critical', time: 'Just now' },
    { id: 2, agentId: 'resilience', message: 'Circuit breaker tripped on Auth Service', type: 'warning', time: '2m ago' }
  ]);

  useEffect(() => {
    // Simulate real-time streaming of system events
    const timer = setInterval(() => {
      // 30% chance to trigger an alert every tick
      if (Math.random() > 0.7 && notifications.length < 8) {
        const eventTypes = [
          { agent: 'security', msg: 'Anomalous query pattern detected in East Region.', type: 'critical' },
          { agent: 'optimization', msg: 'Re-routing token loads for cost efficiency.', type: 'info' },
          { agent: 'human', msg: 'Approval requested for production config update.', type: 'warning' },
          { agent: 'resilience', msg: 'Latency spike detected on Database Node 3.', type: 'warning' },
          { agent: 'ethics', msg: 'Sensitive data scrubbing rule activated.', type: 'info' },
        ];
        const event = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        
        setNotifications(prev => [
          {
            id: Date.now(),
            agentId: event.agent,
            message: event.msg,
            type: event.type as 'info' | 'warning' | 'critical',
            time: 'Just now'
          },
          ...prev.map(n => ({ ...n, time: n.time === 'Just now' ? '1m ago' : n.time }))
        ].slice(0, 8)); // Keep last 8
      }
    }, 12000);
    return () => clearInterval(timer);
  }, [notifications.length]);

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen text-slate-300">
      <div className="p-6 flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <Network className="w-5 h-5 text-blue-400" />
        </div>
        <div className="font-semibold text-slate-100 tracking-tight">OS<span className="text-blue-500">.Enterprise</span></div>
      </div>
      
      <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
        <div className="px-4 py-2 shrink-0">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">System Views</div>
          <nav className="space-y-1">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${currentView === 'dashboard' ? 'bg-slate-800 text-blue-400' : 'hover:bg-slate-800/50 hover:text-slate-100'}`}
            >
              <Activity className="w-4 h-4 shrink-0" />
              Global Pipeline
            </button>
            <button
              onClick={() => setCurrentView('simulation')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${currentView === 'simulation' ? 'bg-slate-800 text-blue-400' : 'hover:bg-slate-800/50 hover:text-slate-100'}`}
            >
              <Cpu className="w-4 h-4 shrink-0" />
              Workflow Simulation
            </button>
            <button
              onClick={() => setCurrentView('nexus-ops')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${currentView === 'nexus-ops' ? 'bg-slate-800 text-blue-400' : 'hover:bg-slate-800/50 hover:text-slate-100'}`}
            >
              <Terminal className="w-4 h-4 shrink-0" />
              NEXUS-OPS Control
            </button>
          </nav>
        </div>

        <div className="px-4 py-6 shrink-0">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 flex items-center justify-between">
            <span>Active Agents</span>
            <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px]">{agents.length}</span>
          </div>
          <nav className="space-y-1">
            {agents.map((agent) => {
              const agentNotifs = notifications.filter(n => n.agentId === agent.id);
              const hasCritical = agentNotifs.some(n => n.type === 'critical');
              const hasWarning = agentNotifs.some(n => n.type === 'warning');
              
              const badgeClass = hasCritical 
                ? 'bg-red-500/20 text-red-500 border border-red-500/20' 
                : hasWarning 
                  ? 'bg-amber-500/20 text-amber-500 border border-amber-500/20' 
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/20';

              return (
                <button
                  key={agent.id}
                  onClick={() => setCurrentView(`agent-${agent.id}`)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${currentView === `agent-${agent.id}` ? 'bg-slate-800 text-blue-400' : 'hover:bg-slate-800/50 hover:text-slate-100'}`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <agent.icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{agent.name}</span>
                  </div>
                  {agentNotifs.length > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${badgeClass}`}>
                      {agentNotifs.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="h-64 border-t border-slate-800 bg-slate-950/50 flex flex-col shrink-0">
        <div className="px-4 py-3 border-b border-slate-800/50 flex items-center justify-between bg-slate-900/50">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Bell className="w-3.5 h-3.5" />
            Live Alerts
          </div>
          {notifications.some(n => n.type === 'critical' || n.type === 'warning') && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {notifications.map((notif) => (
             <div 
                key={notif.id} 
                className={`p-2.5 rounded-lg border transition-colors group cursor-pointer ${
                  notif.type === 'critical' ? 'bg-red-500/5 border-red-500/10 hover:bg-red-500/10' :
                  notif.type === 'warning' ? 'bg-amber-500/5 border-amber-500/10 hover:bg-amber-500/10' :
                  'bg-slate-800/30 border-slate-800/50 hover:bg-slate-800/70'
                }`} 
                onClick={() => setCurrentView(`agent-${notif.agentId}`)}
             >
                <div className="flex items-start gap-2.5">
                  {notif.type === 'critical' ? (
                    <ShieldAlert className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5 animate-pulse" />
                  ) : notif.type === 'warning' ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  ) : (
                    <Bot className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-[11px] font-medium leading-relaxed ${
                      notif.type === 'critical' ? 'text-red-200' : 
                      notif.type === 'warning' ? 'text-amber-200/90' : 'text-slate-300'
                    }`}>{notif.message}</p>
                    <div className="flex justify-between items-center mt-1.5">
                       <span className="text-[10px] text-slate-500">{notif.time}</span>
                       <span className={`text-[9px] uppercase tracking-wider font-bold ${
                         notif.type === 'critical' ? 'text-red-500/70' :
                         notif.type === 'warning' ? 'text-amber-500/70' : 'text-slate-500'
                       }`}>
                         {notif.agentId}
                       </span>
                    </div>
                  </div>
                </div>
             </div>
          ))}
          {notifications.length === 0 && (
            <div className="flex items-center justify-center h-full text-slate-500 text-xs">
              No active alerts.
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-800 shrink-0 bg-slate-900">
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-200">{user?.name || 'Administrator'}</span>
              <span className="text-[10px] text-cyan-500">{user?.role || 'Super Admin'}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center justify-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-red-400 bg-slate-800/50 hover:bg-slate-800 rounded-md transition-colors border border-slate-800 hover:border-red-900/50"
        >
          <LogOut className="w-4 h-4" />
          Disconnect
        </button>
      </div>

      {showLogoutModal && (
        <LogoutModal 
          onConfirm={() => {
            setShowLogoutModal(false);
            logout();
          }} 
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </div>
  );
}
