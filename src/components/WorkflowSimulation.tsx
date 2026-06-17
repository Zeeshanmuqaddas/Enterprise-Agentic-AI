import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { agents } from '../data/agents';

const executionSteps = [
  { agentId: 'orchestrator', action: 'Receive Request & Task Decomposition' },
  { agentId: 'knowledge', action: 'Information Retrieval & Context Build' },
  { agentId: 'reasoning', action: 'Adaptive Reasoning Pipeline' },
  { agentId: 'security', action: 'Security & Compliance Validation' },
  { agentId: 'collaboration', action: 'Multi-LLM Routing & Consensus' },
  { agentId: 'ethics', action: 'Ethics & Safety Filtering' },
  { agentId: 'optimization', action: 'Response Optimization' },
];

export function WorkflowSimulation() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && currentStep < executionSteps.length) {
      timer = setTimeout(() => {
        setCompletedSteps(prev => [...prev, currentStep]);
        setCurrentStep(prev => prev + 1);
      }, 1500);
    } else if (currentStep >= executionSteps.length) {
      setIsRunning(false);
    }
    return () => clearTimeout(timer);
  }, [isRunning, currentStep]);

  const handleStart = () => {
    setCompletedSteps([]);
    setCurrentStep(0);
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStep(-1);
    setCompletedSteps([]);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Global Execution Pipeline</h2>
          <p className="text-sm text-slate-500">Simulate a standard request flowing through the agent ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleReset}
            disabled={isRunning || currentStep === -1}
            className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 rounded-md hover:bg-slate-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button 
            onClick={handleStart}
            disabled={isRunning || currentStep >= executionSteps.length}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <Play className="w-4 h-4" /> {isRunning ? 'Running...' : 'Execute Simulation'}
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 relative">
        <div className="absolute left-12 top-12 bottom-12 w-0.5 bg-slate-800"></div>
        
        <div className="space-y-8 relative z-10">
          {executionSteps.map((step, index) => {
            const agent = agents.find(a => a.id === step.agentId);
            const isCompleted = completedSteps.includes(index);
            const isActive = currentStep === index;
            const isPending = !isCompleted && !isActive;

            return (
              <div key={index} className={`flex items-start gap-8 transition-opacity duration-500 ${isPending ? 'opacity-40' : 'opacity-100'}`}>
                <div className="mt-1 relative flex items-center justify-center shrink-0 w-8 h-8 bg-slate-900">
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  ) : isActive ? (
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Circle className="w-5 h-5 text-slate-700" />
                  )}
                </div>
                
                <div className={`flex-1 border rounded-xl p-5 transition-all duration-300 ${isActive ? 'bg-blue-900/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : isCompleted ? 'bg-slate-800/30 border-slate-700/50' : 'bg-slate-900/50 border-slate-800'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    {agent && <agent.icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />}
                    <h3 className={`font-medium ${isActive ? 'text-blue-100' : 'text-slate-300'}`}>{agent?.name}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <ArrowRight className="w-4 h-4 text-slate-600" />
                    <span>{step.action}</span>
                  </div>
                  
                  {isActive && (
                    <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 animate-[pulse_1s_ease-in-out_infinite] w-full"></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
