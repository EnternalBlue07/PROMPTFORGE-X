export interface PromptAnalysis {
  autopsy: {
    issues: string[];
  };
  classification: {
    granularity: string;
    functionType: string;
    riskLevel: string;
  };
  frameworkScores: {
    clear: number;
    crisp: number;
    costar: number;
    rtf: number;
    reactCompatibility: number;
    chainOfThought: boolean;
  };
  rewrites: {
    style: string;
    content: string;
  }[];
  scorecard: {
    clarity: number;
    control: number;
    expandability: number;
    modelFriendliness: number;
    verdict: string;
    upgradeTip: string;
  };
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}