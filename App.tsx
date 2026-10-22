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
  Skull,
  Radiation,
  Biohazard,
  Siren
} from 'lucide-react';
import { analyzePrompt } from './services/geminiService';
import { AnalysisStatus, PromptAnalysis } from './types';
import { AnalysisCharts } from './components/AnalysisCharts';
import { LoopEngineeringPanel } from './components/LoopEngineeringPanel';

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

  // Dynamic Theme Engine
  const theme = isCrazyMode ? {
    bg: 'bg-[#050505] crazy-bg',
    text: 'text-forge-crazy',
    border: 'border-forge-crazy',
    borderLight: 'border-forge-crazy/30',
    accentBg: 'bg-forge-crazy/10',
    button: 'bg-forge-crazy hover:bg-red-600 shadow-neon-red',
    glow: 'shadow-neon-red',
    icon: 'text-forge-crazy',
    selection: 'selection:bg-forge-crazy selection:text-white',
    card: 'bg-black/80 backdrop-blur-md border-forge-crazy/50',
    header: 'bg-black/90 border-b-2 border-forge-crazy',
    fontHead: 'font-sans',
    fontBody: 'font-mono'
  } : {
    bg: 'bg-slate-950',
    text: 'text-indigo-400',
    border: 'border-indigo-500',
    borderLight: 'border-indigo-500/30',
    accentBg: 'bg-indigo-500/10',
    button: 'bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]',
    glow: 'shadow-[0_0_15px_rgba(99,102,241,0.3)]',
    icon: 'text-indigo-400',
    selection: 'selection:bg-indigo-500 selection:text-white',
    card: 'bg-slate-900 border-slate-700',
    header: 'bg-slate-900/80 backdrop-blur-md border-b border-slate-700',
    fontHead: 'font-sans',
    fontBody: 'font-sans'
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.selection} transition-colors duration-500`}>
      {isCrazyMode && <div className="scanlines"></div>}
      
      {/* Header */}
      <header className={`${theme.header} sticky top-0 z-50 transition-all duration-500`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded border ${isCrazyMode ? 'border-forge-crazy animate-pulse-fast bg-red-950' : 'border-indigo-500 bg-indigo-950'}`}>
              {isCrazyMode ? <Radiation className={`w-8 h-8 ${theme.icon} animate-spin-slow`} /> : <Zap className={`w-8 h-8 ${theme.icon}`} />}
            </div>
            <div>
              <h1 className={`text-2xl font-black tracking-widest ${isCrazyMode ? 'text-white drop-shadow-[2px_2px_0_#ff003c]' : 'text-white'}`}>
                PROMPTFORGE<span className={isCrazyMode ? 'text-forge-crazy' : 'text-indigo-500'}>-X</span>
              </h1>
              <p className={`text-xs uppercase tracking-[0.3em] ${isCrazyMode ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
                {isCrazyMode ? '⚠️ UNRESTRICTED MODE ⚠️' : 'Analysis Engine'}
              </p>
            </div>
          </div>
          
          {/* Industrial Toggle Switch */}
          <div className="flex items-center space-x-4">
             <span className={`text-[10px] font-bold uppercase tracking-widest ${isCrazyMode ? 'text-red-500 animate-glitch' : 'text-slate-500'}`}>
              {isCrazyMode ? 'SYSTEM: UNSTABLE' : 'SYSTEM: STABLE'}
            </span>
            <button 
              onClick={() => setIsCrazyMode(!isCrazyMode)}
              className={`relative w-20 h-10 border-2 transition-all duration-300 ${
                isCrazyMode 
                  ? 'bg-black border-forge-crazy shadow-neon-red' 
                  : 'bg-slate-800 border-slate-600'
              }`}
            >
               {/* Toggle Background Pattern */}
               <div className={`absolute inset-0 opacity-20 ${isCrazyMode ? 'bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,#ff003c_5px,#ff003c_10px)]' : ''}`}></div>

               {/* Toggle Knob */}
              <div 
                className={`absolute top-1 left-1 w-7 h-7 bg-white shadow-lg transition-transform duration-300 flex items-center justify-center ${
                  isCrazyMode 
                    ? 'translate-x-10 bg-forge-crazy text-black' 
                    : 'bg-slate-400 text-slate-800'
                }`} 
              >
                {isCrazyMode ? <Skull size={14} /> : <div className="w-2 h-4 bg-slate-500 rounded-full"></div>}
              </div>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        
        {/* Input Section */}
        <section className="mb-12">
          <div className={`relative group transition-all duration-500`}>
            {/* Glowing Backdrop */}
            <div className={`absolute -inset-0.5 rounded-lg opacity-30 group-hover:opacity-70 transition duration-500 blur-md ${isCrazyMode ? 'bg-forge-crazy' : 'bg-indigo-500'}`}></div>
            
            <div className={`relative ${theme.card} rounded-lg p-1`}>
              <div className="flex items-center px-4 py-2 border-b border-gray-800 space-x-2 bg-black/40">
                <Terminal className={`w-4 h-4 ${theme.text}`} />
                <span className="text-xs text-slate-500 font-mono">INPUT_STREAM</span>
              </div>
              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder={isCrazyMode ? "ENTER PROMPT FOR DESTRUCTION..." : "Enter your prompt here for analysis..."}
                className={`w-full bg-transparent text-slate-200 p-6 focus:outline-none min-h-[160px] resize-y placeholder-slate-600 font-mono text-sm leading-relaxed`}
              />
              <div className="flex justify-between items-center px-4 py-3 border-t border-gray-800/50">
                <button 
                  onClick={() => setPromptInput(SAMPLE_PROMPT)}
                  className="text-xs text-slate-500 hover:text-white transition-colors flex items-center space-x-2 px-3 py-1 rounded hover:bg-white/5"
                >
                  <Terminal className="w-3 h-3" />
                  <span>LOAD_SAMPLE_DATA</span>
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={status === AnalysisStatus.ANALYZING || !promptInput}
                  className={`px-8 py-3 font-black text-white text-sm tracking-wider uppercase transition-all duration-100 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 clip-path-slant ${theme.button}`}
                  style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
                >
                  {status === AnalysisStatus.ANALYZING ? (
                    <>
                      <RefreshCcw className="w-4 h-4 animate-spin" />
                      <span>PROCESSING...</span>
                    </>
                  ) : (
                    <>
                      {isCrazyMode ? <Biohazard className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
                      <span>{isCrazyMode ? 'INITIATE AUTOPSY' : 'ANALYZE PROMPT'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {status === AnalysisStatus.ERROR && (
          <div className="p-4 bg-red-950/50 border border-red-500 text-red-500 font-mono flex items-center space-x-3 mb-8 animate-pulse">
            <AlertTriangle className="w-6 h-6" />
            <span className="text-lg">CRITICAL ERROR: SYSTEM FAILURE. CHECK API KEY.</span>
          </div>
        )}

        {result && status === AnalysisStatus.COMPLETE && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Top Row: Autopsy & Classification */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Autopsy Card */}
              <div className={`lg:col-span-1 ${theme.card} rounded-none border-l-4 ${theme.border} p-6 relative overflow-hidden`}>
                <div className="absolute top-0 right-0 p-2 opacity-20">
                  <Skull size={100} className={theme.text} />
                </div>
                <h2 className={`text-xl font-bold ${theme.text} mb-6 flex items-center font-sans tracking-tight`}>
                  <Siren className={`w-6 h-6 mr-3 ${isCrazyMode ? 'animate-pulse' : ''}`} />
                  FORENSIC REPORT
                </h2>
                <ul className="space-y-4 relative z-10">
                  {result.autopsy.issues.map((issue, idx) => (
                    <li key={idx} className="flex items-start text-slate-300 font-mono text-xs leading-5">
                      <span className={`mr-3 mt-0.5 text-lg ${isCrazyMode ? 'text-red-500' : 'text-indigo-400'}`}>›</span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Classification & Verdict Card */}
              <div className={`lg:col-span-2 ${theme.card} p-1 border ${theme.border} ${isCrazyMode ? 'rounded-none' : 'rounded-xl'}`}>
                <div className="bg-black/40 p-6 h-full flex flex-col justify-between">
                  <div>
                    <h2 className={`text-xl font-bold ${theme.text} mb-4 flex items-center font-sans`}>
                      <Activity className={`w-6 h-6 mr-3`} />
                      CLASSIFICATION MATRIX
                    </h2>
                    <div className="flex flex-wrap gap-3 mb-8">
                      <Badge label={result.classification.granularity} color={isCrazyMode ? "border-neonBlue text-neonBlue" : "border-blue-500 text-blue-400"} />
                      <Badge label={result.classification.functionType} color={isCrazyMode ? "border-purple-500 text-purple-400" : "border-purple-500 text-purple-400"} />
                      <Badge label={result.classification.riskLevel} color={isCrazyMode ? "border-yellow-500 text-yellow-400" : "border-yellow-500 text-yellow-400"} />
                      {result.frameworkScores.chainOfThought && (
                         <Badge label="CoT: READY" color={isCrazyMode ? "border-acidGreen text-acidGreen" : "border-green-500 text-green-400"} />
                      )}
                    </div>
                  </div>
                  
                  <div className={`relative p-6 border-t ${theme.borderLight}`}>
                    {isCrazyMode && <div className="absolute -top-3 right-4 bg-black px-2 text-xs text-red-500 border border-red-500 font-mono">FINAL JUDGMENT</div>}
                    
                    <div className="flex items-center space-x-6">
                       <div className={`text-6xl ${isCrazyMode ? 'animate-bounce' : ''}`}>
                          {result.scorecard.verdict.toLowerCase().includes('fail') || result.scorecard.clarity < 5 ? '💀' : '💎'}
                       </div>
                       <div className="flex-1">
                          <h4 className={`text-2xl font-black uppercase italic mb-2 ${isCrazyMode ? 'text-white' : 'text-slate-200'}`}>
                            {result.scorecard.verdict}
                          </h4>
                          <div className={`flex items-start space-x-2 mt-2 text-sm font-mono ${isCrazyMode ? 'text-orange-400' : 'text-orange-300'}`}>
                             <Flame className="w-4 h-4 flex-shrink-0 mt-0.5" />
                             <span>UPGRADE: {result.scorecard.upgradeTip}</span>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Analytics */}
            <AnalysisCharts data={result.frameworkScores} scorecard={result.scorecard} isCrazyMode={isCrazyMode} />

            {/* Reconstruction Engine */}
            <div className={`${theme.card} border ${theme.border} overflow-hidden ${isCrazyMode ? 'rounded-none' : 'rounded-xl'}`}>
              <div className="p-4 bg-black/60 border-b border-gray-800 flex justify-between items-center">
                <h2 className={`text-lg font-bold ${theme.text} flex items-center font-sans tracking-wider`}>
                  <Layers className={`w-5 h-5 mr-3`} />
                  RECONSTRUCTION ENGINE
                </h2>
              </div>
              
              <div className="flex overflow-x-auto border-b border-gray-800 bg-black/40">
                {result.rewrites.map((rewrite, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveRewriteTab(idx)}
                    className={`px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all ${
                      activeRewriteTab === idx 
                        ? `${isCrazyMode ? 'bg-forge-crazy text-black' : 'bg-indigo-600 text-white'}` 
                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    {rewrite.style}
                  </button>
                ))}
              </div>

              <div className="p-0 bg-black relative min-h-[250px]">
                {/* Background Grid for Code Area */}
                <div className="absolute inset-0 opacity-10" 
                     style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                <div className="relative p-8">
                  <button 
                     onClick={() => {
                        navigator.clipboard.writeText(result.rewrites[activeRewriteTab].content);
                     }}
                     className={`absolute top-4 right-4 p-2 border ${theme.borderLight} hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors text-xs flex items-center z-20`}
                  >
                    <CheckCircle className="w-3 h-3 mr-1" /> COPY_BUFFER
                  </button>
                  <pre className={`whitespace-pre-wrap font-mono text-sm leading-relaxed p-6 border-l-2 ${theme.border} bg-black/50 text-slate-300 shadow-inner`}>
                    {result.rewrites[activeRewriteTab].content}
                  </pre>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Bounded prompt-improvement loop; existing analyzer remains unchanged. */}
        <LoopEngineeringPanel />
      </main>
    </div>
  );
};

const Badge: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider border ${color} bg-black/30 backdrop-blur-sm`}>
    {label}
  </span>
);

export default App;