import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bot, Terminal, Activity, Shield, Zap, ExternalLink } from 'lucide-react';

export default function App() {
  const [botStatus, setBotStatus] = useState<'checking' | 'active' | 'inactive'>('checking');

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setBotStatus(data.bot === 'active' ? 'active' : 'inactive'))
      .catch(() => setBotStatus('inactive'));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      <div className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <Bot className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Flux 1.1 Pro Bot</h1>
              <p className="text-xs text-slate-500 font-mono">POWERED BY TECH MASTER</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`flex h-2 w-2 rounded-full ${botStatus === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
            <span className="text-sm font-mono text-slate-400 uppercase">{botStatus === 'active' ? 'System Online' : 'System Offline'}</span>
          </div>
        </header>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
              Professional AI <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Image Generation</span>
            </h2>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              A high-performance Telegram bot integrated with Flux 1.1 Pro Ultra API. 
              Designed for speed, quality, and professional community management.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://t.me/tech_master_a2z" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Join Channel
              </a>
              <a 
                href="https://t.me/tech_chatx" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors border border-slate-700"
              >
                Support Group
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-20"></div>
            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-4">
                <Terminal className="w-5 h-5 text-slate-500" />
                <span className="text-sm font-mono text-slate-400">Bot Console</span>
              </div>
              <div className="space-y-3 font-mono text-sm">
                <div className="flex gap-3">
                  <span className="text-emerald-500">➜</span>
                  <span className="text-slate-300">Initializing Flux 1.1 Pro Engine...</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-emerald-500">➜</span>
                  <span className="text-slate-300">Connecting to Telegram API...</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-emerald-500">➜</span>
                  <span className="text-slate-300">Loading Admin Modules (ID: 6973940391)...</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-emerald-500">➜</span>
                  <span className="text-slate-300">Status: <span className="text-emerald-400">Ready</span></span>
                </div>
                <div className="mt-4 p-3 bg-slate-950 rounded border border-slate-800 text-slate-400">
                  <span className="text-indigo-400">user@telegram:~$</span> /start<br/>
                  <span className="text-indigo-400">bot:</span> Welcome! Please join our channels to continue.
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-indigo-500/30 transition-colors">
            <Zap className="w-10 h-10 text-amber-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Flux 1.1 Pro</h3>
            <p className="text-slate-400 text-sm">Integrated with the latest Flux generation engine for ultra-realistic image synthesis.</p>
          </div>
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-indigo-500/30 transition-colors">
            <Shield className="w-10 h-10 text-emerald-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Admin Security</h3>
            <p className="text-slate-400 text-sm">Protected admin panel with ID verification. Only authorized users can access control features.</p>
          </div>
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-indigo-500/30 transition-colors">
            <Activity className="w-10 h-10 text-cyan-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">High Performance</h3>
            <p className="text-slate-400 text-sm">Built on Node.js & TypeScript for maximum speed and reliability.</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          <p>&copy; 2025 Tech Master. All rights reserved.</p>
        </footer>

      </div>
    </div>
  );
}
