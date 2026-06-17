import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Shield, Lock, Mail, Server, Cpu, Key, ArrowRight, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';

type AuthMode = 'login' | 'forgot_password' | 'reset_password';

export function Login() {
  const { login } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Reset Password State
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Common State
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide valid credentials.');
      return;
    }

    setLoading(true);
    resetMessages();

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed. Access denied.');
      }

      await new Promise(resolve => setTimeout(resolve, 800));
      login(data.token, data.user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Enterprise Email is required for recovery route.');
      return;
    }
    
    setLoading(true);
    resetMessages();
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate recovery protocol.');
      }

      setSuccessMessage(data.message);
      // For the sake of the prototype, if a token is returned, pre-fill it and move to reset
      if (data.mockToken) {
        setResetToken(data.mockToken);
      }
      
      // Simulate waiting for user to check email then route to reset form
      setTimeout(() => {
        setAuthMode('reset_password');
        resetMessages();
      }, 3000);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetToken || !newPassword || !confirmPassword) {
      setError('All cryptographic fields are required.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Security keys do not match.');
      return;
    }
    
    setLoading(true);
    resetMessages();
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, newPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update credentials.');
      }

      setSuccessMessage('Authentication credentials updated successfully. Routing to secure login...');
      
      setTimeout(() => {
        setAuthMode('login');
        setPassword('');
        resetMessages();
      }, 3000);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background Cyberpunk Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-900/20 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[150px] mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-slate-900/80 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.15)] mb-6 backdrop-blur-xl relative group">
            <div className="absolute inset-0 bg-cyan-400/20 rounded-2xl blur-xl group-hover:bg-cyan-400/30 transition-all"></div>
            <Server className="w-8 h-8 text-cyan-400 relative z-10" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Enterprise Agentic AI</h1>
          <p className="text-cyan-400/70 text-sm tracking-widest uppercase font-semibold">Secure Access to Autonomous Intelligence</p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden relative transition-all duration-300">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          
          <div className="p-8">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-slate-400" />
                <h2 className="text-lg font-medium text-slate-200">
                  {authMode === 'login' && "System Authentication"}
                  {authMode === 'forgot_password' && "Identity Recovery"}
                  {authMode === 'reset_password' && "Key Reconfiguration"}
                </h2>
              </div>
              {authMode !== 'login' && (
                <button 
                  onClick={() => { setAuthMode('login'); resetMessages(); }}
                  className="p-2 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800/50 transition-all"
                  title="Return to Authentication"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
            </div>

            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm flex items-start gap-3">
                <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg text-sm flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{successMessage}</p>
              </div>
            )}

            {/* LOGIN FORM */}
            {authMode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Enterprise Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono text-sm"
                      placeholder="admin@enterprise.ai"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Security Key</label>
                    <button 
                      type="button" 
                      onClick={() => { setAuthMode('forgot_password'); resetMessages(); }}
                      className="text-xs text-cyan-500/70 hover:text-cyan-400 transition-colors"
                    >
                      Forgot validation?
                    </button>
                  </div>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-lg pl-10 pr-12 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono text-sm"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500/20 focus:ring-offset-0 transition-all" />
                    <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Retain Session</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-3 rounded-lg mt-6 flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(8,145,178,0.2)] hover:shadow-[0_0_25px_rgba(8,145,178,0.4)] border border-cyan-400/20 disabled:opacity-70 disabled:pointer-events-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Authenticating Node...
                    </>
                  ) : (
                    <>
                      Establish Secure Uplink <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* FORGOT PASSWORD FORM */}
            {authMode === 'forgot_password' && (
              <form onSubmit={handleForgotPassword} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  Enter your assigned enterprise identity. A secure cryptographic token will be dispatched to your registered communication channel to initiate key reconfiguration.
                </p>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Enterprise Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono text-sm"
                      placeholder="admin@enterprise.ai"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || successMessage !== null}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-3 rounded-lg mt-6 flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(8,145,178,0.2)] hover:shadow-[0_0_25px_rgba(8,145,178,0.4)] border border-cyan-400/20 disabled:opacity-70 disabled:pointer-events-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Transmitting...
                    </>
                  ) : (
                    <>
                      Dispatch Recovery Token
                    </>
                  )}
                </button>
              </form>
            )}

            {/* RESET PASSWORD FORM */}
            {authMode === 'reset_password' && (
              <form onSubmit={handleResetPassword} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  Provide the valid cryptographic token from your communication channel and confirm your new security key.
                </p>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Cryptographic Token</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="text"
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-cyan-400 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono text-sm"
                      placeholder="nexus_reset_token_..."
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">New Security Key</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-lg pl-10 pr-12 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono text-sm"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Confirm New Security Key</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-lg pl-10 pr-12 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono text-sm"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-3 rounded-lg mt-6 flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(8,145,178,0.2)] hover:shadow-[0_0_25px_rgba(8,145,178,0.4)] border border-cyan-400/20 disabled:opacity-70 disabled:pointer-events-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Reconfiguring...
                    </>
                  ) : (
                    <>
                      Confirm Key Reconfiguration
                    </>
                  )}
                </button>
              </form>
            )}

          </div>
          
          <div className="bg-slate-950/80 p-6 border-t border-slate-800/80">
            <p className="text-xs text-center font-medium text-slate-500 uppercase tracking-widest mb-4">Enterprise Identity Providers</p>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors text-sm font-medium text-slate-300">
                <Cpu className="w-4 h-4" /> SSO / SAML
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors text-sm font-medium text-slate-300">
                <Lock className="w-4 h-4" /> Hardware Key
              </button>
            </div>
            
            <div className="mt-6 flex justify-center items-center gap-2 text-[10px] text-slate-600 uppercase tracking-wider font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span>
              SOC2 COMPLIANT • END-TO-END ENCRYPTED
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
