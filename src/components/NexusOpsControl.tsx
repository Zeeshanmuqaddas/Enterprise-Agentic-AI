import React, { useState, useEffect } from 'react';
import { Terminal, Send, Loader2, AlertCircle, Settings, Save, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export function NexusOpsControl() {
  const [activeTab, setActiveTab] = useState<'terminal' | 'config'>('terminal');
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [systemPrompt, setSystemPrompt] = useState('');
  const [savingConfig, setSavingConfig] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/system-prompt')
      .then(res => res.json())
      .then(data => {
        if (data.prompt) {
          setSystemPrompt(data.prompt);
        }
      })
      .catch(console.error);
  }, []);

  const handleSaveConfig = async () => {
    setSavingConfig(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/system-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: systemPrompt }),
      });
      if (!res.ok) throw new Error('Failed to save configuration');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingConfig(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/orchestrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || 'Failed to process request');
      }

      setResponse(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 h-full flex flex-col">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 mb-2 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-blue-400" />
            NEXUS-OPS Operations
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl">
            Direct access to the central Orchestration Agent and system configuration.
          </p>
        </div>
        
        <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'terminal' ? 'bg-slate-800 text-slate-200 shadow-sm' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Terminal className="w-4 h-4" />
            Terminal
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'config' ? 'bg-slate-800 text-slate-200 shadow-sm' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Settings className="w-4 h-4" />
            Configuration
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-slate-950 border border-slate-800 rounded-xl flex flex-col overflow-hidden relative shadow-inner">
        {activeTab === 'terminal' ? (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {(!response && !loading && !error) && (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 opacity-50 space-y-4">
                  <Terminal className="w-16 h-16 mb-2" />
                  <p>System Online. Awaiting command input...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">System Fault Detected</h4>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex items-center gap-3 text-blue-400 animate-pulse bg-blue-900/10 border border-blue-500/20 p-4 rounded-lg">
                  <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                  <span className="text-sm font-medium tracking-wide">[NEXUS-OPS] Routing request to execution agents... Initializing workflow...</span>
                </div>
              )}

              {response && (
                <div className="bg-slate-900 border border-slate-700/50 rounded-lg p-6 font-sans text-slate-300">
                  <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    <h4 className="text-sm font-bold text-slate-200 tracking-wider">RESPONSE PAYLOAD</h4>
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-headings:text-slate-100 prose-a:text-blue-400 prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800 markdown-body">
                    <ReactMarkdown>{response}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800">
              <form onSubmit={handleSubmit} className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., Conduct a security audit on the user authentication microservice..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-4 pr-12 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-600 font-mono shadow-inner transition-all"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-400 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-200">Master System Prompt</h3>
              <button
                onClick={handleSaveConfig}
                disabled={savingConfig}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
              >
                {savingConfig ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Configuration
              </button>
            </div>
            
            {saveSuccess && (
              <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-md flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                System prompt updated successfully. New instructions will apply to subsequent orchestration requests.
              </div>
            )}
            
            <p className="text-sm text-slate-400 mb-4">
              Edit the enterprise instructions that govern the Orchestrator / CEO Agent's behavior, decision-making constraints, and overall workflow logic.
            </p>
            
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="flex-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm text-slate-300 font-mono leading-relaxed focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none shadow-inner"
              placeholder="Enter master system prompt here..."
            />
          </div>
        )}
      </div>
    </div>
  );
}
