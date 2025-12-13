import React, { useState } from 'react';
import { 
  Zap, 
  Flame, 
  AlertTriangle, 
  CheckCircle, 
  Terminal, 
  Activity, 
  Layers, 
  RefreshCcw,
  Cpu,
  Skull
} from 'lucide-react';
import { analyzePrompt } from './services/geminiService';
import { AnalysisStatus, PromptAnalysis } from './types';
import { AnalysisCharts } from './components/AnalysisCharts';

const SAMPLE_PROMPT = "Write something about AI";

const App: React.FC = () => {
  const [promptInput, setPromptInput] = useState<string>('');
  const [isCrazyMode, setIsCrazyMode] = useState<boolean>(false);
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<PromptAnalysis | null>(null);
  const [activeRewriteTab, setActiveRewriteTab] = useState<number>(0);

  const handleAnalyze = async () => {
    if (!promptInput.trim()) return;
    setStatus(AnalysisStatus.ANALYZING);
    try {
      const data = await analyzePrompt(promptInput, isCrazyMode);
      setResult(data);
      setStatus(AnalysisStatus.COMPLETE);
    } catch (error) {
      console.error(error);
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const primaryColorClass = isCrazyMode ? 'text-red-500' : 'text-indigo-500';
  const primaryBgClass = isCrazyMode ? 'bg-red-500' : 'bg-indigo-500';
  const primaryBorderClass = isCrazyMode ? 'border-red-500' : 'border-indigo-500';
  const glowClass = isCrazyMode ? 'shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'shadow-[0_0_20px_rgba(99,102,241,0.5)]';

  return (
    <div className={`min-h-screen font-sans selection:bg-opacity-30 ${isCrazyMode ? 'selection:bg-red-500' : 'selection:bg-indigo-500'}`}>
      
      {/* Header */}
      <header className="border-b border-forge-700 bg-forge-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isCrazyMode ? 'bg-red-500/10' : 'bg-indigo-500/10'}`}>
              <Zap className={`w-6 h-6 ${primaryColorClass}`} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">PROMPTFORGE-X</h1>
              <p className="text-xs text-slate-400">Extreme Analysis Engine</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={`text-xs font-bold tracking-widest ${isCrazyMode ? 'text-red-400' : 'text-slate-500'}`}>
              {isCrazyMode ? 'CRAZY MODE' : 'SAFE MODE'}
            </span>
            <button 
              onClick={() => setIsCrazyMode(!isCrazyMode)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${isCrazyMode ? 'bg-red-900/50' : 'bg-slate-700'}`}
            >
              <div 
                className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform duration-300 ${isCrazyMode ? 'translate-x-6 bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-slate-400'}`} 
              />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Input Section */}
        <section className="mb-12">
          <div className="relative group">
            <div className={`absolute -inset-1 rounded-xl opacity-25 group-hover:opacity-50 transition duration-500 blur ${primaryBgClass}`}></div>
            <div className="relative bg-forge-800 rounded-xl p-1">
              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Enter your prompt here for brutal analysis..."
                className="w-full bg-forge-900 text-slate-200 p-6 rounded-lg focus:outline-none min-h-[160px] resize-y placeholder-slate-600 font-mono text-sm leading-relaxed"
              />
              <div className="flex justify-between items-center px-4 py-3 bg-forge-800 rounded-b-lg border-t border-forge-700">
                <button 
                  onClick={() => setPromptInput(SAMPLE_PROMPT)}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center space-x-1"
                >
                  <Terminal className="w-3 h-3" />
                  <span>Use Sample</span>
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={status === AnalysisStatus.ANALYZING || !promptInput}
                  className={`px-6 py-2 rounded-lg font-bold text-white text-sm transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${primaryBgClass} ${status !== AnalysisStatus.ANALYZING ? 'hover:scale-105 ' + glowClass : ''}`}
                >
                  {status === AnalysisStatus.ANALYZING ? (
                    <>
                      <RefreshCcw className="w-4 h-4 animate-spin" />
                      <span>Forging...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Analyze</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {status === AnalysisStatus.ERROR && (
          <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 flex items-center space-x-3 mb-8">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span>Analysis failed. Please try again or check your API Key.</span>
          </div>
        )}

        {result && status === AnalysisStatus.COMPLETE && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Top Row: Autopsy & Classification */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Autopsy Card */}
              <div className="lg:col-span-1 bg-forge-800 rounded-xl p-6 border border-forge-700 relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${primaryBgClass}`}></div>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Skull className={`w-5 h-5 mr-2 ${isCrazyMode ? 'text-red-500' : 'text-slate-400'}`} />
                  Prompt Autopsy
                </h2>
                <ul className="space-y-3">
                  {result.autopsy.issues.map((issue, idx) => (
                    <li key={idx} className="flex items-start text-slate-300 text-sm">
                      <span className="text-red-500 mr-2 mt-1">✕</span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Classification & Verdict Card */}
              <div className="lg:col-span-2 bg-forge-800 rounded-xl p-6 border border-forge-700 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                    <Activity className={`w-5 h-5 mr-2 ${primaryColorClass}`} />
                    Classification
                  </h2>
                  <div className="flex flex-wrap gap-3 mb-6">
                    <Badge label={result.classification.granularity} color="bg-blue-500/20 text-blue-300 border-blue-500/30" />
                    <Badge label={result.classification.functionType} color="bg-purple-500/20 text-purple-300 border-purple-500/30" />
                    <Badge label={result.classification.riskLevel} color="bg-yellow-500/20 text-yellow-300 border-yellow-500/30" />
                    {result.frameworkScores.chainOfThought && (
                      <Badge label="Chain-of-Thought Ready" color="bg-green-500/20 text-green-300 border-green-500/30" />
                    )}
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg border ${isCrazyMode ? 'bg-red-950/30 border-red-900/50' : 'bg-indigo-950/30 border-indigo-900/50'}`}>
                  <div className="flex items-start space-x-3 mb-2">
                    <span className="text-2xl">
                       {result.scorecard.verdict.includes('fail') || result.scorecard.clarity < 5 ? '👎' : '👍'}
                    </span>
                    <div>
                      <h4 className={`font-bold ${isCrazyMode ? 'text-red-300' : 'text-indigo-300'}`}>Verdict</h4>
                      <p className="text-slate-300 text-sm italic">"{result.scorecard.verdict}"</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 mt-4 pt-4 border-t border-white/5">
                    <Flame className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-orange-300 text-xs uppercase tracking-wide">Pro Tip</h4>
                      <p className="text-slate-300 text-sm">{result.scorecard.upgradeTip}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Analytics */}
            <AnalysisCharts data={result.frameworkScores} scorecard={result.scorecard} isCrazyMode={isCrazyMode} />

            {/* Reconstruction Engine */}
            <div className="bg-forge-800 rounded-xl border border-forge-700 overflow-hidden">
              <div className="p-6 border-b border-forge-700 flex justify-between items-center">
                <h2 className="text-lg font-bold text-white flex items-center">
                  <Layers className={`w-5 h-5 mr-2 ${primaryColorClass}`} />
                  Reconstruction Engine
                </h2>
              </div>
              
              <div className="flex overflow-x-auto border-b border-forge-700 bg-forge-900/50">
                {result.rewrites.map((rewrite, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveRewriteTab(idx)}
                    className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                      activeRewriteTab === idx 
                        ? `${primaryBorderClass} ${isCrazyMode ? 'text-red-400' : 'text-indigo-400'} bg-forge-800` 
                        : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-forge-800/50'
                    }`}
                  >
                    {rewrite.style}
                  </button>
                ))}
              </div>

              <div className="p-6 bg-forge-800 min-h-[200px]">
                <div className="relative">
                  <button 
                     onClick={() => {
                        navigator.clipboard.writeText(result.rewrites[activeRewriteTab].content);
                     }}
                     className="absolute top-2 right-2 p-2 bg-forge-700 hover:bg-forge-600 rounded text-slate-400 hover:text-white transition-colors text-xs flex items-center"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" /> Copy
                  </button>
                  <pre className="whitespace-pre-wrap font-mono text-sm text-slate-300 leading-relaxed bg-forge-900/50 p-6 rounded-lg border border-forge-700/50">
                    {result.rewrites[activeRewriteTab].content}
                  </pre>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

const Badge: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${color}`}>
    {label}
  </span>
);

export default App;