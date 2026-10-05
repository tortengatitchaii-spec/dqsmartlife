import React, { useState } from 'react';
import { useDq } from '../context/DqContext';
import { DQ_SKILLS } from '../data/dqSkills';
import { LEVELS, getLevelFromXp } from '../data/badges';
import { 
  User, 
  Award, 
  Trophy, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Compass, 
  RotateCcw, 
  Printer, 
  Star,
  ExternalLink,
  Flame,
  Lock
} from 'lucide-react';

export const DqProfile: React.FC = () => {
  const { stats, badges, resetProgress, setActiveTab } = useDq();
  const [showCertificate, setShowCertificate] = useState(false);

  const levelInfo = getLevelFromXp(stats.xp);
  const nextLevel = LEVELS.find((l) => l.level === stats.level + 1);
  const xpCurrentMin = levelInfo.minXp;
  const xpNextTarget = nextLevel ? nextLevel.minXp : levelInfo.maxXp;
  const xpDiff = Math.max(1, xpNextTarget - xpCurrentMin);
  const xpProgress = Math.min(100, Math.round(((stats.xp - xpCurrentMin) / xpDiff) * 100));

  const totalLessons = DQ_SKILLS.length;
  const completedLessonsCount = stats.completedLessons.length;
  const scenariosAnsweredCount = Object.keys(stats.completedScenarios).length;
  const scenariosCorrectCount = Object.values(stats.completedScenarios).filter((s) => s.isAppropriate).length;

  const res = stats.dqCheckResult;

  // Compute strengths and growth areas if assessment has been completed
  let topSkills: any[] = [];
  let growthSkills: any[] = [];

  if (res) {
    const list = DQ_SKILLS.map((s) => ({
      ...s,
      score: res.skillScores[s.id] ?? 0
    })).sort((a, b) => b.score - a.score);

    topSkills = list.slice(0, 2);
    growthSkills = list.slice(-2).reverse();
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-200">
      
      {/* Profile Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/50 border border-slate-800 p-6 sm:p-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          
          {/* Avatar Shield */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-sky-950 text-3xl font-extrabold">
              DQ
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-amber-500 border-2 border-slate-900 flex items-center justify-center text-slate-950 text-xs font-black">
              {stats.level}
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div>
              <span className="text-xs text-sky-400 font-mono font-semibold">
                DIGITAL CITIZEN PROFILE
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                ผู้เรียนรู้ DQ SMART LIFE
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
                ระดับ: <span className="text-amber-400 font-bold">Level {stats.level} — {stats.levelName}</span>
              </p>
            </div>

            {/* XP Bar */}
            <div className="max-w-md space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>XP สะสม: <strong className="text-white">{stats.xp}</strong></span>
                <span>{nextLevel ? `เป้าหมายถัดไป: ${xpNextTarget} XP` : 'ระดับสูงสุด'}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <button
                onClick={() => setShowCertificate(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 rounded-lg text-xs font-semibold transition-colors"
              >
                <Award className="w-4 h-4" />
                <span>พิมพ์เกียรติบัตรการเรียนรู้</span>
              </button>

              <button
                onClick={resetProgress}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-700/60 rounded-lg text-xs font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>รีเซ็ตสถิติ</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Core Learning Statistics Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">บทเรียนที่เรียนจบ</span>
          <p className="text-2xl font-bold font-mono text-white">
            {completedLessonsCount} <span className="text-xs font-normal text-slate-500">/ {totalLessons}</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">สถานการณ์จำลองที่ถูก</span>
          <p className="text-2xl font-bold font-mono text-emerald-400">
            {scenariosCorrectCount} <span className="text-xs font-normal text-slate-500">ข้อ</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">คะแนน DQ รวม</span>
          <p className="text-2xl font-bold font-mono text-sky-400">
            {res ? `${res.overallScore}%` : '-'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">เหรียญตราที่ปลดล็อก</span>
          <p className="text-2xl font-bold font-mono text-amber-400">
            {badges.filter((b) => b.unlocked).length} <span className="text-xs font-normal text-slate-500">/ {badges.length}</span>
          </p>
        </div>
      </div>

      {/* Strengths & Growth Areas */}
      {res ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Strengths */}
          <div className="bg-slate-900/70 border border-emerald-900/40 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Star className="w-4 h-4" />
              <span>ทักษะที่โดดเด่นของคุณ (Top Strengths)</span>
            </div>
            <div className="space-y-3">
              {topSkills.map((s) => (
                <div key={s.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-emerald-900/40 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white">{s.titleTh}</h3>
                    <p className="text-[11px] text-slate-400">{s.titleEn}</p>
                  </div>
                  <span className="text-sm font-bold font-mono text-emerald-400">{s.score}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Growth Areas */}
          <div className="bg-slate-900/70 border border-amber-900/40 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>ทักษะที่ควรพัฒนาต่อ (Growth Areas)</span>
            </div>
            <div className="space-y-3">
              {growthSkills.map((s) => (
                <div key={s.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-amber-900/40 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white">{s.titleTh}</h3>
                    <p className="text-[11px] text-slate-400">{s.titleEn}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold font-mono text-amber-400">{s.score}%</span>
                    <button
                      onClick={() => setActiveTab('learn')}
                      className="text-[10px] text-sky-400 hover:underline"
                    >
                      ทบทวน
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
          <p className="text-sm font-semibold text-white">ยังไม่มีข้อมูลคะแนน 8 ทักษะ</p>
          <p className="text-xs text-slate-400">
            ทำแบบประเมิน DQ Check 24 ข้อ เพื่อให้ระบบวิเคราะห์จุดแข็งและจุดที่ควรพัฒนาของคุณ
          </p>
          <button
            onClick={() => setActiveTab('check')}
            className="mt-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs rounded-xl shadow-md transition-all inline-block"
          >
            เริ่มประเมิน DQ Check ทันที
          </button>
        </div>
      )}

      {/* Badges & Achievements Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>เหรียญเกียรติยศ & รางวัลความสำเร็จ (Badges)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            ปลดล็อกเหรียญตราผ่านการศึกษาบทเรียนและพิชิตคะแนนในแต่ละหมวดหมู่
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-5 rounded-2xl border transition-all ${
                badge.unlocked
                  ? 'bg-gradient-to-b from-amber-950/40 to-slate-900 border-amber-500/50 shadow-lg shadow-amber-950/20'
                  : 'bg-slate-900/40 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  badge.unlocked 
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' 
                    : 'bg-slate-800/80 text-slate-600'
                }`}>
                  {badge.unlocked ? <Award className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </div>

                {badge.unlocked ? (
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                    ปลดล็อกแล้ว
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500">ยังไม่ปลดล็อก</span>
                )}
              </div>

              <h3 className={`text-sm font-bold ${badge.unlocked ? 'text-amber-200' : 'text-slate-400'}`}>
                {badge.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {badge.description}
              </p>
              <p className="text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-800/60">
                เงื่อนไข: {badge.criteria}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-700 max-w-2xl w-full rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            
            {/* Certificate Canvas */}
            <div id="print-area" className="p-8 border-4 border-double border-sky-700/60 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-400 to-blue-600 mx-auto flex items-center justify-center text-white font-black text-lg shadow-lg">
                DQ
              </div>

              <span className="text-xs font-mono font-bold tracking-widest text-sky-400 block uppercase">
                CERTIFICATE OF DIGITAL INTELLIGENCE LEARNING
              </span>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                เกียรติบัตรการเรียนรู้ความฉลาดทางดิจิทัล
              </h2>

              <p className="text-xs text-slate-300">
                ขอมอบเกียรติบัตรนี้เพื่อแสดงว่า
              </p>

              <p className="text-xl sm:text-2xl font-bold text-amber-300 underline decoration-amber-500 decoration-wavy decoration-1 underline-offset-8 py-2">
                ผู้เรียนรู้ DQ SMART LIFE
              </p>

              <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                ได้ศึกษาและผ่านกระบวนการเรียนรู้เรื่อง “ความฉลาดทางดิจิทัล (Digital Intelligence: DQ)” 8 ทักษะ
                ตามกรอบแนวคิดของสถาบันส่งเสริมการสอนวิทยาศาสตร์และเทคโนโลยี (สสวท.)
                โดยได้รับระดับความฉลาดทางดิจิทัล: <strong className="text-white">{stats.dqCheckResult?.levelName || stats.levelName}</strong>
              </p>

              <div className="pt-6 border-t border-slate-800 flex justify-between text-xs text-slate-400 font-mono">
                <span>วันที่: {new Date().toLocaleDateString('th-TH')}</span>
                <span>แอปพลิเคชัน: DQ SMART LIFE</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCertificate(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl transition-colors"
              >
                ปิดหน้าต่าง
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs rounded-xl shadow-md transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>พิมพ์ / บันทึกเป็น PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
