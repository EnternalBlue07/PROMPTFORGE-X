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

export const FrameworkRadar: React.FC<{ data: any[], color: string }> = ({ data, color }) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#475569" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
          <Radar
            name="Score"
            dataKey="A"
            stroke={color}
            fill={color}
            fillOpacity={0.4}
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
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis type="number" domain={[0, 10]} hide />
          <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <Tooltip 
            cursor={{fill: 'transparent'}}
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
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
  const primaryColor = isCrazyMode ? '#ef4444' : '#6366f1';

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
    { name: 'Model-Friendly', value: scorecard.modelFriendliness },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-forge-800 p-4 rounded-xl border border-forge-700">
        <h3 className="text-sm uppercase tracking-wider text-slate-400 mb-4 font-semibold text-center">Framework Mapping</h3>
        <FrameworkRadar data={frameworkData} color={primaryColor} />
      </div>
      <div className="bg-forge-800 p-4 rounded-xl border border-forge-700">
        <h3 className="text-sm uppercase tracking-wider text-slate-400 mb-4 font-semibold text-center">Core Scorecard</h3>
        <ScoreBarChart data={scorecardData} color={primaryColor} />
      </div>
    </div>
  );
};