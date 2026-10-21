import React, { createContext, useContext, useEffect, useState } from 'react';
import { Badge, SkillId, UserStats } from '../types/dq';
import { ALL_BADGES, getLevelFromXp } from '../data/badges';

interface ToastMessage {
  id: string;
  title: string;
  desc: string;
  type: 'xp' | 'badge' | 'success' | 'info';
}

interface DqContextType {
  stats: UserStats;
  badges: Badge[];
  activeTab: 'home' | 'learn' | 'scenario' | 'check' | 'profile' | 'tips';
  setActiveTab: (tab: 'home' | 'learn' | 'scenario' | 'check' | 'profile' | 'tips') => void;
  selectedSkillId: SkillId | null;
  setSelectedSkillId: (skillId: SkillId | null) => void;
  isBuddyOpen: boolean;
  setIsBuddyOpen: (open: boolean) => void;
  addXp: (amount: number, reason: string) => void;
  markLessonComplete: (skillId: SkillId) => void;
  answerScenario: (scenarioId: string, optionId: string, isAppropriate: boolean, score: number) => void;
  submitMiniQuiz: (skillId: SkillId, correctCount: number, total: number) => void;
  submitDqAssessment: (result: any) => void;
  toggleSaveTip: (tipId: string) => void;
  updateUserProfile: (name: string, institution?: string, studentId?: string) => void;
  resetProgress: () => void;
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

const STORAGE_KEY = 'dq_smart_life_user_data_v1';

const defaultStats: UserStats = {
  xp: 120, // Start with welcome beginner bonus
  level: 1,
  levelName: 'Digital Beginner',
  completedLessons: [],
  completedScenarios: {},
  miniQuizScores: {
    identity: 0,
    screen_time: 0,
    cyberbullying: 0,
    cybersecurity: 0,
    privacy: 0,
    critical_thinking: 0,
    footprints: 0,
    empathy: 0
  },
  dqCheckResult: null,
  savedTips: []
};

const DqContext = createContext<DqContextType | undefined>(undefined);

export const DqProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved DQ data:', e);
    }
    return defaultStats;
  });

  const [activeTab, setActiveTab] = useState<'home' | 'learn' | 'scenario' | 'check' | 'profile' | 'tips'>('home');
  const [selectedSkillId, setSelectedSkillId] = useState<SkillId | null>(null);
  const [isBuddyOpen, setIsBuddyOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      console.error('Error saving DQ data:', e);
    }
  }, [stats]);

  const addToast = (title: string, desc: string, type: 'xp' | 'badge' | 'success' | 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, title, desc, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addXp = (amount: number, reason: string) => {
    setStats((prev) => {
      const newXp = prev.xp + amount;
      const currentLevelInfo = getLevelFromXp(prev.xp);
      const newLevelInfo = getLevelFromXp(newXp);

      if (newLevelInfo.level > currentLevelInfo.level) {
        addToast(
          '🎉 อัปเลเวลใหม่!',
          `คุณได้เลื่อนขั้นเป็น Level ${newLevelInfo.level}: ${newLevelInfo.name}`,
          'badge'
        );
      } else {
        addToast(`+${amount} XP`, reason, 'xp');
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevelInfo.level,
        levelName: newLevelInfo.name
      };
    });
  };

  const markLessonComplete = (skillId: SkillId) => {
    if (!stats.completedLessons.includes(skillId)) {
      setStats((prev) => ({
        ...prev,
        completedLessons: [...prev.completedLessons, skillId]
      }));
      addXp(60, 'เรียนจบบทเรียนความรู้ DQ');
    }
  };

  const answerScenario = (scenarioId: string, optionId: string, isAppropriate: boolean, score: number) => {
    const earnedXp = isAppropriate ? score * 5 : 5;
    setStats((prev) => ({
      ...prev,
      completedScenarios: {
        ...prev.completedScenarios,
        [scenarioId]: { optionId, isAppropriate, earnedXp }
      }
    }));
    addXp(earnedXp, isAppropriate ? 'ตัดสินใจในสถานการณ์จำลองถูกต้อง' : 'ร่วมวิเคราะห์สถานการณ์จำลอง');
  };

  const submitMiniQuiz = (skillId: SkillId, correctCount: number, total: number) => {
    const pct = Math.round((correctCount / total) * 100);
    setStats((prev) => ({
      ...prev,
      miniQuizScores: {
        ...prev.miniQuizScores,
        [skillId]: Math.max(prev.miniQuizScores[skillId] || 0, pct)
      }
    }));
    const earnedXp = correctCount * 15;
    addXp(earnedXp, `ทำแบบทดสอบ Mini Quiz (${correctCount}/${total} ข้อ)`);
  };

  const submitDqAssessment = (result: any) => {
    setStats((prev) => ({
      ...prev,
      dqCheckResult: {
        overallScore: result.overallScore,
        skillScores: result.skillScores,
        evaluatedAt: new Date().toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        levelName: result.levelName
      }
    }));
    addXp(120, 'ทำแบบประเมิน DQ Check 24 ข้อครบถ้วน');
    addToast('🎯 บันทึกคะแนน DQ สำเร็จ', `คะแนนภาพรวมของคุณ: ${result.overallScore}% (${result.levelName})`, 'success');
  };

  const toggleSaveTip = (tipId: string) => {
    setStats((prev) => {
      const exists = prev.savedTips.includes(tipId);
      const newSaved = exists
        ? prev.savedTips.filter((id) => id !== tipId)
        : [...prev.savedTips, tipId];
      return {
        ...prev,
        savedTips: newSaved
      };
    });
  };

  const updateUserProfile = (name: string, institution?: string, studentId?: string) => {
    setStats((prev) => ({
      ...prev,
      userName: name.trim() || undefined,
      institutionName: institution ? institution.trim() : undefined,
      studentId: studentId ? studentId.trim() : undefined,
    }));
    addToast('บันทึกข้อมูลเรียบร้อย', `ชื่อผู้เรียน: ${name.trim() || 'ผู้เรียนรู้ DQ SMART LIFE'}`, 'success');
  };

  const resetProgress = () => {
    setStats(defaultStats);
    addToast('รีเซ็ตข้อมูล', 'ข้อมูลการเรียนรู้ทั้งหมดถูกรีเซ็ตเรียบร้อยแล้ว', 'info');
  };

  // Compute dynamic badges
  const computedBadges = ALL_BADGES.map((b) => {
    let unlocked = false;
    const { dqCheckResult, completedScenarios, completedLessons, miniQuizScores } = stats;

    if (b.id === 'badge-guardian' && dqCheckResult && dqCheckResult.skillScores.cybersecurity >= 80) {
      unlocked = true;
    }
    if (b.id === 'badge-privacy' && dqCheckResult && dqCheckResult.skillScores.privacy >= 80) {
      unlocked = true;
    }
    if (b.id === 'badge-fact-checker' && dqCheckResult && dqCheckResult.skillScores.critical_thinking >= 80) {
      unlocked = true;
    }
    if (b.id === 'badge-digital-friend' && dqCheckResult && dqCheckResult.skillScores.empathy >= 80) {
      unlocked = true;
    }
    if (b.id === 'badge-screen-master' && dqCheckResult && dqCheckResult.skillScores.screen_time >= 80) {
      unlocked = true;
    }
    if (b.id === 'badge-simulation-ace') {
      const correctCount = Object.values(completedScenarios).filter((s) => s.isAppropriate).length;
      if (correctCount >= 8) unlocked = true;
    }
    if (b.id === 'badge-citizen-all' && completedLessons.length >= 8) {
      unlocked = true;
    }
    if (b.id === 'badge-scholar') {
      const passedCount = Object.values(miniQuizScores).filter((sc) => sc >= 80).length;
      if (passedCount >= 6) unlocked = true;
    }

    return {
      ...b,
      unlocked
    };
  });

  return (
    <DqContext.Provider
      value={{
        stats,
        badges: computedBadges,
        activeTab,
        setActiveTab,
        selectedSkillId,
        setSelectedSkillId,
        isBuddyOpen,
        setIsBuddyOpen,
        addXp,
        markLessonComplete,
        answerScenario,
        submitMiniQuiz,
        submitDqAssessment,
        toggleSaveTip,
        updateUserProfile,
        resetProgress,
        toasts,
        removeToast
      }}
    >
      {children}
    </DqContext.Provider>
  );
};

export const useDq = () => {
  const context = useContext(DqContext);
  if (!context) {
    throw new Error('useDq must be used within a DqProvider');
  }
  return context;
};
