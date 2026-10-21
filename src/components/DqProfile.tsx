import React, { useState, useEffect } from 'react';
import { useDq } from '../context/DqContext';
import { DQ_SKILLS } from '../data/dqSkills';
import { LEVELS, getLevelFromXp } from '../data/badges';
import { 
  User, 
  Award, 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  Printer, 
  Star, 
  Lock,
  Edit3,
  School,
  IdCard,
  Check,
  X,
  FileCheck2,
  ShieldCheck
} from 'lucide-react';

export const DqProfile: React.FC = () => {
  const { stats, badges, resetProgress, setActiveTab, updateUserProfile } = useDq();
  const [showCertificate, setShowCertificate] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);

  // Form states for user profile / certificate
  const [userNameInput, setUserNameInput] = useState(stats.userName || '');
  const [institutionInput, setInstitutionInput] = useState(stats.institutionName || '');
  const [studentIdInput, setStudentIdInput] = useState(stats.studentId || '');

  // Synchronize when stats update
  useEffect(() => {
    setUserNameInput(stats.userName || '');
    setInstitutionInput(stats.institutionName || '');
    setStudentIdInput(stats.studentId || '');
  }, [stats.userName, stats.institutionName, stats.studentId]);

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

  // Handle saving profile from profile header modal or certificate inline
  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateUserProfile(userNameInput, institutionInput, studentIdInput);
    setShowEditUserModal(false);
  };

  const handlePrint = () => {
    // If the user modified the inputs on the certificate dialog, auto-save them
    if (userNameInput.trim() !== (stats.userName || '') || institutionInput.trim() !== (stats.institutionName || '')) {
      updateUserProfile(userNameInput, institutionInput, studentIdInput);
    }
    window.print();
  };

  // Generate deterministic serial code for the certificate
  const certSeed = (userNameInput || stats.userName || 'DQMEMBER').split('').reduce((acc, char) => acc + char.charCodeAt(0), 1024);
  const certNumber = `DQ-SL-2026-${String(certSeed % 100000).padStart(5, '0')}`;
  const thaiDateString = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-200">
      
      {/* Profile Card Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/50 border border-slate-800 p-6 sm:p-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          
          {/* Avatar Shield */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-sky-950 text-3xl font-extrabold">
              {stats.userName ? stats.userName.slice(0, 2).toUpperCase() : 'DQ'}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-amber-500 border-2 border-slate-900 flex items-center justify-center text-slate-950 text-xs font-black shadow">
              {stats.level}
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-xs text-sky-400 font-mono font-semibold">
                  DIGITAL CITIZEN PROFILE
                </span>
                {stats.userName ? (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800 font-medium">
                    เชื่อมต่อชื่อผู้เรียนแล้ว
                  </span>
                ) : (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800 font-medium">
                    ยังไม่ได้ระบุชื่อ-นามสกุล
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {stats.userName || 'ผู้เรียนรู้ DQ SMART LIFE'}
                </h1>
                <button
                  onClick={() => setShowEditUserModal(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white border border-slate-700 transition-colors"
                  title="แก้ไขชื่อ-สถาบันของผู้เรียน"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{stats.userName ? 'แก้ไขชื่อ / บัญชี' : 'กรอกชื่อผู้เรียน'}</span>
                </button>
              </div>

              {stats.institutionName && (
                <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1 mt-1">
                  <School className="w-3.5 h-3.5 text-sky-400" />
                  <span>{stats.institutionName}</span>
                  {stats.studentId && <span>· รหัส {stats.studentId}</span>}
                </p>
              )}

              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
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
                onClick={() => {
                  setUserNameInput(stats.userName || '');
                  setInstitutionInput(stats.institutionName || '');
                  setStudentIdInput(stats.studentId || '');
                  setShowCertificate(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-sky-600/25 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Award className="w-4 h-4" />
                <span>พิมพ์ / ขอรับเกียรติบัตรการเรียน</span>
              </button>

              <button
                onClick={() => setShowEditUserModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 rounded-xl text-xs font-medium transition-colors"
              >
                <User className="w-3.5 h-3.5 text-sky-400" />
                <span>ข้อมูลผู้ขอรับเกียรติบัตร</span>
              </button>

              <button
                onClick={resetProgress}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900/60 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-800 rounded-xl text-xs font-medium transition-colors"
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

      {/* Edit User Modal */}
      {showEditUserModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-bold text-white">ข้อมูลผู้เรียน / ผู้ขอรับเกียรติบัตร</h3>
              </div>
              <button
                onClick={() => setShowEditUserModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  ชื่อ-นามสกุล (สำหรับพิมพ์บนเกียรติบัตร) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น นายสมชาย ใจดี / น.ส.วิภาดา รักเรียน"
                  value={userNameInput}
                  onChange={(e) => setUserNameInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  สถานศึกษา / โรงเรียน / มหาวิทยาลัย (ไม่บังคับ)
                </label>
                <input
                  type="text"
                  placeholder="เช่น โรงเรียนสามเสนวิทยาลัย / จุฬาลงกรณ์มหาวิทยาลัย"
                  value={institutionInput}
                  onChange={(e) => setInstitutionInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  รหัสนักเรียน / รหัสนักศึกษา (ไม่บังคับ)
                </label>
                <input
                  type="text"
                  placeholder="เช่น 660123456"
                  value={studentIdInput}
                  onChange={(e) => setStudentIdInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors text-sm"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowEditUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold shadow-md transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>บันทึกข้อมูล</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Modal with Live Name Input & Professional Print Styling */}
      {showCertificate && (
        <div className="certificate-modal-overlay fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="certificate-modal-box bg-slate-950 border border-slate-800 max-w-4xl w-full rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 my-auto animate-in zoom-in-95 duration-200">
            
            {/* Header / Interactive Name Input Controls (Hidden during printing via no-print class) */}
            <div className="no-print bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                  <FileCheck2 className="w-5 h-5 text-sky-400" />
                  <span>กำหนดชื่อและรายละเอียดสำหรับพิมพ์บนเกียรติบัตร</span>
                </div>
                <span className="text-[11px] text-slate-400">
                  แก้ไขแล้วแสดงผลบนเกียรติบัตรด้านล่างแบบ Real-time
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    ชื่อ-นามสกุล ผู้ขอรับเกียรติบัตร:
                  </label>
                  <input
                    type="text"
                    value={userNameInput}
                    onChange={(e) => setUserNameInput(e.target.value)}
                    placeholder="กรอกชื่อ-นามสกุล เช่น นายสมชาย ใจดี"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    สถานศึกษา / โรงเรียน / มหาวิทยาลัย (ถ้ามี):
                  </label>
                  <input
                    type="text"
                    value={institutionInput}
                    onChange={(e) => setInstitutionInput(e.target.value)}
                    placeholder="เช่น โรงเรียน... / มหาวิทยาลัย..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => updateUserProfile(userNameInput, institutionInput, studentIdInput)}
                  className="text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 hover:underline"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>บันทึกชื่อนี้เชื่อมต่อไว้ในบัญชีของคุณถาวร</span>
                </button>

                <span className="text-slate-500">
                  * เมื่อกดพิมพ์ ระบบจะเลือกหน้าเกียรติบัตรขนาด A4 พอดี
                </span>
              </div>
            </div>

            {/* Official Certificate Canvas (Styled for Screen and Crisp Printing) */}
            <div 
              id="print-area" 
              className="relative p-6 sm:p-10 border-4 sm:border-8 border-double border-sky-600/60 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950 text-center space-y-4 shadow-2xl overflow-hidden"
            >
              {/* Decorative Corner Ornaments */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-sky-400/80" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-sky-400/80" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-sky-400/80" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-sky-400/80" />

              {/* Logo & Emblem */}
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
                  DQ
                </div>
                <div className="text-left">
                  <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest cert-blue-text text-sky-400 block uppercase leading-tight">
                    DQ SMART LIFE · DIGITAL INTELLIGENCE EDUCATION
                  </span>
                  <span className="text-[9px] sm:text-[11px] cert-muted-text text-slate-400 block leading-tight">
                    สถาบันส่งเสริมการสอนวิทยาศาสตร์และเทคโนโลยี (สสวท.)
                  </span>
                </div>
              </div>

              {/* Certificate Title */}
              <div className="py-1">
                <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-wide font-sans">
                  เกียรติบัตรการเรียนรู้ความฉลาดทางดิจิทัล
                </h2>
                <span className="text-[11px] sm:text-xs cert-blue-text text-sky-400 font-mono tracking-wider uppercase block mt-1">
                  Certificate of Digital Intelligence Competency
                </span>
              </div>

              <p className="text-xs sm:text-sm cert-muted-text text-slate-300">
                เกียรติบัตรฉบับนี้ให้ไว้เพื่อแสดงว่า
              </p>

              {/* Recipient Name - Big & Elegant */}
              <div className="py-2">
                <p className="text-2xl sm:text-4xl font-extrabold cert-gold-text text-amber-300 tracking-tight leading-tight">
                  {userNameInput.trim() || stats.userName || 'ผู้เรียนรู้ DQ SMART LIFE'}
                </p>
                {institutionInput.trim() && (
                  <p className="text-xs sm:text-sm cert-muted-text text-slate-300 font-medium mt-1">
                    สังกัด / สถานศึกษา: {institutionInput.trim()}
                    {studentIdInput.trim() && ` (รหัสประจำตัว: ${studentIdInput.trim()})`}
                  </p>
                )}
                <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-2" />
              </div>

              {/* Achievement Text */}
              <p className="text-xs sm:text-sm cert-muted-text text-slate-300 max-w-2xl mx-auto leading-relaxed">
                ได้ผ่านการศึกษาบทเรียน ฝึกทักษะสถานการณ์จำลอง และประเมินสมรรถนะความฉลาดทางดิจิทัล (DQ) ครบทั้ง 8 ทักษะ
                ตามกรอบแนวคิดของสถาบันส่งเสริมการสอนวิทยาศาสตร์และเทคโนโลยี (สสวท.)
              </p>

              {/* Evaluation Highlights Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-2xl mx-auto p-3 rounded-2xl bg-slate-900/70 border border-slate-800 text-left">
                <div className="p-2 border-r border-slate-800/80">
                  <span className="text-[10px] cert-muted-text text-slate-400 block">ระดับความฉลาด</span>
                  <span className="text-xs font-bold cert-gold-text text-amber-300 block truncate">
                    {stats.dqCheckResult?.levelName || stats.levelName}
                  </span>
                </div>
                <div className="p-2 border-r border-slate-800/80">
                  <span className="text-[10px] cert-muted-text text-slate-400 block">คะแนน DQ รวม</span>
                  <span className="text-xs font-bold cert-blue-text text-sky-400 block font-mono">
                    {stats.dqCheckResult ? `${stats.dqCheckResult.overallScore}%` : 'ผ่านการประเมิน'}
                  </span>
                </div>
                <div className="p-2 border-r border-slate-800/80">
                  <span className="text-[10px] cert-muted-text text-slate-400 block">บทเรียนที่จบ</span>
                  <span className="text-xs font-bold text-white block font-mono">
                    {completedLessonsCount} / 8 ทักษะ
                  </span>
                </div>
                <div className="p-2">
                  <span className="text-[10px] cert-muted-text text-slate-400 block">สถานการณ์ที่ผ่าน</span>
                  <span className="text-xs font-bold text-emerald-400 block font-mono">
                    {scenariosCorrectCount} ข้อ
                  </span>
                </div>
              </div>

              {/* Signatures & Seal Footer */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 items-center gap-4 text-xs">
                
                {/* Left signature */}
                <div className="text-center sm:text-left space-y-1">
                  <div className="w-28 border-b border-slate-600 mx-auto sm:mx-0 pb-1 font-serif text-slate-400 italic text-[11px]">
                    คณะทำงานนวัตกรรม DQ
                  </div>
                  <p className="text-[10px] cert-muted-text text-slate-400">
                    คณะผู้พัฒนานวัตกรรมสื่อการเรียนรู้
                  </p>
                  <p className="text-[9px] cert-muted-text text-slate-500 font-mono">
                    แอปพลิเคชัน DQ SMART LIFE
                  </p>
                </div>

                {/* Center Seal */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-full border-2 border-amber-400/80 flex flex-col items-center justify-center text-amber-400 shadow-md p-1 text-center">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                    <span className="text-[7px] font-bold font-mono tracking-tighter uppercase leading-none mt-0.5">
                      VERIFIED DQ
                    </span>
                  </div>
                  <span className="text-[9px] font-mono cert-muted-text text-slate-500 mt-1">
                    เลขที่: {certNumber}
                  </span>
                </div>

                {/* Right signature */}
                <div className="text-center sm:text-right space-y-1">
                  <p className="text-[11px] font-semibold text-white">
                    วันที่ออกเกียรติบัตร: {thaiDateString}
                  </p>
                  <p className="text-[10px] cert-muted-text text-slate-400">
                    อ้างอิงบทความ: ฉัตรพงศ์ ชูแสงนิล
                  </p>
                  <p className="text-[9px] cert-muted-text text-slate-500">
                    คลังความรู้ SciMath สสวท.
                  </p>
                </div>

              </div>

            </div>

            {/* Modal Action Buttons (Hidden during printing via no-print class) */}
            <div className="no-print flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-400">
                คุณสามารถบันทึกเป็นไฟล์ PDF ผ่านตัวเลือก Print &gt; Save as PDF ในเบราว์เซอร์
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowCertificate(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl font-medium transition-colors"
                >
                  ปิดหน้าต่าง
                </button>

                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-sky-600/30 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  <span>พิมพ์ / บันทึกเป็น PDF</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
