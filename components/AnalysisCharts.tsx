import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { PromptAnalysis } from '../types';

interface AnalysisChartsProps {
  data: PromptAnalysis['frameworkScores'];
  scorecard: PromptAnalysis['scorecard'];
  isCrazyMode: boolean;
}

export const FrameworkRadar: React.FC<{ data: any[], strokeColor: string, fillColor: string }> = ({ data, strokeColor, fillColor }) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#334155" strokeDasharray="3 3" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'Orbitron' }} />
          <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
          <Radar
            name="Score"
            dataKey="A"
            stroke={strokeColor}
            strokeWidth={2}
            fill={fillColor}
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ScoreBarChart: React.FC<{ data: any[], color: string }> = ({ data, color }) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <XAxis type="number" domain={[0, 10]} hide />
          <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'Orbitron' }} />
          <Tooltip 
            cursor={{fill: 'rgba(255,255,255,0.05)'}}
            contentStyle={{ backgroundColor: '#000', borderColor: color, color: '#fff', fontFamily: 'JetBrains Mono' }}
          />
          <Bar dataKey="value" radius={[0, 2, 2, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const AnalysisCharts: React.FC<AnalysisChartsProps> = ({ data, scorecard, isCrazyMode }) => {
  // Safe Mode: Indigo / Crazy Mode: Neon Red & Cyan
  const strokeColor = isCrazyMode ? '#ff003c' : '#6366f1';
  const fillColor = isCrazyMode ? '#ff003c' : '#6366f1';
  const barColor = isCrazyMode ? '#00f0ff' : '#6366f1';
  const borderColor = isCrazyMode ? 'border-forge-crazy' : 'border-slate-700';
  const bgColor = isCrazyMode ? 'bg-black/60' : 'bg-slate-900';

  const frameworkData = [
    { subject: 'CLEAR', A: data.clear, fullMark: 10 },
    { subject: 'CRISP', A: data.crisp, fullMark: 10 },
    { subject: 'CO-STAR', A: data.costar, fullMark: 10 },
    { subject: 'RTF', A: data.rtf, fullMark: 10 },
    { subject: 'ReAct', A: data.reactCompatibility, fullMark: 10 },
  ];

  const scorecardData = [
    { name: 'Clarity', value: scorecard.clarity },
    { name: 'Control', value: scorecard.control },
    { name: 'Expandability', value: scorecard.expandability },
    { name: 'Friendliness', value: scorecard.modelFriendliness },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <div className={`p-4 ${isCrazyMode ? 'rounded-none border-2' : 'rounded-xl border'} ${borderColor} ${bgColor} relative`}>
        {isCrazyMode && (
          <div className="absolute top-0 left-0 bg-forge-crazy text-black text-[10px] font-bold px-2 py-0.5 font-mono">
            FRAMEWORK_RADAR
          </div>
        )}
        <h3 className={`text-xs uppercase tracking-widest text-slate-500 mb-6 font-bold text-center mt-2 ${!isCrazyMode ? 'font-sans' : 'font-mono'}`}>
          Framework Analysis
        </h3>
        <FrameworkRadar data={frameworkData} strokeColor={strokeColor} fillColor={fillColor} />
      </div>
      <div className={`p-4 ${isCrazyMode ? 'rounded-none border-2' : 'rounded-xl border'} ${borderColor} ${bgColor} relative`}>
         {isCrazyMode && (
          <div className="absolute top-0 left-0 bg-forge-neonBlue text-black text-[10px] font-bold px-2 py-0.5 font-mono" style={{backgroundColor: '#00f0ff'}}>
            CORE_METRICS
          </div>
        )}
        <h3 className={`text-xs uppercase tracking-widest text-slate-500 mb-6 font-bold text-center mt-2 ${!isCrazyMode ? 'font-sans' : 'font-mono'}`}>
          Performance Scorecard
        </h3>
        <ScoreBarChart data={scorecardData} color={barColor} />
      </div>
    </div>
  );
};