import React, { useState } from 'react';
import { useDq } from '../context/DqContext';
import { DQ_SKILLS } from '../data/dqSkills';
import { DqSkill, MiniQuizQuestion } from '../types/dq';
import { 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle, 
  Check, 
  X, 
  Sparkles, 
  ArrowLeft, 
  BookOpen, 
  ShieldAlert, 
  ThumbsUp, 
  ThumbsDown,
  Award
} from 'lucide-react';

export const LearningHub: React.FC = () => {
  const { 
    stats, 
    selectedSkillId, 
    setSelectedSkillId, 
    markLessonComplete, 
    submitMiniQuiz,
    setActiveTab
  } = useDq();

  // If a skill is selected, display full lesson mode
  const currentSkill = DQ_SKILLS.find((s) => s.id === selectedSkillId) || null;

  // Mini quiz state inside lesson
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  const handleSelectAnswer = (questionId: string, optionIdx: number) => {
    if (submittedQuiz) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  const handleGradeQuiz = (skill: DqSkill) => {
    let correct = 0;
    skill.miniQuiz.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    setSubmittedQuiz(true);
    submitMiniQuiz(skill.id, correct, skill.miniQuiz.length);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setSubmittedQuiz(false);
  };

  const handleOpenSkill = (skill: DqSkill) => {
    setSelectedSkillId(skill.id);
    setSelectedAnswers({});
    setSubmittedQuiz(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedSkillId(null);
    setSelectedAnswers({});
    setSubmittedQuiz(false);
  };

  // If currently reading a specific lesson
  if (currentSkill) {
    const isCompleted = stats.completedLessons.includes(currentSkill.id);
    const quizScore = stats.miniQuizScores[currentSkill.id] || 0;

    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in duration-200">
        
        {/* Navigation Bar back */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackToList}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับหน้ารายการ 8 ทักษะ</span>
          </button>

          {isCompleted && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>ผ่านบทเรียนนี้แล้ว</span>
            </span>
          )}
        </div>

        {/* Lesson Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/50 border border-slate-800 p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 font-semibold mb-2">
            <span>ทักษะที่ {currentSkill.orderNumber} จาก 8</span>
            <span>·</span>
            <span>{currentSkill.titleEn}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {currentSkill.titleTh}
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            {currentSkill.definition}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {!isCompleted ? (
              <button
                onClick={() => markLessonComplete(currentSkill.id)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-950 transition-all active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>คลิกเพื่อ “ผ่านบทเรียนนี้” (+60 XP)</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>คุณบันทึกการเรียนรู้บทนี้แล้ว</span>
              </div>
            )}
          </div>
        </div>

        {/* Section: ทำไมจึงสำคัญ (Why Important) */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>ทำไมทักษะนี้จึงสำคัญอย่างยิ่ง?</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">
            {currentSkill.whyImportant}
          </p>
        </div>

        {/* Section: ตัวอย่างสถานการณ์จริง (Real-life Situations) */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
            <BookOpen className="w-4 h-4" />
            <span>ตัวอย่างสถานการณ์ในชีวิตจริง</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentSkill.realLifeSituations.map((sit, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed"
              >
                <span className="w-5 h-5 rounded-full bg-sky-950 text-sky-400 border border-sky-800/60 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{sit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Do's and Don'ts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Do's */}
          <div className="bg-slate-900/70 border border-emerald-900/40 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <ThumbsUp className="w-4 h-4" />
              <span>สิ่งที่ควรทำ (Do's)</span>
            </div>
            <ul className="space-y-2.5">
              {currentSkill.dos.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Don'ts */}
          <div className="bg-slate-900/70 border border-rose-900/40 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <ThumbsDown className="w-4 h-4" />
              <span>สิ่งที่ไม่ควรทำ (Don'ts)</span>
            </div>
            <ul className="space-y-2.5">
              {currentSkill.donts.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section: Mini Quiz (3-5 ข้อ พร้อมอธิบายละเอียด) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                <HelpCircle className="w-4 h-4" />
                <span>Mini Quiz ประเมินความเข้าใจท้ายบทเรียน</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                ตอบคำถาม {currentSkill.miniQuiz.length} ข้อ เพื่อทดสอบความเข้าใจและรับแต้ม XP
              </p>
            </div>

            {submittedQuiz && (
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-sky-950 text-sky-300 border border-sky-800">
                คะแนนล่าสุด: {quizScore}%
              </span>
            )}
          </div>

          <div className="space-y-6">
            {currentSkill.miniQuiz.map((q, qIdx) => {
              const selectedIdx = selectedAnswers[q.id];
              const hasAnswered = selectedIdx !== undefined;

              return (
                <div key={q.id} className="p-4 sm:p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                  <p className="text-sm font-semibold text-white leading-snug">
                    <span className="text-sky-400 mr-2 font-mono">ข้อ {qIdx + 1}.</span>
                    {q.question}
                  </p>

                  <div className="space-y-2 mt-3">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedIdx === optIdx;
                      const isCorrect = optIdx === q.correctIndex;

                      let btnStyle = 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800';
                      if (isSelected && !submittedQuiz) {
                        btnStyle = 'bg-sky-950 border-sky-600 text-sky-200';
                      }
                      if (submittedQuiz) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-950/80 border-emerald-600 text-emerald-200 font-medium';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-rose-950/80 border-rose-600 text-rose-200';
                        } else {
                          btnStyle = 'bg-slate-900/40 text-slate-500 border-slate-900';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={submittedQuiz}
                          onClick={() => handleSelectAnswer(q.id, optIdx)}
                          className={`w-full text-left p-3 rounded-lg border text-xs leading-relaxed transition-all flex items-start gap-2.5 ${btnStyle}`}
                        >
                          <span className="w-5 h-5 rounded-md bg-black/20 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                            {['A', 'B', 'C', 'D'][optIdx]}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {submittedQuiz && isCorrect && (
                            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          {submittedQuiz && isSelected && !isCorrect && (
                            <X className="w-4 h-4 text-rose-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Immediate Explanation when submitted */}
                  {submittedQuiz && (
                    <div className="mt-3 p-3.5 rounded-lg bg-slate-900 border border-slate-700/60 text-xs space-y-1">
                      <span className="font-bold text-sky-400 block">คำอธิบายเหตุผล:</span>
                      <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quiz Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {!submittedQuiz ? (
              <button
                onClick={() => handleGradeQuiz(currentSkill)}
                disabled={Object.keys(selectedAnswers).length < currentSkill.miniQuiz.length}
                className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:hover:bg-sky-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all ml-auto"
              >
                ตรวจคำตอบ Mini Quiz
              </button>
            ) : (
              <button
                onClick={handleResetQuiz}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors ml-auto"
              >
                ทำแบบทดสอบใหม่อีกครั้ง
              </button>
            )}
          </div>
        </div>

        {/* Complete Lesson CTA Footer */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-sky-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white">ศึกษาบทเรียนนี้ครบถ้วนแล้วหรือยัง?</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              คลิกเพื่อบันทึกสถานะและรับแต้มสะสม XP สำหรับการอัปเลเวล
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!isCompleted && (
              <button
                onClick={() => markLessonComplete(currentSkill.id)}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95"
              >
                ผ่านบทเรียนนี้ (+60 XP)
              </button>
            )}

            <button
              onClick={() => setActiveTab('scenario')}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-colors"
            >
              ไปฝึกสถานการณ์จำลอง
            </button>
          </div>
        </div>

      </div>
    );
  }

  // Otherwise, display 8 Skills Grid
  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-800/60 text-sky-400 text-xs font-medium mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>DQ 8 Core Competencies</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          ความรู้ 8 ทักษะความฉลาดทางดิจิทัล
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl">
          เลือกศึกษาทักษะที่คุณสนใจ แต่ละบทเรียนประกอบด้วยความหมาย ความสำคัญ แนวทาง Do/Don't และ Mini Quiz ท้ายบท
        </p>
      </div>

      {/* 8 Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DQ_SKILLS.map((skill) => {
          const isCompleted = stats.completedLessons.includes(skill.id);
          const quizScore = stats.miniQuizScores[skill.id] || 0;

          return (
            <div
              key={skill.id}
              onClick={() => handleOpenSkill(skill)}
              className="group cursor-pointer bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-sky-600/60 rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:shadow-sky-950/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 group-hover:bg-sky-950 group-hover:text-sky-400 transition-colors">
                    ทักษะที่ {skill.orderNumber}
                  </span>

                  {isCompleted ? (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ผ่านบทเรียนแล้ว</span>
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500">ยังไม่ได้ศึกษา</span>
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-sky-300 transition-colors">
                  {skill.titleTh}
                </h3>
                <p className="text-xs text-sky-400 font-medium mt-0.5">
                  {skill.titleEn}
                </p>

                <p className="text-xs text-slate-300 mt-3 line-clamp-3 leading-relaxed">
                  {skill.definition}
                </p>

                {/* Micro tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {skill.realLifeSituations.slice(0, 2).map((item, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-950/80 text-slate-400 border border-slate-800/80 line-clamp-1"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/70 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  {quizScore > 0 ? `Mini Quiz: ${quizScore}%` : 'Mini Quiz: 3 ข้อ'}
                </span>

                <span className="text-sky-400 font-semibold group-hover:text-sky-300 flex items-center gap-1">
                  <span>เปิดบทเรียน</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
