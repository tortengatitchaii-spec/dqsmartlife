import React, { useState } from 'react';
import { useDq } from '../context/DqContext';
import { SCENARIOS } from '../data/scenarios';
import { SkillId } from '../types/dq';
import { 
  Compass, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Filter, 
  Sparkles, 
  ArrowRight, 
  RotateCcw,
  Shield,
  Tag
} from 'lucide-react';

export const ScenarioSimulator: React.FC = () => {
  const { stats, answerScenario } = useDq();
  const [selectedFilter, setSelectedFilter] = useState<SkillId | 'all'>('all');
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);

  const completedMap = stats.completedScenarios;
  const totalScenarios = SCENARIOS.length;
  const completedCount = Object.keys(completedMap).length;
  const correctCount = Object.values(completedMap).filter((s) => s.isAppropriate).length;

  const filteredScenarios = SCENARIOS.filter((sc) => {
    if (selectedFilter === 'all') return true;
    return sc.skillId === selectedFilter;
  });

  const skillFilterTabs = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'identity', label: 'อัตลักษณ์' },
    { id: 'screen_time', label: 'เวลาหน้าจอ' },
    { id: 'cyberbullying', label: 'การบูลลี่' },
    { id: 'cybersecurity', label: 'ไซเบอร์ซีเคียว' },
    { id: 'privacy', label: 'ความเป็นส่วนตัว' },
    { id: 'critical_thinking', label: 'คิดวิเคราะห์' },
    { id: 'footprints', label: 'ร่องรอยดิจิทัล' },
    { id: 'empathy', label: 'ความเห็นอกเห็นใจ' },
  ] as const;

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800/60 text-amber-400 text-xs font-medium mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Scenario-Based Learning</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            สถานการณ์จำลอง DQ ในชีวิตจริง
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl">
            เผชิญ 16+ สถานการณ์ออนไลน์เสมือนจริง ฝึกคิด ตัดสินใจ และเรียนรู้วิธีรับมือที่ปลอดภัยผ่านคำแนะนำเชิงปฏิบัติการ
          </p>
        </div>

        {/* Progress Badge */}
        <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-right">
            <span className="text-xs text-slate-400 block">ทำเสร็จแล้ว</span>
            <span className="text-sm font-mono font-bold text-white">
              {completedCount} / {totalScenarios} สถานการณ์
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400 font-mono font-bold text-xs">
            {Math.round((completedCount / totalScenarios) * 100)}%
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
        {skillFilterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
              selectedFilter === tab.id
                ? 'bg-sky-500 text-white shadow-md shadow-sky-600/20 font-semibold'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Scenario List */}
      <div className="space-y-6">
        {filteredScenarios.map((sc, scIdx) => {
          const completion = completedMap[sc.id];
          const hasAnswered = !!completion;
          const chosenOption = hasAnswered 
            ? sc.options.find((o) => o.id === completion.optionId)
            : null;

          return (
            <div
              key={sc.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                hasAnswered
                  ? completion.isAppropriate
                    ? 'bg-slate-900/90 border-emerald-900/60'
                    : 'bg-slate-900/90 border-rose-900/60'
                  : 'bg-slate-900/60 hover:bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Scenario Top Bar */}
              <div className="p-5 sm:p-6 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/60">
                      สถานการณ์ที่ {scIdx + 1}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {sc.skillTitle}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      ระดับ: {sc.difficulty}
                    </span>
                  </div>

                  {hasAnswered && (
                    <div className="flex items-center gap-1.5">
                      {completion.isAppropriate ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>เหมาะสม (+{completion.earnedXp} XP)</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-rose-400 font-semibold bg-rose-950/80 border border-rose-800 px-2.5 py-0.5 rounded-full">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>ยังไม่เหมาะสม (+5 XP)</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white">
                  {sc.title}
                </h3>

                {/* Context Story */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                  <span className="font-semibold text-sky-400 block mb-1">บริบทสถานการณ์:</span>
                  {sc.context}
                </div>

                {/* The Challenge Question */}
                <p className="text-sm font-semibold text-slate-100 pt-1">
                  ❓ {sc.situation}
                </p>
              </div>

              {/* Options */}
              <div className="px-5 sm:px-6 pb-6 space-y-2.5">
                {sc.options.map((opt, optIdx) => {
                  const isSelected = completion?.optionId === opt.id;
                  let optStyle = 'bg-slate-950 hover:bg-slate-800/80 text-slate-300 border-slate-800 hover:border-slate-700';

                  if (hasAnswered) {
                    if (opt.isAppropriate) {
                      optStyle = 'bg-emerald-950/70 border-emerald-600/80 text-emerald-100 font-medium';
                    } else if (isSelected && !opt.isAppropriate) {
                      optStyle = 'bg-rose-950/70 border-rose-600/80 text-rose-100';
                    } else {
                      optStyle = 'bg-slate-950/40 text-slate-500 border-slate-900';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      disabled={hasAnswered}
                      onClick={() => answerScenario(sc.id, opt.id, opt.isAppropriate, opt.score)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all flex items-start gap-3 ${optStyle} ${
                        !hasAnswered ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-md bg-black/30 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                        {['A', 'B', 'C', 'D'][optIdx]}
                      </span>
                      <span className="flex-1">{opt.text}</span>
                      {hasAnswered && opt.isAppropriate && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {hasAnswered && isSelected && !opt.isAppropriate && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}

                {/* Instant Feedback & Real-world Actionable Advice */}
                {hasAnswered && chosenOption && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      {chosenOption.isAppropriate ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>การตัดสินใจที่ถูกต้องและเหมาะสม</span>
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1">
                          <XCircle className="w-4 h-4" />
                          <span>ทางเลือกนี้ยังมีความเสี่ยงและไม่เหมาะสม</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed">
                      {chosenOption.feedback}
                    </p>

                    <div className="pt-2 border-t border-slate-800/80 flex items-start gap-2 text-xs text-amber-300">
                      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <span className="font-bold text-amber-400 mr-1">คำแนะนำที่นำไปใช้ได้จริง:</span>
                        <span>{chosenOption.actionTip}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
