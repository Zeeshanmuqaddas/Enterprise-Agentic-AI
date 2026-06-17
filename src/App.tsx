import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { AgentDetails } from './components/AgentDetails';
import { WorkflowSimulation } from './components/WorkflowSimulation';
import { NexusOpsControl } from './components/NexusOpsControl';
import { agents } from './data/agents';
import { useAuth, AuthProvider } from './context/AuthContext';
import { Login } from './components/auth/Login';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderContent = () => {
    if (currentView === 'dashboard') return <Dashboard agents={agents} onAgentClick={setCurrentView} />;
    if (currentView === 'simulation') return <WorkflowSimulation />;
    if (currentView === 'nexus-ops') return <NexusOpsControl />;

    if (currentView.startsWith('agent-')) {
      const agentId = currentView.replace('agent-', '');
      const agent = agents.find(a => a.id === agentId);
      if (agent) {
        return <AgentDetails agent={agent} />;
      }
    }

    return <Dashboard agents={agents} onAgentClick={setCurrentView} />;
  };

  const getTitle = () => {
    if (currentView === 'dashboard') return 'Global Pipeline & System Status';
    if (currentView === 'simulation') return 'Execution Flow Simulation';
    if (currentView === 'nexus-ops') return 'NEXUS-OPS Control';
    if (currentView.startsWith('agent-')) {
      const agentId = currentView.replace('agent-', '');
      const agent = agents.find(a => a.id === agentId);
      return agent ? `${agent.name} Console` : 'Agent Console';
    }
    return 'Enterprise Orchestrator';
  };

  return (
    <div className="flex bg-slate-950 text-slate-300 min-h-screen font-sans selection:bg-blue-500/30">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} agents={agents} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header title={getTitle()} />
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
