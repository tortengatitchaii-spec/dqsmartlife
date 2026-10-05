import React from 'react';
import { useDq } from '../context/DqContext';
import { DQ_SKILLS, SCIMATH_SOURCE } from '../data/dqSkills';
import { 
  BookOpen, 
  Compass, 
  ClipboardCheck, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  Trophy, 
  ExternalLink,
  Flame,
  CheckCircle2,
  Lock,
  SearchCheck,
  HeartHandshake,
  Hourglass,
  GraduationCap
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const { stats, badges, setActiveTab, setSelectedSkillId, setIsBuddyOpen } = useDq();

  const totalLessons = DQ_SKILLS.length;
  const completedCount = stats.completedLessons.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const scenarioAnswersCount = Object.keys(stats.completedScenarios).length;
  const correctScenariosCount = Object.values(stats.completedScenarios).filter(s => s.isAppropriate).length;

  const unlockedBadgesCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="space-y-10 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-10 lg:p-12 shadow-2xl">
        {/* Modern glowing background orbs */}
        <div className="absolute top-0 right-1/4 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 translate-y-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-800/60 text-sky-300 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>นวัตกรรมสื่อการเรียนรู้ EdTech ศตวรรษที่ 21</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight text-balance">
            DQ SMART LIFE
          </h1>

          <p className="mt-3 text-lg sm:text-2xl font-semibold bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
            “ฉลาดใช้ ฉลาดคิด ฉลาดอยู่ในโลกดิจิทัล”
          </p>

          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            เปลี่ยนทฤษฎีความฉลาดทางดิจิทัล (Digital Intelligence: DQ) 8 ทักษะ ให้กลายเป็นประสบการณ์การเรียนรู้เชิงปฏิบัติการ 
            เผชิญสถานการณ์จำลองในชีวิตจริง ประเมินระดับทักษะดิจิทัลของตนเอง และเตรียมพร้อมสู่การเป็นพลเมืองดิจิทัลที่มีคุณภาพ
          </p>

          {/* Core Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => setActiveTab('learn')}
              className="flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-sky-600/30 transition-all hover:shadow-sky-500/50 hover:scale-[1.02] active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>เริ่มเรียนรู้ 8 ทักษะ</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => setActiveTab('check')}
              className="flex items-center gap-2 px-5 py-3.5 bg-slate-800/90 hover:bg-slate-700 text-slate-100 hover:text-white font-medium text-sm rounded-xl border border-slate-700 transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
            >
              <ClipboardCheck className="w-4 h-4 text-emerald-400" />
              <span>ทดสอบ DQ ของฉัน</span>
            </button>

            <button
              onClick={() => setActiveTab('scenario')}
              className="flex items-center gap-2 px-5 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-sm rounded-xl border border-slate-800 transition-all hover:border-slate-700 active:scale-95"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>สถานการณ์จำลอง</span>
            </button>
          </div>

          {/* Quick Shortcuts */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="font-medium text-slate-300">ทางลัดด่วน:</span>
            <button
              onClick={() => setActiveTab('learn')}
              className="px-2.5 py-1 rounded-md bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              ความรู้ 8 ทักษะ DQ
            </button>
            <button
              onClick={() => setActiveTab('scenario')}
              className="px-2.5 py-1 rounded-md bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              แบบทดสอบสถานการณ์
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className="px-2.5 py-1 rounded-md bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              การ์ดความรู้สั้น
            </button>
            <button
              onClick={() => setIsBuddyOpen(true)}
              className="px-2.5 py-1 rounded-md bg-sky-950/60 hover:bg-sky-900/60 text-sky-400 hover:text-sky-300 border border-sky-800/40 transition-colors"
            >
              ปรึกษา DQ Buddy
            </button>
          </div>
        </div>
      </section>

      {/* Progress & Stats Cards Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Learning Progress */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700/80 transition-all">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">ความก้าวหน้าการเรียนรู้</span>
              <span className="text-xs font-mono font-bold text-sky-400">{progressPercent}%</span>
            </div>
            <div className="mt-3 w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-sky-500 to-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="mt-4 space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>บทเรียนที่ศึกษาจบ:</span>
                <span className="font-semibold text-white">{completedCount} / {totalLessons} ทักษะ</span>
              </div>
              <div className="flex justify-between">
                <span>สถานการณ์ที่ตัดสินใจถูก:</span>
                <span className="font-semibold text-emerald-400">{correctScenariosCount} ข้อ</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('learn')}
            className="mt-5 w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 hover:text-white rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <span>เข้าสู่ Learning Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Latest DQ Score */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700/80 transition-all">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">คะแนน DQ ล่าสุด</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>

            {stats.dqCheckResult ? (
              <div className="mt-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex flex-col items-center justify-center shadow-lg shadow-emerald-950">
                  <span className="text-2xl font-black text-white tabular-nums leading-none">
                    {stats.dqCheckResult.overallScore}
                  </span>
                  <span className="text-[10px] text-emerald-200 mt-0.5 font-medium">%</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{stats.dqCheckResult.levelName}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">ประเมินเมื่อ {stats.dqCheckResult.evaluatedAt}</p>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                <p className="text-xs text-slate-400">คุณยังไม่ได้ทำแบบประเมิน DQ Check 24 ข้อ</p>
                <p className="text-xs text-sky-400 mt-1 font-medium">ทำแบบประเมินเพื่อวัดระดับทักษะทั้ง 8 ด้าน</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('check')}
            className="mt-5 w-full py-2 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 hover:text-emerald-200 border border-emerald-800/60 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <span>{stats.dqCheckResult ? 'ประเมิน DQ อีกครั้ง' : 'เริ่มทำ DQ Check (24 ข้อ)'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Badges & Gamification */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700/80 transition-all">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">เหรียญรางวัล & ระดับ</span>
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" />
                {unlockedBadgesCount} / {badges.length}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <p className="text-xs text-slate-400">ระดับปัจจุบัน</p>
                <p className="text-sm font-bold text-white">Level {stats.level}: {stats.levelName}</p>
                <p className="text-xs text-amber-400/90 font-mono mt-0.5">{stats.xp} XP สะสม</p>
              </div>
            </div>

            {/* Quick mini badge list */}
            <div className="mt-4 flex items-center gap-1.5 overflow-x-auto py-1">
              {badges.slice(0, 5).map((b) => (
                <div
                  key={b.id}
                  title={`${b.name}: ${b.description}`}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-transform ${
                    b.unlocked
                      ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 shadow-sm'
                      : 'bg-slate-800/40 border border-slate-800 text-slate-600'
                  }`}
                >
                  <Award className="w-4 h-4" />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('profile')}
            className="mt-5 w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 hover:text-white rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <span>ดูโปรไฟล์และความสำเร็จ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </section>

      {/* 8 Skills Overview Bento Preview */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">ความรู้ 8 ทักษะความฉลาดทางดิจิทัล</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              กรอบแนวคิดมาตรฐานสากลเพื่อการดำเนินชีวิตอย่างปลอดภัย รับผิดชอบ และมีจริยธรรม
            </p>
          </div>
          <button
            onClick={() => setActiveTab('learn')}
            className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
          >
            <span>ดูทั้งหมด 8 ทักษะ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DQ_SKILLS.map((skill) => {
            const isCompleted = stats.completedLessons.includes(skill.id);
            return (
              <div
                key={skill.id}
                onClick={() => {
                  setSelectedSkillId(skill.id);
                  setActiveTab('learn');
                }}
                className="group relative cursor-pointer bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-sky-700/60 rounded-2xl p-5 transition-all duration-200 hover:shadow-lg hover:shadow-sky-950/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-slate-500 group-hover:text-sky-400 transition-colors">
                      {String(skill.orderNumber).padStart(2, '0')}.
                    </span>
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>เรียนจบแล้ว</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500">บทเรียน</span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors leading-snug">
                    {skill.titleTh}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    {skill.titleEn}
                  </p>
                  <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                    {skill.shortDesc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-sky-400 group-hover:text-sky-300 font-medium">
                  <span>เข้าเรียนบทเรียนนี้</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Official Academic Source Attribution (SciMath / IPST) */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-sky-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-sky-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">แหล่งข้อมูลอ้างอิงหลักทางวิชาการ</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {SCIMATH_SOURCE.organization}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              บทความ: <span className="font-semibold text-white">“{SCIMATH_SOURCE.articleTitle}”</span>
              <span className="mx-2 text-slate-500">·</span>
              ผู้เขียน: <span className="text-sky-300 font-medium">{SCIMATH_SOURCE.author}</span>
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
              แอปพลิเคชัน DQ SMART LIFE พัฒนาขึ้นโดยนำกรอบ 8 ทักษะความฉลาดทางดิจิทัลจากคลังความรู้ SciMath มาออกแบบเป็นสื่อการเรียนรู้เชิงปฏิสัมพันธ์ (Interactive Learning) เพื่อประโยชน์ต่อเยาวชนไทย
            </p>
          </div>

          <a
            href={SCIMATH_SOURCE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-950/80 hover:bg-sky-900/80 text-sky-300 hover:text-white border border-sky-800/60 text-xs font-semibold transition-all hover:scale-105 shrink-0"
          >
            <span>อ่านบทความต้นฉบับบน SciMath</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

    </div>
  );
};
