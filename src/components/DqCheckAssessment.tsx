import React, { useState } from 'react';
import { useDq } from '../context/DqContext';
import { DQ_ASSESSMENT_QUESTIONS, calculateDqScore } from '../data/dqAssessment';
import { DQ_SKILLS } from '../data/dqSkills';
import { SkillId } from '../types/dq';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  ShieldAlert, 
  Sparkles, 
  Bot, 
  Award,
  ChevronRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export const DqCheckAssessment: React.FC = () => {
  const { stats, submitDqAssessment, setActiveTab, setIsBuddyOpen } = useDq();

  // If user already has results and isn't currently taking the test
  const [isTakingTest, setIsTakingTest] = useState(!stats.dqCheckResult);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [insights, setInsights] = useState<Record<string, string>>({});

  const totalQuestions = DQ_ASSESSMENT_QUESTIONS.length;
  const currentQuestion = DQ_ASSESSMENT_QUESTIONS[currentIdx];

  const handleSelectOption = (questionId: string, score: number, insight: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: score
    }));
    setInsights((prev) => ({
      ...prev,
      [questionId]: insight
    }));
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Complete test
      const result = calculateDqScore(answers);
      submitDqAssessment(result);
      setIsTakingTest(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setInsights({});
    setCurrentIdx(0);
    setIsTakingTest(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentAnswerScore = currentQuestion ? answers[currentQuestion.id] : undefined;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  // Result view
  if (!isTakingTest && stats.dqCheckResult) {
    const res = stats.dqCheckResult;
    const skillList = DQ_SKILLS.map((skill) => ({
      ...skill,
      score: res.skillScores[skill.id] ?? 0
    }));

    // Tier badge color
    let tierColor = 'text-sky-400 bg-sky-950/80 border-sky-800';
    if (res.overallScore >= 80) {
      tierColor = 'text-emerald-400 bg-emerald-950/80 border-emerald-800';
    } else if (res.overallScore >= 60) {
      tierColor = 'text-blue-400 bg-blue-950/80 border-blue-800';
    } else if (res.overallScore >= 40) {
      tierColor = 'text-amber-400 bg-amber-950/80 border-amber-800';
    } else {
      tierColor = 'text-rose-400 bg-rose-950/80 border-rose-800';
    }

    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in duration-300">
        
        {/* Results Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-sky-950/40 border border-slate-800 p-6 sm:p-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium mb-4">
            <ClipboardCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>ผลการประเมินความฉลาดทางดิจิทัล 8 ทักษะ</span>
          </div>

          {/* Large Radial Score Gauge */}
          <div className="mt-4 flex flex-col items-center">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-sky-500 via-teal-500 to-emerald-400 p-1.5 shadow-2xl shadow-sky-950 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center p-4">
                <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                  {res.overallScore}
                </span>
                <span className="text-xs text-sky-400 font-semibold mt-0.5">คะแนนเต็ม 100</span>
              </div>
            </div>

            <div className={`mt-5 px-4 py-1.5 rounded-full border text-sm font-bold ${tierColor}`}>
              {res.levelName}
            </div>

            <p className="mt-3 text-xs text-slate-400">
              ประเมินเมื่อ {res.evaluatedAt} (ข้อคำถามสถานการณ์ 24 ข้อ)
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleRetake}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>ทำแบบประเมินอีกครั้ง</span>
            </button>

            <button
              onClick={() => setIsBuddyOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-xs font-semibold text-white transition-all shadow-md active:scale-95"
            >
              <Bot className="w-4 h-4" />
              <span>ขอคำแนะนำการพัฒนาจาก DQ Buddy</span>
            </button>
          </div>
        </div>

        {/* 8 Skills Breakdown Dashboard */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">คะแนนจำแนกตาม 8 ทักษะ DQ</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                วิเคราะห์สมรรถนะแต่ละด้านเพื่อเสริมจุดแข็งและปรับปรุงจุดที่ควรพัฒนา
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-sky-400" />
          </div>

          <div className="space-y-4">
            {skillList.map((skill) => {
              let barColor = 'from-sky-500 to-blue-600';
              let badgeLabel = 'ควรเรียนรู้เพิ่มเติม';
              let badgeColor = 'text-rose-400 bg-rose-950/60 border-rose-900/60';

              if (skill.score >= 80) {
                barColor = 'from-emerald-400 to-teal-600';
                badgeLabel = 'ดีเยี่ยม';
                badgeColor = 'text-emerald-400 bg-emerald-950/60 border-emerald-900/60';
              } else if (skill.score >= 60) {
                barColor = 'from-sky-400 to-blue-600';
                badgeLabel = 'ดี';
                badgeColor = 'text-sky-400 bg-sky-950/60 border-sky-900/60';
              } else if (skill.score >= 40) {
                barColor = 'from-amber-400 to-orange-500';
                badgeLabel = 'ควรพัฒนา';
                badgeColor = 'text-amber-400 bg-amber-950/60 border-amber-900/60';
              }

              return (
                <div key={skill.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white">{skill.titleTh}</span>
                      <span className="text-[11px] text-slate-500 ml-2 hidden sm:inline">{skill.titleEn}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[11px] px-2 py-0.5 rounded border font-medium ${badgeColor}`}>
                        {badgeLabel}
                      </span>
                      <span className="text-sm font-bold font-mono text-white tabular-nums w-12 text-right">
                        {skill.score}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-700`}
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Level Criteria Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-emerald-900/40">
            <span className="text-xs font-bold text-emerald-400 block">80 - 100%</span>
            <span className="text-[11px] text-slate-300 mt-0.5 block">DQ ดีเยี่ยม</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-sky-900/40">
            <span className="text-xs font-bold text-sky-400 block">60 - 79%</span>
            <span className="text-[11px] text-slate-300 mt-0.5 block">DQ ดี</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-amber-900/40">
            <span className="text-xs font-bold text-amber-400 block">40 - 59%</span>
            <span className="text-[11px] text-slate-300 mt-0.5 block">ควรพัฒนา</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-rose-900/40">
            <span className="text-xs font-bold text-rose-400 block">0 - 39%</span>
            <span className="text-[11px] text-slate-300 mt-0.5 block">ควรเรียนรู้เพิ่มเติม</span>
          </div>
        </div>

        {/* Academic Disclaimer Notice (Required) */}
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-900/50 flex items-start gap-3 text-xs text-amber-200/90 leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <span className="font-bold">หมายเหตุสำคัญ:</span> ผลคะแนนนี้เป็นเพียงการประเมินเพื่อการเรียนรู้ (Formative Self-Assessment) 
            ตามกรอบแนวคิดความฉลาดทางดิจิทัลจาก สสวท. เพื่อช่วยให้ผู้เรียนรู้เท่าทันพฤติกรรมของตนเอง 
            ไม่ใช่การวินิจฉัยทางจิตวิทยาหรือการรับรองอย่างเป็นทางการทางกฎหมาย
          </p>
        </div>

      </div>
    );
  }

  // Active Assessment Question Mode
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 animate-in fade-in duration-200">
      
      {/* Assessment Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono font-bold text-sky-400">
            คำถามที่ {currentIdx + 1} / {totalQuestions}
          </span>
          <span className="mx-2 text-slate-600">·</span>
          <span className="text-xs text-slate-400 font-medium">
            {currentQuestion.skillTitle}
          </span>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          ตอบแล้ว {answeredCount}/{totalQuestions}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
        <div
          className="bg-gradient-to-r from-sky-500 to-blue-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Current Question Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs font-bold text-sky-400 block mb-2">
            สถานการณ์ประเมิน:
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
            {currentQuestion.situationQuestion}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((opt, optIdx) => {
            const isSelected = currentAnswerScore === opt.score;

            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(currentQuestion.id, opt.score, opt.insight)}
                className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm leading-relaxed transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-sky-950/90 border-sky-500 text-sky-100 shadow-md shadow-sky-950 font-medium ring-1 ring-sky-500'
                    : 'bg-slate-950/60 hover:bg-slate-900 border-slate-800/80 text-slate-300 hover:text-white'
                }`}
              >
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs shrink-0 mt-0.5 transition-colors ${
                  isSelected ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {['A', 'B', 'C', 'D'][optIdx]}
                </span>
                <span className="flex-1">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Insight preview */}
        {currentAnswerScore !== undefined && insights[currentQuestion.id] && (
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2 animate-in fade-in duration-200">
            <Sparkles className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-sky-400 mr-1">มุมมองสะท้อนคิด:</span>
              <span>{insights[currentQuestion.id]}</span>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-xs text-slate-200 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ข้อก่อนหน้า</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentAnswerScore === undefined}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:hover:bg-sky-500 text-xs text-white font-bold transition-all shadow-md shadow-sky-600/20 active:scale-95"
          >
            <span>{currentIdx === totalQuestions - 1 ? 'สรุปผลคะแนน DQ' : 'ข้อถัดไป'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
