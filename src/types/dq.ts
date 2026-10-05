export type SkillId =
  | 'identity'
  | 'screen_time'
  | 'cyberbullying'
  | 'cybersecurity'
  | 'privacy'
  | 'critical_thinking'
  | 'footprints'
  | 'empathy';

export interface MiniQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface DqSkill {
  id: SkillId;
  orderNumber: number;
  titleTh: string;
  titleEn: string;
  shortDesc: string;
  definition: string;
  whyImportant: string;
  realLifeSituations: string[];
  dos: string[];
  donts: string[];
  colorTheme: string;
  accentHex: string;
  miniQuiz: MiniQuizQuestion[];
}

export interface ScenarioOption {
  id: string;
  text: string;
  isAppropriate: boolean;
  score: number; // 0 to 10
  feedback: string;
  actionTip: string;
}

export interface ScenarioItem {
  id: string;
  skillId: SkillId;
  skillTitle: string;
  title: string;
  context: string;
  situation: string;
  options: ScenarioOption[];
  difficulty: 'ง่าย' | 'ปานกลาง' | 'ท้าทาย';
}

export interface AssessmentQuestion {
  id: string;
  skillId: SkillId;
  skillTitle: string;
  situationQuestion: string;
  options: {
    text: string;
    score: number; // 0, 50, 75, 100
    insight: string;
  }[];
}

export interface KnowledgeTip {
  id: string;
  skillId: SkillId;
  headline: string;
  subtext: string;
  quote: string;
  category: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  criteria: string;
  skillRelated?: SkillId;
}

export interface UserStats {
  xp: number;
  level: number;
  levelName: string;
  completedLessons: SkillId[];
  completedScenarios: Record<string, { optionId: string; isAppropriate: boolean; earnedXp: number }>;
  miniQuizScores: Record<SkillId, number>; // percent
  dqCheckResult: {
    overallScore: number;
    skillScores: Record<SkillId, number>;
    evaluatedAt: string;
    levelName: string;
  } | null;
  savedTips: string[];
}
